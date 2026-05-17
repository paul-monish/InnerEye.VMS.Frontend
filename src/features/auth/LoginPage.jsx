import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import { loginThunk } from "./authThunks";
import { clearError } from "./authSlice";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginThunk(form));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-8"><ShieldCheck className="w-8 h-8" /></div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Inner Eye<br />Vendor Management</h1>
          <p className="text-primary-100 text-lg leading-relaxed">Streamlined vendor registration, document verification, and multi-level approval workflows.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface-100">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold text-gray-900">{t("app.name")}</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">{t("auth.welcome")}</h2>
          <p className="text-gray-500 text-sm mb-8">{t("auth.subtitle")}</p>

          {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label={t("auth.email")} type="email" placeholder="admin@innereye.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label={t("auth.password")} type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <Button type="submit" loading={loading} className="w-full">{t("auth.login")}</Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">{t("auth.forgotPassword")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
