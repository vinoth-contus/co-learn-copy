import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ReactGA from 'react-ga';

import './assets/scss/responsive.scss';
import './assets/fonts/fonts.css';
import mixpanel from 'mixpanel-browser';

mixpanel.init('60da69e6576bb5ddf8769f5b0231f2d3');
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
