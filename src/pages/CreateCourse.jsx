import {
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
  Sparkles,
  WandSparkles,
} from "lucide-react";

import {
  generateCourse,
  getCurrentUserId,
} from "../services/courseService";


const initialFormData = {
  topic: "",
  level: "Beginner",
  language: "English",
  numberOfModules: 2,
  lessonsPerModule: 2,
};


function CreateCourse() {
  const navigate =
    useNavigate();

  const [
    formData,
    setFormData,
  ] = useState(
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
    generationStep,
    setGenerationStep,
  ] = useState(0);


  const generationSteps = [
    "Understanding your course topic",
    "Creating the course roadmap",
    "Generating modules and lessons",
    "Creating quizzes and explanations",
    "Saving the complete course",
  ];


  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (currentData) => ({
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

    if (error) {
      setError("");
    }
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


  const startGenerationAnimation =
    () => {
      setGenerationStep(0);

      const interval =
        window.setInterval(
          () => {
            setGenerationStep(
              (currentStep) => {
                if (
                  currentStep >=
                  generationSteps.length -
                    1
                ) {
                  return currentStep;
                }

                return (
                  currentStep + 1
                );
              }
            );
          },
          3500
        );

      return interval;
    };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
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
    setIsGenerating(true);

    const animationInterval =
      startGenerationAnimation();

    try {
      const response =
        await generateCourse({
          userId,

          topic:
            formData.topic.trim(),

          level:
            formData.level,

          language:
            formData.language,

          numberOfModules:
            formData.numberOfModules,

          lessonsPerModule:
            formData.lessonsPerModule,
        });

      window.clearInterval(
        animationInterval
      );

      setGenerationStep(
        generationSteps.length -
          1
      );

      const courseId =
        response?.data
          ?.courseId ||
        response?.courseId ||
        response?.data?.id ||
        response?.course?.id ||
        response?.data?.course
          ?.id;

      if (!courseId) {
        throw new Error(
          "Course was generated, but the course ID was not returned."
        );
      }

      window.setTimeout(
        () => {
          navigate(
            `/courses/${courseId}`,
            {
              replace: true,
            }
          );
        },
        900
      );
    } catch (
      requestError
    ) {
      window.clearInterval(
        animationInterval
      );

      console.error(
        "Generate course error:",
        requestError
      );

      const message =
        requestError.response
          ?.data?.message ||
        requestError.message ||
        "Failed to generate course. Please try again.";

      setError(message);
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };


  const estimatedLessons =
    formData.numberOfModules *
    formData.lessonsPerModule;


  if (isGenerating) {
    return (
      <main className="course-generator-loading">
        <section className="generation-loader-card">
          <div className="generation-animation">
            <div className="generation-orbit generation-orbit-one" />

            <div className="generation-orbit generation-orbit-two" />

            <div className="generation-brain-icon">
              <BrainCircuit
                size={42}
              />
            </div>
          </div>

          <span className="generation-badge">
            <Sparkles
              size={15}
            />
            SkillVerse AI
          </span>

          <h1>
            Creating your course
          </h1>

          <p>
            SkillVerse AI is
            building a structured
            learning roadmap for{" "}
            <strong>
              {formData.topic}
            </strong>
            .
          </p>

          <div className="generation-progress-bar">
            <span
              style={{
                width: `${
                  ((generationStep +
                    1) /
                    generationSteps.length) *
                  100
                }%`,
              }}
            />
          </div>

          <div className="generation-steps-list">
            {generationSteps.map(
              (
                step,
                index
              ) => {
                const isCompleted =
                  index <
                  generationStep;

                const isActive =
                  index ===
                  generationStep;

                return (
                  <div
                    className={`generation-step ${
                      isCompleted
                        ? "completed"
                        : ""
                    } ${
                      isActive
                        ? "active"
                        : ""
                    }`}
                    key={step}
                  >
                    <div className="generation-step-icon">
                      {isCompleted ? (
                        <CheckCircle2
                          size={18}
                        />
                      ) : isActive ? (
                        <LoaderCircle
                          size={18}
                          className="spin-icon"
                        />
                      ) : (
                        <span>
                          {index +
                            1}
                        </span>
                      )}
                    </div>

                    <span>
                      {step}
                    </span>
                  </div>
                );
              }
            )}
          </div>

          <p className="generation-note">
            Please keep this page
            open while the course
            is being generated.
          </p>
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
            Create a complete
            course
          </h1>

          <p>
            Enter your learning
            topic and SkillVerse AI
            will generate modules,
            lessons, practice tasks
            and quizzes.
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
                What would you like
                to learn?
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
              Enter a clear topic
              such as Java, React
              JS, Data Science or
              UI/UX Design.
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
                        {number >
                        1
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
                        {number >
                        1
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
                AI-generated quizzes
                included
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
            AI-generated content
            should be reviewed
            before publishing it to
            other learners.
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