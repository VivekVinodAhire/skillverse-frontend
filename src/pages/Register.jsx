import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
} from "lucide-react";


const API_BASE_URL =
  import.meta.env
    .VITE_API_URL ||
  "http://localhost:5000/api";


function Register() {
  const navigate =
    useNavigate();

  const [
    formData,
    setFormData,
  ] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    serverError,
    setServerError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  const handleInputChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData(
      (currentData) => ({
        ...currentData,

        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );

    setErrors(
      (currentErrors) => ({
        ...currentErrors,
        [name]: "",
      })
    );

    setServerError("");
  };


  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.fullName.trim()
    ) {
      newErrors.fullName =
        "Full name is required.";
    } else if (
      formData.fullName
        .trim()
        .length < 2
    ) {
      newErrors.fullName =
        "Enter a valid full name.";
    }

    if (
      !formData.email.trim()
    ) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/\S+@\S+\.\S+/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (
      !formData.password
    ) {
      newErrors.password =
        "Password is required.";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Password must contain at least 6 characters.";
    }

    if (
      !formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Confirm your password.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (
      !formData.termsAccepted
    ) {
      newErrors.termsAccepted =
        "Please accept the terms and privacy policy.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };


  const handleRegister = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError("");

      const response =
        await fetch(
          `${API_BASE_URL}/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              fullName:
                formData.fullName.trim(),

              email:
                formData.email
                  .trim()
                  .toLowerCase(),

              password:
                formData.password,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Registration failed"
        );
      }

      const loggedInUser = {
        ...result.user,

        name:
          result.user?.name ||
          result.user?.fullName,

        fullName:
          result.user?.fullName ||
          result.user?.name,

        role:
          result.user?.role ||
          "Learner",

        loginType:
          "email",

        isAuthenticated:
          true,

        loggedInAt:
          new Date()
            .toISOString(),
      };

      localStorage.setItem(
        "skillverseToken",
        result.token
      );

      localStorage.setItem(
        "token",
        result.token
      );

      localStorage.setItem(
        "userId",
        String(
          loggedInUser.id
        )
      );

      localStorage.setItem(
        "skillverseUser",
        JSON.stringify(
          loggedInUser
        )
      );

      const pendingCourseTopic =
        localStorage.getItem(
          "pendingCourseTopic"
        );

      if (
        pendingCourseTopic
      ) {
        localStorage.setItem(
          "dashboardCourseTopic",
          pendingCourseTopic
        );

        localStorage.removeItem(
          "pendingCourseTopic"
        );
      }

      navigate(
        "/app/dashboard",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      setServerError(
        error.message ||
          "Unable to create your account."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleGoogleRegister =
    () => {
      alert(
        "Google sign-up will be connected later."
      );
    };


  return (
    <main className="auth-page">
      <section className="auth-visual-panel register-visual-panel">
        <button
          type="button"
          className="auth-back-button auth-back-button-light"
          onClick={() =>
            navigate("/")
          }
        >
          <ArrowLeft size={17} />
          Back to home
        </button>

        <div className="auth-visual-decoration auth-decoration-one" />

        <div className="auth-visual-decoration auth-decoration-two" />

        <div className="auth-visual-content">
          <button
            type="button"
            className="auth-brand auth-brand-light"
            onClick={() =>
              navigate("/")
            }
          >
            <span className="auth-brand-icon">
              <GraduationCap
                size={24}
              />
            </span>

            <span className="auth-brand-name">
              Skill
              <span>Verse</span>
            </span>
          </button>

          <div className="auth-feature-badge">
            <Sparkles size={15} />
            Create your free learning
            account
          </div>

          <h1>
            Build valuable skills with
            courses designed for you.
          </h1>

          <p>
            Create personalized courses,
            follow complete roadmaps and
            learn at your own pace.
          </p>

          <div className="auth-benefits">
            <div>
              <span>
                <CheckCircle2
                  size={18}
                />
              </span>

              <div>
                <strong>
                  Generate complete
                  courses
                </strong>

                <small>
                  Create learning
                  roadmaps for any
                  topic.
                </small>
              </div>
            </div>

            <div>
              <span>
                <CheckCircle2
                  size={18}
                />
              </span>

              <div>
                <strong>
                  Track your progress
                </strong>

                <small>
                  Monitor lessons,
                  quizzes and learning
                  goals.
                </small>
              </div>
            </div>

            <div>
              <span>
                <CheckCircle2
                  size={18}
                />
              </span>

              <div>
                <strong>
                  Start learning for
                  free
                </strong>

                <small>
                  No payment is
                  required to create
                  an account.
                </small>
              </div>
            </div>
          </div>
        </div>

        <p className="auth-panel-footer">
          Your learning journey begins
          here.
        </p>
      </section>

      <section className="auth-form-panel register-form-panel">
        <button
          type="button"
          className="auth-back-button auth-back-button-mobile"
          onClick={() =>
            navigate("/")
          }
        >
          <ArrowLeft size={17} />
          Back to home
        </button>

        <div className="auth-form-wrapper">
          <div className="auth-mobile-brand">
            <button
              type="button"
              className="auth-brand"
              onClick={() =>
                navigate("/")
              }
            >
              <span className="auth-brand-icon">
                <GraduationCap
                  size={22}
                />
              </span>

              <span className="auth-brand-name">
                Skill
                <span>Verse</span>
              </span>
            </button>
          </div>

          <div className="auth-form-heading">
            <span className="auth-form-icon">
              <User size={23} />
            </span>

            <h2>
              Create your account
            </h2>

            <p>
              Start generating
              personalized AI courses
              for free.
            </p>
          </div>

          <button
            type="button"
            className="google-auth-button"
            onClick={
              handleGoogleRegister
            }
          >
            <span className="google-icon">
              G
            </span>

            Sign up with Google
          </button>

          <div className="auth-divider">
            <span />

            <p>
              or create an account with
              email
            </p>

            <span />
          </div>

          {serverError && (
            <div className="auth-server-error">
              {serverError}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={
              handleRegister
            }
            noValidate
          >
            <div className="auth-field">
              <label htmlFor="register-name">
                Full name
              </label>

              <div
                className={`auth-input-wrapper ${
                  errors.fullName
                    ? "auth-input-error"
                    : ""
                }`}
              >
                <User size={18} />

                <input
                  id="register-name"
                  name="fullName"
                  type="text"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={
                    isSubmitting
                  }
                />
              </div>

              {errors.fullName && (
                <small className="auth-error-message">
                  {errors.fullName}
                </small>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">
                Email address
              </label>

              <div
                className={`auth-input-wrapper ${
                  errors.email
                    ? "auth-input-error"
                    : ""
                }`}
              >
                <Mail size={18} />

                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter your email address"
                  autoComplete="email"
                  disabled={
                    isSubmitting
                  }
                />
              </div>

              {errors.email && (
                <small className="auth-error-message">
                  {errors.email}
                </small>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">
                Password
              </label>

              <div
                className={`auth-input-wrapper ${
                  errors.password
                    ? "auth-input-error"
                    : ""
                }`}
              >
                <LockKeyhole
                  size={18}
                />

                <input
                  id="register-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.password
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  disabled={
                    isSubmitting
                  }
                />

                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() =>
                    setShowPassword(
                      (currentValue) =>
                        !currentValue
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={
                    isSubmitting
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <small className="auth-error-message">
                  {errors.password}
                </small>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <div
                className={`auth-input-wrapper ${
                  errors.confirmPassword
                    ? "auth-input-error"
                    : ""
                }`}
              >
                <LockKeyhole
                  size={18}
                />

                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData
                      .confirmPassword
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  disabled={
                    isSubmitting
                  }
                />

                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (currentValue) =>
                        !currentValue
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={
                    isSubmitting
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <small className="auth-error-message">
                  {
                    errors.confirmPassword
                  }
                </small>
              )}
            </div>

            <label className="remember-checkbox terms-checkbox">
              <input
                name="termsAccepted"
                type="checkbox"
                checked={
                  formData
                    .termsAccepted
                }
                onChange={
                  handleInputChange
                }
                disabled={
                  isSubmitting
                }
              />

              <span>
                I agree to the{" "}
                <button type="button">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button">
                  Privacy Policy
                </button>
                .
              </span>
            </label>

            {errors.termsAccepted && (
              <small className="auth-error-message">
                {
                  errors.termsAccepted
                }
              </small>
            )}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="spin-icon"
                  />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Free Account
                  <ArrowRight
                    size={18}
                  />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch-text">
            Already have a SkillVerse
            account?
            <Link to="/login">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}


export default Register;