import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MoreHorizontal,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  deleteMyCourse,
  getCurrentUserId,
  getMyCourses,
} from "../services/courseService";


const normalizeCourse = (
  course,
  index
) => {
  const totalLessons = Number(
    course.totalLessons ??
      course.total_lessons ??
      course.lessonCount ??
      course.lesson_count ??
      course.lessons_count ??
      0
  );

  const completedLessons = Number(
    course.completedLessons ??
      course.completed_lessons ??
      course.completedLessonCount ??
      course.completed_lesson_count ??
      0
  );

  const backendProgress = Number(
    course.progress ??
      course.progress_percentage ??
      course.progressPercentage
  );

  const calculatedProgress =
    totalLessons > 0
      ? Math.round(
          (completedLessons /
            totalLessons) *
            100
        )
      : 0;

  const progress = Number.isFinite(
    backendProgress
  )
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            backendProgress
          )
        )
      )
    : calculatedProgress;

  let status = "Not Started";

  if (progress >= 100) {
    status = "Completed";
  } else if (progress > 0) {
    status = "In Progress";
  }

  return {
    id: Number(
      course.id ??
        course.courseId ??
        course.course_id
    ),

    title:
      course.title ||
      course.courseTitle ||
      course.course_title ||
      "Untitled Course",

    category:
      course.category ||
      course.topic ||
      course.subject ||
      "AI Generated Course",

    level:
      course.level ||
      course.difficulty ||
      course.difficulty_level ||
      "Beginner",

    language:
      course.language ||
      course.course_language ||
      "English",

    progress,

    completedLessons,

    totalLessons,

    estimatedDuration:
      course.estimatedDuration ||
      course.estimated_duration ||
      course.duration ||
      course.total_duration ||
      "Self-paced",

    status,

    iconType: "brain",

    className:
      [
        "my-course-green",
        "my-course-blue",
        "my-course-purple",
        "my-course-orange",
      ][index % 4],

    createdAt:
      course.createdAt ||
      course.created_at ||
      null,
  };
};


const extractCourses = (
  response
) => {
  if (
    Array.isArray(response)
  ) {
    return response;
  }

  if (
    Array.isArray(
      response?.courses
    )
  ) {
    return response.courses;
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
      response?.data?.courses
    )
  ) {
    return response.data.courses;
  }

  return [];
};


