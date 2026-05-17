import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  FileText,
  Eye,
  Download,
  X,
} from "lucide-react";
import {
  fetchVendorById,
  uploadDocument,
  approveVendor,
  activateVendor,
} from "./vendorThunks";
import { clearSelected } from "./vendorSlice";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import { APPROVAL_ACTIONS, DOCUMENT_TYPES } from "../../utils/constants";
import { formatDateTime } from "../../utils/helpers";
import { getAccessToken } from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";

export default function VendorDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    selected: vendor,
    loading,
    formLoading,
  } = useSelector((s) => s.vendors);
  const { hasPermission } = useAuth();

  const [uploadModal, setUploadModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(null);
  const [previewModal, setPreviewModal] = useState(null); // { url, contentType, fileName }
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    dispatch(fetchVendorById(id));
    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, id]);

  const handleUpload = async () => {
    if (!file || !docType) {
      toast.error("Select document type and file");
      return;
    }
    const result = await dispatch(
      uploadDocument({ vendorId: id, file, documentType: docType }),
    );
    if (!result.error) {
      toast.success("Document uploaded");
      setUploadModal(false);
      setFile(null);
      setDocType("");
      dispatch(fetchVendorById(id));
    } else toast.error(result.payload);
  };

  const handleApproval = async () => {
    const level =
      vendor.status === "SUBMITTED" || vendor.status === "UNDER_REVIEW"
        ? "PROCUREMENT"
        : "FINANCE";
    const result = await dispatch(
      approveVendor({
        vendorId: id,
        data: { level, action: approvalModal, remarks },
      }),
    );
    if (!result.error) {
      toast.success("Action processed");
      setApprovalModal(null);
      setRemarks("");
      dispatch(fetchVendorById(id));
    } else toast.error(result.payload);
  };

  const handleActivate = async () => {
    const result = await dispatch(activateVendor(id));
    if (!result.error) toast.success("Vendor activated");
    else toast.error(result.payload);
  };

  /** Build authenticated URL for document viewing */
  const getDocUrl = (doc) => endpoints.vendors.documentFile(id, doc.id);

  const handleViewDoc = async (doc) => {
    const url = getDocUrl(doc);
    const token = getAccessToken();
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const blob = await res.blob();
      const typedBlob = new Blob([blob], {
        type: doc.contentType || blob.type,
      });
      const blobUrl = URL.createObjectURL(typedBlob);

      if (doc.contentType?.startsWith("image/")) {
        // Images — open in modal
        setPreviewModal({
          url: blobUrl,
          contentType: doc.contentType,
          fileName: doc.fileName,
        });
      } else {
        // PDFs — open directly in new browser tab
        window.open(blobUrl, "_blank");
      }
    } catch {
      toast.error("Failed to load document");
    }
  };

  /** Download document */
  const handleDownloadDoc = async (doc) => {
    const url = getDocUrl(doc);
    const token = getAccessToken();
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = doc.fileName;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download");
    }
  };

  if (loading || !vendor) return <Loader />;

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
      <span className="text-sm text-gray-500 sm:w-40 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900">
        {value || "\u2014"}
      </span>
    </div>
  );

  return (
    <div>
      <button
        onClick={() => navigate("/vendors")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {vendor.vendorName}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {vendor.vendorCode || "Pending activation"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={vendor.status} />
          {vendor.status === "APPROVED" && hasPermission("vendor:activate") && (
            <Button size="sm" onClick={handleActivate}>
              <Zap className="w-4 h-4" />
              {t("vendor.approval.activate")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {t("vendor.form.basicInfo")}
            </h3>
            <InfoRow label="Contact" value={vendor.contactPerson} />
            <InfoRow label="Email" value={vendor.email} />
            <InfoRow label="Mobile" value={vendor.mobileNumber} />
            <InfoRow label="Type" value={vendor.vendorType} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {t("vendor.form.businessInfo")}
            </h3>
            <InfoRow label="Company" value={vendor.companyName} />
            <InfoRow label="Address" value={vendor.companyAddress} />
            <InfoRow label="City" value={vendor.city} />
            <InfoRow label="State" value={vendor.state} />
            <InfoRow label="Country" value={vendor.country} />
            <InfoRow label="Pin Code" value={vendor.pinCode} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {t("vendor.form.taxInfo")}
            </h3>
            <InfoRow label="GST Number" value={vendor.gstNumber} />
            <InfoRow label="PAN Number" value={vendor.panNumber} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {t("vendor.form.bankInfo")}
            </h3>
            <InfoRow label="Bank" value={vendor.bankName} />
            <InfoRow label="Branch" value={vendor.branchName} />
            <InfoRow label="Account" value={vendor.maskedAccountNumber} />
            <InfoRow label="IFSC" value={vendor.ifscCode} />
          </div>
        </div>

        <div className="space-y-6">
          {/* Documents with View/Download */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {t("vendor.documents.title")}
              </h3>
              {(vendor.status === "SUBMITTED" ||
                vendor.status === "UNDER_REVIEW") &&
                hasPermission("vendor:create") && (
                  <button
                    onClick={() => setUploadModal(true)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </button>
                )}
            </div>
            {vendor.documents?.length > 0 ? (
              vendor.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
                >
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {doc.documentType?.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleViewDoc(doc)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadDoc(doc)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No documents uploaded</p>
            )}
          </div>

          {/* Approval Actions */}
          {hasPermission("vendor:approve") &&
            ["SUBMITTED", "UNDER_REVIEW", "FINANCE_VERIFICATION"].includes(
              vendor.status,
            ) && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <h3 className="font-semibold text-gray-900">Actions</h3>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => setApprovalModal(APPROVAL_ACTIONS.APPROVE)}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t("vendor.approval.approve")}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="w-full"
                  onClick={() => setApprovalModal(APPROVAL_ACTIONS.REJECT)}
                >
                  <XCircle className="w-4 h-4" />
                  {t("vendor.approval.reject")}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setApprovalModal(APPROVAL_ACTIONS.SEND_BACK)}
                >
                  <RotateCcw className="w-4 h-4" />
                  {t("vendor.approval.sendBack")}
                </Button>
              </div>
            )}

          {/* Approval History */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">
              {t("vendor.approval.title")}
            </h3>
            {vendor.approvalHistory?.length > 0 ? (
              <div className="space-y-3">
                {vendor.approvalHistory.map((a, i) => (
                  <div
                    key={i}
                    className="relative pl-5 border-l-2 border-gray-200 pb-3 last:pb-0"
                  >
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-white border-2 border-primary-500" />
                    <p className="text-sm font-medium text-gray-700">
                      {a.action} — {a.level}
                    </p>
                    {a.remarks && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {a.remarks}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDateTime(a.actionDate)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No approval history</p>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModal}
        onClose={() => setUploadModal(false)}
        title={t("vendor.documents.upload")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="">Select...</option>
              {DOCUMENT_TYPES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
            />
            <p className="text-xs text-gray-400 mt-1">
              {t("vendor.documents.maxSize")}
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} loading={formLoading}>
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      {/* Approval Modal */}
      <Modal
        isOpen={!!approvalModal}
        onClose={() => {
          setApprovalModal(null);
          setRemarks("");
        }}
        title={`${approvalModal?.replace(/_/g, " ")} Vendor`}
      >
        <div className="space-y-4">
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            rows={3}
            placeholder="Enter remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setApprovalModal(null)}>
              Cancel
            </Button>
            <Button
              variant={approvalModal === "REJECTED" ? "danger" : "primary"}
              onClick={handleApproval}
              loading={formLoading}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => {
              URL.revokeObjectURL(previewModal.url);
              setPreviewModal(null);
            }}
          />
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <p className="text-sm font-medium text-gray-700 truncate">
                {previewModal.fileName}
              </p>
              <button
                onClick={() => {
                  URL.revokeObjectURL(previewModal.url);
                  setPreviewModal(null);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center overflow-auto max-h-[75vh] bg-gray-100">
              <img
                src={previewModal.url}
                alt={previewModal.fileName}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
