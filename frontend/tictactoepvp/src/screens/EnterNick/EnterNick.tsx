import React, { useState } from 'react'
import NickInput from '../../components/NickInput/NickInput.tsx'

function EnterNick() {
  const [nick, setUserNick] = useState('');

  return (
    <div>
      {nick==='' &&
        <div>
          <div>EnterNick</div>
          <NickInput nick={nick} setNick={setUserNick}/>
        </div>
      }
      {nick !=='' &&
      <div>
        <div>
          <h1>Hello {nick}!</h1>
          <p>Searching for an opponent</p>
        </div>
        {/*TODO: insert loading animation */}
        <h1>Loading...</h1>
      </div>

      }
    </div>
  )
}

export default EnterNick