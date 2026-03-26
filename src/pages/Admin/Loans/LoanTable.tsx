import { FiEye } from "react-icons/fi";

export default function LoanTable({ loans, onSelect }: any) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB");

  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">Loan Records</h2>
        <span className="text-sm text-gray-400">
          {loans.length} loans
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-250">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Loan Type</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Interest</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Remaining Balance</th>
              <th className="p-4 text-left">Disbursed</th>
              <th className="p-4 text-left">Due Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan: any) => (
              <tr
                key={loan.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-gray-600">
                  #{loan.id}
                </td>

                <td className="p-4 font-medium text-gray-800">
                  {loan.client_names}
                </td>

                <td className="p-4 text-gray-600">
                  {loan.loan_type_name || "—"}
                </td>

                <td className="p-4">
                  {formatCurrency(loan.loan_amount)}
                </td>

                <td className="p-4 text-gray-600">
                  {formatCurrency(loan.interest_amount)}
                </td>

                <td className="p-4 font-medium text-gray-800">
                  {formatCurrency(loan.total_repayment)}
                </td>

                <td className="p-4 text-red-500 font-semibold">
                  {formatCurrency(loan.remaining_balance)}
                </td>

                <td className="p-4 text-gray-500">
                  {formatDate(loan.disbursement_date)}
                </td>

                <td className="p-4 text-gray-500">
                  {formatDate(loan.repayment_due_date)}
                </td>

                <td className="p-4">
                  <StatusBadge status={loan.status} />
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => onSelect(loan)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FiEye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    active: "bg-blue-100 text-blue-700",
    in_payment: "bg-yellow-100 text-yellow-700",
    overdue: "bg-red-100 text-red-700",
    defaulted: "bg-black text-white",
    paid: "bg-green-100 text-green-700",
  };

  const labels: any = {
    active: "Active",
    in_payment: "In Payment",
    overdue: "Overdue",
    defaulted: "Defaulted",
    paid: "Paid",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}