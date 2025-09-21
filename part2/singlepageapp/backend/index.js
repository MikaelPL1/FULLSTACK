require('dotenv').config()
const express = require('express')
const Note = require('./models/note')


const app = express()

// Middleware
app.use(express.json())
app.use(express.static('dist'))

// Routes
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
})

app.post('/api/notes', (request, response) => {
    const { content, important } = request.body

    if (!content) {
        return response.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        content,
        important: important || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    })
})

// Unknown endpoint middleware (after all routes)
const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
