import React, { Component } from 'react';
import './reviewedReadingList.scss';
import '../readingList.scss';
import arrow from '../../assets/images/svg/back-white.svg';
import toastr from 'toastr';
import { Link } from 'react-router-dom';
import ResourseHandler from '../../global-components/ResourseHandlerComponent';
import Post from '../post/PostComponent';

import sortByAsc from '../../assets/images/svg/sort-by-attributes-interface-button-option.svg';
import sortByDesc from '../../assets/images/svg/sort-by-attributes.svg';
import _ from 'lodash';

import AppUtility from '../../utility/AppUtility';
import ArticleListComponent from '../article-list/ArticleListComponent';

class ReviewedReadingList extends Component {
  constructor(props) {
    super(props);
    this.reviewedList = [];
    this.state = {
      reviewedList: [],
      subjectName: '',
      subjectNames: [],
      reviewedListLenght: null,
      currentPost: null,
      viewPost: false,
      currentArticle: null,
      hideReadingListalert: false,
      searchQuery: '',
      sort: 'desc'
    };
  }

  initializeReactGA = () => {
    AppUtility.initializeReactGA('reviewed-items');
  };

  changeSort = () => {
    if (this.state.sort === 'asc') {
      let result = _.orderBy(this.reviewedList, ['createdAt'], ['desc']);
      this._isMounted &&
        this.setState({
          sort: 'desc',
          reviewedList: result,
          subjectName: ''
        });
    } else {
      let result = _.orderBy(this.reviewedList, ['createdAt'], ['asc']);
      this._isMounted &&
        this.setState({
          sort: 'asc',
          subjectName: '',
          reviewedList: result
        });
    }
  };

  searchReadingList = e => {
    if (this.state.reviewedListLenght < 1 || !this.state.reviewedListLenght) {
      return;
    }
    this._isMounted &&
      this.setState(
        {
          searchQuery: e.target.value
        },
        () => {
          const result = this.reviewedList.filter(reviewedListIteam => {
            if (
              reviewedListIteam.topicname
                .toLowerCase()
                .includes(this.state.searchQuery.toLowerCase()) ||
              reviewedListIteam.subjectname
                .toLowerCase()
                .includes(this.state.searchQuery.toLowerCase())
            ) {
              return true;
            }
            return false;
          });

          this._isMounted &&
            this.setState({
              subjectName: '',
              sort: 'desc',
              reviewedList: result
            });
        }
      );
  };

  componentDidMount() {
    this._isMounted = true;

    this.initializeReactGA();
    this.getReadingList();

    setTimeout(() => {
      this._isMounted &&
        this.setState({
          hideReadingListalert: true
        });
    }, 10000);
  }

  refreshReadingList = () => {
    this.getReadingList();
  };

  viewPost = (post, article) => {
    this._isMounted &&
      this.setState(
        {
          currentArticle: article,
          currentPost: post,
          viewPost: true
        },
        () => {
          document.body.style.overflow = 'hidden';
        }
      );
  };

  componentWillUnmount() {
    this._isMounted = false;

    document.body.style.overflow = 'unset';
  }

  hidePost = () => {
    this._isMounted &&
      this.setState(
        {
          viewPost: false
        },
        () => {
          document.body.style.overflow = 'unset';
        }
      );
  };

