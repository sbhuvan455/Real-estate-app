import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {

  const {currentUser} = useSelector((state) => state.user);

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='font-semibold text-3xl text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.data.avatar} alt="Profile" className='rounded-full self-center h-24 w-24 object-cover cursor-pointer mt-2'/>
        <input type="text" name="username" id="username" placeholder='username' className='rounded-lg border p-3'/>
        <input type="email" name="email" id="email" placeholder='email' className='rounded-lg border p-3'/>
        <input type="text" name="password" id="password" placeholder='password' className='rounded-lg border p-3'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>

      <div className='flex justify-between mt-5'>
        <span
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

    </div>
  )
}
