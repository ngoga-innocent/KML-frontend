import { X } from "lucide-react"

export default function LoanDrawer({ loan, onClose }: any) {
  return (
    <div
      className={`fixed inset-0 z-50 ${
        loan ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          loan ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* PANEL */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
          loan ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {loan && (
          <div className="flex flex-col h-full">

            {/* HEADER */}
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="font-semibold">Loan Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-5 overflow-y-auto text-sm">

              {/* SUMMARY */}
              <div>
                <p className="text-xs text-gray-400">Client</p>
                <p className="font-medium">{loan.client_names}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Loan Type</p>
                <p>{loan.loan_type_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Amount</p>
                  <p>RWF {loan.loan_amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="text-red-500 font-semibold">
                    RWF {loan.remaining_balance}
                  </p>
                </div>
              </div>

              {/* SCHEDULE */}
              <div className="pt-4 border-t">
                <p className="font-medium mb-2">Repayment Schedule</p>

                {loan.schedules?.map((s: any) => (
                  <div key={s.id} className="flex justify-between text-xs py-1">
                    <span>#{s.installment_number}</span>
                    <span>{s.due_date}</span>
                    <span>RWF {s.total_amount}</span>
                  </div>
                ))}
              </div>

              {/* PAYMENTS */}
              <div className="pt-4 border-t">
                <p className="font-medium mb-2">Payments</p>

                {loan.payments?.map((p: any) => (
                  <div key={p.id} className="flex justify-between text-xs py-1">
                    <span>RWF {p.amount_paid}</span>
                    <span>{p.payment_date}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}