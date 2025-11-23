import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../library'

const Books = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState(null)

  if (!props.show) return null
  if (loading) return <div>loading...</div>
  if (error) return <div>error: {error.message}</div>

  const books = data.allBooks

  // lue enemmän flatmap,, ai
  const genres = Array.from(
    new Set(books.flatMap((b) => b.genres))
  )

  const booksToShow =
    genre === null
      ? books
      : books.filter((b) => b.genres.includes(genre))

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <div>
          in genre <strong>{genre}</strong>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>title</th><th>author</th><th>published</th>
          </tr>
        </thead>
        <tbody>
          {booksToShow.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '0.5rem' }}>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
