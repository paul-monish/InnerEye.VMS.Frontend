import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { createUser } from "./userThunks";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";

const AVAILABLE_ROLES = [
  { id: 1, name: "Admin", userType: "ADMIN" },
  { id: 2, name: "Procurement", userType: "PROCUREMENT" },
  { id: 3, name: "Finance", userType: "FINANCE" },
];

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "Min 2 characters")
    .max(50),
  lastName: yup.string().max(50, "Max 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  mobileNumber: yup
    .string()
    .matches(/^$|^[6-9]\d{9}$/, "Must be 10 digits starting with 6-9"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Min 6 characters")
    .matches(/[A-Z]/, "Need at least one uppercase letter")
    .matches(/[0-9]/, "Need at least one number")
    .matches(/[^a-zA-Z0-9]/, "Need at least one special character"),
  roleIds: yup.array().of(yup.number()).min(1, "Select at least one role"),
});

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  password: "",
  roleIds: [],
};

export default function UserFormModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { formLoading } = useSelector((s) => s.users);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  const set = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.value }));
    setTouched((p) => ({ ...p, [f]: true }));
    if (errors[f]) setErrors((p) => ({ ...p, [f]: undefined }));
  };

  const handleBlur = (f) => () => {
    setTouched((p) => ({ ...p, [f]: true }));
    validationSchema
      .validateAt(f, form)
      .then(() => setErrors((p) => ({ ...p, [f]: undefined })))
      .catch((err) => setErrors((p) => ({ ...p, [f]: err.message })));
  };

  const toggleRole = (roleId) => {
    setTouched((p) => ({ ...p, roleIds: true }));
    setForm((p) => {
      const exists = p.roleIds.includes(roleId);
      return {
        ...p,
        roleIds: exists
          ? p.roleIds.filter((id) => id !== roleId)
          : [...p.roleIds, roleId],
      };
    });
    if (errors.roleIds) setErrors((p) => ({ ...p, roleIds: undefined }));
  };

  const validate = async () => {
    try {
      await validationSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const fe = {},
        at = {};
      err.inner.forEach((e) => {
        if (!fe[e.path]) fe[e.path] = e.message;
        at[e.path] = true;
      });
      setErrors(fe);
      setTouched(at);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!(await validate())) return;
    // Derive userType from the first selected role
    const primaryRole = AVAILABLE_ROLES.find((r) =>
      form.roleIds.includes(r.id),
    );
    const payload = {
      ...form,
      userType: primaryRole?.userType || "PROCUREMENT",
    };
    const result = await dispatch(createUser(payload));
    if (!result.error) {
      toast.success("User created successfully");
      onSuccess();
    } else toast.error(result.payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("user.create")} size="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t("user.firstName")}
          value={form.firstName}
          onChange={set("firstName")}
          onBlur={handleBlur("firstName")}
          error={touched.firstName && errors.firstName}
          required
        />
        <Input
          label={t("user.lastName")}
          value={form.lastName}
          onChange={set("lastName")}
          onBlur={handleBlur("lastName")}
          error={touched.lastName && errors.lastName}
        />
        <Input
          label={t("user.email")}
          type="email"
          value={form.email}
          onChange={set("email")}
          onBlur={handleBlur("email")}
          error={touched.email && errors.email}
          placeholder="user@innereye.com"
          required
        />
        <Input
          label={t("user.mobile")}
          value={form.mobileNumber}
          onChange={set("mobileNumber")}
          onBlur={handleBlur("mobileNumber")}
          error={touched.mobileNumber && errors.mobileNumber}
          placeholder="9XXXXXXXXX"
          maxLength={10}
        />
        <div className="sm:col-span-2">
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            onBlur={handleBlur("password")}
            error={touched.password && errors.password}
            placeholder="Min 6, uppercase + number + special"
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("user.role")} <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {AVAILABLE_ROLES.map((role) => (
            <label
              key={role.id}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${
                form.roleIds.includes(role.id)
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={form.roleIds.includes(role.id)}
                onChange={() => toggleRole(role.id)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border-2 transition ${
                  form.roleIds.includes(role.id)
                    ? "bg-primary-500 border-primary-500"
                    : "border-gray-300"
                }`}
              >
                {form.roleIds.includes(role.id) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              {role.name}
            </label>
          ))}
        </div>
        {touched.roleIds && errors.roleIds && (
          <p className="text-xs text-red-500 mt-1.5">{errors.roleIds}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleSubmit} loading={formLoading}>
          {t("common.save")}
        </Button>
      </div>
    </Modal>
  );
}
