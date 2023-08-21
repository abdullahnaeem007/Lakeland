import React, { useEffect, useState } from 'react'
import ChatText from './ChatText'
import UserText from './UserText'
import HistoryItem from './HistoryItem'
import SelectedChat from './SelectedChat'

function ChatHistory(props) {

    const [chatarr,setchatarr]=useState([])

    const [showobj,setshowobj]=useState(null)

    useEffect(()=>
    {
        setchatarr([])

        var arr=[]
        if(props.totalHistory[0].length>0)
        {
            console.log('phuudu')
            console.log(props.totalHistory)
            for(var i=0;i<props.totalHistory.length;i++)
            {
                
                var msg= props.totalHistory[i][0].message
                var object={title:msg,show:0}
                arr.push(object)
            }
        }

        console.log(arr)
        setchatarr(arr)
    },[])

  return (
    <div class='w-full h-full flex flex-col p-5 overflow-y-scroll no-scrollbar'>
        {
            showobj==null?
                chatarr.map((obj,index)=>
                    <HistoryItem obj={obj} index={index} chatarr={chatarr} setchatarr={setchatarr} setshowobj={setshowobj}  />
                )
            :
            [
                props.totalHistory.map((obj,index)=>
                    obj[0].message==showobj.title && index==showobj.index?
                    <SelectedChat totalInput={obj} />
                    :
                    <></>
                )    
            ]
        }
    </div>
  )
}

export default ChatHistory



