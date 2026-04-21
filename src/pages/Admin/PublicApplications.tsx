import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetPublicApplicationsQuery,
  useReviewPublicApplicationMutation,
  useConvertPublicApplicationMutation,
  useRejectPublicApplicationMutation,
} from "../../api/loanapplication";
import { toast } from "react-toastify";
import { url } from "../../url";
import {
  FaUser,
  FaHome,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaFilePdf,
} from "react-icons/fa";
export default function PublicApplicationsDashboard() {
  const role = useSelector((state: any) => state.auth.role);

  const { data, isLoading, isError } = useGetPublicApplicationsQuery<any>();
  console.log(data);
  const [review] = useReviewPublicApplicationMutation();
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [convertPublicApplication, { isLoading: converting }] =
    useConvertPublicApplicationMutation();
  const [reject] = useRejectPublicApplicationMutation();

  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);


  const [linkExisting, setLinkExisting] = useState(false);

  // =========================
  // HANDLERS
  // =========================
  const handleReview = async (id: number) => {
    try {
      await review(id).unwrap();
      setShowConvertModal(false);
      toast.success("Marked as reviewed");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed");
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    await reject({ id, comment: reason }).unwrap();
    toast.success("Rejected");
  };

  const handleConvertSubmit = async () => {
    if (!selectedApp) return;

    const formData = new FormData();

    // if (!linkExisting) {
    //   if (!files.id_document && !files.job_contract && !files.bank_statement) {
    //     return toast.error("Upload at least one document");
    //   }

    //   Object.entries(files).forEach(([key, value]: any) => {
    //     if (value) formData.append(key, value);
    //   });
    // }

    formData.append("link_existing", linkExisting ? "true" : "false");

    try {
      console.log(selectedApp.id, formData);
      await convertPublicApplication({
        id: selectedApp.id,
        body: formData,
      }).unwrap();
      toast.success("Client registered successfully");

      setShowConvertModal(false);
      
      setLinkExisting(false);
    } catch (err: any) {
      console.log(err);
      toast.error(err?.data?.detail || err?.data?.error || "Conversion failed");
    }
  };

  // =========================
  // STATUS BADGE
  // =========================
  const StatusBadge = ({ status }: any) => {
    const styles: any = {
      pending: "bg-yellow-100 text-yellow-700",
      reviewed: "bg-blue-100 text-blue-700",
      converted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
        {status}
      </span>
    );
  };
  const openFile = async (type: string) => {
    if (!selectedApp) return;

    try {
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      if (!token)
        return toast.error("You are not authorized. Please login again.");

      const response = await fetch(
        `${url}/api/loans/admin/public-applications/${selectedApp.id}/view-file?type=${type}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok)
        throw new Error(
          `Failed to fetch file,seems like no ${type} was uploaded`,
        );
      const blob = await response.blob();
      console.log(blob);
      const fileType = blob.type || "application/octet-stream";

      const fileURL = URL.createObjectURL(new Blob([blob], { type: fileType }));
      if (fileURL) {
        setPreviewFile({ url: fileURL, name: type });
      } else {
        toast.error("Failed to open file,no file uploaded");
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to open file, seems like no ${type} was uploaded`);
    }
  };

  // =========================
  // DRAWER (FULL DETAILS)
  // =========================
  const Drawer = () => {
    if (!selectedApp) return null;

    return (
      <div className="fixed inset-0 z-50 flex font-sans text-gray-500 text-sm">
        {/* Overlay */}
        <div
          className="flex-1 bg-black/50 transition-opacity"
          onClick={() => setSelectedApp(null)}
        />

        {/* Drawer Panel */}
        <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-xl p-8 space-y-8">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Application Details
            </h2>
            <button
              onClick={() => setSelectedApp(null)}
              className="text-gray-500 hover:text-red-600 transition"
              title="Close"
            >
              <FaTimesCircle size={24} />
            </button>
          </div>

          {/* APPLICANT */}
          <div className="flex items-start gap-4">
            <FaUser className="text-blue-500 mt-1" size={22} />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-700">Applicant</h3>
              <p>
                <span className="font-medium">Name:</span>{" "}
                {selectedApp.full_name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {selectedApp.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {selectedApp.phone}
              </p>
              <p>
                <span className="font-medium">National ID:</span>{" "}
                {selectedApp.national_id}
              </p>
              <p>
                <span className="font-medium">Gender:</span>{" "}
                {selectedApp.gender}
              </p>
              <p>
                <span className="font-medium">Marital Status:</span>{" "}
                {selectedApp.marital_status}
              </p>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="flex items-start gap-4">
            <FaHome className="text-green-500 mt-1" size={22} />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-700">Address</h3>
              <p>
                {selectedApp.district}, {selectedApp.sector}
              </p>
              <p>
                {selectedApp.cell}, {selectedApp.village}
              </p>
            </div>
          </div>

          {/* EMPLOYMENT */}
          <div className="flex items-start gap-4">
            <FaBriefcase className="text-yellow-500 mt-1" size={22} />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-700">
                Employment
              </h3>
              <p>
                <span className="font-medium">Company:</span>{" "}
                {selectedApp.employer}
              </p>
              <p>
                <span className="font-medium">Position:</span>{" "}
                {selectedApp.position}
              </p>
              <p>
                <span className="font-medium">Supervisor:</span>{" "}
                {selectedApp.supervisor}
              </p>
              <p>
                <span className="font-medium">Employer Phone:</span>{" "}
                {selectedApp.employer_phone}
              </p>
              <p>
                <span className="font-medium">Salary:</span>{" "}
                {selectedApp.salary} RWF
              </p>
            </div>
          </div>

          {/* LOAN */}
          <div className="flex items-start gap-4">
            <FaFileAlt className="text-purple-500 mt-1" size={22} />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-700">Loan</h3>
              <p>
                <span className="font-medium">Amount:</span>{" "}
                {selectedApp.requested_amount} RWF
              </p>
              <p>
                <span className="font-medium">In Words:</span>{" "}
                {selectedApp.loan_words}
              </p>
              <p>
                <span className="font-medium">Type:</span>{" "}
                {selectedApp.loan_type_details.name}
              </p>
              <ul className="text-gray-500 text-sm ml-4">
                <li>
                  <span className="font-medium">Minimum Amount:</span>{" "}
                  {selectedApp.loan_type_details.min_amount} RWF
                </li>
                <li>
                  <span className="font-medium">Maximum Amount:</span>{" "}
                  {selectedApp.loan_type_details.max_amount} RWF
                </li>
                <li>
                  <span className="font-medium">Interest Rate:</span>{" "}
                  {selectedApp.loan_type_details.interest_rate}%
                </li>
                <li>
                  <span className="font-medium">Repayment Period:</span>{" "}
                  {selectedApp.loan_type_details.repayment_period_value}{" "}
                  {selectedApp.loan_type_details.repayment_period_unit}
                </li>
              </ul>
            </div>
          </div>

          {/* STATUS */}
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-600" />
            <StatusBadge status={selectedApp.status} />
          </div>

          {/* DOCUMENTS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => openFile("id")}
              className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 p-2 rounded shadow hover:bg-blue-200 transition"
            >
              <FaFilePdf /> View ID
            </button>
            <button
              onClick={() => openFile("contract")}
              className="flex items-center justify-center gap-2 bg-yellow-100 text-yellow-700 p-2 rounded shadow hover:bg-yellow-200 transition"
            >
              <FaFilePdf /> Job Contract
            </button>
            <button
              onClick={() => openFile("bank")}
              className="flex items-center justify-center gap-2 bg-purple-100 text-purple-700 p-2 rounded shadow hover:bg-purple-200 transition"
            >
              <FaFilePdf /> Bank Statement
            </button>
          </div>

          {/* ACTIONS */}
          {["admin", "manager"].includes(role) && (
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {selectedApp.status === "pending" && (
                <button
                  onClick={() => handleReview(selectedApp.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded shadow hover:bg-blue-700 transition"
                >
                  <FaCheckCircle /> Review
                </button>
              )}

              {selectedApp.status === "reviewed" && (
                <>
                  <button
                    onClick={() => setShowConvertModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded shadow hover:bg-green-700 transition"
                  >
                    <FaCheckCircle /> Register Client
                  </button>

                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white p-3 rounded shadow hover:bg-red-700 transition"
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </>
              )}
            </div>
          )}

          <button
            onClick={() => setSelectedApp(null)}
            className="w-full mt-6 border border-gray-300 p-3 rounded hover:bg-gray-100 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  //===== Preview =====
  const FilePreviewModal = () => {
    if (!previewFile) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black/50">
        <div className="relative w-full max-w-4xl bg-white h-max-[90vh] h-[90vh] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold text-lg">
              {previewFile.name.toUpperCase()}
            </h3>
            <button
              onClick={() => setPreviewFile(null)}
              className="text-red-500 font-bold"
            >
              Close
            </button>
          </div>
          <iframe
            src={previewFile.url}
            className="w-full h-full"
            title="Document Preview"
          ></iframe>
        </div>
      </div>
    );
  };

  // =========================
  // CONVERT MODAL
  // =========================
  const ConvertModal = ({
  clientName,
  handleConvertSubmit,
  setShowConvertModal,
  converting,
}: any) => {
  const [typedName, setTypedName] = useState("");
  const isConfirmed = typedName === clientName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowConvertModal(false)}
      />
      <div className="relative bg-white w-full max-w-md rounded-xl p-6 space-y-5 shadow-xl">
        <h3 className="text-lg font-bold text-red-600">
          ⚠️ Confirm Client Conversion
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>You are about to convert this application into a registered client.</p>
          <p className="font-medium text-red-500">This action is <strong>irreversible</strong>.</p>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>The applicant will be permanently registered as a client</li>
            <li>This process cannot be undone</li>
            <li>Ensure all documents and details have been verified</li>
          </ul>
          <p className="pt-2">To confirm, type the client's full name below:</p>
        </div>
        <input
          type="text"
          value={typedName}
          onChange={(e) => setTypedName(e.target.value)}
          placeholder={`Type "${clientName}" to confirm`}
          className="w-full border border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setShowConvertModal(false)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConvertSubmit}
            disabled={converting || !isConfirmed}
            className="w-full bg-red-600 text-white p-2 rounded disabled:opacity-50"
          >
            {converting ? "Processing..." : "Confirm Conversion"}
          </button>
        </div>
      </div>
    </div>
  );
};

  // =========================
  // UI
  // =========================
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Public Applications</h1>

      <div className="bg-white rounded-xl shadow">
        {isLoading && <div className="p-6 text-center">Loading...</div>}

        {isError && (
          <div className="p-6 text-center text-red-500">
            Failed to load applications
          </div>
        )}

        {!isLoading && !data?.length && (
          <div className="p-6 text-center">No applications</div>
        )}

        <table className="w-full text-sm">
          <tbody>
            {data?.map((app: any) => (
              <tr
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-4">{app.full_name}</td>
                <td className="p-4">{app.requested_amount} RWF</td>
                <td className="p-4">
                  <StatusBadge status={app.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer />
      {selectedApp && showConvertModal && (
        <ConvertModal
          clientName={selectedApp.full_name}
          handleConvertSubmit={handleConvertSubmit}
          setShowConvertModal={setShowConvertModal}
          converting={converting}
        />
      )}
      <FilePreviewModal />
    </div>
  );
}
