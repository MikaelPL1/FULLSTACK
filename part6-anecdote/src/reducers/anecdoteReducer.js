import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],  // Tyhjä aluksi, data haetaan serveriltä
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdote = state.find(a => a.id === id)
      if (anecdote) {
        anecdote.votes += 1
      }
    },
    createAnecdote(state, action) {
      state.push(action.payload)  // Koko objekti serveriltä
    },
    setAnecdotes(state, action) {
      return action.payload  // Aseta kaikki anekdootit kerralla
    }
  }
})

export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer