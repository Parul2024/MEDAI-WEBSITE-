import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScanLine, BellRing, Sparkles, ArrowRight, FileText } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [tip, setTip] = useState(null);

  useEffect(() => {
    api.get("/prescriptions").then((r) => setPrescriptions(r.data.slice(0, 3)));
    api.get("/reminders").then((r) => setReminders(r.data.filter((rm) => rm.active).slice(0, 4)));
    api.get("/wellness/tip-of-the-day").then((r) => setTip(r.data));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Hero */}
      <section className="card mb-8 flex flex-col items-start justify-between gap-6 overflow-hidden bg-gradient-to-br from-pine-700 to-pine-900 p-10 text-sand-50 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-pine-200">
            Good to see you, {user?.name?.split(" ")[0]}
          </p>
          <h1 className="max-w-lg font-display text-3xl font-semibold leading-tight md:text-4xl">
            Every prescription, explained clearly.
          </h1>
          <p className="mt-3 max-w-md text-sm text-pine-100">
            Snap a photo of your prescription and MedAI reads it for you — medicine names, dosages,
            what they treat, and reminders so you never miss a dose.
          </p>
          <Link to="/upload" className="btn-primary mt-6 bg-sand-100 text-pine-900 hover:bg-white">
            <ScanLine size={16} /> Scan a prescription
          </Link>
        </div>
        <div className="hidden shrink-0 md:block">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-pine-800/60 ring-8 ring-pine-800/30">
            <ScanLine size={56} className="text-sand-100" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent prescriptions */}
        <div className="card md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-pine-900">
              <FileText size={18} /> Recent Prescriptions
            </h2>
            <Link to="/upload" className="text-sm font-semibold text-pine-700 hover:underline">
              View all
            </Link>
          </div>

          {prescriptions.length === 0 ? (
            <p className="py-8 text-center text-sm text-pine-500">
              No prescriptions yet. Upload one to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between rounded-xl border border-pine-100 p-4"
                >
                  <div>
                    <p className="font-medium text-pine-900">
                      {p.medicines?.length ? p.medicines.map((m) => m.name).join(", ") : "Processing..."}
                    </p>
                    <p className="text-xs text-pine-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="pill capitalize">{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: reminders + wellness tip */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-pine-900">
              <BellRing size={18} /> Upcoming Reminders
            </h2>
            {reminders.length === 0 ? (
              <p className="text-sm text-pine-500">No active reminders.</p>
            ) : (
              <ul className="space-y-2">
                {reminders.map((r) => (
                  <li key={r._id} className="flex items-center justify-between text-sm">
                    <span className="text-pine-800">{r.medicineName}</span>
                    <span className="pill">{r.times.join(", ")}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/reminders" className="mt-4 flex items-center gap-1 text-sm font-semibold text-pine-700 hover:underline">
              Manage reminders <ArrowRight size={14} />
            </Link>
          </div>

          {tip && (
            <div className="card bg-sand-100">
              <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold text-pine-900">
                <Sparkles size={18} /> Tip of the Day
              </h2>
              <p className="text-xs font-semibold uppercase tracking-wide text-pine-600">{tip.category}</p>
              <p className="mt-1 text-sm text-pine-800">{tip.tip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
