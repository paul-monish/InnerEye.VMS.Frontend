import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Clock, CheckCircle2, Zap } from "lucide-react";
import api from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";
import Loader from "../../components/ui/Loader";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
    <div><p className="text-sm text-gray-500 font-medium">{label}</p><p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p></div>
  </div>
);

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`${endpoints.vendors.base}?pageSize=1`);
        const total = res.data?.totalCount || 0;
        // Fetch by status for breakdown
        const [sub, appr, active] = await Promise.all([
          api.get(`${endpoints.vendors.base}?status=SUBMITTED&pageSize=1`).catch(() => ({ data: { totalCount: 0 } })),
          api.get(`${endpoints.vendors.base}?status=APPROVED&pageSize=1`).catch(() => ({ data: { totalCount: 0 } })),
          api.get(`${endpoints.vendors.base}?status=ACTIVE&pageSize=1`).catch(() => ({ data: { totalCount: 0 } })),
        ]);
        setStats({ total, pending: sub.data?.totalCount || 0, approved: appr.data?.totalCount || 0, active: active.data?.totalCount || 0 });
      } catch { setStats({ total: 0, pending: 0, approved: 0, active: 0 }); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("dashboard.title")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Building2} label={t("dashboard.totalVendors")} value={stats?.total} color="bg-primary-100 text-primary-600" />
        <StatCard icon={Clock} label={t("dashboard.pendingApproval")} value={stats?.pending} color="bg-yellow-100 text-yellow-600" />
        <StatCard icon={CheckCircle2} label={t("dashboard.approved")} value={stats?.approved} color="bg-green-100 text-green-600" />
        <StatCard icon={Zap} label={t("dashboard.active")} value={stats?.active} color="bg-emerald-100 text-emerald-600" />
      </div>
    </div>
  );
}
