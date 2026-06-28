import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export const LoginPage = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      let redirectUrl = searchParams.get("redirect") || (isAdmin ? "/admin" : "/profile");
      // Prevent non-admins from getting stuck in a redirect loop to admin pages
      if (!isAdmin && (redirectUrl.startsWith("/admin") || redirectUrl.includes("/admin"))) {
        redirectUrl = "/profile";
      }
      navigate(redirectUrl);
    }
  }, [isAuthenticated, isAdmin, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      // The useEffect will handle redirection
    } else {
      setError(result.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background Decorative Organic Shapes (Bohemian Blurs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#F3DCF9]/30 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#C597A0]/20 blur-[90px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-[450px] bg-white border border-[#28273F]/5 rounded-[24px] shadow-[0_8px_30px_rgb(40,39,63,0.02)] p-8 md:p-10 relative z-10 animate-fade-in">
        
        {/* Header/Logo section */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="font-heading text-2xl md:text-3xl text-[#28273F] tracking-[0.15em] uppercase font-light">
              Meraki House
            </span>
          </Link>
          <p className="font-body text-[#666666] text-sm tracking-wide">
            Welcome back. Sign in to your sanctuary.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-[#EF4444]/5 border-l-2 border-[#EF4444] rounded-[8px] text-xs text-[#EF4444] font-body">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input group */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tracking-wider text-[#28273F]/70 uppercase font-body">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#28273F]/40">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[14px] font-body text-sm text-[#28273F] placeholder-[#28273F]/40 focus:outline-none focus:border-[#9D6C76] focus:ring-1 focus:ring-[#9D6C76] transition-all duration-300 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password input group */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold tracking-wider text-[#28273F]/70 uppercase font-body">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#9D6C76] hover:text-[#865A63] font-body hover:underline transition-all duration-300"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#28273F]/40">
                <Lock className="w-4 h-4" strokeWidth={1.5} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full pl-11 pr-12 py-3 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[14px] font-body text-sm text-[#28273F] placeholder-[#28273F]/40 focus:outline-none focus:border-[#9D6C76] focus:ring-1 focus:ring-[#9D6C76] transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#28273F]/40 hover:text-[#28273F]/70 transition-all duration-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#28273F] text-white py-3.5 px-6 rounded-[9999px] font-body text-sm font-medium tracking-wider uppercase hover:bg-[#9D6C76] active:scale-[0.96] shadow-button hover:shadow-hover hover:-translate-y-[2px] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer/Navigation Link */}
        <div className="mt-8 pt-6 border-t border-[#28273F]/5 text-center">
          <p className="text-xs font-body text-[#666666] tracking-wide">
            New to Meraki House?{" "}
            <Link
              to="/signup"
              className="text-[#9D6C76] hover:text-[#865A63] font-semibold hover:underline transition-all duration-300"
            >
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;