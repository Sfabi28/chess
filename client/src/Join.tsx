import { useState } from 'react'
import './Join.css'

type JoinProps = {
  onJoinCode: (code: string) => void
  onBack: () => void
}

function Join({ onJoinCode, onBack }: JoinProps) {
  const [code, setCode] = useState('')

  return (
    <div className="join">
      <h1>Join With Code</h1>
      <div className="join-buttons">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={() => onJoinCode(code)}>join room</button>
        <button onClick={onBack}>back to menu</button>
      </div>
    </div>
  )
}

export default Join