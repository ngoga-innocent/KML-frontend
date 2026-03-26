import { ChevronRight } from "lucide-react"

export default function LoanCards({ loans, onSelect }: any) {
  return (
    <div className="space-y-4">
      {loans.map((loan: any) => (
        <div
          key={loan.id}
          onClick={() => onSelect(loan)}
          className="bg-white p-4 rounded-xl shadow-sm border cursor-pointer active:scale-[0.98] transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{loan.client_names}</p>
              <p className="text-xs text-gray-400">
                {loan.loan_type_name}
              </p>
            </div>

            <ChevronRight size={18} className="text-gray-400" />
          </div>

          <div className="mt-3 space-y-1 text-sm">
            <p>
              <span className="text-gray-400">Amount:</span> RWF {loan.loan_amount}
            </p>
            <p>
              <span className="text-gray-400">Balance:</span>{" "}
              <span className="font-semibold text-red-500">
                RWF {loan.remaining_balance}
              </span>
            </p>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <StatusBadge status={loan.status} />
            <span className="text-xs text-gray-400">
              {loan.repayment_due_date}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: any) {
  const styles: any = {
    active: "bg-blue-100 text-blue-600",
    in_payment: "bg-yellow-100 text-yellow-600",
    overdue: "bg-red-100 text-red-600",
    defaulted: "bg-black text-white",
    paid: "bg-green-100 text-green-600",
  }

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
      {status}
    </span>
  )
}