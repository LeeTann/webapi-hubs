const express = require('express')

const db = require('./data/db.js')

const server = express()
const PORT = '9090'

db.hubs.find()
.then((stuff) => {
    console.log(stuff)
})

//parse body and adds it to req object. a middleware
//express.json() is a function that returns a middleware
server.use(express.json())

server.get('/', (req, res) => {
    res.send('Hello world')
})

server.get('/now', (req, res) => {
    const now = new Date().toString()
    console.log(now)
    res.send(now)
})

server.get('/api/hubs', (req, res) => {
    db.hubs.find()
    .then(hubs => {
        res.json(hubs)
    }).catch((err) => {
        res.status(500).json({err: 'failed to retreive message'})
    })
})

server.post('/api/hubs', (req, res) => {
    // get data off req.body
    const newHub = req.body

    // insert in db
    db.hubs.add(newHub)
    .then(dbHub => {
        res.status(201).json(dbHub)
    }).catch(({code, message}) => {
        res.status(code).json({err: message})
    })
})

server.delete('/api/hubs/:id', (req, res) => {
    const { id } = req.params
    
    db.hubs.remove(id)
    .then(hub => {
        if (hub) {
            res.json(hub)
        } else {
            res.status(400).json({err: 'invalid id'})
        }
    }).catch(({code, message}) => {
        res.status(code).json({err: message})
    })
})

server.put('/api/hubs/:id', (req, res) => {
    const { id } = req.params
    const updatedHub = req.body

    db.hubs.update(id, updatedHub)
    .then(dbHub => {
        if (dbHub) {
            res.json(dbHub)
        } else {
            res.status(400).json({err: 'invalid id'})
        }
    }).catch(({code, message}) => {
        res.status(code).json({err: message})
    })
})

server.get('/api/hubs/:id', (req, res) => {
    const id = req.params.id
    db.hubs.findById(id)
    .then(hub => {
        if (hub) {
            res.json(hub)
        } else {
            res.status(400).json({err: 'invalid id'})
        }
    }).catch(({code, message}) => {
        res.status(code).json({err: message})
    })
})

server.listen(PORT, () => {
    console.log(`Our server is listening to port ${PORT}`)
})