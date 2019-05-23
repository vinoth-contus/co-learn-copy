import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './profile-edit.scss';
import backarrow from '../../assets/images/svg/back-grey.svg';
import editavatar from '../../assets/images/svg/male.svg';
import rightarrow from '../../assets/images/svg/back-grey.svg';

class ReadingList extends Component {
  render() {
    return (
      <React.Fragment>
        <main className="overall-wrap profile-edit" id="max-width-halfthird">
          <div className="edit-profile-title">
            <Link to="/profile">
              <img src={backarrow} alt="" />
            </Link>

            <h2>Edit your profile</h2>
          </div>
          <section className="edit-profile">
            <div className="container-wrap">
              <div className="user-profile cursor-pointer">
                <img src={editavatar} alt="" />
                <span className="camera-function" />
              </div>
              <div className="profile-edit-fields">
                <div className="personal-edits">
                  <h3 className="profile-edit-title">Personal Details</h3>
                  <div className="profile-details-form">
                    <h2 className="profile-editer-details">Name</h2>
                    <input type="text" value="Marco Alves" />
                  </div>
                  <div className="profile-details-form">
                    <h2 className="profile-editer-details">Role</h2>
                    <input
                      className="profile-editor-replied"
                      value=" Designer Intern"
                    />
                  </div>
                  <div className="profile-details-form">
                    <h2 className="profile-editer-details">Date of birth</h2>
                    <p className="profile-editor-replied">
                      <select name="" id="profile-edit-dob">
                        <option>20/08/1986</option>
                        <option>20/08/1987</option>
                        <option>20/08/1988</option>
                      </select>
                      <img
                        src={rightarrow}
                        alt=""
                        className="date-picker-edit"
                      />
                    </p>
                  </div>
                </div>
                <div className="personal-edits account-details">
                  <h3 className="profile-edit-title">Account Details</h3>
                  <div className="profile-details-form">
                    <h2 className="profile-editer-details">User Name</h2>
                    <input type="text" value="marco1234" />
                  </div>
                  <div className="profile-details-form email">
                    <h2 className="profile-editer-details">Email</h2>
                    <input type="email" value="marco@compny.com" />
                  </div>
                </div>
                <div className="personal-edits change-password">
                  <div className="profile-details-form">
                    <h2 className="change-password-h2">
                      <Link to="#">Change Password</Link>
                      <img
                        src={rightarrow}
                        alt=""
                        className="date-picker-edit"
                      />
                    </h2>
                  </div>
                </div>

                <div className="page-bot-btn">
                  <button className="text-center redirect-btn">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default ReadingList;
