import React from 'react';
import toastr from 'toastr';

import './home.scss';
import Authorization from '../utility/authorization';
import { Link } from 'react-router-dom';
import male from '../assets/images/svg/male.svg';
import female from '../assets/images/svg/female.svg';
import nextarrow from '../assets/images/svg/back-grey.svg';
import AppUtility from '../utility/AppUtility';
import loading from '../assets/images/loading.gif';
import Header from '../global-components/header/HeaderComponent';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogout: false,
      showFullpageLoaderForArticle: true,
      showFullpageLoaderForGamePointsConfig: true,
      showLearnAndAccess: false,
      user: null
    };
  }

  getAllArticles = () => {
    AppUtility.getAllArticles(
      data => {
        if (data) {
          localStorage.removeItem('allArticles');
          localStorage.setItem('allArticles', JSON.stringify(data));
          localStorage.setItem('allArticlesStoredAt', new Date());
        }
        this.setState({
          showFullpageLoaderForArticle: false
        });
      },
      error => {
        toastr.error('Sorry, Somthing went wrong!');
        Authorization.clearLocalStorage();
        window.location = `/`;
      }
    );
  };

  getGamificationPointsConfigration = () => {
    AppUtility.getGamificationPointsConfigration(
      data => {
        if (data) {
          localStorage.removeItem('gamificationPointsConfigration');
          localStorage.setItem(
            'gamificationPointsConfigration',
            JSON.stringify(data)
          );
          localStorage.setItem(
            'gamificationPointsConfigrationStoredAt',
            new Date()
          );
        }
        this.setState({
          showFullpageLoaderForGamePointsConfig: false
        });
      },
      error => {
        toastr.error('Sorry, Somthing went wrong!');
        Authorization.clearLocalStorage();
        window.location = `/`;
      }
    );
  };

  initializeReactGA = () => {
    AppUtility.initializeReactGA('home');
  };

  componentDidMount() {
    this.initializeReactGA();
    this.showLearnAndAccess();
    this.getAllArticles();
    this.getGamificationPointsConfigration();
    this.setState({
      user: Authorization.getAuthUser().user
    });
  }

  showLearnAndAccess = () => {
    let authorizedUserDetails = JSON.parse(
      localStorage.getItem('authorizedUserDetails')
    );

    if (
      process.env.REACT_APP_SHOW_LEARN_AND_ACCESS_SCHOOL_UUID.includes(
        authorizedUserDetails.user.school.uuid
      )
    ) {
      this.setState({
        showLearnAndAccess: true
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <main className="overall-wrap home-page">
          <Header />
          <section className="homepage-body-wrap">
            <div className="user-profile-wrap">
              <div className="user-profile">
                {this.state.user && (
                  <img
                    src={
                      this.state.user.gender.toLowerCase() === 'male'
                        ? male
                        : female
                    }
                    alt="user-avatar"
                  />
                )}
              </div>
              <h1 className="user-name">
                <span>Hello</span>
                {this.state.user && `${this.state.user.name}!`}
              </h1>
            </div>
            <div className="link-respective-pages">
              <p className="respective-mode">
                In what way would you like to learn today?
              </p>
              <div className="modes">
                {this.state.showLearnAndAccess && (
                  <Link className="challenge learn" to="/start-learn">
                    <h2 className="mode-title">Learn</h2>
                    <img src={nextarrow} alt="Learn" />
                  </Link>
                )}

                <Link className="challenge" to="/start-challenge">
                  <h2 className="mode-title">Challenge</h2>
                  <img src={nextarrow} alt="Challenge" />
                </Link>
                <Link className="challenge practice" to="/start-practice">
                  <h2 className="mode-title">Practice</h2>
                  <img src={nextarrow} alt="Practice" />
                </Link>
                <Link className="challenge read" to="/review-list">
                  <h2 className="mode-title">Review</h2>
                  <img src={nextarrow} alt="Review" />
                </Link>

                {this.state.showLearnAndAccess && (
                  <Link className="challenge access" to="/access-chat">
                    <h2 className="mode-title">Access</h2>
                    <img src={nextarrow} alt="Access" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </main>

        <div
          className="ovarlay"
          style={
            this.state.showFullpageLoaderForArticle ||
            this.state.showFullpageLoaderForGamePointsConfig
              ? { display: 'block', backgroundColor: 'rgba(44, 69, 116, 0.7)' }
              : { display: 'none' }
          }
        >
          <div className="popup-wrap">
            <div
              className="popup-content-wrap"
              style={{ maxWidth: 'auto', width: 'auto' }}
            >
              <div className="hint-pop-wrap" style={{ padding: '10px' }}>
                <img src={loading} alt="loading" height="40px" />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
