import { Menu, Bell } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const initials = user ? `${(user.firstName || user.email)?.[0] || ""}`.toUpperCase() : "?";

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"><Menu className="w-5 h-5 text-gray-600" /></button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">{initials}</div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">{user?.firstName || user?.email}</p>
            <p className="text-xs text-gray-400">{user?.roles?.[0]?.name || user?.userType || "User"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
