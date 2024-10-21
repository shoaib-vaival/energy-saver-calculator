"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

type Appliance = {
  name: string
  currentWattage: number
  efficientWattage: number
  hoursPerDay: number
}

export default function EnergySavingCalculator() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { name: "Refrigerator", currentWattage: 150, efficientWattage: 100, hoursPerDay: 24 },
    { name: "Washing Machine", currentWattage: 500, efficientWattage: 400, hoursPerDay: 1 },
    { name: "Air Conditioner", currentWattage: 1500, efficientWattage: 1000, hoursPerDay: 8 },
  ])
  const [electricityRate, setElectricityRate] = useState(0.12)

  const calculateSavings = () => {
    let totalCurrentUsage = 0
    let totalEfficientUsage = 0

    appliances.forEach((appliance) => {
      const currentUsage = (appliance.currentWattage * appliance.hoursPerDay * 365) / 1000
      const efficientUsage = (appliance.efficientWattage * appliance.hoursPerDay * 365) / 1000
      totalCurrentUsage += currentUsage
      totalEfficientUsage += efficientUsage
    })

    const energySaved = totalCurrentUsage - totalEfficientUsage
    const costSaved = energySaved * electricityRate

    return { energySaved, costSaved }
  }

  const { energySaved, costSaved } = calculateSavings()

  const handleApplianceChange = (index: number, field: keyof Appliance, value: string | number) => {
    const updatedAppliances = [...appliances]
    if (field === 'name') {
      updatedAppliances[index][field] = value as string
    } else {
      updatedAppliances[index][field] = Number(value)
    }
    setAppliances(updatedAppliances)
  }


  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Energy Saving Calculator</CardTitle>
        <CardDescription>Calculate your potential energy and cost savings by using more efficient appliances.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4 font-semibold">
            <div>Appliance</div>
            <div>Current Wattage</div>
            <div>Efficient Wattage</div>
            <div>Hours/Day</div>
            <div></div>
          </div>
          {appliances.map((appliance, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <Input value={appliance.name} onChange={(e) => handleApplianceChange(index, "name", e.target.value)} />
              <Input
                type="number"
                value={appliance.currentWattage}
                onChange={(e) => handleApplianceChange(index, "currentWattage", Number(e.target.value))}
              />
              <Input
                type="number"
                value={appliance.efficientWattage}
                onChange={(e) => handleApplianceChange(index, "efficientWattage", Number(e.target.value))}
              />
              <Input
                type="number"
                value={appliance.hoursPerDay}
                onChange={(e) => handleApplianceChange(index, "hoursPerDay", Number(e.target.value))}
              />
              <Button
                variant="destructive"
                onClick={() => setAppliances(appliances.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            onClick={() =>
              setAppliances([...appliances, { name: "", currentWattage: 0, efficientWattage: 0, hoursPerDay: 0 }])
            }
          >
            Add Appliance
          </Button>
        </div>
        <div className="mt-4">
          <Label htmlFor="electricityRate">Electricity Rate ($ per kWh)</Label>
          <Input
            id="electricityRate"
            type="number"
            value={electricityRate}
            onChange={(e) => setElectricityRate(Number(e.target.value))}
            className="max-w-xs"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <h3 className="text-lg font-semibold mb-2">Estimated Annual Savings</h3>
        <p>Energy Saved: {energySaved.toFixed(2)} kWh</p>
        <p>Cost Saved: ${costSaved.toFixed(2)}</p>
      </CardFooter>
    </Card>
  )
}