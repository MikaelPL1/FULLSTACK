const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
    { id: "1", name: 'Arto Hellas', number: '040-123456' },
    { id: "2", name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: "3", name: 'Dan Abramov', number: '12-43-234345' },
    { id: "4", name: 'Mary Poppendieck', number: '39-23-6423122' },
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>` +
        `<p>${date}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const id = String(req.params.id)
    const person = persons.find((p) => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter((p) => p.id !== id)
    res.status(204).end()
})

const luoId = () => Math.floor(Math.random() * 100000)

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    if (persons.some((p) => p.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    const person = {
        id: luoId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    res.json(person)
    console.log(person.name, person.number)
})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const body = req.body

    const existing = persons.find((p) => p.id === id)
    if (!existing) {
        return res.status(404).end()
    }

    persons = persons.map(p =>
        p.id === id ? { ...p, name: body.name, number: body.number } : p
    )

    res.json(persons.find(p => p.id === id))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})