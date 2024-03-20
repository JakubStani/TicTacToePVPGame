const http = require('http')
const {WebSocketServer} = require('ws')

const url = require('url')
const uuidv4 = require('uuid').v4

const server = http.createServer()

const wsServer = new WebSocketServer({server})
const port = 8000;

const connections = {}
const users = {}
const gameboards = {}
const playersInQueue = []

const checkWin = (gameBoardState, xOrO) => {
    //check if specific player wins
    if(gameBoardState[0]==xOrO && gameBoardState[4]==xOrO && gameBoardState[8]==xOrO ||
    gameBoardState[2]==xOrO && gameBoardState[4]==xOrO && gameBoardState[6]==xOrO) {
      return true;
    }
    for(let i=0;i<3;i++) {
      if(gameBoardState[i]==xOrO && gameBoardState[i+3]==xOrO && gameBoardState[i+6]==xOrO ||
      gameBoardState[i*3]==xOrO && gameBoardState[i*3+1]==xOrO && gameBoardState[i*3+2]==xOrO)
      return true;
    }

    return false;
}

const checkDraw = (gameBoardState) => {
    console.log(`gbstate ${gameBoardState}`)
    for(let i=0;i<gameBoardState.length;i++) {
        if(gameBoardState[i]==='') {
            return false
        }
    }
    return true
}

const endGame = (gameUuid, gameResult, winner=null) => {
    const user1 = users[gameboards[gameUuid]['X']]
    const user2 = users[gameboards[gameUuid]['O']]

    user1['userState'] = 'endedGame'
    user2['userState'] = 'endedGame'

    console.log(`Game ${gameUuid} has ended. Winner is ${winner}`)

    const connection1 = connections[uuid1]
    const connection2 = connections[uuid2]
    // const gameState = JSON.stringify({gameData: gameData['state'], userData: user[uuid1]})

    connection1.send(JSON.stringify({kind: 'endedGame', gameState: gameboards[gameUuid]['state'], userData: users[uuid1], winner: users[winner] ? users[winner]['nick'] : null, mark: 'X', gameResult: gameResult}))
    connection2.send(JSON.stringify({kind: 'endedGame', gameState: gameboards[gameUuid]['state'], userData: users[uuid2], winner: users[winner] ? users[winner]['nick']: null, mark: 'O', gameResult: gameResult}))

    delete gameboards[gameUuid]

    //send information to clients, that game ended and who is the winner
}

const handleMessage = (bytes, uuid) => {
    console.log('obsługuję')
    const message = JSON.parse(bytes.toString())
    const user = users[uuid]

    console.log(message)

    switch(message['option']) {
        case 'move':
            const gameBoard = gameboards[user['gameUuid']]

            //TODO: send clicked index
            let crosOrCircle =null
            let opponent= null

            
            // if(gameBoard[message['index']]==='') {
                if(gameBoard['X']===uuid) {
                    gameBoard['state'][message['index']]='X';
                    crosOrCircle = 'X'
                    opponent = 'O'
                } else {
                    gameBoard['state'][message['index']]='O';
                    crosOrCircle = 'O'
                    opponent = 'X'
                }
                console.log(`aktualny gamestate: ${gameBoard['state']}`)
                //TODO: notify, whose turn it is
                users[uuid]['isTheirRound'] = !users[uuid]['isTheirRound']
                users[gameBoard[opponent]]['isTheirRound'] = !users[gameBoard[opponent]]['isTheirRound']
                notifyPlayers(uuid, crosOrCircle==='X'?'X': 'O', gameBoard[opponent], opponent==='O'?'O':'X', gameBoard)
                if(checkWin(gameBoard['state'], crosOrCircle)) {
                    console.log('wygrana')
                    endGame(user['gameUuid'], 'Win', uuid);
                } else {
                    if(checkDraw(gameBoard['state'])){
                        console.log('remis')
                        endGame(user['gameUuid'], 'Draw');
                    }
                }


            // }
            break
        default: null
    }

    //here make switch that depend on a message
    //do not forgot about notifyPlayers()
}

const handleClose = (uuid) => {
    const user = users[uuid]
    const closedGame = gameboards[user['gameUuid']]
    
    //not only delete user, but end game too
    if(user['userState'] === 'playing') {

        // let user2=null

        // //end game
        // if(closedGame!==null) {
        //     if(closedGame['X'] === uuid) {
        //         user2 = closedGame['O']
        //     } else {
        //         user2 = closedGame['X']
        //     }

        //     user2['userState'] = 'endedGame'
        //     user2['gameUuid'] = ''
        // }   

        // delete gameboards[user['gameUuid']]

        endGame(user['gameUuid'], 'Game interrupted')
    }
    //delete user from queue
    else {
        if(user['userState'] !== 'endedGame') {
            delete playersInQueue[uuid]
        }
    }

    //delete user
    delete connections[uuid]
    delete users[uuid]

    console.log(`User ${user['nick']} has disconnected`)
    console.log(`Users left: ${JSON.stringify(users)}`)

}

const handleQueue = (uuid) => {
    //console.log(`players: ${playersInQueue}`)
    if(playersInQueue.length>=2) {
        uuid1 = playersInQueue.shift()
        uuid2 = playersInQueue.shift()
        createAGame(uuid1, uuid2)
    }
}

const notifyPlayers = (uuid1, cross, uuid2, circle, gameData) => {
    // Object.keys(gameboards).forEach(gameData => {
        const connection1 = connections[uuid1]
        const connection2 = connections[uuid2]
        // const gameState = JSON.stringify({gameData: gameData['state'], userData: user[uuid1]})

        connection1.send(JSON.stringify({kind: 'update', gameState: gameData['state'], userData: users[uuid1], opponentData: users[uuid2], mark: cross}))
        connection2.send(JSON.stringify({kind: 'update', gameState: gameData['state'], userData: users[uuid2], opponentData: users[uuid1], mark: circle}))
    // })
}

const createAGame = (uuid1, uuid2) => {
    const gameUuid = `${uuid1}${uuid2}`
    gameboards[gameUuid] = {
        X: uuid1,
        O: uuid2, 
        state: ['', '', '', '', '', '', '', '', '']}
    users[uuid1]['userState'] = 'playing'
    users[uuid1]['gameUuid'] = gameUuid
    users[uuid1]['isTheirRound'] = true

    users[uuid2]['userState'] = 'playing'
    users[uuid2]['gameUuid'] = gameUuid
    users[uuid2]['isTheirRound'] = false

    //TODO: send info to clients, that game has been created
    notifyPlayers(uuid1, 'X', uuid2, 'O', gameboards[gameUuid])
}

wsServer.on('connection', (connection, request) => {

    const {nick} = url.parse(request.url, true).query
    const uuid=uuidv4()
    console.log(nick)
    console.log(uuid)

    connections[uuid] = connection
    users[uuid] = {
        nick: nick,
        userState: 'waiting',
        gameUuid: '',
        isTheirRound: null,
        xOrC: null
    }

    playersInQueue.push(uuid)
    handleQueue(uuid)

    connection.on('message', message => handleMessage(message, uuid))
    connection.on('queue', uuid => handleQueue(uuid))
    connection.on('close', () => handleClose(uuid))
})

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`)
})