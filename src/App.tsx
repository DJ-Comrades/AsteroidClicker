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

  const app =
  <div className="min-h-screen bg-gray-800 text-white p-6">
    <h1 className='text-4xl font-bold mb-6 text-center'>Click Asteroids</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Space section */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
        <Space earnMoney={handleSpaceThing} />
      </div>
      
      {/* Shop section */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
        <h2 className='underline text-3xl mb-4'>Shop</h2>
        <Shop currentMoney={money} spendMoney={handleShop} />
      </div>
    </div>
  </div>
  return app;
}

export default App
