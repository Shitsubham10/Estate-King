import { useState,useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function Updatelisting() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  //useeffect to update the formdata
  useEffect(() => {
    const fetchListings = async () => {
      const listingId = params.listingId;
      try {
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setFormData(data);
      } catch (err) {
        console.error('Error fetching listing:', err.message);
      }
    };
    fetchListings();
  }, [params.listingId]);
  const handleImageSubmit = (e) => {
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
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
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
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (

<main className="bg-gradient-to-r from-indigo-50 to-blue-50 min-h-screen py-12 px-8 md:px-20">
  <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
      Update Your Listing
    </h1>
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        <input
          type="text"
          placeholder="Listing Name"
          className="w-full p-5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 text-lg font-medium"
          id="name"
          maxLength="62"
          minLength="10"
          required
          onChange={handleChange}
          value={formData.name}
        />
        <textarea
          placeholder="Description"
          className="w-full p-5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 text-lg font-medium"
          id="description"
          required
          onChange={handleChange}
          value={formData.description}
        />
        <input
          type="text"
          placeholder="Address"
          className="w-full p-5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 text-lg font-medium"
          id="address"
          required
          onChange={handleChange}
          value={formData.address}
        />

        {/* Listing Type and Features */}
        <div className="flex flex-wrap gap-6">
          {['sale', 'rent'].map((type) => (
            <div key={type} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={type}
                className="w-6"
                onChange={handleChange}
                checked={formData.type === type}
              />
              <label className="text-gray-700 font-medium">{type === 'sale' ? 'Sell' : 'Rent'}</label>
            </div>
          ))}
          {['parking', 'furnished', 'offer'].map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={feature}
                className="w-6"
                onChange={handleChange}
                checked={formData[feature]}
              />
              <label className="text-gray-700 font-medium capitalize">{feature}</label>
            </div>
          ))}
        </div>

        {/* Price and Bedroom/Bathroom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex items-center gap-3">
            <input
              type="number"
              id="bedrooms"
              min="1"
              max="10"
              className="w-full p-5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 text-lg font-medium"
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <label className="text-gray-700">Beds</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              id="bathrooms"
              min="1"
              max="10"
              className="w-full p-5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 text-lg font-medium"
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <label className="text-gray-700">Baths</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              id="regularPrice"
              min="50"
              max="10000000"
              className="w-full p-5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 text-lg font-medium"
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <label className="text-gray-700">Regular Price</label>
          </div>
          {formData.offer && (
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="10000000"
                className="w-full p-5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 text-lg font-medium"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <label className="text-gray-700">Discounted Price</label>
            </div>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        <div>
          <p className="font-semibold text-lg text-gray-800">
            Upload Images (Max 6)
            <span className="block text-sm text-gray-600">First image will be the cover image</span>
          </p>
          <div className="flex gap-6">
            <input
              type="file"
              className="w-full p-5 border border-gray-300 rounded-lg text-lg font-medium"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg font-medium transition duration-200"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-600 text-sm mt-2">{imageUploadError}</p>
        </div>

        {/* Display Uploaded Images */}
        <div>
          {formData.imageUrls.map((url, index) => (
            <div key={url} className="flex justify-between items-center bg-gray-50 p-5 rounded-lg shadow-sm mb-5">
              <img src={url} alt="uploaded" className="w-24 h-24 object-cover rounded-md" />
              <button
                onClick={() => handleRemoveImage(index)}
                className="text-red-600 hover:opacity-80 transition duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-lg font-medium transition duration-200"
        >
          {loading ? 'Updating...' : 'Update Listing'}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    </form>
  </div>
</main>
  );
}

