import React, { useState } from 'react'
import "./NickInput.css"

function NickInput({nick, setNick}) {
    const [userInput, setUserInput] = useState('');
    return (
        <div>
            <div className='main-container'>
                <div className='input-container'>
                    <input
                        type='text'
                        value={userInput}
                        placeholder='Enter your nick'
                        onChange={(value)=> setUserInput(value.target.value)}
                        onKeyDown={(event) =>(event.key === 'Enter' ? setNick(userInput) : null)}
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