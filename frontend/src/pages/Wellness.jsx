import { useEffect, useState } from "react";
import { Droplet, Moon, Activity, Leaf, Wind, User, Clock, Eye, Sparkles } from "lucide-react";
import api from "../api/axios";

const ICONS = { droplet: Droplet, moon: Moon, activity: Activity, leaf: Leaf, wind: Wind, user: User, clock: Clock, eye: Eye };

const Wellness = () => {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    api.get("/wellness/tips").then((r) => setTips(r.data));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10 text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pine-100 text-pine-700">
          <Sparkles size={22} />
        </span>
        <h1 className="font-display text-3xl font-semibold text-pine-900">Everyday Wellbeing</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-pine-600">
          Small, sustainable habits that support your treatment and your overall health.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip, i) => {
          const Icon = ICONS[tip.icon] || Sparkles;
          return (
            <div key={i} className="card">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-pine-100 text-pine-700">
                <Icon size={18} />
              </span>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-pine-500">{tip.category}</p>
              <p className="text-sm text-pine-800">{tip.tip}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wellness;
