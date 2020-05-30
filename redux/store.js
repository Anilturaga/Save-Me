import {createStore, applyMiddleware} from 'redux'

import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import reducer from './reducer'
import { AsyncStorage } from 'react-native';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,

}
//Secondary color choices
//bayer color: #1ABC9C
//logo color: #FEB62E
//Dark mode
//tabtheme: #202020
//bgcolor: black
//textcolor: white
const persistedReducer = persistReducer(persistConfig, reducer)

export const store = createStore(persistedReducer, applyMiddleware(thunk))
export const persistor = persistStore(store)

/*
store.dispatch(updateUser({foo: 'foo'}))
store.dispatch(updateUser({bar: 'bar'}))
store.dispatch(updateUser({foo: 'baz'}))


store.dispatch(addContact({name: 'jordan h', phone: '1234567890'}))
store.dispatch(addContact({name: 'jordan h', phone: '1234567890'}))
store.dispatch(addContact({name: 'david m', phone: '5050505050'}))

console.log(store.getState())
*/
export default store;