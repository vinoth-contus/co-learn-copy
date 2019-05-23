import Authorization from '../utility/authorization';
import axios from '../utility/axios.js';
import ReactGA from 'react-ga';
import BaseURL from '../utility/BaseURL';
import moment from 'moment';

const AUTH_SERVICE = BaseURL.AUTH_SERVICE;
const CONTENT_SERVICE_API_ENDPOINT = BaseURL.CONTENT_SERVICE;
const PRACTICE_SERVICE_API_ENDPOINT = BaseURL.PRACTICE_SERVICE;
const SKILLS_SERVICE_API_ENDPOINT = BaseURL.SKILLS_SERVICE;
const QUIZ_BANK_SERVICE_API_ENDPOINT = BaseURL.QUIZ_BANK_SERVICE;
const READING_LIST_SERVICE_API_ENDPOINT = BaseURL.READING_LIST_SERVICE;
const GAMIFICATION_SERVICE_API_ENDPOINT = BaseURL.GAMIFICATION_SERVICE;

const INVITE_CODE_ENDPOINT = `${AUTH_SERVICE}/inviteCode`;
const CHECK_USERNAME_ENDPOINT = `${AUTH_SERVICE}/api/users/validateusername`;
const SIGNUP_ENDPOINT = `${AUTH_SERVICE}/api/users`;

const ALL_TOPIC_LIST_ENDPOINT = `${READING_LIST_SERVICE_API_ENDPOINT}/article`;
const READING_LIST_ENDPOINT = `${READING_LIST_SERVICE_API_ENDPOINT}/readinglist`;
const ADD_ARTICLE_TO_READING_LIST_END_POINT = `${READING_LIST_SERVICE_API_ENDPOINT}/readinglist`;

const QUESTIONS_ENDPOINT = `${QUIZ_BANK_SERVICE_API_ENDPOINT}/questions/quiz`;

const POST_ANSWERS_ENDPOINT = `${PRACTICE_SERVICE_API_ENDPOINT}/me/colearn/postProgress`;
const GET_SKILLS_BY_CURRICULUM_ENDPOINT = `${SKILLS_SERVICE_API_ENDPOINT}/me/subjects`;
const GET_USER_PROGRESS_ENDPOINT = `${PRACTICE_SERVICE_API_ENDPOINT}/me/colearn/user/stats`;
const GET_USER_POINT_STATS_ENDPOINT = `${PRACTICE_SERVICE_API_ENDPOINT}/me/colearn/user/pointStats`;
const GET_TEAM_MEMBER_PROGRESS_ENDPOINT = `${PRACTICE_SERVICE_API_ENDPOINT}/me/colearn/team/stats`;

const GAMIFICATION_CONFIGRATION_ENDPOINT = `${GAMIFICATION_SERVICE_API_ENDPOINT}/rewards/colearn/expose/configuration`;
class AppUtility {
  initializeReactGA(page) {
    ReactGA.pageview(page);
  }

