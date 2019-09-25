import CreateDataContext from './CreateDataContext'
import api from '../api/api'
const blogReducer = (state, action) => {
  switch (action.type) {
    case 'get_blog_post':
      return action.payload
      break
    case 'edit_blog_post':
      return state.map(blogPost => {
        return blogPost.id === action.payload.id ? action.payload : blogPost
      })
      break
    case 'add_blogpost':
      return [
        ...state,
        {
          id: Math.floor(Math.random() * 999),
          title: action.payload.title,
          content: action.payload.content
        }
      ]
      break
    case 'delete_blog_post':
      return state.filter(blogPost => blogPost.id !== action.payload)
      break
    default:
      return state
      break
  }
}

const getBlogPost = dispatch => {
  return async () => {
    const response = await api.get('/posts')
    dispatch({ type: 'get_blog_post', payload: response.data })
  }
}

const addBlogPost = dispatch => {
  return async (title, content, callback) => {
    await api.post('/posts', {title: title, content: content})
    /* dispatch({
      type: 'add_blogpost',
      payload: { title: title, content: content }
    })*/
    if (callback) {
      callback()
    }
  }
}

const deleteBlogPost = dispatch => {
  return async id => {
    await api.delete(`/posts/${id}`)
    dispatch({ type: 'delete_blog_post', payload: id })
  }
}

const editBlogPost = dispatch => {
  return async (id, title, content, callback) => {
    await api.put(`/posts/${id}`, {title, content})
    dispatch({
      type: 'edit_blog_post',
      payload: { id, title, content }
    })
    if (callback) {
      callback()
    }
  }
}

export const { Context, Provider } = CreateDataContext(
  blogReducer,
  { getBlogPost, addBlogPost, deleteBlogPost, editBlogPost },
  [{ title: 'Prueba 1', content: 'Prueba contenido', id: 1 }]
)
