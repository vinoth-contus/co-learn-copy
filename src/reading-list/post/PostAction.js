import Authorization from '../../utility/authorization';
import axios from '../../utility/axios.js';
import BaseURL from '../../utility/BaseURL';

const READING_LIST_SERVICE_API_ENDPOINT = BaseURL.READING_LIST_SERVICE;

const MAKE_AS_REVIEWED_OR_UNREVIEWED = `${READING_LIST_SERVICE_API_ENDPOINT}/readinglist/mark`;
const CHECK_ARTICLE_IS_ADDED_INTO_USER_LIST = `${READING_LIST_SERVICE_API_ENDPOINT}/readinglist/check`;

class PostAction {
  checkArticleIsAddedToThisUser = (
    topicId,
    articleId,
    successCallback,
    errorCallback
  ) => {
    let userId = Authorization.getAuthUserId();

    let accessToken = Authorization.getAccessToken();
    axios
      .get(
        `${CHECK_ARTICLE_IS_ADDED_INTO_USER_LIST}/${topicId}/${articleId}/${userId}`,
        {
          headers: { Authorization: accessToken }
        }
      )
      .then(response => {
        successCallback(response);
      })
      .catch(error => {
        errorCallback(error);
      });
  };

  markAsReviewedOrUnReviewed = (
    topicId,
    articleId,
    reviewed,
    successCallback,
    errorCallback
  ) => {
    let userId = Authorization.getAuthUserId();
    let accessToken = Authorization.getAccessToken();
    axios
      .put(
        `${MAKE_AS_REVIEWED_OR_UNREVIEWED}/${topicId}/${articleId}/${userId}`,
        {
          reviewed: reviewed
        },
        {
          headers: { Authorization: accessToken }
        }
      )
      .then(response => {
        successCallback(response);
      })
      .catch(error => {
        errorCallback(error);
      });
  };
}

export default new PostAction();
