import React, { Component } from 'react';
import PropTypes from 'prop-types';

const padZero = n => {
  if(n < 10) return `0${n}`;
  return n
}

const formatSeconds = (s) => {
  let m = (s-(s%=60))/60
  return padZero(m) + ':' + padZero(s)
}

class Timer extends Component {

  static propTypes = {
    level: PropTypes.number.isRequired,
    timeOut: PropTypes.number.isRequired,
    onTimeout: PropTypes.func.isRequired,
    sound: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    }
  }

  componentDidMount() {
    this.startTimer()
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }

  startTimer = () => {
    this.setState({
      time: 0,
    });
    this.timerInterval = setInterval(this.tick, 1000);
  }
  
  tick = () => {
    if(this.state.time === this.props.timeOut - 1){
      clearInterval(this.timerInterval);
      this.props.onTimeout();
    } else {
      this.setState({time: this.state.time + 1})
      if(this.props.timeOut - this.state.time < 6) {
        this.props.sound.play('tick');
      }
    }
  }

  render() {
    let elapsed = this.props.timeOut - this.state.time;

    return (
      <p className={`time ${elapsed < 6 ? 'danger' : ''}`}>
        {formatSeconds(elapsed)}
      </p>
    );
  }


}

export default Timer;