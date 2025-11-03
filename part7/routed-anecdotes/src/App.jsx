import { useState } from 'react'
import { useField } from './hooks'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams, useNavigate
} from 'react-router-dom'

const Menu = () => {
  const padding = { paddingRight: 5 }
  return (
    <nav>
      <Link to="/" style={padding}>anecdotes</Link>
      <Link to="/create" style={padding}>create new</Link>
      <Link to="/about" style={padding}>about</Link>
    </nav>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(a =>
        <li key={a.id}>
          <Link to={`/anecdotes/${a.id}`}>{a.content}</Link>
        </li>)}
    </ul>
  </div>
)

const Anecdote = ({ anecdotes }) => {
  const params = useParams()
  const id = Number(params.id)
  const anecdote = anecdotes.find(a => a.id === id)
  if (!anecdote) return <div>anecdote not found</div>
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>Software engineering anecdotes.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
  </div>
)

const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const newAnecdote = {
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
      id: Math.round(Math.random() * 10000)
    }
    props.addNew(newAnecdote)
    props.setNotification(`a new anecdote '${content.value}' created`)
    setTimeout(() => props.setNotification(null), 5000)

    navigate('/')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>content <input type={content.type} value={content.value} onChange={content.onChange} /></div>
        <div>author <input type={author.type} value={author.value} onChange={author.onChange} /></div>
        <div>info <input type={info.type} value={info.value} onChange={info.onChange} /></div>
        <button>create</button>
      </form>
      <button onClick={() => {
        content.reset()
        author.reset()
        info.reset()
      }}>reset</button>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    { content: 'If it hurts, do it more often', author: 'Jez Humble', info: 'https://martinfowler.com', votes: 0, id: 1 },
    { content: 'Premature optimization is the root of all evil', author: 'Donald Knuth', info: 'http://wiki.c2.com', votes: 0, id: 2 }
  ])
  const [notification, setNotification] = useState(null)

  const addNew = (anecdote) => {
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const style = { border: 'solid', padding: 10, borderWidth: 1, margin: '10px 0' }

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />

        {notification && <div style={style}>{notification}</div>}

        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} setNotification={setNotification} />} />
          <Route path="/about" element={<About />} />
          <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  )
}

export default App