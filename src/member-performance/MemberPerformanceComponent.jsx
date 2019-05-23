import _ from 'lodash';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import AppUtility from '../utility/AppUtility';
import Authorization from '../utility/authorization';
import CircularProgressbar from 'react-circular-progressbar';
import './memberPerformance.scss';
import '../assets/scss/circular-progressbar.scss';
import Tooltip from 'react-simple-tooltip';
import RadarChart from '../global-components/radar-chart/RadarChartComponent';

import male from '../assets/images/svg/male.svg';
import female from '../assets/images/svg/female.svg';
// import edit from '../assets/images/svg/edit-grey.svg';
import Header from '../global-components/header/HeaderComponent';

// import eye from '../assets/images/svg/eye-grey.svg';
// import sortdown from '../assets/images/svg/sort-down.svg';
// import cloud from '../assets/images/svg/cloud.svg';
import calendar from '../assets/images/svg/calendar-grey.svg';
import LineChart from '../global-components/line-chart/LineChartComponent';

let RESULT_VISIBLE_THRESHOLD = 0;

class MemberPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProgress: null,
      overallPercentage: 0,
      skills: [],
      totalReviewedItems: 0,
      totalAnswered: 0,
      totalPoint: 0,
      user: null,
      dataSet: null,
      filterValue: 'daily'
    };
  }

  initializeReactGA = () => {
    AppUtility.initializeReactGA('member-profile');
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    if (
      !this.props.location.state &&
      !this.props.location.state.user_name &&
      !this.props.location.state.gender
    ) {
      this.props.history.push('/');
      return;
    }
    this.initializeReactGA();
    this.setState({
      user: Authorization.getAuthUser().user
    });
    this.getUserProgress();
    this.getUserPointStats();
  }

  getUserPointStats = (filter = 'daily') => {
    const {
      match: { params }
    } = this.props;

    AppUtility.getUserPointStats(
      filter,
      params.user_id,
      responseData => {
        this.setState({
          dataSet: responseData
        });
      },
      error => {}
    );
  };

  filterChanged = event => {
    this.getUserPointStats(event.target.value);
    this.setState({ filterValue: event.target.value });
  };

  getUserProgress = () => {
    const {
      match: { params }
    } = this.props;

    let gamificationPointsConfigration = JSON.parse(
      localStorage.getItem('gamificationPointsConfigration')
    );

    if (gamificationPointsConfigration) {
      RESULT_VISIBLE_THRESHOLD =
        gamificationPointsConfigration.result_visible_threshold;
    }

    AppUtility.getUserProgress(
      responseData => {
        let {
          overall_percentage,
          skills,
          total_reviewed,
          total_answered,
          total_point
        } = responseData;

        let authorizedUserDetails = JSON.parse(
          localStorage.getItem('authorizedUserDetails')
        );

        if (
          authorizedUserDetails &&
          authorizedUserDetails.user &&
          authorizedUserDetails.user.interest
        ) {
          let interestedSkills = authorizedUserDetails.user.interest;

          skills = interestedSkills.map(interestedSkill => {
            let filtredSkill = skills.filter(skill => {
              return (
                skill.subject_id === _.startCase(interestedSkill.toLowerCase())
              );
            });

            let percentage = 0;

            if (total_answered >= RESULT_VISIBLE_THRESHOLD) {
              if (filtredSkill[0] && filtredSkill[0].percentage) {
                percentage = filtredSkill[0].percentage;
              }
            } else {
              percentage = 'N/A';
            }

            return {
              subject_id: _.startCase(interestedSkill.toLowerCase()),
              percentage: percentage
            };
          });
        }

        this.setState({
          userProgress: responseData,
          overallPercentage: overall_percentage,
          skills: skills,
          totalReviewedItems: total_reviewed,
          totalAnswered: total_answered,
          totalPoint: total_point
        });
      },
      error => {},
      params.user_id
    );
  };

  logout = () => {
    Authorization.logout(this.props);
  };

  render() {
    return (
      <main
        className="overall-wrap reading-list myperformancepge member-performance"
        id="profile"
      >
        <Header />

        <section className="main-content">
          <div className="reading-list-content">
            <div className="breadcrumbs">
              <ul>
                <li>
                  <Link to="/team-performance">Dashboard</Link>
                </li>
                <li>
                  <span>{`${
                    this.props.location.state.user_name
                  }'s Profile`}</span>
                </li>
              </ul>
            </div>
            <section className="skill-set">
              <div className="white-bg profiler-area">
                <div className="profiler-wrap">
                  <div className="profiler-details">
                    <div className="profiler-progress">
                      <Tooltip
                        arrow={15}
                        boxShadow="0 5px 10px red"
                        background="#fff"
                        border="#D3D3D3"
                        color="#000"
                        content={
                          this.state.totalAnswered >= RESULT_VISIBLE_THRESHOLD
                            ? `${this.state.overallPercentage}%`
                            : ''
                        }
                        padding={12}
                        placement="top"
                        zIndex={
                          this.state.totalAnswered >= RESULT_VISIBLE_THRESHOLD
                            ? 1
                            : -99999
                        }
                      >
                        <div className="profiler-progress-circle">
                          {this.state.totalAnswered >=
                          RESULT_VISIBLE_THRESHOLD ? (
                            <CircularProgressbar
                              strokeWidth={8}
                              borderRadius={0}
                              percentage={this.state.overallPercentage}
                            />
                          ) : (
                            <CircularProgressbar
                              strokeWidth={8}
                              borderRadius={0}
                              percentage={0}
                            />
                          )}

                          <span className="profiler-avatar">
                            {this.state.user && (
                              <img
                                src={
                                  this.props.location.state.gender.toLowerCase() ===
                                  'male'
                                    ? male
                                    : female
                                }
                                alt="user-avatar"
                              />
                            )}
                          </span>
                        </div>
                      </Tooltip>
                    </div>
                    <div className="profiler-avatar-details">
                      <h2>
                        {this.props.location.state.user_name}
                        {/* <span>Designer Intern</span> */}
                      </h2>
                      {/* <span className="avatar-points">TOP 5%</span> */}
                    </div>
                  </div>
                  <div className="profiler-points-rewards">
                    <div className="profiler-rewarded">
                      <h2>{this.state.totalPoint}</h2>
                      <p>Points collected</p>
                    </div>

                    <div className="profiler-rewarded">
                      <h2>{this.state.totalAnswered}</h2>
                      <p>Questions answered</p>
                    </div>

                    <div className="profiler-rewarded">
                      <h2>{this.state.totalReviewedItems}</h2>
                      <p>Items reviewed</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/*Skill strength*/}
            <div className="skill-strength-memberpage">
              <h2>Knowledge strength</h2>
              <div className="for-graph">
                <RadarChart color="#000" skills={this.state.skills} />
              </div>
            </div>

            {/* linechart */}
            <div className="points-line">
              <div className="grapher-collected-points">
                <div className="downloadable-wrap">
                  <h2>Points collected over time</h2>
                  <span>
                    <img className="calendar" src={calendar} alt="" />
                    <select
                      name="filter"
                      onChange={this.filterChanged}
                      value={this.state.filterValue}
                    >
                      <option style={{ color: '#000' }} value="daily">
                        Daily
                      </option>
                      <option style={{ color: '#000' }} value="monthly">
                        Monthly
                      </option>
                    </select>
                  </span>
                  {/* <div className="dropdowns-grapher">
                    <div className="datepicker-claendar">
                      <img src={eye} alt="" />
                      <ul className="select-dropper-wrap all-user cursor-pointer">
                        <li onClick={this.showOrHideAllUserDropdown}>
                          All users
                          <img src={sortdown} alt="" className="sort-down" />
                          <ul
                            className={
                              this.state.isAllUsersShown
                                ? 'select-dropper cursor-pointer show'
                                : 'select-dropper cursor-pointer'
                            }
                          >
                            <li className="default-value">Select an option</li>
                            <li>All users</li>
                            <li>Item 01</li>
                            <li>Itam 02</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                    <div className="datepicker-claendar">
                      <img src={calendar} alt="" />
                      <ul
                        className="select-dropper-wrap all-user cursor-pointer"
                        onClick={this.showOrHideSkillCalendarDropdown}
                      >
                        <li>
                          --Select--
                          <img src={sortdown} alt="" className="sort-down" />
                          <ul
                            className={
                              this.state.isSkillCalendarShown
                                ? 'select-dropper cursor-pointer show'
                                : 'select-dropper cursor-pointer'
                            }
                          >
                            <li className="default-value">Select an option</li>
                            <li>Months</li>
                            <li>Weeks</li>
                            <li>Days</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div> */}
                </div>
                <div className="line-chart">
                  {this.state.dataSet && (
                    <LineChart
                      color="#a2aac3"
                      backgroundColor="rgba(61, 195, 255, 0.5)"
                      yAxesGridLinesColor="#7583a7"
                      dataSet={this.state.dataSet}
                      // createLineChart={() => {
                      //   this.createLineChart();
                      // }}
                      // pointStats={this.state.pointStats}
                      // targetPoints={this.state.targetPoints}
                    />
                  )}

                  <div className="line-chart-hint">
                    <div className="honts-line your-points">
                      <span className="" />
                      <p>Your Points</p>
                    </div>
                    <div className="honts-line Target-points">
                      <span />
                      <p>Target</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default MemberPerformance;
