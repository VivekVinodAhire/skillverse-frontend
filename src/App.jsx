import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import ExploreCourses from "./pages/ExploreCourses";
import MyCourses from "./pages/MyCourses";
import CreateCourse from "./pages/CreateCourse";
import CourseDetails from "./pages/CourseDetails";
import Lessons from "./pages/Lessons";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import AITutor from "./pages/AITutor";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import Pricing from "./pages/Pricing";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

function PublicRoute({
  children,
}) {
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

  if (isLoggedIn) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage />
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />

          <Route
            path="/explore"
            element={
              <ExploreCourses />
            }
          />

          <Route
            path="/my-courses"
            element={
              <MyCourses />
            }
          />

          <Route
            path="/create-course"
            element={
              <CreateCourse />
            }
          />

          <Route
            path="/courses/:courseId"
            element={
              <CourseDetails />
            }
          />

          <Route
            path="/lessons"
            element={
              <Lessons />
            }
          />

          <Route
            path="/lessons/course/:courseId"
            element={
              <Lessons />
            }
          />

          <Route
            path="/lessons/:courseId/:lessonId"
            element={
              <Lesson />
            }
          />

          <Route
            path="/quiz"
            element={
              <Quiz />
            }
          />

          <Route
            path="/quiz/:courseId"
            element={
              <Quiz />
            }
          />

          <Route
            path="/quiz/:courseId/:quizId"
            element={
              <Quiz />
            }
          />

          <Route
            path="/ai-tutor"
            element={
              <AITutor />
            }
          />

          <Route
            path="/profile"
            element={
              <Profile />
            }
          />

          <Route
            path="/settings"
            element={
              <Settings />
            }
          />

          <Route
            path="/help"
            element={
              <HelpCenter />
            }
          />

          <Route
            path="/pricing"
            element={
              <Pricing />
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;