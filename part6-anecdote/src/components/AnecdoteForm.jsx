import { createAnecdote } from "../reducers/anecdoteReducer"
import { useDispatch } from 'react-redux'
import { perusNotification } from "../reducers/notificationReducer"
import anecdoteService from "../services/anecdoteService"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const create = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    try {
      const newAnecdote = await anecdoteService.createNew(content)
      dispatch(createAnecdote(newAnecdote))
      dispatch(perusNotification(`you created '${content}'`))
    } catch (error) {
      dispatch(perusNotification('Error creating anecdote'))
    }
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