import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock3,
  Edit3,
  Mail,
  Save,
  Target,
  User,
  X,
} from "lucide-react";

import {
  useOutletContext,
} from "react-router-dom";

import {
  getMyCourses,
} from "../services/courseService";

const defaultProfile = {
  name: "",
  email: "",
  bio:
    "Passionate learner building practical software development skills.",
  profession:
    "Software Developer",
  learningGoal:
    "Become a professional full-stack developer",
  profileImage: "",
};

const readStoredUser = () => {
  try {
    const storedUser =
      sessionStorage.getItem(
        "skillverseUser"
      ) ||
      localStorage.getItem(
        "skillverseUser"
      );

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Read stored user error:",
      error
    );

    return null;
  }
};

const readStoredProfile = () => {
  try {
    const storedProfile =
      localStorage.getItem(
        "skillverseProfile"
      );

    return storedProfile
      ? JSON.parse(storedProfile)
      : null;
  } catch (error) {
    console.error(
      "Read stored profile error:",
      error
    );

    return null;
  }
};

function Profile() {
  const outletContext =
    useOutletContext();

  const contextUser =
    outletContext?.user || {};

  const fileInputRef =
    useRef(null);

  const [
    editing,
    setEditing,
  ] = useState(false);

  const [
    savedMessage,
    setSavedMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    loadingStats,
    setLoadingStats,
  ] = useState(true);

  const [
    stats,
    setStats,
  ] = useState({
    activeCourses: 0,
    completedCourses: 0,
    completedLessons: 0,
    averageProgress: 0,
  });

  const storedUser =
    readStoredUser();

  const storedProfile =
    readStoredProfile();

  const initialUser = {
    ...storedUser,
    ...contextUser,
  };

  const [
    formData,
    setFormData,
  ] = useState({
    ...defaultProfile,
    ...storedProfile,

    name:
      storedProfile?.name ||
      initialUser?.name ||
      initialUser?.fullName ||
      initialUser?.full_name ||
      "",

    email:
      storedProfile?.email ||
      initialUser?.email ||
      "",
  });

  const [
    originalData,
    setOriginalData,
  ] = useState(formData);

  useEffect(() => {
    const currentUser = {
      ...readStoredUser(),
      ...contextUser,
    };

    const currentProfile =
      readStoredProfile();

    const updatedProfile = {
      ...defaultProfile,
      ...currentProfile,

      name:
        currentProfile?.name ||
        currentUser?.name ||
        currentUser?.fullName ||
        currentUser?.full_name ||
        "",

      email:
        currentProfile?.email ||
        currentUser?.email ||
        "",
    };

    setFormData(
      updatedProfile
    );

    setOriginalData(
      updatedProfile
    );
  }, [
    contextUser?.id,
    contextUser?.email,
    contextUser?.name,
  ]);

  useEffect(() => {
    const loadProfileStats =
      async () => {
        try {
          setLoadingStats(true);

          const response =
            await getMyCourses();

          const courses =
            response?.courses || [];

          const activeCourses =
            courses.filter(
              (course) =>
                Number(
                  course.progress_percentage
                ) < 100
            ).length;

          const completedCourses =
            courses.filter(
              (course) =>
                Number(
                  course.progress_percentage
                ) >= 100
            ).length;

          const completedLessons =
            courses.reduce(
              (
                total,
                course
              ) =>
                total +
                Number(
                  course.completed_lessons ||
                    0
                ),
              0
            );

          const averageProgress =
            courses.length > 0
              ? Math.round(
                  courses.reduce(
                    (
                      total,
                      course
                    ) =>
                      total +
                      Number(
                        course.progress_percentage ||
                          0
                      ),
                    0
                  ) /
                    courses.length
                )
              : 0;

          setStats({
            activeCourses,
            completedCourses,
            completedLessons,
            averageProgress,
          });
        } catch (error) {
          console.error(
            "Load profile stats error:",
            error
          );

          setStats({
            activeCourses: 0,
            completedCourses: 0,
            completedLessons: 0,
            averageProgress: 0,
          });
        } finally {
          setLoadingStats(false);
        }
      };

    loadProfileStats();
  }, []);

  const initials =
    useMemo(() => {
      const normalizedName =
        formData.name.trim();

      if (!normalizedName) {
        return "SV";
      }

      return normalizedName
        .split(/\s+/)
        .slice(0, 2)
        .map((word) =>
          word
            .charAt(0)
            .toUpperCase()
        )
        .join("");
    }, [formData.name]);

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
        [name]: value,
      })
    );

    setErrorMessage("");
  };

  const validateProfile =
    () => {
      if (
        !formData.name.trim()
      ) {
        return "Full name is required.";
      }

      if (
        !formData.email.trim()
      ) {
        return "Email address is required.";
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          formData.email.trim()
        )
      ) {
        return "Please enter a valid email address.";
      }

      return "";
    };

  const handleSave = () => {
    const validationError =
      validateProfile();

    if (validationError) {
      setErrorMessage(
        validationError
      );

      return;
    }

    const normalizedProfile = {
      ...formData,

      name:
        formData.name.trim(),

      email:
        formData.email
          .trim()
          .toLowerCase(),

      profession:
        formData.profession.trim(),

      learningGoal:
        formData.learningGoal.trim(),

      bio:
        formData.bio.trim(),
    };

    const currentUser =
      readStoredUser() || {};

    const updatedUser = {
      ...currentUser,

      name:
        normalizedProfile.name,

      fullName:
        normalizedProfile.name,

      full_name:
        normalizedProfile.name,

      email:
        normalizedProfile.email,

      profileImage:
        normalizedProfile.profileImage,
    };

    sessionStorage.setItem(
      "skillverseUser",
      JSON.stringify(
        updatedUser
      )
    );

    localStorage.setItem(
      "skillverseUser",
      JSON.stringify(
        updatedUser
      )
    );

    localStorage.setItem(
      "skillverseProfile",
      JSON.stringify(
        normalizedProfile
      )
    );

    setFormData(
      normalizedProfile
    );

    setOriginalData(
      normalizedProfile
    );

    setEditing(false);

    setErrorMessage("");

    setSavedMessage(
      "Profile updated successfully."
    );

    window.dispatchEvent(
      new CustomEvent(
        "skillverse-user-updated",
        {
          detail:
            updatedUser,
        }
      )
    );

    window.setTimeout(
      () => {
        setSavedMessage("");
      },
      3000
    );
  };

  const handleCancel = () => {
    setFormData(
      originalData
    );

    setEditing(false);

    setErrorMessage("");
  };

  const handleImageButtonClick =
    () => {
      if (!editing) {
        setEditing(true);
      }

      fileInputRef.current?.click();
    };

  const handleImageChange = (
    event
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (
      !selectedFile.type.startsWith(
        "image/"
      )
    ) {
      setErrorMessage(
        "Please select a valid image file."
      );

      return;
    }

    if (
      selectedFile.size >
      2 * 1024 * 1024
    ) {
      setErrorMessage(
        "Profile image must be smaller than 2 MB."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setFormData(
        (
          currentData
        ) => ({
          ...currentData,

          profileImage:
            reader.result,
        })
      );

      setErrorMessage("");
    };

    reader.onerror = () => {
      setErrorMessage(
        "Failed to read the selected image."
      );
    };

    reader.readAsDataURL(
      selectedFile
    );

    event.target.value =
      "";
  };

  const removeProfileImage =
    () => {
      setFormData(
        (
          currentData
        ) => ({
          ...currentData,
          profileImage: "",
        })
      );
  };

  return (
    <div className="application-page profile-page">
      <header className="application-page-header">
        <div>
          <span className="application-eyebrow">
            PERSONAL ACCOUNT
          </span>

          <h1>
            Your Profile
          </h1>

          <p>
            Manage your personal
            information and learning
            preferences.
          </p>
        </div>

        <div className="profile-header-actions">
          {editing && (
            <button
              type="button"
              className="application-secondary-button"
              onClick={
                handleCancel
              }
            >
              <X size={17} />

              Cancel
            </button>
          )}

          <button
            type="button"
            className="application-primary-button"
            onClick={() => {
              if (editing) {
                handleSave();
              } else {
                setOriginalData(
                  formData
                );

                setEditing(true);
              }
            }}
          >
            {editing ? (
              <Save size={17} />
            ) : (
              <Edit3 size={17} />
            )}

            {editing
              ? "Save Changes"
              : "Edit Profile"}
          </button>
        </div>
      </header>

      {savedMessage && (
        <div className="profile-success-message">
          <CheckCircle2
            size={17}
          />

          {savedMessage}
        </div>
      )}

      {errorMessage && (
        <div className="profile-error-message">
          {errorMessage}
        </div>
      )}

      <section className="profile-overview-card">
        <div className="profile-cover-area" />

        <div className="profile-main-information">
          <div className="profile-large-avatar">
            {formData.profileImage ? (
              <img
                src={
                  formData.profileImage
                }
                alt={
                  formData.name ||
                  "Profile"
                }
              />
            ) : (
              initials
            )}

            <button
              type="button"
              onClick={
                handleImageButtonClick
              }
              aria-label="Change profile photo"
            >
              <Camera
                size={16}
              />
            </button>

            <input
              ref={
                fileInputRef
              }
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={
                handleImageChange
              }
              hidden
            />
          </div>

          <div className="profile-identity">
            <h2>
              {formData.name ||
                "SkillVerse Learner"}
            </h2>

            <p>
              {formData.profession ||
                "Learner"}
            </p>

            <span>
              <Mail
                size={14}
              />

              {formData.email ||
                "No email available"}
            </span>
          </div>

          <div className="profile-status-badge">
            <CheckCircle2
              size={15}
            />

            Active Learner
          </div>
        </div>

        {editing &&
          formData.profileImage && (
            <button
              type="button"
              className="profile-remove-photo-button"
              onClick={
                removeProfileImage
              }
            >
              Remove profile photo
            </button>
          )}
      </section>

      <section className="profile-stat-grid">
        <article>
          <BookOpen
            size={20}
          />

          <strong>
            {loadingStats
              ? "..."
              : stats.activeCourses}
          </strong>

          <span>
            Active courses
          </span>
        </article>

        <article>
          <Clock3
            size={20}
          />

          <strong>
            {loadingStats
              ? "..."
              : stats.completedLessons}
          </strong>

          <span>
            Lessons completed
          </span>
        </article>

        <article>
          <Award
            size={20}
          />

          <strong>
            {loadingStats
              ? "..."
              : stats.completedCourses}
          </strong>

          <span>
            Courses completed
          </span>
        </article>

        <article>
          <Target
            size={20}
          />

          <strong>
            {loadingStats
              ? "..."
              : `${stats.averageProgress}%`}
          </strong>

          <span>
            Average progress
          </span>
        </article>
      </section>

      <section className="profile-details-grid">
        <div className="settings-panel-card">
          <div className="settings-card-heading">
            <span>
              <User
                size={19}
              />
            </span>

            <div>
              <h2>
                Personal information
              </h2>

              <p>
                Basic information
                associated with your
                account.
              </p>
            </div>
          </div>

          <div className="professional-form-grid">
            <label>
              Full name

              <input
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                disabled={
                  !editing
                }
                maxLength={80}
              />
            </label>

            <label>
              Email address

              <input
                name="email"
                type="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                disabled={
                  !editing
                }
                maxLength={120}
              />
            </label>

            <label>
              Profession

              <input
                name="profession"
                value={
                  formData.profession
                }
                onChange={
                  handleChange
                }
                disabled={
                  !editing
                }
                maxLength={100}
              />
            </label>

            <label>
              Primary learning goal

              <input
                name="learningGoal"
                value={
                  formData.learningGoal
                }
                onChange={
                  handleChange
                }
                disabled={
                  !editing
                }
                maxLength={180}
              />
            </label>

            <label className="full-width-field">
              Professional bio

              <textarea
                name="bio"
                value={
                  formData.bio
                }
                onChange={
                  handleChange
                }
                disabled={
                  !editing
                }
                rows="5"
                maxLength={500}
              />

              <small className="profile-character-count">
                {
                  formData.bio.length
                }
                /500
              </small>
            </label>
          </div>
        </div>

        <aside className="settings-panel-card profile-achievement-panel">
          <div className="settings-card-heading">
            <span>
              <Award
                size={19}
              />
            </span>

            <div>
              <h2>
                Learning achievements
              </h2>

              <p>
                Achievements based on
                your current progress.
              </p>
            </div>
          </div>

          <div className="achievement-list">
            <article
              className={
                stats.completedLessons >=
                5
                  ? "unlocked"
                  : "locked"
              }
            >
              <span>
                🔥
              </span>

              <div>
                <strong>
                  Getting Started
                </strong>

                <small>
                  Complete at least five
                  lessons
                </small>
              </div>
            </article>

            <article
              className={
                stats.completedCourses >=
                1
                  ? "unlocked"
                  : "locked"
              }
            >
              <span>
                🏆
              </span>

              <div>
                <strong>
                  Course Finisher
                </strong>

                <small>
                  Complete your first
                  full course
                </small>
              </div>
            </article>

            <article
              className={
                stats.averageProgress >=
                75
                  ? "unlocked"
                  : "locked"
              }
            >
              <span>
                ⚡
              </span>

              <div>
                <strong>
                  Focused Learner
                </strong>

                <small>
                  Reach 75% average
                  course progress
                </small>
              </div>
            </article>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Profile;