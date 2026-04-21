import { useState } from "react";

export default function PaymentDrawer({ loan, open, onClose, onSubmit }: any) {
  const [amount, setAmount] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="w-100 bg-white h-full p-5">

        <h2 className="text-lg font-semibold mb-4">
          Pay Loan #{loan.id}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Client: {loan.client_names}
        </p>

        <input
          type="number"
          required
          placeholder="Amount paid"
          className="w-full border p-2 rounded mb-3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={() =>
            onSubmit({
              loan_id: loan.id,
              amount_paid: amount,
              status: "approved", // admin cash payment
            })
          }
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Confirm Payment
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 text-gray-500"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}