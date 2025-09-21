import { useState, useEffect } from 'react'
import personService from './services/person'
import PersonForm from './components/PersonForm'
import Persons from './components/Person'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])   // Henkilöiden tila
  const [newName, setNewName] = useState('')    // Uuden nimen tila
  const [newNumber, setNewNumber] = useState('') // Uuden numeron tila
  const [message, setMessage] = useState()
  const [messageType, setMessageType] = useState(null)

  // Haetaan henkilöt palvelimelta
  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])  // Tämä effect ajetaan vain kerran komponentin renderöinnin jälkeen

  // Lisää uusi henkilö
  const addPerson = (event) => {
    event.preventDefault()

    const duplicate = persons.find(person => person.name === newName)
    if (duplicate) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessage(`Added ${returnedPerson.name} to the phonebook`)
        setMessageType("success")
        setTimeout(() => setMessage(null), 5000)
      })
      .catch(error => {
        // Show the raw Mongoose validation message exactly
        setMessage(error.response.data.error)
        setMessageType("error")
        setTimeout(() => setMessage(null), 5000)
        console.error('Error adding person:', error.response.data.error)
      })
  }


  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage(`Deleted person with name ${name}`)
          setMessageType("error")
          setTimeout(() => setMessage(null), 5000)
        })
        .catch(error => {
          setMessage(`Information of ${name} has already been removed from server`)
          setMessageType("error")
          setTimeout(() => setMessage(null), 5000)
          setPersons(persons.filter(person => person.id !== id))
          console.error('Error deleting person:', error)
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} className={messageType} />
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} onDelete={deletePerson} />

    </div>
  )
}

export default App
