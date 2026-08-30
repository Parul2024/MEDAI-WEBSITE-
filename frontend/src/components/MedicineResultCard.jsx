import { Pill, Clock, Activity, PlusCircle } from "lucide-react";

const MedicineResultCard = ({ med, onSetReminder }) => {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pine-100 text-pine-700">
            <Pill size={18} />
          </span>
          <div>
            <h4 className="font-display text-lg font-semibold text-pine-900">{med.name}</h4>
            <p className="text-xs text-pine-500">{med.matched ? "Matched to database" : "Not found in database"}</p>
          </div>
        </div>
        {onSetReminder && (
          <button
            onClick={() => onSetReminder(med)}
            className="flex items-center gap-1 rounded-full bg-pine-50 px-3 py-1.5 text-xs font-semibold text-pine-700 hover:bg-pine-100"
          >
            <PlusCircle size={14} /> Remind me
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-pine-500">Dosage</p>
          <p className="text-pine-900">{med.dosage || "Not detected"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-pine-500">Frequency</p>
          <p className="flex items-center gap-1 text-pine-900">
            <Clock size={13} /> {med.frequency || "As prescribed"}
          </p>
        </div>
      </div>

      {med.disease?.length > 0 && (
        <div>
          <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-pine-500">
            <Activity size={13} /> Used for
          </p>
          <div className="flex flex-wrap gap-1.5">
            {med.disease.map((d) => (
              <span key={d} className="pill">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineResultCard;
