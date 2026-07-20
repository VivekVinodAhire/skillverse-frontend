import {
  useCallback,
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
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  GraduationCap,
  HelpCircle,
  Home,
  Layers3,
  LoaderCircle,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

import {
  getCurrentUserId,
} from "../services/courseService";

import {
  getMyQuizzes,
  getQuizById,
} from "../services/quizService";


const extractQuizzes = (
  response
) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    Array.isArray(
      response?.quizzes
    )
  ) {
    return response.quizzes;
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
      response?.data?.quizzes
    )
  ) {
    return response.data.quizzes;
  }

  return [];
};


const normalizeQuiz = (
  quiz
) => ({
  id:
    Number(
      quiz.id ||
        quiz.quizId ||
        quiz.quiz_id
    ) || 0,

  courseId:
    Number(
      quiz.courseId ||
        quiz.course_id
    ) || 0,

  moduleId:
    Number(
      quiz.moduleId ||
        quiz.module_id
    ) || 0,

  title:
    quiz.title ||
    "Untitled Quiz",

  description:
    quiz.description ||
    "Test your knowledge from this module.",

  quizType:
    quiz.quizType ||
    quiz.quiz_type ||
    "module",

  passingPercentage:
    Number(
      quiz.passingPercentage ||
        quiz.passing_percentage
    ) || 60,

  timeLimitMinutes:
    Number(
      quiz.timeLimitMinutes ||
        quiz.time_limit_minutes
    ) || 10,

  questionCount:
    Number(
      quiz.questionCount ||
        quiz.question_count
    ) || 0,

  courseTitle:
    quiz.courseTitle ||
    quiz.course_title ||
    "Generated Course",

  courseDescription:
    quiz.courseDescription ||
    quiz.course_description ||
    "",

  courseLevel:
    quiz.courseLevel ||
    quiz.course_level ||
    quiz.level ||
    "Beginner",

  courseLanguage:
    quiz.courseLanguage ||
    quiz.course_language ||
    quiz.language ||
    "English",

  moduleTitle:
    quiz.moduleTitle ||
    quiz.module_title ||
    "Course Module",

  moduleOrder:
    Number(
      quiz.moduleOrder ||
        quiz.module_order
    ) || 1,

  createdAt:
    quiz.createdAt ||
    quiz.created_at ||
    null,
});


const normalizeQuestion = (
  question,
  index
) => {
  const correctOption =
    String(
      question.correctOption ||
        question.correct_option ||
        "A"
    ).toUpperCase();

  const optionLetters = [
    "A",
    "B",
    "C",
    "D",
  ];

  return {
    id:
      Number(
        question.id ||
          question.questionId ||
          question.question_id
      ) ||
      index + 1,

    question:
      question.question ||
      "Question unavailable",

    options: [
      question.optionA ||
        question.option_a ||
        question.options?.A ||
        "",

      question.optionB ||
        question.option_b ||
        question.options?.B ||
        "",

      question.optionC ||
        question.option_c ||
        question.options?.C ||
        "",

      question.optionD ||
        question.option_d ||
        question.options?.D ||
        "",
    ],

    correctAnswer:
      Math.max(
        0,
        optionLetters.indexOf(
          correctOption
        )
      ),

    correctOption,

    explanation:
      question.explanation ||
      "Review the related lesson for more information.",

    questionOrder:
      Number(
        question.questionOrder ||
          question.question_order
      ) ||
      index + 1,
  };
};


