import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Lock,
} from "lucide-react";

import { useRegisterMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../app/hooks";
import { setCredentials } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useAppDispatch();

  const [register, { isLoading }] =
    useRegisterMutation();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      return setError("Passwords do not match");
    }

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setCredentials(res));
    } catch (err: any) {
      setError(
        err?.data?.message ||
          "Registration failed"
      );
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
          -z-10
        "
      >
        <div
          className="
            absolute top-10 left-10
            w-72 h-72
            bg-blue-500/30
            rounded-full
            blur-3xl
          "
          /
        >

        <div
          className="
            absolute bottom-10 right-10
            w-72 h-72
            bg-purple-500/30
            rounded-full
            blur-3xl
          "
          /
        >
      </div>

      <div
        className="
          w-full max-w-md
          p-8
          bg-white/10
          border border-white/20 rounded-3xl
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
            Create Account
          </h1>

          <p
            className="
              mt-2
              text-slate-300 text-sm
            "
          >
            Register to get started
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="
            space-y-3
          "
        >
          {/* Name */}
          <div>
            <label
              className="
                block
                mb-2
                text-sm text-slate-200 font-medium
              "
            >
              Full Name
            </label>

            <div
              className="
                relative
              "
            >
              <User
                size={18}
                className="
                  absolute left-4 top-1/2
                  text-slate-400
                  -translate-y-1/2
                "
                /
              >

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="
                  w-full
                  pl-11 pr-4 py-2
                  text-white placeholder:text-slate-400
                  bg-white/10
                  rounded-xl border border-white/20 outline-none
                  focus:ring-2 focus:ring-blue-500
                  transition-all
                "
                required
              /
              >
            </div>
          </div>

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
                className="
                  w-full
                  pl-11 pr-4 py-2
                  text-white placeholder:text-slate-400
                  bg-white/10
                  rounded-xl border border-white/20 outline-none
                  focus:ring-2 focus:ring-blue-500
                  transition-all
                "
                required
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
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="
                  w-full
                  pl-11 pr-12 py-2
                  text-white placeholder:text-slate-400
                  bg-white/10
                  rounded-xl border border-white/20 outline-none
                  focus:ring-2 focus:ring-blue-500
                  transition-all
                "
                required
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
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="
                block
                mb-2
                text-sm text-slate-200 font-medium
              "
            >
              Confirm Password
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
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                placeholder="Confirm password"
                className="
                  w-full
                  pl-11 pr-12 py-2
                  text-white placeholder:text-slate-400
                  bg-white/10
                  rounded-xl border border-white/20 outline-none
                  focus:ring-2 focus:ring-blue-500
                  transition-all
                "
                required
              /
              >

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
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
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="
                px-4 py-3
                text-sm text-red-400
                bg-red-500/10
                border border-red-500/20 rounded-xl
              "
            >
              {error}
            </div>
          )}

          {/* Terms */}
          <div
            className="
              flex items-start
              text-sm text-slate-300
              gap-2
            "
          >
            <input
              type="checkbox"
              className="
                mt-1
                accent-blue-600
              "
              required
            /
            >

            <p>
              I agree to the{" "}
              <span
                className="
                  text-blue-400
                  cursor-pointer
                "
              >
                Terms & Conditions
              </span>
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              flex items-center justify-center
              w-full
              py-2
              font-semibold text-white
              bg-blue-600 hover:bg-blue-700
              rounded-xl
              disabled:opacity-70 transition-all shadow-lg shadow-blue-600/30
              active:scale-[0.98]
              gap-2
            "
          >
            {isLoading ? (
              <>
                <Loader2
                  className="
                    animate-spin
                  "
                  size={18}
                /
                >
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div
          className="
            mt-8
            text-center text-sm text-slate-400
          "
        >
          Already have an account?{" "}
          <button
            className="
              text-blue-400 hover:text-blue-300 font-medium
            "
          >
            <Link to="/sign-in">Login</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;