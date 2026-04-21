import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  // Animated counters
  const [stats, setStats] = useState({ clients: 0, loans: 0, growth: 0 });

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setStats({
        clients: Math.min(1200, i * 20),
        loans: Math.min(3500, i * 40),
        growth: Math.min(98, i * 2),
      });
      if (i > 60) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-linear-to-br from-primary via-[#0f2a52] to-secondary text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 800 400" className="w-full h-full animate-pulse">
          <path
            d="M0,200 C200,100 400,300 800,200"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* NAVBAR */}
      <header className="relative flex justify-between items-center px-4 md:px-16 py-5 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-white text-primary font-bold px-3 py-1 rounded">KML</div>
          <span className="font-semibold text-lg">Kigali Microloans</span>
        </div>

        <div className="flex items-center gap-x-2">
          <button
          onClick={() => navigate("/login")}
          className="bg-white text-primary px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium hover:scale-105 transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/application")}
          className="bg-white text-primary px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium hover:scale-105 transition"
        >
          Apply for Loan
        </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-4 md:px-16 py-16 grid md:grid-cols-2 gap-12 items-center z-10">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Next-Gen Microfinance
            <br /> Infrastructure
          </h1>

          <p className="mt-6 text-gray-300 text-sm md:text-base max-w-lg">
            Built for speed, security, and scalability. Kigali Microloans
            digitizes lending operations with intelligent automation and
            real-time analytics.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-primary px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:scale-105 transition"
            >
              Enter Platform <ArrowRight size={18} />
            </button>

            <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition">
              Request Demo
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mt-10 text-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">{stats.clients}+</h3>
              <p className="text-xs text-gray-400">Clients</p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold">{stats.loans}+</h3>
              <p className="text-xs text-gray-400">Loans Issued</p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold">{stats.growth}%</h3>
              <p className="text-xs text-gray-400">Growth Rate</p>
            </div>
          </div>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div className="relative">
          <div className="absolute -inset-2 bg-linear-to-r from-secondary via-accent to-secondary blur-2xl opacity-20 rounded-2xl"></div>

          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <svg viewBox="0 0 500 300" className="w-full h-56">
              <polyline
                fill="none"
                stroke="white"
                strokeWidth="3"
                points="0,200 100,150 200,180 300,120 400,140 500,80"
              />
            </svg>

            <p className="text-center text-sm text-gray-300 mt-4">
              Real-time loan performance analytics
            </p>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="px-4 md:px-16 py-10 text-center text-gray-300">
        <p className="text-xs uppercase tracking-widest mb-4">
          Trusted by Microfinance Institutions
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm opacity-70">
          <span>FinanceCo</span>
          <span>MicroFund</span>
          <span>Kigali SACCO</span>
          <span>TrustBank</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 md:px-16 py-16 bg-white text-primary">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Enterprise-Grade Capabilities
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            {
              title: "Automated Loan Engine",
              desc: "Streamline approvals, disbursement, and repayment cycles.",
            },
            {
              title: "Advanced Risk Analysis",
              desc: "Leverage data insights to minimize lending risks.",
            },
            {
              title: "Multi-channel Payments",
              desc: "Integrate mobile money, bank, and crypto payments.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl shadow hover:shadow-xl transition border"
            >
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 md:px-16 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Power Your Lending Institution Today
        </h2>

        <p className="text-gray-300 mt-3 text-sm md:text-base">
          Secure, scalable and built for the future of finance.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 bg-white text-primary px-8 py-3 rounded-lg font-medium hover:scale-105 transition"
        >
          Go to Login
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-400 text-xs md:text-sm py-6">
        © {new Date().getFullYear()} Kigali Microloans • Elite Fintech Platform
      </footer>
    </div>
  );
}
