import { useState, useEffect } from "react";
import { useGetLoansQuery } from "../../../api/loanApi";
import LoanCards from "./LoanCard";
import LoanTable from "./LoanTable";
import LoanDrawer from "./LoanDrawer";
import CardSkeleton from "../../../components/Loaders/CardSkeleton";
import TableSkeleton from "../../../components/Loaders/TableSkeleton";

export default function Loans() {
  const { data: loans = [], isLoading, refetch } = useGetLoansQuery();
  console.log(loans);
  useEffect(() => {
    refetch();
  }, []);
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const stats = loans.reduce(
    (acc: any, loan: any) => {
      acc.totalLoans += 1;
      acc.totalDisbursed += Number(loan.loan_amount);
      acc.totalBalance += Number(loan.remaining_balance);

      if (loan.status === "overdue") acc.overdue += 1;
      if (loan.status === "paid") acc.paid += 1;
      if (loan.status === "active") acc.active += 1;

      return acc;
    },
    {
      totalLoans: 0,
      totalDisbursed: 0,
      totalBalance: 0,
      overdue: 0,
      paid: 0,
      active: 0,
    },
  );
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-xl font-semibold">Loans</h1>
        <p className="text-sm text-gray-500">Manage all issued loans</p>
      </div>
      {/* 🔥 STATS */}
      {isLoading ? <CardSkeleton /> : <StatsCards stats={stats} />}
      {/* MOBILE CARDS */}
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="block md:hidden">
          <LoanCards loans={loans} onSelect={setSelectedLoan} />
        </div>
      )}

      {/* DESKTOP TABLE */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="hidden md:block">
          <LoanTable loans={loans} onSelect={setSelectedLoan} />
        </div>
      )}

      {/* DRAWER */}
      <LoanDrawer loan={selectedLoan} onClose={() => setSelectedLoan(null)} />
    </div>
  );
}
function StatsCards({ stats }: any) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(value);

  const cards = [
    {
      title: "Total Loans",
      value: stats.totalLoans,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Disbursed",
      value: formatCurrency(stats.totalDisbursed),
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Outstanding Balance",
      value: formatCurrency(stats.totalBalance),
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Active Loans",
      value: stats.active,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      title: "Paid",
      value: stats.paid,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`bg-${card.color} p-4 rounded-2xl border shadow-sm hover:shadow-md transition`}
        >
          <p className="text-xs text-gray-500">{card.title}</p>
          <h2 className={`text-lg font-semibold mt-1`}>{card.value}</h2>
        </div>
      ))}
    </div>
  );
}
