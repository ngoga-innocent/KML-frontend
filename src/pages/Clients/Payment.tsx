import { useState, useMemo } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useCreatePaymentMutation,
  useGetPaymentsQuery,
  useReviewPaymentMutation,
} from "../../api/paymentApi";
import { useGetLoansQuery } from "../../api/loanApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const PaymentPage = () => {
  const { data, isLoading, isError } = useGetPaymentsQuery<any>(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: loansData } = useGetLoansQuery();
  const { role } = useSelector((state: RootState) => state.auth);

  const [createPayment] = useCreatePaymentMutation();
  const [reviewPayment] = useReviewPaymentMutation();

  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    loan: "",
    amount_paid: "",
    payment_proof: null as File | null,
  });

  /* ================= SAFE DATA ================= */

  const payments = Array.isArray(data) ? data : data?.results || [];
  const loans = Array.isArray(loansData) ? loansData : loansData?.results || [];

  /* ================= FIXED LOAN FILTER ================= */

  const activeLoans = loans.filter((l: any) => {
    const remaining = Number(l.remaining_balance || 0);
    const isNotPaid = l.status !== "paid"; // Adjust 'paid' to match your exact string
    return remaining > 0 && isNotPaid;
  });

  const selectedLoan = activeLoans.find((l: any) => String(l.id) === form.loan);

  /* ================= SUMMARY ================= */

  const summary = useMemo(() => {
    let total = 0;
    let pending = 0;
    let approved = 0;

    payments.forEach((p: any) => {
      if (p.status === "approved") {
        total += Number(p.amount_paid || 0);
        approved++;
      }
      if (p.status === "pending") pending++;
    });

    return { total, pending, approved };
  }, [payments]);

  /* ================= FILTER ================= */

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((p: any) => p.status === filter);

  /* ================= HELPERS ================= */

  const formatAmount = (v: number) => `${Number(v || 0).toLocaleString()} RWF`;

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString() : "-";

  /* ================= ACTIONS ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.loan || !form.amount_paid || !form.payment_proof) {
      toast.error("All fields including proof are required");
      return;
    }

    if (
      selectedLoan &&
      Number(form.amount_paid) > Number(selectedLoan.remaining_balance)
    ) {
      toast.error("Amount exceeds remaining balance");
      return;
    }

    const formData = new FormData();
    formData.append("loan_id", form.loan);
    formData.append("amount_paid", form.amount_paid);
    formData.append("payment_proof", form.payment_proof);

    try {
      await createPayment(formData).unwrap();
      toast.success("Payment submitted successfully");

      setForm({
        loan: "",
        amount_paid: "",
        payment_proof: null,
      });
    } catch (err: any) {
      console.log(err);

      toast.error(err?.data?.error || err?.data[0] || "Payment failed");
    }
  };

  const handleReview = async (id: number, action: "approve" | "reject") => {
    try {
      await reviewPayment({ id, action }).unwrap();
      toast.success(`Payment ${action}d`);
    } catch (err: any) {
      console.log(err);

      toast.error(err?.data?.error || "Action failed");
    }
  };

  /* ================= STATES ================= */

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-500">Error loading data</p>;

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Payments</h1>

        <select
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p>Total Paid</p>
          <h2 className="text-xl font-bold">{formatAmount(summary.total)}</h2>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl">
          Pending: {summary.pending}
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          Approved: {summary.approved}
        </div>
      </div>

      {/* PAYMENT FORM */}
      {role === "client" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="font-semibold">Make Payment</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* LOAN SELECT */}
            <select
              value={form.loan}
              onChange={(e) => setForm({ ...form, loan: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Select Loan</option>

              {activeLoans.map((l: any) => (
                <option key={l.id} value={l.id}>
                  #{l.id} - Balance:{" "}
                  {Number(l.remaining_balance).toLocaleString()} RWF
                </option>
              ))}
            </select>

            {/* EMPTY STATE */}
            {activeLoans.length === 0 && (
              <p className="text-sm text-gray-500">
                No active loans available for payment
              </p>
            )}

            {/* LOAN DETAILS */}
            {selectedLoan && (
              <div className="bg-gray-50 p-3 rounded-lg">
                Remaining:{" "}
                <strong>
                  {formatAmount(Number(selectedLoan.remaining_balance))}
                </strong>
              </div>
            )}

            {/* AMOUNT */}
            <input
              type="number"
              placeholder="Amount"
              value={form.amount_paid}
              onChange={(e) =>
                setForm({ ...form, amount_paid: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
              required
            />

            {/* FILE */}
            <input
              type="file"
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  payment_proof: e.target.files?.[0] || null,
                })
              }
            />

            <button className="w-full bg-primary text-white py-3 rounded-lg">
              Submit Payment
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Loan</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Reference</th>
                <th className="p-3">Proof</th>
                <th className="p-3">Date</th>
                <th className="p-3">Schedule</th>
                <th className="p-3">Reviewed By</th>
                <th className="p-3">Status</th>
                {role !== "client" && <th className="p-3">Actions</th>}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filteredPayments.map((p: any) => (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                  {/* LOAN */}
                  <td className="p-3">
                    <div className="font-medium">#{p.loan?.id || p.loan}</div>
                    {p.loan?.client_names && (
                      <p className="text-xs text-gray-500">
                        {p.loan.client_names}
                      </p>
                    )}
                  </td>

                  {/* AMOUNT */}
                  <td className="p-3 font-semibold text-gray-800">
                    {formatAmount(p.amount_paid)}
                  </td>

                  {/* REFERENCE */}
                  <td className="p-3 text-gray-600">{p.reference || "-"}</td>

                  {/* PROOF */}
                  <td className="p-3">
                    {p.payment_proof ? (
                      <a
                        href={p.payment_proof}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">No file</span>
                    )}
                  </td>

                  {/* DATE */}
                  <td className="p-3 text-gray-600">
                    {formatDate(p.payment_date)}
                  </td>

                  {/* SCHEDULE */}
                  <td className="p-3 text-gray-600">
                    {p.schedule?.installment_number
                      ? `#${p.schedule.installment_number}`
                      : "-"}
                  </td>

                  {/* REVIEWED BY */}
                  <td className="p-3 text-gray-600">
                    {p.reviewed_by?.username || "-"}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        p.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : p.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  {role !== "client" && (
                    <td className="p-3">
                      {p.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(p.id, "approve")}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition"
                          >
                            <FiCheck size={16} />
                          </button>

                          <button
                            onClick={() => handleReview(p.id, "reject")}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}

              {/* EMPTY STATE */}
              {filteredPayments.length === 0 && (
                <tr>
                  <td
                    colSpan={role !== "client" ? 9 : 8}
                    className="text-center p-6 text-gray-500"
                  >
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
