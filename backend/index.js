const http = require('http')
const {WebSocketServer} = require('ws')

const url = require('url')
const uuidv4 = require('uuid'.v4)

const server = http.createServer()

const wsServer = new WebSocketServer({server})
const port = 8000;

const connections = {}
const users = {}
const gameboards = {}
const playersInQueue = []

const handleMessage = (bytes, uuid) => {

}

const handleClose = (uuid) => {

}

const handleQueue = (uuid) => {
    playersInQueue.push(uuid)

    if(playersInQueue.length>=2) {
        uuid1 = playersInQueue.shift()
        uuid2 = playersInQueue.shift()
        createAGame(uuid1, uuid2)
    }
}

const createAGame = (uuid1, uuid2) => {
    gameboards[`${uuid1}${uuid2}`] = {
        cross: uuid1,
        circle: uuid2, 
        state: ['', '', '', '', '', '', '', '', '']}
}

wsServer.on('connection', (connection, request) => {

    const {username} = url.parse(request.url, true).query
    const uuid=uuidv4()
    console.log(username)
    console.log(uuid)

    connections[uuid] = connection
    users[uuid] = {
        username: username
    }

    connection.on('message', message => handleMessage(message, uuid))
    connection.on('queue', uuid => handleQueue(uuid))
    connection.on('close', () => handleClose(uuid))
})

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`)
})