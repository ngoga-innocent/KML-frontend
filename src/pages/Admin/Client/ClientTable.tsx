import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { useDeleteClientMutation } from "../../../api/clientApi";

export default function ClientTable({ clients, isLoading, onEdit }: any) {
  const [deleteClient] = useDeleteClientMutation();
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this client?")) return;

    try {
      await deleteClient(id).unwrap();
      toast.success("Client deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(value);

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading clients...</div>;
  }

  if (!clients.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No clients yet 🚀
      </div>
    );
  }

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="block md:hidden space-y-4">
        {clients.map((c: any) => (
          <div
            key={c.id}
            className="bg-white p-4 rounded-2xl shadow-sm border"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                  {c.names?.charAt(0)}
                </div>

                <div>
                  <p className="font-medium">{c.names}</p>
                  <p className="text-xs text-gray-400">{c.email}</p>
                </div>
              </div>

              <StatusBadge status={c.status || "active"} />
            </div>

            {/* DETAILS */}
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p><strong>Phone:</strong> {c.phone}</p>
              <p><strong>District:</strong> {c.district}</p>
              <p><strong>Loans:</strong> {c.total_loans || 0}</p>
              <p>
                <strong>Total Borrowed:</strong>{" "}
                {formatCurrency(c.total_borrowed || 0)}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-4">
              <ActionButtons
                onView={() => setSelectedClient(c)}
                onEdit={() => onEdit(c)}
                onDelete={() => handleDelete(c.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border">
        <div className="p-4 border-b flex justify-between">
          <h2 className="font-semibold text-gray-700">Clients</h2>
          <span className="text-sm text-gray-400">
            {clients.length} clients
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-225">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Loans</th>
                {/* <th className="p-4 text-left">Role</th> */}
                <th className="p-4 text-left">Total Borrowed</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((c: any) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* CLIENT */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {c.names?.charAt(0)}
                      </div>

                      <div>
                        <p className="font-medium text-gray-800">
                          {c.names}
                        </p>
                        <p className="text-xs text-gray-400">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">{c.phone}</td>

                  <td className="p-4 text-gray-600">
                    {c.district}
                  </td>
                  {/* <td className="p-4 text-gray-700 font-medium">
                    {c.role}
                  </td> */}
                  <td className="p-4 font-medium">
                    {c.total_loans || 0}
                  </td>

                  <td className="p-4 text-gray-700 font-medium">
                    {formatCurrency(c.total_amount || 0)}
                  </td>

                  <td className="p-4">
                    <StatusBadge status={c.status || "active"} />
                  </td>

                  <td className="p-4 text-gray-500 text-xs">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end">
                      <ActionButtons
                        onView={() => setSelectedClient(c)}
                        onEdit={() => onEdit(c)}
                        onDelete={() => handleDelete(c.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= DRAWER (UNCHANGED BUT CLEANER) ================= */}
      {selectedClient && (
        <ClientDrawer
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </>
  );
}

/* ================= COMPONENTS ================= */

function ActionButtons({ onView, onEdit, onDelete }: any) {
  return (
    <div className="flex gap-2">
      <button onClick={onView} className="p-2 rounded-lg hover:bg-gray-100">
        <Eye size={16} />
      </button>

      <button
        onClick={onEdit}
        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
      >
        <Pencil size={16} />
      </button>

      <button
        onClick={onDelete}
        className="p-2 rounded-lg hover:bg-red-50 text-red-500"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    active: "bg-green-100 text-green-600",
    inactive: "bg-gray-100 text-gray-600",
    risky: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

/* ================= DRAWER ================= */

function ClientDrawer({ client, onClose }: any) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* PANEL */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-semibold">Client Profile</h2>
            <p className="text-xs text-gray-400">
              Detailed information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">

          {/* PROFILE */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-semibold text-blue-600">
              {client.names?.charAt(0)}
            </div>

            <div>
              <p className="font-semibold text-gray-800">
                {client.names}
              </p>
              <p className="text-xs text-gray-400">
                {client.email}
              </p>
            </div>
          </div>

          {/* PERSONAL INFO */}
          <Section title="Personal Information">
            <Info label="Phone" value={client.phone} />
            <Info label="Gender" value={client.gender} />
            <Info label="Marital Status" value={client.marital_status} />
            <Info label="ID Number" value={client.id_number} />
          </Section>

          {/* ADDRESS */}
          <Section title="Address">
            <Info
              label="Location"
              value={`${client.village}, ${client.sector}, ${client.district}`}
            />
          </Section>

          {/* FINANCIAL */}
          <Section title="Financial Overview">
            <Info label="Total Loans" value={client.total_loans || 0} />
            <Info
              label="Total Borrowed"
              value={formatCurrency(client.total_amount || 0)}
            />
            <Info
              label="Active Loans"
              value={client.active_loans || 0}
            />
            <Info
              label="Outstanding Balance"
              value={formatCurrency(client.total_balance || 0)}
            />
          </Section>

          {/* DOCUMENTS */}
          <Section title="Documents">
            <DocLink label="ID Document" url={client.id_document} />
            <DocLink label="Bank Statement" url={client.bank_statement} />
            <DocLink label="Job Contract" url={client.job_contract} />
          </Section>

          {/* META */}
          <div className="pt-4 border-t text-xs text-gray-400">
            Created:{" "}
            {new Date(client.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Small reusable components */

function Section({ title, children }: any) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase">
        {title}
      </h3>
      <div className="bg-gray-50 rounded-xl p-3 space-y-2">
        {children}
      </div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">
        {value || "—"}
      </span>
    </div>
  );
}

function DocLink({ label, url }: any) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      className="block text-blue-600 hover:underline text-sm"
    >
      {label}
    </a>
  );
}