import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  Languages,
  Layers3,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import {
  generateCourse,
  getCourseGenerationStatus,
  getCurrentUserId,
  resumeCourseGeneration,
} from "../services/courseService";

const initialFormData = {
  topic: "",
  level: "Beginner",
  language: "English",
  numberOfModules: 2,
  lessonsPerModule: 2,
};

const initialGeneration = {
  jobId: null,
  courseId: null,
  status: "idle",
  stage: "",
  message: "",
  progressPercentage: 0,
  currentModule: 0,
  completedModules: 0,
  totalModules: 0,
  error: "",
  canResume: false,
};

function CreateCourse() {
  const navigate =
    useNavigate();

  const pollingTimerRef =
    useRef(null);

  const navigationTimerRef =
    useRef(null);

  const [formData, setFormData] =
    useState(
      initialFormData
    );

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    generation,
    setGeneration,
  ] = useState(
    initialGeneration
  );

  useEffect(() => {
    return () => {
      if (
        pollingTimerRef.current
      ) {
        window.clearTimeout(
          pollingTimerRef.current
        );
      }

      if (
        navigationTimerRef.current
      ) {
        window.clearTimeout(
          navigationTimerRef.current
        );
      }
    };
  }, []);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (
        currentData
      ) => ({
        ...currentData,

        [name]:
          name ===
            "numberOfModules" ||
          name ===
            "lessonsPerModule"
            ? Number(value)
            : value,
      })
    );

    setError("");
  };

  const validateForm = () => {
    if (
      !formData.topic.trim()
    ) {
      return "Please enter a course topic.";
    }

    if (
      formData.topic
        .trim()
        .length < 2
    ) {
      return "Course topic must contain at least 2 characters.";
    }

    if (
      formData.numberOfModules <
        1 ||
      formData.numberOfModules >
        8
    ) {
      return "Modules must be between 1 and 8.";
    }

    if (
      formData.lessonsPerModule <
        1 ||
      formData.lessonsPerModule >
        6
    ) {
      return "Lessons per module must be between 1 and 6.";
    }

    return "";
  };

  const stopPolling = () => {
    if (
      pollingTimerRef.current
    ) {
      window.clearTimeout(
        pollingTimerRef.current
      );

      pollingTimerRef.current =
        null;
    }
  };

  const schedulePolling = (
    jobId,
    delay = 2500
  ) => {
    stopPolling();

    pollingTimerRef.current =
      window.setTimeout(
        () => {
          pollGenerationStatus(
            jobId
          );
        },
        delay
      );
  };

  const pollGenerationStatus =
    async (
      jobId
    ) => {
      try {
        const response =
          await getCourseGenerationStatus({
            jobId,
          });

        const currentGeneration =
          response?.generation;

        if (
          !currentGeneration
        ) {
          throw new Error(
            "Invalid generation status response."
          );
        }

        setGeneration({
          jobId:
            currentGeneration.jobId,

          courseId:
            currentGeneration.courseId,

          status:
            currentGeneration.status,

          stage:
            currentGeneration.stage ||
            "",

          message:
            currentGeneration.message ||
            "Generating your course",

          progressPercentage:
            Number(
              currentGeneration.progressPercentage
            ) ||
            0,

          currentModule:
            Number(
              currentGeneration.currentModule
            ) ||
            0,

          completedModules:
            Number(
              currentGeneration.completedModules
            ) ||
            0,

          totalModules:
            Number(
              currentGeneration.totalModules
            ) ||
            formData.numberOfModules,

          error:
            currentGeneration.error ||
            "",

          canResume:
            Boolean(
              currentGeneration.canResume
            ),
        });

        if (
          currentGeneration.status ===
          "completed"
        ) {
          stopPolling();

          const courseId =
            Number(
              currentGeneration.courseId
            );

          if (
            !Number.isInteger(
              courseId
            ) ||
            courseId <= 0
          ) {
            throw new Error(
              "Course completed, but a valid course ID was not returned."
            );
          }

          navigationTimerRef.current =
            window.setTimeout(
              () => {
                navigate(
                  `/courses/${courseId}`,
                  {
                    replace: true,
                  }
                );
              },
              1000
            );

          return;
        }

        if (
          currentGeneration.status ===
          "failed"
        ) {
          stopPolling();

          setIsGenerating(
            true
          );

          return;
        }

        schedulePolling(
          jobId
        );
      } catch (
        requestError
      ) {
        console.error(
          "Generation polling error:",
          requestError
        );

        schedulePolling(
          jobId,
          5000
        );
      }
    };

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      const validationError =
        validateForm();

      if (
        validationError
      ) {
        setError(
          validationError
        );

        return;
      }

      const userId =
        getCurrentUserId();

      if (!userId) {
        setError(
          "Your login session is missing or invalid. Please log in again."
        );

        return;
      }

      setError("");

      setIsGenerating(
        true
      );

      setGeneration({
        ...initialGeneration,

        status:
          "starting",

        message:
          "Starting AI course generation",

        progressPercentage:
          1,

        totalModules:
          formData.numberOfModules,
      });

      try {
        const response =
          await generateCourse({
            userId,

            topic:
              formData.topic
                .trim(),

            level:
              formData.level,

            language:
              formData.language,

            numberOfModules:
              formData.numberOfModules,

            lessonsPerModule:
              formData.lessonsPerModule,
          });

        const jobId =
          Number(
            response?.jobId
          );

        if (
          !Number.isInteger(
            jobId
          ) ||
          jobId <= 0
        ) {
          throw new Error(
            "Course generation started, but a valid generation job ID was not returned."
          );
        }

        setGeneration(
          (
            currentGeneration
          ) => ({
            ...currentGeneration,

            jobId,

            status:
              response.status ||
              "queued",

            message:
              response.message ||
              "Course generation started",
          })
        );

        schedulePolling(
          jobId,
          800
        );
      } catch (
        requestError
      ) {
        console.error(
          "Generate course error:",
          requestError
        );

        const message =
          requestError.response
            ?.data?.message ||
          requestError.message ||
          "Failed to start course generation.";

        setError(message);

        setIsGenerating(
          false
        );

        setGeneration(
          initialGeneration
        );
      }
    };

  const handleResume =
    async () => {
      const jobId =
        Number(
          generation.jobId
        );

      if (
        !Number.isInteger(
          jobId
        ) ||
        jobId <= 0
      ) {
        setError(
          "A valid generation job is not available."
        );

        setIsGenerating(
          false
        );

        return;
      }

      try {
        setError("");

        setGeneration(
          (
            currentGeneration
          ) => ({
            ...currentGeneration,

            status:
              "resuming",

            error:
              "",

            canResume:
              false,

            message:
              "Resuming course generation",
          })
        );

        await resumeCourseGeneration({
          jobId,
        });

        schedulePolling(
          jobId,
          800
        );
      } catch (
        requestError
      ) {
        console.error(
          "Resume generation error:",
          requestError
        );

        setGeneration(
          (
            currentGeneration
          ) => ({
            ...currentGeneration,

            status:
              "failed",

            canResume:
              true,

            error:
              requestError.response
                ?.data
                ?.message ||
              requestError.message ||
              "Failed to resume generation.",
          })
        );
      }
    };

  const handleCancelGeneration =
    () => {
      stopPolling();

      setIsGenerating(
        false
      );

      setGeneration(
        initialGeneration
      );
  };

  const estimatedLessons =
    formData.numberOfModules *
    formData.lessonsPerModule;

  const displayedProgress =
    Math.max(
      1,
      Math.min(
        100,
        Number(
          generation.progressPercentage
        ) ||
          1
      )
    );

  if (isGenerating) {
    const generationFailed =
      generation.status ===
      "failed";

    return (
      <main className="course-generator-loading">
        <section className="generation-loader-card">
          <div className="generation-animation">
            <div className="generation-orbit generation-orbit-one" />

            <div className="generation-orbit generation-orbit-two" />

            <div className="generation-brain-icon">
              {generationFailed ? (
                <RefreshCw
                  size={42}
                />
              ) : (
                <BrainCircuit
                  size={42}
                />
              )}
            </div>
          </div>

          <span className="generation-badge">
            <Sparkles
              size={15}
            />

            SkillVerse AI
          </span>

          <h1>
            {generationFailed
              ? "Course generation paused"
              : generation.status ===
                  "completed"
                ? "Course created successfully"
                : "Creating your course"}
          </h1>

          <p>
            {generation.message ||
              `SkillVerse AI is building a structured learning roadmap for ${formData.topic}.`}
          </p>

          <div className="generation-progress-bar">
            <span
              style={{
                width:
                  `${displayedProgress}%`,
              }}
            />
          </div>

          <div className="generation-live-summary">
            <strong>
              {displayedProgress}%
            </strong>

            <span>
              {generation.completedModules} of{" "}
              {generation.totalModules ||
                formData.numberOfModules}{" "}
              modules saved
            </span>
          </div>

          <div className="generation-steps-list">
            <div
              className={`generation-step ${
                generation.stage !==
                "queued"
                  ? "completed"
                  : "active"
              }`}
            >
              <div className="generation-step-icon">
                {generation.stage !==
                "queued" ? (
                  <CheckCircle2
                    size={18}
                  />
                ) : (
                  <LoaderCircle
                    size={18}
                    className="spin-icon"
                  />
                )}
              </div>

              <span>
                Understanding your course topic
              </span>
            </div>

            <div
              className={`generation-step ${
                [
                  "module",
                  "module_retry",
                  "module_saved",
                  "completed",
                ].includes(
                  generation.stage
                )
                  ? "completed"
                  : "active"
              }`}
            >
              <div className="generation-step-icon">
                {[
                  "module",
                  "module_retry",
                  "module_saved",
                  "completed",
                ].includes(
                  generation.stage
                ) ? (
                  <CheckCircle2
                    size={18}
                  />
                ) : (
                  <LoaderCircle
                    size={18}
                    className="spin-icon"
                  />
                )}
              </div>

              <span>
                Creating the course roadmap
              </span>
            </div>

            {Array.from(
              {
                length:
                  generation.totalModules ||
                  formData.numberOfModules,
              },
              (
                _,
                moduleIndex
              ) => {
                const moduleOrder =
                  moduleIndex + 1;

                const completed =
                  moduleOrder <=
                  generation.completedModules;

                const active =
                  !completed &&
                  moduleOrder ===
                    generation.currentModule &&
                  !generationFailed;

                return (
                  <div
                    key={
                      moduleOrder
                    }
                    className={`generation-step ${
                      completed
                        ? "completed"
                        : ""
                    } ${
                      active
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="generation-step-icon">
                      {completed ? (
                        <CheckCircle2
                          size={18}
                        />
                      ) : active ? (
                        <LoaderCircle
                          size={18}
                          className="spin-icon"
                        />
                      ) : (
                        <span>
                          {moduleOrder}
                        </span>
                      )}
                    </div>

                    <span>
                      {completed
                        ? `Module ${moduleOrder} saved`
                        : active
                          ? `Generating Module ${moduleOrder} of ${
                              generation.totalModules ||
                              formData.numberOfModules
                            }`
                          : `Module ${moduleOrder}`}
                    </span>
                  </div>
                );
              }
            )}

            <div
              className={`generation-step ${
                generation.status ===
                "completed"
                  ? "completed"
                  : ""
              }`}
            >
              <div className="generation-step-icon">
                {generation.status ===
                "completed" ? (
                  <CheckCircle2
                    size={18}
                  />
                ) : (
                  <span>
                    <Clock3
                      size={17}
                    />
                  </span>
                )}
              </div>

              <span>
                Finalizing and publishing course
              </span>
            </div>
          </div>

          {generationFailed && (
            <div className="course-form-error">
              {generation.error ||
                "Generation was interrupted. Your completed modules are saved."}
            </div>
          )}

          {generationFailed ? (
            <div className="generation-recovery-actions">
              <button
                type="button"
                className="generate-course-button"
                onClick={
                  handleResume
                }
              >
                <RefreshCw
                  size={18}
                />

                Resume Generation
              </button>

              <button
                type="button"
                className="back-button"
                onClick={
                  handleCancelGeneration
                }
              >
                Back to course form
              </button>
            </div>
          ) : (
            <p className="generation-note">
              Each completed module is saved automatically. You can safely resume if Gemini temporarily stops responding.
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="create-course-page">
      <section className="create-course-header">
        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft
            size={19}
          />

          Back
        </button>

        <div className="create-course-title">
          <span className="page-label">
            <Sparkles
              size={16}
            />

            AI Course Builder
          </span>

          <h1>
            Create a complete course
          </h1>

          <p>
            Enter your learning topic and SkillVerse AI will generate modules, lessons, practice tasks and quizzes.
          </p>
        </div>
      </section>

      <section className="create-course-layout">
        <form
          className="course-builder-form"
          onSubmit={
            handleSubmit
          }
        >
          <div className="form-section-heading">
            <div>
              <span>
                Course details
              </span>

              <h2>
                What would you like to learn?
              </h2>
            </div>

            <div className="heading-icon">
              <WandSparkles
                size={25}
              />
            </div>
          </div>

          {error && (
            <div className="course-form-error">
              {error}
            </div>
          )}

          <div className="course-form-group full-width">
            <label htmlFor="topic">
              Course topic
            </label>

            <div className="course-input-wrapper">
              <BookOpen
                size={19}
              />

              <input
                id="topic"
                name="topic"
                type="text"
                value={
                  formData.topic
                }
                onChange={
                  handleChange
                }
                placeholder="Example: Python Programming"
                maxLength={120}
                autoComplete="off"
              />
            </div>

            <small>
              Enter a clear topic such as Java, React JS, Data Science or UI/UX Design.
            </small>
          </div>

          <div className="course-form-grid">
            <div className="course-form-group">
              <label htmlFor="level">
                Difficulty level
              </label>

              <div className="course-input-wrapper select-wrapper">
                <GraduationCap
                  size={19}
                />

                <select
                  id="level"
                  name="level"
                  value={
                    formData.level
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>
                </select>

                <ChevronDown
                  size={17}
                  className="select-chevron"
                />
              </div>
            </div>

            <div className="course-form-group">
              <label htmlFor="language">
                Course language
              </label>

              <div className="course-input-wrapper select-wrapper">
                <Languages
                  size={19}
                />

                <select
                  id="language"
                  name="language"
                  value={
                    formData.language
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="English">
                    English
                  </option>

                  <option value="Marathi">
                    Marathi
                  </option>

                  <option value="Hindi">
                    Hindi
                  </option>
                </select>

                <ChevronDown
                  size={17}
                  className="select-chevron"
                />
              </div>
            </div>

            <div className="course-form-group">
              <label htmlFor="numberOfModules">
                Number of modules
              </label>

              <div className="course-input-wrapper select-wrapper">
                <Layers3
                  size={19}
                />

                <select
                  id="numberOfModules"
                  name="numberOfModules"
                  value={
                    formData.numberOfModules
                  }
                  onChange={
                    handleChange
                  }
                >
                  {[
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                  ].map(
                    (number) => (
                      <option
                        value={
                          number
                        }
                        key={
                          number
                        }
                      >
                        {number}{" "}
                        module
                        {number > 1
                          ? "s"
                          : ""}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={17}
                  className="select-chevron"
                />
              </div>
            </div>

            <div className="course-form-group">
              <label htmlFor="lessonsPerModule">
                Lessons per module
              </label>

              <div className="course-input-wrapper select-wrapper">
                <BookOpen
                  size={19}
                />

                <select
                  id="lessonsPerModule"
                  name="lessonsPerModule"
                  value={
                    formData.lessonsPerModule
                  }
                  onChange={
                    handleChange
                  }
                >
                  {[
                    1,
                    2,
                    3,
                    4,
                    5,
                  ].map(
                    (number) => (
                      <option
                        value={
                          number
                        }
                        key={
                          number
                        }
                      >
                        {number}{" "}
                        lesson
                        {number > 1
                          ? "s"
                          : ""}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={17}
                  className="select-chevron"
                />
              </div>
            </div>
          </div>

          <div className="course-generation-summary">
            <div>
              <Layers3
                size={18}
              />

              <span>
                {
                  formData.numberOfModules
                }{" "}
                Modules
              </span>
            </div>

            <div>
              <BookOpen
                size={18}
              />

              <span>
                {
                  estimatedLessons
                }{" "}
                Lessons
              </span>
            </div>

            <div>
              <Clock3
                size={18}
              />

              <span>
                AI-generated quizzes included
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="generate-course-button"
          >
            <Sparkles
              size={20}
            />

            Generate Course with AI
          </button>

          <p className="course-generation-disclaimer">
            Modules are saved automatically as they are generated.
          </p>
        </form>

        <aside className="create-course-preview">
          <div className="preview-top">
            <span className="preview-label">
              Live preview
            </span>

            <div className="preview-icon">
              <BrainCircuit
                size={26}
              />
            </div>
          </div>

          <div className="preview-course-cover">
            <div className="preview-cover-decoration" />

            <span>
              {formData.level}
            </span>

            <h3>
              {formData.topic.trim() ||
                "Your Course Title"}
            </h3>

            <p>
              Generated in{" "}
              {
                formData.language
              }
            </p>
          </div>

          <div className="preview-course-details">
            <h4>
              Course roadmap
            </h4>

            <div className="preview-stat">
              <Layers3
                size={18}
              />

              <div>
                <strong>
                  {
                    formData.numberOfModules
                  }
                </strong>

                <span>
                  Structured modules
                </span>
              </div>
            </div>

            <div className="preview-stat">
              <BookOpen
                size={18}
              />

              <div>
                <strong>
                  {
                    estimatedLessons
                  }
                </strong>

                <span>
                  Detailed lessons
                </span>
              </div>
            </div>

            <div className="preview-stat">
              <GraduationCap
                size={18}
              />

              <div>
                <strong>
                  {
                    formData.numberOfModules
                  }
                </strong>

                <span>
                  Knowledge quizzes
                </span>
              </div>
            </div>
          </div>

          <div className="preview-features">
            <div>
              <CheckCircle2
                size={16}
              />

              Detailed concepts
            </div>

            <div>
              <CheckCircle2
                size={16}
              />

              Code examples
            </div>

            <div>
              <CheckCircle2
                size={16}
              />

              Practice tasks
            </div>

            <div>
              <CheckCircle2
                size={16}
              />

              Quiz explanations
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default CreateCourse;