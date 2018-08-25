import React, { Component } from 'react';
import { Howl } from 'howler';
import Board from './Board';
import Timer from './Timer';
import { fitSquares } from '../utils/geometry'

import '../styles/App.css';

import soundsM4A from '../audio/gameSounds2.m4a'
import soundsMP3 from '../audio/gameSounds2.mp3'
import soundsAC3 from '../audio/gameSounds2.ac3'

const winMessages = [
  "YOU WON !",
  "YO DA BEST !",
  "WOOW..!",
  "IMPRESSIVE",
  "HEADSHOT!",
  "OMG"
]

const failMessages = [
  "TIME'S UP",
  "FAILED",
  "TRY AGAIN",
  "SORRY",
  "BUMMER"
]

const sound = new Howl({
  src: [soundsM4A, soundsMP3, soundsAC3],
  sprite: {
    flip: [0, 253],
    flap: [2000, 225],
    match: [4000, 884],
    win: [6000, 3297],
    tick: [11000, 120],
    fail: [13000, 2368]
  }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gameId: 0,
      level: 1,
      score: 0,
      loading: true,
      winner: false,
      looser: false,
      isPlaying: false
    }
    sound.once('load', this.onSoundsLoaded);
  }

  onSoundsLoaded = () => {
    this.setState({loading:false})
  }

  adjustScore = (val) => {
    let score = Math.max(0, this.state.score + val)
    this.setState({ score })
  }

  onContinue = () => {
    let {score, winner, looser, level, gameId} = this.state
    let nextLevel = winner ? level + 1 : 1
    let levelTime = Math.floor(8 * Math.pow(1.3, level));
    this.setState({
      winner: false,
      looser: false,
      isPlaying: true,
      level: nextLevel,
      levelTime: levelTime,
      startTime: Date.now(),
      score: looser ? 0 : score,
      gameId: gameId + 1
    })
  }

  completeLevel = () => {
    let { levelTime, startTime } = this.state
    let timeLeft = levelTime - (Date.now() - startTime) / 1000,
        newScore = Math.floor(8 * Math.pow(1.2, timeLeft));

    this.setState({
      winner:true,
      isPlaying: false,
    })
    setTimeout(() => this.adjustScore(newScore), 0);
  }

  endGame = () => {
    this.setState({looser: true, isPlaying: false});
    sound.play('fail')
  }

  render() {
    if(this.state.loading){
      return this.renderLoading()
    } else {
      return this.renderGame()
    }
  }

  renderGame = () => {
    let { level, isPlaying, gameId, looser, levelTime } = this.state
    let levelSize = level+1;
    let cardSize = fitSquares(window.innerWidth, window.innerHeight - 100, levelSize*2);
    return (
      <div>
        <header>
          <p className="score">{this.state.score}</p>
          { isPlaying && <Timer key={level} level={level}
            onTimeout={this.endGame}
            timeOut={levelTime} sound={sound} />
          }
        </header>
        <div className="Game">
          <Board key={`board-${gameId}`}
            size={levelSize} sound={sound}
            onAdjustScore={this.adjustScore} 
            onCompleteLevel={this.completeLevel}
            cardSize={cardSize}
            looser={looser}
            isPlaying={this.state.isPlaying}
          />
        </div>
        { this.renderWin() }
        { this.renderFail() }
        { this.renderPlayButton() }
      </div>
    );
  }

  renderWin = () => {
    if (this.state.winner) {
      let m = winMessages[Math.floor(Math.random()*winMessages.length)]
      return (
        <div className="message win">{m}</div>
      )
    } else return null
  }
  
  renderFail = () => {
    if (this.state.looser) {
      let m = failMessages[Math.floor(Math.random()*failMessages.length)]
      return (
        <div className="message fail">{m}</div>
      )
    } else return null
  }
  
  renderPlayButton = () => {
    if (!this.state.isPlaying) {
      let str = this.state.winner ? 'NEXT' : 'PLAY'
      return (
        <a className="playButton" onClick={this.onContinue}>{str}</a>
      )
    } else return null
  }

  renderLoading = () => {
    return(
      <p className="score">loading...</p>
    )
  }

}

export default App;