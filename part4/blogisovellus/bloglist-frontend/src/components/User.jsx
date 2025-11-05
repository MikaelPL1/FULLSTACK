import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import usersService from '../services/users'

const User = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    let mounted = true
    usersService
      .getById(id)
      .then((u) => {
        if (mounted) setUser(u)
      })
      .catch(() => {
        if (mounted) setUser(null)
      })
    return () => {
      mounted = false
    }
  }, [id])

  if (!user) {
    return <div>user not found</div>
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>{user.name || user.username}</h2>

      <h3>added blogs</h3>
      <ul>
        {user.blogs && user.blogs.length > 0 ? (
          user.blogs.map((b) => (
            <li key={b.id || b._id}>
              {b.title}
            </li>
          ))
        ) : (
          <li>No blogs</li>
        )}
      </ul>
    </div>
  )
}

export default User