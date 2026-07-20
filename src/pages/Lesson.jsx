import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Code2,
  ExternalLink,
  FileText,
  GraduationCap,
  Lightbulb,
  ListChecks,
  LoaderCircle,
  PlayCircle,
  Search,
  Sparkles,
} from "lucide-react";

import {
  getCurrentUserId,
  getLessonById,
  getLessonProgress,
  updateLessonProgress,
} from "../services/courseService";

function Lesson() {
  const {
    courseId,
    lessonId,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    lesson,
    setLesson,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    savingProgress,
    setSavingProgress,
  ] = useState(false);

  const [
    isCompleted,
    setIsCompleted,
  ] = useState(false);

  const [
    courseProgress,
    setCourseProgress,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  /*
    Logged-in user ID is read from the current
    authentication data stored in localStorage.
  */

  const userId =
    getCurrentUserId();

  const validCourseId =
    Number(courseId);

  const validLessonId =
    Number(lessonId);


  useEffect(() => {
    const loadLesson =
      async () => {
        if (
          !Number.isInteger(
            validCourseId
          ) ||
          validCourseId <= 0
        ) {
          setError(
            "A valid course ID is required."
          );

          setLoading(false);

          return;
        }

        if (
          !Number.isInteger(
            validLessonId
          ) ||
          validLessonId <= 0
        ) {
          setError(
            "A valid lesson ID is required."
          );

          setLoading(false);

          return;
        }

        if (!userId) {
          setError(
            "Your login session is invalid. Please log in again."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError("");

          const [
            lessonResponse,
            progressResponse,
          ] =
            await Promise.all([
              getLessonById(
                validLessonId,
                userId
              ),

              getLessonProgress({
                lessonId:
                  validLessonId,
                userId,
              }),
            ]);

          const loadedLesson =
            lessonResponse.lesson ||
            lessonResponse.data
              ?.lesson ||
            lessonResponse.data;

          if (!loadedLesson) {
            throw new Error(
              "Lesson data was not returned."
            );
          }

          setLesson(
            loadedLesson
          );

          setIsCompleted(
            Boolean(
              progressResponse
                .isCompleted ??
                progressResponse
                  .is_completed ??
                progressResponse
                  .data
                  ?.isCompleted ??
                progressResponse
                  .data
                  ?.is_completed
            )
          );
        } catch (
          requestError
        ) {
          console.error(
            "Load lesson error:",
            requestError
          );

          setError(
            requestError.response
              ?.data?.message ||
              requestError.message ||
              "Failed to load this lesson."
          );
        } finally {
          setLoading(false);
        }
      };

    loadLesson();
  }, [
    validCourseId,
    validLessonId,
    userId,
  ]);


  const youtubeEmbedUrl =
    useMemo(() => {
      if (!lesson) {
        return "";
      }

      if (
        lesson.youtube_video_id
      ) {
        return `https://www.youtube.com/embed/${lesson.youtube_video_id}`;
      }

      if (
        lesson.youtube_video_url
      ) {
        try {
          const url =
            new URL(
              lesson.youtube_video_url
            );

          const videoId =
            url.searchParams.get(
              "v"
            );

          if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
          }

          if (
            url.hostname ===
            "youtu.be"
          ) {
            const shortVideoId =
              url.pathname.replace(
                "/",
                ""
              );

            if (
              shortVideoId
            ) {
              return `https://www.youtube.com/embed/${shortVideoId}`;
            }
          }
        } catch {
          return "";
        }
      }

      return "";
    }, [lesson]);


  const youtubeSearchUrl =
    useMemo(() => {
      const searchQuery =
        lesson
          ?.youtube_search_query ||
        lesson?.title ||
        "";

      return `https://www.youtube.com/results?search_query=${encodeURIComponent(
        searchQuery
      )}`;
    }, [lesson]);


  const handleProgressChange =
    async () => {
      if (
        !userId ||
        !validCourseId ||
        !validLessonId
      ) {
        setError(
          "Unable to update lesson progress."
        );

        return;
      }

      try {
        setSavingProgress(
          true
        );

        setError("");

        const nextCompletedState =
          !isCompleted;

        const response =
          await updateLessonProgress(
            {
              lessonId:
                validLessonId,

              courseId:
                validCourseId,

              userId,

              isCompleted:
                nextCompletedState,
            }
          );

        setIsCompleted(
          nextCompletedState
        );

        setCourseProgress(
          response.courseProgress ||
            response.data
              ?.courseProgress ||
            null
        );
      } catch (
        requestError
      ) {
        console.error(
          "Progress update error:",
          requestError
        );

        setError(
          requestError.response
            ?.data?.message ||
            requestError.message ||
            "Failed to save lesson progress."
        );
      } finally {
        setSavingProgress(
          false
        );
      }
    };


  const goToLesson = (
    targetLesson
  ) => {
    if (
      !targetLesson?.id
    ) {
      return;
    }

    navigate(
      `/lessons/${validCourseId}/${targetLesson.id}`
    );
  };


  const handleNextLesson =
    async () => {
      /*
        Next lesson वर जाण्यापूर्वी current lesson
        complete नसल्यास automatically complete करतो.
      */

      if (!isCompleted) {
        try {
          setSavingProgress(
            true
          );

          await updateLessonProgress(
            {
              lessonId:
                validLessonId,

              courseId:
                validCourseId,

              userId,

              isCompleted:
                true,
            }
          );

          setIsCompleted(
            true
          );
        } catch (
          requestError
        ) {
          console.error(
            "Auto-complete error:",
            requestError
          );

          setError(
            requestError.response
              ?.data?.message ||
              requestError.message ||
              "Could not complete the lesson."
          );

          setSavingProgress(
            false
          );

          return;
        } finally {
          setSavingProgress(
            false
          );
        }
      }

      if (
        lesson?.nextLesson
      ) {
        goToLesson(
          lesson.nextLesson
        );

        return;
      }

      navigate(
        `/courses/${validCourseId}`
      );
    };


  if (loading) {
    return (
      <main className="dynamic-lesson-state">
        <LoaderCircle
          size={44}
          className="spin-icon"
        />

        <h2>
          Loading lesson...
        </h2>

        <p>
          Preparing your learning
          content.
        </p>
      </main>
    );
  }


  if (
    error &&
    !lesson
  ) {
    return (
      <main className="dynamic-lesson-state">
        <h2>
          Lesson could not be
          loaded
        </h2>

        <p>
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/lessons"
            )
          }
        >
          Return to lessons
        </button>
      </main>
    );
  }


  return (
    <main className="dynamic-lesson-page">
      <header className="dynamic-lesson-topbar">
        <button
          type="button"
          className="lesson-course-back"
          onClick={() =>
            navigate(
              `/courses/${validCourseId}`
            )
          }
        >
          <ArrowLeft
            size={19}
          />

          Back to course
        </button>

        <div className="lesson-topbar-progress">
          <span>
            Lesson{" "}
            {
              lesson.lessonPosition
            }{" "}
            of{" "}
            {
              lesson.totalCourseLessons
            }
          </span>

          <div className="lesson-top-progress-track">
            <span
              style={{
                width: `${
                  lesson.totalCourseLessons >
                  0
                    ? (lesson.lessonPosition /
                        lesson.totalCourseLessons) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </header>

      <section className="dynamic-lesson-hero">
        <div className="lesson-hero-main">
          <span className="lesson-module-label">
            <Sparkles
              size={15}
            />

            Module{" "}
            {
              lesson.module_order
            }
            :{" "}
            {
              lesson.module_title
            }
          </span>

          <h1>
            {lesson.title}
          </h1>

          <p>
            {
              lesson.description
            }
          </p>

          <div className="lesson-meta-row">
            <span>
              <Clock3
                size={16}
              />

              {lesson.duration_minutes ||
                10}{" "}
              minutes
            </span>

            <span>
              <BookOpen
                size={16}
              />

              {
                lesson.lesson_type
              }
            </span>

            <span>
              <GraduationCap
                size={16}
              />

              {
                lesson.course_level
              }
            </span>
          </div>
        </div>

        <button
          type="button"
          className={`lesson-complete-button ${
            isCompleted
              ? "completed"
              : ""
          }`}
          disabled={
            savingProgress
          }
          onClick={
            handleProgressChange
          }
        >
          {savingProgress ? (
            <LoaderCircle
              size={19}
              className="spin-icon"
            />
          ) : isCompleted ? (
            <CheckCircle2
              size={19}
            />
          ) : (
            <Check
              size={19}
            />
          )}

          {isCompleted
            ? "Completed"
            : "Mark as completed"}
        </button>
      </section>

      {error && (
        <div className="dynamic-lesson-error">
          {error}
        </div>
      )}

      {courseProgress && (
        <div className="lesson-progress-message">
          Course progress updated
          to{" "}
          <strong>
            {
              courseProgress.percentage
            }
            %
          </strong>
        </div>
      )}

      <section className="dynamic-lesson-layout">
        <div className="dynamic-lesson-main">
          <article className="lesson-video-card">
            <div className="lesson-section-title">
              <div>
                <PlayCircle
                  size={21}
                />

                <h2>
                  Video lesson
                </h2>
              </div>
            </div>

            {youtubeEmbedUrl ? (
              <div className="lesson-video-frame">
                <iframe
                  src={
                    youtubeEmbedUrl
                  }
                  title={
                    lesson.title
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="lesson-video-fallback">
                <div className="video-fallback-icon">
                  <PlayCircle
                    size={48}
                  />
                </div>

                <h3>
                  Video will be
                  available soon
                </h3>

                <p>
                  Search YouTube for a
                  supporting tutorial
                  related to this
                  lesson.
                </p>

                <a
                  href={
                    youtubeSearchUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <Search
                    size={18}
                  />

                  Search tutorial on
                  YouTube

                  <ExternalLink
                    size={16}
                  />
                </a>
              </div>
            )}
          </article>

          <article className="lesson-content-card">
            <div className="lesson-section-title">
              <div>
                <FileText
                  size={21}
                />

                <h2>
                  Lesson content
                </h2>
              </div>
            </div>

            <div className="lesson-reading-content">
              {lesson.content
                ?.split("\n")
                .filter(Boolean)
                .map(
                  (
                    paragraph,
                    index
                  ) => (
                    <p key={index}>
                      {
                        paragraph
                      }
                    </p>
                  )
                )}
            </div>
          </article>

          {lesson.code_example && (
            <article className="lesson-code-card">
              <div className="lesson-section-title">
                <div>
                  <Code2
                    size={21}
                  />

                  <h2>
                    Code example
                  </h2>
                </div>

                <span>
                  {lesson.code_language ||
                    "code"}
                </span>
              </div>

              <pre>
                <code>
                  {
                    lesson.code_example
                  }
                </code>
              </pre>
            </article>
          )}

          {lesson.practice_task && (
            <article className="lesson-practice-card">
              <div className="lesson-practice-icon">
                <ListChecks
                  size={25}
                />
              </div>

              <div>
                <span>
                  Practice task
                </span>

                <h2>
                  Try it yourself
                </h2>

                <p>
                  {
                    lesson.practice_task
                  }
                </p>
              </div>
            </article>
          )}

          {lesson.summary && (
            <article className="lesson-summary-card">
              <div className="lesson-summary-heading">
                <Lightbulb
                  size={23}
                />

                <div>
                  <span>
                    AI Summary
                  </span>

                  <h2>
                    Key takeaway
                  </h2>
                </div>
              </div>

              <p>
                {lesson.summary}
              </p>
            </article>
          )}

          <div className="lesson-navigation-card">
            <button
              type="button"
              disabled={
                !lesson.previousLesson
              }
              onClick={() =>
                goToLesson(
                  lesson.previousLesson
                )
              }
            >
              <ChevronLeft
                size={19}
              />

              <span>
                <small>
                  Previous lesson
                </small>

                <strong>
                  {lesson
                    .previousLesson
                    ?.title ||
                    "No previous lesson"}
                </strong>
              </span>
            </button>

            <button
              type="button"
              className="next-lesson-button"
              disabled={
                savingProgress
              }
              onClick={
                handleNextLesson
              }
            >
              <span>
                <small>
                  {lesson.nextLesson
                    ? "Next lesson"
                    : "Course curriculum"}
                </small>

                <strong>
                  {lesson.nextLesson
                    ?.title ||
                    "Return to course"}
                </strong>
              </span>

              <ArrowRight
                size={19}
              />
            </button>
          </div>
        </div>

        <aside className="dynamic-lesson-sidebar">
          <div className="lesson-sidebar-card">
            <span className="lesson-sidebar-label">
              Current course
            </span>

            <h3>
              {
                lesson.course_title
              }
            </h3>

            <div className="lesson-sidebar-stat">
              <BookOpen
                size={18}
              />

              <div>
                <strong>
                  {
                    lesson.lessonPosition
                  }
                  /
                  {
                    lesson.totalCourseLessons
                  }
                </strong>

                <span>
                  Current lesson
                </span>
              </div>
            </div>

            <div className="lesson-sidebar-stat">
              <Clock3
                size={18}
              />

              <div>
                <strong>
                  {lesson.duration_minutes ||
                    10}{" "}
                  minutes
                </strong>

                <span>
                  Lesson duration
                </span>
              </div>
            </div>
          </div>

          <div className="lesson-sidebar-card">
            <span className="lesson-sidebar-label">
              Learning tip
            </span>

            <p>
              Read the lesson,
              practice the code
              example and complete
              the task before moving
              to the next lesson.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Lesson;