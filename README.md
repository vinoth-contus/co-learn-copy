This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Docker

Create envriment files named .env.development.local and .env.production.local

The env variables inside these files are listed below:

REACT_APP_PRACTICE_HINT_TIMER=5000
REACT_APP_CHALLENGE_NEXT_QUESTION_TIMER=5
REACT_APP_ARTICLE_LIST_CACHE_EXPIRY_TIME=86400000
REACT_APP_WORDS_PER_SEC=3
REACT_APP_QUESTION_COUNT=10

REACT_APP_CONTENT_SERVICE_API_ENDPOINT=http://internal-dev2-co-learn.saal.ai:30638
REACT_APP_AUTH_SERVICE_API_ENDPOINT=http://internal-dev2-co-learn.saal.ai:30637/auth
REACT_APP_READING_LIST_SERVICE_API_ENDPOINT=http://internal-dev2-co-learn.saal.ai:30609
REACT_APP_QUIZ_BANK_SERVICE_API_ENDPOINT=http://internal-dev2-co-learn.saal.ai:30608
REACT_APP_PRACTICE_SERVICE_API_ENDPOINT=http://internal-dev2-co-learn.saal.ai:30622
REACT_APP_GAMIFICATION_SERVICE_API_ENDPOINT=http://internal-dev2-co-learn.saal.ai:30646
REACT_APP_GA_TRACKING_ID=UA‌---------1

REACT_APP_DANGER_COLOR=ff7b8b
REACT_APP_SUCCESS_COLOR=7ed321
REACT_APP_WARNING_COLOR=f5a623

REACT_APP_DANGER_START_RANGE=0
REACT_APP_DANGER_END_RANGE=33

REACT_APP_WARNING_START_RANGE=34
REACT_APP_WARNING_END_RANGE=66

REACT_APP_SUCCESS_START_RANGE=67
REACT_APP_SUCCESS_END_RANGE=100

And then run
./start.sh

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
