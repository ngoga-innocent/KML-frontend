import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateClientMutation,
  useUpdateClientMutation,
} from "../../../api/clientApi";

export default function ClientDrawer({ open, onClose, client }: any) {
  const [createClient, { isLoading: creating }] = useCreateClientMutation();
  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();

  const loading = creating || updating;

  const [form, setForm] = useState<any>({
    names: "",
    email: "",
    phone: "",
    gender: "",
    marital_status: "",
    id_number: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    id_document: null,
    job_contract: null,
    bank_statement: null,
  });

  useEffect(() => {
    if (client) {
      setForm({
        ...client,
        id_document: null,
        job_contract: null,
        bank_statement: null,
      });
    }
  }, [client]);

  if (!open) return null;

  // ✅ HANDLE CHANGE
  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          data.append(key, form[key]);
        }
      });

      if (client) {
        await updateClient({ id: client.id, data }).unwrap();
        toast.success("Client updated successfully");
      } else {
        try {
          await createClient(data).unwrap();
          toast.success("Client created & credentials sent");
        } catch (error) {
          console.log(error);
        }
      }

      onClose();
    } catch (err: any) {
      console.log(err);

      toast.error(err?.data?.detail ||err?.data?.email || "Failed to save client");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* OVERLAY */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* DRAWER */}
      <div className="w-[45vw] bg-white h-full shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              {client ? "Edit Client" : "Create New Client"}
            </h2>
            <p className="text-xs text-gray-500">
              Enter accurate client information
            </p>
          </div>

          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* PERSONAL INFO */}
          <Section title="Personal Information">
            <Input
              label="Full Name"
              value={form.names}
              onChange={(v: any) => handleChange("names", v)}
            />
            <Input
              label="Email Address"
              value={form.email}
              onChange={(v: any) => handleChange("email", v)}
            />
            <Input
              label="Phone Number"
              value={form.phone}
              onChange={(v: any) => handleChange("phone", v)}
            />

            <Grid>
              <Select
                label="Gender"
                value={form.gender}
                onChange={(v: any) => handleChange("gender", v)}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </Select>

              <Select
                label="Marital Status"
                value={form.marital_status}
                onChange={(v: any) => handleChange("marital_status", v)}
              >
                <option value="">Select</option>
                <option>Single</option>
                <option>Married</option>
              </Select>
            </Grid>
          </Section>

          {/* IDENTIFICATION */}
          <Section title="Identification">
            <Input
              label="National ID Number"
              value={form.id_number}
              onChange={(v: any) => handleChange("id_number", v)}
            />
          </Section>

          {/* LOCATION */}
          <Section title="Location">
            <Grid>
              <Input
                label="District"
                value={form.district}
                onChange={(v: any) => handleChange("district", v)}
              />
              <Input
                label="Sector"
                value={form.sector}
                onChange={(v: any) => handleChange("sector", v)}
              />
              <Input
                label="Cell"
                value={form.cell}
                onChange={(v: any) => handleChange("cell", v)}
              />
              <Input
                label="Village"
                value={form.village}
                onChange={(v: any) => handleChange("village", v)}
              />
            </Grid>
          </Section>

          {/* DOCUMENTS */}
          <Section title="Documents Upload">
            <FileInput
              label="ID Document"
              onChange={(f: any) => handleChange("id_document", f)}
            />
            <FileInput
              label="Job Contract"
              onChange={(f: any) => handleChange("job_contract", f)}
            />
            <FileInput
              label="Bank Statement"
              onChange={(f: any) => handleChange("bank_statement", f)}
            />
          </Section>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-secondary text-white px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : client ? "Update Client" : "Create Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Section = ({ title, children }: any) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Grid = ({ children }: any) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, value, onChange }: any) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <input
      className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-secondary outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Select = ({ label, value, onChange, children }: any) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <select
      className="w-full border p-3 rounded-lg mt-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  </div>
);

const FileInput = ({ label, onChange }: any) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <input
      type="file"
      className="w-full mt-1 text-sm"
      onChange={(e) => onChange(e.target.files?.[0])}
    />
  </div>
);
