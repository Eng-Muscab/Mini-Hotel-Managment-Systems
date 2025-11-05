import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "sonner";
import { 
  Eye, 
  EyeOff, 
  Rocket, 
  User, 
  Mail, 
  Lock, 
  CheckCircle,
  Shield,
  Clock,
  Users
} from "lucide-react";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  function calcStrength(pwd) {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setStrength(score);
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("Account created 🎉 Redirecting to login…");
      setTimeout(() => nav("/auth/login"), 900);
    } catch (e) {
      toast.error(e?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const strengthConfig = {
    0: { color: "bg-gray-300", text: "No password", icon: null },
    1: { color: "bg-red-500", text: "Weak", icon: Shield },
    2: { color: "bg-yellow-500", text: "Fair", icon: Shield },
    3: { color: "bg-blue-500", text: "Good", icon: CheckCircle },
    4: { color: "bg-green-500", text: "Strong", icon: CheckCircle }
  };

  const StrengthIcon = strengthConfig[strength]?.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-400 via-purple-200 to-pink-100">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-6xl flex overflow-hidden border border-white/20">
        
        {/* Left side - Visual */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 hidden lg:flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Rocket className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Create your account and unlock access to powerful room management tools, 
              booking analytics, and customer insights.
            </p>
            <div className="mt-8 flex space-x-4">
              <div className="flex-1 bg-white/10 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 opacity-80" />
                  <div className="text-2xl font-bold">99%</div>
                </div>
                <div className="text-sm opacity-80 mt-1">Satisfaction</div>
              </div>
              <div className="flex-1 bg-white/10 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 opacity-80" />
                  <div className="text-2xl font-bold">24/7</div>
                </div>
                <div className="text-sm opacity-80 mt-1">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-600 mt-2">Start your journey with us today</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-4">
                {/* Full Name Field */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                        calcStrength(e.target.value);
                      }}
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

                  {/* Password strength meter */}
                  {form.password && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                        <span className="flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          Password Strength
                        </span>
                        <span className={`font-semibold flex items-center ${
                          strength <= 1 ? "text-red-500" :
                          strength === 2 ? "text-yellow-500" :
                          strength === 3 ? "text-blue-500" : "text-green-500"
                        }`}>
                          {StrengthIcon && <StrengthIcon className="w-3 h-3 mr-1" />}
                          {strengthConfig[strength]?.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            strengthConfig[strength]?.color
                          } ${strength === 0 ? 'w-0' : strength === 1 ? 'w-1/4' : strength === 2 ? 'w-1/2' : strength === 3 ? 'w-3/4' : 'w-full'}`}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/auth/login" 
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors flex items-center justify-center"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}