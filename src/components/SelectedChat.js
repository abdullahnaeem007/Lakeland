import React from 'react'
import UserText from './UserText'
import ChatText from './ChatText'

function SelectedChat(props) {
  return (
    <div class='w-full overflow-scroll no-scrollbar'>
        {
            props.totalInput.map((value,index)=>
                value.isHuman==true?
                  <div class='w-full h-fit text-white flex justify-end mb-7'>
                      <div class='max-w-[70%]'>
                          <div class='bg-color6 rounded-s-xl rounded-tr-xl p-3 break-words'>
                              {value.message}
                          </div>
                      </div>
                  </div>
                :
                <div class='w-full h-fit flex justify-start mb-7'>
                    <div class='max-w-[70%]'>
                        <div class='bg-white rounded-e-xl rounded-ss-xl p-3 break-words'>
                            <text class='whitespace-pre-wrap'>{value.message}</text>               
                        </div>
                    </div>
                </div>
            )
        }
    </div> 
  )
}

export default SelectedChat