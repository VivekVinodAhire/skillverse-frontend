import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  BookOpen,
  Bot,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Courses",
    path: "/my-courses",
    icon: BookOpen,
  },
  {
    label: "Create AI Course",
    path: "/create-course",
    icon: PlusCircle,
  },
  {
    label: "Lessons",
    path: "/lessons",
    icon: GraduationCap,
  },
  {
    label: "Quizzes",
    path: "/quiz",
    icon: ClipboardCheck,
  },
  {
    label: "AI Tutor",
    path: "/ai-tutor",
    icon: Bot,
  },
];

const accountItems = [
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    label: "Help Center",
    path: "/help",
    icon: CircleHelp,
  },
];

const pageTitles = {
  "/dashboard": "Dashboard",
  "/my-courses": "My Courses",
  "/create-course": "Create AI Course",
  "/lessons": "Lessons",
  "/quiz": "Quizzes",
  "/ai-tutor": "AI Tutor",
  "/profile": "Profile",
  "/settings": "Settings",
  "/help": "Help Center",
};

function DashboardLayout() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    profileMenuOpen,
    setProfileMenuOpen,
  ] = useState(false);

  const [
    user,
    setUser,
  ] = useState(null);

  useEffect(() => {
    const storedUser =
      sessionStorage.getItem(
        "skillverseUser"
      );

    const storedToken =
      sessionStorage.getItem(
        "skillverseToken"
      ) ||
      sessionStorage.getItem(
        "token"
      );

    const storedUserId =
      Number(
        sessionStorage.getItem(
          "userId"
        )
      );

    if (
      !storedUser ||
      !storedToken ||
      !Number.isInteger(
        storedUserId
      ) ||
      storedUserId <= 0
    ) {
      sessionStorage.clear();

      navigate("/login", {
        replace: true,

        state: {
          message:
            "Please log in to continue.",
        },
      });

      return;
    }

    try {
      const parsedUser =
        JSON.parse(
          storedUser
        );

      const parsedUserId =
        Number(
          parsedUser?.id
        );

      if (
        !parsedUser ||
        !Number.isInteger(
          parsedUserId
        ) ||
        parsedUserId <= 0 ||
        parsedUserId !==
          storedUserId
      ) {
        throw new Error(
          "Stored user session is invalid"
        );
      }

      setUser({
        ...parsedUser,

        id:
          parsedUserId,

        fullName:
          parsedUser.fullName ||
          parsedUser.name ||
          "",

        name:
          parsedUser.name ||
          parsedUser.fullName ||
          "",

        role:
          parsedUser.role ||
          "Learner",
      });
    } catch (error) {
      console.error(
        "Invalid stored user:",
        error
      );

      sessionStorage.clear();

      navigate("/login", {
        replace: true,

        state: {
          message:
            "Your session is invalid. Please log in again.",
        },
      });
    }
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  const userDisplayName =
    useMemo(() => {
      return (
        user?.name ||
        user?.fullName ||
        "SkillVerse User"
      );
    }, [user]);

  const userInitials =
    useMemo(() => {
      if (
        !userDisplayName
      ) {
        return "SV";
      }

      return userDisplayName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) =>
          word.charAt(0)
        )
        .join("")
        .toUpperCase();
    }, [userDisplayName]);

  const currentPageTitle =
    useMemo(() => {
      if (
        location.pathname.startsWith(
          "/courses/"
        )
      ) {
        return "Course Details";
      }

      if (
        location.pathname.startsWith(
          "/lessons/course/"
        )
      ) {
        return "Course Lessons";
      }

      if (
        location.pathname.startsWith(
          "/lessons/"
        )
      ) {
        return "Lesson";
      }

      if (
        location.pathname.startsWith(
          "/quiz/"
        )
      ) {
        return "Quiz";
      }

      return (
        pageTitles[
          location.pathname
        ] ||
        "SkillVerse"
      );
    }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem(
      "skillverseUser"
    );

    sessionStorage.removeItem(
      "skillverseToken"
    );

    sessionStorage.removeItem(
      "token"
    );

    sessionStorage.removeItem(
      "userId"
    );

    sessionStorage.removeItem(
      "isLoggedIn"
    );

    setUser(null);
    setProfileMenuOpen(false);
    setSidebarOpen(false);

    navigate("/login", {
      replace: true,

      state: {
        message:
          "You have been logged out successfully.",
      },
    });
  };

  if (!user) {
    return (
      <div className="dashboard-loading">
        <span className="dashboard-loader" />

        <p>
          Loading SkillVerse...
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <button
          type="button"
          className="dashboard-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen
            ? "dashboard-sidebar-open"
            : ""
        }`}
      >
        <div className="dashboard-sidebar-header">
          <button
            type="button"
            className="dashboard-brand"
            onClick={() =>
              navigate(
                "/dashboard"
              )
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

          <button
            type="button"
            className="dashboard-sidebar-close"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="dashboard-navigation">
          <p className="dashboard-nav-label">
            MENU
          </p>

          {navigationItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  className={({
                    isActive,
                  }) =>
                    `dashboard-nav-item ${
                      isActive
                        ? "active"
                        : ""
                    }`
                  }
                >
                  <Icon
                    size={18}
                  />

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );
            }
          )}

          <p className="dashboard-nav-label dashboard-second-label">
            ACCOUNT
          </p>

          {accountItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  className={({
                    isActive,
                  }) =>
                    `dashboard-nav-item ${
                      isActive
                        ? "active"
                        : ""
                    }`
                  }
                >
                  <Icon
                    size={18}
                  />

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );
            }
          )}
        </nav>

        <div className="dashboard-sidebar-user">
          <span className="dashboard-user-avatar">
            {userInitials}
          </span>

          <div>
            <strong>
              {
                userDisplayName
              }
            </strong>

            <small>
              {user.email}
            </small>
          </div>

          <button
            type="button"
            onClick={
              handleLogout
            }
            title="Log out"
            aria-label="Log out"
          >
            <LogOut
              size={18}
            />
          </button>
        </div>
      </aside>

      <div className="dashboard-main-area">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <button
              type="button"
              className="dashboard-menu-button"
              onClick={() =>
                setSidebarOpen(
                  true
                )
              }
              aria-label="Open sidebar"
            >
              <Menu
                size={21}
              />
            </button>

            <div className="dashboard-page-title">
              <span>
                {
                  currentPageTitle
                }
              </span>
            </div>

            <div className="dashboard-search-box">
              <Search
                size={17}
              />

              <input
                type="search"
                placeholder="Search your courses and lessons..."
              />

              <kbd>⌘ K</kbd>
            </div>
          </div>

          <div className="dashboard-topbar-actions">
            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="Notifications"
            >
              <Bell
                size={19}
              />

              <span />
            </button>

            <div className="dashboard-profile-menu-wrapper">
              <button
                type="button"
                className="dashboard-profile-button"
                onClick={() =>
                  setProfileMenuOpen(
                    (
                      currentValue
                    ) =>
                      !currentValue
                  )
                }
              >
                <span>
                  {
                    userInitials
                  }
                </span>

                <div>
                  <strong>
                    {
                      userDisplayName
                    }
                  </strong>

                  <small>
                    {user.role ||
                      "Learner"}
                  </small>
                </div>

                <ChevronDown
                  size={15}
                />
              </button>

              {profileMenuOpen && (
                <div className="dashboard-profile-dropdown">
                  <div className="profile-dropdown-user">
                    <span>
                      {
                        userInitials
                      }
                    </span>

                    <div>
                      <strong>
                        {
                          userDisplayName
                        }
                      </strong>

                      <small>
                        {user.email}
                      </small>
                    </div>
                  </div>

                  <NavLink
                    to="/profile"
                  >
                    <User
                      size={16}
                    />

                    View Profile
                  </NavLink>

                  <NavLink
                    to="/settings"
                  >
                    <Settings
                      size={16}
                    />

                    Settings
                  </NavLink>

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                  >
                    <LogOut
                      size={16}
                    />

                    Log out
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="dashboard-mobile-logout"
              onClick={
                handleLogout
              }
              aria-label="Log out"
            >
              <LogOut
                size={19}
              />
            </button>
          </div>
        </header>

        <main className="dashboard-page-content">
          <Outlet
            context={{
              user,
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;