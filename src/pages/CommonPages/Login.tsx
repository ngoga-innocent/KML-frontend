import { useState } from "react";
import { useLoginMutation } from "../../api/authApi";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/authSlice";

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
    const dispatch=useDispatch()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("Please fill all fields");
    }
    console.log(email, password);

    try {
      const res = await login({ identifier: email, password }).unwrap();
    
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("access", res.access);
      // console.log("returned",res.data)
      dispatch(setCredentials({ ...res, remember }));
      toast.success("Welcome back");

      setTimeout(() => {
        window.location.href = res.must_change_password
          ? "/change-password"
          : "/dashboard";
      }, 800);
    } catch (err: any) {
      console.log(err);
      toast.error(err?.data?.error || "Login failed");
      //   toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen font-sans bg-linear-to-br from-primary via-[#0f2a52] to-secondary flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* SVG BACKGROUND */}
        <div className="absolute inset-0 opacity-20 animate-pulse">
          <svg viewBox="0 0 500 300" className="w-full h-[60vh]">
            <path
              d="M0,200 C150,100 350,300 500,200"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 inset-0 opacity-20 animate-pulse">
          <svg viewBox="0 0 200 300" className="w-full h-[60vh]">
            <path
              d="M0,200 C150,100 350,300 500,200"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-y-[28vh]">
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="bg-white text-primary font-bold px-3 py-1 rounded">
                KML
              </div>
              <span className="font-semibold text-lg">Kigali Microloans</span>
            </div>

            <p className="mt-4 text-sm text-gray-300">
              Secure digital lending platform
            </p>
          </div>

          <div className="relative  z-10">
            <h2 className="text-3xl font-bold leading-snug">
              Smarter lending,
              <br /> better financial control.
            </h2>

            <p className="mt-3 text-gray-400 text-sm">
              Manage clients, loans, and payments in one secure system.
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 relative z-10">
          © {new Date().getFullYear()} Kigali Microloans
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-10">
        {/* 🔥 Bigger + Glow Effect */}
        <div className="w-full max-w-lg relative">
          {/* GLOW BACKGROUND */}
          <div className="absolute -inset-1 bg-lenear-to-r from-secondary via-accent to-secondary blur-xl opacity-20 rounded-2xl"></div>

          {/* FORM CARD */}
          <div className="relative backdrop-blur-lg bg-white/90 rounded-2xl shadow-2xl p-10">
            {/* LOGO */}
            <div className="flex justify-center mb-6">
              <div className="bg-primary text-white px-5 py-1 rounded font-bold text-lg tracking-wide">
                KML
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary text-center">
              Welcome Back
            </h2>

            <p className="text-center text-muted text-sm mb-8">
              Sign in to continue
            </p>

            {/* EMAIL */}
            <div className="mb-5">
              <input
                type="email"
                placeholder="Username or Email address"
                className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-5 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none pr-10 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 cursor-pointer text-muted"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex justify-between items-center text-sm mb-7">
              <label className="flex items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember me
              </label>

              <span className="text-secondary cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-secondary text-white p-3.5 rounded-lg font-medium hover:bg-blue-800 transition transform hover:scale-[1.01]"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>

            {/* FOOTER */}
            <p className="text-xs text-muted text-center mt-6">
              🔒 Secure system • Kigali Microloans
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
