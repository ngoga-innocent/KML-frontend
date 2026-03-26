import { useState } from "react";
import {
  useGetApplicationsQuery,
  useReviewApplicationMutation,
  useUploadContractMutation,
  useFinalizeLoanMutation,
} from "../../api/loanapplication";
import { toast } from "react-toastify";
import { FiUpload, FiCheck, FiX } from "react-icons/fi";
import TableSkeleton from "../../components/Loaders/TableSkeleton";
import CardSkeleton from "../../components/Loaders/CardSkeleton";

export default function LoanApplications() {
  const { data: applications = [], isLoading } = useGetApplicationsQuery(
    undefined,
    { refetchOnMountOrArgChange: true },
  );
  console.log(applications);
  const [review] = useReviewApplicationMutation();
  const [uploadContract] = useUploadContractMutation();
  const [finalize] = useFinalizeLoanMutation();

  const [modal, setModal] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [detailModal, setDetailModal] = useState<any>(null);

  const handleReview = async () => {
    try {
      await review({
        id: modal.id,
        decision: modal.decision,
        comment,
      }).unwrap();

      toast.success("Application updated");
      setModal(null);
      setComment("");
    } catch {
      toast.error("Failed");
    }
  };

  const handleUpload = async (id: number, file: File) => {
    try {
      await uploadContract({ id, file }).unwrap();
      toast.success("Contract uploaded");
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleFinalize = async (id: number) => {
    try {
      await finalize(id).unwrap();
      toast.success("Loan created");
    } catch (err: any) {
      console.log(err);

      toast.error("Finalize failed");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Loan Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and process client loan applications
          </p>
        </div>
      </div>
      {!isLoading && <ApplicationStats applications={applications} />}

      {/* DESKTOP TABLE */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="hidden md:block bg-white shadow rounded-2xl overflow-x-auto">
          <table className="min-w-250 divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Loan Type
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Contract
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Signed
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setDetailModal(app)}
                >
                  <td className="px-3 py-2 font-medium text-slate-800">
                    {app.client_data?.names || "Client"}
                  </td>
                  <td className="px-3 py-2">{app.loan_type_details?.name}</td>
                  <td className="px-3 py-2 text-right font-semibold">
                    RF {app.requested_amount.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "reviewed"
                            ? "bg-blue-100 text-blue-700"
                            : app.status === "signed"
                              ? "bg-purple-100 text-purple-700"
                              : app.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {app.contract ? (
                      <a
                        href={app.contract}
                        target="_blank"
                        className="text-blue-600 text-xs underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Not uploaded
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {app.is_signed ? (
                      <span className="text-green-600 text-xs font-medium">
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-500 text-xs">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-right space-x-2 flex justify-end items-center">
                    {/* ACTIONS */}
                    {app.status === "pending" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModal({ id: app.id, decision: "approve" });
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition"
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModal({ id: app.id, decision: "reject" });
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
                        >
                          <FiX /> Reject
                        </button>
                      </>
                    )}
                    {app.status === "reviewed" && (
                      <label
                        className={`cursor-pointer flex items-center gap-1 px-3 py-1 rounded text-white text-xs ${
                          app.contract
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-black hover:bg-gray-800"
                        }`}
                      >
                        <FiUpload /> {app.contract ? "Replace" : "Upload Contract"}
                        <input
                          hidden
                          type="file"
                          onChange={(e) =>
                            e.target.files &&
                            handleUpload(app.id, e.target.files[0])
                          }
                        />
                      </label>
                    )}
                    {app.status === "signed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFinalize(app.id);
                        }}
                        className="px-3 py-1 bg-black hover:bg-gray-800 text-white text-xs rounded transition"
                      >
                        Finalize
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MOBILE CARD LAYOUT */}
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="md:hidden space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white shadow rounded-2xl p-4 space-y-2 cursor-pointer"
              onClick={() => setDetailModal(app)}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-slate-800">
                  {app.client_data?.names || "Client"}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded font-medium ${
                    app.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : app.status === "reviewed"
                        ? "bg-blue-100 text-blue-700"
                        : app.status === "signed"
                          ? "bg-purple-100 text-purple-700"
                          : app.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                  }`}
                >
                  {app.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Loan Type: {app.loan_type_details?.name}
              </div>
              <div className="text-sm font-semibold">
                Amount: RWF{app.requested_amount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 flex justify-between">
                <span>Signed: {app.is_signed ? "Yes" : "No"}</span>
                <span>
                  Created: {new Date(app.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APPLICATION DETAILS MODAL */}
      {detailModal && (
        <ApplicationDetails
          app={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}

      {/* REVIEW MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {modal.decision === "approve"
                ? "Approve Application"
                : "Reject Application"}
            </h2>
            <textarea
              placeholder="Add comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReview}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function ApplicationStats({ applications }: any) {
  const stats = applications.reduce(
    (acc: any, app: any) => {
      acc.total += 1;
      acc.amount += Number(app.requested_amount || 0);

      if (app.status === "pending") acc.pending += 1;
      if (app.status === "reviewed") acc.reviewed += 1;
      if (app.status === "signed") acc.signed += 1;
      if (app.status === "approved") acc.approved += 1;
      if (app.status === "rejected") acc.rejected += 1;

      return acc;
    },
    {
      total: 0,
      amount: 0,
      pending: 0,
      reviewed: 0,
      signed: 0,
      approved: 0,
      rejected: 0,
    },
  );

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      notation: "compact",
    }).format(v);

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      <Stat title="Total" value={stats.total} />
      <Stat title="Pending" value={stats.pending} />
      <Stat title="Reviewed" value={stats.reviewed} />
      <Stat title="Signed" value={stats.signed} />
      <Stat title="Approved" value={stats.approved} />
      <Stat title="Volume" value={formatCurrency(stats.amount)} />
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="font-semibold text-lg mt-1">{value}</h2>
    </div>
  );
}
function StatusBadge({ status }: any) {
  const styles: any = {
    pending: "bg-yellow-100 text-yellow-700",
    reviewed: "bg-blue-100 text-blue-700",
    signed: "bg-purple-100 text-purple-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
function Workflow({ status }: any) {
  const steps = ["pending", "reviewed", "signed", "approved"];

  return (
    <div className="flex justify-between mt-4">
      {steps.map((step, i) => {
        const active = steps.indexOf(status) >= i;

        return (
          <div key={step} className="flex-1 text-center">
            <div
              className={`w-6 h-6 mx-auto rounded-full ${
                active ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <p className="text-xs mt-1 capitalize">{step}</p>
          </div>
        );
      })}
    </div>
  );
}
function ApplicationDetails({ app, onClose }: any) {
  return (
    <div
      className={`fixed inset-0 z-50 ${
        app ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          app ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* DRAWER */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl transform transition-transform duration-300 ${
          app ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between p-5 border-b">
            <div>
              <h2 className="text-lg font-semibold">Application #{app.id}</h2>
              <p className="text-xs text-gray-400">Loan request details</p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
            {/* CLIENT */}
            <Section title="Client Info">
              <Info label="Name" value={app.client_data?.names} />
              <Info label="Reviewed By" value={app.reviewed_by || "—"} />
            </Section>

            {/* LOAN */}
            <Section title="Loan Details">
              <Info label="Loan Type" value={app.loan_type_details?.name} />
              <Info
                label="Amount"
                value={formatCurrency(app.requested_amount)}
              />
              <Info
                label="Status"
                value={<StatusBadge status={app.status} />}
              />
            </Section>

            {/* SIGNING */}
            <Section title="Signing">
              <Info label="Signed" value={app.is_signed ? "Yes" : "No"} />
              <Info
                label="Signed At"
                value={
                  app.signed_at ? new Date(app.signed_at).toLocaleString() : "—"
                }
              />
            </Section>

            {/* DOCUMENTS */}
            <Section title="Documents">
              <Doc label="Contract" url={app.contract} />
              <Doc label="Signed Contract" url={app.signed_contract} />
            </Section>

            {/* COMMENT */}
            {app.comment && (
              <Section title="Admin Comment">
                <p className="bg-gray-50 p-3 rounded-lg">{app.comment}</p>
              </Section>
            )}

            {/* META */}
            <Section title="Metadata">
              <Info
                label="Created"
                value={new Date(app.created_at).toLocaleString()}
              />
            </Section>

            {/* WORKFLOW */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Workflow</p>
              <Workflow status={app.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Section({ title, children }: any) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Doc({ label, url }: any) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      {url ? (
        <a
          href={url}
          target="_blank"
          className="text-blue-600 hover:underline text-xs"
        >
          View
        </a>
      ) : (
        <span className="text-gray-400 text-xs">Not available</span>
      )}
    </div>
  );
}
const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
  }).format(v);

function Info({ label, value }: any) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-500 text-xs whitespace-nowrap">{label}</span>

      <div className="text-right font-medium text-slate-800 wrap-break-word">
        {value || "—"}
      </div>
    </div>
  );
}
