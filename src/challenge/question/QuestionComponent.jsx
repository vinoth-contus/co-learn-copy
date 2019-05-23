import toastr from 'toastr';
import React, { Component } from 'react';
import AppUtility from '../../utility/AppUtility';
import Authorization from '../../utility/authorization';
import ProgressBar from '../../global-components/ProgressBarComponent';
import PostAction from '../../reading-list/post/PostAction';
import ResourseHandler from '../../global-components/ResourseHandlerComponent';

import tick from '../../assets/images/svg/right.svg';
import wrong from '../../assets/images/svg/wrong.svg';
import plus from '../../assets/images/svg/plus-green.svg';
import book from '../../assets/images/svg/readinglist.svg';
import close from '../../assets/images/svg/close-grey.svg';
import check from '../../assets/images/svg/readinglist-check-grey.svg';

import '../../assets/scss/common-question.scss';
import './question.scss';
import Hotspotcircle from '../../global-components/Hotspotcircle';

const COUNT = process.env.REACT_APP_QUESTION_COUNT;

const NEXT_QUESTION_STARTS_IN_TIMER =
  process.env.REACT_APP_CHALLENGE_NEXT_QUESTION_TIMER;

const SHOW_VALIDATION_FEATURE =
  process.env.REACT_APP_SHOW_VALIDATION_FEATURE === 'true'; // env returns string so checking is the value is true, if it is true returns true Boolean

