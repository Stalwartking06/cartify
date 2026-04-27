import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../app/store";

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: ("ADMIN" | "USER" | "SUPER_ADMIN")[];
}) => {
  const { isLoggedIn, isAuthChecked, user } = useSelector(
    (state: RootState) => state.auth
  );

  const location = useLocation();

  // ⏳ wait for auth check
  if (!isAuthChecked) return null;

  // 🔐 not logged in
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // 🔐 role check (multiple roles support)
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;