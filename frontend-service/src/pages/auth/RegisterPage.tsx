import { useEffect, useState } from "react";

import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useRegisterMutation } from "../../features/auth/authApi";

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
type UIMessage = string | null;
const RegisterPage = () => {
  const navigate = useNavigate();

  const [register, { isLoading, isSuccess, error: apiError }] =
    useRegisterMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState<UIMessage>(null);

  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle Success Redirect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isSuccess) {
      setMessage("Account created successfully. Redirecting to login...");

      timer = setTimeout(() => {
        navigate("/sign-in", {
          replace: true,
        });
      }, 1500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSuccess, navigate]);

  // Handle API Error
  useEffect(() => {
    if (!apiError) return;

    const err = apiError as {
      data?: {
        message?: string;
      };
    };

    setMessage(err?.data?.message || "Registration failed");
  }, [apiError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setMessage("");
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      }).unwrap();
    } catch {
      // handled by useEffect(apiError)
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
      {/* Background */}
      <div
        className="
          absolute inset-0 overflow-hidden
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
          rounded-3xl border border-white/20
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
              text-sm text-slate-300
            "
          >
            Register to get started
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="
            space-y-4
          "
        >
          {/* Name */}
          <InputField
            icon={<User size={18} />}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          {/* Email */}
          <InputField
            icon={<Mail size={18} />}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          {/* Password */}
          <PasswordField
            value={formData.password}
            onChange={handleChange}
            show={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
            name="password"
            placeholder="Create password"
          />

          {/* Confirm Password */}
          <PasswordField
            value={formData.confirmPassword}
            onChange={handleChange}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((prev) => !prev)}
            name="confirmPassword"
            placeholder="Confirm password"
          />

          {/* Message */}
          {message && (
            <div
              className={`
                px-4 py-3 rounded-xl text-sm border
                ${
                  isSuccess
                    ? `
                      text-green-400
                      bg-green-500/10
                      border-green-500/20
                    `
                    : `
                      text-red-400
                      bg-red-500/10
                      border-red-500/20
                    `
                }
              `}
            >
              {message}
            </div>
          )}

          {/* Terms */}
          <label
            className="
              flex items-start
              text-sm text-slate-300
              gap-2
            "
          >
            <input
              type="checkbox"
              required
              className="
                mt-1
                accent-blue-600
              "
              /
            >

            <span>
              I agree to the{" "}
              <span
                className="
                  text-blue-400
                "
              >
                Terms & Conditions
              </span>
            </span>
          </label>

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
              disabled:opacity-70 transition-all
              active:scale-[0.98]
              gap-2
            "
          >
            {isLoading ? (
              <>
                <Loader2
                  size={18}
                  className="
                    animate-spin
                  "
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
          <Link
            to="/sign-in"
            className="
              font-medium text-blue-400 hover:text-blue-300
            "
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

type InputFieldProps = {
  icon: React.ReactNode;
  type: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({
  icon,
  type,
  name,
  value,
  placeholder,
  onChange,
}: InputFieldProps) => {
  return (
    <div
      className="
        relative
      "
    >
      <div
        className="
          absolute left-4 top-1/2
          text-slate-400
          -translate-y-1/2
        "
      >
        {icon}
      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="
          w-full
          py-2 pl-11 pr-4
          text-white placeholder:text-slate-400
          bg-white/10
          rounded-xl border border-white/20 outline-none
          focus:ring-2 focus:ring-blue-500
        "
        /
      >
    </div>
  );
};

type PasswordFieldProps = {
  value: string;
  show: boolean;
  name: string;
  placeholder: string;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordField = ({
  value,
  show,
  name,
  placeholder,
  onToggle,
  onChange,
}: PasswordFieldProps) => {
  return (
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
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="
          w-full
          py-2 pl-11 pr-12
          text-white placeholder:text-slate-400
          bg-white/10
          rounded-xl border border-white/20 outline-none
          focus:ring-2 focus:ring-blue-500
        "
        /
      >

      <button
        type="button"
        onClick={onToggle}
        className="
          absolute right-4 top-1/2
          text-slate-400 hover:text-white
          -translate-y-1/2
        "
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default RegisterPage;
