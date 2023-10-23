import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  console.log("files", files);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 50,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
  });

  console.log(formData);

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(uploading);
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            resolve(downloadURL)
          );
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "rent" || e.target.id === "sale") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("you need atleast one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("discount price must be lower then regular price");
      setLoading(true);
      setError(false);
      const userRef = currentUser?.data?._id;
      console.log("userRefer::", userRef);
      const res = await axios.post("/api/listing/create", {
        ...formData,
        useRef: userRef,
      });
      setLoading(false);

      if (!res.data.success) {
        setError(res.data.message);
      }
      navigate(`/listing/${res.data._id}`);
    } catch (error) {
      setError(error?.res?.data?.message || error?.message);
      setLoading(false);
    }
  };
  return (
    <main className="max-w-4xl mx-auto p-3">
      <h2 className="text-3xl text-center font-semibold my-6">CreateListing</h2>
      <form
        action=""
        className="flex flex-col sm:flex-row gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            type="textarea"
            name="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="sale"
                id="sale"
                className="w-5"
                value={formData.name}
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="rent"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
                className="w-5"
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="offer"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <input
                type="number"
                name="bathrooms"
                min="1"
                max="10"
                id="bathrooms"
                onChange={handleChange}
                checked={formData.bathrooms}
                className="p-2 border border-gray-300 rounded-lg outline-none"
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                name="bedrooms"
                min="1"
                max="10"
                id="bedrooms"
                onChange={handleChange}
                checked={formData.bedrooms}
                className="p-2 border border-gray-300 outline-none rounded-lg"
                required
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                min={"50"}
                max={"1000000"}
                onChange={handleChange}
                checked={formData.regularPrice}
                className="p-2 border border-gray-300  rounded-lg w-32 outline-none"
              />
              <div>
                <p>Regualar Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  name="discountPrice"
                  id="discountPrice"
                  min={"50"}
                  max={"1000000"}
                  onChange={handleChange}
                  checked={formData.discountPrice}
                  className="p-2 border border-gray-300 rounded-lg w-32 outline-none"
                />
                <div>
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-300 ml-2">
              The image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="image"
              accept="image/*"
              className="p-3 border border-gray-300 rounded w-full"
              multiple
            />
            <button
              onClick={handleImageUpload}
              type="button"
              disabled={uploading}
              className="p-3 text-green-600 border border-green-600 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData?.imageUrls?.map((url, index) => {
              return (
                <div
                  key={url}
                  className="flex justify-between p-4 border items-center"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700  rounded-lg text-white text-center uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Creating Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
