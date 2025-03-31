import { useState } from 'react'
import Hero from './Components/Hero'
import './App.css'
import Nav from './Components/Nav'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Nav></Nav>
     <Hero></Hero>
    </>
  )
}

export default App
