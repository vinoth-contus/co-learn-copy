import React, { Component } from 'react';
import './login.scss';
import logo from '../assets/images/logo.png';
import danger from '../assets/images/svg/danger.svg';
import toastr from 'toastr';
import AppUtility from '../utility/AppUtility';
import Authorization from '../utility/authorization';
import axios from '../utility/axios.js';
import BaseURL from '../utility/BaseURL';

const AUTH_SERVICE = BaseURL.AUTH_SERVICE;
const LOGIN_ENDPOINT = `${AUTH_SERVICE}/api/users/sign-in?role=teacher,student`;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isSubmitting: false,
      isUsernameValid: false,
      isPasswordValid: false
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });

    if (event.target.name === 'username') {
      this.setState({
        isUsernameValid: false
      });
    } else if (event.target.name === 'password') {
      this.setState({
        isPasswordValid: false
      });
    }
  };

  initializeReactGA = () => {
    AppUtility.initializeReactGA('login');
  };

  componentDidMount() {
    this.initializeReactGA();
    this.username.focus();
  }

  login = event => {
    event.preventDefault();

    if (this.state.username.length === 0 && this.state.password.length === 0) {
      this.username.focus();
      this.setState({
        isUsernameValid: true,
        isPasswordValid: true
      });
      return;
    }

    if (this.state.username.length === 0) {
      this.username.focus();
      this.setState({
        isUsernameValid: true
      });
      return;
    }

    if (this.state.password.length === 0) {
      this.password.focus();
      this.setState({
        isPasswordValid: true
      });
      return;
    }

    this.setState({ isSubmitting: true });

    axios
      .post(LOGIN_ENDPOINT, {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        this.setState({ isSubmitting: false });

        Authorization.login(response.data);
        Authorization.redirectAfterLogin(this.props);
      })
      .catch(error => {
        this.setState({ isSubmitting: false });
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toastr.error(error.response.data.error);
        } else {
          toastr.error('Sorry, Somthing went wrong!');
        }
      });
  };

  render() {
    return (
      <section className="loginbg">
        <div className="bg-wrap" />
        <div className="login-content-wrap">
          <h1>
            <img src={logo} alt="Logo" />
          </h1>

          <div className="login-credential-wrap">
            <form onSubmit={this.login}>
              <div className="input-wrap">
                <div className="input-field">
                  <div className="credential-field">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      onChange={this.handleChange}
                      value={this.state.username}
                      autoComplete="off"
                      autoCapitalize="off"
                      ref={username => {
                        this.username = username;
                      }}
                    />
                    <label
                      className={
                        this.state.username === '' ? '' : 'move-label-to-top'
                      }
                      htmlFor="username"
                    >
                      Enter Username
                    </label>
                  </div>
                  {this.state.isUsernameValid === true && (
                    <span className="login-toaster">
                      <img src={danger} alt="" />
                      Please enter your username
                    </span>
                  )}
                </div>
                <div className="input-field bbot-zero">
                  <div className="credential-field">
                    <input
                      type="password"
                      name="password"
                      autoComplete="off"
                      onChange={this.handleChange}
                      value={this.state.password}
                      ref={password => {
                        this.password = password;
                      }}
                    />
                    <label
                      className={
                        this.state.password === '' ? '' : 'move-label-to-top'
                      }
                      htmlFor="password"
                    >
                      Enter Password
                    </label>
                  </div>

                  {this.state.isPasswordValid === true && (
                    <span className="login-toaster">
                      <img src={danger} alt="" />
                      Please enter your password
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={this.state.isSubmitting}
                className="login-btn blue-btn"
              >
                {this.state.isSubmitting ? 'Processing...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;
