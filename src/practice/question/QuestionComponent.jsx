import toastr from 'toastr';
import React, { Component } from 'react';
import AppUtility from '../../utility/AppUtility';
import Post from '../../reading-list/post/PostComponent';
import Authorization from '../../utility/authorization';
import ResourseHandler from '../../global-components/ResourseHandlerComponent';
import ProgressBar from '../../global-components/ProgressBarComponent';
import PostAction from '../../reading-list/post/PostAction';

import bulb from '../../assets/images/bulb.png';
import eye from '../../assets/images/svg/eye.svg';
import tick from '../../assets/images/svg/right.svg';
import wrong from '../../assets/images/svg/wrong.svg';
// import mic from '../../assets/images/svg/mic-grey.svg';
import plus from '../../assets/images/svg/plus-green.svg';
import book from '../../assets/images/svg/readinglist.svg';
import close from '../../assets/images/svg/close-grey.svg';
import check from '../../assets/images/svg/readinglist-check-grey.svg';
import Hotspotcircle from '../../global-components/Hotspotcircle';

import '../../assets/scss/common-question.scss';

const COUNT = process.env.REACT_APP_QUESTION_COUNT;
// const TAGS = 'practice';

const PRACTICE_HINT_TIMER = process.env.REACT_APP_PRACTICE_HINT_TIMER;

