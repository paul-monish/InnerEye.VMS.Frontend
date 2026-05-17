import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import { applyTheme } from "./styles/theme";
import { initAuthThunk } from "./features/auth/authThunks";
import { getAccessToken } from "./api/axiosInstance";
import { Loader2 } from "lucide-react";

export default function App() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const themePreset = useSelector((s) => s.auth.themePreset);
  const language = useSelector((s) => s.auth.language);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const initializing = useSelector((s) => s.auth.initializing);

  // Apply persisted theme
  useEffect(() => {
    applyTheme(themePreset || "ocean");
  }, [themePreset]);

  // Apply persisted language
  useEffect(() => {
    if (language && language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Silent refresh on page reload
  useEffect(() => {
    if (isAuthenticated && !getAccessToken()) {
      dispatch(initAuthThunk());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (initializing && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-100">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <p className="text-sm">Restoring session...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastClassName="!rounded-lg !shadow-lg !text-sm"
      />
    </BrowserRouter>
  );
}
