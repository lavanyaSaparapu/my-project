import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("userData");

  // if user exists → allow access
  if (user) {
    return children;
  }

  // else → redirect to signin
  return <Navigate to="/signin" />;
}