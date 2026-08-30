import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "", gender: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form);
    if (res.success) {
      toast.success("Account created!");
      navigate("/dashboard");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pine-50 via-sand-50 to-sand-100 px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pine-700 text-sand-50">
            <HeartPulse size={22} />
          </span>
          <h1 className="font-display text-3xl font-semibold text-pine-900">Create your account</h1>
          <p className="mt-1 text-sm text-pine-600">Start understanding your prescriptions in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label">Full name</label>
            <input
              required
              className="input-field"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Age</label>
              <input
                type="number"
                className="input-field"
                placeholder="28"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Gender</label>
              <select
                className="input-field"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input-field"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-pine-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-pine-800 underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
