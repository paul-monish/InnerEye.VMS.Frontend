import { useSelector } from "react-redux";
export default function useAuth() {
  const { user, isAuthenticated, loading } = useSelector((s) => s.auth);
  const hasPermission = (perm) => user?.permissions?.includes(perm) ?? false;
  const hasRole = (role) => user?.roles?.some((r) => r.name === role) ?? false;
  return { user, isAuthenticated, loading, hasPermission, hasRole };
}
