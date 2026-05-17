// import { useDispatch, useSelector } from "react-redux";
// import { setTheme } from "../auth/authSlice";
// import { COLOR_PRESETS, applyTheme } from "../../styles/theme";
// import { Palette } from "lucide-react";

// export default function SettingsPage() {
//   const dispatch = useDispatch();
//   const currentTheme = useSelector((s) => s.auth.themePreset) || "ocean";

//   const handleThemeChange = (key) => {
//     dispatch(setTheme(key));
//     applyTheme(key);
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
//       <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl">
//         <div className="flex items-center gap-2 mb-5"><Palette className="w-5 h-5 text-gray-500" /><h3 className="font-semibold text-gray-900">Color Theme</h3></div>
//         <div className="grid grid-cols-2 gap-3">
//           {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
//             <button key={key} onClick={() => handleThemeChange(key)} className={`flex items-center gap-3 p-3 rounded-lg border-2 transition ${currentTheme === key ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"}`}>
//               <div className="w-8 h-8 rounded-full" style={{ backgroundColor: preset.primary[500] }} />
//               <span className="text-sm font-medium text-gray-700">{preset.name}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setTheme, setLanguage } from "../auth/authSlice";
import { COLOR_PRESETS, applyTheme } from "../../styles/theme";
import { Palette, Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const currentTheme = useSelector((s) => s.auth.themePreset) || "ocean";
  const currentLang = useSelector((s) => s.auth.language) || "en";

  const handleThemeChange = (key) => {
    dispatch(setTheme(key));
    applyTheme(key);
  };

  const handleLanguageChange = (code) => {
    dispatch(setLanguage(code));
    i18n.changeLanguage(code);
    localStorage.setItem("innereye-lang", code);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6 max-w-xl">
        {/* Color Theme */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Palette className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Color Theme</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                  currentTheme === key
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: preset.primary[500] }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Language</h3>
          </div>
          <div className="flex gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg border-2 transition flex-1 ${
                  currentLang === lang.code
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">
                    {lang.native}
                  </p>
                  <p className="text-xs text-gray-400">{lang.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
