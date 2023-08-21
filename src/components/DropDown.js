import React from 'react'
import {BiMenu} from 'react-icons/bi'
import supabase from '../config/Supabase'
import Swal from 'sweetalert2'

function DropDown(props) {

    function UpdateMenuCheck()
    {
        props.setMenuCheck(!props.MenuCheck)
    }

    function ChatOption()
    {
        props.setoption(1)
    }

    function HistoryOption()
    {
        props.setoption(2)
    }

    function ClearOption()
    {
        props.setoption(3)
    }

    async function RedirectLoginPage()
    {
        const { error } = await supabase.auth.signOut()
        if(!error)
        {
            Swal.fire({
                title:'Success',
                text:'Logged out Successfully',
                icon:'success',
                confirmButtonText:'OK'
            }).then(function(){
                window.location.replace('/login')
            })
        }
    }

  return (
    <div class='w-full h-full flex flex-col items-center justify-between absolute z-[999] bg-gradient-to-br from-[#7A3E3E] from-5%  to-color4 to-50% pb-7'>
        <button class='absolute w-full md:hidden block' onClick={UpdateMenuCheck} >
            <BiMenu size='3rem' color='white'/>
        </button>
        <div class='w-full h-fit flex flex-col items-center text-2xl text-white '>
            <button class={props.option==1? 'w-full p-14 border-t-[1px] border-b-[0.5px] bg-white/10' :'w-full p-14 border-t-[1px] border-b-[0.5px] hover:bg-white/10'} onClick={ChatOption} >Chatbot</button>
            <button class={props.option==2? 'w-full p-14 border-t-[1px] border-b-[0.5px] bg-white/10' :'w-full p-14 border-t-[1px] border-b-[0.5px] hover:bg-white/10'} onClick={HistoryOption}>Chat History</button>
            <button class={props.option==3? 'w-full p-14 border-t-[1px] border-b-[0.5px] bg-white/10' :'w-full p-14 border-t-[1px] border-b-[0.5px] hover:bg-white/10'} onClick={ClearOption}>Delete History</button>
        </div>

        
        <button class='w-4/5 px-14 py-7 border-[1px] text-white bg-blue-700 hover:bg-blue-500 text-xl' onClick={()=>props.saveHistory()}>Save Chat</button>
        <button class='w-4/5 px-14 py-7 border-[1px] text-white bg-color5/60 text-xl hover:bg-color5/20' onClick={RedirectLoginPage}>Log out</button>
    </div>
  )
}

export default DropDown