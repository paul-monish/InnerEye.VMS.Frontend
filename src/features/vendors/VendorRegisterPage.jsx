import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import * as yup from "yup";
import { registerVendor } from "./vendorThunks";
import { VENDOR_TYPES } from "../../utils/constants";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { toast } from "react-toastify";

const steps = [
  "form.basicInfo",
  "form.businessInfo",
  "form.taxInfo",
  "form.bankInfo",
];

const stepSchemas = [
  yup.object().shape({
    vendorName: yup
      .string()
      .required("Vendor name is required")
      .min(2, "Min 2 characters")
      .max(200),
    vendorType: yup.string().required("Vendor type is required"),
    contactPerson: yup.string().required("Contact person is required").max(150),
    mobileNumber: yup
      .string()
      .required("Mobile number is required")
      .matches(/^[6-9]\d{9}$/, "Must be 10 digits starting with 6-9"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format"),
  }),
  yup.object().shape({
    companyName: yup.string().required("Company name is required").max(250),
    companyAddress: yup
      .string()
      .required("Company address is required")
      .max(500),
    city: yup.string().required("City is required").max(100),
    state: yup.string().required("State is required").max(100),
    country: yup.string().required("Country is required").max(100),
    pinCode: yup
      .string()
      .required("Pin code is required")
      .matches(/^\d{6}$/, "Must be exactly 6 digits"),
  }),
  yup.object().shape({
    gstNumber: yup
      .string()
      .required("GST number is required")
      .matches(
        /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
        "Invalid GST (e.g. 22AAAAA0000A1Z5)",
      ),
    panNumber: yup
      .string()
      .required("PAN number is required")
      .matches(/^[A-Z]{5}\d{4}[A-Z]{1}$/, "Invalid PAN (e.g. ABCDE1234F)"),
  }),
  yup.object().shape({
    bankName: yup.string().required("Bank name is required").max(200),
    branchName: yup.string().required("Branch name is required").max(200),
    accountNumber: yup
      .string()
      .required("Account number is required")
      .matches(/^\d{9,18}$/, "Must be 9-18 digits"),
    confirmAccountNumber: yup
      .string()
      .required("Confirm account number")
      .oneOf([yup.ref("accountNumber")], "Account numbers do not match"),
    ifscCode: yup
      .string()
      .required("IFSC code is required")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC (e.g. SBIN0000001)"),
  }),
];

const initialForm = {
  vendorName: "",
  vendorType: "",
  contactPerson: "",
  mobileNumber: "",
  email: "",
  companyName: "",
  companyAddress: "",
  city: "",
  state: "",
  country: "India",
  pinCode: "",
  gstNumber: "",
  panNumber: "",
  bankName: "",
  branchName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
};

export default function VendorRegisterPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formLoading } = useSelector((s) => s.vendors);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const set = (field) => (e) => {
    let value = e.target.value;
    if (["gstNumber", "panNumber", "ifscCode"].includes(field))
      value = value.toUpperCase();
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    stepSchemas[step]
      .validateAt(field, form)
      .then(() => setErrors((prev) => ({ ...prev, [field]: undefined })))
      .catch((err) => setErrors((prev) => ({ ...prev, [field]: err.message })));
  };

  const validateStep = async () => {
    try {
      await stepSchemas[step].validate(form, { abortEarly: false });
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
      setTouched((p) => ({ ...p, ...at }));
      return false;
    }
  };

  const handleNext = async () => {
    if (await validateStep()) setStep(step + 1);
  };
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!(await validateStep())) return;
    const { confirmAccountNumber, ...payload } = form;
    const result = await dispatch(registerVendor(payload));
    if (!result.error) {
      toast.success("Vendor registered. Now upload documents.");
      const vendorId = result.payload?.id;
      navigate(vendorId ? `/vendors/${vendorId}` : "/vendors");
    } else toast.error(result.payload);
  };

  return (
    <div>
      <button
        onClick={() => navigate("/vendors")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Vendors
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t("vendor.register")}
      </h1>

      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${i < step ? "bg-primary-500 text-white" : i === step ? "bg-primary-500 text-white ring-4 ring-primary-100" : "bg-gray-200 text-gray-500"}`}
            >
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">
              {t(`vendor.${s}`)}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`w-8 lg:w-16 h-0.5 ${i < step ? "bg-primary-500" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label={t("vendor.form.vendorName")}
              value={form.vendorName}
              onChange={set("vendorName")}
              onBlur={handleBlur("vendorName")}
              error={touched.vendorName && errors.vendorName}
              required
            />
            <Select
              label={t("vendor.form.vendorType")}
              options={VENDOR_TYPES}
              value={form.vendorType}
              onChange={set("vendorType")}
              error={touched.vendorType && errors.vendorType}
            />
            <Input
              label={t("vendor.form.contactPerson")}
              value={form.contactPerson}
              onChange={set("contactPerson")}
              onBlur={handleBlur("contactPerson")}
              error={touched.contactPerson && errors.contactPerson}
              required
            />
            <Input
              label={t("vendor.form.mobile")}
              value={form.mobileNumber}
              onChange={set("mobileNumber")}
              onBlur={handleBlur("mobileNumber")}
              error={touched.mobileNumber && errors.mobileNumber}
              placeholder="9XXXXXXXXX"
              maxLength={10}
              required
            />
            <Input
              label={t("vendor.form.email")}
              type="email"
              value={form.email}
              onChange={set("email")}
              onBlur={handleBlur("email")}
              error={touched.email && errors.email}
              required
            />
          </div>
        )}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Input
                label={t("vendor.form.companyName")}
                value={form.companyName}
                onChange={set("companyName")}
                onBlur={handleBlur("companyName")}
                error={touched.companyName && errors.companyName}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Company Address"
                value={form.companyAddress}
                onChange={set("companyAddress")}
                onBlur={handleBlur("companyAddress")}
                error={touched.companyAddress && errors.companyAddress}
                required
              />
            </div>
            <Input
              label={t("vendor.form.city")}
              value={form.city}
              onChange={set("city")}
              onBlur={handleBlur("city")}
              error={touched.city && errors.city}
              required
            />
            <Input
              label={t("vendor.form.state")}
              value={form.state}
              onChange={set("state")}
              onBlur={handleBlur("state")}
              error={touched.state && errors.state}
              required
            />
            <Input
              label="Country"
              value={form.country}
              onChange={set("country")}
              onBlur={handleBlur("country")}
              error={touched.country && errors.country}
              required
            />
            <Input
              label={t("vendor.form.pinCode")}
              value={form.pinCode}
              onChange={set("pinCode")}
              onBlur={handleBlur("pinCode")}
              error={touched.pinCode && errors.pinCode}
              placeholder="700091"
              maxLength={6}
              required
            />
          </div>
        )}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label={t("vendor.form.gstNumber")}
              value={form.gstNumber}
              onChange={set("gstNumber")}
              onBlur={handleBlur("gstNumber")}
              error={touched.gstNumber && errors.gstNumber}
              placeholder="22AAAAA0000A1Z5"
              required
            />
            <Input
              label={t("vendor.form.panNumber")}
              value={form.panNumber}
              onChange={set("panNumber")}
              onBlur={handleBlur("panNumber")}
              error={touched.panNumber && errors.panNumber}
              placeholder="ABCDE1234F"
              required
            />
          </div>
        )}
        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label={t("vendor.form.bankName")}
              value={form.bankName}
              onChange={set("bankName")}
              onBlur={handleBlur("bankName")}
              error={touched.bankName && errors.bankName}
              required
            />
            <Input
              label={t("vendor.form.branchName")}
              value={form.branchName}
              onChange={set("branchName")}
              onBlur={handleBlur("branchName")}
              error={touched.branchName && errors.branchName}
              required
            />
            <Input
              label={t("vendor.form.accountNumber")}
              type="password"
              value={form.accountNumber}
              onChange={set("accountNumber")}
              onBlur={handleBlur("accountNumber")}
              error={touched.accountNumber && errors.accountNumber}
              required
            />
            <Input
              label={t("vendor.form.confirmAccount")}
              type="password"
              value={form.confirmAccountNumber}
              onChange={set("confirmAccountNumber")}
              onBlur={handleBlur("confirmAccountNumber")}
              error={
                touched.confirmAccountNumber && errors.confirmAccountNumber
              }
              required
            />
            <Input
              label={t("vendor.form.ifscCode")}
              value={form.ifscCode}
              onChange={set("ifscCode")}
              onBlur={handleBlur("ifscCode")}
              error={touched.ifscCode && errors.ifscCode}
              placeholder="SBIN0000001"
              required
            />
          </div>
        )}

        <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
          {step > 0 ? (
            <Button variant="secondary" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={formLoading}>
              <Check className="w-4 h-4" />
              {t("vendor.form.submit")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
