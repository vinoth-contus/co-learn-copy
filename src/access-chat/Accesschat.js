import axios from '../utility/axios.js';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import close from '../assets/images/svg/close-grey.svg';
import accees from '../assets/images/access-chat.png';
import './accesschat.scss';
import Authorization from '../utility/authorization';
import BaseURL from '../utility/BaseURL';

import male from '../assets/images/svg/male.svg';
import female from '../assets/images/svg/female.svg';
// import eye from '../assets/images/svg/eye.svg';
import chatAgent from '../assets/images/chat-agent.png';

const SMART_CHAT_SERVICEAPI_ENDPOINT = BaseURL.SMART_CHAT_SERVICE;
const POST_CHAT_ENDPOINT = `${SMART_CHAT_SERVICEAPI_ENDPOINT}/api/v1/qna/withImage`;

class Accesschat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      messages: [
        {
          message:
            'Welcome to Access chat! If you are trying to remember specific information that you learned in training, I can help you. Just ask me and I will find that information for you.',
          user: 'agent'
        }
      ],
      value: '',
      submitting: false
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  componentDidMount() {
    this.setState({
      user: Authorization.getAuthUser().user
    });
  }

  postMessage = (message, params, successCallback, errorCallback) => {
    let accessToken = Authorization.getAccessToken();

    let userId = Authorization.getAuthUserId();

    let authorizedUserDetails = JSON.parse(
      localStorage.getItem('authorizedUserDetails')
    );
    let {
      grade,
      gender,
      curriculum,
      section,
      school: { name: schoolName }
    } = authorizedUserDetails.user;

    let sections = [];
    for (var i of section) {
      sections.push(i.uuid);
    }

    gender = gender.toLowerCase() === 'male' ? 'M' : 'F';

    let subjects = '';
    if (authorizedUserDetails.user.interest) {
      subjects = authorizedUserDetails.user.interest.toString();
    }

    let requestBody = {
      userid: userId,
      grade: grade,
      gender: gender,
      curriculum: curriculum,
      subject: subjects,
      school_name: schoolName,
      section: sections.toString(),
      question: message
    };

    let url = `${POST_CHAT_ENDPOINT}`;
    if (params) {
      url = `${POST_CHAT_ENDPOINT}?preferred=true`;
    }
    axios
      .post(`${url}`, requestBody, {
        headers: { Authorization: accessToken }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response);
        }
      })
      .catch(error => {
        if (errorCallback) {
          errorCallback(error);
        }
      });
  };

  submitSuggestion = suggestion => {
    this.setState(
      {
        value: suggestion
      },
      () => {
        this.handleSubmit();
      }
    );
  };

  handleSubmit = event => {
    let params = null;
    if (event) {
      event.preventDefault();
    } else {
      params = {
        preferred: true
      };
    }

    if (this.state.value === '' || this.state.submitting) {
      return;
    }

    this.setState({
      submitting: true,
      value: ''
    });

    this.setState(
      {
        message: this.state.messages.push({
          message: this.state.value,
          user: 'user',
          gender: this.state.user.gender.toLowerCase()
        })
      },
      () => {
        var objDiv = document.getElementById('chat_body');
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    );

    this.postMessage(
      this.state.value,
      params,
      response => {
        this.setState(
          {
            submitting: false,
            message: this.state.messages.push({
              message: response.data.answer,
              user: 'agent',
              suggestions: response.data.suggestions
            })
          },
          () => {
            var objDiv = document.getElementById('chat_body');
            objDiv.scrollTop = objDiv.scrollHeight;
          }
        );
      },
      error => {
        this.setState({
          submitting: false,
          value: ''
        });
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <main className="overall-wrap practice-page" id="max-width-halfthird">
          <div className="header-section">
            <Link to="/" className="close-grey">
              <img src={close} alt="Close-icon" />
            </Link>
          </div>
          <section className="body-section">
            <div className="wrapper access-chat">
              <div className="dumbells">
                <img src={accees} alt="Access Chat" />
              </div>

              <div className="practice-cotent">
                <div className="category-title">
                  <div className="category-bor skill-title">
                    <h2>Access</h2>
                  </div>
                </div>

                <div className="chat-box" id="chat_body">
                  <ChatMessages
                    submitSuggestion={this.submitSuggestion}
                    messages={this.state.messages}
                  />
                </div>

                <div className="message-box">
                  <form onSubmit={this.handleSubmit}>
                    <input
                      autoFocus
                      type="text"
                      value={this.state.value}
                      onChange={this.handleChange}
                      placeholder="Type your question…"
                    />
                  </form>
                  <span
                    style={{
                      cursor: this.state.submitting ? 'not-allowed' : 'pointer'
                    }}
                    onClick={this.handleSubmit}
                    title="Send"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

function ChatMessages(props) {
  const messages = props.messages;
  const submitSuggestion = props.submitSuggestion;

  if (!messages) {
    return <div />;
  }

  const chatMessages = messages.map((message, index) => (
    <div className="chat-row" key={index}>
      <img
        className="avatar"
        src={
          message.user === 'user'
            ? message.gender === 'male'
              ? male
              : female
            : chatAgent
        }
        alt=""
        title=""
      />
      <div className="chat-response">
        <p>{message.message}</p>
      </div>

      {message.suggestions && message.suggestions.length > 0 && (
        <div className="topic-action">
          <ChatSuggestions
            submitSuggestion={submitSuggestion}
            suggestions={message.suggestions}
          />
        </div>
      )}
    </div>
  ));

  return chatMessages;
}

function ChatSuggestions(props) {
  const suggestions = props.suggestions;
  const submitSuggestion = props.submitSuggestion;

  const chatSuggestions = suggestions.map((suggestion, index) => (
    <span
      className="action_one"
      onClick={() => {
        submitSuggestion(suggestion);
      }}
      key={index}
    >
      {suggestion}
    </span>
  ));

  return chatSuggestions;
}

export default Accesschat;
