import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';

import './endChallenge.scss';
import '../../assets/scss/circular-progressbar.scss';

import plus from '../../assets/images/svg/plus-green.svg';
// import medal from '../../assets/images/svg/medal-blue.svg';
import close from '../../assets/images/svg/close-grey.svg';
import medalgrey from '../../assets/images/svg/star-grey.svg';
import review from '../../assets/images/svg/review.svg';
import challenge from '../../assets/images/svg/challenge-red.svg';
import AppUtility from '../../utility/AppUtility';

let RESULT_VISIBLE_THRESHOLD = 0;

class EndChallenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overallPercentage: 0,
      pointsEarned: 0,
      totalPoint: 0,
      wonSession: 0,
      score: null,
      total: null,
      totalAnswered: 0
    };
  }

  endChallenge = () => {
    this.props.history.push({
      pathname: '/challenge-summary',
      state: {
        score: this.props.location.state.score,
        total: this.props.location.state.total,
        data: this.props.location.state.data,
        answers: this.props.location.state.answers
      }
    });
  };

  initializeReactGA = () => {
    AppUtility.initializeReactGA('end-challenge');
  };

  componentDidMount() {
    this.initializeReactGA();

    if (
      !this.props.location.state ||
      !this.props.location.state.data ||
      !this.props.location.state.score ||
      !this.props.location.state.total ||
      !this.props.location.state.answers
    ) {
      this.props.history.push('/start-challenge');
      return;
    }

    let gamificationPointsConfigration = JSON.parse(
      localStorage.getItem('gamificationPointsConfigration')
    );

    if (gamificationPointsConfigration) {
      RESULT_VISIBLE_THRESHOLD =
        gamificationPointsConfigration.result_visible_threshold;
    }

    let {
      overall_percentage,
      pointsEarned,
      total_point,
      wonSession,
      total_answered
    } = this.props.location.state.data;

    this.setState({
      overallPercentage: overall_percentage,
      pointsEarned: pointsEarned,
      totalPoint: total_point,
      wonSession: wonSession,
      totalAnswered: total_answered,
      score: this.props.location.state.score,
      total: this.props.location.state.total
    });
  }
  render() {
    return (
      <React.Fragment>
        <main
          className="overall-wrap practice-page end"
          id="max-width-halfthird"
        >
          <div className="header-section">
            <Link to="/" className="close-grey">
              <img src={close} alt="Close-icon" />
            </Link>
          </div>
          <section className="body-section practice-end">
            <div className="container-wrap">
              <div className="end-practice title">
                {this.state.wonSession === 0 ? (
                  <p>Your challenge session is completed!</p>
                ) : (
                  <p>You won this challenge!</p>
                )}

                {this.state.wonSession === 0 ? (
                  ''
                ) : (
                  <div className="flex">
                    <img src={plus} alt="count-plus" />
                    <span className="count-number">
                      {this.state.wonSession}
                      {this.state.wonSession > 1 ? ' Points' : ' Point'}
                    </span>
                  </div>
                )}
              </div>
              <div className="practice-cotent">
                <div className="category-title">
                  <div className="category-bor skill-title">
                    <img src={challenge} alt="Challenge" />
                    {this.state.score !== null && this.state.total !== null && (
                      <h2>
                        {this.state.score} out of {this.state.total} of your
                        answers were correct!
                      </h2>
                    )}
                  </div>

                  {this.state.totalAnswered >= RESULT_VISIBLE_THRESHOLD ? (
                    <div className="category-bor strength">
                      <div className="flex-flexstart">
                        <h4 className="strength-title">
                          Overall Knowledge Strength
                        </h4>
                        <div className="strength-circle donut-circle">
                          <CircularProgressbar
                            strokeWidth={12}
                            borderRadius={0}
                            percentage={this.state.overallPercentage}
                            text={
                              this.state.overallPercentage <= 0
                                ? `N/A`
                                : `${this.state.overallPercentage}%`
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="category-bor strength">
                      <div className="flex-flexstart">
                        <h4 className="strength-title">
                          Overall Knowledge Strength
                        </h4>
                        <div className="strength-circle donut-circle">
                          <CircularProgressbar
                            strokeWidth={12}
                            borderRadius={0}
                            percentage={0}
                            text={'N/A'}
                          />
                        </div>
                      </div>

                      <div className="practice-alert">
                        <div className="oval-wrap">
                          <span className="oval-inner">
                            <i className="exclamatory">!</i>
                          </span>
                        </div>
                        <p>
                          Your results will be visible after you answer minimum{' '}
                          {RESULT_VISIBLE_THRESHOLD} questions
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="category-bor total-points">
                    <h4>Points earned</h4>
                    <div className="end-earn">
                      <img src={plus} alt="" />
                      <span className="points-field">
                        {this.state.pointsEarned}
                      </span>
                    </div>
                  </div>
                  <div className="category-bor earned-points">
                    <h4>Points total</h4>
                    <div className="end-earn">
                      {/* <div className="acgeivements">
                        <img src={medal} alt="" />
                        <h5>Top 20%</h5>
                      </div> */}
                      <span className="points-field">
                        {this.state.totalPoint}
                      </span>
                    </div>
                  </div>
                  <div className="category-bor medal-star">
                    <Link
                      to="/my-performance"
                      className="achiev-btn cursor-pointer"
                    >
                      <img src={medalgrey} alt="" />
                      <span>See overall performance</span>
                    </Link>

                    <button
                      onClick={this.endChallenge}
                      className="achiev-btn cursor-pointer"
                    >
                      <img src={review} alt="" />
                      <span>Review answers</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="page-bot-btn">
                <Link to="/" className="grey redirect-btn text-center">
                  Go to the main menu
                </Link>
                <Link
                  to="/question-challenge"
                  className="redirect-btn text-center"
                >
                  Start another challenge
                </Link>
              </div>
            </div>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default EndChallenge;
