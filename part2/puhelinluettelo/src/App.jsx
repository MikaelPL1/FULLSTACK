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

    // Tarkistetaan, onko henkilö jo olemassa
    const duplicate = persons.find(person => person.name === newName)
    if (duplicate) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      // id: persons.length + 1,
      name: newName,
      number: newNumber,
    }

    // Luodaan henkilö palvelimelle
    personService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))  // Lisää uusi henkilö tilaan
      setNewName('')  // Tyhjennetään syöttökenttä
      setNewNumber('')  // Tyhjennetään syöttökenttä
      setMessage(`Added ${returnedPerson.name} to the phonebook`)
      setMessageType("success")
      console.log(messageType)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      console.log(`Added ${returnedPerson.name}`)
    })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      // Poistetaan henkilö palvelimelta
      fetch(`http://localhost:3001/persons/${id}`, { method: 'DELETE' })
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))  // Päivitetään tila poistamalla henkilö
        })

        .catch(error => {
          console.error('Error deleting person:', error)
        })
      setMessage(`Deleted person with name ${name}`)
      setMessageType("error")
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      console.log(`Deleted person with name ${name}`)
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
