import React from 'react'

function ChatText(props) {
  return (
    <div class='w-full h-fit flex justify-start mb-7'>
        <div class='max-w-[70%]'>
            <div class='bg-white rounded-e-xl rounded-ss-xl p-3 break-words'>
              {
                props.check==true?
                <text className='whitespace-pre-wrap'>{props.value.message}</text>
                :
                <text className='whitespace-pre-wrap'>{props.value}</text>
              }
            </div>
        </div>
    </div>
  )
}

export default ChatText