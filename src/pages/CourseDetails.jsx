import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  GraduationCap,
  Languages,
  Layers3,
  LoaderCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import {
  downloadCourseNotesPdf,
  getCourseById,
} from "../services/courseService";


function CourseDetails() {
  const {
    courseId,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    course,
    setCourse,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    openModules,
    setOpenModules,
  ] = useState({});

  const [
    downloadingPdf,
    setDownloadingPdf,
  ] = useState(false);

  const [
    pdfError,
    setPdfError,
  ] = useState("");

  const [
    pdfSuccess,
    setPdfSuccess,
  ] = useState("");


  useEffect(() => {
    const loadCourse =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getCourseById(
              courseId
            );

          setCourse(
            response.course
          );

          if (
            response.course
              ?.modules?.length
          ) {
            setOpenModules({
              [response.course
                .modules[0].id]:
                true,
            });
          }
        } catch (
          requestError
        ) {
          console.error(
            "Load course error:",
            requestError
          );

          setError(
            requestError.response
              ?.data?.message ||
              "Failed to load the course."
          );
        } finally {
          setLoading(false);
        }
      };

    loadCourse();
  }, [courseId]);


  const toggleModule = (
    moduleId
  ) => {
    setOpenModules(
      (
        currentState
      ) => ({
        ...currentState,

        [moduleId]:
          !currentState[
            moduleId
          ],
      })
    );
  };


  const startLesson = (
    moduleId,
    lessonId
  ) => {
    navigate(
      `/lessons/${courseId}/${lessonId}`,
      {
        state: {
          moduleId,
        },
      }
    );
  };


  const handleDownloadPdf =
    async () => {
      if (
        downloadingPdf
      ) {
        return;
      }

      try {
        setDownloadingPdf(
          true
        );

        setPdfError("");
        setPdfSuccess("");

        const result =
          await downloadCourseNotesPdf(
            courseId
          );

        setPdfSuccess(
          `${result.fileName} downloaded successfully.`
        );

        window.setTimeout(
          () => {
            setPdfSuccess(
              ""
            );
          },
          3500
        );
      } catch (
        requestError
      ) {
        console.error(
          "Download PDF error:",
          requestError
        );

        setPdfError(
          requestError.response
            ?.data?.message ||
            requestError.message ||
            "Failed to download course notes PDF."
        );
      } finally {
        setDownloadingPdf(
          false
        );
      }
    };


  if (loading) {
    return (
      <main className="course-details-state">
        <LoaderCircle
          size={42}
          className="spin-icon"
        />

        <h2>
          Loading your course...
        </h2>
      </main>
    );
  }


  if (
    error ||
    !course
  ) {
    return (
      <main className="course-details-state">
        <h2>
          Course could not be
          loaded
        </h2>

        <p>
          {error ||
            "Course not found."}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/create-course"
            )
          }
        >
          Create another course
        </button>
      </main>
    );
  }


  const modules =
    course.modules || [];


  return (
    <main className="generated-course-page">
      <section className="generated-course-hero">
        <div className="generated-course-top-actions">
          <button
            type="button"
            className="back-button light"
            onClick={() =>
              navigate(-1)
            }
          >
            <ArrowLeft
              size={19}
            />

            Back
          </button>

          <button
            type="button"
            className="course-pdf-download-button"
            onClick={
              handleDownloadPdf
            }
            disabled={
              downloadingPdf
            }
          >
            {downloadingPdf ? (
              <LoaderCircle
                size={18}
                className="spin-icon"
              />
            ) : (
              <Download
                size={18}
              />
            )}

            {downloadingPdf
              ? "Preparing PDF..."
              : "Download Notes PDF"}
          </button>
        </div>

        <div className="generated-course-hero-content">
          <div className="generated-course-main">
            <span className="generated-course-badge">
              <Sparkles
                size={15}
              />

              AI Generated Course
            </span>

            <h1>
              {course.title}
            </h1>

            <p>
              {
                course.description
              }
            </p>

            <div className="generated-course-meta">
              <span>
                <Layers3
                  size={17}
                />

                {
                  course.total_modules
                }{" "}
                Modules
              </span>

              <span>
                <BookOpen
                  size={17}
                />

                {
                  course.total_lessons
                }{" "}
                Lessons
              </span>

              <span>
                <GraduationCap
                  size={17}
                />

                {course.level}
              </span>

              <span>
                <Languages
                  size={17}
                />

                {
                  course.language
                }
              </span>

              <span>
                <Clock3
                  size={17}
                />

                {course.estimated_duration ||
                  "Self-paced"}
              </span>
            </div>
          </div>

          <div className="generated-course-score-card">
            <div>
              <span>
                Course progress
              </span>

              <strong>
                0%
              </strong>
            </div>

            <div className="generated-progress-track">
              <span />
            </div>

            <p>
              Start your first lesson
              to begin tracking
              progress.
            </p>
          </div>
        </div>
      </section>

      {(pdfError ||
        pdfSuccess) && (
        <section className="course-pdf-message-wrapper">
          {pdfError && (
            <div className="course-pdf-message error">
              {pdfError}
            </div>
          )}

          {pdfSuccess && (
            <div className="course-pdf-message success">
              <CheckCircle2
                size={17}
              />

              {pdfSuccess}
            </div>
          )}
        </section>
      )}

      <section className="generated-course-content">
        <div className="course-curriculum-header">
          <div>
            <span>
              Course curriculum
            </span>

            <h2>
              Your learning roadmap
            </h2>
          </div>

          <p>
            Complete every lesson
            and pass the module
            quizzes.
          </p>
        </div>

        <div className="generated-modules-list">
          {modules.map(
            (
              module,
              moduleIndex
            ) => {
              const isOpen =
                Boolean(
                  openModules[
                    module.id
                  ]
                );

              return (
                <article
                  className="generated-module-card"
                  key={
                    module.id
                  }
                >
                  <button
                    type="button"
                    className="generated-module-header"
                    onClick={() =>
                      toggleModule(
                        module.id
                      )
                    }
                  >
                    <div className="module-number">
                      {moduleIndex +
                        1}
                    </div>

                    <div className="generated-module-title">
                      <span>
                        Module{" "}
                        {moduleIndex +
                          1}
                      </span>

                      <h3>
                        {
                          module.title
                        }
                      </h3>

                      <p>
                        {
                          module.description
                        }
                      </p>
                    </div>

                    <div className="generated-module-info">
                      <span>
                        {module.lessons
                          ?.length ||
                          0}{" "}
                        lessons
                      </span>

                      {isOpen ? (
                        <ChevronDown
                          size={22}
                        />
                      ) : (
                        <ChevronRight
                          size={22}
                        />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="generated-module-body">
                      <div className="generated-lessons-list">
                        {module.lessons?.map(
                          (
                            lesson,
                            lessonIndex
                          ) => (
                            <button
                              type="button"
                              className="generated-lesson-item"
                              key={
                                lesson.id
                              }
                              onClick={() =>
                                startLesson(
                                  module.id,
                                  lesson.id
                                )
                              }
                            >
                              <div className="lesson-play-icon">
                                <PlayCircle
                                  size={20}
                                />
                              </div>

                              <div className="generated-lesson-text">
                                <span>
                                  Lesson{" "}
                                  {lessonIndex +
                                    1}
                                </span>

                                <strong>
                                  {
                                    lesson.title
                                  }
                                </strong>

                                <p>
                                  {
                                    lesson.description
                                  }
                                </p>
                              </div>

                              <div className="generated-lesson-duration">
                                <Clock3
                                  size={15}
                                />

                                {lesson.duration_minutes ||
                                  10}{" "}
                                min
                              </div>
                            </button>
                          )
                        )}
                      </div>

                      {module.quiz && (
                        <button
                          type="button"
                          className="generated-module-quiz"
                          onClick={() =>
                            navigate(
                              `/quiz/${courseId}/${module.quiz.id}`
                            )
                          }
                        >
                          <div>
                            <CheckCircle2
                              size={21}
                            />

                            <span>
                              Module Quiz
                            </span>
                          </div>

                          <strong>
                            {
                              module.quiz
                                .title
                            }
                          </strong>

                          <small>
                            {module.quiz
                              .questions
                              ?.length ||
                              0}{" "}
                            questions
                          </small>

                          <ChevronRight
                            size={20}
                          />
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            }
          )}
        </div>
      </section>
    </main>
  );
}


export default CourseDetails;