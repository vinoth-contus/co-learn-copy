import Utility from '../utility/Utility';
import axios from '../utility/axios.js';
import BaseURL from '../utility/BaseURL';
import mixpanel from 'mixpanel-browser';

const AUTH_SERVICE = BaseURL.AUTH_SERVICE;
const ACCESS_TOKEN_REFRESH_ENDPOINT = `${AUTH_SERVICE}/api/users/accesstoken/refresh`;

class Authorization {
  /**
   * set auth user details to class property
   *
   * @return void
   */
  setAuthUser() {
    this.authUser = JSON.parse(localStorage.getItem('authorizedUserDetails'));
  }

  /**
   * check is active user is logged in
   *
   * @return boolean
   */
  isLoggedIn() {
    return typeof localStorage.getItem('authorizedUserDetails') === 'string';
  }

  /**
   * get logged in user details
   *
   * @return boolean
   */
  getAuthUser() {
    if (this.isLoggedIn()) {
      this.setAuthUser();
    }
    return this.authUser;
  }

  /**
   * get auth user identifier
   *
   * @return int
   */
  getAuthUserId() {
    let data = this.getAuthUser();
    return Utility.isObject(data.user) && data.user.username
      ? data.user.username
      : '';
  }

  getUserRole() {
    let data = this.getAuthUser();
    if (data) {
      return Utility.isObject(data.user) && data.user.role
        ? data.user.role
        : '';
    }
  }

  /**
   * Get authentication access token
   *
   * @return string
   */
  getAccessToken() {
    let accessToken = null;
    let authUser = this.getAuthUser();
    if (authUser && Utility.isString(authUser.accesstoken)) {
      accessToken = 'Bearer ' + authUser.accesstoken;
    }

    return accessToken;
  }

  /**
   * login the user by setting it in local storage
   *
   * @return boolean
   */
  login(userDetails) {
    const studentDetails = {
      uuid: userDetails.user.uuid,
      username: userDetails.user.username,
      grade: userDetails.user.grade,
      name: userDetails.user.name,
      school: userDetails.user.school.name,
      section: userDetails.user.section.map(sec => {
        return sec.uuid;
      }),
      email: userDetails.user.email,
      mobile: userDetails.user.mobile,
      environment: 'Login Page'
    };

    /**
     * Mixpanel tracking code
     */
    mixpanel.track('Login', { ...studentDetails });
    mixpanel.identify(userDetails.user.uuid);
    mixpanel.opt_in_tracking();
    mixpanel.people.set(studentDetails);

    if (typeof Storage !== 'undefined') {
      localStorage.removeItem('authorizedUserDetails');
      localStorage.setItem(
        'authorizedUserDetails',
        JSON.stringify(userDetails)
      );
    } else {
      console.error('local storage is not supported');
    }
  }

  /**
   * get logged in user details
   *
   * @return boolean
   */
  logout() {
    if (typeof Storage !== 'undefined') {
      this.clearLocalStorage();
      window.location = '/login';
      this.authUser = null;
    } else {
      console.error('local storage is not supported');
    }
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  /**
   * Once user is logged in, redirect the user to view permission page
   * By default will redirect to 'dashboard' page.
   * If user does not have permission to access dashboard page,
   * find the view permission page from the his permission object
   * and redirect the user to respective path.
   *
   * @param {*} props
   */
  redirectAfterLogin(props) {
    props.history.push('/');
  }

  /**
   * Get authentication access tokenf for access image
   *
   * @return string
   */
  authUserAccessToken() {
    let accessToken = null;
    let authUser = this.getAuthUser();
    if (authUser && Utility.isString(authUser.accesstoken)) {
      accessToken = authUser.accesstoken;
    }
    return accessToken;
  }

  refreshAccessToken(successCallback, errorCallBack) {
    return new Promise((resolve, reject) => {
      let accessToken = this.authUserAccessToken();
      return axios
        .post(ACCESS_TOKEN_REFRESH_ENDPOINT, {
          accesstoken: accessToken
        })
        .then(response => {
          if (response.data && response.data.accesstoken) {
            let authorizedUserDetailsJson = localStorage.getItem(
              'authorizedUserDetails'
            );
            let authorizedUserDetails = JSON.parse(authorizedUserDetailsJson);
            authorizedUserDetails.accesstoken = response.data.accesstoken;

            localStorage.setItem(
              'authorizedUserDetails',
              JSON.stringify(authorizedUserDetails)
            );
            successCallback();
            resolve(response.data.message);
          } else {
            reject();
            errorCallBack();
          }
        })
        .catch(error => {
          this.logout();
          errorCallBack();
          reject(error);
        });
    });
  }
}

export default new Authorization();
