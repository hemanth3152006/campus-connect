import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth, type AppRole } from "@/context/AuthContext";

const FullScreenLoader = ({ message }: { message: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="glass-card px-6 py-4 rounded-xl text-sm text-muted-foreground">{message}</div>
  </div>
);

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: AppRole[];
}) => {
  const { session, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullScreenLoader message="Loading your campus workspace..." />;
  }

  if (!session) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { session, role, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader message="Checking your session..." />;
  }

  if (session && role) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return <>{children}</>;
};

export const DashboardRedirect = () => {
  const { session, role, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader message="Preparing your dashboard..." />;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (role) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return <Navigate to="/" replace />;
};
