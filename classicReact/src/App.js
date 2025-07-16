import React from 'react';

class Component extends React.Component {
  state = { count: 0 }

  handleIncrement = () => {
    this.setState((currState) => {
      return { count: currState.count + 1 };
    });
  }

  handleDecrement = () => {
    this.setState((currState) => {
      return { count: currState.count - 1 };
    });
  }

  render() {
    const date = new Date();
    date.setDate(date.getDate() + this.state.count);

    return (
      <div>
        <button onClick={this.handleDecrement}>-</button>
        <span>{this.state.count}</span>
        <button onClick={this.handleIncrement}>+</button>
        <div>{date.toLocaleDateString()}</div>
      </div>
    );
  }
}

export default Component;