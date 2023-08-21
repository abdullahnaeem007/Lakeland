import React from 'react'
import Navbar from './Navbar'
import {BsArrowRightSquare} from 'react-icons/bs'


function LandingPage() {

    function RedirectSignupPage()
    {
        window.location.replace('/signup')
    }
    
  return (
    <div class='w-full h-[100vh] bg-color4'>
        <Navbar/>
        <div className='w-full h-[100vh] flex flex-row bg-gradient-to-br from-[#7A3E3E] from-5%  to-color4 to-50% justify-center items-center'>
            <div class='lg:w-[55%] md:w-[75%] w-[90%] flex flex-col text-white items-center space-y-14 mt-10'>
                <text class='md:text-7xl text-5xl font-serif text-center -space-x-3'>MenuMatch</text>
                <text class='font-sans font-light lg:text-[2.5vh] md:text-[2vh] text-base text-center'>An AI-Powered Tool to Accelerate Sales, Amplify Success: Empowering Sales to Target the Perfect Operators text. Welcome to MenuMatch: Unleashing the Power of AI for Unparalleled Sales Success! With our user-friendly chat interface powered by AI, MenuMatch revolutionizes the foodservice industry by effortlessly combining data-driven insights and targeted strategies. Seamlessly integrating into your workflow, MenuMatch is accessible anytime, anywhere, making AI-enabled sales execution simple and efficient.</text>
                <button class='md:w-1/2 sm:w-1/3 w-full py-5 bg-color1 rounded-lg text-lg font-bold flex items-center justify-center' onClick={RedirectSignupPage}>
                    Get Started
                    <BsArrowRightSquare class='ml-3'/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default LandingPage