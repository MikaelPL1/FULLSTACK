import { useState } from 'react'

const App = () => {
  const [count, setCount] = useState(0)

  const handlePlus = () => {
    setCount(count + 1)
  }

  const handleMinus = () => {
    setCount(count - 1)
  }

  const handleZero = () => {
    setCount(0)
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handlePlus}>plus</button>
      <button onClick={handleMinus}>minus</button>
      <button onClick={handleZero}>zero</button>
    </div>
  )
}

export default App