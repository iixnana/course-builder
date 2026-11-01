import { useState } from 'react'

export const useBubbleBurst = () => {
  const [burst, setBurst] = useState(0)
  return { burst, triggerBurst: () => setBurst((count) => count + 1) }
}
