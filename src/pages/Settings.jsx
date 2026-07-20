import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  BrainCircuit,
  Check,
  ChevronRight,
  Download,
  Eye,
  Globe2,
  LockKeyhole,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Sun,
  Trash2,
  User,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

const defaultSettings = {
  theme: "light",
  language: "English",
  courseDifficulty:
    "Intermediate",
  dailyGoal: "60",
  emailNotifications:
    true,
  courseReminders:
    true,
  streakReminders:
    true,
  productUpdates:
    false,
  publicProfile:
    false,
  showProgress:
    true,
  aiPersonalization:
    true,
};

const readStoredSettings =
  () => {
    try {
      const storedSettings =
        localStorage.getItem(
          "skillverseSettings"
        );

      if (!storedSettings) {
        return {
          ...defaultSettings,

          theme:
            localStorage.getItem(
              "skillverseTheme"
            ) ||
            "light",
        };
      }

      return {
        ...defaultSettings,
        ...JSON.parse(
          storedSettings
        ),
      };
    } catch (error) {
      console.error(
        "Read settings error:",
        error
      );

      return {
        ...defaultSettings,
      };
    }
  };

const getStoredUser = () => {
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
    return null;
  }
};

function Settings() {
  const navigate =
    useNavigate();

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "appearance"
  );

  const [
    savedMessage,
    setSavedMessage,
  ] = useState("");

  const [
    actionMessage,
    setActionMessage,
  ] = useState("");

  const [
    settings,
    setSettings,
  ] = useState(
    readStoredSettings
  );

  const [
    showPasswordModal,
    setShowPasswordModal,
  ] = useState(false);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [
    passwordData,
    setPasswordData,
  ] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [
    deleteConfirmation,
    setDeleteConfirmation,
  ] = useState("");

  useEffect(() => {
    const applyTheme =
      () => {
        let resolvedTheme =
          settings.theme;

        if (
          settings.theme ===
          "system"
        ) {
          resolvedTheme =
            window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches
              ? "dark"
              : "light";
        }

        document.documentElement.setAttribute(
          "data-theme",
          resolvedTheme
        );

        document.body.setAttribute(
          "data-theme",
          resolvedTheme
        );
      };

    applyTheme();

    localStorage.setItem(
      "skillverseTheme",
      settings.theme
    );

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleSystemThemeChange =
      () => {
        if (
          settings.theme ===
          "system"
        ) {
          applyTheme();
        }
      };

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, [settings.theme]);

  const updateSetting = (
    name,
    value
  ) => {
    setSettings(
      (
        currentSettings
      ) => ({
        ...currentSettings,
        [name]: value,
      })
    );

    setSavedMessage("");
  };

  const handleSave = () => {
    localStorage.setItem(
      "skillverseSettings",
      JSON.stringify(
        settings
      )
    );

    localStorage.setItem(
      "skillverseTheme",
      settings.theme
    );

    setSavedMessage(
      "Your settings have been saved."
    );

    window.dispatchEvent(
      new CustomEvent(
        "skillverse-settings-updated",
        {
          detail:
            settings,
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

  const handlePasswordChange =
    () => {
      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        setActionMessage(
          "Please fill all password fields."
        );

        return;
      }

      if (
        passwordData.newPassword
          .length < 8
      ) {
        setActionMessage(
          "New password must contain at least 8 characters."
        );

        return;
      }

      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {
        setActionMessage(
          "New password and confirmation do not match."
        );

        return;
      }

      /*
        Backend password API तयार झाल्यावर
        इथे API request add कर.
      */

      setShowPasswordModal(
        false
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setActionMessage(
        "Password validation completed. Connect this form with your backend change-password API."
      );
    };

  const handleExportData =
    () => {
      const user =
        getStoredUser();

      let profile =
        null;

      try {
        const storedProfile =
          localStorage.getItem(
            "skillverseProfile"
          );

        profile =
          storedProfile
            ? JSON.parse(
                storedProfile
              )
            : null;
      } catch (error) {
        profile = null;
      }

      const exportData = {
        exportedAt:
          new Date().toISOString(),

        user,
        profile,
        settings,
      };

      const fileBlob =
        new Blob(
          [
            JSON.stringify(
              exportData,
              null,
              2
            ),
          ],
          {
            type:
              "application/json",
          }
        );

      const downloadUrl =
        URL.createObjectURL(
          fileBlob
        );

      const downloadLink =
        document.createElement(
          "a"
        );

      downloadLink.href =
        downloadUrl;

      downloadLink.download =
        "skillverse-account-data.json";

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();

      downloadLink.remove();

      URL.revokeObjectURL(
        downloadUrl
      );

      setActionMessage(
        "Account data exported successfully."
      );
    };

  const handleLogout = () => {
    sessionStorage.removeItem(
      "skillverseToken"
    );

    sessionStorage.removeItem(
      "token"
    );

    sessionStorage.removeItem(
      "skillverseUser"
    );

    sessionStorage.removeItem(
      "userId"
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };

  const handleDeleteAccount =
    () => {
      if (
        deleteConfirmation
          .trim()
          .toUpperCase() !==
        "DELETE"
      ) {
        setActionMessage(
          'Type "DELETE" to confirm account removal.'
        );

        return;
      }

      /*
        Backend delete-account API तयार झाल्यावर
        delete request इथे add कर.
      */

      sessionStorage.clear();

      localStorage.removeItem(
        "skillverseUser"
      );

      localStorage.removeItem(
        "skillverseProfile"
      );

      localStorage.removeItem(
        "skillverseSettings"
      );

      localStorage.removeItem(
        "skillverseTheme"
      );

      navigate(
        "/register",
        {
          replace: true,
        }
      );
  };

  const settingTabs = [
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
    },
    {
      id: "learning",
      label:
        "Learning Preferences",
      icon: BrainCircuit,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "privacy",
      label:
        "Privacy & Security",
      icon: ShieldCheck,
    },
    {
      id: "account",
      label: "Account",
      icon: User,
    },
  ];

  return (
    <div className="application-page settings-page">
      <header className="application-page-header">
        <div>
          <span className="application-eyebrow">
            ACCOUNT CONFIGURATION
          </span>

          <h1>
            Settings
          </h1>

          <p>
            Control your account,
            learning experience,
            privacy and notifications.
          </p>
        </div>

        <button
          type="button"
          className="application-primary-button"
          onClick={
            handleSave
          }
        >
          <Save
            size={17}
          />

          Save Changes
        </button>
      </header>

      {savedMessage && (
        <div className="settings-save-message">
          <Check
            size={17}
          />

          {savedMessage}
        </div>
      )}

      {actionMessage && (
        <div className="settings-action-message">
          {actionMessage}

          <button
            type="button"
            onClick={() =>
              setActionMessage(
                ""
              )
            }
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="settings-layout">
        <aside className="settings-navigation">
          {settingTabs.map(
            (tab) => {
              const Icon =
                tab.icon;

              return (
                <button
                  type="button"
                  key={
                    tab.id
                  }
                  className={
                    activeTab ===
                    tab.id
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTab(
                      tab.id
                    )
                  }
                >
                  <Icon
                    size={18}
                  />

                  <span>
                    {
                      tab.label
                    }
                  </span>

                  <ChevronRight
                    size={16}
                  />
                </button>
              );
            }
          )}
        </aside>

        <section className="settings-content">
          {activeTab ===
            "appearance" && (
            <div className="settings-panel-card">
              <div className="settings-card-heading">
                <span>
                  <Palette
                    size={20}
                  />
                </span>

                <div>
                  <h2>
                    Appearance
                  </h2>

                  <p>
                    Customize how
                    SkillVerse looks
                    on this device.
                  </p>
                </div>
              </div>

              <div className="settings-section-block">
                <div className="settings-row-heading">
                  <div>
                    <h3>
                      Interface theme
                    </h3>

                    <p>
                      Select your
                      preferred color
                      appearance.
                    </p>
                  </div>
                </div>

                <div className="theme-selection-grid">
                  <button
                    type="button"
                    className={
                      settings.theme ===
                      "light"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      updateSetting(
                        "theme",
                        "light"
                      )
                    }
                  >
                    <span className="theme-preview light-preview">
                      <Sun
                        size={22}
                      />
                    </span>

                    <strong>
                      Light
                    </strong>

                    <small>
                      Bright and clean
                      appearance
                    </small>
                  </button>

                  <button
                    type="button"
                    className={
                      settings.theme ===
                      "dark"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      updateSetting(
                        "theme",
                        "dark"
                      )
                    }
                  >
                    <span className="theme-preview dark-preview">
                      <Moon
                        size={22}
                      />
                    </span>

                    <strong>
                      Dark
                    </strong>

                    <small>
                      Comfortable in low
                      light
                    </small>
                  </button>

                  <button
                    type="button"
                    className={
                      settings.theme ===
                      "system"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      updateSetting(
                        "theme",
                        "system"
                      )
                    }
                  >
                    <span className="theme-preview system-preview">
                      <Monitor
                        size={22}
                      />
                    </span>

                    <strong>
                      System
                    </strong>

                    <small>
                      Match your device
                      appearance
                    </small>
                  </button>
                </div>
              </div>

              <div className="settings-section-block">
                <label className="professional-select-field">
                  <div>
                    <Globe2
                      size={18}
                    />

                    <span>
                      <strong>
                        Interface
                        language
                      </strong>

                      <small>
                        Saved as your
                        preferred
                        language
                      </small>
                    </span>
                  </div>

                  <select
                    value={
                      settings.language
                    }
                    onChange={(
                      event
                    ) =>
                      updateSetting(
                        "language",
                        event.target
                          .value
                      )
                    }
                  >
                    <option>
                      English
                    </option>

                    <option>
                      Marathi
                    </option>

                    <option>
                      Hindi
                    </option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {activeTab ===
            "learning" && (
            <div className="settings-panel-card">
              <div className="settings-card-heading">
                <span>
                  <BrainCircuit
                    size={20}
                  />
                </span>

                <div>
                  <h2>
                    Learning preferences
                  </h2>

                  <p>
                    Personalize course
                    generation and your
                    daily learning plan.
                  </p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label>
                  Default course
                  difficulty

                  <select
                    value={
                      settings.courseDifficulty
                    }
                    onChange={(
                      event
                    ) =>
                      updateSetting(
                        "courseDifficulty",
                        event.target
                          .value
                      )
                    }
                  >
                    <option>
                      Beginner
                    </option>

                    <option>
                      Intermediate
                    </option>

                    <option>
                      Advanced
                    </option>
                  </select>
                </label>

                <label>
                  Daily learning goal

                  <select
                    value={
                      settings.dailyGoal
                    }
                    onChange={(
                      event
                    ) =>
                      updateSetting(
                        "dailyGoal",
                        event.target
                          .value
                      )
                    }
                  >
                    <option value="15">
                      15 minutes
                    </option>

                    <option value="30">
                      30 minutes
                    </option>

                    <option value="60">
                      1 hour
                    </option>

                    <option value="120">
                      2 hours
                    </option>
                  </select>
                </label>
              </div>

              <SettingSwitch
                icon={
                  BrainCircuit
                }
                title="AI personalization"
                description="Allow SkillVerse AI to personalize courses based on your learning preferences."
                checked={
                  settings.aiPersonalization
                }
                onChange={(
                  value
                ) =>
                  updateSetting(
                    "aiPersonalization",
                    value
                  )
                }
              />
            </div>
          )}

          {activeTab ===
            "notifications" && (
            <div className="settings-panel-card">
              <div className="settings-card-heading">
                <span>
                  <Bell
                    size={20}
                  />
                </span>

                <div>
                  <h2>
                    Notifications
                  </h2>

                  <p>
                    Choose which
                    updates and
                    reminders you want.
                  </p>
                </div>
              </div>

              <SettingSwitch
                icon={Bell}
                title="Email notifications"
                description="Receive important account and course notifications by email."
                checked={
                  settings.emailNotifications
                }
                onChange={(
                  value
                ) =>
                  updateSetting(
                    "emailNotifications",
                    value
                  )
                }
              />

              <SettingSwitch
                icon={
                  BrainCircuit
                }
                title="Course reminders"
                description="Receive reminders about unfinished courses and lessons."
                checked={
                  settings.courseReminders
                }
                onChange={(
                  value
                ) =>
                  updateSetting(
                    "courseReminders",
                    value
                  )
                }
              />

              <SettingSwitch
                icon={Bell}
                title="Learning streak reminders"
                description="Receive reminders to continue your regular learning activity."
                checked={
                  settings.streakReminders
                }
                onChange={(
                  value
                ) =>
                  updateSetting(
                    "streakReminders",
                    value
                  )
                }
              />

              <SettingSwitch
                icon={Globe2}
                title="Product updates"
                description="Receive updates about new SkillVerse features."
                checked={
                  settings.productUpdates
                }
                onChange={(
                  value
                ) =>
                  updateSetting(
                    "productUpdates",
                    value
                  )
                }
              />
            </div>
          )}

          {activeTab ===
            "privacy" && (
            <div className="settings-panel-card">
              <div className="settings-card-heading">
                <span>
                  <ShieldCheck
                    size={20}
                  />
                </span>

                <div>
                  <h2>
                    Privacy & security
                  </h2>

                  <p>
                    Manage account
                    visibility and
                    security settings.
                  </p>
                </div>
              </div>

              <SettingSwitch
                icon={Eye}
                title="Public profile"
                description="Allow other SkillVerse learners to view your profile."
                checked={
                  settings.publicProfile
                }
                onChange={(
                  value
                ) =>
                  updateSetting(
                    "publicProfile",
                    value
                  )
                }
              />

              <SettingSwitch
                icon={Eye}
                title="Show course progress"
                description="Display your course progress when your profile is public."
                checked={
                  settings.showProgress
                }
                disabled={
                  !settings.publicProfile
                }
                onChange={(
                  value
                ) =>
                  updateSetting(
                    "showProgress",
                    value
                  )
                }
              />

              <div className="security-action-row">
                <div>
                  <span>
                    <LockKeyhole
                      size={18}
                    />
                  </span>

                  <div>
                    <strong>
                      Change password
                    </strong>

                    <p>
                      Update your
                      account password.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordModal(
                      true
                    )
                  }
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

          {activeTab ===
            "account" && (
            <div className="settings-panel-card">
              <div className="settings-card-heading">
                <span>
                  <User
                    size={20}
                  />
                </span>

                <div>
                  <h2>
                    Account settings
                  </h2>

                  <p>
                    Export your data,
                    log out or remove
                    your account.
                  </p>
                </div>
              </div>

              <div className="security-action-row">
                <div>
                  <span>
                    <Download
                      size={18}
                    />
                  </span>

                  <div>
                    <strong>
                      Export account
                      data
                    </strong>

                    <p>
                      Download your
                      profile and
                      settings as JSON.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleExportData
                  }
                >
                  Export Data
                </button>
              </div>

              <div className="security-action-row">
                <div>
                  <span>
                    <LogOut
                      size={18}
                    />
                  </span>

                  <div>
                    <strong>
                      Log out
                    </strong>

                    <p>
                      End the current
                      SkillVerse
                      session.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                >
                  Log Out
                </button>
              </div>

              <div className="danger-zone">
                <div>
                  <span>
                    <Trash2
                      size={19}
                    />
                  </span>

                  <div>
                    <strong>
                      Delete account
                    </strong>

                    <p>
                      Permanently
                      remove your local
                      account data.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(
                      true
                    )
                  }
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {showPasswordModal && (
        <div className="settings-modal-overlay">
          <div className="settings-modal-card">
            <div className="settings-modal-header">
              <div>
                <h2>
                  Change Password
                </h2>

                <p>
                  Enter your current
                  and new password.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPasswordModal(
                    false
                  )
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="settings-modal-form">
              <label>
                Current password

                <input
                  type="password"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setPasswordData(
                      (
                        currentData
                      ) => ({
                        ...currentData,

                        currentPassword:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                />
              </label>

              <label>
                New password

                <input
                  type="password"
                  value={
                    passwordData.newPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setPasswordData(
                      (
                        currentData
                      ) => ({
                        ...currentData,

                        newPassword:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                />
              </label>

              <label>
                Confirm password

                <input
                  type="password"
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setPasswordData(
                      (
                        currentData
                      ) => ({
                        ...currentData,

                        confirmPassword:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                />
              </label>
            </div>

            <div className="settings-modal-actions">
              <button
                type="button"
                onClick={() =>
                  setShowPasswordModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary"
                onClick={
                  handlePasswordChange
                }
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="settings-modal-overlay">
          <div className="settings-modal-card danger-modal">
            <div className="settings-modal-header">
              <div>
                <h2>
                  Delete Account
                </h2>

                <p>
                  This removes your
                  locally stored
                  account session and
                  preferences.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="settings-modal-form">
              <label>
                Type DELETE to confirm

                <input
                  value={
                    deleteConfirmation
                  }
                  onChange={(
                    event
                  ) =>
                    setDeleteConfirmation(
                      event.target
                        .value
                    )
                  }
                  placeholder="DELETE"
                />
              </label>
            </div>

            <div className="settings-modal-actions">
              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="danger"
                onClick={
                  handleDeleteAccount
                }
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingSwitch({
  icon: Icon,
  title,
  description,
  checked,
  disabled = false,
  onChange,
}) {
  return (
    <div
      className={`professional-setting-switch ${
        disabled
          ? "disabled"
          : ""
      }`}
    >
      <div>
        <span>
          <Icon size={18} />
        </span>

        <div>
          <strong>
            {title}
          </strong>

          <p>
            {description}
          </p>
        </div>
      </div>

      <label className="settings-switch-control">
        <input
          type="checkbox"
          checked={
            checked
          }
          disabled={
            disabled
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target
                .checked
            )
          }
        />

        <span />
      </label>
    </div>
  );
}

export default Settings;