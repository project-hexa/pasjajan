"use client"

import { Button } from "@workspace/ui/components/button"
import { useState } from "react"

export default function HomePage() {
  const [count, setCount] = useState<number>(0)
  
  const handleClick = () => setCount(count + 1)
  
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm" onClick={handleClick}>Count: {count}</Button>
      </div>
    </div>
  )
}
