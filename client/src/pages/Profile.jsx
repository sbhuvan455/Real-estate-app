import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'; 
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'; 
import { Link } from 'react-router-dom'
import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserFailure, signInSuccess, signOutUserSuccess } from '../redux/user/userSlice.js';


export default function Profile() {

  const dispatch = useDispatch();

  const {currentUser, loading, error} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setshowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleDelete = async () => {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/v1/user/delete/${currentUser.data._id}`, {
      method: 'DELETE',
    })
    const data = await res.json();

    if(!data.success) dispatch(deleteUserFailure(data.message))
    if(data.success) dispatch(deleteUserSuccess())
  }

  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    const res = await fetch('/api/v1/auth/signout', {
      method: 'GET',
    })
    const data = await res.json();

    if(!data.success) dispatch(signOutUserFailure(data.message))

    if(data.success) dispatch(signOutUserSuccess())

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());

    const res = await fetch(`/api/v1/user/update/${currentUser.data._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json();
    console.log(data);

    if(!data.success) dispatch(updateUserFailure(data.message));
    if(data.success) {
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    }
  }
  
  useEffect(() => {
    handleFileUpload(file)
  }, [file])

  const handleFileUpload = (file) => {
    setFileUploadError(false);
    if(file === undefined) return;
    const storage = getStorage(app)
    const file_name = new Date().getTime() + file.name
    const storageRef = ref(storage, file_name)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  }

  const handleShowListings = async () => {
    setshowListingsError(false);

    const res = await fetch('/api/v1/user/listings');
    const response = await res.json();
    
    if(!response.success) showListingsError(true);
    
    if(response.success) {
      setUserListings(response.data)
      setshowListingsError(false);
    }
  }

  const handleListingDelete = async (listingId) => {
    const res = await fetch(`/api/v1/listing/delete/${listingId}`, {
      method: 'DELETE'
    })

    const response = await res.json();

    if(!response.success) console.error(response.message)

    if(response.success) {
      setUserListings((prevList) => prevList.filter(listing => listing._id != listingId))
    }
  }

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='font-semibold text-3xl text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*'/>
        <img src={formData.avatar || currentUser.data.avatar} onClick={() => fileRef.current.click()} alt="Profile" className='rounded-full self-center h-24 w-24 object-cover cursor-pointer mt-2'/>
        
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        <input type="text" defaultValue={currentUser.data.username} onChange={handleChange} name="username" id="username" placeholder='username' className='rounded-lg border p-3'/>
        <input type="email" defaultValue={currentUser.data.email} onChange={handleChange} name="email" id="email" placeholder='email' className='rounded-lg border p-3'/>
        <input type="text" onChange={handleChange} name="password" id="password" placeholder='password' className='rounded-lg border p-3'/>
        <button disabled = {loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "Loading..." : "Update"}</button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to='/create-listing'
        >
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDelete}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}