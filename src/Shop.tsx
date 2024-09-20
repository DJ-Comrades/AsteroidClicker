import { useEffect, useState } from "react"

interface Upgrade {
    id: number
    text: string,
    cost: number,
    effect: () => void
}

function Shop({ currentMoney, spendMoney }: {currentMoney: number, spendMoney: (value: number) => void;}) {

    const [upgrades, setUpgrades] = useState<Upgrade[]>([])

    useEffect(() => {
        setUpgrades([{ id: 0, text: "Upgrade 1", cost: 2, effect: () => null }])
    }, [])

    function tryPurchase(upgrade: Upgrade): void {
        if (currentMoney >= upgrade.cost){
            spendMoney(upgrade.cost)
        }
    }

    return <div>
        <p>Money: {currentMoney}$</p>
        <ul>{
            upgrades.map(item => (
                    <button key={item.id} onClick={() => tryPurchase(item)} className="bg-gray-800 p-2 rounded-lg shadow-md hover:bg-green-500 transition-colors">
                        {item.text}     {item.cost}$
                    </button>
            ))}</ul>
    </div>
}
export default Shop