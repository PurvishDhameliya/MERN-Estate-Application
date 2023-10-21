import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
} from "../store/user/userSlice";
import axios from "axios";
import { Link } from "react-router-dom";
const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state?.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);

  // console.log(formData)
  // console.log(filePercentage)
  // console.log(fileUploadError)
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state-changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
        // console.log("Upload is" + progress + "% done");
      },
      (error) => {
        setUploadError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.post(
        `/api/user/update/${currentUser?.data?._id}`,
        formData
      );
      if (!res.data.success) {
        dispatch(updateUserFailure(res.data.message));
        return;
      }
      console.log(res);
      dispatch(updateUserSuccess(res));
      setSuccess(true);
    } catch (error) {
      dispatch(
        updateUserFailure(error?.response?.data?.message || error?.message)
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(
        `/api/user/delete/${currentUser.data._id}`
      );
      if (!res.data.success) {
        dispatch(deleteUserFailure(res.data.message));
        return;
      }
      dispatch(deleteUserSuccess(res.data));
    } catch (error) {
      dispatch(
        deleteUserFailure(error?.response?.data?.message || error?.message)
      );
    }
  };

  const handleSignout = async (e) => {
    e.preventDefault();
    try {
      dispatch(signoutUserStart());
      const res = await axios.get("/api/auth/signout");
      if (!res.data.success) {
        dispatch(deleteUserFailure(res.data.message));
        return;
      }
      dispatch(deleteUserSuccess(res?.data));
    } catch (error) {
      dispatch(
        deleteUserFailure(error?.response?.data?.message || error?.message)
      );
    }
  };

  // In firsbase storage app we include this rules :)

  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  return (
    <div className="max-w-lg mx-auto p-3">
      <h2 className="text-3xl text-center font-semibold my-6">Profile</h2>
      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          hidden
        />

        <img
          src={formData.avatar || currentUser?.data?.avatar}
          alt="profile"
          className="object-cover rounded-full h-28 w-28 self-center cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        <p className="self-center text-sm">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-red-700">{`Uploading ${filePercentage}% done`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          name="username"
          defaultValue={currentUser?.data?.username}
          placeholder="Enter Email"
          className="p-3 outline-none rounded-lg border"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          defaultValue={currentUser?.data?.email}
          placeholder="Enter Email"
          className="p-3 outline-none rounded-lg border"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          defaultValue={currentUser?.data?.password}
          placeholder="Enter Password"
          className="p-3 outline-none rounded-lg border"
          onChange={handleChange}
        />
        <button
          type="submit"
          //disabled={loading}
          className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading" : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 rounded-lg p-3 text-white text-center uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading" : "Creating Listing"}
        </Link>
      </form>
      <div className="flex justify-between p-2">
        <span className="text-red-700 cursor-pointer" onClick={handleDelete}>
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignout}>
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-4">{error ? error : ""}</p>
      <p className="text-green-700 mt-4">
        {success ? "updated profile details.." : ""}
      </p>
    </div>
  );
};

export default Profile;
