import { useEffect, useState } from "react";
import { Bell, Trash2, Power } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/reminders");
    setReminders(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (r) => {
    await api.put(`/reminders/${r._id}`, { active: !r.active });
    toast.success(r.active ? "Reminder paused" : "Reminder resumed");
    load();
  };

  const remove = async (id) => {
    await api.delete(`/reminders/${id}`);
    toast.success("Reminder deleted");
    load();
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-2 font-display text-3xl font-semibold text-pine-900">Your Reminders</h1>
      <p className="mb-8 text-sm text-pine-600">Stay on track with every dose, every day.</p>

      {loading ? (
        <p className="text-sm text-pine-500">Loading...</p>
      ) : reminders.length === 0 ? (
        <div className="card py-16 text-center">
          <Bell className="mx-auto mb-3 text-pine-300" size={32} />
          <p className="text-pine-600">No reminders yet. Set one from a scanned prescription.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((r) => (
            <div key={r._id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium text-pine-900">
                  {r.medicineName} {r.dosage && <span className="text-pine-500">· {r.dosage}</span>}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {r.times.map((t) => (
                    <span key={t} className="pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(r)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    r.active ? "bg-pine-100 text-pine-700" : "bg-sand-200 text-sand-600"
                  }`}
                >
                  <Power size={13} /> {r.active ? "Active" : "Paused"}
                </button>
                <button
                  onClick={() => remove(r._id)}
                  className="rounded-full p-2 text-pine-400 hover:bg-clay/10 hover:text-clay"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reminders;
