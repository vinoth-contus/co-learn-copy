// import { Link } from 'react-router-dom';
// import eye from '../assets/images/svg/eye-grey.svg';
// import sortdown from '../assets/images/svg/sort-down.svg';
// import cloud from '../assets/images/svg/cloud.svg';
// import calendar from '../assets/images/svg/calendar-grey.svg';
// import LineChart from '../global-components/line-chart/LineChartComponent';

import loading from '../assets/images/loading.gif';
import React, { Component } from 'react';
import AppUtility from '../utility/AppUtility';
import CircularProgressbar from 'react-circular-progressbar';
import Switch from 'react-switch';
import Header from '../global-components/header/HeaderComponent';
import moment from 'moment';

import Slider from 'rc-slider';

import male from '../assets/images/svg/male.svg';
import logoweb from '../assets/images/web-logo.png';
import female from '../assets/images/svg/female.svg';

import './team-performance.scss';
import '../assets/scss/circular-progressbar.scss';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

let canUpdateState = false;
let RESULT_VISIBLE_THRESHOLD = 0;

const viewTeamMemberProgress = (props, teamMemberDetails) => {
  props.history.push({
    pathname: `/member-performance/${teamMemberDetails.user_id}`,
    state: {
      user_name: teamMemberDetails.user_fullname,
      gender: teamMemberDetails.user_gender
    }
  });
};

function TeamMemberList(props) {
  let gamificationPointsConfigration = JSON.parse(
    localStorage.getItem('gamificationPointsConfigration')
  );

  if (gamificationPointsConfigration) {
    RESULT_VISIBLE_THRESHOLD =
      gamificationPointsConfigration.result_visible_threshold;
  }

  let teamMemberList = props.teamMemberList;

  var listItems = teamMemberList.map(teamMember => (
    <div
      className="second-header cursor-pointer"
      key={teamMember.user_id}
      onClick={() => viewTeamMemberProgress(props, teamMember)}
    >
      <div className="second-head-item">
        <div className="team-heading">
          <span className="team-user">
            <img
              src={
                teamMember.user_gender.toLowerCase() === 'male' ? male : female
              }
              alt="logo"
              className="saal-logo"
            />
          </span>
          <h2>{teamMember.user_fullname}</h2>
        </div>
        <div className="team-heading">
          <p>{teamMember.total_points}</p>
        </div>
        <div className="team-heading">
          <CircularProgressbar
            className="team-strength-progress"
            borderRadius={0}
            strokeWidth={12}
            percentage={
              teamMember.answered >= RESULT_VISIBLE_THRESHOLD
                ? teamMember.percentage
                : 0
            }
            text={
              teamMember.answered >= RESULT_VISIBLE_THRESHOLD
                ? `${teamMember.percentage}%`
                : 'N/A'
            }
          />
        </div>
      </div>
    </div>
  ));
  return listItems;
}

function OverallTeamMemberList(props) {
  let teamMemberList = props.teamMemberList;
  let totalPoints = 0;
  let totalPointsAvg = 0;
  let totalKnowledgeStrength = 0;
  let avgKnowledgeStrength = 0;
  let teamMemberListLength = 0;

  let gamificationPointsConfigration = JSON.parse(
    localStorage.getItem('gamificationPointsConfigration')
  );

  if (gamificationPointsConfigration) {
    RESULT_VISIBLE_THRESHOLD =
      gamificationPointsConfigration.result_visible_threshold;
  }

  if (teamMemberList.length > 0) {
    teamMemberList.forEach(teamMember => {
      if (teamMember.answered >= RESULT_VISIBLE_THRESHOLD) {
        teamMemberListLength++;
        totalKnowledgeStrength = totalKnowledgeStrength + teamMember.percentage;
        totalPoints = totalPoints + teamMember.total_points;
      }
    });

    if (totalPoints > 0) {
      totalPointsAvg = totalPoints / teamMemberListLength;
      totalPointsAvg = Math.round(totalPointsAvg);
    }

    if (totalKnowledgeStrength > 0) {
      avgKnowledgeStrength = totalKnowledgeStrength / teamMemberListLength;
      avgKnowledgeStrength = Math.round(avgKnowledgeStrength);
    }
  }

  return (
    <div className="second-header">
      <div className="second-head-item">
        <div className="team-heading">
          <span className="team-user">
            <img src={logoweb} alt="team-logo" className="saal-logo-table" />
          </span>
          <h2>Your team's average</h2>
        </div>
        <div className="team-heading">
          <p>{totalPointsAvg}</p>
        </div>
        <div className="team-heading">
          <CircularProgressbar
            className="team-strength-progress"
            borderRadius={0}
            strokeWidth={12}
            percentage={avgKnowledgeStrength}
            text={`${avgKnowledgeStrength}%`}
          />
        </div>
      </div>
    </div>
  );
}

class TeamPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAllUsersShown: false,
      isSkillCalendarShown: false,
      isTeamUsersShown: false,
      teamMemberList: [],
      isFetching: false,
      showAll: false,
      showFullpageLoader: false,
      userChossenMonth: null,
      sliderMonth: null
    };
  }

  handleMonthSlider = props => {
    this.setState({
      sliderMonth: props
    });
  };

  handleMonthDropDown = event => {
    this.handleMonthSliderAfterChange(event.target.value);
    this.setState({
      sliderMonth: event.target.value
    });
  };

  handleShowAllChange = checked => {
    if (checked) {
      let year = moment().format('YYYY');
      // getTeamMemberStats Params - month  year  showAll   showLoader
      this.getTeamMemberStats(null, year, true, true);
    } else {
      let month = this.state.userChossenMonth;
      // getTeamMemberStats Params - month  year  showAll   showLoader
      this.getTeamMemberStats(month, null, false, true);
    }
    this.setState({ showAll: checked });
  };

  initializeReactGA = () => {
    AppUtility.initializeReactGA('team-performance');
  };

  componentWillUnmount() {
    canUpdateState = false;
  }

  getTeamMemberStats = (
    month = null,
    year = null,
    showAll = false,
    showLoader
  ) => {
    if (showLoader) {
      this.setState({ showFullpageLoader: true });
    }

    AppUtility.getTeamMemberStats(
      responseData => {
        if (canUpdateState) {
          this.setState({
            teamMemberList: responseData.teamstats,
            isFetching: false,
            showFullpageLoader: false
          });
        }
      },
      error => {
        if (canUpdateState) {
          this.setState({
            isFetching: false,
            showFullpageLoader: false
          });
        }
      },
      month,
      year,
      showAll
    );
  };

  componentDidMount() {
    canUpdateState = true;
    this.setState({
      isFetching: true,
      sliderMonth: moment().format('MM')
    });

    this.initializeReactGA();
    this.getTeamMemberStats();
  }

  showOrHideAllUserDropdown = e => {
    this.setState({
      isAllUsersShown: !this.state.isAllUsersShown
    });
  };

  showOrHideSkillCalendarDropdown = e => {
    this.setState({
      isSkillCalendarShown: !this.state.isSkillCalendarShown
    });
  };

  showOrHideTeamSkillDropdown = e => {
    this.setState({
      isTeamUsersShown: !this.state.isTeamUsersShown
    });
  };

  handleMonthSliderAfterChange = month => {
    // getTeamMemberStats Params - month  year  showAll   showLoader
    this.setState({ showAll: false, userChossenMonth: month });

    this.getTeamMemberStats(month, null, null, true);
  };

  render() {
    return (
      <React.Fragment>
        <main className="overall-wrap team-performance">
          <Header />
          <section className="main-wrap-team-strength">
            <div className="team-skills-wrap">
              <div className="team-strength-left">
                <div className="date-picker-slider-wrap">
                  <h2>Your team’s strength</h2>
                  <label className="show-all-label">
                    <span className="show-all-label-text">All time</span>
                    <Switch
                      onChange={this.handleShowAllChange}
                      checked={this.state.showAll}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      height={20}
                      width={35}
                      onColor="#61799e"
                    />
                  </label>
                </div>

                {/* <div className="sliderfor-team">
                  <div className="slider-rail">
                    <span className="slider-pointer" />
                  </div>
                  <div className="month">
                    <span>Dec</span>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                  </div>
                  <div className="slider-divider">
                    <span>2019</span>
                  </div>
                </div> */}

                <div
                  className="monthly-slider"
                  style={{
                    width: '100%',
                    margin: '50px auto',
                    marginBottom: '120px'
                  }}
                >
                  {this.state.sliderMonth > 0 && (
                    <Slider
                      onChange={this.handleMonthSlider}
                      onAfterChange={this.handleMonthSliderAfterChange}
                      {...this.props}
                      min={1}
                      value={parseInt(this.state.sliderMonth)}
                      disabled={this.state.showAll}
                      max={12}
                      marks={{
                        1: 'Jan',
                        2: 'Feb',
                        3: 'Mar',
                        4: 'Apr',
                        5: 'May',
                        6: 'Jun',
                        7: 'Jul',
                        8: 'Aug',
                        9: 'Sep',
                        10: 'Oct',
                        11: 'Nov',
                        12: 'Dec'
                      }}
                      step={null}
                    />
                  )}
                </div>

                <div className="month-dropdown">
                  <select
                    value={parseInt(this.state.sliderMonth).toString()}
                    onChange={this.handleMonthDropDown}
                    style={
                      this.state.showAll
                        ? {
                            color: '#ccc'
                          }
                        : {
                            color: '#000'
                          }
                    }
                    disabled={this.state.showAll ? true : false}
                  >
                    <option value="1">Jan</option>
                    <option value="2">Feb</option>
                    <option value="3">Mar</option>
                    <option value="4">Apr</option>
                    <option value="5">May</option>
                    <option value="6">Jun</option>
                    <option value="7">Jul</option>
                    <option value="8">Aug</option>
                    <option value="9">Sep</option>
                    <option value="10">Oct</option>
                    <option value="11">Nov</option>
                    <option value="12">Dec</option>
                  </select>
                </div>
                <div className="team-strength-wrap">
                  {/* <table>
                    <thead>
                      <tr>
                        <th>Team Member</th>
                        <th>POINTS</th>
                        <th>Knowledge strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      <OverallTeamMemberList
                        teamMemberList={this.state.teamMemberList}
                      />
                      {this.state.teamMemberList.length > 0 && (
                        <TeamMemberList
                          {...this.props}
                          teamMemberList={this.state.teamMemberList}
                        />
                      )}
                    </tbody>
                  </table> */}

                  <div className="member-skill">
                    <div className="for-fixed-header">
                      <div className="member-header">
                        <div className="mem-header-item">
                          <p>Team Member</p>
                        </div>
                        <div className="mem-header-item">
                          <p>Points</p>
                        </div>
                        <div className="mem-header-item">
                          <p>Knowledge Strength</p>
                        </div>
                      </div>

                      <OverallTeamMemberList
                        teamMemberList={this.state.teamMemberList}
                      />
                    </div>
                    <div className="body-content">
                      {this.state.teamMemberList.length <= 0 &&
                        this.state.isFetching && (
                          <table>
                            <tbody>
                              <tr style={{ borderBottom: 'none' }}>
                                <td>
                                  <div className="team-heading">
                                    <span className="team-user-loader" />
                                    <div className="content-loader" />
                                  </div>
                                </td>
                                <td>
                                  <div className="content-loader" />
                                </td>
                                <td />
                              </tr>
                              <tr>
                                <td>
                                  <div className="team-heading">
                                    <span className="team-user-loader" />
                                    <div className="content-loader" />
                                  </div>
                                </td>
                                <td>
                                  <div className="content-loader" />
                                </td>
                                <td />
                              </tr>
                            </tbody>
                          </table>
                        )}

                      {this.state.teamMemberList.length <= 0 &&
                        !this.state.isFetching && (
                          <h1 className="no-data">No data available</h1>
                        )}

                      {this.state.teamMemberList.length > 0 && (
                        <TeamMemberList
                          {...this.props}
                          teamMemberList={this.state.teamMemberList}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className="grapher-collected-points">
                  <div className="downloadable-wrap">
                    <h2>Points collected over time</h2>
                    <div className="dropdowns-grapher">
                      <button className="drop-ui">
                        <img src={cloud} alt="" />
                        Download CSV
                      </button>
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
                              <li className="default-value">
                                Select an option
                              </li>
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
                              <li className="default-value">
                                Select an option
                              </li>
                              <li>Months</li>
                              <li>Weeks</li>
                              <li>Days</li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="line-chart">
                     <LineChart
                      color="#6a7887"
                      backgroundColor="rgba(61, 195, 255, 0.1)"
                      yAxesGridLinesColor="transparent"
                      dataSet={dataSet}
                    />
                  </div>
                </div>*/}
              </div>
              <div className="team-strength-right" />
            </div>
          </section>
        </main>

        <div
          className="ovarlay"
          style={
            this.state.showFullpageLoader
              ? { display: 'block', backgroundColor: 'rgba(44, 69, 116, 0.7)' }
              : { display: 'none' }
          }
        >
          <div className="popup-wrap">
            <div
              className="popup-content-wrap"
              style={{ maxWidth: 'auto', width: 'auto' }}
            >
              <div className="hint-pop-wrap" style={{ padding: '10px' }}>
                <img src={loading} alt="loading" height="40px" />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TeamPerformance;
