// action types
export const UPDATE_THEME = 'UPDATE_USER'
export const USER = 'UPDATE_CONTACT'
export const DATA_DOWNLOAD = 'DATA_DOWNLOAD' 
export const PRODUCTS_LIST = 'PRODUCTS_LIST'
export const LOG_OUT = "LOG_OUT"
export const ANALYTICS = "ANALYTICS"
// action creators
export const themeFunction = (theme) => ({
  type: UPDATE_THEME,
  payload: theme
})

export const userAction = user => ({
  type: USER,
  payload: user,
})

export const dataAction = data=>({
  type: DATA_DOWNLOAD,
  payload: data
})
export const productsAction = products =>({
  type: PRODUCTS_LIST,
  payload: products
})
export const logoutAction = action =>({
  type: LOG_OUT,
  payload: action
})
export const analyticsAction = data=>({
  type:ANALYTICS,
  payload: data
})