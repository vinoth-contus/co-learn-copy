import React, { Component } from 'react';
import './challengeSummary.scss';
import { Link } from 'react-router-dom';
import close from '../../assets/images/svg/close-grey.svg';
// import bookmark from '../../assets/images/bookmark.png';
// import thumbnail from '../../assets/images/service.jpg';
import AppUtility from '../../utility/AppUtility';

class ChallengeSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      justification: ''
    };
  }

  initializeReactGA = () => {
    AppUtility.initializeReactGA('challenge-summary');
  };

  showPopup = justification => {
    this.setState(
      {
        justification: justification
      },
      () => {
        this.setState({
          showPopup: true
        });
      }
    );
  };

  hidePopup = () => {
    this.setState({
      showPopup: false
    });
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

    this.setState({
      answers: this.props.location.state.answers
    });
  }

  endChallenge = () => {
    this.props.history.push({
      pathname: '/end-challenge',
      state: {
        score: this.props.location.state.score,
        total: this.props.location.state.total,
        data: this.props.location.state.data,
        answers: this.props.location.state.answers
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <main className="overall-wrap challenge-summary">
          <div className="header-section">
            <span onClick={this.endChallenge} className="close-grey">
              <img src={close} alt="Close-icon" />
            </span>
          </div>
          <section className="body-section">
            <div className="container-wrap">
              <h2>Your answers</h2>
              <div className="challenge-container">
                <QuestionSummary
                  showPopup={this.showPopup}
                  answers={this.state.answers}
                />
              </div>
              <div className="button-section">
                <Link to="/" className="gray-button text-center">
                  Go to the main menu
                </Link>

                <button
                  onClick={this.endChallenge}
                  className="green-button  text-center"
                >
                  Go back to session summary
                </button>
              </div>
            </div>
          </section>
        </main>

        <div
          className="ovarlay exit-ovarlay"
          style={
            this.state.showPopup ? { display: 'block' } : { display: 'none' }
          }
        >
          {/* Hint Popup */}
          <div className="popup-wrap">
            <div className="popup-content-wrap">
              <div
                className="hint-pop-wrap"
                style={
                  this.state.showPopup
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                <img
                  src={close}
                  alt="close-icon"
                  onClick={this.hidePopup}
                  className="cursor-pointer"
                />
                <div className="popup-hint-content">
                  <h2>Justification</h2>
                  {this.state.justification && (
                    <p>{this.state.justification}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function QuestionSummary(props) {
  const answers = props.answers;

  if (answers.length <= 0) {
    return <div />;
  }

  const optionsDiv = answers.map((answer, index) => (
    <div key={answer.question_id} className="question-wrapper">
      <div className="serial-no">
        <p className="number">{index + 1}</p>
      </div>
      <div className="question-container">
        <div className="question">
          <p>
            Q<span className="question-number">{index + 1}</span>:{' '}
            {answer.question.question}
          </p>
          <strong>A: {answer.actualAnswer}</strong>
          <p className="your-answer">Your Answer: {answer.selectedAnswer}</p>
          <span
            onClick={() => {
              props.showPopup(answer.question.justification.data);
            }}
            href="/"
            className="justifications"
          >
            Read Justification
          </span>
        </div>
        <span
          className={answer.correct ? 'answer-sign' : 'answer-sign wrong'}
        />
      </div>
      {/* <div className="review-wrapper">
      <div className="review">
        <div className="thumbnail">
          <img src={thumbnail} alt="" />
          <span className="eye" />
        </div>
        <div className="description">
          <p>Review Topic</p>
          <h3>Making a good first impression</h3>
        </div>
      </div>
      <a href="#a" className="reading-list">
        <img src={bookmark} alt="eye-icon" />
        <span>Add to your reading list</span>
      </a>
    </div> */}
    </div>
  ));
  return optionsDiv;
}
export default ChallengeSummary;
