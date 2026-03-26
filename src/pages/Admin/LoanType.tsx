import { useState, useMemo } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiSearch,
  FiEye,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useCreateLoanTypeMutation,
  useDeleteLoanTypeMutation,
  useGetLoanTypesQuery,
  useUpdateLoanTypeMutation,
} from "../../api/loanApi";
import CardSkeleton from "../../components/Loaders/CardSkeleton";
import TableSkeleton from "../../components/Loaders/TableSkeleton";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(value);

const initialForm = {
  name: "",
  description: "",
  min_amount: "",
  max_amount: "",
  interest_rate: "",
  interest_type: "flat",
  repayment_period_value: "",
  repayment_period_unit: "months",
  repayment_frequency: "monthly",
  processing_fee_percentage: 0,
  late_payment_penalty_percentage: 0,
  grace_period_days: 0,
  requires_collateral: false,
  collateral_description: "",
  currency: "RWF",
  max_concurrent_loans: 1,
  is_active: true,
};

export default function LoanTypeManagementPage() {
  const { data: loanTypes = [], isLoading } = useGetLoanTypesQuery();
  const [createLoanType] = useCreateLoanTypeMutation();
  const [updateLoanType] = useUpdateLoanTypeMutation();
  const [deleteLoanType] = useDeleteLoanTypeMutation();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(initialForm);
  const [activeTab, setActiveTab] = useState("overview");

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setViewMode(false);
  };

  const filteredLoans = loanTypes.filter((item: any) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all"
        ? true
        : filter === "active"
        ? item.is_active
        : !item.is_active)
    );
  });

  /* 📊 SMART STATS */
  const stats = useMemo(() => {
    const total = loanTypes.length;
    const active = loanTypes.filter((l: any) => l.is_active).length;
    const inactive = total - active;

    const avgInterest =
      total > 0
        ? (
            loanTypes.reduce((acc: number, l: any) => acc + Number(l.interest_rate), 0) / total
          ).toFixed(1)
        : 0;

    return { total, active, inactive, avgInterest };
  }, [loanTypes]);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        min_amount: Number(form.min_amount),
        max_amount: Number(form.max_amount),
        interest_rate: Number(form.interest_rate),
        repayment_period_value: Number(form.repayment_period_value),
        processing_fee_percentage: Number(form.processing_fee_percentage),
        late_payment_penalty_percentage: Number(form.late_payment_penalty_percentage),
        grace_period_days: Number(form.grace_period_days),
        max_concurrent_loans: Number(form.max_concurrent_loans),
      };

      if (editingId) {
        await updateLoanType({ id: editingId, ...payload }).unwrap();
        toast.success("Updated");
      } else {
        await createLoanType(payload).unwrap();
        toast.success("Created");
      }

      setDrawerOpen(false);
      resetForm();
    } catch {
      toast.error("Error occurred");
    }
  };
if(isLoading){
  return (
    <div className="flex flex-col">
      <CardSkeleton />
      <TableSkeleton />
    </div>
  )
}
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Loan Types</h1>
          <p className="text-gray-500 text-sm">Fintech loan configuration</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setDrawerOpen(true);
          }}
          className="bg-secondary text-white px-4 py-2 rounded-xl flex gap-2 items-center shadow"
        >
          <FiPlus /> New Loan
        </button>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} icon="📊" />
        <StatCard title="Active" value={stats.active} icon="✅" />
        <StatCard title="Inactive" value={stats.inactive} icon="⛔" />
        <StatCard title="Avg Interest" value={`${stats.avgInterest}%`} icon="💰" />
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center border bg-white px-3 rounded-lg w-full md:w-80">
          <FiSearch />
          <input
            className="p-2 w-full outline-none"
            placeholder="Search loan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border p-2 rounded-lg bg-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {filteredLoans.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No loan types found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs uppercase">
              <tr>
                <th className="p-4 text-left">Loan</th>
                <th>Amount</th>
                <th>Interest</th>
                <th>Status</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLoans.map((item: any) => (
                <tr key={item.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </td>

                  <td>
                    {formatCurrency(item.min_amount)} - {formatCurrency(item.max_amount)}
                  </td>

                  <td>{item.interest_rate}%</td>

                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Action icon={<FiEye />} onClick={()=>{
                        setForm(item); setViewMode(true); setDrawerOpen(true);
                      }}/>
                      <Action icon={<FiEdit />} onClick={()=>{
                        setForm(item); setEditingId(item.id); setDrawerOpen(true);
                      }}/>
                      <Action icon={<FiTrash />} danger onClick={()=>{
                        if(confirm("Delete loan type?")) deleteLoanType(item.id);
                      }}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DRAWER */}
      <Drawer
        open={drawerOpen}
        onClose={()=>setDrawerOpen(false)}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        viewMode={viewMode}
        editingId={editingId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

/* DRAWER COMPONENT */

const Drawer = ({
  open, onClose, form, setForm, handleSubmit,
  viewMode, editingId, activeTab, setActiveTab
}: any) => {

  return (
    <div className={`fixed top-0 right-0 h-full pb-7 w-full sm:w-135 bg-white shadow-xl transition ${open ? "translate-x-0" : "translate-x-full"}`}>

      <div className="flex justify-between items-center p-4 border-b">
        <h2>{viewMode ? "View Loan" : editingId ? "Edit Loan" : "New Loan"}</h2>
        <FiX onClick={onClose} />
      </div>

      {/* TABS */}
      <div className="flex border-b text-sm">
        {["overview","financials","rules","advanced"].map(tab=>(
          <button key={tab}
            onClick={()=>setActiveTab(tab)}
            className={`flex-1 p-2 ${activeTab===tab?"border-b-2 border-secondary font-semibold":""}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-150px)]">

        {activeTab==="overview" && (
          <Grid>
            <Input label="Name" value={form.name} disabled={viewMode} onChange={(v:any)=>setForm({...form,name:v})}/>
            <Input label="Currency" value={form.currency} disabled={viewMode} onChange={(v:any)=>setForm({...form,currency:v})}/>
            <Full label="Description" value={form.description} disabled={viewMode} onChange={(v:any)=>setForm({...form,description:v})}/>
            <Input label="Min Amount" value={form.min_amount} disabled={viewMode} onChange={(v:any)=>setForm({...form,min_amount:v})}/>
            <Input label="Max Amount" value={form.max_amount} disabled={viewMode} onChange={(v:any)=>setForm({...form,max_amount:v})}/>
          </Grid>
        )}

        {activeTab==="financials" && (
          <Grid>
            <Input label="Interest %" value={form.interest_rate} disabled={viewMode} onChange={(v:any)=>setForm({...form,interest_rate:v})}/>
            <Select label="Interest Type" value={form.interest_type} options={["flat","reducing"]} disabled={viewMode} onChange={(v:any)=>setForm({...form,interest_type:v})}/>
            <Input label="Processing %" value={form.processing_fee_percentage} disabled={viewMode} onChange={(v:any)=>setForm({...form,processing_fee_percentage:v})}/>
            <Input label="Penalty %" value={form.late_payment_penalty_percentage} disabled={viewMode} onChange={(v:any)=>setForm({...form,late_payment_penalty_percentage:v})}/>
          </Grid>
        )}

        {activeTab==="rules" && (
          <Grid>
            <Input label="Period Value" value={form.repayment_period_value} disabled={viewMode} onChange={(v:any)=>setForm({...form,repayment_period_value:v})}/>
            <Select label="Unit" value={form.repayment_period_unit} options={["days","weeks","months"]} disabled={viewMode} onChange={(v:any)=>setForm({...form,repayment_period_unit:v})}/>
            <Select label="Frequency" value={form.repayment_frequency} options={["daily","weekly","monthly"]} disabled={viewMode} onChange={(v:any)=>setForm({...form,repayment_frequency:v})}/>
            <Input label="Grace Days" value={form.grace_period_days} disabled={viewMode} onChange={(v:any)=>setForm({...form,grace_period_days:v})}/>
            <Input label="Max Loans" value={form.max_concurrent_loans} disabled={viewMode} onChange={(v:any)=>setForm({...form,max_concurrent_loans:v})}/>
          </Grid>
        )}

        {activeTab==="advanced" && (
          <div className="space-y-3">
            <label>
              <input type="checkbox"
                checked={form.requires_collateral}
                disabled={viewMode}
                onChange={(e)=>setForm({...form,requires_collateral:e.target.checked})}/>
              Requires Collateral
            </label>

            {form.requires_collateral && (
              <textarea
                className="w-full border p-2 rounded"
                value={form.collateral_description}
                disabled={viewMode}
                onChange={(e)=>setForm({...form,collateral_description:e.target.value})}
              />
            )}

            <label>
              <input type="checkbox"
                checked={form.is_active}
                disabled={viewMode}
                onChange={(e)=>setForm({...form,is_active:e.target.checked})}/>
              Active
            </label>
          </div>
        )}
      </div>

      {!viewMode && (
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} className="bg-secondary text-white px-6 py-2 rounded-lg">
            Save
          </button>
        </div>
      )}
      {viewMode && (
        <div className="p-4 border-t  flex justify-end gap-3">
          <button className="bg-red-700 py-2 px-5 rounded-lg text-white" onClick={onClose}>Close</button>
          
        </div>
      )}
    </div>
  );
};

/* UI COMPONENTS */

const StatCard = ({ title, value, icon }: any) => (
  <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
    <div>
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
    <div className="text-2xl">{icon}</div>
  </div>
);

const Action = ({ icon, onClick, danger }: any) => (
  <button
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-100 ${danger ? "text-red-500" : ""}`}
  >
    {icon}
  </button>
);

const Grid = ({ children }: any) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

const Input = ({ label, value, onChange, disabled }: any) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <input
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded-lg disabled:bg-gray-100"
    />
  </div>
);

const Full = ({ label, value, onChange, disabled }: any) => (
  <div className="col-span-2">
    <label className="text-xs text-gray-500">{label}</label>
    <textarea
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded-lg disabled:bg-gray-100"
    />
  </div>
);

const Select = ({ label, value, options, onChange, disabled }: any) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded-lg disabled:bg-gray-100"
    >
      {options.map((o: string) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);