import { voteAnecdote } from "../reducers/anecdoteReducer"
import { useDispatch, useSelector } from 'react-redux'
import { perusNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const filter = state.filter
    return state.anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })
  const dispatch = useDispatch()

  const vote = (anecdote) => {
  dispatch(voteAnecdote(anecdote))
  dispatch(perusNotification(`you voted '${anecdote.content}'`, 10))
}

  return (
    <div>
      {anecdotes.map(anecdote =>
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