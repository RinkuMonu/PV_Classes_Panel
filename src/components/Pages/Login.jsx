// src/pages/Login.jsx
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUser }) => {
  const url = import.meta.env.VITE_API_SERVER_URL;
  const navigate = useNavigate();

  // If a token already exists (e.g., after refresh), set default header
  React.useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const phone = form.get("phone");
    const password = form.get("password");

    try {
      const { data } = await axios.post(`${url}/api/users/login`, { phone, password });
      const { token, user } = data || {};

      if (!token || !user) {
        toast.error("Invalid response from server.");
        return;
      }

      // Role guard
      if (user.role !== "admin" && user.role !== "superadmin") {
        toast.error("You are not authorized to access this panel.");
        return;
      }

      // Persist token & safe user (never store password/hash)
      localStorage.setItem("token", token);
      const safeUser = {
        id: user.id || user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status,
        profile_image_url: user.profile_image_url ?? null,
      };
      localStorage.setItem("user", JSON.stringify(safeUser));

      // Default auth header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // App state + navigation
      setUser?.(safeUser);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error?.response?.data || error.message);
      const msg = error?.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(msg);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            {/* Left side - Image */}
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80"
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block"
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80"
                alt="Office"
              />
            </div>

            {/* Right side - Login Form */}
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Login
                </h1>

                <form onSubmit={handleSubmit}>
                  {/* Phone */}
                  <label className="block text-gray-800 dark:text-gray-400 font-medium text-sm">
                    Phone
                  </label>
                  <input
                    className="block w-full border px-3 py-1 text-sm rounded-md h-12 p-2
                               focus:outline-none bg-gray-100 focus:bg-white 
                               dark:text-gray-300 dark:bg-gray-700
                               border-gray-200 dark:border-gray-600 
                               dark:focus:bg-gray-700 dark:focus:border-gray-500"
                    type="text"
                    name="phone"
                    placeholder="7426991303"
                    autoComplete="username"
                    required
                  />

                  <div className="mt-6"></div>

                  {/* Password */}
                  <label className="block text-gray-800 dark:text-gray-400 font-medium text-sm">
                    Password
                  </label>
                  <input
                    className="block w-full border px-3 py-1 text-sm rounded-md h-12 p-2
                               focus:outline-none bg-gray-100 focus:bg-white 
                               dark:text-gray-300 dark:bg-gray-700
                               border-gray-200 dark:border-gray-600 
                               dark:focus:bg-gray-700 dark:focus:border-gray-500"
                    type="password"
                    name="password"
                    placeholder="***************"
                    autoComplete="current-password"
                    required
                  />

                  {/* Submit */}
                  <button
                    className="inline-flex items-center justify-center w-full h-12 mt-4 
                               text-sm font-medium text-white rounded-lg 
                               bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-600"
                    type="submit"
                  >
                    Login
                  </button>
                </form>

                {/* Links */}
                <p className="mt-4">
                  <a
                    className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                    href="/forgot-password"
                  >
                    Forgot your password
                  </a>
                </p>
                <p className="mt-1">
                  <a
                    className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                    href="/signup"
                  >
                    Create account
                  </a>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
