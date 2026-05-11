import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { useLoginMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../app/hooks";
import { setCredentials } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login(formData).unwrap();

      dispatch(setCredentials(res));

      console.log("Login Success");
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div
      className="
        flex items-center justify-center
        min-h-screen
        px-4
        bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800
      "
    >
      {/* Background Blur */}
      <div
        className="
          absolute top-0 left-0 overflow-hidden
          w-full h-full
        "
      >
        <div
          className="
            absolute top-[-100px] left-[-100px]
            w-[300px] h-[300px]
            bg-blue-500/20
            rounded-full
            blur-3xl
          "
          /
        >

        <div
          className="
            absolute bottom-[-100px] right-[-100px]
            w-[300px] h-[300px]
            bg-purple-500/20
            rounded-full
            blur-3xl
          "
          /
        >
      </div>

      {/* Login Card */}
      <div
        className="
          relative z-10
          w-full max-w-md
          p-8
          bg-white/10
          rounded-3xl border border-white/10
          backdrop-blur-xl shadow-2xl
        "
      >
        {/* Header */}
        <div
          className="
            mb-8
            text-center
          "
        >
          <h1
            className="
              text-4xl text-white font-bold tracking-tight
            "
          >
            Welcome Back
          </h1>

          <p
            className="
              mt-2
              text-sm text-slate-300
            "
          >
            Please login to your account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="
            space-y-5
          "
        >
          {/* Email */}
          <div>
            <label
              className="
                block
                mb-2
                text-sm text-slate-200 font-medium
              "
            >
              Email Address
            </label>

            <div
              className="
                relative
              "
            >
              <Mail
                size={18}
                className="
                  absolute left-4 top-1/2
                  text-slate-400
                  -translate-y-1/2
                "
                /
              >

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="
                  w-full
                  py-3 pl-11 pr-4
                  text-white placeholder:text-slate-400
                  bg-white/5
                  rounded-xl border border-white/10 focus:border-transparent
                  outline-none focus:ring-2 focus:ring-blue-500
                  transition-all
                "
                /
              >
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="
                block
                mb-2
                text-sm text-slate-200 font-medium
              "
            >
              Password
            </label>

            <div
              className="
                relative
              "
            >
              <Lock
                size={18}
                className="
                  absolute left-4 top-1/2
                  text-slate-400
                  -translate-y-1/2
                "
                /
              >

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="
                  w-full
                  py-3 pl-11 pr-12
                  text-white placeholder:text-slate-400
                  bg-white/5
                  rounded-xl border border-white/10 focus:border-transparent
                  outline-none focus:ring-2 focus:ring-blue-500
                  transition-all
                "
                /
              >

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  hover:text-white
                  transition
                "
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Options */}
          <div
            className="
              flex items-center justify-between
              text-sm
            "
          >
            <label
              className="
                flex items-center
                text-slate-300
                cursor-pointer
                gap-2
              "
            >
              <input
                type="checkbox"
                className="
                  accent-blue-500
                "
                /
              >
              Remember me
            </label>

            <button
              type="button"
              className="
                text-blue-400 hover:text-blue-300
                transition
              "
            >
              Forgot password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full
              py-3
              font-semibold text-white
              bg-gradient-to-r from-blue-600 hover:from-blue-500
              to-indigo-600 hover:to-indigo-500
              rounded-xl
              disabled:opacity-70 transition-all shadow-lg shadow-blue-500/20
              active:scale-[0.98]
            "
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div
          className="
            mt-8
            text-center text-sm text-slate-400
          "
        >
          Don&apos;t have an account?{" "}
          <button
            className="
              text-blue-400 hover:text-blue-300 font-medium
              transition
            "
          >
           <Link to="/sign-up">Create Account</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;