import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function LoanDrawer({
  loan,
  open,
  onClose,
  onPay,
  isLoadingPayment,
}: any) {
  const [showPayment, setShowPayment] = useState(false);
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // 💰 remaining balance
  // const remainingAfterPayment = useMemo(() => {
  //   if (!loan || !amount) return loan?.remaining_balance;
  //   return Number(loan.remaining_balance) - Number(amount);
  // }, [amount, loan]);

  // ♻️ reset on close
  useEffect(() => {
    if (!open) {
      setShowPayment(false);
      setAmount("");
      setFile(null);
    }
  }, [open]);

  if (!open || !loan) return null;

  return (
    <div className="fixed inset-0 z-50 flex">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* DRAWER PANEL */}
      <div
        className={`ml-auto h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="font-semibold text-lg">Loan Details</h2>
            <p className="text-xs text-gray-400">#{loan.id}</p>
          </div>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-5 overflow-y-auto text-sm">

          {/* 👤 CLIENT */}
          <div>
            <p className="text-xs text-gray-400">Client</p>
            <p className="font-medium text-gray-800">{loan.client_names}</p>
          </div>

          {/* 📦 LOAN INFO */}
          <div className="grid grid-cols-2 gap-4">
            <Info label="Loan Type" value={loan.loan_type_name} />
            <Info label="Status" value={loan.status} />

            <Info label="Amount" value={`RWF ${loan.loan_amount}`} />
            <Info label="Interest" value={`RWF ${loan.interest_amount}`} />

            <Info label="Total" value={`RWF ${loan.total_repayment}`} />
            <Info
              label="Remaining"
              value={`RWF ${loan.remaining_balance}`}
              highlight
            />

            <Info label="Disbursed" value={loan.disbursement_date} />
            <Info label="Due Date" value={loan.repayment_due_date} />
            {loan.penalty_amount > 0 && (
              <Info
                label="Penalty"
                value={`RWF ${loan.penalty_amount}`}
                highlight
              />
            )}
          </div>

          {/* 💳 PAYMENTS */}
          <div className="pt-4 border-t">
            <p className="font-medium mb-2">Payments</p>

            {loan.payments?.length ? (
              <div className="space-y-2">
                {loan.payments.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex justify-between text-xs bg-gray-50 p-2 rounded"
                  >
                    <span>RWF {p.amount_paid}</span>
                    <span
                      className={`status ${p.status} px-2 py-0.5 rounded text-xs`}
                    >
                      {p.status}
                    </span>
                    <span>{p.payment_date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                No payments yet
              </p>
            )}
          </div>

          {/* ACTION */}
          {loan.status === "active" && (
            <button
              onClick={() => setShowPayment((v) => !v)}
              className="w-full bg-gray-900 text-white py-2 rounded-lg"
            >
              {showPayment ? "Hide Payment" : "Create Payment"}
            </button>
          )}

          {/* 💰 PAYMENT FORM */}
          {showPayment && (
            <div className="pt-4 border-t space-y-4 animate-fade-in">

              <p className="font-medium">Record Payment</p>

              {/* QUICK FULL */}
              <button
                onClick={() =>
                  setAmount(String(loan.remaining_balance))
                }
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded"
              >
                Pay Full Balance (RWF {loan.remaining_balance})
              </button>

              {/* AMOUNT */}
              <input
                type="number"
                placeholder="Amount paid"
                value={amount}
                required
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-2 rounded"
              />

              {/* FILE */}
              <input
                type="file"
                accept="image/*,.pdf"
                required
                onChange={(e: any) => setFile(e.target.files[0])}
                className="w-full text-sm border rounded-lg p-2 border-gray-400 bg-gray-200"
              />

              {/* PREVIEW */}
              <div className="text-xs text-gray-500">
                Remaining after payment:{" "}
                <span className="font-semibold text-red-600">
                  RWF{" "}
                  {amount
                    ? Number(loan.remaining_balance) -
                      Number(amount)
                    : loan.remaining_balance}
                </span>
              </div>

              {/* SUBMIT */}
              <button
                onClick={() => {
                  const formData = new FormData();
                  formData.append("loan_id", String(loan.id));
                  formData.append("amount_paid", amount);
                  formData.append("status", "pending");

                  if (file) {
                    formData.append("payment_proof", file);
                  }

                  onPay(formData);
                }}
                disabled={!amount || !file || isLoadingPayment}
                className={`w-full text-white py-2 rounded-lg ${
                  isLoadingPayment
                    ? "bg-gray-400"
                    : "bg-green-600"
                }`}
              >
                {isLoadingPayment
                  ? "Processing..."
                  : "Confirm Payment"}
              </button>

              <button
                onClick={() => setShowPayment(false)}
                className="w-full text-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* 🧩 small reusable component */
function Info({ label, value, highlight = false }: any) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p
        className={`font-medium ${
          highlight ? "text-red-600" : "text-gray-800"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}