import { useEffect, useState } from "react";
import { useGetLoanTypesQuery } from "../../../api/loanApi";
import { useCreateAdminApplicationMutation } from "../../../api/loanapplication";
import { useGetClientsQuery } from "../../../api/clientApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

export default function CreateLoanApplicationDrawer({ open, onClose }: any) {
  const [createApplication, { isLoading }] =
    useCreateAdminApplicationMutation();
const { role } = useSelector((state: RootState) => state.auth);
  const { data: clients = [] } = useGetClientsQuery(undefined, {
  skip: role === "client",
});
  const { data: loanTypes = [] } = useGetLoanTypesQuery();

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState<any>({
    client: "",
    loan_type: "",
    requested_amount: "",
    comment: "",
    contract: null,
    signed_contract: null,
    is_signed: false,
  });

  // 🧠 Reset form when closed
  useEffect(() => {
    if (!open) {
      setForm({
        client: "",
        loan_type: "",
        requested_amount: "",
        comment: "",
        contract: null,
        signed_contract: null,
        is_signed: false,
      });
      setSearch("");
      setShowDropdown(false);
    }
  }, [open]);

  // 🔒 lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const selectedClient = clients.find((c: any) => c.id === Number(form.client));

  const selectedType = loanTypes.find(
    (lt: any) => lt.id === Number(form.loan_type),
  );

  const filteredClients = clients.filter((c: any) =>
    `${c.names} ${c.phone}`.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = async () => {
    if (!form.client || !form.loan_type || !form.requested_amount) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!Number(form.client)) {
      toast.error("Please select a valid client");
      return;
    }

    if (!Number(form.loan_type)) {
      toast.error("Please select a loan type");
      return;
    }

    if (form.is_signed && !form.signed_contract) {
      toast.error("Signed contract is required");
      return;
    }

    try {
      const data = new FormData();

      data.append("client", String(Number(form.client)));
      data.append("loan_type", String(Number(form.loan_type)));
      data.append("requested_amount", String(Number(form.requested_amount)));
      if(form.is_signed){
        data.append("status", "signed");
      }
      else{
        data.append("status", "reviewed");
      }
       // Admin-created applications are auto-approved
      if (form.comment) data.append("comment", form.comment);

      if (form.contract) data.append("contract", form.contract);

      if (form.is_signed) {
        data.append("is_signed", "true");
        if (form.signed_contract) {
          data.append("signed_contract", form.signed_contract);
        }
      } else {
        data.append("is_signed", "false");
      }
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      await createApplication(data).unwrap();

      toast.success("Application created successfully");
      onClose();
    } catch (err:any) {
      console.error(err);
      if(err?.data?.detail){
        toast.error(err.data.detail);
      }
      else if (err?.data?.message) {
        toast.error(err.data.message);
       }
       else if (err?.data?.non_field_errors) {
        toast.error(err.data.non_field_errors[0]);
       }
       else{
      toast.error("Failed to create application");
       }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.div
            className="relative w-full max-w-lg h-full bg-white shadow-2xl p-6 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 30 }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Create Loan Application</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* ================= CLIENT ================= */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <h3 className="font-medium mb-3 text-gray-700">
                Client Information
              </h3>

              <input
                type="text"
                className="w-full border rounded-lg p-2"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />

              {showDropdown && search && (
                <div className="border rounded-lg mt-2 max-h-40 overflow-y-auto bg-white shadow">
                  {filteredClients.length === 0 ? (
                    <div className="p-2 text-sm text-gray-400">
                      No clients found
                    </div>
                  ) : (
                    filteredClients.map((c: any) => (
                      <div
                        key={c.id}
                        className="p-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => {
                          setForm({ ...form, client: c.id });
                          setSearch(`${c.names}`);
                          setShowDropdown(false);
                        }}
                      >
                        {c.names} — {c.phone}
                      </div>
                    ))
                  )}
                </div>
              )}

              {selectedClient && (
                <div className="mt-3 text-sm text-green-600">
                  ✓ Selected: {selectedClient.names}
                </div>
              )}
            </div>

            {/* ================= LOAN ================= */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <h3 className="font-medium mb-3 text-gray-700">Loan Details</h3>

              <select
                className="w-full border rounded-lg p-2 mb-3"
                value={form.loan_type}
                onChange={(e) =>
                  setForm({ ...form, loan_type: e.target.value })
                }
              >
                <option value="">Select loan type</option>
                {loanTypes.map((lt: any) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="w-full border rounded-lg p-2"
                placeholder="Requested amount (RWF)"
                value={form.requested_amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requested_amount: e.target.value,
                  })
                }
              />

              {selectedType && (
                <div className="text-xs text-gray-500 mt-2">
                  Allowed: {selectedType.min_amount} - {selectedType.max_amount}{" "}
                  RWF | Interest: {selectedType.interest_rate}%
                </div>
              )}
            </div>

            {/* ================= DOCUMENTS ================= */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <h3 className="font-medium mb-3 text-gray-700">Documents</h3>

              <input
                type="file"
                className="mb-3 block border border-gray-200 rounded-lg p-2 w-full text-sm"
                onChange={(e) =>
                  setForm({
                    ...form,
                    contract: e.target.files?.[0],
                  })
                }
              />

              <label className="flex items-center gap-2 text-sm mb-3">
                <input
                  type="checkbox"
                  className="border border-gray-200 p-2 rounded-lg"
                  checked={form.is_signed}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_signed: e.target.checked,
                    })
                  }
                />
                Mark as signed
              </label>

              {form.is_signed && (
                <input
                  type="file"
                  className="block w-full text-sm"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      signed_contract: e.target.files?.[0],
                    })
                  }
                />
              )}
            </div>

            {/* ================= COMMENT ================= */}
            <textarea
              className="w-full border rounded-lg p-3 mb-6"
              placeholder="Optional comment..."
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />

            {/* ================= ACTION ================= */}
            <button
              onClick={handleSubmit}
              className="bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-700 transition text-white w-full py-3 rounded-xl font-medium"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
