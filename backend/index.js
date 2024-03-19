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
    for(let i=0;i<gameBoardState;i++) {
        if(gameBoardState[i]==='') {
            return false
        }
    }
    return true
}

const endGame = (gameUuid, gameResult, winner=null) => {
    const user1 = users[gameUuid['cross']]
    const user2 = users[gameUuid['circle']]

    user1['userState'] = 'endedGame'
    user2['userState'] = 'endedGame'

    delete gameboards[gameUuid]
    console.log(`Game ${gameUuid} has ended. Winner is ${winner}`)

    //send information to clients, that game ended and who is the winner
}

const handleMessage = (bytes, uuid) => {

    const message = JSON.parse(bytes.toString())
    const user = users[uuid]

    console.log(message)

    switch(message['option']) {
        case 'move':
            const gameBoard = gameboards[user['gameUuid']]

            //TODO: send clicked index
            let crosOrCircle =null
            if(gameBoard[message['index']]==='') {
                if(gameBoard['cross']===uuid)
                gameBoard[message['index']]='X';
                crosOrCircle = 'X'
            } else {
                gameBoard[message['index']]='O';
                crosOrCircle = 'O'
            }

                if(checkWin(gameBoard['state'], crosOrCircle)) {
                    endGame(user['gameUuid'], 'win', uuid);
                } else {
                    if(checkDraw(gameBoard['state'])){
                        endGame(user['gameUuid'], 'draw');
                    }
                }
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

        let user2=null

        //end game
        if(closedGame['cross'] === uuid) {
            user2 = closedGame['circle']
        } else {
            user2 = closedGame['cross']
        }

        user2['userState'] = 'endedGame'
        user2['gameUuid'] = ''

        delete gameboards[user['gameUuid']]
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
    playersInQueue.push(uuid)

    if(playersInQueue.length>=2) {
        uuid1 = playersInQueue.shift()
        uuid2 = playersInQueue.shift()
        createAGame(uuid1, uuid2)
    }
}

const notifyPlayers = () => {
    Object.keys(gameboards).forEach(gameData => {
        const connection1 = connections[gameData['cross']]
        const connection2 = connections[gameData['circle']]
        const gameState = JSON.stringify(gameData['state'])

        connection1.send(gameState)
        connection2.send(gameState)
    })
}

const createAGame = (uuid1, uuid2) => {
    const gameUuid = `${uuid1}${uuid2}`
    gameboards[gameUuid] = {
        cross: uuid1,
        circle: uuid2, 
        state: ['', '', '', '', '', '', '', '', '']}
    users[uuid1]['userState'] = 'playing'
    users[uuid1]['gameUuid'] = gameUuid
    users[uuid1]['isTheirRound'] = true

    users[uuid2]['userState'] = 'playing'
    users[uuid2]['gameUuid'] = gameUuid
    users[uuid2]['isTheirRound'] = false
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
        isTheirRound: null
    }

    connection.on('message', message => handleMessage(message, uuid))
    connection.on('queue', uuid => handleQueue(uuid))
    connection.on('close', () => handleClose(uuid))
})

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`)
})