  isInviteCodeValid = (inviteCode, successCallback, errorCallback) => {
    axios
      .get(`${INVITE_CODE_ENDPOINT}/${inviteCode}`)
      .then(response => {
        successCallback(response.data);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  isUserNameAvailable = (userName, successCallback, errorCallback) => {
    axios
      .get(`${CHECK_USERNAME_ENDPOINT}/${userName}`)
      .then(response => {
        successCallback(response.data);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  signUp = (userDetails, successCallback, errorCallback) => {
    axios
      .post(`${SIGNUP_ENDPOINT}`, userDetails)
      .then(response => {
        successCallback(response.data);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  getSkills = (curriculum, grade, successCallback, errorCallback) => {
    axios
      .get(`${GET_SKILLS_BY_CURRICULUM_ENDPOINT}/${curriculum}/${grade}`)
      .then(response => {
        successCallback(response.data);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  getAllArticles = (successCallback, errorCallback) => {
    let currentdate = new Date();
    let allArticlesStoredAtString = localStorage.getItem('allArticlesStoredAt');
    let allArticlesStoredAt = new Date(allArticlesStoredAtString);
    let twentyFourHours = process.env.REACT_APP_ARTICLE_LIST_CACHE_EXPIRY_TIME;

    if (currentdate - allArticlesStoredAt > twentyFourHours) {
      let accessToken = Authorization.getAccessToken();
      axios
        .get(ALL_TOPIC_LIST_ENDPOINT, {
          headers: { Authorization: accessToken }
        })
        .then(response => {
          if (typeof Storage !== 'undefined') {
            successCallback(response.data);
          } else {
            errorCallback();
          }
        })
        .catch(error => {
          errorCallback(error);
        });
    } else {
      successCallback();
    }
  };

  getGamificationPointsConfigration = (successCallback, errorCallback) => {
    let currentdate = new Date();
    let gamificationPointsConfigrationStoredAtString = localStorage.getItem(
      'gamificationPointsConfigrationStoredAt'
    );
    let gamificationPointsConfigrationStoredAt = new Date(
      gamificationPointsConfigrationStoredAtString
    );
    let twentyFourHours = process.env.REACT_APP_ARTICLE_LIST_CACHE_EXPIRY_TIME;

    if (
      currentdate - gamificationPointsConfigrationStoredAt >
      twentyFourHours
    ) {
      let accessToken = Authorization.getAccessToken();
      axios
        .get(GAMIFICATION_CONFIGRATION_ENDPOINT, {
          headers: { Authorization: accessToken }
        })
        .then(response => {
          if (typeof Storage !== 'undefined') {
            successCallback(response.data);
          } else {
            errorCallback();
          }
        })
        .catch(error => {
          errorCallback(error);
        });
    } else {
      successCallback();
    }
  };

  addToReadingList = (
    topicId,
    articleId,
    userId,
    isCorrect,
    byUser,
    successCallback,
    errorCallback
  ) => {
    let accessToken = Authorization.getAccessToken();
    axios
      .post(
        ADD_ARTICLE_TO_READING_LIST_END_POINT,
        {
          topic_id: topicId,
          article_id: articleId,
          user_id: userId,
          correct: isCorrect,
          by_user: byUser
        },
        { headers: { Authorization: accessToken } }
      )
      .then(response => {
        successCallback(response);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  getReadingList = (status, successCallback, errorCallback) => {
    let userId = Authorization.getAuthUserId();
    let accessToken = Authorization.getAccessToken();
    axios
      .get(`${READING_LIST_ENDPOINT}/${status}/${userId}`, {
        headers: { Authorization: accessToken }
      })
      .then(response => {
        successCallback(response);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  getQuestions = (params, successCallback, errorCallback) => {
    let accessToken = Authorization.getAccessToken();
    axios
      .get(QUESTIONS_ENDPOINT, {
        headers: {
          Authorization: accessToken
        },
        params: params
      })
      .then(response => {
        successCallback(response);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  postAnswers = (requestBody, mode, successCallback, errorCallback) => {
    let accessToken = Authorization.getAccessToken();
    axios
      .post(`${POST_ANSWERS_ENDPOINT}/${mode}`, requestBody, {
        headers: { Authorization: accessToken }
      })
      .then(response => {
        successCallback(response);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  getHtml = (
    htmlPageUrl,
    successCallback,
    errorCallback,
    attemptAfterRefreshToken
  ) => {
    if (htmlPageUrl) {
      let accessToken = Authorization.getAccessToken();
      let url = CONTENT_SERVICE_API_ENDPOINT + htmlPageUrl;
      fetch(url, {
        headers: { Authorization: accessToken }
      })
        .then(response => {
          if (
            response &&
            response.status === 401 &&
            attemptAfterRefreshToken === undefined
          ) {
            Authorization.refreshAccessToken(
              () => {
                this.getHtml(
                  htmlPageUrl,
                  (html, plainTextLength) => {
                    successCallback(html, plainTextLength);
                    return;
                  },
                  () => {
                    errorCallback();
                  },
                  1
                );
              },
              () => {
                errorCallback();
              }
            );
          } else if (response && response.status === 200) {
            return response.text();
          } else {
            errorCallback();
          }
        })
        .then(html => {
          let plainText = html.replace(/<\/?[^>]+(>|$)/g, '');
          let plainTextLength = plainText.split(' ').length;

          successCallback(html, plainTextLength);
        })
        .catch(() => {
          errorCallback();
        });
    } else {
      return errorCallback();
    }
  };

  getImage = (
    imageUrl,
    successCallback,
    errorCallback,
    attemptAfterRefreshToken
  ) => {
    if (imageUrl) {
      let accessToken = Authorization.getAccessToken();
      let url = CONTENT_SERVICE_API_ENDPOINT + imageUrl;
      fetch(url, {
        headers: { Authorization: accessToken }
      })
        .then(response => {
          if (
            response &&
            response.status === 401 &&
            attemptAfterRefreshToken === undefined
          ) {
            Authorization.refreshAccessToken(
              () => {
                this.getImage(
                  imageUrl,
                  objectURL => {
                    successCallback(objectURL);
                    return;
                  },
                  () => {
                    errorCallback();
                  },
                  1
                );
              },
              () => {
                errorCallback();
              }
            );
          } else if (response && response.status === 200) {
            return response.blob();
          } else {
            errorCallback();
          }
        })
        .then(blob => {
          let objectURL = URL.createObjectURL(blob);
          successCallback(objectURL);
        })
        .catch(() => {
          errorCallback();
        });
    } else {
      return errorCallback();
    }
  };

  getUserPointStats = (filter, userId, successCallback, errorCallback) => {
    let accessToken = Authorization.getAccessToken();
    let params = {};
    if (userId) {
      params = { userId: userId };
    }
    axios
      .get(`${GET_USER_POINT_STATS_ENDPOINT}?filter=${filter}`, {
        headers: { Authorization: accessToken },
        params: params
      })
      .then(response => {
        successCallback(response.data);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  getUserProgress = (successCallback, errorCallback, userId) => {
    let accessToken = Authorization.getAccessToken();
    let params = {};
    if (userId) {
      params = { userId: userId };
    }
    axios
      .get(`${GET_USER_PROGRESS_ENDPOINT}`, {
        headers: { Authorization: accessToken },
        params: params
      })
      .then(response => {
        successCallback(response.data);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  getTeamMemberStats = (
    successCallback,
    errorCallback,
    month,
    year,
    showAll
  ) => {
    let startDate = null;
    let endDate = null;

    if (!month) {
      month = moment().format('MM');
    }

    if (month.toString().length === 1) {
      month = `0${month.toString()}`;
    }

    if (!year) {
      year = moment().format('YYYY');
    }

    if (showAll) {
      startDate = moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD');

      endDate = moment().format('YYYY-MM-DD');
    } else {
      startDate = moment(`${year}-${month}`)
        .startOf('month')
        .format('YYYY-MM-DD');

      endDate = moment(`${year}-${month}`)
        .endOf('month')
        .format('YYYY-MM-DD');
    }

    let authorizedUserDetails = JSON.parse(
      localStorage.getItem('authorizedUserDetails')
    );

    let sectionuuids = '';

    if (
      authorizedUserDetails &&
      authorizedUserDetails.user &&
      authorizedUserDetails.user.section &&
      Array.isArray(authorizedUserDetails.user.section)
    ) {
      sectionuuids = authorizedUserDetails.user.section
        .map(section => section.uuid)
        .toString();
    }

    let params = { from: startDate, to: endDate, sectionuuids: sectionuuids };

    let accessToken = Authorization.getAccessToken();
    axios
      .get(GET_TEAM_MEMBER_PROGRESS_ENDPOINT, {
        headers: { Authorization: accessToken },
        params: params
      })
      .then(response => {
        successCallback(response.data);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  calculatePointsForAQuestion = (
    mode,
    ch,
    cl,
    isIncorrectAnswers,
    successCallback
  ) => {
    let gamificationPointsConfigration = JSON.parse(
      localStorage.getItem('gamificationPointsConfigration')
    );

    if (isIncorrectAnswers) {
      ch = 0;
      cl = 0;
    }

    let {
      without_using_hint,
      using_hint,
      first_half,
      second_half,
      incorrect_ans
    } = gamificationPointsConfigration;

    let ph = 0;
    let pl = 0;

    if (mode === 'practice') {
      ph = without_using_hint;
      pl = using_hint;
    } else if (mode === 'challenge') {
      ph = first_half;
      pl = second_half;
    }

    let pi = incorrect_ans;

    successCallback(ch * ph + cl * pl + isIncorrectAnswers * pi);
  };
}

export default new AppUtility();
