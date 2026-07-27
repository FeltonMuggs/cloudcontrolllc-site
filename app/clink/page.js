export default function Clink() {
  return (
    <main className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-slate-800 px-8 py-5">
        <div className="text-2xl font-black tracking-wider text-teal-400">
          CLINK<span className="text-emerald-400">.</span>
        </div>
        <div className="space-x-6 text-sm text-slate-400">
          <a href="#" className="hover:text-white">Cars</a>
          <a href="#" className="hover:text-white">Homes</a>
          <a href="#" className="hover:text-white">Verification</a>
        </div>
        <button className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-teal-400">
          Connect Wallet
        </button>
      </nav>

      {/* Hero Section */}
      <header className="mx-auto max-w-4xl px-4 py-20 text-center">
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          Direct Peer-to-Peer Titling &amp; Deeds
        </span>
        <h1 className="mb-4 mt-6 text-5xl font-extrabold tracking-tight">
          The Future of Ownership, <span className="text-teal-400">On-Chain.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-400">
          Instantly buy, sell, and transfer titles for vehicles and real estate. No middleman inertia. Fully integrated escrow, titles, and deeds.
        </p>
        <div className="flex justify-center gap-4">
          <button className="rounded-xl bg-teal-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-teal-400">
            Clink Your Car
          </button>
          <button className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-bold text-white transition hover:bg-slate-700">
            Clink Your Home
          </button>
        </div>
      </header>
    </main>
  );
}
