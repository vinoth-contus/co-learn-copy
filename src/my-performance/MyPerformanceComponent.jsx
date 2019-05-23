import React, { Component } from 'react';
import './myPerformance.scss';
import '../assets/scss/circular-progressbar.scss';
import calendar from '../assets/images/svg/calendar-icon.svg';
import AppUtility from '../utility/AppUtility';
import _ from 'lodash';

// import RadarChart from '../global-components/radar-chart/RadarChartComponent';
import LineChart from '../global-components/line-chart/LineChartComponent';
import CircularProgressbar from 'react-circular-progressbar';
import Header from '../global-components/header/HeaderComponent';
import SkillListComponent from '../global-components/skill-list/SkillListComponent';

let RESULT_VISIBLE_THRESHOLD = 0;

class MyPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProgress: null,
      overallPercentage: 0,
      skills: [],
      totalReviewedItems: 0,
      totalAnswered: 0,
      totalPoint: 0,
      // targetPoints: 0,
      dataSet: null,
      filterValue: 'daily'
    };
  }

  initializeReactGA = () => {
    AppUtility.initializeReactGA('my-performance');
  };

  componentDidMount() {
    this.initializeReactGA();
    this.getUserProgress();
    this.getUserPointStats();
  }

  getUserPointStats = (filter = 'daily') => {
    AppUtility.getUserPointStats(
      filter,
      null,
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
    AppUtility.getUserProgress(
      responseData => {
        let gamificationPointsConfigration = JSON.parse(
          localStorage.getItem('gamificationPointsConfigration')
        );

        if (gamificationPointsConfigration) {
          RESULT_VISIBLE_THRESHOLD =
            gamificationPointsConfigration.result_visible_threshold;
        }

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
      error => {}
    );
  };

  render() {
    return (
      <main className="overall-wrap reading-list myperformancepge">
        <Header />
        <section className="main-content">
          <div className="reading-list-content">
            <h2 className="reading-hedaing">
              <span>My</span>
              Performance
            </h2>
            {/* <div className="performance-message">
              <p>
                You belong to the 40% of the users with more than 70% of
                knowledge strength
              </p>
            </div> */}
            <section className="performance-graph-content">
              <div className="strengthgraph-wrap-right">
                <div className="strength-points-wrap">
                  <div className="overall-strength-circle">
                    {this.state.totalAnswered >= RESULT_VISIBLE_THRESHOLD ? (
                      <CircularProgressbar
                        borderRadius={0}
                        percentage={this.state.overallPercentage}
                        text={
                          this.state.overallPercentage <= 0
                            ? `N/A`
                            : `${this.state.overallPercentage}%`
                        }
                      />
                    ) : (
                      <CircularProgressbar
                        borderRadius={0}
                        percentage={0}
                        text={'N/A'}
                      />
                    )}

                    <p>Overall knowledge strength</p>
                  </div>
                  <div className="point-status">
                    <div className="points collected">
                      <h4>{this.state.totalPoint}</h4>
                      {this.state.totalPoint === 1 ? (
                        <span>Point collected</span>
                      ) : (
                        <span>Points collected</span>
                      )}
                    </div>

                    <div className="points collected">
                      <h4>{this.state.totalAnswered}</h4>

                      {this.state.totalAnswered === 1 ? (
                        <span>Question answered</span>
                      ) : (
                        <span>Questions answered</span>
                      )}
                    </div>

                    <div className="points collected">
                      <h4>{this.state.totalReviewedItems}</h4>
                      {this.state.totalReviewedItems === 1 ? (
                        <span>Item reviewed</span>
                      ) : (
                        <span>Items reviewed</span>
                      )}
                    </div>
                  </div>
                </div>
                {this.state.skills && this.state.skills.length > 0 && (
                  <div className="required-skill">
                    <h2>Knowledge strength</h2>
                    <div
                      className="progress-bar-wrap"
                      style={{ marginTop: '20px' }}
                    >
                      <SkillListComponent skills={this.state.skills} />
                    </div>
                  </div>
                )}
                <div className="collected-points-wrap">
                  <div className="monthly-wrap">
                    <h2>Points collected over time</h2>
                    <span>
                      <img src={calendar} alt="" />
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
            </section>
          </div>
        </section>
      </main>
    );
  }
}

export default MyPerformance;
