import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  GraduationCap,
  Languages,
  Layers3,
  Menu,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


const popularTopics = [
  "Java",
  "React",
  "Python",
  "Node.js",
  "Data Structures",
  "Machine Learning",
];


const platformFeatures = [
  {
    icon: WandSparkles,

    title:
      "Generate Complete Courses",

    description:
      "Enter any topic and SkillVerse AI creates a structured course with modules, lessons and quizzes.",

    className:
      "landing-feature-purple",
  },

  {
    icon: BookOpen,

    title:
      "Learn Step by Step",

    description:
      "Follow every module and lesson in the correct order with detailed explanations and practical tasks.",

    className:
      "landing-feature-blue",
  },

  {
    icon: ClipboardCheck,

    title:
      "Test Your Knowledge",

    description:
      "Complete module quizzes, review answers and understand every concept with helpful explanations.",

    className:
      "landing-feature-orange",
  },

  {
    icon: TrendingUp,

    title:
      "Track Your Progress",

    description:
      "See completed lessons, course progress and continue learning exactly where you stopped.",

    className:
      "landing-feature-green",
  },
];


const learningSteps = [
  {
    number: "01",

    icon: GraduationCap,

    title:
      "Create your account",

    description:
      "Sign up for SkillVerse and log in securely using your registered email and password.",
  },

  {
    number: "02",

    icon: BrainCircuit,

    title:
      "Generate an AI course",

    description:
      "Enter your topic, select difficulty and language, then let AI build the complete learning path.",
  },

  {
    number: "03",

    icon: BookOpen,

    title:
      "Complete lessons",

    description:
      "Study course modules, read detailed lessons, practice examples and mark your progress.",
  },

  {
    number: "04",

    icon: Target,

    title:
      "Complete quizzes",

    description:
      "Attempt quizzes for every module, review your answers and strengthen your understanding.",
  },
];


function LandingPage() {
  const navigate =
    useNavigate();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    courseTopic,
    setCourseTopic,
  ] = useState("");

  const token =
    sessionStorage.getItem(
      "skillverseToken"
    ) ||
    sessionStorage.getItem(
      "token"
    );

  const userId =
    Number(
      sessionStorage.getItem(
        "userId"
      )
    );

  const isLoggedIn =
    Boolean(token) &&
    Number.isInteger(userId) &&
    userId > 0;


  useEffect(() => {
    const closeMenuOnResize =
      () => {
        if (
          window.innerWidth >
          900
        ) {
          setMenuOpen(false);
        }
      };

    window.addEventListener(
      "resize",
      closeMenuOnResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        closeMenuOnResize
      );
    };
  }, []);


  const closeMobileMenu =
    () => {
      setMenuOpen(false);
    };


  const handleStartLearning =
    () => {
      navigate(
        isLoggedIn
          ? "/dashboard"
          : "/register"
      );
    };


  const handleGenerateCourse =
    () => {
      const normalizedTopic =
        courseTopic.trim();

      if (!normalizedTopic) {
        document
          .getElementById(
            "landing-course-topic"
          )
          ?.focus();

        return;
      }

      sessionStorage.setItem(
        "pendingCourseTopic",
        normalizedTopic
      );

      if (!isLoggedIn) {
        navigate(
          "/register",
          {
            state: {
              message:
                "Create your account to generate this course.",
            },
          }
        );

        return;
      }

      sessionStorage.setItem(
        "dashboardCourseTopic",
        normalizedTopic
      );

      navigate(
        "/create-course"
      );
    };


  const handleTopicClick =
    (topic) => {
      setCourseTopic(topic);

      document
        .getElementById(
          "landing-course-topic"
        )
        ?.focus();
    };


  return (
    <div className="sv-landing-page">
      <header className="sv-landing-navbar">
        <div className="sv-landing-container sv-navbar-inner">
          <button
            type="button"
            className="sv-landing-brand"
            onClick={() =>
              navigate("/")
            }
            aria-label="SkillVerse home"
          >
            <span>
              <GraduationCap
                size={23}
              />
            </span>

            <strong>
              Skill
              <i>Verse</i>
            </strong>
          </button>

          <nav
            className={`sv-landing-navigation ${
              menuOpen
                ? "open"
                : ""
            }`}
          >
            <a
              href="#features"
              onClick={
                closeMobileMenu
              }
            >
              Features
            </a>

            <a
              href="#workflow"
              onClick={
                closeMobileMenu
              }
            >
              How it works
            </a>

            <a
              href="#platform"
              onClick={
                closeMobileMenu
              }
            >
              Platform
            </a>

            <button
              type="button"
              className="sv-mobile-login-link"
              onClick={() => {
                closeMobileMenu();

                navigate(
                  isLoggedIn
                    ? "/dashboard"
                    : "/login"
                );
              }}
            >
              {isLoggedIn
                ? "Open Dashboard"
                : "Log in"}
            </button>
          </nav>

          <div className="sv-navbar-actions">
            {!isLoggedIn && (
              <button
                type="button"
                className="sv-navbar-login"
                onClick={() =>
                  navigate(
                    "/login"
                  )
                }
              >
                Log in
              </button>
            )}

            <button
              type="button"
              className="sv-navbar-primary"
              onClick={
                handleStartLearning
              }
            >
              {isLoggedIn
                ? "Open Dashboard"
                : "Start Learning"}

              <ArrowRight
                size={16}
              />
            </button>

            <button
              type="button"
              className="sv-mobile-menu-button"
              onClick={() =>
                setMenuOpen(
                  (
                    currentValue
                  ) =>
                    !currentValue
                )
              }
              aria-label="Toggle navigation"
            >
              {menuOpen ? (
                <X size={22} />
              ) : (
                <Menu
                  size={22}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="sv-hero-section">
          <div className="sv-hero-glow sv-hero-glow-one" />

          <div className="sv-hero-glow sv-hero-glow-two" />

          <div className="sv-landing-container sv-hero-layout">
            <div className="sv-hero-content">
              <div className="sv-hero-badge">
                <Sparkles
                  size={15}
                />

                AI-powered learning
                platform
              </div>

              <h1>
                Create a complete
                course for anything
                you want to learn.
              </h1>

              <p>
                SkillVerse transforms
                your topic into a
                structured learning
                experience with
                modules, detailed
                lessons, quizzes and
                progress tracking.
              </p>

              <div className="sv-hero-generator">
                <div className="sv-hero-input-wrapper">
                  <WandSparkles
                    size={20}
                  />

                  <input
                    id="landing-course-topic"
                    type="text"
                    value={
                      courseTopic
                    }
                    onChange={(
                      event
                    ) =>
                      setCourseTopic(
                        event.target
                          .value
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        handleGenerateCourse();
                      }
                    }}
                    placeholder="What would you like to learn?"
                    autoComplete="off"
                    maxLength={120}
                  />
                </div>

                <button
                  type="button"
                  onClick={
                    handleGenerateCourse
                  }
                >
                  <Zap
                    size={18}
                    fill="currentColor"
                  />

                  Generate Course
                </button>
              </div>

              <div className="sv-popular-topics">
                <span>
                  Popular:
                </span>

                <div>
                  {popularTopics.map(
                    (topic) => (
                      <button
                        type="button"
                        key={topic}
                        onClick={() =>
                          handleTopicClick(
                            topic
                          )
                        }
                      >
                        {topic}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="sv-hero-trust-row">
                <div>
                  <CheckCircle2
                    size={17}
                  />

                  Personalized courses
                </div>

                <div>
                  <CheckCircle2
                    size={17}
                  />

                  Detailed lessons
                </div>

                <div>
                  <CheckCircle2
                    size={17}
                  />

                  Module quizzes
                </div>
              </div>
            </div>

            <div className="sv-product-preview">
              <div className="sv-product-preview-decoration" />

              <div className="sv-preview-window">
                <div className="sv-preview-window-bar">
                  <div>
                    <span />
                    <span />
                    <span />
                  </div>

                  <small>
                    SkillVerse Learning
                    Workspace
                  </small>
                </div>

                <div className="sv-preview-dashboard">
                  <aside className="sv-preview-sidebar">
                    <div className="sv-preview-mini-brand">
                      <GraduationCap
                        size={17}
                      />

                      <strong>
                        SkillVerse
                      </strong>
                    </div>

                    <span className="active">
                      <BookOpen
                        size={15}
                      />
                      My Course
                    </span>

                    <span>
                      <Layers3
                        size={15}
                      />
                      Lessons
                    </span>

                    <span>
                      <ClipboardCheck
                        size={15}
                      />
                      Quizzes
                    </span>

                    <span>
                      <BrainCircuit
                        size={15}
                      />
                      AI Tutor
                    </span>
                  </aside>

                  <div className="sv-preview-content">
                    <div className="sv-preview-welcome">
                      <div>
                        <small>
                          YOUR AI COURSE
                        </small>

                        <h3>
                          Full Stack Web
                          Development
                        </h3>

                        <p>
                          Beginner ·
                          English
                        </p>
                      </div>

                      <span>
                        <Code2
                          size={25}
                        />
                      </span>
                    </div>

                    <div className="sv-preview-progress-row">
                      <div>
                        <span>
                          Course progress
                        </span>

                        <strong>
                          68%
                        </strong>
                      </div>

                      <div className="sv-preview-progress-bar">
                        <span />
                      </div>
                    </div>

                    <div className="sv-preview-stat-grid">
                      <article>
                        <Layers3
                          size={18}
                        />

                        <strong>
                          6
                        </strong>

                        <span>
                          Modules
                        </span>
                      </article>

                      <article>
                        <BookOpen
                          size={18}
                        />

                        <strong>
                          24
                        </strong>

                        <span>
                          Lessons
                        </span>
                      </article>

                      <article>
                        <ClipboardCheck
                          size={18}
                        />

                        <strong>
                          6
                        </strong>

                        <span>
                          Quizzes
                        </span>
                      </article>
                    </div>

                    <div className="sv-preview-current-module">
                      <div className="sv-preview-module-heading">
                        <div>
                          <span>
                            CURRENT MODULE
                          </span>

                          <h4>
                            Backend Development
                          </h4>
                        </div>

                        <small>
                          3 of 6
                        </small>
                      </div>

                      <div className="sv-preview-lesson-list">
                        <div className="completed">
                          <span>
                            <Check
                              size={14}
                            />
                          </span>

                          <p>
                            Introduction
                            to Node.js
                          </p>
                        </div>

                        <div className="active">
                          <span>
                            <Play
                              size={13}
                              fill="currentColor"
                            />
                          </span>

                          <p>
                            Creating
                            REST APIs
                          </p>
                        </div>

                        <div>
                          <span>
                            3
                          </span>

                          <p>
                            Database
                            Integration
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={
                          handleStartLearning
                        }
                      >
                        Continue Learning

                        <ArrowRight
                          size={16}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sv-preview-floating-card sv-floating-card-top">
                <span>
                  <Sparkles
                    size={18}
                  />
                </span>

                <div>
                  <strong>
                    Course generated
                  </strong>

                  <small>
                    Ready to learn
                  </small>
                </div>
              </div>

              <div className="sv-preview-floating-card sv-floating-card-bottom">
                <span>
                  <TrendingUp
                    size={18}
                  />
                </span>

                <div>
                  <strong>
                    Progress saved
                  </strong>

                  <small>
                    Continue anytime
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="sv-feature-section"
          id="features"
        >
          <div className="sv-landing-container">
            <div className="sv-section-heading">
              <span>
                <Sparkles
                  size={15}
                />

                COMPLETE LEARNING
                EXPERIENCE
              </span>

              <h2>
                Everything you need
                to learn a new skill
              </h2>

              <p>
                One platform to
                generate, organize,
                complete and track
                your personalized
                learning journey.
              </p>
            </div>

            <div className="sv-feature-grid">
              {platformFeatures.map(
                (feature) => {
                  const Icon =
                    feature.icon;

                  return (
                    <article
                      key={
                        feature.title
                      }
                      className={`sv-feature-card ${feature.className}`}
                    >
                      <span>
                        <Icon
                          size={24}
                        />
                      </span>

                      <h3>
                        {
                          feature.title
                        }
                      </h3>

                      <p>
                        {
                          feature.description
                        }
                      </p>

                      <div>
                        Explore feature

                        <ChevronRight
                          size={16}
                        />
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </div>
        </section>

        <section
          className="sv-workflow-section"
          id="workflow"
        >
          <div className="sv-landing-container">
            <div className="sv-section-heading">
              <span>
                <Target
                  size={15}
                />

                SIMPLE WORKFLOW
              </span>

              <h2>
                From signup to course
                completion
              </h2>

              <p>
                SkillVerse keeps the
                complete learning
                process clear and
                organized.
              </p>
            </div>

            <div className="sv-workflow-grid">
              {learningSteps.map(
                (
                  step,
                  index
                ) => {
                  const Icon =
                    step.icon;

                  return (
                    <article
                      key={
                        step.number
                      }
                      className="sv-workflow-card"
                    >
                      <div className="sv-workflow-number">
                        {
                          step.number
                        }
                      </div>

                      <span className="sv-workflow-icon">
                        <Icon
                          size={23}
                        />
                      </span>

                      <h3>
                        {
                          step.title
                        }
                      </h3>

                      <p>
                        {
                          step.description
                        }
                      </p>

                      {index <
                        learningSteps.length -
                          1 && (
                        <div className="sv-workflow-arrow">
                          <ArrowRight
                            size={20}
                          />
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          </div>
        </section>

        <section
          className="sv-platform-section"
          id="platform"
        >
          <div className="sv-landing-container sv-platform-layout">
            <div className="sv-platform-content">
              <span className="sv-platform-label">
                <BrainCircuit
                  size={16}
                />

                BUILT FOR PERSONALIZED
                LEARNING
              </span>

              <h2>
                Your complete learning
                workspace in one
                platform
              </h2>

              <p>
                Every generated course
                stays connected with
                its modules, lessons,
                quizzes and progress,
                so your learning never
                becomes confusing.
              </p>

              <div className="sv-platform-benefits">
                <div>
                  <span>
                    <Check
                      size={16}
                    />
                  </span>

                  <div>
                    <strong>
                      Course-wise
                      organization
                    </strong>

                    <p>
                      Lessons and
                      quizzes remain
                      clearly grouped
                      with their course.
                    </p>
                  </div>
                </div>

                <div>
                  <span>
                    <Check
                      size={16}
                    />
                  </span>

                  <div>
                    <strong>
                      Multiple learning
                      levels
                    </strong>

                    <p>
                      Generate beginner,
                      intermediate or
                      advanced courses.
                    </p>
                  </div>
                </div>

                <div>
                  <span>
                    <Check
                      size={16}
                    />
                  </span>

                  <div>
                    <strong>
                      Language selection
                    </strong>

                    <p>
                      Create courses in
                      English, Marathi
                      or Hindi.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="sv-platform-button"
                onClick={
                  handleStartLearning
                }
              >
                {isLoggedIn
                  ? "Continue Learning"
                  : "Create Free Account"}

                <ArrowRight
                  size={18}
                />
              </button>
            </div>

            <div className="sv-platform-visual">
              <div className="sv-platform-main-card">
                <div className="sv-platform-card-header">
                  <span>
                    <BrainCircuit
                      size={20}
                    />
                  </span>

                  <div>
                    <small>
                      AI COURSE BUILDER
                    </small>

                    <strong>
                      Personalized for
                      you
                    </strong>
                  </div>
                </div>

                <div className="sv-platform-topic-card">
                  <small>
                    COURSE TOPIC
                  </small>

                  <strong>
                    Java Programming
                  </strong>

                  <span>
                    <GraduationCap
                      size={14}
                    />

                    Beginner
                  </span>

                  <span>
                    <Languages
                      size={14}
                    />

                    English
                  </span>
                </div>

                <div className="sv-platform-course-tree">
                  <div>
                    <span>
                      1
                    </span>

                    <p>
                      Java Fundamentals
                    </p>

                    <small>
                      4 lessons
                    </small>
                  </div>

                  <div>
                    <span>
                      2
                    </span>

                    <p>
                      Object-Oriented
                      Programming
                    </p>

                    <small>
                      4 lessons
                    </small>
                  </div>

                  <div>
                    <span>
                      3
                    </span>

                    <p>
                      Advanced Java
                    </p>

                    <small>
                      4 lessons
                    </small>
                  </div>
                </div>
              </div>

              <div className="sv-platform-small-card sv-small-card-lessons">
                <BookOpen
                  size={21}
                />

                <div>
                  <strong>
                    12 Lessons
                  </strong>

                  <span>
                    Ready to learn
                  </span>
                </div>
              </div>

              <div className="sv-platform-small-card sv-small-card-quizzes">
                <ClipboardCheck
                  size={21}
                />

                <div>
                  <strong>
                    3 Quizzes
                  </strong>

                  <span>
                    Test knowledge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sv-final-cta-section">
          <div className="sv-landing-container">
            <div className="sv-final-cta-box">
              <div className="sv-final-cta-icon">
                <GraduationCap
                  size={31}
                />
              </div>

              <span>
                START YOUR LEARNING
                JOURNEY
              </span>

              <h2>
                Stop searching.
                Start learning.
              </h2>

              <p>
                Create your account,
                generate your first
                AI-powered course and
                begin learning today.
              </p>

              <button
                type="button"
                onClick={
                  handleStartLearning
                }
              >
                {isLoggedIn
                  ? "Go to Dashboard"
                  : "Create Your First Course"}

                <ArrowRight
                  size={18}
                />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="sv-landing-footer">
        <div className="sv-landing-container sv-footer-top">
          <div className="sv-footer-brand">
            <button
              type="button"
              className="sv-landing-brand"
              onClick={() =>
                navigate("/")
              }
            >
              <span>
                <GraduationCap
                  size={22}
                />
              </span>

              <strong>
                Skill
                <i>Verse</i>
              </strong>
            </button>

            <p>
              AI-powered personalized
              courses for focused,
              structured and practical
              learning.
            </p>
          </div>

          <div className="sv-footer-links">
            <div>
              <strong>
                Platform
              </strong>

              <a href="#features">
                Features
              </a>

              <a href="#workflow">
                How it works
              </a>

              <a href="#platform">
                Learning platform
              </a>
            </div>

            <div>
              <strong>
                Account
              </strong>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/register"
                  )
                }
              >
                Sign up
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/login"
                  )
                }
              >
                Log in
              </button>
            </div>
          </div>
        </div>

        <div className="sv-landing-container sv-footer-bottom">
          <p>
            © 2026 SkillVerse.
            All rights reserved.
          </p>

          <p>
            Learn anything.
            Complete everything.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;