import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useHeartTrail } from "../hooks/useHeartTrail";

export const SignupPage = () => {
  const { register, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for heart particle trail
  const bgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useHeartTrail(bgRef, cardRef);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = searchParams.get("redirect") || (isAdmin ? "/admin" : "/profile");
      navigate(redirectUrl);
    }
  }, [isAuthenticated, isAdmin, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);
    setIsLoading(true);

    const result = await register(name, email, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.message || "Registration failed. Email may already be in use.");
    }
  };

  return (
    <div ref={bgRef} className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none cursor-heart">
      {/* Background Decorative Organic Shapes (Bohemian Blurs & Leaves) */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#F3DCF9]/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#C597A0]/20 blur-[110px] pointer-events-none" />
      

      {/* Split-pane card container */}
      <div ref={cardRef} className="w-full max-w-[850px] bg-white border border-[#28273F]/5 rounded-none shadow-[0_20px_50px_rgba(40,39,63,0.06)] relative z-10 animate-fade-in flex flex-col md:flex-row">
        
        {/* Left Side: Brand Image and invitation text */}
        <div className="w-full md:w-1/2 bg-[#EFE5E1] pt-10 pb-4 px-8 md:pt-12 md:pb-6 md:px-10 flex flex-col justify-between items-center relative z-20">
          <div className="w-full text-left mt-6 md:mt-8">
            <h2 
              className="font-heading italic text-[#855A63] leading-tight font-light"
              style={{ fontSize: "clamp(2.25rem, 6vw, 3.5rem)" }}
            >
              Join<br />
              Meraki House
            </h2>
          </div>

          <div className="w-full flex-1 flex justify-center items-end mt-4">
            <img 
              src="/home/auth_banner.png" 
              alt="Skincare Ritual Jar" 
              className="max-h-[520px] md:max-h-[580px] w-full object-contain drop-shadow-[0_12px_25px_rgba(40,39,63,0.06)] transition-all duration-500 z-30 relative"
              style={{
                transform: "scale(1.3) translate(10%, 10%)",
                transformOrigin: "bottom"
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10 bg-white">

          {error && (
            <div className="mb-6 p-4 bg-[#EF4444]/5 border-l-2 border-[#EF4444] rounded-[8px] text-xs text-[#EF4444] font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-widest text-[#28273F]/50 uppercase font-body">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="please enter Your Name"
                required
                disabled={isLoading}
                className="w-full py-2.5 bg-transparent border-b border-[#28273F]/15 font-body text-sm text-[#28273F] placeholder-[#28273F]/30 focus:outline-none focus:border-[#9D6C76] transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-widest text-[#28273F]/50 uppercase font-body">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="w-full py-2.5 bg-transparent border-b border-[#28273F]/15 font-body text-sm text-[#28273F] placeholder-[#28273F]/30 focus:outline-none focus:border-[#9D6C76] transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-widest text-[#28273F]/50 uppercase font-body">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  disabled={isLoading}
                  className="w-full pr-10 py-2.5 bg-transparent border-b border-[#28273F]/15 font-body text-sm text-[#28273F] placeholder-[#28273F]/30 focus:outline-none focus:border-[#9D6C76] transition-all duration-300 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-3 flex items-center text-[#28273F]/40 hover:text-[#28273F]/70 transition-all duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 mb-4 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="border border-[#9D6C76] hover:bg-[#9D6C76]/5 text-[#9D6C76] py-3.5 px-14 rounded-full font-body text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-50 active:scale-[0.97]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  <>
                    Sign Up
                    <svg className="w-2 h-2 ml-3 fill-[#9D6C76]" viewBox="0 0 100 100">
                      <polygon points="20,10 80,50 20,90" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Form switch footer */}
          <div className="mt-8 text-center md:text-left">
            <p className="text-xs font-body text-[#666666] tracking-wide">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#9D6C76] hover:text-[#865A63] font-semibold hover:underline transition-all duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>


        </div>

      </div>
    </div>
  );
};

export default SignupPage;