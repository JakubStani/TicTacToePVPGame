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

const handleMessage = (bytes, uuid) => {

    const message = JSON.parse(bytes.toString())
    const user = users[uuid]

    console.log(message)

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