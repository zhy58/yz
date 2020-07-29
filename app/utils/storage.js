import { AsyncStorage } from 'react-native'

function clear(){
  return AsyncStorage.clear()
}

function get(key, defaultValue = null){
  return AsyncStorage.getItem(key).then(value => (value != null ? JSON.parse(value) : defaultValue))
}

function set(key, value){
  return AsyncStorage.setItem(key, JSON.stringify(value))
}

function remove(key){
  return AsyncStorage.removeItem(key)
}

function multiGet(...key){
  return AsyncStorage.multiGet([...key]).then(stores => {
    const data = {}
    stores.forEach((result, i, store) => {
      data[store[i][0]] = JSON.parse(store[i][1])
    })
    return data
  })
}

function multiSet(...key){
  return AsyncStorage.multiSet([...key])
}

function multiRemove(arrayKey){
  return AsyncStorage.multiRemove(arrayKey)
}

export default {
  clear,
  get,
  set,
  remove,
  multiGet,
  multiSet,
  multiRemove
}