import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/signup", formData);
      console.log(response);

      if (response?.success === false) {
        setLoading(false);
        setError(response.message);
        return;
      }
      setLoading(false);
      setError(response.message);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/sign-in");
    } catch (error) {
      setLoading(true);
      setError(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
  return (
    <div className="max-w-lg p-3 mx-auto">
      <h2 className="text-3xl text-center my-6 font-semibold">Sign Up</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="border p-3 rounded-lg outline-none"
          type="text"
          name="username"
          value={formData.username}
          placeholder="Enter UserName"
          id="username"
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg outline-none"
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter Email"
          id="email"
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg outline-none"
          type="password"
          name="password"
          value={formData.password}
          placeholder="Enter Password"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading" : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-1">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700 cursor-pointer">Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
