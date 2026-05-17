export const VENDOR_TYPES = [
  { value: "MANUFACTURER", label: "Manufacturer" },
  { value: "DISTRIBUTOR", label: "Distributor" },
  { value: "SERVICE_PROVIDER", label: "Service Provider" },
];

export const USER_TYPES = [
  { value: "ADMIN", label: "Admin" },
  { value: "PROCUREMENT", label: "Procurement" },
  { value: "FINANCE", label: "Finance" },
];

export const VENDOR_STATUS_COLORS = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  FINANCE_VERIFICATION: "bg-purple-100 text-purple-700",
  APPROVE: "bg-green-100 text-green-700",
  REJECT: "bg-red-100 text-red-700",
  ACTIVE: "bg-emerald-100 text-emerald-800",
};

export const APPROVAL_ACTIONS = {
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  SEND_BACK: "SEND_BACK",
};

export const DOCUMENT_TYPES = [
  { value: "GST_CERTIFICATE", label: "GST Certificate" },
  { value: "PAN_CARD", label: "PAN Card" },
];

export const PAGE_SIZE = 10;
