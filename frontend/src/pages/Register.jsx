import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

// ✅ Use environment variable for flexibility, fallback to Render
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://blog-website-cdji.onrender.com";

function Register() {
  const { setIsAuthenticated, setProfile } = useAuth();
  const navigateTo = useNavigate();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [education, setEducation] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle photo preview and upload
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhoto(file);
    };
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!role || !name || !email || !phone || !password || !education || !photo) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("education", education);
    formData.append("photo", photo);

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API_BASE_URL}/api/users/register`,
        formData,
        {
          withCredentials: true, // ✅ Important for sending cookies
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Save token to local storage (backup)
      localStorage.setItem("jwt", data.token);

      toast.success(data.message || "User registered successfully");

      // Update auth context
      setProfile(data.user || data);
      setIsAuthenticated(true);

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
      setEducation("");
      setPhoto("");
      setPhotoPreview("");

      // Navigate to home/dashboard
      navigateTo("/");
    } catch (error) {
      console.error("Registration Error:", error);

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <form onSubmit={handleRegister}>
          <div className="font-semibold text-xl text-center mb-6">
            Cilli<span className="text-blue-500">Blog</span>
          </div>
          <h1 className="text-xl font-semibold mb-6 text-center">Register</h1>

          {/* Role Selection */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Name */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <input
              type="number"
              placeholder="Your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Education */}
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            required
          >
            <option value="">Select Your Education</option>
            <option value="BTech">BTech</option>
            <option value="BCA">BCA</option>
            <option value="MBA">MBA</option>
            <option value="BBA">BBA</option>
          </select>

          {/* Profile Photo */}
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 mr-4 border rounded overflow-hidden">
              <img
                src={photoPreview || "/default-avatar.png"}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={changePhotoHandler}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Login Link */}
          <p className="text-center mb-4">
            Already registered?{" "}
            <Link to="/login" className="text-blue-600">
              Login Now
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md text-white transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-800"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
