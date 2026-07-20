import {
  Navigate,
  useLocation,
} from "react-router-dom";

function ProtectedRoute({
  children,
}) {
  const location =
    useLocation();

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

  let storedUser = null;

  try {
    const userData =
      sessionStorage.getItem(
        "skillverseUser"
      );

    storedUser = userData
      ? JSON.parse(userData)
      : null;
  } catch {
    storedUser = null;
  }

  const isAuthenticated =
    Boolean(token) &&
    Number.isInteger(userId) &&
    userId > 0 &&
    Boolean(storedUser);

  if (!isAuthenticated) {
    sessionStorage.clear();

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,

          message:
            "Please log in to continue.",
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;