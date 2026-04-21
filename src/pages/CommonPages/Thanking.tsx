import { CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoanSuccessPage() {
  const navigate = useNavigate();
  // const { state } = useLocation();

  

  return (
    <div className="min-h-screen font-sans bg-linear-to-br from-primary via-[#0f2a52] to-secondary flex items-center justify-center px-4">

      {/* LEFT BRAND (same feel as login) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden">
        
        {/* SVG background */}
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

        <div className="flex flex-col gap-y-[28vh] relative z-10">
          {/* LOGO */}
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-white text-primary font-bold px-3 py-1 rounded">
                KML
              </div>
              <span className="font-semibold text-lg">
                Kigali Microloans
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-300">
              Secure digital lending platform
            </p>
          </div>

          {/* MESSAGE */}
          <div>
            <h2 className="text-3xl font-bold leading-snug">
              Your request is
              <br /> in safe hands.
            </h2>

            <p className="mt-3 text-gray-400 text-sm">
              We review every application carefully to give you the best support.
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 relative z-10">
          © {new Date().getFullYear()} Kigali Microloans
        </p>
      </div>

      {/* RIGHT CARD */}
      <div className="flex w-full lg:w-1/2 items-center justify-center">
        <div className="w-full max-w-lg relative">

          {/* GLOW */}
          <div className="absolute -inset-1 bg-linear-to-r from-secondary via-accent to-secondary blur-xl opacity-20 rounded-2xl"></div>

          {/* CARD */}
          <div className="relative backdrop-blur-lg bg-white/90 rounded-2xl shadow-2xl p-10 text-center space-y-6 animate-fade-in">

            {/* SUCCESS ICON */}
            <div className="flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="text-green-600" size={40} />
              </div>
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Application Submitted
              </h1>
              <p className="text-muted text-sm mt-2">
                Your loan request has been successfully received.
              </p>
            </div>

            {/* SUMMARY */}
            {/* <div className="bg-gray-50 border rounded-xl p-5 text-left space-y-3">
              <Info label="Application ID" value={`#${application?.id}`} />
              <Info label="Loan Type" value={application?.loan_type_name} />
              <Info
                label="Amount"
                value={`RWF ${application?.requested_amount}`}
              />
              <Info label="Date" value={application?.created_at} />
            </div> */}

            {/* NEXT STEPS */}
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl p-4 text-left">
              <p className="font-medium text-secondary mb-1">
                What happens next?
              </p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Your application is under review</li>
                <li>Our team may contact you</li>
                <li>You’ll be notified once approved</li>
              </ul>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-secondary text-white py-3 rounded-lg hover:bg-blue-800 transition"
              >
                Go to Dashboard
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                View Loans <ArrowRight size={16} />
              </button>
            </div>

            {/* FOOTER */}
            <p className="text-xs text-muted">
              🔒 Secure system • Kigali Microloans
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

