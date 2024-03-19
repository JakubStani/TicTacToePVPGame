import React, { useState } from 'react'
import NickInput from '../../components/NickInput/NickInput.tsx'
import useWebSocket from 'react-use-websocket'
function EnterNick({nick, setNick}) {
  
  return (
    <div>
      {nick==='' &&
        <div>
          <div>EnterNick</div>
          <NickInput nick={nick} setNick={setNick}/>
        </div>
      }
    </div>
  )
}

export default EnterNick

// {nick !=='' &&
//       <div>
//         <div>
//           <h1>Hello {nick}!</h1>
//           <p>Searching for an opponent</p>
//         </div>
//         {/*TODO: insert loading animation */}
//         <h1>Loading...</h1>
//       </div>

//       }