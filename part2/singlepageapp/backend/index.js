require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Note = require('./models/note')

const app = express()

// Connect to MongoDB
const url = process.env.MONGODB_URI
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message)
    })

// Middleware
app.use(express.json())
app.use(express.static('dist'))

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get('/api/notes/:id', (req, res) => {
    Note.findById(req.params.id).then(note => {
        res.json(note)
    })
})

app.post('/api/notes', (req, res) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        res.json(savedNote)
    })
})

app.delete('/api/notes/:id', (req, res) => {
    Note.findByIdAndDelete(req.params.id).then(() => {
        res.status(204).end()
    })
})

// Unknown endpoint
app.use((req, res) => {
    res.status(404).json({ error: 'unknown endpoint' })
})

// Server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
