import React, { Component } from 'react';

class ProgressBar extends Component {
  render() {
    return (
      <div
        className="counting-bar"
        style={{
          height: `${this.props.height}px`,
          marginTop: `${this.props.marginTop}px`,
          borderRadius: `${this.props.borderRadius}px`,
          backgroundColor: `${this.props.countingBarBackgroundColor}`
        }}
      >
        <div
          className="counting-inner"
          style={{
            width: `${this.props.percentage}%`,
            backgroundColor: `#${this.props.backgroundColor}`,
            borderRadius: `${this.props.borderRadius}px`
          }}
        />
      </div>
    );
  }
}

export default ProgressBar;
