// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

function useLocalStorageState(key, defaultValue, { serialize = JSON.stringify, deserialize = JSON.parse } = {}) {
  const [value, setStorageValue] = React.useState(() => {
    const value = deserialize(window.localStorage.getItem(key))
    
    if(value) return value
    
    return typeof defaultValue === "function" ? defaultValue() : defaultValue
  })
  
  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(key)
    }

    prevKeyRef.current = key

    window.localStorage.setItem(key, serialize(value))
  }, [key, serialize, value])

  return [value, setStorageValue]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  const [name, setName] = useLocalStorageState('name', initialName, {})

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