function MyCourses() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    courses,
    setCourses,
  ] = useState([]);

  const [
    filter,
    setFilter,
  ] = useState("All");

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    activeMenu,
    setActiveMenu,
  ] = useState(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    deletingCourseId,
    setDeletingCourseId,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");


  const loadCourses =
    useCallback(
      async () => {
        const userId =
          getCurrentUserId();

        if (!userId) {
          setCourses([]);

          setError(
            "Your login session is invalid. Please log in again."
          );

          setIsLoading(false);

          return;
        }

        try {
          setIsLoading(true);
          setError("");

          const response =
            await getMyCourses(
              userId
            );

          const fetchedCourses =
            extractCourses(
              response
            );

          const normalizedCourses =
            fetchedCourses
              .map(
                (
                  course,
                  index
                ) =>
                  normalizeCourse(
                    course,
                    index
                  )
              )
              .filter(
                (course) =>
                  Number.isInteger(
                    course.id
                  ) &&
                  course.id > 0
              );

          setCourses(
            normalizedCourses
          );
        } catch (
          requestError
        ) {
          console.error(
            "Load my courses error:",
            requestError
          );

          const message =
            requestError.response
              ?.data?.message ||
            requestError.message ||
            "Unable to load your courses.";

          setCourses([]);
          setError(message);
        } finally {
          setIsLoading(false);
        }
      },
      []
    );


  useEffect(() => {
    loadCourses();
  }, [loadCourses]);


  useEffect(() => {
    const createdCourse =
      location.state
        ?.createdCourse;

    if (!createdCourse) {
      return;
    }

    setSuccessMessage(
      `"${createdCourse}" was created successfully.`
    );

    navigate(
      location.pathname,
      {
        replace: true,
        state: {},
      }
    );

    const timer =
      window.setTimeout(
        () => {
          setSuccessMessage(
            ""
          );
        },
        3500
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    location.pathname,
    location.state,
    navigate,
  ]);


  useEffect(() => {
    const closeMenu = () => {
      setActiveMenu(null);
    };

    window.addEventListener(
      "click",
      closeMenu
    );

    return () => {
      window.removeEventListener(
        "click",
        closeMenu
      );
    };
  }, []);


  const filteredCourses =
    useMemo(() => {
      const normalizedSearch =
        searchText
          .trim()
          .toLowerCase();

      return courses.filter(
        (course) => {
          const title =
            String(
              course.title || ""
            ).toLowerCase();

          const category =
            String(
              course.category ||
                ""
            ).toLowerCase();

          const level =
            String(
              course.level || ""
            ).toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            title.includes(
              normalizedSearch
            ) ||
            category.includes(
              normalizedSearch
            ) ||
            level.includes(
              normalizedSearch
            );

          const matchesFilter =
            filter === "All" ||
            (filter ===
              "In Progress" &&
              course.progress >
                0 &&
              course.progress <
                100) ||
            (filter ===
              "Not Started" &&
              course.progress ===
                0) ||
            (filter ===
              "Completed" &&
              course.progress ===
                100);

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      courses,
      filter,
      searchText,
    ]);


  const handleDeleteCourse =
    async (
      courseId
    ) => {
      const courseToDelete =
        courses.find(
          (course) =>
            course.id ===
            courseId
        );

      if (!courseToDelete) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete "${courseToDelete.title}"? This action cannot be undone.`
        );

      if (!confirmed) {
        setActiveMenu(null);

        return;
      }

      const userId =
        getCurrentUserId();

      if (!userId) {
        setError(
          "Your login session is invalid. Please log in again."
        );

        return;
      }

      try {
        setDeletingCourseId(
          courseId
        );

        setError("");
        setActiveMenu(null);

        await deleteMyCourse({
          courseId,
          userId,
        });

        setCourses(
          (currentCourses) =>
            currentCourses.filter(
              (course) =>
                course.id !==
                courseId
            )
        );

        setSuccessMessage(
          `"${courseToDelete.title}" was deleted successfully.`
        );

        window.setTimeout(
          () => {
            setSuccessMessage(
              ""
            );
          },
          3000
        );
      } catch (
        requestError
      ) {
        console.error(
          "Delete course error:",
          requestError
        );

        const message =
          requestError.response
            ?.data?.message ||
          requestError.message ||
          "Unable to delete this course.";

        setError(message);
      } finally {
        setDeletingCourseId(
          null
        );
      }
    };


  const handleContinueLearning =
    (course) => {
      navigate(
        `/courses/${course.id}`
      );
    };


  const totalCourses =
    courses.length;

  const inProgressCourses =
    courses.filter(
      (course) =>
        course.progress > 0 &&
        course.progress < 100
    ).length;

  const completedCourses =
    courses.filter(
      (course) =>
        course.progress === 100
    ).length;

  const notStartedCourses =
    courses.filter(
      (course) =>
        course.progress === 0
    ).length;


  return (
    <div className="application-page">
      <header className="application-page-header">
        <div>
          <span className="application-eyebrow">
            LEARNING LIBRARY
          </span>

          <h1>
            My Courses
          </h1>

          <p>
            Manage your active,
            completed and
            AI-generated learning
            programs.
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
          New Course
        </button>
      </header>

      {successMessage && (
        <div className="course-created-message">
          <CheckCircle2
            size={17}
          />

          {successMessage}
        </div>
      )}

      {error && (
        <div className="course-form-error">
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={
              loadCourses
            }
          >
            <RefreshCw
              size={15}
            />
            Retry
          </button>
        </div>
      )}

      <section className="my-course-summary-grid">
        <article>
          <span>
            <BookOpen
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
            <Play size={20} />
          </span>

          <div>
            <small>
              In progress
            </small>

            <strong>
              {
                inProgressCourses
              }
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
                completedCourses
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
              Not started
            </small>

            <strong>
              {
                notStartedCourses
              }
            </strong>
          </div>
        </article>
      </section>

      <section className="course-management-toolbar">
        <div className="course-management-search">
          <Search
            size={17}
          />

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
            placeholder="Search your courses..."
          />
        </div>

        <div className="course-filter-buttons">
          {[
            "All",
            "In Progress",
            "Not Started",
            "Completed",
          ].map((item) => (
            <button
              type="button"
              key={item}
              className={
                filter === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {isLoading ? (
        <section className="empty-course-state">
          <span>
            <LoaderCircle
              size={31}
              className="spin-icon"
            />
          </span>

          <h2>
            Loading your courses
          </h2>

          <p>
            Please wait while we
            fetch your learning
            library.
          </p>
        </section>
      ) : filteredCourses.length ===
        0 ? (
        <section className="empty-course-state">
          <span>
            <BookOpen
              size={31}
            />
          </span>

          <h2>
            {courses.length === 0
              ? "No courses created yet"
              : "No courses found"}
          </h2>

          <p>
            {courses.length === 0
              ? "Create a personalized AI-powered course and begin learning."
              : "No course matches your current search or filter."}
          </p>

          {courses.length ===
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

              Create New Course
            </button>
          )}
        </section>
      ) : (
        <section className="my-course-grid">
          {filteredCourses.map(
            (course) => {
              const isDeleting =
                deletingCourseId ===
                course.id;

              return (
                <article
                  className="professional-course-card"
                  key={
                    course.id
                  }
                >
                  <div
                    className={`professional-course-cover ${
                      course.className
                    }`}
                  >
                    <BrainCircuit
                      size={34}
                    />

                    <span className="course-level-badge">
                      {
                        course.level
                      }
                    </span>

                    <div className="course-card-menu">
                      <button
                        type="button"
                        disabled={
                          isDeleting
                        }
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          setActiveMenu(
                            activeMenu ===
                              course.id
                              ? null
                              : course.id
                          );
                        }}
                        aria-label="Course options"
                      >
                        {isDeleting ? (
                          <LoaderCircle
                            size={19}
                            className="spin-icon"
                          />
                        ) : (
                          <MoreHorizontal
                            size={19}
                          />
                        )}
                      </button>

                      {activeMenu ===
                        course.id && (
                        <div
                          className="course-card-dropdown"
                          onClick={(
                            event
                          ) =>
                            event.stopPropagation()
                          }
                        >
                          <button
                            type="button"
                            disabled={
                              isDeleting
                            }
                            onClick={() =>
                              handleDeleteCourse(
                                course.id
                              )
                            }
                          >
                            <Trash2
                              size={15}
                            />

                            Delete
                            Course
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="professional-course-body">
                    <div className="course-category-row">
                      <small>
                        {
                          course.category
                        }
                      </small>

                      <span
                        className={`course-status-label ${
                          course.progress ===
                          0
                            ? "not-started"
                            : ""
                        }`}
                      >
                        {
                          course.status
                        }
                      </span>
                    </div>

                    <h3>
                      {
                        course.title
                      }
                    </h3>

                    <div className="professional-progress-label">
                      <span>
                        Course
                        progress
                      </span>

                      <strong>
                        {
                          course.progress
                        }
                        %
                      </strong>
                    </div>

                    <div className="professional-progress-bar">
                      <span
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />
                    </div>

                    <div className="professional-course-information">
                      <span>
                        <BookOpen
                          size={14}
                        />

                        {
                          course.completedLessons
                        }
                        /
                        {
                          course.totalLessons
                        }{" "}
                        lessons
                      </span>

                      <span>
                        <Clock3
                          size={14}
                        />

                        {
                          course.estimatedDuration
                        }
                      </span>
                    </div>

                    <button
                      type="button"
                      className="continue-learning-btn"
                      onClick={() =>
                        handleContinueLearning(
                          course
                        )
                      }
                    >
                      <Play
                        size={16}
                        fill="currentColor"
                      />

                      {course.progress ===
                      0
                        ? "Start Course"
                        : "Continue Learning"}
                    </button>
                  </div>
                </article>
              );
            }
          )}
        </section>
      )}
    </div>
  );
}


export default MyCourses;