/* eslint-disable react/prop-types */
import { useContext } from 'react'
import NotificationContext from "../NotificationContext"

const AnecdoteForm = ({ createMutation }) => {
  const { notificationDispatch } = useContext(NotificationContext)

  const create = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    createMutation.mutate(content)
    
    notificationDispatch({ type: 'SET', payload: `you created '${content}'` })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm