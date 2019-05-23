class BaseURL {
  static DEFAULT_BASE_API_ENDPOINT = window.location.origin;

  static origin = new URL(window.location.origin);

  static CONTENT_SERVICE =
    this.origin.hostname === 'localhost'
      ? process.env.REACT_APP_CONTENT_SERVICE_API_ENDPOINT
      : `${this.DEFAULT_BASE_API_ENDPOINT}/content`;

  static AUTH_SERVICE =
    this.origin.hostname === 'localhost'
      ? process.env.REACT_APP_AUTH_SERVICE_API_ENDPOINT
      : `${this.DEFAULT_BASE_API_ENDPOINT}/auth`;

  static READING_LIST_SERVICE =
    this.origin.hostname === 'localhost'
      ? process.env.REACT_APP_READING_LIST_SERVICE_API_ENDPOINT
      : `${this.DEFAULT_BASE_API_ENDPOINT}/colearn`;

  static QUIZ_BANK_SERVICE =
    this.origin.hostname === 'localhost'
      ? process.env.REACT_APP_QUIZ_BANK_SERVICE_API_ENDPOINT
      : `${this.DEFAULT_BASE_API_ENDPOINT}/quiz`;

  static PRACTICE_SERVICE =
    this.origin.hostname === 'localhost'
      ? process.env.REACT_APP_PRACTICE_SERVICE_API_ENDPOINT
      : `${this.DEFAULT_BASE_API_ENDPOINT}/practice`;

  static GAMIFICATION_SERVICE =
    this.origin.hostname === 'localhost'
      ? process.env.REACT_APP_GAMIFICATION_SERVICE_API_ENDPOINT
      : `${this.DEFAULT_BASE_API_ENDPOINT}/gamification`;

  static SMART_CHAT_SERVICE =
    this.origin.hostname === 'localhost'
      ? process.env.REACT_APP_SMART_CHAT_SERVICE_API_ENDPOINT
      : `${this.DEFAULT_BASE_API_ENDPOINT}/smartchat`;

  static SKILLS_SERVICE =
    this.origin.hostname === 'localhost'
      ? process.env.REACT_APP_SKILLS_SERVICE_API_ENDPOINT
      : `${this.DEFAULT_BASE_API_ENDPOINT}/learn`;
}

export default BaseURL;
