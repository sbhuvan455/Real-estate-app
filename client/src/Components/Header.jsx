import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <nav className='w-full h-[10vh] bg-blue-100 px-4'>
      <div className='flex items-center justify-between w-full h-full'>
        <div className='flex text-sm md:text-2xl font-bold'>
          <span className='text-red-500'>Bharat</span>
          <span className='text-blue-500'>Properties</span>
        </div>
        <div>
          <input type="text" name="search" id="search" placeholder='Search...' className='p-2 w-40 md:w-64 rounded-md bg-gray-200 outline-none'/>
        </div>
        <div className='hidden md:flex text-black gap-4'>
          <Link to='/'><li className='list-none hover:underline cursor-pointer duration-150'>Home</li></Link>
          <Link to='/about'><li className='list-none hover:underline cursor-pointer duration-150'>About</li></Link>
          <Link to='/sign-in'><li className='list-none hover:underline cursor-pointer duration-150'>SignIn</li></Link>
        </div>
      </div>
    </nav>
  )
}
