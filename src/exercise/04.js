// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'

function useLocalStorageState(key, defaultValue, { serialize = JSON.stringify, deserialize = JSON.parse } = {}) {
  /**
   * Use lazy initialization so that interaction to local storage is
   * is only performed on initial render and not re renders
   */
  const [value, setStorageValue] = React.useState(() => {
    const value = deserialize(window.localStorage.getItem(key))
    
    if(value) return value
    
    return typeof defaultValue === "function" ? defaultValue() : defaultValue
  })

  /**
   * Use useRef to store the key value within the hook, if the key and 
   * the ref value do not match, remove the local storage item and update the ref
   * 
   * Using this approach means that when the ref is updated there is no re render triggered
   */
  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(key)
    }

    prevKeyRef.current = key

    window.localStorage.setItem(key, serialize(value))
  }, [key, serialize, value])

  return [value, setStorageValue]
}

function HistoryPanel ({ squaresArray = [], onHistoryChange, historyIndex }) {
  const buttonText = (index) => index > 0 ? `History item ${index + 1}` : "Reset history"

  return (
    <ul>
      {squaresArray.map((_, index) => {
        return (
          <li key={index}>
            <button disabled={index === historyIndex} onClick={() => onHistoryChange(index)}>{buttonText(index)}</button>
          </li>
        )
      })}
    </ul>
  )
}


function Board({ squares, onClick }) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [squaresArray, setSquares] = useLocalStorageState("squares", [...Array(9).fill(null)], {})
  const [historyIndex, setHistoryIndex] = useLocalStorageState("historyIndex", 0, {})

  const squares = squaresArray[historyIndex]
  
  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function restart() {
    setSquares([Array(9).fill(null)])
    setHistoryIndex(0)
  }

  function onHistoryChange (i) {
    setHistoryIndex(i)
  }
  
  function selectSquare(square) {
    if (winner || !!squares[square]) return

    const newSquares = [...squaresArray, squares.map((value, index) => index === square ? nextValue : value)]

    setSquares(newSquares)
    setHistoryIndex(newSquares.length - 1)
  }
  
  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <HistoryPanel squaresArray={squaresArray} onHistoryChange={onHistoryChange} historyIndex={historyIndex} />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const allMatch = lines[i].every((item, i) => item[i] === item[0])

    if (allMatch) {
      return squares[0]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
