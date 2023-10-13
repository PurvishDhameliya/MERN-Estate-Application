import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../store/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { loading = false, error } = useSelector((state) => state?.user || {});
  const { loading, error } = useSelector((state) => state?.user);

  console.log("error:::", error);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(formData);
    try {
      dispatch(signInStart());
      const res = await axios.post("/api/auth/signin", formData);

      dispatch(signInSuccess(res));
      navigate("/");
    } catch (error) {
      console.log("FORNtned errirr", error);
      dispatch(signInFailure(error?.response?.data?.message || error?.message));

      console.log("res");
    }
  };

  return (
      <div className="max-w-lg mx-auto p-3">
        <h2 className="text-3xl text-center font-semibold my-6">Sign In</h2>
        <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            className="p-3 outline-none rounded-lg border"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="p-3 outline-none rounded-lg border"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "loading" : "Sign In"}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-3">
          <p>{"Don't Have an account?"}</p>
          <Link to="/sign-up">
            <span className="text-blue-700 cursor-pointer">Sign Up</span>
          </Link>
        </div>
        {error && <p className="text-red-700 mt-5">{error}</p>}
      </div>
  );
};

export default SignIn;
