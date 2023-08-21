import React, { useState } from 'react'
import {BsRobot} from 'react-icons/bs'
import {BiMenu} from 'react-icons/bi'
import {GiCancel} from 'react-icons/gi'
import {RiChatHistoryLine} from 'react-icons/ri'
import {AiOutlineLoading} from 'react-icons/ai'
import Chatbot from './Chatbot'
import ChatHistory from './ChatHistory'
import DeleteHistory from './DeleteHistory'
import logo from '../images/lakeland.png'
import axios from 'axios';
import { useEffect } from 'react'
import DropDown from './DropDown'
import supabase from '../config/Supabase'
import Swal from 'sweetalert2'

function Dashboard() {
    const [jwt,setJwt] = useState(null)

    const [option,setoption]=useState(1)
    const [totalInput,settotalInput]=useState([])

    const [CountryCheck,setCountryCheck]=useState(0)
    const [SelectedState,setSelectedState]=useState('Alabama')
    const [isLoading,setisLoading]=useState(false)

    const [localId,setLocalId]=useState(null)

    const [gptarr,setgptarr]=useState([])

    const [MenuCheck,setMenuCheck]=useState(false)

    const [HistoryArr,setHistoryArr]=useState([])
    const [HistoryCheck,setHistoryCheck]=useState(0)

    const [totalHistory,settotalHistory]=useState([])

    const TotalStates=["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
   ]

   async function updateState()
   {
    setisLoading(true)
    await dispatchState(SelectedState)
    
   }

  async function dispatchState(myState){
   
    const bearerKey = `Bearer ${jwt}`
    console.log(myState)
     await axios.post('https://jaredbackend-production.up.railway.app/state', {
        "state": myState,
      },{
        headers: {
            'Authorization': bearerKey
        },
    })
      .then(function (response) {
        console.log("State sent to backend");
        const {localId}=response.data
        setLocalId(localId)
      })
      .catch(function (error) {
        console.log(`Error : ${error}}`);
      });
  }

  //JSON.stringify(resData)

  async function dispatchLocalID(localID){

    const bearerKey = `Bearer ${jwt}`
    console.log(localID)

     await axios.post('https://jaredbackend-production.up.railway.app/restaurants', {
        "localId": localID,
      },{
        headers: {
            'Authorization': bearerKey
        },
    })
      .then(function (response) {
        console.log("LocalId sent to backend");
        let resData=response.data
        setgptarr(obj=>[...obj,{role:'system',content:`Act like you are an expert assistant and your name is 'Lakeland Assistant' who'll guide user about food related questions.
        Use this knowledge : ${JSON.stringify(resData)}.
        If you can add more knowledge, you are free to use your own knowledge too.
        I want response in this format :
        Restaurant Name
        Price Range
        Cuisines
        and if you have some more knowledge, you can after that but follow this format for every restaurant in your answer.`}])
        setCountryCheck(1)
    })
      .catch(function (error) {
        console.log(`Error : ${error}}`);
        
      });
      setisLoading(false)
  }

    function ChatOption()
    {
        setoption(1)
    }

    function HistoryOption()
    {
        setoption(2)
    }

    function ClearOption()
    {
        setoption(3)
    }

    function UpdateMenuCheck()
    {
        setMenuCheck(!MenuCheck)
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

    async function getHistory()
    {
        const bearerKey = `Bearer ${jwt}`

        const res=await fetch('https://jaredbackend-production.up.railway.app/getHistory',{
            method:'GET',
            headers: {
                'Authorization': bearerKey
            },
        })

        const solution= await res.json()
        if(solution.message!='History not found.')
        {
            setHistoryArr(solution.history[0].history)
        }
    }

    async function saveHistory()
    {
        const bearerKey = `Bearer ${jwt}`

        const res=await fetch('https://jaredbackend-production.up.railway.app/saveHistory',{
            method:'POST',
            body:JSON.stringify({messageArray:totalInput}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bearerKey
            },
        })

        const solution= await res.json()
        alert(solution)
        getHistory()

        window.location.reload()
    }


    useEffect(()=>
    {
        const session = JSON.parse(localStorage.getItem('sb-evvrvvydpfmzyhhquvkf-auth-token'))
        if (session){
            // YOu are logged in 
            const accessToken = session.access_token;
            setJwt(accessToken)
            console.log(accessToken)
          }
          else{
            window.location.replace('/login')
          }


    })

    useEffect(()=>
    {
        if(localId!=null)
        {
            dispatchLocalID(localId)
        }
    },[localId])
 
    useEffect(()=>
    {
        if(jwt!=null)
        {
            if(HistoryCheck==0)
            {
                getHistory()
                setHistoryCheck(1)
            }

            settotalHistory([])
            var extraTemp=[]
            var check=0
            var count=0

            var HeavyCheck=false

            for(var i=0;i<HistoryArr.length;i++)
            {
                if(HistoryArr[i].length>1)
                {
                    HeavyCheck=true
                    break
                }
            }

            if(HeavyCheck==false)
            {
                settotalHistory(obj=>[...obj,HistoryArr])


            }

            else
            {
                for(var i=0;i<HistoryArr.length;i++)
                {
                    if(HistoryArr[i].length>1)
                    {
                        if(check==0 && extraTemp.length>0)
                        {
                            settotalHistory((obj)=>[...obj,extraTemp])
                            check=1
                        }
                        
                    }
                    else
                    {
                        extraTemp.push(HistoryArr[i])
                        count++
                    }
                }

                var node=HistoryArr.filter((_,index)=>index>=count)
                settotalHistory(obj=>[...obj,...node])
            }
        }
    },[jwt,HistoryArr])

    useEffect(()=>
    {
        console.log('TOTal hist')
        console.log(totalHistory)
    },[totalHistory])

  return (
    <div class='flex justify-center '>
        {
            MenuCheck==true?
            <DropDown MenuCheck={MenuCheck} setMenuCheck={setMenuCheck} option={option} setoption={setoption} saveHistory={saveHistory}/>
            :
            <></>
        }

        {
            CountryCheck==0?
            <div class='absolute top-[20vh] z-[999] md:w-1/2 w-4/5 h-1/2 bg-gradient-to-r to-white/50 from-color2 rounded-lg flex flex-col items-center p-5 justify-between'>
                <text class='text-6xl font-sans font-thin text-center'>Select a State</text>
                <select class='w-full py-3 rounded-full text-lg px-8 ' onChange={(e)=>{
                    setSelectedState(e.target.value+', United States');
                    
                    }}>
                    {
                        TotalStates.map((obj)=>
                            <option>{obj}</option>
                        )
                    }
                </select>
                <button class='flex flex-row justify-center items-center w-full p-5 bg-color1 rounded-lg text-white' onClick={updateState} >
                    Submit
                    {
                        isLoading==true?
                        <AiOutlineLoading class='animate-spin ml-4'/>
                        :
                        <></>
                    }
                </button>
            </div>
            :
            <></>
        }
        <div className={CountryCheck==0?'w-full h-[100vh] flex flex-row justify-center items-center blur-2xl bg-gradient-to-br from-[#7A3E3E] from-5%  to-color4 to-50%' :'w-full h-[100vh] flex flex-row bg-gradient-to-br from-[#7A3E3E] from-5%  to-color4 to-50% '}>
            
            <div class='md:flex hidden h-full lg:w-[25%] md:w-[40%] bg-white/10 backdrop-blur-[2px] py-7 pl-7  flex-col justify-between '>
                <div class='w-full flex justify-start'>
                    <img src={logo} class='w-[85%]'/>
                </div>

                <div class='w-full h-[40%] flex flex-col items-start justify-evenly text-white text-xl font-medium'>
                    <button class={option==1?'w-full h-1/3 rounded-s-full bg-white text-color1 flex justify-start items-center px-14 ' : 'w-full h-1/3 flex justify-start items-center px-14'} onClick={ChatOption}>
                        <BsRobot />
                        <text class='ml-5'>Chatbot</text>
                    </button>
                    <button class={option==2?'w-full h-1/3 rounded-s-full bg-white text-color1 flex justify-start items-center px-14' : 'w-full h-1/3 flex justify-start items-center px-14'} onClick={HistoryOption}>
                        <RiChatHistoryLine />
                        <text class='ml-5'>Chat History</text>
                    </button>
                    <button class={option==3?'w-full h-1/3 rounded-s-full bg-white text-color1 flex justify-start items-center px-14' : 'w-full h-1/3 flex justify-start items-center px-14'} onClick={ClearOption}>
                        <GiCancel />
                        <text class='ml-5'>Clear History</text>
                    </button>
                </div>

                <div class='w-full flex flex-col justify-end h-[20%] pr-7'>
                    {
                        option==1?
                        <button class='w-full mb-3 h-1/2 font-medium text-xl text-white bg-blue-700 rounded-lg backdrop-blur-[2px] hover:bg-blue-500' onClick={saveHistory} >Save chat</button>
                        :
                        <></>
                    }  
                    <button class='w-full h-1/2 font-medium text-xl text-white bg-white/20 rounded-lg backdrop-blur-[2px] hover:bg-white/40' onClick={RedirectLoginPage} >Log out</button>
                </div>
            </div>

            <div class='h-full md:w-[75%] w-full items-start'>
                <button class='absolute md:hidden block' onClick={UpdateMenuCheck} >
                    <BiMenu size='3rem' color='white'/>
                </button>
                {
                    option==1?
                    <Chatbot totalInput={totalInput} settotalInput={settotalInput} gptarr={gptarr} setgptarr={setgptarr} />
                    :
                    [
                        option==2?
                        <ChatHistory totalInput={totalInput} totalHistory={totalHistory} />
                        :
                        <DeleteHistory settotalInput={settotalInput}/>
                    ]
                }
            </div>
        </div>
    </div>
  )
}

export default Dashboard