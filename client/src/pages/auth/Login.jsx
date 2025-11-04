import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Clock,
  Building,
  Shield,
  ArrowRight
} from "lucide-react";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", form);
      login(data.token, data.user, rememberMe);
      toast.success("Welcome back! Login successful 🎉");
      setTimeout(() => nav("/auth/dashboard"), 600);
    } catch (e) {
      toast.error(e?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-400 via-purple-200 to-pink-100">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-6xl flex overflow-hidden border border-white/20">
        
        {/* Left side - Visual */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 hidden lg:flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <LogIn className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Sign in to continue managing your hotel operations, access real-time 
              analytics, and provide exceptional guest experiences.
            </p>
            <div className="mt-8 flex space-x-4">
              <div className="flex-1 bg-white/10 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 opacity-80" />
                  <div className="text-2xl font-bold">500+</div>
                </div>
                <div className="text-sm opacity-80 mt-1">Hotels Trust Us</div>
              </div>
              <div className="flex-1 bg-white/10 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 opacity-80" />
                  <div className="text-2xl font-bold">99.9%</div>
                </div>
                <div className="text-sm opacity-80 mt-1">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPass ? "text" : "password"}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <Link 
                //   to="/auth/forgot-password" 
                  className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                  Forgot password?
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/auth/register" 
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors flex items-center justify-center"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}