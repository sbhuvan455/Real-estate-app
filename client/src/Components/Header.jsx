import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { restoreDefault } from '../redux/user/userSlice.js';

export default function Header() {

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  const handleRestore = () => {
    dispatch(restoreDefault())
  }

  return (
    <nav className='w-full h-20 bg-blue-100 px-4'>
      <div className='flex items-center justify-between w-full h-full'>
        <Link to='/'>
          <div className='flex text-sm md:text-2xl font-bold select-none'>
            <span className='text-red-500'>Bharat</span>
            <span className='text-blue-500'>Properties</span>
          </div>
        </Link>
        <div>
          <input type="text" name="search" id="search" placeholder='Search...' className='p-2 w-40 md:w-64 rounded-md bg-gray-200 outline-none'/>
        </div>
        <div className='hidden md:flex text-black gap-4'>
          <Link to='/'><li className='list-none hover:underline cursor-pointer duration-150'>Home</li></Link>
          <Link to='/about'><li className='list-none hover:underline cursor-pointer duration-150'>About</li></Link>
          <Link to='/profile'>
            {(currentUser)? (<img src={currentUser.data.avatar} alt="Profile" className='rounded-md h-7 w-7 object-cover'/>) : (<li className='list-none hover:underline cursor-pointer duration-150'>SignIn</li>)}
          </Link>
        </div>
      </div>
      <p onClick={handleRestore} className='cursor-pointer'>restorestate</p>
    </nav>
  )
}
