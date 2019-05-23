import _ from 'lodash';
import toastr from 'toastr';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';

import wrong from '../assets/images/svg/wrong.svg';
import danger from '../assets/images/svg/danger.svg';
import correct from '../assets/images/svg/blue-tick.svg';

import AppUtility from '../utility/AppUtility';

import Header from '../global-components/header/HeaderComponent';

import './signUp.scss';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.delayedCheckUserNameAvailable = _.debounce(
      this.checkUserNameAvailable,
      500
    );
    this._isMounted = false;

    this.state = {
      currentStep: 1,
      totalSteps: 4,
      isStepOneSubmitting: false,
      isUserDetailsSubmitting: false,
      isSignUpSubmitting: false,
      isUserDetailsFullyFilled: true,
      inviteCode: '',

      isInvalidInviteCode: false,
      invalidInviteCodeMsg: '',

      isInvalidName: false,
      invalidNameMsg: '',

      isInvalidUserName: false,
      invalidUserNameMsg: '',

      isInvalidEmail: false,
      invalidEmailMsg: '',

      isInvalidPassword: false,
      invalidPasswordMsg: '',

      isInvalidConfirmPassword: false,
      invalidConfirmPasswordMsg: '',

      companyName: '',
      department: '',
      contactPerson: '',

      isUserNameAvailable: null,

      schooluuid: '',
      sectionuuid: '',
      grade: '',
      curriculum: '',

      userDetails: null,
      skills: [],
      interestedSkills: [],
      name: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  initializeReactGA = () => {
    AppUtility.initializeReactGA('sign-up');
  };

  componentDidMount() {
    this._isMounted = true;
    this.initializeReactGA();

    this.inviteCode.focus();
  }

  goToStep = step => {
    this._isMounted &&
      this.setState({
        currentStep: step
      });
  };

  handleIntrestedSkills = event => {
    let interestedSkills = this.state.interestedSkills;
    if (event.target.checked) {
      interestedSkills.push(event.target.value);
      this._isMounted &&
        this.setState({
          interestedSkills
        });
    } else {
      interestedSkills.pop(event.target.value);
      this._isMounted &&
        this.setState({
          interestedSkills
        });
    }
  };

  submitUserDetails = event => {
    event.preventDefault();

    if (this.state.name.length <= 0) {
      this._isMounted &&
        this.setState({
          isInvalidName: true,
          invalidNameMsg: 'Please enter your name'
        });
    } else {
      this._isMounted &&
        this.setState({
          isInvalidName: false,
          invalidNameMsg: ''
        });
    }

    if (this.state.userName.length <= 0) {
      this._isMounted &&
        this.setState({
          isInvalidUserName: true,
          invalidUserNameMsg: 'Please enter your username'
        });
    } else {
      this._isMounted &&
        this.setState({
          isInvalidUserName: false,
          invalidUserNameMsg: ''
        });
    }

    if (this.state.email.length <= 0) {
      this._isMounted &&
        this.setState({
          isInvalidEmail: true,
          invalidEmailMsg: 'Please enter your email'
        });
    } else {
      this._isMounted &&
        this.setState({
          isInvalidEmail: false,
          invalidEmailMsg: ''
        });
    }

    if (this.state.password.length <= 0) {
      this._isMounted &&
        this.setState({
          isInvalidPassword: true,
          invalidPasswordMsg: 'Please enter a new password'
        });
    } else {
      this._isMounted &&
        this.setState({
          isInvalidPassword: false,
          invalidPasswordMsg: ''
        });
    }

    if (this.state.password !== this.state.confirmPassword) {
      this._isMounted &&
        this.setState({
          isInvalidConfirmPassword: true,
          invalidConfirmPasswordMsg:
            'Your password and confirmation password do not match'
        });
    } else {
      this._isMounted &&
        this.setState({
          isInvalidConfirmPassword: false,
          invalidConfirmPasswordMsg: ''
        });
    }

    if (
      this.state.password !== this.state.confirmPassword ||
      this.state.password.length <= 0 ||
      this.state.email.length <= 0 ||
      this.state.userName.length <= 0 ||
      this.state.name.length <= 0 ||
      this.state.isInvalidEmail ||
      !this.state.isUserNameAvailable
    ) {
      return;
    }

    this._isMounted &&
      this.setState({
        isUserDetailsSubmitting: true
      });

    this.getSkills();
  };

  signUp = event => {
    event.preventDefault();
    let userDetails = {
      username: this.state.userName,
      password: this.state.password,
      schooluuid: this.state.schooluuid,
      sectionuuid: this.state.sectionuuid,
      name: this.state.name,
      email: this.state.email,
      gender: 'Male',
      avatar: '/avatars/boy_avatar_03.png',
      role: 'student',
      dob: '01/01/1999',
      mobile: '9999999999',
      interest: this.state.interestedSkills
    };

    this._isMounted &&
      this.setState({
        userDetails,
        isSignUpSubmitting: true
      });

    AppUtility.signUp(
      userDetails,
      data => {
        toastr.success('Signup process completed!');

        this._isMounted &&
          this.setState({
            isSignUpSubmitting: false
          });

        this.props.history.push('/login');
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

        this._isMounted &&
          this.setState({
            isSignUpSubmitting: false
          });
      }
    );
  };

  getSkills = () => {
    AppUtility.getSkills(
      this.state.curriculum,
      this.state.grade,
      data => {
        let skills = [];
        for (let i = 0; i < data.length; i++) {
          skills.push({
            startCase: _.startCase(data[i].name.toLowerCase()),
            snakeCase: _.snakeCase(data[i].name.toLowerCase()),
            kebabCase: data[i].name.toLowerCase()
          });
        }

        this.setState(
          {
            skills
          },
          () => {
            this._isMounted &&
              this.setState({
                isUserDetailsSubmitting: false,
                currentStep: 4
              });
          }
        );
      },
      error => {}
    );
  };

  submitStepOne = event => {
    event.preventDefault();

    if (this.state.inviteCode.length <= 0) {
      this.inviteCode.focus();
      this._isMounted &&
        this.setState({
          isInvalidInviteCode: true,
          invalidInviteCodeMsg: 'Please enter your invite code'
        });
      return;
    }

    this._isMounted &&
      this.setState({
        isStepOneSubmitting: true
      });

    this.isInviteCodeValid();
  };

  checkUserNameAvailable = () => {
    if (this.state.userName.length > 0) {
      AppUtility.isUserNameAvailable(
        this.state.userName,
        data => {
          this.setState(
            {
              isUserNameAvailable: data.available
            },
            () => {
              this.checkIsUserDetailsFullyFilled();
            }
          );
        },
        error => {}
      );
    }
  };

  isInviteCodeValid = () => {
    AppUtility.isInviteCodeValid(
      this.state.inviteCode,
      data => {
        if (data.error) {
          this._isMounted &&
            this.setState({
              isInvalidInviteCode: true,
              isStepOneSubmitting: false,
              invalidInviteCodeMsg:
                'You entered an invalid code. Please try again.'
            });
          this.inviteCode.focus();
          return;
        }

        const { school, section, grade } = data;
        const companyName = school.name;
        const contactPerson = school.contactPerson.name;
        const department = section.name;
        const curriculum = school.curriculum;

        this._isMounted &&
          this.setState({
            grade,
            curriculum,
            schooluuid: school.uuid,
            sectionuuid: section.uuid,
            currentStep: 2,
            isStepOneSubmitting: false,
            companyName,
            department,
            contactPerson
          });
      },
      error => {
        this._isMounted &&
          this.setState({
            isInvalidInviteCode: true,
            isStepOneSubmitting: false,
            invalidInviteCodeMsg: 'Somthing went wrong.'
          });
        this.inviteCode.focus();
      }
    );
  };

  handleUsernameChange = event => {
    this._isMounted &&
      this.setState({ userName: event.target.value }, () => {
        event.persist();
        this.delayedCheckUserNameAvailable(event);
      });
  };

  validateEmail = () => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(this.state.email) && !this.state.email.length <= 0) {
      this.setState(
        {
          isInvalidEmail: true,
          invalidEmailMsg: 'Please enter an valid email'
        },
        () => {
          this.checkIsUserDetailsFullyFilled();
        }
      );
    } else {
      this.setState(
        {
          isInvalidEmail: false,
          invalidEmailMsg: ''
        },
        () => {
          this.checkIsUserDetailsFullyFilled();
        }
      );
    }
  };

  handleChange = event => {
    event.persist();
    this._isMounted &&
      this.setState({ [event.target.name]: event.target.value }, () => {
        if (event.target.name === 'inviteCode') {
          this._isMounted &&
            this.setState({
              isInvalidInviteCode: false
            });
        }
        if (event.target.name === 'name') {
          this._isMounted &&
            this.setState({
              isInvalidName: false
            });
        }
        if (event.target.name === 'userName') {
          this._isMounted &&
            this.setState({
              isInvalidUserName: false
            });
        }
        if (event.target.name === 'email') {
          this._isMounted &&
            this.setState({
              isInvalidEmail: false
            });
          this.validateEmail();
        }
        if (event.target.name === 'password') {
          this._isMounted &&
            this.setState({
              isInvalidPassword: false
            });
        }
        if (event.target.name === 'confirmPassword') {
          this._isMounted &&
            this.setState({
              isInvalidConfirmPassword: false
            });
        }

        if (this.state.password === this.state.confirmPassword) {
          this._isMounted &&
            this.setState({
              isInvalidConfirmPassword: false,
              invalidConfirmPasswordMsg: ''
            });
        }

        this.checkIsUserDetailsFullyFilled();
      });
  };

  checkIsUserDetailsFullyFilled = () => {
    if (
      this.state.confirmPassword.length > 0 &&
      this.state.password.length > 0 &&
      this.state.email.length > 0 &&
      this.state.userName.length > 0 &&
      this.state.name.length > 0 &&
      this.state.isUserNameAvailable &&
      !this.state.isInvalidEmail
    ) {
      this._isMounted &&
        this.setState({
          isUserDetailsFullyFilled: true
        });
    } else {
      this._isMounted &&
        this.setState({
          isUserDetailsFullyFilled: false
        });
    }
  };

  render() {
    return (
      <main className="overall-wrap create-account">
        <Header />
        <section className="body-section">
          <div className="container-wrap">
            <div className="create-acc">
              <div className="signup-heading">
                <p>
                  Step <span className="steps">{this.state.currentStep}</span>{' '}
                  of <span>{this.state.totalSteps}</span>
                </p>
                <h2>Create your account</h2>
              </div>
              <section
                className={
                  this.state.currentStep === 1 ? 'step-1' : 'step-1 hide'
                }
              >
                <form onSubmit={this.submitStepOne}>
                  <label htmlFor="invite_code">Enter your invite code:</label>
                  <input
                    type="text"
                    name="inviteCode"
                    ref={inviteCode => {
                      this.inviteCode = inviteCode;
                    }}
                    disabled={this.state.isStepOneSubmitting ? 'disabled' : ''}
                    className={
                      this.state.isStepOneSubmitting
                        ? 'input-disabled'
                        : this.state.inviteCode.length > 0 &&
                          this.state.isInvalidInviteCode
                        ? 'bg-white error'
                        : this.state.inviteCode.length > 0
                        ? 'bg-white'
                        : ''
                    }
                    onChange={this.handleChange}
                    value={this.state.inviteCode}
                    id="invite_code"
                    autoComplete="off"
                  />
                  {this.state.isInvalidInviteCode && (
                    <p className="signup-toaster">
                      <img src={danger} alt="" />
                      {this.state.invalidInviteCodeMsg}
                    </p>
                  )}
                  <p className="description">
                    * The invitation code was provided to you by your manager or
                    the learning manager responsible for your organization. By
                    entering this code, you prove to us that you are an employee
                    of an organization that we made the application available
                    to. Please keep in mind that the code is case sensitive.
                  </p>
                  <button
                    disabled={this.state.isStepOneSubmitting}
                    type="submit"
                    className={this.state.isStepOneSubmitting ? 'disable' : ''}
                  >
                    {this.state.isStepOneSubmitting
                      ? 'Processing...'
                      : 'Continue'}
                  </button>
                </form>
                <p className="existing-account">
                  Already have an account?{' '}
                  <Link to="/login"> Sign in here.</Link>
                </p>
              </section>

              {/* Step Two */}
              <section
                className={
                  this.state.currentStep === 2 ? 'step-2' : 'step-2 hide'
                }
              >
                <p>Comfirm your company details:</p>
                <div className="company-details">
                  <label htmlFor="company-details">Company</label>
                  <p id="company-details">{this.state.companyName}</p>
                  <label htmlFor="department-details">Department</label>
                  <p id="department-details">{this.state.department}</p>
                  <label htmlFor="contact-details">Contact person:</label>
                  <p id="contact-details">
                    {/* <img src="" alt=" " /> */}
                    {this.state.contactPerson}
                  </p>
                </div>
                <button onClick={() => this.goToStep(3)}>I Confirm</button>
                <p
                  onClick={() => this.goToStep(1)}
                  className="cursor-pointer user-select-none"
                >
                  The information is not correct
                </p>
              </section>
              <section
                className={
                  this.state.currentStep === 3 ? 'step-3' : 'step-3 hide'
                }
              >
                <p>
                  Thank you! Now let's get you all set so that you can start
                  learning in no time!
                </p>
                <form
                  onSubmit={this.submitUserDetails}
                  className="signup-details"
                >
                  <div className="input-wrap">
                    <div className="input-field">
                      <input
                        className={this.state.name.length > 0 ? 'focus' : ''}
                        value={this.state.name}
                        onChange={this.handleChange}
                        autoComplete="off"
                        autoCapitalize="off"
                        type="text"
                        id="name"
                        name="name"
                      />
                      <label htmlFor="name">Name</label>
                      {this.state.isInvalidName && (
                        <p className="signup-toaster">
                          <img src={danger} alt="" />
                          {this.state.invalidNameMsg}
                        </p>
                      )}
                    </div>
                    <div className="input-field">
                      <input
                        className={
                          this.state.userName.length > 0 ? 'focus' : ''
                        }
                        value={this.state.userName}
                        onChange={this.handleUsernameChange}
                        autoComplete="off"
                        autoCapitalize="off"
                        type="text"
                        id="username"
                        name="userName"
                      />
                      <label htmlFor="username">Username</label>
                      {this.state.userName.length > 0 && (
                        <span className="availability">
                          {this.state.isUserNameAvailable === true && (
                            <span className="avail">
                              Available
                              <img src={correct} alt="correct" />
                            </span>
                          )}

                          {this.state.isUserNameAvailable === false && (
                            <span className="not-avail">
                              Not Available <img src={wrong} alt="wrong" />
                            </span>
                          )}
                        </span>
                      )}
                      {this.state.isInvalidUserName && (
                        <p className="signup-toaster">
                          <img src={danger} alt="" />
                          {this.state.invalidUserNameMsg}
                        </p>
                      )}
                    </div>
                    <div className="input-field">
                      <input
                        className={this.state.email.length > 0 ? 'focus' : ''}
                        value={this.state.email}
                        onChange={this.handleChange}
                        onBlur={this.validateEmail}
                        autoComplete="off"
                        autoCapitalize="off"
                        type="text"
                        id="email"
                        name="email"
                      />

                      <label htmlFor="email">Email</label>
                      {this.state.isInvalidEmail && (
                        <p className="signup-toaster">
                          <img src={danger} alt="" />
                          {this.state.invalidEmailMsg}
                        </p>
                      )}
                    </div>
                    <div className="input-field">
                      <input
                        className={
                          this.state.password.length > 0 ? 'focus' : ''
                        }
                        value={this.state.password}
                        onChange={this.handleChange}
                        autoComplete="off"
                        autoCapitalize="off"
                        type="password"
                        id="password"
                        name="password"
                      />
                      <label htmlFor="password">Password</label>
                      {this.state.isInvalidPassword && (
                        <p className="signup-toaster">
                          <img src={danger} alt="" />
                          {this.state.invalidPasswordMsg}
                        </p>
                      )}
                    </div>
                    <div className="input-field">
                      <input
                        className={
                          this.state.confirmPassword.length > 0 ? 'focus' : ''
                        }
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                        autoComplete="off"
                        autoCapitalize="off"
                        type="password"
                        id="confirm_password"
                        name="confirmPassword"
                      />
                      <label htmlFor="confirm_password">Confirm password</label>
                      {this.state.isInvalidConfirmPassword && (
                        <p className="signup-toaster">
                          <img src={danger} alt="" />
                          {this.state.invalidConfirmPasswordMsg}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    disabled={
                      this.state.isUserDetailsSubmitting ||
                      !this.state.isUserDetailsFullyFilled
                    }
                    type="submit"
                    className={
                      this.state.isUserDetailsSubmitting ||
                      !this.state.isUserDetailsFullyFilled
                        ? 'disable'
                        : ''
                    }
                  >
                    {this.state.isUserDetailsSubmitting
                      ? 'Processing...'
                      : 'Continue'}
                  </button>
                </form>
              </section>
              <section
                className={
                  this.state.currentStep === 4 ? 'step-4' : 'step-4 hide'
                }
              >
                <p>Select the skills that you are interested to learn.</p>
                <form onSubmit={this.signUp}>
                  <div className="skills-wrap">
                    {this.state.skills.map(skill => (
                      <div key={skill.snakeCase} className="skill-item">
                        <input
                          type="checkbox"
                          name="skills"
                          onClick={this.handleIntrestedSkills}
                          id={skill.snakeCase}
                          value={skill.snakeCase}
                        />
                        <label htmlFor={skill.snakeCase}>
                          {skill.startCase}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    disabled={this.state.isSignUpSubmitting}
                    type="submit"
                    className={this.state.isSignUpSubmitting ? 'disable' : ''}
                  >
                    {this.state.isSignUpSubmitting
                      ? 'Processing...'
                      : 'Create your account'}
                  </button>
                </form>
              </section>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default SignUp;
