import React from 'react'

export default function Header() {
  return (
    <nav className='w-full h-[10vh] bg-blue-100 px-4'>
      <div className='flex items-center justify-between w-full h-full'>
        <div className='flex text-sm md:text-2xl font-bold'>
          <span className='text-red-500'>Bharat</span>
          <span className='text-blue-500'>Properties</span>
        </div>
        <div>
          <input type="text" name="search" id="search" placeholder='Search...' className='p-2 w-64 rounded-md bg-gray-200 outline-none'/>
        </div>
        <div className='flex text-black gap-4'>
          <li className='list-none hover:underline cursor-pointer duration-150'>Home</li>
          <li className='list-none hover:underline cursor-pointer duration-150'>About</li>
          <li className='list-none hover:underline cursor-pointer duration-150'>SignIn</li>
        </div>
      </div>
    </nav>
  )
}