  getReadingList() {
    AppUtility.getReadingList(
      'reviewed',
      response => {
        this.reviewedList = _.orderBy(
          response.data.readingList,
          ['createdAt'],
          ['desc']
        );
        this._isMounted &&
          this.setState({
            reviewedListLenght: response.data.readingList.length,

            reviewedList: _.orderBy(
              response.data.readingList,
              ['createdAt'],
              ['desc']
            )
          });

        let uniqSubjectNameObject = _.uniqBy(
          response.data.readingList,
          'subjectname'
        );
        this._isMounted &&
          this.setState({
            subjectNames: _.map(uniqSubjectNameObject, 'subjectname')
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
  }

  onSubjectChanged = e => {
    this._isMounted &&
      this.setState(
        {
          subjectName: e.target.value
        },
        () => {
          const result = this.reviewedList.filter(iteam => {
            if (iteam.subjectname.includes(this.state.subjectName)) {
              return true;
            }
            return false;
          });

          this._isMounted &&
            this.setState({
              subjectName: '',
              sort: 'desc',
              searchQuery: '',
              reviewedList: result
            });
        }
      );
  };

  render() {
    return (
      <React.Fragment>
        <main className="overall-wrap reading-list">
          <div
            className="reading-alert"
            style={
              this.state.hideReadingListalert
                ? { display: 'none' }
                : { display: 'block' }
            }
          >
            <p>
              Remember: Review items in the list regularly to increase your
              chances of answering questions correctly and to score points.
            </p>
          </div>
          <section className="main-content">
            <Link to="/" className="back-button">
              <img src={arrow} alt="page-back" />
            </Link>
            <div className="reading-list-content">
              <div
                className="tool-bar"
                style={
                  this.state.reviewedListLenght
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                <div className="left-cont">
                  <input
                    onChange={this.searchReadingList}
                    type="text"
                    name="search"
                    placeholder="Search"
                    value={this.state.searchQuery}
                    autoComplete="off"
                  />
                  <span />
                </div>
                <div className="right-cont">
                  <span>
                    Skill:{' '}
                    <strong>
                      <select
                        value={this.state.subjectName}
                        onChange={this.onSubjectChanged}
                      >
                        <option value="">All</option>
                        <SubjectOptions options={this.state.subjectNames} />
                      </select>
                    </strong>
                  </span>
                  <span>
                    Sort by:{' '}
                    <b style={{ fontFamily: 'OpenSans-SemiBold' }}>
                      {' '}
                      Added Date
                    </b>
                    <img
                      onClick={this.changeSort}
                      src={this.state.sort === 'asc' ? sortByAsc : sortByDesc}
                      className="sort-image"
                      alt=""
                    />
                  </span>
                </div>
              </div>
              <br />
              <br />
              <h2 className="reading-hedaing">
                <span>My</span>
                Reviewed Items
              </h2>

              <div
                className="average-age"
                style={
                  this.state.reviewedListLenght
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                <p>
                  You have {this.state.reviewedListLenght}
                  {this.state.reviewedListLenght > 1 ? ` items ` : ` item `}
                  in your reviewed items list.
                </p>
              </div>

              <div
                className="average-age"
                style={
                  this.state.reviewedListLenght === 0
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                <p>You have no entries in your reviewed list yet.</p>
              </div>

              {this.state.reviewedList && this.state.reviewedList[0] && (
                <ResourseHandler
                  isBgImage={true}
                  className="customer-service-wrap cursor-pointer"
                  onClick={() =>
                    this.viewPost(
                      this.state.reviewedList[0],
                      this.state.reviewedList[0].articleData.article
                    )
                  }
                  imageUrl={
                    this.state.reviewedList[0].articleData.article.image
                  }
                >
                  <div className="service-content">
                    <button to="#" className="reading-btn">
                      {this.state.reviewedList[0].subjectname}
                    </button>
                    <h5 className="customer-title">
                      {this.state.reviewedList[0].articleData.article.title}
                    </h5>
                    <p className="mins">
                      Added: <span>{this.state.reviewedList[0].addedOn}</span>
                    </p>
                  </div>
                </ResourseHandler>
              )}

              <div className="reading-categories">
                {this.state.reviewedList && this.state.reviewedList[0] && (
                  <ArticleListComponent
                    viewPost={this.viewPost}
                    list={this.state.reviewedList.slice(1)}
                  />
                )}
              </div>

              <Link to="/review-list" className="reading-list-link">
                Review List
              </Link>
            </div>
          </section>
        </main>

        <div
          className="ovarlay"
          style={
            this.state.viewPost
              ? { display: 'block', zIndex: 99 }
              : { display: 'none' }
          }
        >
          <div className="popup-wrap ">
            <div className="popup-content-wrap readinglist-pop">
              {this.state.viewPost && (
                <Post
                  post={this.state.currentPost}
                  article={this.state.currentArticle}
                  hidePost={this.hidePost}
                  refreshReadingList={this.refreshReadingList}
                />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function SubjectOptions(props) {
  const options = props.options;

  if (!options) {
    return <option />;
  }
  const optionsDiv = options.map((option, index) => (
    <option key={index} value={option}>
      {option}
    </option>
  ));
  return optionsDiv;
}
export default ReviewedReadingList;
