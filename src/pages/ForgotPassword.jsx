import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Mail,
} from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setEmailError("Email address is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setEmailError("");
    setEmailSent(true);
  };

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-decoration forgot-decoration-one" />
      <div className="forgot-password-decoration forgot-decoration-two" />

      <button
        type="button"
        className="forgot-page-brand"
        onClick={() => navigate("/")}
      >
        <span className="auth-brand-icon">
          <GraduationCap size={23} />
        </span>

        <span className="auth-brand-name">
          Skill<span>Verse</span>
        </span>
      </button>

      <section className="forgot-password-card">
        {!emailSent ? (
          <>
            <span className="forgot-password-icon">
              <KeyRound size={27} />
            </span>

            <h1>Forgot your password?</h1>

            <p>
              Enter your registered email address and we will send you a link
              to reset your password.
            </p>

            <form
              className="auth-form forgot-password-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="auth-field">
                <label htmlFor="forgot-email">Email address</label>

                <div
                  className={`auth-input-wrapper ${
                    emailError ? "auth-input-error" : ""
                  }`}
                >
                  <Mail size={18} />

                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailError("");
                    }}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                </div>

                {emailError && (
                  <small className="auth-error-message">{emailError}</small>
                )}
              </div>

              <button type="submit" className="auth-submit-button">
                Send Reset Link
                <ArrowRight size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="forgot-success-content">
            <span className="forgot-success-icon">
              <CheckCircle2 size={30} />
            </span>

            <h1>Check your email</h1>

            <p>
              We created a demo reset request for <strong>{email}</strong>.
              Backend email delivery will be connected later.
            </p>

            <button
              type="button"
              className="auth-submit-button"
              onClick={() => navigate("/login")}
            >
              Return to Login
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        <Link className="back-to-login-link" to="/login">
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </section>

      <p className="forgot-page-footer">
        © 2026 SkillVerse. All rights reserved.
      </p>
    </main>
  );
}

export default ForgotPassword;