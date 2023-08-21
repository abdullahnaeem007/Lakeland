import React, { useState } from 'react'
import pic from '../images/signinpic.jpeg' 
import logo from '../images/lakeland.png'
import supabase from '../config/Supabase'
import Swal from 'sweetalert2'

function LoginIn() {

    async function loginSupabase(){
        const { data, error } = await supabase.auth.signInWithPassword({
            email: InputEmail,
            password: InputPass,
          })

          const session = JSON.parse(localStorage.getItem('sb-evvrvvydpfmzyhhquvkf-auth-token'))
          if (session){
            // YOu are logged in 
            const accessToken = session.access_token;

            Swal.fire({
                title:'Success',
                text:'Signed in Successfully',
                icon:'success',
                confirmButtonText:'OK'
            }).then(function(){
                window.location.replace('/dashboard')
            })

            console.log(accessToken)
          }
          else{
            // Error, maybe wonrg password
            Swal.fire({
                title:'Failure',
                text:'Incorrect Email or Password',
                icon:'error',
                confirmButtonText:'OK'
            })
            console.log("Error | Wrong passwrod ?")
          }
    }

    const [InputEmail,setInputEmaill]=useState('')
    const [InputPass,setInputPass]=useState('')

    function handleEmail(event)
    {
        setInputEmaill(event.target.value)
    }

    function handlePassword(event)
    {
        setInputPass(event.target.value)
    }

    function RedirectSignupPage()
    {
        window.location.replace('/signup')
    }

    function RedirectDashboard()
    {
        loginSupabase();
    }

  return (
    <div class='w-full h-[100vh] bg-white flex flex-row'>
        <div class='w-full lg:w-1/2 h-full sm:p-5 p-2 flex flex-col'>
            <div class='w-full h-fit flex'>
                <img src={logo} class='sm:w-[20vh] w-[15vh]'/>
            </div>

            <div class='w-full h-full justify-center items-center flex flex-col py-10 sm:px-20 px-5 space-y-5'>

                <div class='w-full flex flex-col items-center space-y-2'>
                    <text class='sm:text-4xl text-3xl font-semibold text-center'>Welcome Back!</text>
                    <text class='sm:text-xl text-lg font-light text-center'>Welcome Back. Please enter your details</text>
                </div>

                <div class='w-full h-fit flex flex-col'>
                    <text class='text-lg'>Email</text>
                    <input class='w-full p-4 border-[3px] rounded-lg bg-gray-200/20 outline-color1'  placeholder='you@email.com' onChange={handleEmail}></input>
                </div>

                <div class='w-full h-fit flex flex-col'>
                    <text class='text-lg'>Passoword</text>
                    <input class='w-full p-4 border-[3px] rounded-lg bg-gray-200/20 outline-color1' type='password' placeholder='**********' onChange={handlePassword}></input>
                </div>

                <button class='w-full p-5 bg-color1 text-white rounded-lg font-semibold hover:bg-red-700' onClick={RedirectDashboard} >Log in</button>
               
                <button class='w-full p-5 bg-gray-200  rounded-lg font-semibold hover:bg-gray-300' onClick={RedirectSignupPage} >Create an Account</button>
            </div>
        </div>
        <div class='w-0 lg:w-1/2 h-full bg-red-400 flex justify-center items-center'>
            <img src={pic} class='w-full h-full object-cover' />
        </div>
    </div>
  )
}

export default LoginIn