import { Icon } from "@stellar/design-system";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 sm:px-6 py-12">
      {/* Icon glow */}
      <div id="tour-welcome" className="mb-8 sm:mb-10 p-6 sm:p-8 glass glow-mint rounded-full relative">
        <Icon.Rocket01 size="xl" className="text-[var(--accent)] relative z-20" />
        <div className="absolute inset-0 bg-[var(--accent)] opacity-5 blur-2xl rounded-full" />
      </div>

      {/* Hero headline — scales down on mobile */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-5 sm:mb-6 tracking-tighter leading-tight sm:leading-none">
        Automate your <span className="text-[var(--accent)]">Payroll</span>
        <br className="hidden sm:block" />
        {" "}on the <span className="text-[var(--accent2)]">Stellar</span> Network.
      </h1>

      {/* Sub-headline */}
      <p className="text-base sm:text-xl text-[var(--muted)] max-w-2xl mb-10 sm:mb-12 leading-relaxed font-medium">
        PayD is the next-gen dashboard for real-time employee payments.
        Secure, transparent, and ultra-fast.
      </p>

      {/* CTA buttons — stack on mobile, side-by-side on sm+ */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto mt-4">
        <button
          className="touch-target w-full sm:w-auto px-8 py-4 bg-[var(--accent)] text-bg font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-[var(--accent)]/20 text-sm sm:text-base"
          onClick={() => {
            void navigate("/payroll");
          }}
        >
          Manage Payroll
        </button>
        <button
          className="touch-target w-full sm:w-auto px-8 py-4 glass border-[var(--border-hi)] text-[var(--text)] font-bold rounded-xl hover:bg-white/5 transition-all outline-none text-sm sm:text-base"
          onClick={() => {
            void navigate("/employee");
          }}
        >
          View Employees
        </button>
      </div>

      {/* Feature cards — 1 col on mobile, 3 on md+ */}
      <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left max-w-6xl w-full">
        <div className="card glass noise">
          <div className="w-11 h-11 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-5 border border-[var(--accent)]/20">
            <Icon.CreditCard01 size="lg" className="text-[var(--accent)]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">Instant Settlement</h3>
          <p className="text-[var(--muted)] text-sm leading-relaxed">
            No more waiting for banks. Pay your staff in seconds with sub-cent fees.
          </p>
        </div>

        <div className="card glass noise">
          <div className="w-11 h-11 rounded-lg bg-[var(--accent2)]/10 flex items-center justify-center mb-5 border border-[var(--accent2)]/20">
            <Icon.Users01 size="lg" className="text-[var(--accent2)]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">Global Workforce</h3>
          <p className="text-[var(--muted)] text-sm leading-relaxed">
            Onboard anyone, anywhere. Pay in USDC, XLM, or local stablecoins.
          </p>
        </div>

        <div className="card glass noise">
          <div className="w-11 h-11 rounded-lg bg-[var(--danger)]/10 flex items-center justify-center mb-5 border border-[var(--danger)]/20">
            <Icon.ShieldTick size="lg" className="text-[var(--danger)]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">On-Chain Audit</h3>
          <p className="text-[var(--muted)] text-sm leading-relaxed">
            Full transparency. Every transaction is immutable and verifiable on-ledger.
          </p>
        </div>
      </div>
    </div>
  );
}
