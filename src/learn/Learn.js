import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import close from '../assets/images/svg/close-grey.svg';
import downarrow from '../assets/images/downarrow.png';
import uparrow from '../assets/images/drop-up-arrow.png';
import learn from '../assets/images/learn.png';
import AppUtility from '../utility/AppUtility';

import './learn.scss';
import LearnIteam from './learn-iteam/LearnIteamComponent';
import ResourseHandler from '../global-components/ResourseHandlerComponent';
import _ from 'lodash';

class Learn extends Component {
  constructor(props) {
    super(props);
    this.data = _.orderBy(
      [
        {
          title: 'Influencing and Persuading',
          brief: 'Module 1 - Influencing Others and Rapport',
          progress: '100%',
          posted: 'Completed: 15 days ago',
          image: '/learn-course/images/module-1.jpeg',
          favorite: 'FALSE',
          link: '/learn-course/module-1/',
          startedAt: '2019-05-02T10:11:45.301Z',
          startedOn: '5 days ago'
        },
        {
          title: 'Influencing and Persuading',
          brief: 'Module 2 - Influencing Skills and Collaboration',
          progress: '100%',
          posted: 'Completed: 7 days ago',
          image: '/learn-course/images/module-2.jpeg',
          favorite: 'FALSE',
          link: '/learn-course/module-2/',
          startedAt: '2019-05-02T10:11:45.301Z',
          startedOn: '5 days ago'
        },
        {
          title: 'Influencing and Persuading',
          brief: 'Module 3 - Influencing in Diversity',
          progress: '67%',
          posted: 'Started: 23 days ago',
          image: '/learn-course/images/module-3.jpeg',
          favorite: 'FALSE',
          link: '/learn-course/module-3/',
          startedAt: '2019-10-02T10:11:45.301Z',
          startedOn: '5 days ago'
        },
        {
          title: 'Influencing and Persuading',
          brief: 'Module 4 - Establish a Network of Influence',
          progress: '23%',
          posted: 'Started: 15 days ago',
          image: '/learn-course/images/module-4.jpeg',
          favorite: 'FALSE',
          link: '/learn-course/module-4/',
          startedAt: '2019-05-02T10:11:45.301Z',
          startedOn: '5 days ago'
        },
        {
          title: 'Management',
          brief: 'Time Management',
          progress: '0%',
          posted: 'Not started yet',
          image: '/learn-course/images/time-management.jpg',
          favorite: 'FALSE',
          link: '/learn-course/time-management/',
          startedAt: '2019-05-02T10:11:45.301Z',
          startedOn: '5 days ago'
        },
        {
          title: 'Communication',
          brief: 'Telephone Communication',
          progress: '0%',
          posted: 'Not started yet',
          image: '/learn-course/images/telephone-communication.jpeg',
          favorite: 'FALSE',
          link: '/learn-course/telephone-communication/',
          startedAt: '2019-05-02T10:11:45.301Z',
          startedOn: '5 days ago'
        },
        {
          title: 'Communication',
          brief: 'Nonverbal Communication',
          progress: '0%',
          posted: 'Not started yet',
          image: '/learn-course/images/nonverbal-communication.jpg',
          favorite: 'FALSE',
          link: '/learn-course/nonverbal-communication/',
          startedAt: '2019-15-02T10:11:45.301Z',
          startedOn: '5 days ago'
        },
        {
          title: 'Communication',
          brief: 'Business Writing',
          progress: '0%',
          posted: 'Not started yet',
          image: '/learn-course/images/business-writing.jpg',
          favorite: 'FALSE',
          link: '/learn-course/business-writing/',
          startedAt: '2019-05-02T10:11:45.301Z',
          startedOn: '5 days ago'
        }
      ],
      ['title'],
      ['asc']
    );

    this.state = {
      skill: '',
      category: '',
      searchQuery: '',
      sort: 'desc',
      viewLearningIteam: false,
      data: this.data
    };
  }

  initializeReactGA = () => {
    AppUtility.initializeReactGA('learn');
  };

  componentDidMount() {
    this.initializeReactGA();

    let uniqTitleNameObject = _.uniqBy(this.data, 'title');
    this.setState({
      titleNames: _.map(uniqTitleNameObject, 'title')
    });
  }

  changeSort = () => {
    if (this.state.sort === 'desc') {
      let result = _.orderBy(this.data, ['title'], ['desc']);
      this.setState({
        searchQuery: '',
        category: '',
        sort: 'asc',
        skill: '',
        data: result
      });
    } else {
      let result = _.orderBy(this.data, ['title'], ['asc']);
      this.setState({
        searchQuery: '',
        category: '',
        sort: 'desc',
        skill: '',
        data: result
      });
    }
  };

  handleSkillChange = e => {
    this.setState(
      {
        skill: e.target.value
      },
      () => {
        const result = this.data.filter(iteam => {
          if (
            iteam.title.toLowerCase().includes(this.state.skill.toLowerCase())
          ) {
            return true;
          }
          return false;
        });

        this.setState({
          searchQuery: '',
          sort: 'desc',
          data: result
        });
      }
    );
  };

