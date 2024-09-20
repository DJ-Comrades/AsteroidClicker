import { useState } from 'react'
import './App.css'
import Space from './Space'
import "./index.css"
import Shop from './Shop'

function App() {
  const [money, setMoney] = useState<number>(0)


  function handleSpaceThing(value: number) {
    setMoney((money) => money + value)
  }

  function handleShop(value: number){
    setMoney((money) => money - value)
  }

  const space =
    <div>
      <h1 className='text-3xl'>Click asteroids</h1>
      <br></br>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Space earnMoney={handleSpaceThing} />
        </div>
        <div>
          <h2 className='underline text-2xl'>
            Shop
          </h2>
          <Shop currentMoney={money} spendMoney={handleShop}/>
        </div>
      </div>
    </div>
  return space;
}

export default App
