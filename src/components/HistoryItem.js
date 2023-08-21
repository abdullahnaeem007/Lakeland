import React from 'react'
import {BsChatDots} from 'react-icons/bs'

function HistoryItem(props) {

    function handleClick()
    {
        var temparr=[]
        var temp={title:props.obj.title,show:1,index:props.index}
        for(var i=0;i<props.chatarr.length;i++)
        {
            if(props.chatarr[i].title==props.obj.title)
            {
                temparr.push(temp)
            }
            else
            {
                temparr.push(props.chatarr[i])
            }
        }

        props.setchatarr(temparr)
        props.setshowobj(temp)
    }

  return (
    <button class='w-full mb-7 flex flex-row items-center space-x-10 bg-white/40 text-white  rounded-xl border-[2px]' onClick={handleClick}>
        <div class='md:w-[15%] w-[25%] flex justify-center border-r-[2px] p-5'>
            <div class='rounded-full border-[2px] border-white p-1'>
                <BsChatDots size='4rem' class=''/>
            </div>
        </div>
        <div class='w-[85%] space-y-3 flex flex-col items-start  '>
            <text class='text-lg font-sans text-white font-bold'>Chat {props.index}</text>
            <text class='text-lg text-white font-sans font-light '>Title: {props.obj.title}</text>
        </div>
    </button>
  )
}

export default HistoryItem