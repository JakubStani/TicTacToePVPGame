import React, { useState } from 'react'
import './GameTile.css'

function GameTile({value}) {
  //const [value, setValue] = useState('')
  return (
    <div className='gt-game-tile'>
        <h1 className='gt-value'>{value}</h1>
    </div>
  )
}

export default GameTile