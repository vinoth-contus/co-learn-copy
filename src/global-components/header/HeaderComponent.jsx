import React, { Component } from 'react';
import './header.scss';

// import logout from '../../assets/images/svg/logout.svg';
// import logoutwhite from '../../assets/images/svg/logout-white.svg';
import Authorization from '../../utility/authorization';
import { NavLink } from 'react-router-dom';
import logoweb from '../../assets/images/weblogo.png';
import home from '../../assets/images/svg/home.svg';
import achivements from '../../assets/images/svg/achivements.svg';
import profile from '../../assets/images/svg/profile.svg';
import close from '../../assets/images/svg/close-white.svg';
import teamperformance from '../../assets/images/svg/teamperformance.svg';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobileNavOpened: false,
      showLogout: false,
      userRole: ''
    };
  }

  logout = () => {
    Authorization.logout(this.props);
  };

  getUserRole = () => {
    let userRole = Authorization.getUserRole();
    if (userRole) {
      this.setState({
        userRole: userRole.toLowerCase()
      });
    }
  };

  showLogout = () => {
    this.setState({
      showLogout: true
    });
  };

  openMobileNav = () => {
    this.setState({
      isMobileNavOpened: true
    });
  };

  closeMobileNav = () => {
    this.setState({
      isMobileNavOpened: false
    });
  };
  componentDidMount() {
    this.getUserRole();
  }

  render() {
    return (
      <header className={this.state.isMobileNavOpened ? 'nav-open' : ''}>
        <NavLink to="/">
          <img src={logoweb} alt="logo" className="saal-logo" />
        </NavLink>
        {this.state.userRole && (
          <nav>
            <ul>
              <li className="nav-links">
                <NavLink exact to="/" activeClassName="active">
                  <img src={home} alt="info" />
                  Home
                </NavLink>
              </li>
              {this.state.userRole !== 'student' && (
                <li className="nav-links">
                  <NavLink
                    exact
                    to="/team-performance"
                    activeClassName="active"
                  >
                    <img
                      src={teamperformance}
                      alt="info"
                      className="achiv-avatar"
                    />
                    Team Performance
                  </NavLink>
                </li>
              )}
              <li className="nav-links">
                <NavLink exact to="/my-performance" activeClassName="active">
                  <img src={achivements} alt="info" className="achiv-avatar" />
                  My Performance
                </NavLink>
              </li>
              <li className="nav-links home-profile" onClick={this.showLogout}>
                <NavLink exact to="/profile" activeClassName="active">
                  <img src={profile} alt="info" className="profile-avatar" />
                  Profile
                </NavLink>
                {/* <ul
                className={
                  this.state.showLogout
                    ? 'profile-dropper showLogout'
                    : 'profile-dropper'
                }
              >
                <li onClick={this.logout}>
                  <span>
                    <img
                      src={logout}
                      alt="logout-icon"
                      className="logout-icon"
                    />
                    Logout
                  </span>
                </li>
              </ul> */}
              </li>
              {/* <li
              onClick={this.logout}
              className="nav-links logout-web cursor-pointer"
            >
              <span>
                <img src={logoutwhite} alt="info" className="logout-white" />
                Logout
              </span>
            </li> */}
            </ul>
          </nav>
        )}
        {this.state.userRole && (
          <div
            className="hamburger cursor-pointer"
            onClick={this.openMobileNav}
          >
            <span />
            <span />
            <span />
          </div>
        )}

        {this.state.userRole && (
          <button className="close-app" onClick={this.closeMobileNav}>
            <img src={close} alt="app-close" />
          </button>
        )}
      </header>
    );
  }
}

export default Header;
