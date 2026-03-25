import './Join.css'

type JoinProps = {
  onJoinCode: () => void
  onBack: () => void
}

function Join({ onJoinCode, onBack }: JoinProps) {
  return (
    <div className="join">
      <h1>Join With Code</h1>
      <div className="join-buttons">
        <textarea> hello </textarea>
        <button onClick={onJoinCode}>join room</button>
        <button onClick={onBack}>back to menu</button>
      </div>
    </div>
  )
}

export default Join