import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Code2,
  FileText,
  GraduationCap,
  Languages,
  Layers3,
  LoaderCircle,
  Play,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCurrentUserId,
  getMyLessons,
} from "../services/courseService";


const extractLessons = (
  response
) => {
  if (
    Array.isArray(response)
  ) {
    return response;
  }

  if (
    Array.isArray(
      response?.lessons
    )
  ) {
    return response.lessons;
  }

  if (
    Array.isArray(
      response?.data
    )
  ) {
    return response.data;
  }

  if (
    Array.isArray(
      response?.data?.lessons
    )
  ) {
    return response.data.lessons;
  }

  return [];
};


const normalizeLesson = (
  lesson
) => ({
  id:
    Number(
      lesson.id ||
        lesson.lessonId ||
        lesson.lesson_id
    ) || 0,

  courseId:
    Number(
      lesson.courseId ||
        lesson.course_id
    ) || 0,

  moduleId:
    Number(
      lesson.moduleId ||
        lesson.module_id
    ) || 0,

  title:
    lesson.title ||
    "Untitled Lesson",

  description:
    lesson.description ||
    "Learn this lesson as part of your generated course.",

  courseTitle:
    lesson.courseTitle ||
    lesson.course_title ||
    "Generated Course",

  courseDescription:
    lesson.courseDescription ||
    lesson.course_description ||
    "",

  courseCategory:
    lesson.courseCategory ||
    lesson.course_category ||
    "AI Generated Course",

  moduleTitle:
    lesson.moduleTitle ||
    lesson.module_title ||
    "Course Module",

  courseLevel:
    lesson.courseLevel ||
    lesson.course_level ||
    lesson.level ||
    "Beginner",

  courseLanguage:
    lesson.courseLanguage ||
    lesson.course_language ||
    lesson.language ||
    "English",

  lessonType:
    lesson.lessonType ||
    lesson.lesson_type ||
    "video",

  durationMinutes:
    Number(
      lesson.durationMinutes ||
        lesson.duration_minutes
    ) || 10,

  lessonOrder:
    Number(
      lesson.lessonOrder ||
        lesson.lesson_order
    ) || 1,

  moduleOrder:
    Number(
      lesson.moduleOrder ||
        lesson.module_order
    ) || 1,

  totalCourseLessons:
    Number(
      lesson.totalCourseLessons ||
        lesson.total_course_lessons ||
        lesson.total_lessons
    ) || 0,

  isCompleted:
    Boolean(
      Number(
        lesson.isCompleted ??
          lesson.is_completed ??
          0
      )
    ),

  createdAt:
    lesson.createdAt ||
    lesson.created_at ||
    null,
});


const getLessonIcon = (
  lessonType
) => {
  const normalizedType =
    String(
      lessonType || ""
    ).toLowerCase();

  if (
    normalizedType === "code"
  ) {
    return Code2;
  }

  if (
    normalizedType ===
      "article" ||
    normalizedType ===
      "project"
  ) {
    return FileText;
  }

  return Play;
};


