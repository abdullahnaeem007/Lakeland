import React, { useEffect, useState } from 'react'
import UserText from './UserText'
import ChatText from './ChatText'

function Chatbot(props) {

    const [jwt,setjwt]=useState(null)
    const [currentInput,setcurrentInput]=useState('')
    const [incomingMsg,setincomingMsg]=useState(null)

    const [buttonCheck,setbuttonCheck]=useState(0)

    function handleInput(e)
    {
        setcurrentInput(e.target.value)
    }

    function submitInput()
    {
        props.settotalInput(obj=>[...obj,{isHuman:true,message:currentInput}])
        props.setgptarr(obj=>[...obj,{role:'user',content:currentInput}])
        setbuttonCheck(1)
    }

    const startConvo = async()=>
    {
        if(currentInput=='')
        {
            props.settotalInput((prev) => [...prev, { isHuman: false, message: 'Please ask a clear question' }]);
            props.setgptarr((prev) => [...prev, { role: 'system', content: 'Please ask a clear question' }]);
            setbuttonCheck(0)
            return
        }
        
        const bearerKey = `Bearer ${jwt}`

        const res=await fetch('https://jaredbackend-production.up.railway.app/chat',{
            method:'POST',
            body:JSON.stringify({messagesArray:props.gptarr}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bearerKey
            },
        })
        
        const reader=res.body.getReader()
        const decoder=new TextDecoder('utf-8');
        let temp=''
        let solution=''

        while(true)
        {
            const {done,value}= await reader.read()
            if(done)
            {
                break
            }
            temp=temp+decoder.decode(value)
            setincomingMsg(temp)

        }

        solution = temp;
        props.settotalInput((prev) => [...prev, { isHuman: false, message: solution }]);
        props.setgptarr((prev) => [...prev, { role: 'system', content: solution }]);
        setbuttonCheck(0)
        setincomingMsg(null)
        // setcurrentInput('')
    }

    useEffect(()=>
    {
        const session = JSON.parse(localStorage.getItem('sb-evvrvvydpfmzyhhquvkf-auth-token'))
        if (session){
            // YOu are logged in 
            const accessToken = session.access_token;
            setjwt(accessToken)
            console.log(accessToken)
          }
          else{
            window.location.replace('/login')
          }
    })


    useEffect(()=>
    {
        if(buttonCheck==1)
        {
            startConvo()
        }
    },[buttonCheck])

  return (
    <div class='w-full h-full flex flex-col justify-between p-7'>
        <div class='w-full h-[93vh] overflow-scroll no-scrollbar'>
            {
                props.totalInput.map((value,index)=>
                
                    value.isHuman==true?
                        <UserText value={value}/>
                    :
                    [
                        <ChatText value={value} check={true}/>
                    ]
                )
            }
            {
                incomingMsg!==null?
                <ChatText value={incomingMsg} check={false}/>
                :
                <></>
            }
        </div>

        <div class='w-full h-[7vh] flex items-center justify-between'>
            <input class='h-full w-[80%] bg-white/70 rounded-full outline-none px-5 shadow-xl' placeholder='Type your message' type='text' onChange={handleInput}>
            </input>
            <button class='md:w-[18%] w-[25%] h-full bg-black/80 rounded-full text-white font-medium md:text-xl text-lg shadow-xl hover:bg-gray-700/80' onClick={submitInput}>
                Send
            </button>
        </div>
    </div>
  )
}

export default Chatbot