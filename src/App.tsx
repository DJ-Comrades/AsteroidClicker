import { useState } from 'react'
import './App.css'
import Space from './Space'
import "./index.css"

function App() {
  const [money, setMoney] = useState<number>(0)

  function handleSpaceThing(value: number){
    setMoney((money) => money + value)
  }
  const space = 
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Space earnMoney={handleSpaceThing}/>
      </div>
      <div>
        <h2 className='underline'>
          Money:  {money}
        </h2>
      </div>
    </div>
  return space;
}

export default App
