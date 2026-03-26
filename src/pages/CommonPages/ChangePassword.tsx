import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      }).unwrap();

      toast.success("Password updated successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err: any) {
        console.log(err)
      toast.error(err?.data?.non_field_errors[0] || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen font-sans bg-linear-to-br from-primary via-[#0f2a52] to-secondary flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 animate-pulse">
          <svg viewBox="0 0 500 300" className="w-full h-[60vh]">
            <path d="M0,200 C150,100 350,300 500,200" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="flex flex-col gap-y-[28vh]">
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="bg-white text-primary font-bold px-3 py-1 rounded">KML</div>
              <span className="font-semibold text-lg">Kigali Microloans</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Secure password update required
            </p>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold leading-snug">
              Update your password
              <br /> to continue
            </h2>
            <p className="mt-3 text-gray-400 text-sm">
              For security reasons, you must change your password before accessing the system.
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 relative z-10">
          © {new Date().getFullYear()} Kigali Microloans
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg relative">
          <div className="absolute -inset-1 bg-linear-to-r from-secondary via-accent to-secondary blur-xl opacity-20 rounded-2xl"></div>

          <div className="relative backdrop-blur-lg bg-white/90 rounded-2xl shadow-2xl p-10">
            <div className="flex justify-center mb-6">
              <div className="bg-primary text-white px-5 py-1 rounded font-bold text-lg tracking-wide">
                KML
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary text-center">
              Change Password
            </h2>

            <p className="text-center text-muted text-sm mb-8">
              Please update your credentials
            </p>

            {/* OLD PASSWORD */}
            <div className="mb-5 relative">
              <input
                type={showOld ? "text" : "password"}
                placeholder="Current Password"
                className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none pr-10"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <div
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-3.5 cursor-pointer"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="mb-5 relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3.5 cursor-pointer"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-6 relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm New Password"
                className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3.5 cursor-pointer"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-secondary text-white p-3.5 rounded-lg font-medium hover:bg-blue-800 transition"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>

            <p className="text-xs text-muted text-center mt-6">
              🔒 Security enforced • Kigali Microloans
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
