import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Play,
  Plus,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import {
  getMyCourses,
} from "../services/courseService";

function Dashboard() {
  const navigate = useNavigate();

  const { user } = useOutletContext();

  const [courseTopic, setCourseTopic] =
    useState("");

  const [courses, setCourses] =
    useState([]);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [courseError, setCourseError] =
    useState("");

  useEffect(() => {
    const savedTopic =
      localStorage.getItem(
        "dashboardCourseTopic"
      );

    if (savedTopic) {
      setCourseTopic(savedTopic);

      localStorage.removeItem(
        "dashboardCourseTopic"
      );
    }
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true);
        setCourseError("");

        const userId = Number(
          user?.id ||
            localStorage.getItem("userId")
        );

        if (!userId) {
          setCourses([]);
          return;
        }

        const response =
          await getMyCourses(userId);

        const receivedCourses =
          response?.courses ||
          response?.data ||
          [];

        setCourses(
          Array.isArray(receivedCourses)
            ? receivedCourses
            : []
        );
      } catch (error) {
        console.error(
          "Dashboard courses error:",
          error
        );

        setCourses([]);

        setCourseError(
          error.response?.data?.message ||
            "Could not load your courses."
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, [user?.id]);

  const firstName =
    user?.name?.split(" ")[0] ||
    "Learner";

  const totalCourses = courses.length;

  const totalModules = useMemo(() => {
    return courses.reduce(
      (total, course) =>
        total +
        Number(
          course.total_modules || 0
        ),
      0
    );
  }, [courses]);

  const totalLessons = useMemo(() => {
    return courses.reduce(
      (total, course) =>
        total +
        Number(
          course.total_lessons || 0
        ),
      0
    );
  }, [courses]);

  const completedCourses = useMemo(() => {
    return courses.filter((course) => {
      const progress = Number(
        course.progress_percentage ||
          course.progress ||
          0
      );

      return progress >= 100;
    }).length;
  }, [courses]);

  const recentCourses = useMemo(() => {
    return courses.slice(0, 3);
  }, [courses]);

  const handleCreateCourse = () => {
    if (!courseTopic.trim()) {
      document
        .getElementById(
          "dashboard-course-topic"
        )
        ?.focus();

      return;
    }

    localStorage.setItem(
      "dashboardCourseTopic",
      courseTopic.trim()
    );

    navigate("/create-course");
  };

  const openCourse = (courseId) => {
    if (!courseId) {
      return;
    }

    navigate(`/courses/${courseId}`);
  };

  const getCourseProgress = (course) => {
    const progress = Number(
      course.progress_percentage ||
        course.progress ||
        0
    );

    return Math.min(
      100,
      Math.max(0, progress)
    );
  };

  const getCourseIcon = (category) => {
    const normalizedCategory = String(
      category || ""
    ).toLowerCase();

    if (
      normalizedCategory.includes(
        "programming"
      ) ||
      normalizedCategory.includes("ai") ||
      normalizedCategory.includes(
        "machine"
      )
    ) {
      return BrainCircuit;
    }

    if (
      normalizedCategory.includes(
        "design"
      )
    ) {
      return Target;
    }

    return BookOpen;
  };

  return (
    <>
      <section className="dashboard-welcome-section">
        <div>
          <p className="dashboard-current-date">
            YOUR LEARNING DASHBOARD
          </p>

          <h1>
            Welcome back, {firstName}!
            <span> 👋</span>
          </h1>

          <p>
            Create personalized AI courses and
            continue learning anytime.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-new-course-button"
          onClick={() =>
            navigate("/create-course")
          }
        >
          <Plus size={18} />
          Create AI Course
        </button>
      </section>

      <section className="dashboard-course-generator">
        <div className="dashboard-generator-content">
          <span className="dashboard-generator-badge">
            <Sparkles size={14} />
            AI COURSE GENERATOR
          </span>

          <h2>
            What would you like to learn today?
          </h2>

          <p>
            Enter a topic and SkillVerse will
            generate a complete personalized
            course for you.
          </p>

          <div className="dashboard-generator-form">
            <div>
              <Sparkles size={18} />

              <input
                id="dashboard-course-topic"
                type="text"
                value={courseTopic}
                onChange={(event) =>
                  setCourseTopic(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    handleCreateCourse();
                  }
                }}
                placeholder="e.g. React, Java, Machine Learning..."
              />
            </div>

            <button
              type="button"
              onClick={handleCreateCourse}
            >
              <Zap
                size={17}
                fill="currentColor"
              />
              Generate Course
            </button>
          </div>
        </div>

        <div className="dashboard-generator-art">
          <span className="generator-art-main">
            <BrainCircuit size={54} />
          </span>

          <span className="generator-art-small art-small-one">
            <BookOpen size={20} />
          </span>

          <span className="generator-art-small art-small-two">
            <Target size={20} />
          </span>

          <span className="generator-art-small art-small-three">
            <Trophy size={20} />
          </span>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <article className="dashboard-stat-card">
          <span className="stat-icon stat-blue">
            <BookOpen size={20} />
          </span>

          <div>
            <small>My courses</small>

            <strong>
              {totalCourses}
            </strong>

            <p>
              AI-generated courses
            </p>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <span className="stat-icon stat-purple">
            <Target size={20} />
          </span>

          <div>
            <small>Total modules</small>

            <strong>
              {totalModules}
            </strong>

            <p>
              Available learning modules
            </p>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <span className="stat-icon stat-orange">
            <Clock3 size={20} />
          </span>

          <div>
            <small>Total lessons</small>

            <strong>
              {totalLessons}
            </strong>

            <p>
              Lessons available to learn
            </p>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <span className="stat-icon stat-green">
            <CheckCircle2 size={20} />
          </span>

          <div>
            <small>Completed courses</small>

            <strong>
              {completedCourses}
            </strong>

            <p>
              Courses completed by you
            </p>
          </div>
        </article>
      </section>

      <section className="dashboard-lower-grid">
        <div className="dashboard-section-card">
          <div className="dashboard-section-header">
            <div>
              <h2>My recent courses</h2>

              <p>
                Continue your AI-generated
                learning courses.
              </p>
            </div>

            {courses.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  navigate("/my-courses")
                }
              >
                View all
                <ArrowRight size={15} />
              </button>
            )}
          </div>

          {loadingCourses ? (
            <div className="dashboard-courses-state">
              <LoaderCircle
                size={36}
                className="spin-icon"
              />

              <h3>
                Loading your courses...
              </h3>

              <p>
                Please wait while we fetch your
                courses from the database.
              </p>
            </div>
          ) : courseError ? (
            <div className="dashboard-courses-state dashboard-courses-error">
              <BookOpen size={38} />

              <h3>
                Courses could not be loaded
              </h3>

              <p>{courseError}</p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="dashboard-courses-state dashboard-empty-courses">
              <span>
                <BrainCircuit size={38} />
              </span>

              <h3>
                Create your first AI course
              </h3>

              <p>
                You have not generated any course
                yet. Enter a topic and create your
                personalized course.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/create-course")
                }
              >
                <Plus size={17} />
                Create AI Course
              </button>
            </div>
          ) : (
            <div className="dashboard-course-list">
              {recentCourses.map(
                (course) => {
                  const Icon =
                    getCourseIcon(
                      course.category
                    );

                  const progress =
                    getCourseProgress(
                      course
                    );

                  return (
                    <article
                      className="dashboard-learning-card"
                      key={course.id}
                      onClick={() =>
                        openCourse(course.id)
                      }
                    >
                      <span className="learning-course-icon react-course">
                        <Icon size={23} />
                      </span>

                      <div className="learning-course-content">
                        <div className="learning-title-row">
                          <div>
                            <small>
                              {course.category ||
                                "AI GENERATED COURSE"}
                            </small>

                            <h3>
                              {course.title}
                            </h3>
                          </div>

                          <strong>
                            {progress}%
                          </strong>
                        </div>

                        <p>
                          {course.total_modules ||
                            0}{" "}
                          modules ·{" "}
                          {course.total_lessons ||
                            0}{" "}
                          lessons
                        </p>

                        <div className="learning-progress">
                          <span
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="learning-play-button"
                        onClick={(event) => {
                          event.stopPropagation();

                          openCourse(
                            course.id
                          );
                        }}
                        aria-label={`Open ${course.title}`}
                      >
                        <Play
                          size={16}
                          fill="currentColor"
                        />
                      </button>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>

        <aside className="dashboard-section-card dashboard-goal-card">
          <div className="dashboard-section-header">
            <div>
              <h2>Learning overview</h2>

              <p>
                Your current course progress.
              </p>
            </div>
          </div>

          <div className="weekly-goal-circle">
            <div>
              <strong>
                {totalCourses}
              </strong>

              <span>
                {totalCourses === 1
                  ? " course"
                  : " courses"}
              </span>
            </div>
          </div>

          <p className="weekly-goal-message">
            {totalCourses > 0 ? (
              <>
                You currently have{" "}
                <strong>
                  {totalCourses}
                </strong>{" "}
                AI-generated{" "}
                {totalCourses === 1
                  ? "course"
                  : "courses"}{" "}
                available.
              </>
            ) : (
              <>
                Generate your first course and
                start your learning journey.
              </>
            )}
          </p>
        </aside>
      </section>
    </>
  );
}

export default Dashboard;