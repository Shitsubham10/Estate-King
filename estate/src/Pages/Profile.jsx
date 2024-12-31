
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import { app } from '../firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from '../redux/slices/Userslice';
import { Link } from 'react-router-dom';

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileperc, setFileperc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formdata, setFormdata] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleUploadFile(file);
    }
  }, [file]);

  const handleUploadFile = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileperc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormdata({ ...formdata, avatar: downloadURL })
        );
      }
    );
  };

  const changeHandler = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const deleteHandler = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signOut');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure());
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const HandlelistingDelete = async(listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev)=>prev.filter((listing) => listing._id !== listingId)
    );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">Your Profile</h1>
        <div className="flex flex-col items-center">
          <input
            type="file"
            hidden
            accept="image/*"
            ref={fileRef}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <img
            src={file ? URL.createObjectURL(file) : currentUser.avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full border border-gray-300 object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
            onClick={() => fileRef.current.click()}
          />
          <p className="mt-2 text-sm text-gray-600">
            {fileUploadError ? (
              <span className="text-red-500">Error uploading image</span>
            ) : fileperc > 0 && fileperc < 100 ? (
              <span className="text-yellow-500">Uploading... {fileperc}%</span>
            ) : fileperc === 100 ? (
              <span className="text-green-500">Upload complete</span>
            ) : null}
          </p>
        </div>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              defaultValue={currentUser.username}
              onChange={changeHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              defaultValue={currentUser.email}
              onChange={changeHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Update Profile
          </button>
        </form>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={deleteHandler}
            className="text-red-500 hover:underline"
          >
            Delete Account
          </button>
          <button
            onClick={handleSignOut}
            className="text-blue-500 hover:underline"
          >
            Sign Out
          </button>
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleShowListing}
            className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Show My Listings
          </button>
          <Link
            to="/create-listing"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg text-center hover:bg-blue-600"
          >
            Create Listing
          </Link>
        </div>
        {showListingError && (
          <p className="text-center text-red-500 mt-2">Error loading listings</p>
        )}
        {userListings && userListings.length > 0 && (
          <div className="mt-6 space-y-4">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt={listing.name}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                  </Link>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{listing.name}</h3>
                    <p className="text-sm text-gray-500">{listing.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/update-listing/${listing._id}`}
                    className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button onClick={() => HandlelistingDelete(listing._id)}
                    className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

