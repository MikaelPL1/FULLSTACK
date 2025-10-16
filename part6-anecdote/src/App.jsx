import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import anecdoteService from './services/anecdoteService'

const App = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: false
  })

  const voteMutation = useMutation({
    mutationFn: ({ id, updatedAnecdote }) => anecdoteService.update(id, updatedAnecdote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const createMutation = useMutation({
    mutationFn: anecdoteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteForm createMutation={createMutation} />
      <AnecdoteList anecdotes={result.data} voteMutation={voteMutation} />
    </div>
  )
}

export default App