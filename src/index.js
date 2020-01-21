import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './index.css'

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} >
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(row, col) {
    let i = row * 3 + col;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(row, col)}
      />
    );
  }

  renderCol(row) {
    return [0,1,2].map(col => {
      return <span key={col}>{this.renderSquare(row, col)}</span>
    });
  }

  renderRow() {
    return [0,1,2].map(row => {
      return (
        <div className="board-row" key={row}>
          { this.renderCol(row)}
        </div>
      )
    });
  }

  render() {
    return (
      <div>
        { this.renderRow() }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        { squares: Array(9).fill(null), row: null, col: null }
      ],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(row, col) {
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    let current = history[history.length - 1];
    let squares = current.squares.slice();
    let i = row * 3 + col;
    if(calculateWinner(squares) || squares[i])return;
    let xIsNext = this.state.xIsNext;
    squares[i] = xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{squares, row, col}]),
      stepNumber: history.length,
      xIsNext: !xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const status = winner ? `Winner: ${winner}` : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    const moves = history.map((item, step) => {
      const desc = step ?
        `Go to move #${step} ${item.row + 1} - ${item.col + 1}`:
        'Go to game start';
      return (
        <li key={step}>
          <button onClick={() => this.jumpTo(step)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(row, col) => this.handleClick(row, col)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

