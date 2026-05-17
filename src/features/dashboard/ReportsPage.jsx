import { useEffect, useState } from "react";
import { FileBarChart, Download } from "lucide-react";
import api from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";
import StatusBadge from "../../components/ui/StatusBadge";
import DataTable from "../../components/ui/DataTable";

import Button from "../../components/ui/Button";
import {
  formatDate,
  formatDateTime,
  buildQueryParams,
} from "../../utils/helpers";
import { toast } from "react-toastify";
import DatePicker from "../../components/ui/DatePicker";

const TABS = [
  { key: "registration", label: "Vendor Registration Report" },
  { key: "verification", label: "Vendor Verification Report" },
];

const ALL_STATUSES = [
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "FINANCE_VERIFICATION", label: "Finance Verification" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ACTIVE", label: "Active" },
];

export default function ReportsPage() {
  const [tab, setTab] = useState("registration");
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    fetchReport();
  }, [tab, page, pageSize, startDate, endDate, status]);

  const fetchReport = async () => {
    if (startDate && endDate && startDate > endDate) {
      setDateError("'From' date cannot be after 'To' date");
      return;
    }
    setDateError("");
    setLoading(true);
    try {
      const qs = buildQueryParams({
        startDate,
        endDate,
        status,
        page,
        pageSize,
      });
      const res = await api.get(`${endpoints.vendors.base}?${qs}`);
      setData(res.data?.responseData || []);
      setTotalCount(res.data?.totalCount || 0);
    } catch {
      setData([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

  const handleStartDate = (val) => {
    setStartDate(val);
    setPage(1);
    setDateError("");
  };
  const handleEndDate = (val) => {
    setEndDate(val);
    setPage(1);
    setDateError("");
  };

  /**
   * Calls the backend export API which fetches ALL matching records
   * and returns a CSV file stream — no pagination limit.
   */
  const handleExport = async () => {
    if (startDate && endDate && startDate > endDate) {
      setDateError("'From' date cannot be after 'To' date");
      return;
    }
    setExporting(true);
    try {
      const qs = buildQueryParams({ type: tab, status, startDate, endDate });
      const res = await api.get(`${endpoints.vendors.export}?${qs}`, {
        responseType: "blob",
      });

      // Extract filename from Content-Disposition header or use default
      const disposition = res.headers["content-disposition"];
      let fileName = `${tab === "verification" ? "Vendor_Verification" : "Vendor_Registration"}_Report.csv`;
      if (disposition) {
        const match = disposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (match?.[1]) fileName = match[1].replace(/['"]/g, "");
      }

      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Report exported successfully");
    } catch {
      toast.error("Export failed. Please try again.");
    }
    setExporting(false);
  };

  const registrationColumns = [
    {
      key: "vendorCode",
      header: "Code",
      cellClass: "text-xs font-mono text-gray-500",
    },
    {
      key: "vendorName",
      header: "Vendor Name",
      render: (r) => (
        <span className="font-medium text-gray-900">{r.vendorName}</span>
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
      key: "email",
      header: "Email",
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
      header: "Registered",
      hideOnMobile: true,
      render: (r) => (
        <span className="text-gray-500">{formatDate(r.createdAt)}</span>
      ),
    },
  ];

  //   const verificationColumns = [
  //     {
  //       key: "vendorCode",
  //       header: "Code",
  //       cellClass: "text-xs font-mono text-gray-500",
  //     },
  //     {
  //       key: "vendorName",
  //       header: "Vendor Name",
  //       render: (r) => (
  //         <span className="font-medium text-gray-900">{r.vendorName}</span>
  //       ),
  //     },
  //     {
  //       key: "status",
  //       header: "Status",
  //       render: (r) => <StatusBadge status={r.status} />,
  //     },
  //     {
  //       key: "lastAction",
  //       header: "Last Action",
  //       hideOnMobile: true,
  //       render: (r) => {
  //         const l = r.approvalHistory?.[r.approvalHistory?.length - 1];
  //         return (
  //           <span className="text-gray-600">
  //             {l ? `${l.action} (${l.level})` : "\u2014"}
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       key: "actionDate",
  //       header: "Action Date",
  //       hideOnTablet: true,
  //       render: (r) => {
  //         const l = r.approvalHistory?.[r.approvalHistory?.length - 1];
  //         return (
  //           <span className="text-gray-500">
  //             {l ? formatDateTime(l.actionDate) : "\u2014"}
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       key: "remarks",
  //       header: "Remarks",
  //       hideOnTablet: true,
  //       render: (r) => {
  //         const l = r.approvalHistory?.[r.approvalHistory?.length - 1];
  //         return (
  //           <span className="text-gray-500 max-w-xs truncate block">
  //             {l?.remarks || "\u2014"}
  //           </span>
  //         );
  //       },
  //     },
  //   ];

  const verificationColumns = [
    {
      key: "vendorCode",
      header: "Code",
      cellClass: "text-xs font-mono text-gray-500",
    },
    {
      key: "vendorName",
      header: "Vendor Name",
      render: (r) => (
        <span className="font-medium text-gray-900">{r.vendorName}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "lastAction",
      header: "Last Action",
      hideOnMobile: true,
      render: (r) => (
        <span className="text-gray-600">
          {r.lastApprovalAction
            ? `${r.lastApprovalAction} (${r.lastApprovalLevel})`
            : "\u2014"}
        </span>
      ),
    },
    {
      key: "actionDate",
      header: "Action Date",
      hideOnTablet: true,
      render: (r) => (
        <span className="text-gray-500">
          {r.lastApprovalDate ? formatDateTime(r.lastApprovalDate) : "\u2014"}
        </span>
      ),
    },
    {
      key: "remarks",
      header: "Remarks",
      hideOnTablet: true,
      render: (r) => (
        <span className="text-gray-500 max-w-xs truncate block">
          {r.lastApprovalRemarks || "\u2014"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileBarChart className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        </div>
        <Button
          variant="secondary"
          onClick={handleExport}
          loading={exporting}
          disabled={totalCount === 0}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DatePicker
            label="From"
            value={startDate}
            onChange={handleStartDate}
            maxDate={endDate || undefined}
            error={dateError && startDate ? dateError : ""}
          />
          <DatePicker
            label="To"
            value={endDate}
            onChange={handleEndDate}
            minDate={startDate || undefined}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 hover:border-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              {ALL_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <DataTable
          columns={
            tab === "registration" ? registrationColumns : verificationColumns
          }
          data={data}
          loading={loading}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
