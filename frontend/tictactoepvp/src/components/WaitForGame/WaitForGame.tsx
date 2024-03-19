import React from 'react'

function WaitForGame({nick}) {
  return (
    <div>
        <div>
          <h1>Hello {nick}!</h1>
          <p>Searching for an opponent</p>
        </div>
        {/*TODO: insert loading animation */}
        <h1>Loading...</h1>
      </div>
  )
}

export default WaitForGame