  // handleCategoryChange = e => {
  //   this.setState(
  //     {
  //       searchQuery: '',
  //       sort: 'desc',
  //       category: e.target.value
  //     },
  //     () => {
  //       const result = this.data.filter(value => {
  //         if (
  //           value.posted
  //             .toLowerCase()
  //             .includes(this.state.category.toLowerCase())
  //         ) {
  //           return true;
  //         }
  //         return false;
  //       });

  //       this.setState({
  //         data: result
  //       });
  //     }
  //   );
  // };

  searchReadingList = e => {
    if (!this.data || this.data.length < 1) {
      return;
    }
    this.setState(
      {
        searchQuery: e.target.value,
        sort: 'desc',
        skill: '',
        category: ''
      },
      () => {
        const result = this.data.filter(value => {
          if (
            value.title
              .toLowerCase()
              .includes(this.state.searchQuery.toLowerCase()) ||
            value.brief
              .toLowerCase()
              .includes(this.state.searchQuery.toLowerCase())
          ) {
            return true;
          }
          return false;
        });

        this.setState({
          data: result
        });
      }
    );
  };

  viewLearningIteam = url => {
    this.setState(
      {
        url: url,
        viewLearningIteam: true
      },
      () => {
        document.body.style.overflow = 'hidden';
      }
    );
  };

  componentWillUnmount() {
    document.body.style.overflow = 'unset';
  }

  hideLearningIteam = () => {
    this.setState(
      {
        viewLearningIteam: false
      },
      () => {
        document.body.style.overflow = 'unset';
      }
    );
  };

  render() {
    const datarep = this.state.data.map((lesson, index) => {
      return (
        <li key={index}>
          <span
            className="img-cont"
            onClick={() => this.viewLearningIteam(lesson.link)}
          >
            <ResourseHandler
              alt={lesson.title}
              title={lesson.title}
              isImageSrc={true}
              imageUrl={lesson.image}
            />
            {/* <i className={`star ${lesson.favorite ? 'active' : ''}`} /> */}
            {/* {lesson.progress !== '100%' && (
              <span className="progress-bar">
                <span className="progress-level">
                  <span
                    className="progress-area"
                    style={{ width: lesson.progress }}
                  />
                </span>
              </span>
            )} */}
            {/* {lesson.progress === '100%' && (
              <span className="completed">
                <em /> Completed
              </span>
            )} */}
          </span>

          <div className="content-box">
            <Link onClick={() => this.viewLearningIteam(lesson.link)} to="#">
              <span className="title">{lesson.title}</span>
            </Link>
            <span className="content">{lesson.brief}</span>
            {/* <span className="posted">{lesson.posted}</span> */}
          </div>
        </li>
      );
    });
    return (
      <React.Fragment>
        <main className="overall-wrap practice-page" id="max-width-halfthird">
          <div className="header-section">
            <Link to="/" className="close-grey">
              <img src={close} alt="Close-icon" />
            </Link>
          </div>
          <section className="body-section">
            <div className="wrapper">
              <div className="dumbells">
                <img src={learn} alt="Learn" />
              </div>

              <div className="practice-cotent">
                <div className="category-title">
                  <div className="category-bor skill-title">
                    <h2>Learn</h2>
                  </div>
                </div>

                <div className="tool-bar">
                  <div className="left-cont">
                    <input
                      onChange={this.searchReadingList}
                      type="text"
                      autoComplete="off"
                      name="search"
                      placeholder="Search"
                      value={this.state.searchQuery}
                    />
                    <span />
                  </div>
                  <div className="right-cont">
                    {/* <span>
                      View:{' '}
                      <strong>
                        <select
                          value={this.state.category}
                          onChange={this.handleCategoryChange}
                        >
                          <option value="">All</option>
                          <option value="completed">Completed</option>
                          <option value="not started yet">Not Started</option>
                          <option value="started:">In-Progress</option>
                        </select>
                      </strong>
                    </span> */}

                    <span>
                      Skill:{' '}
                      <strong>
                        <select
                          id="learning_skills"
                          value={this.state.skill}
                          onChange={this.handleSkillChange}
                        >
                          <option value="">All</option>
                          <TitleOptions options={this.state.titleNames} />
                        </select>
                      </strong>
                    </span>
                    <span>
                      Sort by:{' '}
                      <strong>
                        Alphabetically{' '}
                        <img
                          onClick={this.changeSort}
                          src={this.state.sort === 'asc' ? uparrow : downarrow}
                          className="sort-image"
                          alt=""
                        />
                      </strong>
                    </span>
                  </div>
                </div>

                <ul className="learn-box">{datarep}</ul>
              </div>
            </div>
          </section>
        </main>

        <div
          className="ovarlay"
          style={
            this.state.viewLearningIteam
              ? { display: 'block', zIndex: 99 }
              : { display: 'none' }
          }
        >
          <div className="popup-wrap ">
            <div className="popup-content-wrap readinglist-pop">
              {this.state.viewLearningIteam && (
                <LearnIteam
                  hideLearningIteam={this.hideLearningIteam}
                  url={this.state.url}
                />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function TitleOptions(props) {
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
export default Learn;