function Lessons() {
  const navigate =
    useNavigate();

  const {
    courseId: routeCourseId,
  } = useParams();

  const [
    lessons,
    setLessons,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    expandedCourses,
    setExpandedCourses,
  ] = useState({});


  const loadLessons =
    useCallback(
      async () => {
        const userId =
          getCurrentUserId();

        if (!userId) {
          setLessons([]);

          setError(
            "Your login session is invalid. Please log in again."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await getMyLessons({
              userId,

              courseId:
                routeCourseId,
            });

          const fetchedLessons =
            extractLessons(
              response
            );

          const normalizedLessons =
            fetchedLessons
              .map(
                normalizeLesson
              )
              .filter(
                (lesson) =>
                  lesson.id > 0 &&
                  lesson.courseId > 0
              )
              .sort(
                (
                  firstLesson,
                  secondLesson
                ) => {
                  if (
                    firstLesson.courseId !==
                    secondLesson.courseId
                  ) {
                    return (
                      firstLesson.courseId -
                      secondLesson.courseId
                    );
                  }

                  if (
                    firstLesson.moduleOrder !==
                    secondLesson.moduleOrder
                  ) {
                    return (
                      firstLesson.moduleOrder -
                      secondLesson.moduleOrder
                    );
                  }

                  return (
                    firstLesson.lessonOrder -
                    secondLesson.lessonOrder
                  );
                }
              );

          setLessons(
            normalizedLessons
          );

          const initialExpandedState =
            normalizedLessons.reduce(
              (
                result,
                lesson
              ) => {
                result[
                  lesson.courseId
                ] = true;

                return result;
              },
              {}
            );

          setExpandedCourses(
            initialExpandedState
          );
        } catch (
          requestError
        ) {
          console.error(
            "Load lessons error:",
            requestError
          );

          setLessons([]);

          setError(
            requestError.response
              ?.data?.message ||
              requestError.message ||
              "Failed to load your lessons."
          );
        } finally {
          setLoading(false);
        }
      },
      [routeCourseId]
    );


  useEffect(() => {
    loadLessons();
  }, [loadLessons]);


  const filteredLessons =
    useMemo(() => {
      const normalizedSearch =
        searchText
          .trim()
          .toLowerCase();

      return lessons.filter(
        (lesson) => {
          const matchesSearch =
            !normalizedSearch ||
            lesson.title
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            lesson.courseTitle
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            lesson.moduleTitle
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            lesson.courseCategory
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesStatus =
            statusFilter ===
              "All" ||
            (statusFilter ===
              "Completed" &&
              lesson.isCompleted) ||
            (statusFilter ===
              "Not Started" &&
              !lesson.isCompleted);

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      lessons,
      searchText,
      statusFilter,
    ]);


  const groupedCourses =
    useMemo(() => {
      const courseMap =
        filteredLessons.reduce(
          (
            result,
            lesson
          ) => {
            if (
              !result[
                lesson.courseId
              ]
            ) {
              result[
                lesson.courseId
              ] = {
                courseId:
                  lesson.courseId,

                courseTitle:
                  lesson.courseTitle,

                courseDescription:
                  lesson.courseDescription,

                courseCategory:
                  lesson.courseCategory,

                courseLevel:
                  lesson.courseLevel,

                courseLanguage:
                  lesson.courseLanguage,

                lessons: [],
              };
            }

            result[
              lesson.courseId
            ].lessons.push(
              lesson
            );

            return result;
          },
          {}
        );

      return Object.values(
        courseMap
      ).map((course) => {
        const completedCount =
          course.lessons.filter(
            (lesson) =>
              lesson.isCompleted
          ).length;

        const totalDuration =
          course.lessons.reduce(
            (
              total,
              lesson
            ) =>
              total +
              lesson.durationMinutes,
            0
          );

        const progress =
          course.lessons.length >
          0
            ? Math.round(
                (completedCount /
                  course.lessons
                    .length) *
                  100
              )
            : 0;

        const moduleCount =
          new Set(
            course.lessons.map(
              (lesson) =>
                lesson.moduleId
            )
          ).size;

        return {
          ...course,

          completedCount,

          totalDuration,

          progress,

          moduleCount,
        };
      });
    }, [filteredLessons]);


  const totalLessons =
    lessons.length;

  const completedLessons =
    lessons.filter(
      (lesson) =>
        lesson.isCompleted
    ).length;

  const notStartedLessons =
    totalLessons -
    completedLessons;

  const totalMinutes =
    lessons.reduce(
      (
        total,
        lesson
      ) =>
        total +
        lesson.durationMinutes,
      0
    );

  const totalCourses =
    new Set(
      lessons.map(
        (lesson) =>
          lesson.courseId
      )
    ).size;


  const openLesson = (
    lesson
  ) => {
    navigate(
      `/lessons/${lesson.courseId}/${lesson.id}`
    );
  };


  const openCourse = (
    courseId
  ) => {
    navigate(
      `/courses/${courseId}`
    );
  };


  const toggleCourse = (
    courseId
  ) => {
    setExpandedCourses(
      (
        currentCourses
      ) => ({
        ...currentCourses,

        [courseId]:
          !currentCourses[
            courseId
          ],
      })
    );
  };


  return (
    <div className="application-page lessons-library-page">
      <header className="application-page-header">
        <div>
          <span className="application-eyebrow">
            LEARNING CONTENT
          </span>

          <h1>
            {routeCourseId
              ? "Course Lessons"
              : "My Lessons"}
          </h1>

          <p>
            Your lessons are organized
            course by course, so you can
            easily understand what to
            learn next.
          </p>
        </div>

        <button
          type="button"
          className="application-primary-button"
          onClick={() =>
            navigate(
              "/create-course"
            )
          }
        >
          <Plus size={17} />
          Create Course
        </button>
      </header>

      {error && (
        <div className="course-form-error">
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={
              loadLessons
            }
          >
            <RefreshCw
              size={15}
            />
            Retry
          </button>
        </div>
      )}

      <section className="my-course-summary-grid lessons-summary-grid">
        <article>
          <span>
            <GraduationCap
              size={20}
            />
          </span>

          <div>
            <small>
              Total courses
            </small>

            <strong>
              {totalCourses}
            </strong>
          </div>
        </article>

        <article>
          <span>
            <BookOpen
              size={20}
            />
          </span>

          <div>
            <small>
              Total lessons
            </small>

            <strong>
              {totalLessons}
            </strong>
          </div>
        </article>

        <article>
          <span>
            <CheckCircle2
              size={20}
            />
          </span>

          <div>
            <small>
              Completed
            </small>

            <strong>
              {
                completedLessons
              }
            </strong>
          </div>
        </article>

        <article>
          <span>
            <Clock3
              size={20}
            />
          </span>

          <div>
            <small>
              Learning time
            </small>

            <strong>
              {totalMinutes}m
            </strong>
          </div>
        </article>
      </section>

      <section className="course-management-toolbar">
        <div className="course-management-search">
          <Search size={17} />

          <input
            type="search"
            value={
              searchText
            }
            onChange={(
              event
            ) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder="Search lessons, courses or modules..."
          />
        </div>

        <div className="course-filter-buttons">
          {[
            "All",
            "Not Started",
            "Completed",
          ].map((item) => (
            <button
              type="button"
              key={item}
              className={
                statusFilter ===
                item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter(
                  item
                )
              }
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <section className="empty-course-state">
          <span>
            <LoaderCircle
              size={31}
              className="spin-icon"
            />
          </span>

          <h2>
            Loading your lessons
          </h2>

          <p>
            Please wait while we
            prepare your learning
            content.
          </p>
        </section>
      ) : groupedCourses.length ===
        0 ? (
        <section className="empty-course-state">
          <span>
            <BookOpen
              size={31}
            />
          </span>

          <h2>
            {lessons.length === 0
              ? "No lessons available yet"
              : "No lessons found"}
          </h2>

          <p>
            {lessons.length === 0
              ? "Generate an AI course and its lessons will automatically appear here."
              : "No lesson matches your current search or filter."}
          </p>

          {lessons.length ===
            0 && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/create-course"
                )
              }
            >
              <Plus
                size={17}
              />
              Generate Course
            </button>
          )}
        </section>
      ) : (
        <section className="lessons-course-groups">
          {groupedCourses.map(
            (course) => {
              const isExpanded =
                expandedCourses[
                  course.courseId
                ] !== false;

              return (
                <article
                  className="lessons-course-group"
                  key={
                    course.courseId
                  }
                >
                  <header className="lessons-course-group-header">
                    <div className="lessons-course-identity">
                      <span className="lessons-course-icon">
                        <GraduationCap
                          size={26}
                        />
                      </span>

                      <div>
                        <span className="lessons-course-label">
                          COURSE
                        </span>

                        <h2>
                          {
                            course.courseTitle
                          }
                        </h2>

                        {course.courseDescription && (
                          <p>
                            {
                              course.courseDescription
                            }
                          </p>
                        )}

                        <div className="lessons-course-tags">
                          <span>
                            <GraduationCap
                              size={14}
                            />

                            {
                              course.courseLevel
                            }
                          </span>

                          <span>
                            <Languages
                              size={14}
                            />

                            {
                              course.courseLanguage
                            }
                          </span>

                          <span>
                            <Layers3
                              size={14}
                            />

                            {
                              course.moduleCount
                            }{" "}
                            Modules
                          </span>

                          <span>
                            <BookOpen
                              size={14}
                            />

                            {
                              course.lessons
                                .length
                            }{" "}
                            Lessons
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="lessons-course-actions">
                      <div className="lessons-course-progress">
                        <div>
                          <span>
                            Course progress
                          </span>

                          <strong>
                            {
                              course.progress
                            }
                            %
                          </strong>
                        </div>

                        <div className="lessons-course-progress-track">
                          <span
                            style={{
                              width: `${course.progress}%`,
                            }}
                          />
                        </div>

                        <small>
                          {
                            course.completedCount
                          }{" "}
                          of{" "}
                          {
                            course.lessons
                              .length
                          }{" "}
                          lessons completed
                        </small>
                      </div>

                      <button
                        type="button"
                        className="lessons-view-course-button"
                        onClick={() =>
                          openCourse(
                            course.courseId
                          )
                        }
                      >
                        View Course
                      </button>

                      <button
                        type="button"
                        className="lessons-collapse-button"
                        onClick={() =>
                          toggleCourse(
                            course.courseId
                          )
                        }
                        aria-label={
                          isExpanded
                            ? "Hide course lessons"
                            : "Show course lessons"
                        }
                      >
                        {isExpanded ? (
                          <ChevronUp
                            size={19}
                          />
                        ) : (
                          <ChevronDown
                            size={19}
                          />
                        )}
                      </button>
                    </div>
                  </header>

                  {isExpanded && (
                    <div className="lessons-group-content">
                      <div className="lessons-group-heading">
                        <div>
                          <span>
                            COURSE CURRICULUM
                          </span>

                          <h3>
                            Lessons in{" "}
                            {
                              course.courseTitle
                            }
                          </h3>
                        </div>

                        <small>
                          <Clock3
                            size={14}
                          />

                          {
                            course.totalDuration
                          }{" "}
                          minutes total
                        </small>
                      </div>

                      <div className="lessons-course-grid">
                        {course.lessons.map(
                          (lesson) => {
                            const LessonIcon =
                              getLessonIcon(
                                lesson.lessonType
                              );

                            return (
                              <article
                                className="lesson-library-card"
                                key={
                                  lesson.id
                                }
                              >
                                <div className="lesson-library-cover">
                                  <div className="lesson-cover-top">
                                    <span className="lesson-course-name">
                                      {
                                        course.courseTitle
                                      }
                                    </span>

                                    <span className="lesson-level-pill">
                                      {
                                        lesson.courseLevel
                                      }
                                    </span>
                                  </div>

                                  <LessonIcon
                                    size={36}
                                  />

                                  <span className="lesson-number-badge">
                                    Lesson{" "}
                                    {
                                      lesson.lessonOrder
                                    }
                                  </span>
                                </div>

                                <div className="lesson-library-body">
                                  <div className="lesson-module-path">
                                    <span>
                                      Module{" "}
                                      {
                                        lesson.moduleOrder
                                      }
                                    </span>

                                    <strong>
                                      {
                                        lesson.moduleTitle
                                      }
                                    </strong>
                                  </div>

                                  <div className="lesson-title-status-row">
                                    <h3>
                                      {
                                        lesson.title
                                      }
                                    </h3>

                                    <span
                                      className={`lesson-status-pill ${
                                        lesson.isCompleted
                                          ? "completed"
                                          : "not-started"
                                      }`}
                                    >
                                      {lesson.isCompleted
                                        ? "Completed"
                                        : "Not Started"}
                                    </span>
                                  </div>

                                  <p>
                                    {
                                      lesson.description
                                    }
                                  </p>

                                  <div className="lesson-library-meta">
                                    <span>
                                      <BookOpen
                                        size={14}
                                      />

                                      {
                                        lesson.lessonType
                                      }
                                    </span>

                                    <span>
                                      <Clock3
                                        size={14}
                                      />

                                      {
                                        lesson.durationMinutes
                                      }{" "}
                                      minutes
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    className="continue-learning-btn"
                                    onClick={() =>
                                      openLesson(
                                        lesson
                                      )
                                    }
                                  >
                                    {lesson.isCompleted ? (
                                      <CheckCircle2
                                        size={16}
                                      />
                                    ) : (
                                      <Play
                                        size={16}
                                        fill="currentColor"
                                      />
                                    )}

                                    {lesson.isCompleted
                                      ? "Review Lesson"
                                      : "Start Lesson"}
                                  </button>
                                </div>
                              </article>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            }
          )}
        </section>
      )}
    </div>
  );
}

export default Lessons;