import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Plus, Search, Trash2 } from "lucide-react";
import { fetchUsers, deactivateUser } from "./userThunks";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import UserFormModal from "./UserFormModal";
import { toast } from "react-toastify";

export default function UserListPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hasPermission } = useAuth();
  const { list, totalCount, loading } = useSelector((s) => s.users);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(fetchUsers({ page, pageSize, search: debouncedSearch }));
  }, [dispatch, page, pageSize, debouncedSearch]);

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this user?")) return;
    const r = await dispatch(deactivateUser(id));
    if (!r.error) toast.success("User deactivated");
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (r) => (
        <span className="font-medium text-gray-900">
          {r.firstName} {r.lastName}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      hideOnMobile: true,
      cellClass: "text-gray-600",
    },
    {
      key: "userType",
      header: "Type",
      hideOnMobile: true,
      cellClass: "text-gray-500",
    },
    {
      key: "roles",
      header: "Roles",
      hideOnTablet: true,
      render: (r) =>
        r.roles?.map((role) => (
          <span
            key={role.id || role.name}
            className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded mr-1"
          >
            {role.name}
          </span>
        )),
    },
    {
      key: "actions",
      header: "",
      className: "w-16",
      render: (r) =>
        hasPermission("user:deactivate") ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeactivate(r.id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : null,
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("user.title")}</h1>
        {hasPermission("user:create") && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            {t("user.create")}
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
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
        />
      </div>

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          dispatch(fetchUsers({ page, pageSize }));
        }}
      />
    </div>
  );
}
