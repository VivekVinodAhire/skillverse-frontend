import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
  User,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

function Login() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    formData,
    setFormData,
  ] = useState({
    email: "",
    password: "",
  });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    loginError,
    setLoginError,
  ] = useState("");

  const [
    pageMessage,
    setPageMessage,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  useEffect(() => {
    const existingToken =
      sessionStorage.getItem(
        "skillverseToken"
      );

    const existingUser =
      sessionStorage.getItem(
        "skillverseUser"
      );

    if (
      existingToken &&
      existingUser
    ) {
      navigate("/dashboard", {
        replace: true,
      });

      return;
    }

    if (
      location.state?.message
    ) {
      setPageMessage(
        location.state.message
      );
    }
  }, [
    location.state,
    navigate,
  ]);

  const handleInputChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (currentData) => ({
        ...currentData,
        [name]: value,
      })
    );

    setErrors(
      (currentErrors) => ({
        ...currentErrors,
        [name]: "",
      })
    );

    setLoginError("");
  };

  const validateForm = () => {
    const newErrors = {};

    const normalizedEmail =
      formData.email
        .trim()
        .toLowerCase();

    if (!normalizedEmail) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleLogin = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setLoginError("");

      const response =
        await fetch(
          `${API_BASE_URL}/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email:
                formData.email
                  .trim()
                  .toLowerCase(),

              password:
                formData.password,
            }),
          }
        );

      let result;

      try {
        result =
          await response.json();
      } catch {
        throw new Error(
          "Invalid response received from the server."
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Login failed."
        );
      }

      const userId =
        Number(
          result.user?.id
        );

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        throw new Error(
          "The server did not return a valid user ID."
        );
      }

      if (!result.token) {
        throw new Error(
          "The server did not return an authentication token."
        );
      }

      const loggedInUser = {
        id: userId,

        fullName:
          result.user.fullName ||
          result.user.name ||
          "",

        name:
          result.user.name ||
          result.user.fullName ||
          "",

        email:
          result.user.email,

        role:
          result.user.role ||
          "Learner",

        isAuthenticated:
          true,

        loggedInAt:
          new Date()
            .toISOString(),
      };

      sessionStorage.setItem(
        "skillverseToken",
        result.token
      );

      sessionStorage.setItem(
        "token",
        result.token
      );

      sessionStorage.setItem(
        "userId",
        String(userId)
      );

      sessionStorage.setItem(
        "skillverseUser",
        JSON.stringify(
          loggedInUser
        )
      );

      sessionStorage.setItem(
        "isLoggedIn",
        "true"
      );

      const requestedPage =
        location.state?.from;

      navigate(
        requestedPage ||
          "/dashboard",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setLoginError(
        error.message ||
          "Unable to log in."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual-panel">
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
            AI-powered personalized
            learning
          </div>

          <h1>
            Welcome back to your
            personalized learning
            journey.
          </h1>

          <p>
            Continue learning,
            complete courses and
            achieve your goals using
            AI-powered learning
            roadmaps.
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
                  Personalized courses
                </strong>

                <small>
                  Continue courses
                  created around your
                  goals.
                </small>
              </div>
            </div>

            <div>
              <span>
                <BookOpen
                  size={18}
                />
              </span>

              <div>
                <strong>
                  Structured learning
                </strong>

                <small>
                  Access modules,
                  lessons, notes and
                  quizzes.
                </small>
              </div>
            </div>

            <div>
              <span>
                <Sparkles
                  size={18}
                />
              </span>

              <div>
                <strong>
                  AI learning
                  assistant
                </strong>

                <small>
                  Get explanations
                  whenever you need
                  help.
                </small>
              </div>
            </div>
          </div>
        </div>

        <p className="auth-panel-footer">
          Learn Anything. Master
          Everything.
        </p>
      </section>

      <section className="auth-form-panel">
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
              <LockKeyhole
                size={23}
              />
            </span>

            <h2>
              Log in to SkillVerse
            </h2>

            <p>
              Enter the email and
              password used while
              creating your account.
            </p>
          </div>

          {pageMessage && (
            <div className="auth-info-message">
              {pageMessage}
            </div>
          )}

          {loginError && (
            <div className="auth-login-error">
              {loginError}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={
              handleLogin
            }
            noValidate
          >
            <div className="auth-field">
              <label htmlFor="login-email">
                Email address
              </label>

              <div
                className={`auth-input-wrapper ${
                  errors.email
                    ? "auth-input-error"
                    : ""
                }`}
              >
                <User size={18} />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter your registered email"
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
              <div className="auth-label-row">
                <label htmlFor="login-password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

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
                  id="login-password"
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
                  {
                    errors.password
                  }
                </small>
              )}
            </div>

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
                  Logging in...
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight
                    size={18}
                  />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch-text">
            Do not have a SkillVerse
            account?

            <Link to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;