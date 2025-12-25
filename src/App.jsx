import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import clickX from './assets/soundEffects/click1.mp3'
import clickO from './assets/soundEffects/click2.mp3'
import gameStart from './assets/soundEffects/gameStart.mp3'
import gameOverSoundEffect from './assets/soundEffects/gameOver.mp3'

function App() {
  const [board, setBoard] = useState(Array(9).fill(""))
  const [turn, setTurn] = useState("X")
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState("")

  const clickXRef = useRef(null)
  const clickORef = useRef(null)
  const gameStartRef = useRef(null)
  const gameOverRef = useRef(null)


  function playClickSound(player) {
    const audio = player === "X" ? clickXRef.current : clickORef.current
    if (audio) {
      audio.currentTime = 0
      audio.play()
    }
  }

  function gameStartSound() {
    const audio = gameStartRef.current
    audio.currentTime = 0
    audio.play()
  }

  function gameOverSound() {
    const audio = gameOverRef.current
    audio.currentTime = 0
    audio.play()
  }

  function checkWin(board) {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    return wins.some(([a, b, c]) => {
      return (
        board[a] !== "" &&
        board[a] === board[b] &&
        board[a] === board[c]
      )
    })
  }

  function resetGame() {
    gameStartSound()
    setBoard(Array(9).fill(""))
    setTurn("X")
    setMessage("")
    setGameOver(false)
  }

  function handlClick(index) {
    if (gameOver || board[index] !== "") return
    const newBoard = [...board]
    newBoard[index] = turn

    const isWin = checkWin(newBoard)

    if (isWin) {
      gameOverSound()
      setBoard(newBoard)
      setGameOver(true)
      setMessage(`${turn} is winner`)
      return
    }
    if (!newBoard.includes("")) {
      setBoard(newBoard)
      setGameOver(true)
      setMessage("Match draw")
      return
    }
    setBoard(newBoard)

    setTurn(turn === "X" ? "O" : "X")

  }

  return (
    <>
      <audio ref={clickXRef} src={clickX} />
      <audio ref={clickORef} src={clickO} />
      <audio ref={gameStartRef} src={gameStart} />
      <audio ref={gameOverRef} src={gameOverSoundEffect}/>
      <div className='min-h-screen bg-gray-500 flex flex-col items-center justify-center gap-4'>
        <div className='bg-white p-6 rounded-xl shadow-lg'>
          <h2 className="text-2xl font-bold text-center mb-4">
            Tic Tac Toe
          </h2>

          <p className="text-center mb-4 text-lg">
            {gameOver ? message : `Turn: ${turn}`}
          </p>
          <button onClick={resetGame} className='w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition'>Restart Game</button>
        </div>
        <div className='grid grid-cols-3 gap-3'>
          {
            board.map((value, index) => (<div
              key={index}
              onClick={() => {
                if (!gameOver && value === "") {
                  playClickSound(turn)
                  handlClick(index)
                }
              }}
              className={`
                    w-[120px] h-[120px]
                    flex items-center justify-center
                    text-5xl font-bold
                    rounded-lg
                    transition-all duration-200
                    ${value === "X" ? "text-red-500" : value === "O" ? "text-blue-500" : ""}
                    ${gameOver || value !== ""
                  ? "bg-gray-200"
                  : "bg-amber-50 hover:bg-amber-100 hover:scale-105 cursor-pointer"
                }
`}
            >
              {value}
            </div>))
          }
        </div>
      </div>

    </>
  )
}

export default App
