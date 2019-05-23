import React, { Component } from 'react';
import './readingList.scss';
import arrow from '../assets/images/svg/back-white.svg';
import toastr from 'toastr';
import { Link } from 'react-router-dom';
import Post from './post/PostComponent';
import ResourseHandler from '../global-components/ResourseHandlerComponent';
import AppUtility from '../utility/AppUtility';
import ArticleListComponent from './article-list/ArticleListComponent';
import sortByAsc from '../assets/images/svg/sort-by-attributes-interface-button-option.svg';
import sortByDesc from '../assets/images/svg/sort-by-attributes.svg';
import _ from 'lodash';

class ReadingList extends Component {
  constructor(props) {
    super(props);
    this.readingList = [];
    this._isMounted = false;

    this.state = {
      subjectName: '',
      subjectNames: [],
      readingList: [],
      readingListLength: null,
      reviewedListLenght: null,
      averagegAge: null,
      currentPost: null,
      currentArticle: null,
      viewPost: false,
      hideReadingListalert: false,
      searchQuery: '',
      sort: 'desc'
    };
  }

  initializeReactGA = () => {
    AppUtility.initializeReactGA('reading-list');
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
          currentPost: post,
          currentArticle: article,
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

  changeSort = () => {
    if (this.state.sort === 'asc') {
      let result = _.orderBy(this.readingList, ['createdAt'], ['desc']);
      this._isMounted &&
        this.setState({
          sort: 'desc',
          subjectName: '',
          readingList: result
        });
    } else {
      let result = _.orderBy(this.readingList, ['createdAt'], ['asc']);
      this._isMounted &&
        this.setState({
          sort: 'asc',
          subjectName: '',
          readingList: result
        });
    }
  };

  searchReadingList = e => {
    if (this.state.readingListLength < 1 || !this.state.readingListLength) {
      return;
    }
    this._isMounted &&
      this.setState(
        {
          searchQuery: e.target.value
        },
        () => {
          const result = this.readingList.filter(readingListIteam => {
            if (
              readingListIteam.topicname
                .toLowerCase()
                .includes(this.state.searchQuery.toLowerCase()) ||
              readingListIteam.subjectname
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
              readingList: result
            });
        }
      );
  };

  onSubjectChanged = e => {
    this._isMounted &&
      this.setState(
        {
          subjectName: e.target.value
        },
        () => {
          const result = this.readingList.filter(readingListIteam => {
            if (readingListIteam.subjectname.includes(this.state.subjectName)) {
              return true;
            }
            return false;
          });

          this._isMounted &&
            this.setState({
              searchQuery: '',
              sort: 'desc',
              readingList: result
            });
        }
      );
  };

  getReadingList = () => {
    AppUtility.getReadingList(
      'unreviewed',
      response => {
        this._isMounted &&
          this.setState({
            reviewedListLenght: response.data.reviewedCount,
            readingList: _.orderBy(
              response.data.readingList,
              ['createdAt'],
              ['desc']
            ),
            averagegAge: response.data.averagegAge,
            readingListLength: response.data.readingList.length
          });
        this.readingList = _.orderBy(
          response.data.readingList,
          ['createdAt'],
          ['desc']
        );

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
                  this.state.readingListLength
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
                Review list
              </h2>

              <div
                className="average-age"
                style={
                  this.state.readingListLength
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                <p>
                  You have {this.state.readingListLength}
                  {this.state.readingListLength > 1 ? ` items ` : ` item `}
                  in your review list.
                </p>
                <p>
                  The average age of your review list
                  {this.state.readingListLength > 1 ? ` items ` : ` item `} is
                  {this.state.averagegAge > 1
                    ? ` ${this.state.averagegAge} days`
                    : ` ${this.state.averagegAge} day`}
                  .
                </p>
              </div>

              <div
                className="average-age"
                style={
                  this.state.reviewedListLenght === 0 &&
                  this.state.readingListLength === 0
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                <p>
                  You have no entries in your review list yet. Answer questions
                  in challenge or practice mode to add items to your review list
                </p>
              </div>

              <div
                className="average-age"
                style={
                  this.state.reviewedListLenght > 0 &&
                  this.state.readingListLength === 0
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                <p>
                  You have reviewed all entries in your review list! Well done!
                  Answer more questions in challenge or practice mode to add new
                  items to your review list.
                </p>
              </div>

              {this.state.readingList && this.state.readingList[0] && (
                <ResourseHandler
                  isBgImage={true}
                  className="customer-service-wrap cursor-pointer"
                  onClick={() =>
                    this.viewPost(
                      this.state.readingList[0],
                      this.state.readingList[0].articleData.article
                    )
                  }
                  imageUrl={this.state.readingList[0].articleData.article.image}
                >
                  <div className="service-content">
                    <button to="#" className="reading-btn">
                      {this.state.readingList[0].subjectname}
                    </button>
                    <h5 className="customer-title">
                      {this.state.readingList[0].articleData.article.title}
                    </h5>
                    <p className="mins">
                      Added: <span>{this.state.readingList[0].addedOn}</span>
                    </p>
                  </div>
                </ResourseHandler>
              )}

              <div className="reading-categories">
                {this.state.readingList && this.state.readingList[0] && (
                  <ArticleListComponent
                    viewPost={this.viewPost}
                    list={this.state.readingList.slice(1)}
                  />
                )}
              </div>

              {this.state.reviewedListLenght > 0 && (
                <Link
                  to="/reviewed-items"
                  className="reviewed-reading-list-link"
                >
                  Reviewed Items
                </Link>
              )}
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

export default ReadingList;
