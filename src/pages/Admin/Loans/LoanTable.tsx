import { useState, useMemo } from "react";
import { FiEye, FiSearch } from "react-icons/fi";

export default function LoanTable({ loans, onSelect }: any) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // 💰 format currency (RWF)
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "—";

  const filteredLoans = useMemo(() => {
    return loans.filter((loan: any) => {
      const matchesSearch =
        loan.client_names?.toLowerCase().includes(search.toLowerCase()) ||
        loan.loan_type_name?.toLowerCase().includes(search.toLowerCase()) ||
        String(loan.id).includes(search);

      const matchesStatus = status === "all" ? true : loan.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [loans, search, status]);

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

  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      {/* 🔍 Search + Filter */}
      <div className="p-4 flex flex-col md:flex-row gap-3 justify-between border-b">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-full md:w-1/3">
          <FiSearch className="text-gray-400" />
          <input
            className="w-full outline-none text-sm"
            placeholder="Search by client, loan type, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="in_payment">In Payment</option>
          <option value="overdue">Overdue</option>
          <option value="paid">Paid</option>
          <option value="defaulted">Defaulted</option>
        </select>
      </div>

      {/* 📊 TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-275">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Loan Type</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Interest</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Remaining</th>
              <th className="p-4 text-left">Due Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredLoans.map((loan: any) => (
              <tr key={loan.id} className="border-t hover:bg-gray-50 transition">
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
                  {formatDate(loan.repayment_due_date)}
                </td>

                <td className="p-4">
                  <StatusBadge status={loan.status} />
                </td>

                <td className="p-4 flex justify-end gap-2">
                  <button
                    onClick={() => onSelect(loan)}
                    className="text-blue-600 flex items-center gap-1 hover:text-blue-800"
                  >
                    <FiEye />
                    <span className="font-medium">View</span>
                  </button>

                  {/* 💰 QUICK PAY BUTTON
                  {loan.status === "active" && (
                    <button
                      onClick={() => onPay(loan)}
                      className="text-green-600 font-medium hover:text-green-800"
                    >
                      Pay
                    </button>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY STATE */}
      {filteredLoans.length === 0 && (
        <div className="p-6 text-center text-sm text-gray-400">
          No loans found
        </div>
      )}
    </div>
  );
}