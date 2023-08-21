import React from 'react'
import pic from '../images/lakeland.png'

function Navbar() {

  function RedirectLoginPage()
  {
      window.location.replace('/login')
  }

  return (
    <div class='w-full bg-color4 absolute flex flex-row justify-between items-center md:pr-10 pr-3'>
      <div class='lg:w-[20%] md:w-[28%] w-[40%] bg-white py-2 flex justify-center items-center rounded-ee-lg'>
        <img src={pic} class='w-[60%]'/>
      </div>

      <button class='lg:w-[10%] md:w-[15%] w-[20%] h-fit py-2 bg-color5 text-white text-lg rounded-full' onClick={RedirectLoginPage}>
        Log in
      </button>
    </div>
  )
}

export default Navbar