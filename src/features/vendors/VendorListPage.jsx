import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Search } from "lucide-react";
import { fetchVendors } from "./vendorThunks";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import DataTable from "../../components/ui/DataTable";
import { formatDate } from "../../utils/helpers";

export default function VendorListPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { list, totalCount, loading } = useSelector((s) => s.vendors);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(
      fetchVendors({
        page,
        pageSize,
        search: debouncedSearch,
        status: statusFilter,
      }),
    );
  }, [dispatch, page, pageSize, debouncedSearch, statusFilter]);

  const columns = [
    {
      key: "vendorName",
      header: "Vendor",
      render: (r) => (
        <div>
          <span className="font-medium text-gray-900">{r.vendorName}</span>
          <span className="block text-xs text-gray-400">
            {r.vendorCode || "\u2014"}
          </span>
        </div>
      ),
    },
    {
      key: "companyName",
      header: "Company",
      hideOnMobile: true,
      cellClass: "text-gray-600",
    },
    {
      key: "vendorType",
      header: "Type",
      hideOnTablet: true,
      cellClass: "text-gray-500",
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "createdAt",
      header: "Created",
      hideOnMobile: true,
      render: (r) => (
        <span className="text-gray-500">{formatDate(r.createdAt)}</span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("vendor.title")}
        </h1>
        {hasPermission("vendor:create") && (
          <Button onClick={() => navigate("/vendors/register")}>
            <Plus className="w-4 h-4" />
            {t("vendor.register")}
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg"
              placeholder={t("vendor.search")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={list}
          loading={loading}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          onRowClick={(r) => navigate(`/vendors/${r.id}`)}
        />
      </div>
    </div>
  );
}