let nextQuestionStartsInTimer = NEXT_QUESTION_STARTS_IN_TIMER;
let questionDuration = null;

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      correctOption: '',
      justification: '',
      totalCorrectAnswer: 0,
      totalAttemptedQuestions: 0,
      timeTakenToAnswer: 0,

      question: null,
      questions: null,
      questionProgress: 0,

      currentQuestionTopicId: '',
      currentQuestionIndex: null,
      currentQuestionTopicName: '',
      currentQuestionArticleId: '',
      currentQuestionPoints: 0,

      isLastQuestion: false,
      isCorrectAnswer: false,
      isInCorrectAnswer: false,
      isAnsweringTimeUp: false,
      isAddedToReadingList: false,
      addToReadingListMsg: 'Processing...',

      showExitPopup: false,
      showQuestionTimer: true,
      showArticlePopup: false,
      optionSelected: false,
      questionDuration: questionDuration,
      nextQuestionStartsInTimer: nextQuestionStartsInTimer,
      fillblankspace: ''
    };

    this.timeoutID = null;
    this.optionFlashTimeOutId = null;
    this.questionTimeoutID = null;
    this.optionSelectedTimeoutID = null;
    this.clickedArea = this.clickedArea.bind(this);
    this._handler = this._handler.bind(this);
  }

  resizeWindow = () => {
    if (document.getElementById('questions_option_section')) {
      let height = document.getElementById('questions_option_section')
        .clientHeight;
      document.getElementById(
        'overall_wrap'
      ).style.paddingBottom = `${height}px`;
    }
  };

  submitAnswe = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.verifyAnswer();
    }
  };

  _handler = e => {
    this.setState({ fillblankspace: e.target.value });
  };

  verifyAnswer = () => {
    if (
      this.state.fillblankspace !== '' &&
      this.state.fillblankspace !== 'err'
    ) {
      var correct = '';
      var incorrect = '';

      this.state.question.options.map(option => {
        if (
          option.correct &&
          this.state.fillblankspace.toLowerCase() === option.value.toLowerCase()
        ) {
          correct = option;
        } else {
          incorrect = option;
          incorrect.id = 'OPTION_FBEXM_INCORRECT';
        }
        return '';
      });

      this.selectOption(correct !== '' ? correct : incorrect);
    } else {
      this.setState({ fillblankspace: 'err' });
    }
  };

  clickedArea = selectedoption => {
    this.selectOption(selectedoption);
  };

  markAsUnReviewed = (topicId, articleId) => {
    let reviewed = false;

    PostAction.markAsReviewedOrUnReviewed(
      topicId,
      articleId,
      reviewed,
      response => {
        this.setState({
          isAddedToReadingList: true,
          addToReadingListMsg: 'Added to your review list'
        });
      },
      error => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toastr.error(error.response.data.error);
        } else {
          toastr.error('Sorry, Somthing went wrong!');
        }
      }
    );
  };

  initializeReactGA = () => {
    AppUtility.initializeReactGA('challenge-question');
  };

  componentDidUpdate() {
    window.onpopstate = e => {
      clearInterval(this.optionSelectedTimeoutID);
      clearInterval(this.questionTimeoutID);
      clearTimeout(this.timeoutID);
      clearTimeout(this.optionFlashTimeOutId);
    };
  }

  quitChallenge = () => {
    this.setState({
      showExitPopup: true
    });
  };

  hideExitPopup = () => {
    this.setState({
      showExitPopup: false
    });
  };

  exitChallenge = () => {
    clearInterval(this.optionSelectedTimeoutID);
    clearInterval(this.questionTimeoutID);
    clearTimeout(this.timeoutID);
    clearTimeout(this.optionFlashTimeOutId);

    if (this.state.answers.length > 0) {
      this.postAnswersAndRedirect();
    }
    this.props.history.push('/');
  };

  postAnswersAndRedirect = endPoint => {
    clearInterval(this.optionSelectedTimeoutID);
    clearInterval(this.questionTimeoutID);
    let requestBody = {
      score: this.state.totalCorrectAnswer,
      total: this.state.totalAttemptedQuestions,
      answers: this.state.answers
    };
    AppUtility.postAnswers(
      requestBody,
      'challenge',
      response => {
        if (endPoint) {
          this.props.history.push({
            pathname: endPoint,
            state: {
              score: this.state.totalCorrectAnswer,
              total: this.state.questions.length,
              data: response.data,
              answers: this.state.answers
            }
          });
        }
      },
      error => {
        if (endPoint) {
          this.props.history.push({
            pathname: endPoint,
            state: {
              score: this.state.totalCorrectAnswer,
              total: this.state.questions.length,
              data: null
            }
          });
        }
      }
    );
  };

  handleQuestion = question => {
    let currentQuestionTopicId = question.topic;
    let allArticles = JSON.parse(localStorage.getItem('allArticles'));

    let topic = allArticles.filter(topic => {
      return topic.topicid === currentQuestionTopicId;
    });

    topic = topic[0];
    questionDuration = question.duration;
    nextQuestionStartsInTimer = NEXT_QUESTION_STARTS_IN_TIMER;

    this.setState(
      {
        fillblankspace: '',
        showQuestionTimer: true,
        currentQuestionPoints: 0,
        optionSelected: false,
        question: question,
        showArticlePopup: false,
        questionDuration: questionDuration,
        currentQuestionArticleId: topic._id,
        currentQuestionSubject: topic.subject,
        currentQuestionTopicId: topic.topicid,
        currentQuestionTopicName: topic.topicname,
        nextQuestionStartsInTimer: nextQuestionStartsInTimer
      },
      () => {
        window.scrollTo(0, 0);

        let height = document.getElementById('questions_option_section')
          .clientHeight;

        document.getElementById(
          'overall_wrap'
        ).style.paddingBottom = `${height + 80}px`;
      }
    );
    this.questionTimeoutID = this.startQuestionTimer(questionDuration, 1);
  };

  handleNextQuestion = () => {
    clearInterval(this.optionSelectedTimeoutID);

    let currentQuestionIndex = this.state.currentQuestionIndex + 1;
    let questionsLength = this.state.questions.length;
    let questionProgress = 100 / questionsLength;

    if (currentQuestionIndex === questionsLength) {
      this.postAnswersAndRedirect('/end-challenge');
      return;
    }

    let optionsDomElements = document.getElementsByClassName('options');

    for (let j = 0; j < optionsDomElements.length; j++) {
      let optionsDomElement = optionsDomElements[j];
      optionsDomElement.classList.remove('blink');
      optionsDomElement.classList.remove('imageCont');
      optionsDomElement.classList.remove('correct');
      optionsDomElement.classList.remove('incorrect');
    }

    if (SHOW_VALIDATION_FEATURE) {
      document.getElementById(
        'next_question_circle_animation'
      ).style.strokeDashoffset = 100;
    }

    this.setState({
      isAnsweringTimeUp: false,
      isAddedToReadingList: false,
      addToReadingListMsg: 'Processing...'
    });

    this.handleQuestion(this.state.questions[currentQuestionIndex]);

    this.setState({
      currentQuestionIndex: currentQuestionIndex,
      questionProgress: this.state.questionProgress + questionProgress
    });
  };

  startQuestionTimer = (questionTimerConst, i) =>
    setInterval(() => {
      questionDuration--;

      if (questionDuration === 0) {
        clearInterval(this.questionTimeoutID);
        this.showTimeUp();
        return;
      }

      document.getElementById('circle_animation').style.strokeDashoffset =
        '100' - (i + 1) * ('100' / questionTimerConst);

      i++;
      this.setState({
        timeTakenToAnswer: i
      });
    }, 1000);

  showTimeUp = () => {
    this.setState({
      isAnsweringTimeUp: true
    });
    this.timeoutID = setTimeout(() => {
      this.selectOption();
    }, 4000);
  };

  addToReadingList = (isCorrect, byUser) => {
    if (this.state.isAddedToReadingList) {
      return;
    }

    if (byUser && this.state.addToReadingListMsg === 'Mark as un-reviewed') {
      this.markAsUnReviewed(
        this.state.currentQuestionTopicId,
        this.state.currentQuestionArticleId
      );
      return;
    }

    if (byUser && this.state.addToReadingListMsg === 'Processing...') {
      return;
    }

    if (isCorrect === null) {
      isCorrect = this.state.isCorrectAnswer;
    }

    let userId = Authorization.getAuthUserId();
    AppUtility.addToReadingList(
      this.state.currentQuestionTopicId,
      this.state.currentQuestionArticleId,
      userId,
      isCorrect,
      byUser,
      response => {
        if (
          response.data.message === 'Mark as un-reviewed' ||
          response.data.message === 'Add to your review list'
        ) {
          this.setState({
            isAddedToReadingList: false,
            addToReadingListMsg: response.data.message
          });
        } else {
          this.setState({
            isAddedToReadingList: true,
            addToReadingListMsg: response.data.message
          });
        }
      },
      () => {
        this.setState({
          isAddedToReadingList: false,
          addToReadingListMsg: 'Add to your review list'
        });
      }
    );
  };

  animateSelectedOption = (option, event) => {
    if (option && this.state.isAnsweringTimeUp) {
      return;
    }

    if (this.state.optionSelected) return;

    this.setState({
      optionSelected: true
    });

    clearInterval(this.questionTimeoutID);
    document.getElementById('circle_animation').style.strokeDashoffset = 100;

    let imageCont = option.image ? 'imageCont' : '';
    if (option.correct) {
      if (event.target.className.includes('options')) {
        event.target.className = `options cursor-pointer correct ${imageCont}`;
      } else if (event.target.parentNode.className.includes('options')) {
        event.target.parentNode.className = `options cursor-pointer correct ${imageCont}`;
      } else if (
        event.target.parentNode.parentNode.className.includes('options')
      ) {
        event.target.parentNode.parentNode.className = `options cursor-pointer correct ${imageCont}`;
      }
    } else {
      document.getElementById('correct_option').classList.add('correct');

      if (event.target.className.includes('options')) {
        event.target.className = `options cursor-pointer incorrect ${imageCont}`;
      } else if (event.target.parentNode.className.includes('options')) {
        event.target.parentNode.className = `options cursor-pointer incorrect ${imageCont}`;
      } else if (
        event.target.parentNode.parentNode.className.includes('options')
      ) {
        event.target.parentNode.parentNode.className = `options cursor-pointer incorrect ${imageCont}`;
      }
    }

    document.getElementById('correct_option').classList.add('blink');
    this.selectOption(option);
  };

  selectOption = option => {
    if (option && this.state.isAnsweringTimeUp) {
      return;
    }

    this.setState({
      showQuestionTimer: false
    });

    clearInterval(this.questionTimeoutID);
    document.getElementById('circle_animation').style.strokeDashoffset = 100;

    let isCorrectAnswer = false;
    let isInCorrectAnswer = false;
    let selectedAnswerId = 'Option_TimeOut';
    let actualAnswer = null;
    let selectedAnswer = null;

    let {
      q_id,
      duration,
      topic: topic_id,
      options,
      justification
    } = this.state.question;

    for (var i = 0; i < options.length; i++) {
      if (options[i].correct) {
        actualAnswer = options[i].value;
        this.setState({ correctOption: options[i].value });
        break;
      }
    }

    if (option) {
      selectedAnswerId = option.id;
      selectedAnswer = option.value;
    }

    if (option && option.correct) {
      isCorrectAnswer = true;
      this.setState({
        totalCorrectAnswer: this.state.totalCorrectAnswer + 1
      });
    } else {
      isInCorrectAnswer = true;
    }

    // isCorrect, byUser
    this.addToReadingList(isCorrectAnswer, false);

    let currentQuestionIndex = this.state.currentQuestionIndex + 1;
    let questionsLength = this.state.questions.length;

    if (currentQuestionIndex === questionsLength) {
      this.setState({
        isLastQuestion: true
      });
    }

    let answer = {
      question_id: String(q_id),
      answer_id: selectedAnswerId,
      actualAnswer: actualAnswer,
      selectedAnswer: selectedAnswer,
      correct: isCorrectAnswer,
      duration: duration,
      topic_id: topic_id,
      hint_used: false,
      time_taken: this.state.timeTakenToAnswer,
      subject_id: this.state.currentQuestionSubject,
      question: this.state.question
    };

    let answers = this.state.answers.concat(answer);

    this.setState({
      totalAttemptedQuestions: this.state.totalAttemptedQuestions + 1,
      answers: answers,
      justification: justification.data,
      isCorrectAnswer: isCorrectAnswer,
      isInCorrectAnswer: isInCorrectAnswer
    });

    let answeredInFirstHalf = 0;
    if (this.state.timeTakenToAnswer < duration / 2) {
      answeredInFirstHalf = 1;
    }

    let isAnsweredInFirstHalf = answeredInFirstHalf;
    let isAnsweredInSecondHalf = answeredInFirstHalf ? 0 : 1;
    let isIncorrectAnswers = isInCorrectAnswer ? 1 : 0;

    if (option) {
      // number of correct answers attempted in first half,
      // number of correct answers attempted in second half,
      // is incorrect answers
      AppUtility.calculatePointsForAQuestion(
        'challenge',
        isAnsweredInFirstHalf,
        isAnsweredInSecondHalf,
        isIncorrectAnswers,
        currentQuestionPoints => {
          this.setState({
            currentQuestionPoints: currentQuestionPoints,
            showArticlePopup: true
          });
          if (SHOW_VALIDATION_FEATURE) {
            this.optionSelectedTimeoutID = this.optionSelected();
          } else {
            if (this.state.question.input_type === 'mcq') {
              setTimeout(() => {
                this.handleNextQuestion();
              }, 4000);
            } else {
              setTimeout(() => {
                this.handleNextQuestion();
              }, 1000);
            }
          }
        }
      );
    } else {
      this.setState({
        currentQuestionPoints: 0,
        showArticlePopup: true
      });

      if (SHOW_VALIDATION_FEATURE) {
        this.optionSelectedTimeoutID = this.optionSelected();
      } else {
        setTimeout(() => {
          this.handleNextQuestion();
        }, 1000);
      }
    }
  };

  optionSelected = (i = 0) =>
    setInterval(() => {
      if (nextQuestionStartsInTimer === 0) {
        this.handleNextQuestion();
        return;
      }

      if (SHOW_VALIDATION_FEATURE) {
        document.getElementById(
          'next_question_circle_animation'
        ).style.strokeDashoffset =
          '100' -
          (i + 1) *
            ('100' / process.env.REACT_APP_CHALLENGE_NEXT_QUESTION_TIMER || 5);
      }

      this.setState({
        nextQuestionStartsInTimer: nextQuestionStartsInTimer
      });

      nextQuestionStartsInTimer--;

      i++;
    }, 1000);

  getQuestions = () => {
    let authorizedUserDetails = JSON.parse(
      localStorage.getItem('authorizedUserDetails')
    );

    let tags = '';
    if (
      authorizedUserDetails &&
      authorizedUserDetails.user &&
      authorizedUserDetails.user.interest
    ) {
      tags = authorizedUserDetails.user.interest.toString();
    }

    let params = {
      count: COUNT,
      source: 'colearn',
      tags: tags
    };

    AppUtility.getQuestions(
      params,
      response => {
        this.setState({
          currentQuestionIndex: 0,
          questions: response.data.questions
        });
        this.handleQuestion(response.data.questions[0]);
      },
      error => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toastr.error(error.response.data.error);
        } else {
          toastr.error('Sorry, Somthing went wrong!');
        }
      }
    );
  };

  componentDidMount() {
    this.initializeReactGA();
    this.getQuestions();
  }

  render() {
    return (
      <React.Fragment>
        <main
          className="overall-wrap practice-page question-pge"
          id="overall_wrap"
        >
          <div className="header-section">
            <span
              className="page-close cursor-pointer"
              onClick={this.quitChallenge}
            >
              <img src={close} alt="Close-icon" className="close-grey" />
            </span>
            <div className="container-wrap">
              {this.state.question && <h2>{this.state.question.subject}</h2>}
              {this.state.currentQuestionTopicName && (
                <p>{this.state.currentQuestionTopicName}</p>
              )}

              <ProgressBar
                percentage={this.state.questionProgress}
                height="2"
                marginTop="20"
                backgroundColor="50e3c2"
              />
            </div>

            {!SHOW_VALIDATION_FEATURE && this.state.currentQuestionPoints > 0 && (
              <div className="points">
                <img src={plus} alt="plus" />
                <span>
                  {this.state.currentQuestionPoints}
                  {this.state.currentQuestionPoints > 1 ? ' Points' : ' Point'}
                </span>
              </div>
            )}
          </div>
          <section className="body-section">
            <div className="container-wrap">
              {this.state.question && (
                <p className="practice-question">
                  {this.state.question.question}
                </p>
              )}
              {this.state.question &&
              this.state.question.question_picture &&
              this.state.question.input_type !== 'hotspot-circle' ? (
                <div className="question-img-cont">
                  <ResourseHandler
                    isImageSrc={true}
                    imageUrl={
                      this.state.question
                        ? this.state.question.question_picture
                        : ''
                    }
                  />
                </div>
              ) : this.state.question &&
                this.state.question.input_type === 'hotspot-circle' ? (
                <Hotspotcircle
                  options={this.state.question.options}
                  clickedArea={this.clickedArea}
                />
              ) : (
                ''
              )}
            </div>
          </section>

          <section
            className="questions-option-section"
            id="questions_option_section"
          >
            {/* Timer Section Starts */}
            <div
              className="timer-wrapper"
              style={
                this.state.showQuestionTimer
                  ? { display: 'block' }
                  : { display: 'none' }
              }
            >
              <div className="timer-inner-wrapper">
                <svg width="32" height="32" id="question_timer">
                  <g>
                    <circle
                      id="circle_animation"
                      r="16"
                      cy="16"
                      cx="16"
                      strokeWidth="32"
                      stroke="#fd5089"
                      fill="#ffdbe7"
                    />
                  </g>
                </svg>
              </div>
            </div>
            {/* Timer Section Ends */}

            <div className="questions-option-wrap">
              {this.state.isAnsweringTimeUp ? (
                <p className="text-center">Time is up!</p>
              ) : (
                <p className="text-center">Select an option:</p>
              )}
              {this.state.question &&
              this.state.question.input_type === 'mcq' ? (
                <div className="answers-wrap">
                  {this.state.question &&
                    this.state.question.options.map(option => (
                      <div
                        key={option.id}
                        style={
                          this.state.isAnsweringTimeUp ? { opacity: '0.2' } : {}
                        }
                        id={option.correct ? 'correct_option' : ''}
                        ref={this.myRef}
                        className={`options ${
                          this.state.isAnsweringTimeUp
                            ? 'not-allowed'
                            : 'cursor-pointer'
                        } ${option.image ? 'imageCont' : ''}`}
                        onClick={event =>
                          SHOW_VALIDATION_FEATURE
                            ? this.selectOption(option)
                            : this.animateSelectedOption(option, event)
                        }
                      >
                        <p className={`${option.image ? 'option-image' : ''}`}>
                          {option.image ? (
                            <ResourseHandler
                              isImageSrc={true}
                              resizeWindow={this.resizeWindow}
                              imageUrl={option.image}
                            />
                          ) : (
                            option.value
                          )}
                        </p>
                      </div>
                    ))}
                </div>
              ) : this.state.question &&
                this.state.question.input_type === 'fb-exm' ? (
                <div className="answers-wrap fillintheBlanks">
                  <form onKeyPress={this.submitAnswe}>
                    <input
                      className={
                        this.state.fillblankspace === 'err' ? 'border' : ''
                      }
                      autoComplete="off"
                      type="text"
                      placeholder="Type your answer...!"
                      name="filinblanks"
                      onChange={this._handler}
                    />
                    <span onClick={this.verifyAnswer}>Submit</span>
                  </form>
                </div>
              ) : (
                ''
              )}
            </div>
          </section>
        </main>

        <div
          className="ovarlay"
          style={
            this.state.showArticlePopup && SHOW_VALIDATION_FEATURE
              ? { display: 'block' }
              : { display: 'none' }
          }
        >
          {/*Correct and InCorrect Answer Heading */}
          <div
            className="correct-answers-wrap"
            style={
              this.state.showArticlePopup && SHOW_VALIDATION_FEATURE
                ? { display: 'block' }
                : { display: 'none' }
            }
          >
            <div className="correct-wrap">
              <div className="tick">
                <div
                  className="tick-title"
                  style={
                    this.state.isInCorrectAnswer &&
                    !this.state.isAnsweringTimeUp
                      ? { display: 'block' }
                      : { display: 'none' }
                  }
                >
                  <img src={wrong} alt="" />
                  <h3>Incorrect</h3>
                </div>

                <div
                  className="tick-title"
                  style={
                    this.state.isInCorrectAnswer && this.state.isAnsweringTimeUp
                      ? { display: 'block' }
                      : { display: 'none' }
                  }
                >
                  <img src={wrong} alt="" />
                  <h3>No answer was selected</h3>
                </div>

                <div
                  className="tick-title"
                  style={
                    this.state.isCorrectAnswer
                      ? { display: 'block' }
                      : { display: 'none' }
                  }
                >
                  <img src={tick} alt="" />
                  <h3>Correct</h3>
                </div>

                {this.state.currentQuestionPoints > 0 && (
                  <div className="tick-count">
                    <img src={plus} alt="plus" />
                    <span className="tick-countin">
                      {this.state.currentQuestionPoints}
                      {this.state.currentQuestionPoints > 1
                        ? ' Points'
                        : ' Point'}
                    </span>
                  </div>
                )}
              </div>
              <div className="focusing-content">
                <div
                  className="correct-answer-inncorect"
                  style={
                    this.state.isInCorrectAnswer
                      ? { display: 'block' }
                      : { display: 'none' }
                  }
                >
                  <p>Correct answer:</p>
                  {this.state.isInCorrectAnswer && (
                    <h4>{this.state.correctOption}</h4>
                  )}
                </div>

                {this.state.justification && <p>{this.state.justification}</p>}

                <div
                  className={
                    this.state.isAddedToReadingList
                      ? 'reading-list cursor-not-allowed redinglist-clicked margin-top-30'
                      : 'reading-list cursor-pointer margin-top-30'
                  }
                  // isCorrect, byUser
                  onClick={() => this.addToReadingList(null, true)}
                >
                  <div className="reading-status">
                    <img
                      alt=""
                      src={this.state.isAddedToReadingList ? check : book}
                      className={
                        this.state.isAddedToReadingList ? 'check-book' : ''
                      }
                    />
                  </div>
                  {this.state.addToReadingListMsg}
                </div>
              </div>

              {/*Challenge Timer */}
              <div
                className="challenge-timer text-center"
                style={{ marginTop: '0px' }}
              >
                {/* {this.state.isLastQuestion ? (
                  <p>This was the last question. Your results in:</p>
                ) : (
                  <p>Next question in:</p>
                )}

                <h3 id="challenge_timer">
                  {this.state.nextQuestionStartsInTimer}
                </h3> */}

                <button
                  onClick={this.handleNextQuestion}
                  className="next-button"
                  style={{ position: 'relative' }}
                >
                  {this.state.isLastQuestion ? 'View results' : 'Next question'}
                  <svg
                    width="26"
                    height="26"
                    id="next_question_timer"
                    style={{
                      position: 'absolute',
                      right: '15px',
                      top: '0',
                      bottom: '0',
                      margin: 'auto'
                    }}
                  >
                    <g>
                      <circle
                        id="next_question_circle_animation"
                        r="13"
                        cy="13"
                        cx="13"
                        strokeWidth="26"
                        stroke="#ffffff"
                        fill="rgba(255, 255, 255, 0.4)"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="ovarlay exit-ovarlay"
          style={
            this.state.showExitPopup
              ? { display: 'block' }
              : { display: 'none' }
          }
        >
          <div className="popup-wrap">
            <div className="popup-content-wrap">
              {/* Exit Popup */}
              <div
                className="exit-pop-wrap"
                style={
                  this.state.showExitPopup
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                <p>
                  Are you sure you want to exit? You will only collect points
                  for answered questions.
                </p>
                <div className="action-exit">
                  <button
                    onClick={this.hideExitPopup}
                    className="cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={this.exitChallenge}
                    className="cursor-pointer"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Question;
