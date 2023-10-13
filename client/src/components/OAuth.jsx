import { useDispatch, useSelector } from "react-redux";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { signInSuccess } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = new getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log("result:::", result);
      const res = await axios.post("/api/auth/google", {
        name: result?.user?.displayName,
        email: result?.user?.email,
        photo: result?.user?.photoURL,
      });
      dispatch(signInSuccess(res));
      navigate("/");
    } catch (error) {
      console.log("googel errorr:", error.message);
    }
  };
  return (
    <>
      <button
        onClick={handleGoogleClick}
        disabled={loading}
        type="button"
        className="bg-red-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80"
      >
        {loading ? "loading" : "Continue with Google"}
      </button>
    </>
  );
};

export default OAuth;
