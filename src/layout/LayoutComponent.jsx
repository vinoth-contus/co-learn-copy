import React, { Component } from 'react';

class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default Layout;
