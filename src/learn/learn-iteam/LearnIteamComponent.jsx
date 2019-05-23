import React, { Component } from 'react';
import backarrow from '../../assets/images/svg/back-grey.svg';
import AppUtility from '../../utility/AppUtility';
import './learnIteam.scss';
import Authorization from '../../utility/authorization';
import BaseURL from '../../utility/BaseURL';
class LearnIteam extends Component {
  constructor(props) {
    super(props);
    this.accessToken = Authorization.authUserAccessToken();
  }
  initializeReactGA = () => {
    AppUtility.initializeReactGA('single-learn-item');
  };

  componentDidMount() {
    this.initializeReactGA();
  }

  hideLearningIteam = () => {
    this.props.hideLearningIteam();
  };

  render() {
    return (
      <main className="overall-wrap reading-list-reviewed">
        <div className="learnitem-header">
          <div className="back-button" onClick={this.hideLearningIteam}>
            <img src={backarrow} alt="Page-Back cursor-pointer" />
          </div>
        </div>
        <div className="iframe">
          <iframe
            title="title"
            src={`${BaseURL.CONTENT_SERVICE}${this.props.url}?jwt=${this.accessToken}`}
            height="100%"
            width="100%"
          />
        </div>
      </main>
    );
  }
}

export default LearnIteam;
