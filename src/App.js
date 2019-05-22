import React, { Component } from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionDisplay:  25,
      session: 25,
      break: 5,
      breakDisplay: 5,
      minute: 60,
      running: false,
      breakTime: false,
      audioPlay: false
    };

    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.startStop = this.startStop.bind(this);
    this.reset = this.reset.bind(this);
  }

  //INCREASE THE VALUE OF THE BREAK OR SESSION LENGTH
  handleIncrement(e) {
    if (e.target.id === "break-increment" && !this.state.running) {
      if (this.state.break !== 60 && this.state.breakDisplay !== 60) {
        this.setState({
          break: Number(this.state.breakDisplay) + 1,
          breakDisplay: Number(this.state.breakDisplay) + 1,
          minute: 60
        });
        if(this.state.break <= 10){ this.setState({ break: ("0" + (this.state.breakDisplay + 1)).slice(-2) });}
        clearInterval(this.timerID);
      }
    } else {
      if (this.state.session !== 60 && !this.state.running && this.state.sessionDisplay !== 60) {
        this.setState({
          sessionDisplay: Number(this.state.sessionDisplay) + 1,
          session: Number(this.state.sessionDisplay) + 1,
          minute: 60
        });
        if(this.state.session <= 10){this.setState({ session: ("0" + (this.state.sessionDisplay + 1)).slice(-2) });}
        clearInterval(this.timerID);
      }
    }
  }

  //DECREASE THE VALUE OF THE BREAK OR SESSION LENGTH
  handleDecrement(e) {
    if (e.target.id === "break-decrement" && !this.state.running) {
      if (this.state.break > 1 && this.state.breakDisplay > 1) {
        this.setState({
          breakDisplay: Number(this.state.breakDisplay) - 1,
          break: Number(this.state.breakDisplay) - 1,
          minute: 60
        });
        if(this.state.break <= 10){this.setState({ break: ("0" + (this.state.breakDisplay - 1)).slice(-2) });}
        clearInterval(this.timerID);
      }
    } else {
      if(this.state.session > 1 && this.state.sessionDisplay > 1){
        this.setState({
          sessionDisplay: Number(this.state.sessionDisplay) - 1,
          session: Number(this.state.sessionDisplay) - 1,
          minute: 60
        });
        if(this.state.session <= 10){this.setState({ session: ("0" + (this.state.sessionDisplay - 1)).slice(-2) });}
        clearInterval(this.timerID);
      }
    }
  }

  //WHEN START OR STOP BUTTON IS PRESSED
  startStop() {
    clearInterval(this.timerID);
   if(!this.state.running){
    this.setState({running: true});
     if(this.state.breakTime === false){
      this.timerID = setInterval(() => this.tickSession(), 1000);
     } else {
      this.timerID = setInterval(() => this.tickBreak(), 1000);
     }
    } else {
     this.setState({running: false}); 
    }
  } 

  //WHEN SESSION IS RUNNING
  tickSession() {
    this.setState({  break: ("0" + this.state.breakDisplay).slice(-2)});
    this.setState({ session: ("0" + this.state.session).slice(-2) });
    if (this.state.minute === 60) { this.setState({ session: ("0" + (this.state.session - 1)).slice(-2) });}
    this.setState({ minute: this.state.minute - 1 });
    if (this.state.minute === 0 && this.state.session !== "00") { this.setState({ minute: 60 });}
    if (this.state.minute < 0) {
     clearInterval(this.timerID);
      this.setState({ breakTime: true, minute: 60 });
      this.timerID = setInterval(() => this.tickBreak(), 1000);
    }
   }

  //WHEN BREAK IS RUNNING
  tickBreak() {
    this.setState({  session: ("0" + this.state.sessionDisplay).slice(-2)});
    this.setState({ break: ("0" + this.state.break).slice(-2) });
    if (this.state.minute === 60) { this.setState({ break: ("0" + (this.state.break - 1)).slice(-2) });}
    this.setState({ minute: this.state.minute - 1 });
    if (this.state.minute === 0 && this.state.break !== "00") { this.setState({ minute: 60 });}
    if (this.state.minute < 0) {
      clearInterval(this.timerID);
      this.setState({ breakTime: false, minute: 60 });
      this.timerID = setInterval(() => this.tickSession(), 1000);
    }
  }

  //RESET TIMER
  reset() {
    let audio = document.getElementById("beep");
    clearInterval(this.timerID);
    this.setState({
      session: 25,
      sessionDisplay: 25,
      break: 5,
      breakDisplay: 5,
      minute: 60,
      running: false,
      breakTime: false
    });
    audio.pause();
    audio.currentTime = 0;
  }

  render() {
    return (
      <div>
        <h1>Pomodoro Clock</h1>
        <p id="break-label">
          <span>
            {" "}
            <i class="fas fa-arrow-alt-circle-down" id="break-decrement" onClick={this.handleDecrement}></i>
          </span><span className="label">Break Length</span><p id="break-length">{this.state.breakDisplay}</p>
          <span>
            {" "}
            <i class="fas fa-arrow-alt-circle-up" id="break-increment" onClick={this.handleIncrement}></i>
          </span>
        </p>
        <p id="session-label">
          <span>
            {" "}
            <i class="fas fa-arrow-alt-circle-down" id="session-decrement" onClick={this.handleDecrement}></i>
          </span><span className="label">Session Length</span><p id="session-length">
            {this.state.sessionDisplay}
          </p>
          <span>
            {" "}
            <i class="fas fa-arrow-alt-circle-up" id="session-increment" onClick={this.handleIncrement}></i>
          </span>
        </p>
        <Timer 
          session={this.state.session}
          break={this.state.break}
          reset={this.reset}
          startStop={this.startStop}
          startStopTitle={this.state.running}
          minute={this.state.minute}
          minutesLeft={this.state.minutesLeft}
          breakTime={this.state.breakTime}
        />
        <audio id="beep" src="https://actions.google.com/sounds/v1/cartoon/mechanical_clock_ring.ogg"/>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //TITLE DISPLAY
    let title;
    let timeDisplay;
    if (this.props.breakTime) {
      title = "Break";
      timeDisplay = this.props.break;
    } else {
      title = "Session";
      timeDisplay = this.props.session;
    }

    //START OR STOP
    let startStopTitle;
    this.props.startStopTitle ? startStopTitle = "Stop" : startStopTitle = "Start";
    
    //MINUTES TIME LEFT
    let minutesDisplay;
    if (this.props.minute === 60) {
      minutesDisplay = "00";
    } else {
      minutesDisplay = this.props.minute;
      if (this.props.minute < 10) {
        minutesDisplay = "0" + this.props.minute;
      }
    }

    //PLAY AUDIO WHEN TIMER REACHES ZERO
    let audio = document.getElementById("beep");
    if (timeDisplay === "00" && minutesDisplay === "00") {
      audio.currentTime = 10;
      audio.play();
    }

    return (
      <div id="timer">
        <h2 id="timer-label">{title}</h2>
        <p id="time-left">
          {timeDisplay}:{minutesDisplay}
        </p>
        <button id="start_stop" onClick={this.props.startStop}>
          {startStopTitle}
        </button>
        <button id="reset" onClick={this.props.reset}>
          Reset
        </button>
      </div>
    );
  }
}

export default App;








 