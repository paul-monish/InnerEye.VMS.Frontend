import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Mail } from "lucide-react";
import { forgotPasswordThunk } from "./authThunks";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(forgotPasswordThunk(email));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-100 p-6">
      <div className="w-full max-w-sm">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8"><ArrowLeft className="w-4 h-4" />{t("auth.backToLogin")}</Link>
        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-5"><Mail className="w-7 h-7 text-primary-600" /></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-500">If an account exists for {email}, you will receive a reset link.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("auth.forgotPassword")}</h2>
            <p className="text-gray-500 text-sm mb-8">Enter your email and we'll send a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label={t("auth.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" loading={loading} className="w-full">{t("auth.sendResetLink")}</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