window.addEventListener(
  'resize',
  function() {
    if (document.getElementById('questions_option_section')) {
      let height = document.getElementById('questions_option_section')
        .clientHeight;
      document.getElementById(
        'overall_wrap'
      ).style.paddingBottom = `${height}px`;
    }
  },
  false
);

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

      currentPost: null,
      currentArticle: null,
      currentQuestionIndex: null,
      currentQuestionPoints: 0,

      showHint: false,
      showExitPopup: false,
      showHintPopup: false,
      showArticlePopup: false,

      isHintSeen: false,
      isViewPost: false,
      isCorrectAnswer: false,
      isInCorrectAnswer: false,
      isAddedToReadingList: false,
      addToReadingListMsg: 'Processing...',

      currentQuestionTopic: '',
      currentQuestionTopicId: '',
      currentQuestionTopicName: '',
      currentQuestionSubject: '',
      currentQuestionArticleId: '',
      currentQuestionTopicImagePath: '',
      currentQuestionTopicThumbnailImagePath: '',
      fillblankspace: ''
    };

    this.questionTimeoutID = null;
    this.showHintTimeoutID = null;
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

  viewPost = (post, article) => {
    this.setState(
      {
        currentPost: post,
        currentArticle: article,
        isViewPost: true
      },
      () => {
        document.body.style.overflow = 'hidden';
      }
    );
  };

  componentWillUnmount() {
    document.body.style.overflow = 'unset';
  }

  hidePost = () => {
    this.setState(
      {
        isViewPost: false
      },
      () => {
        document.body.style.overflow = 'unset';
      }
    );
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

  showHint = () =>
    setTimeout(() => {
      this.setState({
        showHint: true
      });
    }, PRACTICE_HINT_TIMER);

  showHintPopup = () => {
    this.setState({
      showHintPopup: true,
      isHintSeen: true
    });
  };

  hideHintPopup = () => {
    this.setState({
      showHintPopup: false
    });
  };

  quitPractice = () => {
    this.setState({
      showExitPopup: true
    });
  };

  hideExitPopup = () => {
    this.setState({
      showExitPopup: false
    });
  };

  exitPractice = () => {
    if (this.state.answers.length > 0) {
      clearTimeout(this.showHintTimeoutID);
      clearInterval(this.questionTimeoutID);
      this.postAnswersAndRedirect();
      this.props.history.push('/');
    } else {
      clearTimeout(this.showHintTimeoutID);
      clearInterval(this.questionTimeoutID);
      this.props.history.push('/');
    }
  };

  componentDidUpdate() {
    window.onpopstate = e => {
      clearTimeout(this.showHintTimeoutID);
      clearInterval(this.questionTimeoutID);
    };
  }

  handleQuestion = question => {
    let currentQuestionTopicId = question.topic;
    let allArticles = JSON.parse(localStorage.getItem('allArticles'));
    let topic = allArticles.filter(topic => {
      return topic.topicid === currentQuestionTopicId;
    });
    topic = topic[0];
    this.setState(
      {
        isHintSeen: false,
        question: question,
        showArticlePopup: false,
        currentQuestionTopic: topic,
        currentQuestionArticleId: topic._id,
        currentQuestionSubject: topic.subject,
        currentQuestionTopicId: topic.topicid,
        currentQuestionTopicName: topic.topicname,
        currentQuestionTopicArticle: topic.article,
        currentQuestionTopicImagePath: topic.article.image,
        currentQuestionTopicThumbnailImagePath: topic.article.thumbnail
      },
      () => {
        window.scrollTo(0, 0);
        let height = document.getElementById('questions_option_section')
          .clientHeight;

        document.getElementById(
          'overall_wrap'
        ).style.paddingBottom = `${height}px`;
        this.questionTimeoutID = this.startQuestionTimer(1);
      }
    );

    this.showHintTimeoutID = this.showHint();
  };

  handleNextQuestion = () => {
    clearTimeout(this.showHintTimeoutID);

    let currentQuestionIndex = this.state.currentQuestionIndex + 1;
    let questionsLength = this.state.questions.length;
    let questionProgress = 100 / questionsLength;

    if (currentQuestionIndex === questionsLength) {
      this.postAnswersAndRedirect('/end-practice');
      return;
    }

    this.setState({
      isAddedToReadingList: false,
      addToReadingListMsg: 'Processing...'
    });

    this.handleQuestion(this.state.questions[currentQuestionIndex]);
    this.setState({
      currentQuestionIndex: currentQuestionIndex,
      questionProgress: this.state.questionProgress + questionProgress
    });
  };

  postAnswersAndRedirect = endPoint => {
    clearTimeout(this.showHintTimeoutID);
    clearInterval(this.questionTimeoutID);

    let requestBody = {
      score: this.state.totalCorrectAnswer,
      total: this.state.totalAttemptedQuestions,
      answers: this.state.answers
    };

    AppUtility.postAnswers(
      requestBody,
      'practice',
      response => {
        if (endPoint) {
          this.props.history.push({
            pathname: endPoint,
            state: {
              score: this.state.totalCorrectAnswer,
              total: this.state.questions.length,
              data: response.data
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

  startQuestionTimer = i =>
    setInterval(() => {
      i++;
      this.setState({
        timeTakenToAnswer: i
      });
    }, 1000);

  selectOption = option => {
    clearTimeout(this.showHintTimeoutID);

    let isCorrectAnswer = false;
    let isInCorrectAnswer = false;
    let selectedAnswerId = null;
    let {
      q_id,
      duration,
      topic: topic_id,
      options,
      justification
    } = this.state.question;

    for (var i = 0; i < options.length; i++) {
      if (options[i].correct) {
        this.setState({ correctOption: options[i].value });
        break;
      }
    }

    if (option && option.correct) {
      this.setState({
        totalCorrectAnswer: this.state.totalCorrectAnswer + 1
      });
      isCorrectAnswer = true;
    } else {
      isInCorrectAnswer = true;
    }

    // isCorrect, byUser
    this.addToReadingList(isCorrectAnswer, false);

    if (option) {
      selectedAnswerId = option.id;
    }

    clearInterval(this.questionTimeoutID);

    let answer = {
      question_id: String(q_id),
      duration: duration,
      topic_id: topic_id,
      correct: isCorrectAnswer,
      answer_id: selectedAnswerId,
      hint_used: this.state.isHintSeen,
      time_taken: this.state.timeTakenToAnswer,
      subject_id: this.state.currentQuestionSubject
    };

    let answers = this.state.answers.concat(answer);

    this.setState({
      totalAttemptedQuestions: this.state.totalAttemptedQuestions + 1,
      answers: answers,
      justification: justification.data,
      isCorrectAnswer: isCorrectAnswer,
      isInCorrectAnswer: isInCorrectAnswer,
      showHint: false
    });

    let isHintNotSeen = this.state.isHintSeen ? 0 : 1;
    let isHintSeen = this.state.isHintSeen ? 1 : 0;
    let isIncorrectAnswers = isInCorrectAnswer ? 1 : 0;

    // number of correct answers without using hint
    // number of correct answers using hint
    // is incorrect answers
    AppUtility.calculatePointsForAQuestion(
      'practice',
      isHintNotSeen,
      isHintSeen,
      isIncorrectAnswers,
      currentQuestionPoints => {
        this.setState({
          currentQuestionPoints: currentQuestionPoints,
          showArticlePopup: true
        });
      }
    );
  };

  getQuestions = () => {
    // count=10&tags=customer_service,agile_software_development&source=colearn

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

  initializeReactGA = () => {
    AppUtility.initializeReactGA('practice-question');
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
              onClick={this.quitPractice}
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
            {/* Hint Section Starts */}
            <div
              className="hint-wrapper"
              style={
                this.state.question &&
                (this.state.showHint && this.state.question.hint
                  ? { visibility: 'visible' }
                  : { visibility: 'hidden' })
              }
            >
              <p>Need help?</p>
              <div
                onClick={this.showHintPopup}
                className="hint-content-wrapper cursor-pointer"
              >
                <img src={bulb} alt="" />
                <h3>Hint</h3>
              </div>
            </div>
            {/* Hint Section Ends */}

            <div className="questions-option-wrap">
              <p className="text-center">
                {this.state.question &&
                this.state.question.input_type === 'fb-exm'
                  ? 'Fill in the blanks:'
                  : this.state.question &&
                    this.state.question.input_type === 'hotspot-circle'
                  ? 'Click on a diagram area to select an answer.'
                  : 'Select an option:'}
              </p>
              {this.state.question &&
              this.state.question.input_type === 'mcq' ? (
                <div className="answers-wrap">
                  {this.state.question &&
                    this.state.question.options.map(option => (
                      <div
                        key={option.id}
                        className={`options cursor-pointer ${
                          option.image ? 'imageCont' : ''
                        }`}
                        onClick={() => this.selectOption(option)}
                      >
                        <p className={`${option.image ? 'option-image' : ''}`}>
                          {option.image ? (
                            <ResourseHandler
                              resizeWindow={this.resizeWindow}
                              isImageSrc={true}
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
                      placeholder="Type your answer here..."
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
            this.state.isViewPost
              ? { display: 'block', zIndex: 99 }
              : { display: 'none' }
          }
        >
          <div className="popup-wrap ">
            <div className="popup-content-wrap readinglist-pop">
              {this.state.isViewPost && (
                <Post
                  post={this.state.currentPost}
                  article={this.state.currentArticle}
                  hidePost={this.hidePost}
                  subject={this.state.question.subject}
                />
              )}
            </div>
          </div>
        </div>

        <div
          className="ovarlay exit-ovarlay"
          style={
            this.state.showHintPopup || this.state.showExitPopup
              ? { display: 'block' }
              : { display: 'none' }
          }
        >
          {/* Hint Popup */}
          <div className="popup-wrap">
            <div className="popup-content-wrap">
              <div
                className="hint-pop-wrap"
                style={
                  this.state.showHintPopup
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                <img
                  src={close}
                  alt="close-icon"
                  onClick={this.hideHintPopup}
                  className="cursor-pointer"
                />
                <div className="popup-hint-content">
                  <h2>Hint</h2>
                  {this.state.question && <p>{this.state.question.hint}</p>}
                </div>
              </div>

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
                    onClick={this.exitPractice}
                    className="cursor-pointer"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="ovarlay"
          style={
            this.state.showArticlePopup
              ? { display: 'block' }
              : { display: 'none' }
          }
        >
          {/*Correct and InCorrect Answer Heading */}
          <div
            className="correct-answers-wrap"
            style={
              this.state.showArticlePopup
                ? { display: 'block' }
                : { display: 'none' }
            }
          >
            <div className="correct-wrap">
              <div className="tick">
                <div
                  className="tick-title"
                  style={
                    this.state.isInCorrectAnswer
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
                    this.state.isCorrectAnswer
                      ? { display: 'block' }
                      : { display: 'none' }
                  }
                >
                  <img src={tick} alt="" />
                  <h3>Correct</h3>
                </div>

                {this.state.currentQuestionPoints && (
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
                  className="review-topic cursor-pointer"
                  onClick={() =>
                    this.viewPost(
                      this.state.currentQuestionTopic,
                      this.state.currentQuestionTopicArticle
                    )
                  }
                >
                  <span className="img-wrap-ans">
                    {this.state.currentQuestionTopicThumbnailImagePath && (
                      <ResourseHandler
                        isImageSrc={true}
                        imageUrl={
                          this.state.currentQuestionTopicThumbnailImagePath
                        }
                      />
                    )}
                    <img src={eye} alt="" className="eye" />
                  </span>
                  <div className="reviw-content">
                    <h6>Review topic:</h6>
                    {this.state.currentQuestionTopicName && (
                      <h4>{this.state.currentQuestionTopicName}</h4>
                    )}
                  </div>
                </div>

                <div
                  className={
                    this.state.isAddedToReadingList
                      ? 'reading-list cursor-not-allowed redinglist-clicked'
                      : 'reading-list cursor-pointer'
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

                {/* {this.state.isHintSeen &&
                  (this.state.isInCorrectAnswer && (
                    <div className="listening-section">
                      <input type="text" placeholder="Ask Anything" />
                      <img src={mic} alt="" />
                    </div>
                  ))} */}
              </div>
              <button onClick={this.handleNextQuestion} className="next-button">
                Next question
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Question;
