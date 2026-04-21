import { useEffect, useState } from "react";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../api/usersApi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export function UserDrawer({ user, onClose }: any) {
  const isEdit = user?.id;

  const [createUser, { isLoading: creating }] =
    useCreateUserMutation();
  const [updateUser, { isLoading: updating }] =
    useUpdateUserMutation();

  const loading = creating || updating;

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "client",
   
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "client",
        
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!form.username || !form.email) {
      toast.error("Username and email are required");
      return;
    }

    try {
      if (isEdit) {
        await updateUser({
          id: user.id,
          ...form,
          
        }).unwrap();
        toast.success("User updated");
      } else {
        await createUser(form).unwrap();
        toast.success("User created");
      }

      onClose();
    } catch (err: any) {
      console.error(err.data);
      if(err?.data?.username) {
        toast.error("Username: " + err.data.username.join(" "));
      } else if(err?.data?.email) {
        toast.error("Email: " + err.data.email.join(" "));
      } else if(err?.data?.password) {
        toast.error("Password: " + err.data.password.join(" "));
      } else {
        toast.error( "Operation failed");
      }
    }
  };

  return (
    <AnimatePresence>
      {user && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.div
            className="relative z-50 w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 30 }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEdit ? "Edit User" : "Create User"}
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* USERNAME */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Role
                </label>
                <select
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="client">Client</option>
                </select>
              </div>

              {/* PASSWORD */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {isEdit ? "New Password (optional)" : "Password"}
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  placeholder={
                    isEdit
                      ? "Leave empty to keep current password"
                      : "Enter password"
                  }
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div> */}
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update User"
                  : "Create User"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}