import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../library'

const Authors = (props) => {
  // 🔹 hookit aina ekaksi
  const { loading, error, data } = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [born, setBorn] = useState('')

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>error: {error.message}</div>
  }

  const authors = data.allAuthors

  const options = authors.map((a) => ({
    value: a.name,
    label: a.name,
  }))

  const submit = async (event) => {
    event.preventDefault()
    if (!selectedAuthor) return

    await editAuthor({
      variables: {
        name: selectedAuthor.value,
        setBornTo: Number(born),
      },
    })

    // tyhjennetään lomake
    setBorn('')
    setSelectedAuthor(null)
  }

  return (
    <div>
      <h2>authors</h2>

      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>set birthyear</h3>

      <form onSubmit={submit}>
        <div style={{ maxWidth: 300, marginBottom: '0.5rem' }}>
          <Select
            value={selectedAuthor}
            onChange={setSelectedAuthor}
            options={options}
            placeholder="select author..."
          />
        </div>

        <div>
          born{' '}
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: '0.5rem' }}>
          update author
        </button>
      </form>
    </div>
  )
}

export default Authors