function QuizLibrary() {
  const navigate =
    useNavigate();

  const [
    quizzes,
    setQuizzes,
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
    expandedCourses,
    setExpandedCourses,
  ] = useState({});


  const loadQuizzes =
    useCallback(
      async () => {
        const userId =
          getCurrentUserId();

        if (!userId) {
          setQuizzes([]);

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
            await getMyQuizzes({
              userId,
            });

          const normalizedQuizzes =
            extractQuizzes(
              response
            )
              .map(
                normalizeQuiz
              )
              .filter(
                (quiz) =>
                  quiz.id > 0 &&
                  quiz.courseId > 0
              )
              .sort(
                (
                  firstQuiz,
                  secondQuiz
                ) => {
                  if (
                    firstQuiz.courseId !==
                    secondQuiz.courseId
                  ) {
                    return (
                      firstQuiz.courseId -
                      secondQuiz.courseId
                    );
                  }

                  return (
                    firstQuiz.moduleOrder -
                    secondQuiz.moduleOrder
                  );
                }
              );

          setQuizzes(
            normalizedQuizzes
          );

          const expandedState =
            normalizedQuizzes.reduce(
              (
                result,
                quiz
              ) => {
                result[
                  quiz.courseId
                ] = true;

                return result;
              },
              {}
            );

          setExpandedCourses(
            expandedState
          );
        } catch (
          requestError
        ) {
          console.error(
            "Load quizzes error:",
            requestError
          );

          setQuizzes([]);

          setError(
            requestError.response
              ?.data?.message ||
              requestError.message ||
              "Failed to load your quizzes."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );


  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);


  const filteredQuizzes =
    useMemo(() => {
      const normalizedSearch =
        searchText
          .trim()
          .toLowerCase();

      if (!normalizedSearch) {
        return quizzes;
      }

      return quizzes.filter(
        (quiz) =>
          quiz.title
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          quiz.courseTitle
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          quiz.moduleTitle
            .toLowerCase()
            .includes(
              normalizedSearch
            )
      );
    }, [
      quizzes,
      searchText,
    ]);


  const groupedCourses =
    useMemo(() => {
      const courseMap =
        filteredQuizzes.reduce(
          (
            result,
            quiz
          ) => {
            if (
              !result[
                quiz.courseId
              ]
            ) {
              result[
                quiz.courseId
              ] = {
                courseId:
                  quiz.courseId,

                courseTitle:
                  quiz.courseTitle,

                courseDescription:
                  quiz.courseDescription,

                courseLevel:
                  quiz.courseLevel,

                courseLanguage:
                  quiz.courseLanguage,

                quizzes: [],
              };
            }

            result[
              quiz.courseId
            ].quizzes.push(
              quiz
            );

            return result;
          },
          {}
        );

      return Object.values(
        courseMap
      ).map((course) => {
        const questionCount =
          course.quizzes.reduce(
            (
              total,
              quiz
            ) =>
              total +
              quiz.questionCount,
            0
          );

        const totalMinutes =
          course.quizzes.reduce(
            (
              total,
              quiz
            ) =>
              total +
              quiz.timeLimitMinutes,
            0
          );

        return {
          ...course,
          questionCount,
          totalMinutes,
        };
      });
    }, [filteredQuizzes]);


  const totalCourses =
    new Set(
      quizzes.map(
        (quiz) =>
          quiz.courseId
      )
    ).size;

  const totalQuestions =
    quizzes.reduce(
      (
        total,
        quiz
      ) =>
        total +
        quiz.questionCount,
      0
    );

  const totalMinutes =
    quizzes.reduce(
      (
        total,
        quiz
      ) =>
        total +
        quiz.timeLimitMinutes,
      0
    );


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


  const openQuiz = (
    quiz
  ) => {
    navigate(
      `/quiz/${quiz.courseId}/${quiz.id}`
    );
  };


  return (
    <div className="application-page quizzes-library-page">
      <header className="application-page-header">
        <div>
          <span className="application-eyebrow">
            KNOWLEDGE ASSESSMENTS
          </span>

          <h1>
            My Quizzes
          </h1>

          <p>
            All quizzes from your
            AI-generated courses are
            organized course by course.
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
              loadQuizzes
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
            <Trophy
              size={20}
            />
          </span>

          <div>
            <small>
              Total quizzes
            </small>

            <strong>
              {quizzes.length}
            </strong>
          </div>
        </article>

        <article>
          <span>
            <HelpCircle
              size={20}
            />
          </span>

          <div>
            <small>
              Questions
            </small>

            <strong>
              {totalQuestions}
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
              Assessment time
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
            placeholder="Search quizzes, courses or modules..."
          />
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
            Loading your quizzes
          </h2>

          <p>
            Please wait while we
            fetch your course
            assessments.
          </p>
        </section>
      ) : groupedCourses.length ===
        0 ? (
        <section className="empty-course-state">
          <span>
            <Trophy
              size={31}
            />
          </span>

          <h2>
            {quizzes.length === 0
              ? "No quizzes available yet"
              : "No quizzes found"}
          </h2>

          <p>
            {quizzes.length === 0
              ? "Generate an AI course and its quizzes will automatically appear here."
              : "No quiz matches your current search."}
          </p>

          {quizzes.length ===
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
        <section className="quiz-course-groups">
          {groupedCourses.map(
            (course) => {
              const isExpanded =
                expandedCourses[
                  course.courseId
                ] !== false;

              return (
                <article
                  className="quiz-course-group"
                  key={
                    course.courseId
                  }
                >
                  <header className="quiz-course-group-header">
                    <div className="quiz-course-identity">
                      <span className="quiz-course-icon">
                        <Trophy
                          size={27}
                        />
                      </span>

                      <div>
                        <span className="quiz-course-label">
                          COURSE QUIZZES
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

                        <div className="quiz-course-tags">
                          <span>
                            <GraduationCap
                              size={14}
                            />
                            {
                              course.courseLevel
                            }
                          </span>

                          <span>
                            <Trophy
                              size={14}
                            />
                            {
                              course.quizzes
                                .length
                            }{" "}
                            Quizzes
                          </span>

                          <span>
                            <HelpCircle
                              size={14}
                            />
                            {
                              course.questionCount
                            }{" "}
                            Questions
                          </span>

                          <span>
                            <Clock3
                              size={14}
                            />
                            {
                              course.totalMinutes
                            }{" "}
                            Minutes
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="quiz-course-actions">
                      <button
                        type="button"
                        className="lessons-view-course-button"
                        onClick={() =>
                          navigate(
                            `/courses/${course.courseId}`
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
                            ? "Hide quizzes"
                            : "Show quizzes"
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
                    <div className="quiz-group-content">
                      <div className="lessons-group-heading">
                        <div>
                          <span>
                            COURSE ASSESSMENTS
                          </span>

                          <h3>
                            Quizzes in{" "}
                            {
                              course.courseTitle
                            }
                          </h3>
                        </div>
                      </div>

                      <div className="quiz-library-grid">
                        {course.quizzes.map(
                          (quiz) => (
                            <article
                              className="quiz-library-card"
                              key={
                                quiz.id
                              }
                            >
                              <div className="quiz-library-cover">
                                <div className="quiz-cover-top">
                                  <span>
                                    Module{" "}
                                    {
                                      quiz.moduleOrder
                                    }
                                  </span>

                                  <span>
                                    {
                                      quiz.courseLevel
                                    }
                                  </span>
                                </div>

                                <Trophy
                                  size={39}
                                />

                                <small>
                                  {
                                    quiz.quizType
                                  }{" "}
                                  quiz
                                </small>
                              </div>

                              <div className="quiz-library-body">
                                <div className="quiz-module-path">
                                  <span>
                                    MODULE{" "}
                                    {
                                      quiz.moduleOrder
                                    }
                                  </span>

                                  <strong>
                                    {
                                      quiz.moduleTitle
                                    }
                                  </strong>
                                </div>

                                <h3>
                                  {
                                    quiz.title
                                  }
                                </h3>

                                <p>
                                  {
                                    quiz.description
                                  }
                                </p>

                                <div className="quiz-library-meta">
                                  <span>
                                    <HelpCircle
                                      size={15}
                                    />

                                    {
                                      quiz.questionCount
                                    }{" "}
                                    Questions
                                  </span>

                                  <span>
                                    <Clock3
                                      size={15}
                                    />

                                    {
                                      quiz.timeLimitMinutes
                                    }{" "}
                                    Minutes
                                  </span>

                                  <span>
                                    <Target
                                      size={15}
                                    />

                                    {
                                      quiz.passingPercentage
                                    }
                                    % Pass
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  className="continue-learning-btn"
                                  onClick={() =>
                                    openQuiz(
                                      quiz
                                    )
                                  }
                                >
                                  <Play
                                    size={16}
                                    fill="currentColor"
                                  />

                                  Start Quiz
                                </button>
                              </div>
                            </article>
                          )
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


function QuizAttempt() {
  const navigate =
    useNavigate();

  const {
    courseId,
    quizId,
  } = useParams();

  const [
    quiz,
    setQuiz,
  ] = useState(null);

  const [
    quizQuestions,
    setQuizQuestions,
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
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [
    answers,
    setAnswers,
  ] = useState({});

  const [
    quizSubmitted,
    setQuizSubmitted,
  ] = useState(false);

  const [
    showExplanation,
    setShowExplanation,
  ] = useState(false);


  useEffect(() => {
    const loadQuiz =
      async () => {
        const userId =
          getCurrentUserId();

        const validQuizId =
          Number(quizId);

        if (
          !userId ||
          !Number.isInteger(
            validQuizId
          ) ||
          validQuizId <= 0
        ) {
          setError(
            "A valid quiz and login session are required."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await getQuizById({
              quizId:
                validQuizId,

              userId,
            });

          const loadedQuiz =
            response.quiz ||
            response.data?.quiz ||
            response.data;

          if (!loadedQuiz) {
            throw new Error(
              "Quiz data was not returned."
            );
          }

          const questions =
            Array.isArray(
              loadedQuiz.questions
            )
              ? loadedQuiz.questions
              : [];

          setQuiz(
            normalizeQuiz(
              loadedQuiz
            )
          );

          setQuizQuestions(
            questions
              .map(
                normalizeQuestion
              )
              .sort(
                (
                  firstQuestion,
                  secondQuestion
                ) =>
                  firstQuestion.questionOrder -
                  secondQuestion.questionOrder
              )
          );
        } catch (
          requestError
        ) {
          console.error(
            "Load quiz error:",
            requestError
          );

          setError(
            requestError.response
              ?.data?.message ||
              requestError.message ||
              "Failed to load this quiz."
          );
        } finally {
          setLoading(false);
        }
      };

    loadQuiz();
  }, [quizId]);


  const currentQuestion =
    quizQuestions[
      currentQuestionIndex
    ];

  const selectedAnswer =
    currentQuestion
      ? answers[
          currentQuestion.id
        ]
      : undefined;

  const answeredCount =
    Object.keys(
      answers
    ).length;

  const questionProgress =
    quizQuestions.length > 0
      ? Math.round(
          ((currentQuestionIndex +
            1) /
            quizQuestions.length) *
            100
        )
      : 0;


  const score =
    useMemo(() => {
      return quizQuestions.reduce(
        (
          total,
          question
        ) =>
          answers[
            question.id
          ] ===
          question.correctAnswer
            ? total + 1
            : total,
        0
      );
    }, [
      answers,
      quizQuestions,
    ]);


  const scorePercentage =
    quizQuestions.length > 0
      ? Math.round(
          (score /
            quizQuestions.length) *
            100
        )
      : 0;

  const passingPercentage =
    quiz?.passingPercentage ||
    60;

  const passed =
    scorePercentage >=
    passingPercentage;


  const selectAnswer = (
    optionIndex
  ) => {
    if (
      quizSubmitted ||
      !currentQuestion
    ) {
      return;
    }

    setAnswers(
      (
        currentAnswers
      ) => ({
        ...currentAnswers,

        [currentQuestion.id]:
          optionIndex,
      })
    );

    setShowExplanation(
      false
    );
  };


  const goToNextQuestion =
    () => {
      if (
        currentQuestionIndex <
        quizQuestions.length - 1
      ) {
        setCurrentQuestionIndex(
          (
            currentIndex
          ) =>
            currentIndex + 1
        );

        setShowExplanation(
          false
        );
      }
    };


  const goToPreviousQuestion =
    () => {
      if (
        currentQuestionIndex > 0
      ) {
        setCurrentQuestionIndex(
          (
            currentIndex
          ) =>
            currentIndex - 1
        );

        setShowExplanation(
          false
        );
      }
    };


  const submitQuiz = () => {
    setQuizSubmitted(true);

    sessionStorage.setItem(
      `skillverseQuizResult_${quizId}`,
      JSON.stringify({
        quizId:
          Number(quizId),

        courseId:
          Number(courseId),

        score,

        totalQuestions:
          quizQuestions.length,

        percentage:
          scorePercentage,

        passed,

        completedAt:
          new Date()
            .toISOString(),
      })
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const retryQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  if (loading) {
    return (
      <main className="dynamic-lesson-state">
        <LoaderCircle
          size={44}
          className="spin-icon"
        />

        <h2>
          Loading quiz...
        </h2>
      </main>
    );
  }


  if (
    error ||
    !quiz ||
    quizQuestions.length === 0
  ) {
    return (
      <main className="dynamic-lesson-state">
        <h2>
          Quiz could not be loaded
        </h2>

        <p>
          {error ||
            "This quiz does not contain questions."}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/quiz")
          }
        >
          Return to quizzes
        </button>
      </main>
    );
  }


  if (quizSubmitted) {
    return (
      <div className="sv-quiz-page">
        <div className="sv-quiz-result-container">
          <section className="sv-result-card">
            <div
              className={`sv-result-icon ${
                passed
                  ? "passed"
                  : "failed"
              }`}
            >
              {passed ? (
                <Trophy size={48} />
              ) : (
                <Target size={48} />
              )}
            </div>

            <span className="sv-result-label">
              Quiz completed
            </span>

            <h1>
              {passed
                ? "Congratulations!"
                : "Keep Learning!"}
            </h1>

            <p>
              {passed
                ? "You successfully passed the quiz."
                : "Revise the lessons and attempt the quiz again."}
            </p>

            <div className="sv-result-score-circle">
              <strong>
                {scorePercentage}%
              </strong>

              <span>
                Your score
              </span>
            </div>

            <div className="sv-result-stat-grid">
              <div>
                <CheckCircle2
                  size={22}
                />

                <strong>
                  {score}
                </strong>

                <span>
                  Correct
                </span>
              </div>

              <div>
                <XCircle
                  size={22}
                />

                <strong>
                  {quizQuestions.length -
                    score}
                </strong>

                <span>
                  Incorrect
                </span>
              </div>

              <div>
                <HelpCircle
                  size={22}
                />

                <strong>
                  {
                    quizQuestions.length
                  }
                </strong>

                <span>
                  Questions
                </span>
              </div>
            </div>

            <div
              className={`sv-result-status ${
                passed
                  ? "passed"
                  : "failed"
              }`}
            >
              {passed ? (
                <Award size={22} />
              ) : (
                <RotateCcw
                  size={22}
                />
              )}

              <div>
                <strong>
                  {passed
                    ? "Quiz Passed"
                    : "Quiz Not Passed"}
                </strong>

                <p>
                  Passing score:{" "}
                  {
                    passingPercentage
                  }
                  %
                </p>
              </div>
            </div>

            <div className="sv-result-actions">
              <button
                type="button"
                className="sv-secondary-button"
                onClick={
                  retryQuiz
                }
              >
                <RotateCcw
                  size={18}
                />
                Retry Quiz
              </button>

              <button
                type="button"
                className="sv-primary-button"
                onClick={() =>
                  navigate(
                    "/quiz"
                  )
                }
              >
                <Home size={18} />
                All Quizzes
              </button>
            </div>
          </section>

          <section className="sv-answer-review">
            <div className="sv-answer-review-heading">
              <div>
                <span>
                  Review answers
                </span>

                <h2>
                  Question-by-question
                  result
                </h2>
              </div>

              <Sparkles
                size={24}
              />
            </div>

            {quizQuestions.map(
              (
                question,
                index
              ) => {
                const userAnswer =
                  answers[
                    question.id
                  ];

                const isCorrect =
                  userAnswer ===
                  question.correctAnswer;

                return (
                  <article
                    className={`sv-review-question ${
                      isCorrect
                        ? "correct"
                        : "incorrect"
                    }`}
                    key={
                      question.id
                    }
                  >
                    <div className="sv-review-question-number">
                      {isCorrect ? (
                        <CheckCircle2
                          size={23}
                        />
                      ) : (
                        <XCircle
                          size={23}
                        />
                      )}
                    </div>

                    <div>
                      <span>
                        Question{" "}
                        {index + 1}
                      </span>

                      <h3>
                        {
                          question.question
                        }
                      </h3>

                      <p>
                        Your answer:{" "}
                        <strong>
                          {typeof userAnswer ===
                          "number"
                            ? question.options[
                                userAnswer
                              ]
                            : "Not answered"}
                        </strong>
                      </p>

                      {!isCorrect && (
                        <p>
                          Correct answer:{" "}
                          <strong>
                            {
                              question
                                .options[
                                question
                                  .correctAnswer
                              ]
                            }
                          </strong>
                        </p>
                      )}

                      <small>
                        {
                          question.explanation
                        }
                      </small>
                    </div>
                  </article>
                );
              }
            )}
          </section>
        </div>
      </div>
    );
  }


  return (
    <div className="sv-quiz-page">
      <div className="sv-quiz-container">
        <header className="sv-quiz-header">
          <div>
            <button
              type="button"
              className="lesson-course-back"
              onClick={() =>
                navigate(
                  "/quiz"
                )
              }
            >
              <ArrowLeft
                size={17}
              />
              All Quizzes
            </button>

            <span className="sv-quiz-eyebrow">
              {
                quiz.courseTitle
              }{" "}
              • Module{" "}
              {
                quiz.moduleOrder
              }
            </span>

            <h1>
              {quiz.title}
            </h1>

            <p>
              {
                quiz.description
              }
            </p>
          </div>

          <div className="sv-quiz-time-card">
            <Clock3
              size={21}
            />

            <div>
              <span>
                Time limit
              </span>

              <strong>
                {
                  quiz.timeLimitMinutes
                }{" "}
                minutes
              </strong>
            </div>
          </div>
        </header>

        <section className="sv-quiz-progress-section">
          <div className="sv-quiz-progress-heading">
            <span>
              Question{" "}
              {currentQuestionIndex +
                1}{" "}
              of{" "}
              {
                quizQuestions.length
              }
            </span>

            <strong>
              {answeredCount} answered
            </strong>
          </div>

          <div className="sv-quiz-progress-track">
            <span
              style={{
                width: `${questionProgress}%`,
              }}
            />
          </div>
        </section>

        <section className="sv-question-card">
          <div className="sv-question-number">
            {currentQuestionIndex +
              1}
          </div>

          <div className="sv-question-content">
            <span>
              Choose one answer
            </span>

            <h2>
              {
                currentQuestion.question
              }
            </h2>

            <div className="sv-answer-options">
              {currentQuestion.options.map(
                (
                  option,
                  optionIndex
                ) => {
                  const isSelected =
                    selectedAnswer ===
                    optionIndex;

                  return (
                    <button
                      type="button"
                      key={`${option}-${optionIndex}`}
                      className={`sv-answer-option ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectAnswer(
                          optionIndex
                        )
                      }
                    >
                      <span className="sv-option-letter">
                        {String.fromCharCode(
                          65 +
                            optionIndex
                        )}
                      </span>

                      <span>
                        {option}
                      </span>

                      <span className="sv-option-check">
                        {isSelected && (
                          <Check
                            size={18}
                          />
                        )}
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            {showExplanation &&
              typeof selectedAnswer ===
                "number" && (
                <div className="sv-question-explanation">
                  <Sparkles
                    size={20}
                  />

                  <div>
                    <strong>
                      Helpful explanation
                    </strong>

                    <p>
                      {
                        currentQuestion.explanation
                      }
                    </p>
                  </div>
                </div>
              )}

            <button
              type="button"
              className="sv-show-explanation"
              disabled={
                typeof selectedAnswer !==
                "number"
              }
              onClick={() =>
                setShowExplanation(
                  (
                    currentValue
                  ) =>
                    !currentValue
                )
              }
            >
              <HelpCircle
                size={17}
              />

              {showExplanation
                ? "Hide explanation"
                : "Show explanation"}
            </button>
          </div>
        </section>

        <footer className="sv-quiz-navigation">
          <button
            type="button"
            className="sv-secondary-button"
            disabled={
              currentQuestionIndex ===
              0
            }
            onClick={
              goToPreviousQuestion
            }
          >
            <ArrowLeft
              size={18}
            />
            Previous
          </button>

          <div className="sv-question-dots">
            {quizQuestions.map(
              (
                question,
                index
              ) => (
                <button
                  type="button"
                  key={
                    question.id
                  }
                  aria-label={`Open question ${
                    index + 1
                  }`}
                  className={`${
                    index ===
                    currentQuestionIndex
                      ? "active"
                      : ""
                  } ${
                    typeof answers[
                      question.id
                    ] === "number"
                      ? "answered"
                      : ""
                  }`}
                  onClick={() => {
                    setCurrentQuestionIndex(
                      index
                    );

                    setShowExplanation(
                      false
                    );
                  }}
                />
              )
            )}
          </div>

          {currentQuestionIndex <
          quizQuestions.length -
            1 ? (
            <button
              type="button"
              className="sv-primary-button"
              disabled={
                typeof selectedAnswer !==
                "number"
              }
              onClick={
                goToNextQuestion
              }
            >
              Next
              <ArrowRight
                size={18}
              />
            </button>
          ) : (
            <button
              type="button"
              className="sv-primary-button"
              disabled={
                answeredCount !==
                quizQuestions.length
              }
              onClick={
                submitQuiz
              }
            >
              Submit Quiz
              <Trophy
                size={18}
              />
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}


function Quiz() {
  const {
    quizId,
  } = useParams();

  if (quizId) {
    return <QuizAttempt />;
  }

  return <QuizLibrary />;
}

export default Quiz;