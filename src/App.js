import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Layout from './layout/LayoutComponent';
import Login from './login/LoginComponent';
import Home from './home/HomeComponent';
import Practice from './practice/PracticeComponent';
import EndPractice from './practice/end-practice/EndPracticeComponent';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import PracticeQuestion from './practice/question/QuestionComponent';
import Challenge from './challenge/ChallengeComponent';
import EndChallenge from './challenge/end-challenge/EndChallengeComponent';
import ReadingList from './reading-list/ReadingListComponent';
import ChallengeSummary from './challenge/challenge-summary/ChallengeSummaryComponent';
import ReviewedReadingList from './reading-list/reviewed-reading-list/ReviewedReadingListComponent';
import TeamPerformance from './team-performance/TeamPerformanceComponent';
import ChallengeQuestion from './challenge/question/QuestionComponent';
import MyPerformance from './my-performance/MyPerformanceComponent';
import Profile from './profile/ProfileComponent';
import ProfileEdit from './profile/profile-edit/ProfileEditComponent';
import MemberPerformance from './member-performance/MemberPerformanceComponent';
import Accesschat from './access-chat/Accesschat';
import Learn from './learn/Learn';
import SignUp from './sign-up/SignUpComponent';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/home" component={Home} />
          <PublicRoute exact path="/login" component={Login} />
          <PublicRoute exact path="/sign-up" component={SignUp} />

          <PrivateRoute exact path="/start-practice" component={Practice} />
          <PrivateRoute exact path="/end-practice" component={EndPractice} />

          <PrivateRoute exact path="/start-challenge" component={Challenge} />
          <PrivateRoute exact path="/end-challenge" component={EndChallenge} />

          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/profile-edit" component={ProfileEdit} />

          <PrivateRoute exact path="/review-list" component={ReadingList} />

          <PrivateRoute exact path="/access-chat" component={Accesschat} />
          <PrivateRoute exact path="/start-learn" component={Learn} />

          <PrivateRoute
            exact
            path="/challenge-summary"
            component={ChallengeSummary}
          />

          <PrivateRoute
            exact
            path="/question-practice"
            component={PracticeQuestion}
          />

          <PrivateRoute
            exact
            path="/question-challenge"
            component={ChallengeQuestion}
          />

          <PrivateRoute
            exact
            path="/reviewed-items"
            component={ReviewedReadingList}
          />
          <PrivateRoute
            exact
            path="/team-performance"
            component={TeamPerformance}
          />
          <PrivateRoute
            exact
            path="/my-performance"
            component={MyPerformance}
          />

          <PrivateRoute
            exact
            path="/member-performance/:user_id"
            component={MemberPerformance}
          />
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
