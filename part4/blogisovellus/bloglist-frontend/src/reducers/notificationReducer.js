const initialState = { message: null, type: null }

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return { message: action.payload.message, type: action.payload.type || 'info' }
  case 'CLEAR_NOTIFICATION':
    return initialState
  default:
    return state
  }
}

export const setNotification = (message, type = 'info') => ({
  type: 'SET_NOTIFICATION',
  payload: { message, type },
})

export const clearNotification = () => ({ type: 'CLEAR_NOTIFICATION' })

export default notificationReducer