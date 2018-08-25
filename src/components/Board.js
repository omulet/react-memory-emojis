import React, { Component } from 'react';
import PropTypes from 'prop-types';
import animate from "../utils/animateplus";

// import * as cx from 'classnames';
import { shuffle } from '../utils/array';
import emojis from '../utils/emojis';

class Board extends Component {

  static propTypes = {
    size: PropTypes.number.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    sound: PropTypes.object.isRequired,
    onAdjustScore: PropTypes.func.isRequired,
    onCompleteLevel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      flippedCards: [],
      matches: [],
      locked: false
    }
  }

  componentDidMount() {
    this.initBoard()
  }

  componentWillUpdate(nextProps) {
    if(nextProps.looser) {
      this.animateFail()
    }
  }

  initBoard = () => {
    let { size } = this.props
    // create new emojis set
    let newSet = shuffle(emojis).slice(0, size)

    this.setState({
      cards: shuffle(newSet.concat(newSet)),
      flippedCards: [],
      matches: [],
      locked: false
    })
    setTimeout(this.animateEnterCards, 0);
  }

  animateEnterCards = () => {
    animate({
      elements: ".card",
      duration: 1000,
      delay: index => index * 50,
      transform: ["scale(.5)", "scale(1)"],
      opacity: [0, 1]
    })
  }

  animateExitCards = () => {
    animate({
      elements: ".card",
      easing: "out-exponential",
      duration: 500,
      delay: index => index * 100,
      transform: ["scale(1) rotate(0turn)", "scale(.8) rotate(1turn)"],
      opacity: [1, .5]
    })
  }

  animateFail = () => {
    animate({
      elements: ".card",
      easing: "out-exponential",
      duration: 3000,
      delay: index => index * 50,
      transform: ["scale(1)", "scale(.8)"],
      opacity: [1, .5]
    })
  }

  checkMatches = () => {
    let { cards, matches, flippedCards } = this.state
    let { sound } = this.props

    if(flippedCards.length === 2){
      if(cards[flippedCards[0]] === cards[flippedCards[1]]) {
        let newMatches = matches.concat(flippedCards);
        this.setState({
          matches: newMatches,
          flippedCards: []
        })
        this.props.onAdjustScore(10)

        if(newMatches.length === cards.length) {
          sound.play('win')
          this.animateExitCards()

          this.props.onCompleteLevel()
        } else {
          sound.play('match')
        }
      } else {
        sound.play('flip')
        this.setState({locked: true})
        setTimeout(() => {
          this.setState({flippedCards: [], locked: false})
          sound.play('flap')
          this.props.onAdjustScore(-5)
        }, 1000)
      }
    } else {
      sound.play('flip')
    }
  }

  handleClick = (card, i) => {
    let {flippedCards, matches } = this.state
    if(
      this.props.isPlaying
      && flippedCards.length < 2 
      && flippedCards.indexOf(i) < 0
      && matches.indexOf(i) < 0
    ) {
      flippedCards.push(i)
      this.setState({flippedCards})
      this.checkMatches()
    }
  }

  render() {
    let { cards } = this.state
    return (
      <div className="Board">
        { cards.map(this.renderCard) }
      </div>
    );
  }

  renderCard = (c, i) => {
    let { matches, flippedCards } = this.state
    return(
      <Card symbol={c} size={this.props.cardSize} key={i}
        onClick={() => this.handleClick(c, i)}
        isFlipped={flippedCards.indexOf(i) > -1 || matches.indexOf(i) > -1}
      />
    );
  }

}

const Card = ({symbol, size, onClick, isFlipped}) => 
  <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={onClick}
  style={{width: `${size-15}px`, height: `${size-15}px`, fontSize:`${size/2}px`}}>
    <div className="content">
      <div className="front">{" "}</div>
      <div className="back">{symbol}</div>
    </div>
  </div>

export default Board;