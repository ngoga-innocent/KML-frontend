import { useState } from "react"

import { toast } from "react-toastify"
import { useCreateClientMutation, useUpdateClientMutation } from "../../../api/clientApi"

export default function ClientModal({ client, onClose }: any) {

  const [createClient] = useCreateClientMutation()
  const [updateClient] = useUpdateClientMutation()

  const [form, setForm] = useState({
    names: client?.names || "",
    email: client?.email || "",
    phone: client?.phone || "",
    district: client?.district || ""
  })

  const handleSubmit = async () => {
    try {
      if (client) {
        await updateClient({ id: client.id, data: form }).unwrap()
        toast.success("Client updated")
      } else {
        await createClient(form).unwrap()
        toast.success("Client created")
      }

      onClose()

    } catch {
      toast.error("Error saving client")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-xl p-6 w-full max-w-lg">

        <h2 className="text-xl font-bold mb-4">
          {client ? "Edit Client" : "New Client"}
        </h2>

        <div className="space-y-3">

          <input
            placeholder="Full Name"
            className="w-full p-3 border rounded"
            value={form.names}
            onChange={(e) => setForm({...form, names: e.target.value})}
          />

          <input
            placeholder="Email"
            className="w-full p-3 border rounded"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />

          <input
            placeholder="Phone"
            className="w-full p-3 border rounded"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />

          <input
            placeholder="District"
            className="w-full p-3 border rounded"
            value={form.district}
            onChange={(e) => setForm({...form, district: e.target.value})}
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleSubmit}
            className="bg-secondary text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  )
}