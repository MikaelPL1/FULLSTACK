const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'ADD_BLOG':
    return [...state, action.data]
  default:
    return state
  }
}

export const initializeBlogs = (blogs) => {
  return {
    type: 'INIT_BLOGS',
    data: blogs,
  }
}

export const addBlogAction = (blog) => {
  return {
    type: 'ADD_BLOG',
    data: blog,
  }
}

export default blogReducer