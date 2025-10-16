/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import NotificationContext from "../NotificationContext"

const AnecdoteList = ({ anecdotes, voteMutation }) => {
  const filter = useSelector(state => state.filter)
  const { notificationDispatch } = useContext(NotificationContext)
  

  // ÄÄNESTYS, mutate
  const vote = (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    voteMutation.mutate({ id: anecdote.id, updatedAnecdote })
    
    notificationDispatch({ type: 'SET', payload: `you voted '${anecdote.content}'` })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList