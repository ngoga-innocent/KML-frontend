import { useState } from "react";
// import { FiCheck, FiX } from "react-icons/fi";
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
  const { data, isLoading, isError } = useGetPaymentsQuery<any>(undefined);
  const { data: loansData } = useGetLoansQuery();
  const { role } = useSelector((state: RootState) => state.auth);

  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();
  const [reviewPayment] = useReviewPaymentMutation();

  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    loan: "",
    amount_paid: "",
    payment_proof: null as File | null,
  });

  const payments = Array.isArray(data) ? data : data?.results || [];
  const loans = Array.isArray(loansData) ? loansData : loansData?.results || [];

  const activeLoans = loans.filter(
    (l: any) =>
      Number(l.remaining_balance) > 0 &&
      l.status !== "paid" &&
      l.status !== "reloaned",
  );

  // const selectedLoan = activeLoans.find(
  //   (l: any) => String(l.id) === form.loan,
  // );

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((p: any) => p.status === filter);

  const formatAmount = (v: number) => `${Number(v || 0).toLocaleString()} RWF`;

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString() : "-";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("loan_id", form.loan);
    formData.append("amount_paid", form.amount_paid);
    if (form.payment_proof)
      formData.append("payment_proof", form.payment_proof);

    try {
      await createPayment(formData).unwrap();
      toast.success("Payment submitted");

      setForm({
        loan: "",
        amount_paid: "",
        payment_proof: null,
      });
    } catch {
      toast.error("Payment failed");
    }
  };

  const handleReview = async (id: number, action: "approve" | "reject") => {
    try {
      await reviewPayment({ id, action }).unwrap();
      toast.success(`Payment ${action}d`);
    } catch {
      toast.error("Action failed");
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-500">Error loading data</p>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
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

      {/* ===================== */}
      {/* SUMMARY */}
      {/* ===================== */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p>Total Paid</p>
          <h2 className="text-xl font-bold">
            {formatAmount(
              payments
                .filter((p: any) => p.status === "approved")
                .reduce((a: number, b: any) => a + Number(b.amount_paid), 0),
            )}
          </h2>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl">
          Pending: {payments.filter((p: any) => p.status === "pending").length}
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          Approved:{" "}
          {payments.filter((p: any) => p.status === "approved").length}
        </div>
      </div>

      {/* ===================== */}
      {/* CLIENT FORM */}
      {/* ===================== */}
      {role === "client" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl md:w-[60%] shadow space-y-4"
        >
          <h2 className="font-semibold">Make Payment</h2>

          <select
            value={form.loan}
            onChange={(e) => setForm({ ...form, loan: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Select Loan</option>
            {activeLoans.map((l: any) => (
              <option key={l.id} value={l.id}>
                #{l.id} - {Number(l.remaining_balance).toLocaleString()} RWF
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={form.amount_paid}
            onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="file"
            required
            className="border border-gray-400  w-full p-3 rounded-xl bg-gray-200"
            onChange={(e) =>
              setForm({
                ...form,
                payment_proof: e.target.files?.[0] || null,
              })
            }
          />

          <button
            disabled={isCreatingPayment}
            className="w-full bg-primary text-white py-3 rounded-lg"
          >
            {isCreatingPayment ? "Submitting..." : "Submit Payment"}
          </button>
        </form>
      )}

      {filteredPayments.length === 0 && (
        <p className="text-center text-gray-500">No payments found</p>
      )}
      {/* ===================== */}
      {/* 📱 MOBILE CARDS */}
      {/* ===================== */}
      <div className="md:hidden space-y-3">
        {filteredPayments.map((p: any) => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow space-y-2">
            <div className="flex justify-between">
              <p className="font-semibold">Loan #{p.loan?.id || p.loan}</p>

              <span
                className={`text-xs px-2 py-1 h-6 rounded-md ${
                  p.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : p.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {p.status}
              </span>
            </div>

            <p className="text-sm font-medium">{formatAmount(p.amount_paid)}</p>

            <p className="text-xs text-gray-500">
              {formatDate(p.payment_date)}
            </p>

            {/* ACTIONS */}
            {role !== "client" && p.status === "pending" && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleReview(p.id, "approve")}
                  className="flex-1 bg-green-500 text-white py-2 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReview(p.id, "reject")}
                  className="flex-1 bg-red-500 text-white py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===================== */}
      {/* 🖥️ DESKTOP TABLE */}
      {/* ===================== */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Loan</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Proof</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              {role !== "client" && <th className="p-3">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">#{p.loan?.id || p.loan}</td>
                <td className="p-3 font-semibold">
                  {formatAmount(p.amount_paid)}
                </td>
                <td className="p-3">
                  {p.payment_proof ? (
                    <a
                      href={p.payment_proof}
                      className="text-blue-500"
                      target="_blank"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3">{formatDate(p.payment_date)}</td>
                <td className="p-3">{p.status}</td>

                {role !== "client" && (
                  <td className="p-3 space-x-2">
                    {p.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleReview(p.id, "approve")}
                          className="text-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReview(p.id, "reject")}
                          className="text-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPage;
