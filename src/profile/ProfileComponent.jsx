import _ from 'lodash';
import React, { Component } from 'react';
import AppUtility from '../utility/AppUtility';
import Authorization from '../utility/authorization';
import CircularProgressbar from 'react-circular-progressbar';
// import SkillListComponent from '../global-components/skill-list/SkillListComponent';
import './profile.scss';
import '../assets/scss/circular-progressbar.scss';
import Tooltip from 'react-simple-tooltip';

import male from '../assets/images/svg/male.svg';
import female from '../assets/images/svg/female.svg';
// import edit from '../assets/images/svg/edit-grey.svg';
import logout from '../assets/images/svg/logout-grey.svg';
import Header from '../global-components/header/HeaderComponent';
import RadarChart from '../global-components/radar-chart/RadarChartComponent';

let RESULT_VISIBLE_THRESHOLD = 0;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProgress: null,
      overallPercentage: 0,
      skills: [],
      totalReviewedItems: 0,
      totalAnswered: 0,
      totalPoint: 0,
      user: null
    };
  }

  initializeReactGA = () => {
    AppUtility.initializeReactGA('profile');
  };

  componentDidMount() {
    this.initializeReactGA();
    this.setState({
      user: Authorization.getAuthUser().user
    });
    this.getUserProgress();
  }

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

  logout = () => {
    Authorization.logout(this.props);
  };

  render() {
    return (
      <main className="overall-wrap reading-list myperformancepge" id="profile">
        <Header />

        <section className="main-content">
          <div className="reading-list-content">
            <h2 className="reading-hedaing">
              <span>My</span>
              Profile
            </h2>
            <section className="skill-set">
              <div className="white-bg profiler-area">
                {/* <Link to="/profile-edit">
                  <img src={edit} alt="" className="editer" />
                </Link> */}
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
                                  this.state.user.gender.toLowerCase() ===
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
                        {this.state.user ? this.state.user.name : ''}
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
              {this.state.skills && this.state.skills.length > 0 && (
                <div className="white-bg required-skill">
                  <h2>Knowledge strength</h2>
                  <RadarChart color="#000" skills={this.state.skills} />
                </div>
              )}
              <div
                onClick={this.logout}
                className="logout-profiler cursor-pointer"
              >
                <img src={logout} alt="" /> Sign out
              </div>
            </section>
          </div>
        </section>
      </main>
    );
  }
}

export default Profile;
