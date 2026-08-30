import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stethoscope } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pine-50 via-sand-50 to-sand-100 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pine-700 text-sand-50">
            <Stethoscope size={22} />
          </span>
          <h1 className="font-display text-3xl font-semibold text-pine-900">Welcome back</h1>
          <p className="mt-1 text-sm text-pine-600">Sign in to continue managing your care</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
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
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-pine-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-pine-800 underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
