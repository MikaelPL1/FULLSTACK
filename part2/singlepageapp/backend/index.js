const express = require('express')
const cors = require('cors')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Data
let notes = [
    { id: "1", content: "HTML is easy", important: true },
    { id: "2", content: "Browser can execute only JavaScript", important: false },
    { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true }
]

// Routes
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.post('/api/notes', (request, response) => {
    const { content, important } = request.body

    if (!content) {
        return response.status(400).json({ error: 'content missing' })
    }

    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
    const newNote = {
        content,
        important: important || false,
        id: String(maxId + 1)
    }

    notes = notes.concat(newNote)
    response.json(newNote)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

// Unknown endpoint middleware (after all routes)
const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
