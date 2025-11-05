import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {


  return (
    <div style={{ padding: 6 }}>
      <div>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title}
        </Link>
      </div>
    </div>
  )
}

export default Blog
