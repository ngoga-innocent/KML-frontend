import { useState, useMemo } from "react";
import { useGetDashboardQuery } from "../../api/dashboardApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

// ================= CONFIG =================
const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#6366f1"];

// ================= HELPERS =================
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatMonth = (date: string) =>
  new Date(date).toLocaleDateString("en", {
    month: "short",
    year: "2-digit",
  });

// ================= UI COMPONENTS =================

const KPI = ({ label, value }: any) => (
  <div className="p-5 rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 text-white shadow">
    <p className="text-xs text-slate-300">{label}</p>
    <h2 className="text-2xl font-bold mt-1">{value}</h2>
  </div>
);

const Section = ({ title, children }: any) => (
  <div className="bg-white rounded-2xl p-5 shadow border">
    <h3 className="font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </div>
);

const StatusBadge = ({ status }: any) => {
  const map: any = {
    active: "bg-emerald-100 text-emerald-600",
    paid: "bg-blue-100 text-blue-600",
    overdue: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-600",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${map[status] || ""}`}>
      {status}
    </span>
  );
};

// ================= MAIN =================

export default function Dashboard() {
  // ================= STATE =================
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
  });

  // ================= QUERY =================
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v)
  );

  const { data, isLoading } = useGetDashboardQuery(cleanFilters, {
    pollingInterval: 10000,
  });

  // ================= SAFE DATA (ALWAYS BEFORE RETURN) =================
  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};
  const role = data?.role || "client";

  const safeCharts = {
    monthly_loans: charts.monthly_loans || [],
    monthly_payments: charts.monthly_payments || [],
    loan_status_distribution: charts.loan_status_distribution || [],
    application_status_distribution:
      charts.application_status_distribution || [],
    payment_progress: charts.payment_progress || {
      paid: 0,
      remaining: 0,
    },
  };

  const safeTables = {
    recent_loans: tables.recent_loans || [],
    recent_payments: tables.recent_payments || [],
  };

  // ================= HOOKS (ALWAYS BEFORE RETURN) =================
  const progressPercent = useMemo(() => {
    const paid = safeCharts.payment_progress.paid || 0;
    const remaining = safeCharts.payment_progress.remaining || 0;
    const total = paid + remaining;
    return total > 0 ? (paid / total) * 100 : 0;
  }, [safeCharts]);

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        <div className="flex gap-2 flex-wrap">
          <input
            type="date"
            onChange={(e) =>
              setFilters((p) => ({ ...p, start_date: e.target.value }))
            }
            className="border p-2 rounded-lg"
          />
          <input
            type="date"
            onChange={(e) =>
              setFilters((p) => ({ ...p, end_date: e.target.value }))
            }
            className="border p-2 rounded-lg"
          />
          <select
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value }))
            }
            className="border p-2 rounded-lg"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPI label="Total Loans" value={kpis.total_loans || 0} />
        <KPI label="Active Loans" value={kpis.active_loans || 0} />

        {role !== "client" ? (
          <>
            <KPI label="Overdue" value={kpis.overdue_loans || 0} />
            <KPI label="Disbursed" value={formatCurrency(kpis.total_disbursed)} />
            <KPI label="Collected" value={formatCurrency(kpis.total_collected)} />
          </>
        ) : (
          <KPI label="Total Paid" value={formatCurrency(kpis.total_paid)} />
        )}
      </div>

      {/* ================= ADMIN ================= */}
      {role !== "client" && (
        <div className="grid lg:grid-cols-2 gap-6">

          <Section title="Loans Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={safeCharts.monthly_loans.map((d: any) => ({
                  ...d,
                  month: formatMonth(d.month),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="total" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Payments Trend">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={safeCharts.monthly_payments.map((d: any) => ({
                  ...d,
                  month: formatMonth(d.month),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Loan Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={safeCharts.loan_status_distribution}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={100}
                  label
                >
                  {safeCharts.loan_status_distribution.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Applications">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={safeCharts.application_status_distribution}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={100}
                  label
                >
                  {safeCharts.application_status_distribution.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Section>
        </div>
      )}

      {/* ================= CLIENT ================= */}
      {role === "client" && (
        <div className="grid lg:grid-cols-2 gap-6">

          <Section title="My Payments">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={safeCharts.monthly_payments.map((d: any) => ({
                  ...d,
                  month: formatMonth(d.month),
                }))}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Loan Progress">
            <div className="space-y-4">
              <p>
                Paid: <strong>{formatCurrency(safeCharts.payment_progress.paid)}</strong>
              </p>

              <p>
                Remaining: <strong>{formatCurrency(safeCharts.payment_progress.remaining)}</strong>
              </p>

              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* TABLES */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="Recent Loans">
          <table className="w-full text-sm">
            <tbody>
              {safeTables.recent_loans.map((loan: any) => (
                <tr key={loan.id} className="border-t">
                  <td className="py-2">{loan.client_names}</td>
                  <td>{formatCurrency(loan.loan_amount)}</td>
                  <td><StatusBadge status={loan.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Recent Payments">
          <table className="w-full text-sm">
            <tbody>
              {safeTables.recent_payments.map((p: any) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.loan}</td>
                  <td>{formatCurrency(p.amount_paid)}</td>
                  <td><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
}