import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
const Profile = () => {
  const { currentUser, loading } = useSelector((state) => state?.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // firsbase storage rules :)
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')
  return (
    <div>
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
              <span className="text-green-700">
                Image successfully Uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            name="username"
            value={currentUser?.data?.username}
            placeholder="Enter Email"
            className="p-3 outline-none rounded-lg border"
          />
          <input
            type="email"
            name="email"
            value={currentUser?.data?.email}
            placeholder="Enter Email"
            className="p-3 outline-none rounded-lg border"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Enter Password"
            className="p-3 outline-none rounded-lg border"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "loading" : "Update"}
          </button>
          <button
            type="button"
            disabled={loading}
            className="bg-green-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "loading" : "Creating Listing"}
          </button>
        </form>
        <div className="flex justify-between p-2">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign out</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
