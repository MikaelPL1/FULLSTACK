import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../library'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, { loading }] = useMutation(LOGIN, {
    onError: (error) => {
      console.log('login error', error.graphQLErrors[0]?.message)
      alert('wrong credentials')
    },
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      setPage('books')
    }
  })

  if (!show) return null

  const submit = async (event) => {
    event.preventDefault()

    await login({
      variables: { username, password }
    })

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
