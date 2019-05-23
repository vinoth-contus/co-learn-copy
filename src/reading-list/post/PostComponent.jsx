import React, { Component } from 'react';
import './post.scss';
import backarrow from '../../assets/images/svg/back-white.svg';
import info from '../../assets/images/svg/info.svg';
import plus from '../../assets/images/svg/plus-green.svg';
import close from '../../assets/images/svg/close-white.svg';
import ResourseHandler from '../../global-components/ResourseHandlerComponent';
import toastr from 'toastr';
import PostAction from './PostAction';
import AppUtility from '../../utility/AppUtility';

class Post extends Component {
  constructor(props) {
    super(props);
    this.timeoutID = null;
    this.state = {
      addedOn: '',
      isArticleAddedToThisUser: false,
      isReviewed: false,
      reviewedAt: '',
      isTimerRunning: true,
      readTime: '',
      showTooltip: false,
      pointsEarned: 0
    };
  }

  toggleTooltip = () => {
    this.setState({
      showTooltip: !this.state.showTooltip
    });
  };

  initializeReactGA = () => {
    AppUtility.initializeReactGA('single-article');
  };

  componentDidMount() {
    this.initializeReactGA();
    if (this.props.refreshReadingList) {
      this.setState({
        isArticleAddedToThisUser: true,
        addedOn: this.props.post.addedOn,
        isReviewed: this.props.post.reviewed,
        reviewedAt: this.props.post.reviewedAt
      });

      if (this.props.post.reviewedAt) {
        clearTimeout(this.timeoutID);
        this.setState({
          isTimerRunning: false
        });
      }
    } else {
      this.checkArticleIsAddedToThisUser();
    }
  }

  getNumberOfWords = textLength => {
    let time = textLength / process.env.REACT_APP_WORDS_PER_SEC;
    this.timeoutID = this.startTimer(time * 1000); // (sec * 1000) to millisecond
    this.setState({
      readTime: Math.ceil(time / 60) // (sec / 60) to min
    });
  };

  startTimer = time =>
    setTimeout(() => {
      this.setState({
        isTimerRunning: false
      });
    }, time);

  checkArticleIsAddedToThisUser = () => {
    let topicId = this.props.post.topicid;
    let articleId = this.props.post._id;

    PostAction.checkArticleIsAddedToThisUser(
      topicId,
      articleId,
      response => {
        let { data } = response;
        this.setState({
          isArticleAddedToThisUser: data.added,
          addedOn: data.addedOn,
          isReviewed: data.reviewed,
          reviewedAt: data.reviewedAt
        });

        if (data.reviewedAt) {
          clearTimeout(this.timeoutID);
          this.setState({
            isTimerRunning: false
          });
        }
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

  markAsReviewedOrUnReviewed = () => {
    if (this.state.isTimerRunning) {
      return;
    }

    let topicId = null;
    let articleId = null;

    if (this.props.refreshReadingList) {
      topicId = this.props.post.topic_id;
      articleId = this.props.post.articleData._id;
    } else {
      topicId = this.props.post.topicid;
      articleId = this.props.post._id;
    }

    let reviewed = !this.state.isReviewed;

    PostAction.markAsReviewedOrUnReviewed(
      topicId,
      articleId,
      reviewed,
      response => {
        let pointsEarned = 0;
        if (response && response.data && response.data.pointsEarned) {
          pointsEarned = response.data.pointsEarned;
        }

        this.setState({
          pointsEarned: pointsEarned,
          isReviewed: !this.state.isReviewed
        });
        if (this.props.refreshReadingList) {
          this.props.refreshReadingList();
        }
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

  hidePost = () => {
    clearTimeout(this.timeoutID);
    this.props.hidePost();
  };

  componentDidUpdate() {
    window.onpopstate = e => {
      clearTimeout(this.timeoutID);
    };
  }

  render() {
    return (
      <main className="overall-wrap reading-list-reviewed">
        <ResourseHandler
          isBgImage={true}
          className="reviewed-header"
          imageUrl={this.props.article.image}
        >
          <div className="for-blac-overlay" />
          <div className="hedaer-tool">
            <div className="cursor-pointer padding-8" onClick={this.hidePost}>
              {this.props.refreshReadingList ? (
                <img src={backarrow} alt="Page-Back cursor-pointer" />
              ) : (
                <img src={close} alt="Page-Back cursor-pointer" />
              )}
            </div>
            <div className="reviewed-count-section">
              {this.state.isArticleAddedToThisUser &&
                this.state.isTimerRunning && (
                  <div className="info-wrap">
                    <img
                      src={info}
                      alt=""
                      className="info-icon"
                      onClick={this.toggleTooltip}
                    />

                    {this.state.showTooltip && (
                      <div className="tooltip">
                        <div className="tootltip-wrap">
                          Make sure to spend enough time reviewing the item
                          before marking it as reviewed.
                        </div>
                        <div className="pointer-arrow" />
                      </div>
                    )}
                  </div>
                )}

              {this.state.pointsEarned ? (
                <div className="mark-reviewed-count">
                  <img src={plus} alt="count-increase" />
                  <span className="reviewd-count-rate">
                    {this.state.pointsEarned}
                    {this.state.pointsEarned > 1 ? ' Points' : ' Point'}
                  </span>
                </div>
              ) : (
                ''
              )}

              {this.state.isArticleAddedToThisUser && (
                <button
                  className={
                    this.state.isReviewed
                      ? 'reviewed-status reviewed-active'
                      : 'reviewed-status'
                  }
                  id={this.state.isTimerRunning ? 'timer_running' : ''}
                  onClick={this.markAsReviewedOrUnReviewed}
                >
                  {this.state.isReviewed ? 'Reviewed' : 'Mark as reviewed'}

                  <svg
                    width="19px"
                    height="11px"
                    viewBox="0 0 19 11"
                    version="1.1"
                  >
                    <g
                      id="Assets"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        transform="translate(-283.000000, -376.000000)"
                        fill="#FFFFFF"
                        id="icon_markasreviewed_white"
                      >
                        <path d="M296.773913,377.076923 L295.678261,376 L290.747826,380.846154 L291.843478,381.923077 L296.773913,377.076923 L296.773913,377.076923 Z M300.06087,376 L291.843478,384.153846 L288.556522,380.923077 L287.46087,382 L291.843478,386.307692 L301.234783,377.076923 L300.06087,376 L300.06087,376 Z M283,382 L287.382609,386.307692 L288.478261,385.230769 L284.095652,380.923077 L283,382 L283,382 Z" />
                      </g>
                    </g>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </ResourseHandler>
        <section className="reviewed-content-body-wrap">
          <div className="reviewed-content-wrapper">
            <div className="reviewed-content-header">
              {this.props.subject ? (
                <p className="link-title">{this.props.subject}</p>
              ) : (
                <p className="link-title">{this.props.post.subjectname}</p>
              )}

              <h4 className="main-title">{this.props.post.topicname}</h4>
              {this.state.addedOn && (
                <h6 className="minus">
                  Added: <span>{this.state.addedOn}</span>
                  {this.state.readTime && (
                    <span className="dynamic-minutes">
                      - {this.state.readTime} min. read
                    </span>
                  )}
                </h6>
              )}
            </div>
            <div className="readinglist-content">
              <ResourseHandler
                getNumberOfWords={this.getNumberOfWords}
                htmlPageUrl={this.props.article.url}
              />
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Post;
