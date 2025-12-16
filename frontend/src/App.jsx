import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <h1 className='font-bold text-gray-400'>FormSense AI</h1>
      <p className='font-light text-3xl'>Real-time computer vision fitness coach for posture correction.</p>
      
    </>
  )
}

export default App
