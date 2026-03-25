import './Menu.css'

type MenuProps = {
  onCreateRoom: () => void
  onJoinRoom: () => void
}

function Menu({ onCreateRoom, onJoinRoom }: MenuProps) {

  return (
    <div className="menu">
      <h1>Chess online</h1>
      <div className="menu-buttons">
        <button onClick={onCreateRoom}>create room</button>
        <button onClick={onJoinRoom}>join with code</button>
      </div>
    </div>
  )
}

export default Menu