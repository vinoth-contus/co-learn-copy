import React, { Component } from 'react';

// import rightarrow from '../../assets/images/svg/back-grey.svg';
import ProgressBar from '../ProgressBarComponent';
import Tooltip from 'react-simple-tooltip';

class SkillListComponent extends Component {
  color = percentage => {
    let color = null;
    switch (true) {
      case percentage <= process.env.REACT_APP_DANGER_END_RANGE:
        color = process.env.REACT_APP_DANGER_COLOR;
        break;
      case percentage <= process.env.REACT_APP_WARNING_END_RANGE:
        color = process.env.REACT_APP_WARNING_COLOR;
        break;
      case percentage <= process.env.REACT_APP_SUCCESS_END_RANGE:
        color = process.env.REACT_APP_SUCCESS_COLOR;
        break;
      default:
        break;
    }
    return color;
  };

  render() {
    const skills = this.props.skills;

    // let colors = ['fd5089', '3dc3ff', 'feba74', 'bf75ff', '50e3c2'];
    const listItems = skills.map((skill, index) => (
      <div key={skill.subject_id} className="progress-item">
        <Tooltip
          arrow={15}
          boxShadow="0 5px 10px red"
          background="#fff"
          border="#D3D3D3"
          color="#000"
          content={skill.percentage === 'N/A' ? 'N/A' : `${skill.percentage}%`}
          padding={12}
          placement="top"
        >
          <div className="progress-head">
            <h3>{skill.subject_id}</h3>
          </div>
          <div className="progress-bar-outer-wrap">
            <ProgressBar
              percentage={skill.percentage === 'N/A' ? 0 : skill.percentage}
              height="10"
              backgroundColor={this.color(
                skill.percentage === 'N/A' ? 0 : skill.percentage
              )}
              countingBarBackgroundColor="#2f3a63"
              // backgroundColor={
              //   colors[
              //     index >= colors.length
              //       ? index - colors.length * parseInt(index / colors.length, 10)
              //       : index
              //   ]
              // }
              borderRadius="5"
            />
            {/* <img src={rightarrow} alt="" /> */}
          </div>
        </Tooltip>
      </div>
    ));
    return listItems;
  }
}

export default SkillListComponent;
