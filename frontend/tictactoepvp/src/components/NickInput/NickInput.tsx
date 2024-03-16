import React, { useState } from 'react'
import "./NickInput.css"

function NickInput() {

    const [nick, setNick] = useState('')

    return (
        <div>
            <div className='main-container'>
                <div className='input-container'>
                    <input
                        type='text'
                        value={nick}
                        placeholder='Enter your nick'
                        onChange={(value)=> setNick(value.target.value)}
                        
                    />
                </div>
                <div className='cancel-container'>
                    <button
                        className='cancel-button'
                        onClick={()=>{setNick('')}}
                    >
                        X
                    </button>
                </div>
            </div>
        </div>
      )
}

export default NickInput