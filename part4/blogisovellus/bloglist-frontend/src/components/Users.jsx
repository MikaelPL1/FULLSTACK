import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import usersService from '../services/users'

const tableStyles = {
  borderCollapse: 'collapse',
  marginTop: 8,
}

const thNameStyle = { textAlign: 'left', paddingRight: 24 }
const thCountStyle = { textAlign: 'left' }
const tdNameStyle = { paddingRight: 24, verticalAlign: 'top' }

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    let mounted = true
    usersService
      .getAll()
      .then((u) => {
        if (mounted) setUsers(u)
      })
      .catch(() => {
        if (mounted) setUsers([])
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Users</h2>

      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thNameStyle}>user</th>
            <th style={thCountStyle}>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={tdNameStyle}>
                <Link to={`/users/${u.id}`}>{u.name || u.username}</Link>
              </td>
              <td>{u.blogs ? u.blogs.length : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users