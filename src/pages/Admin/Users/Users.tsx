import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useDeleteUserMutation, useGetUsersQuery } from "../../../api/usersApi";
import { UserDrawer } from "./UserDrawer";

export default function UsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
console.log(users)
  const filteredUsers = users.filter((u: any) =>
    `${u.username} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    try {
      await deleteUser(confirmDelete.id).unwrap();
      toast.success("User deleted");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const roleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-600";
      case "manager":
        return "bg-blue-100 text-blue-600";
      case "reviewer":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>

        <button
          onClick={() => setSelectedUser({})}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
        >
          + Add User
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search users..."
        className="w-full mb-4 border rounded-lg p-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="p-3">Username</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center p-6">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u: any) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${roleColor(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="text-right pr-4 space-x-2">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setConfirmDelete(u)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= DRAWER ================= */}
      <UserDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      {/* ================= DELETE MODAL ================= */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-lg font-semibold mb-3">
                Delete User
              </h2>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{confirmDelete.username}</strong>?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}