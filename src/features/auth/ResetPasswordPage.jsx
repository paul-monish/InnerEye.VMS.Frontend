import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resetPasswordThunk } from "./authThunks";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ token: params.get("token") || "", email: params.get("email") || "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    const result = await dispatch(resetPasswordThunk(form));
    setLoading(false);
    if (!result.error) navigate("/login");
    else setError(result.payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-100 p-6">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("auth.resetPassword")}</h2>
        <p className="text-gray-500 text-sm mb-8">Enter your new password below.</p>
        {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label={t("auth.newPassword")} type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required minLength={8} />
          <Input label={t("auth.confirmPassword")} type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          <Button type="submit" loading={loading} className="w-full">{t("auth.resetPassword")}</Button>
        </form>
      </div>
    </div>
  );
}
