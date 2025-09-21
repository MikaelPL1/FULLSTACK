require('dotenv').config()

const express = require('express')
const Person = require('./models/person')
const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)
app.use(express.json())
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>` +
        `<p>${date}</p>`
    )
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Hae yksi id:n perusteella
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
})

// Lisää uusi
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// Poista
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})