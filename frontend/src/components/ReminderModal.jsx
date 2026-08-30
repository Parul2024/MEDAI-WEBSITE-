import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const ReminderModal = ({ med, prescriptionId, onClose }) => {
  const [times, setTimes] = useState(["08:00"]);
  const [saving, setSaving] = useState(false);

  const updateTime = (i, val) => setTimes(times.map((t, idx) => (idx === i ? val : t)));
  const addTime = () => setTimes([...times, "12:00"]);
  const removeTime = (i) => setTimes(times.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    try {
      await api.post("/reminders", {
        medicineName: med.name,
        dosage: med.dosage,
        times,
        prescription: prescriptionId,
      });
      toast.success(`Reminder set for ${med.name}`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save reminder");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/40 px-6 backdrop-blur-sm">
      <div className="card w-full max-w-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-pine-900">Remind me: {med.name}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-pine-500 hover:bg-pine-100">
            <X size={18} />
          </button>
        </div>

        <label className="label">Times</label>
        <div className="space-y-2">
          {times.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="time"
                value={t}
                onChange={(e) => updateTime(i, e.target.value)}
                className="input-field"
              />
              {times.length > 1 && (
                <button onClick={() => removeTime(i)} className="text-pine-400 hover:text-clay">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addTime} className="mt-2 flex items-center gap-1 text-xs font-semibold text-pine-700">
          <Plus size={14} /> Add another time
        </button>

        <button onClick={save} disabled={saving} className="btn-primary mt-6 w-full">
          {saving ? "Saving..." : "Save Reminder"}
        </button>
      </div>
    </div>
  );
};

export default ReminderModal;
