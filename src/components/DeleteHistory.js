import React, { useEffect } from 'react'
import Swal from 'sweetalert2'
import supabase from '../config/Supabase'

function DeleteHistory(props) {

    async function deleteHistorySupabase()
    {

        const value=JSON.parse(localStorage.getItem('sb-evvrvvydpfmzyhhquvkf-auth-token'))
        const userID=value.user.id

        

        const { data, error } = await supabase
            .from('history')
            .delete()
            .eq('id', userID);

            if(error)
            {
                console.log('History not del')
            }
            else
            {
                console.log('History deleted')
            }

            window.location.reload()

    }

    function handleClear()
    {

        const value=JSON.parse(localStorage.getItem('sb-evvrvvydpfmzyhhquvkf-auth-token'))
        const userID=value.user.id
        console.log(userID)

        Swal.fire({
            title:'Success',
            text:'Your History has been Deleted',
            icon:'success',
            confirmButtonText:'OK'
        }).then(function()
        {
            props.settotalInput([])
            deleteHistorySupabase()
        })
    }

    function handleNotClear()
    {
        Swal.fire({
            title:'Failure',
            text:'Your History is still Intact',
            icon:'error',
            confirmButtonText:'OK'
        })
    }

    

  return (
    <div class='w-full h-full flex justify-center items-center'>
        <div class='flex flex-col items-center rounded-lg space-y-10'>
            <text class='text-5xl font-sans font-light text-white text-center'>Do you want to clear history?</text>
            <div class='flex flex-row space-x-5'>
                <button class='py-5 px-10 bg-color1 rounded-lg text-white' onClick={handleClear}>Yes</button>
                <button class='py-5 px-10 bg-color2 rounded-lg text-black' onClick={handleNotClear}>No</button>
            </div>
        </div>
    </div>
  )
}

export default DeleteHistory