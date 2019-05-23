import React, { Component } from 'react';
import _ from 'lodash';
import AppUtility from '../utility/AppUtility';

import BaseURL from '../utility/BaseURL';
import Authorization from '../utility/authorization';

const CONTENT_SERVICE_API_ENDPOINT = BaseURL.CONTENT_SERVICE;
class ResourseHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      oldImages: [],
      newImages: [],
      html: '',
      isFetching: false
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    if (this.props.imageUrl) {
      this.getImage(this.props.imageUrl);
    }

    if (this.props.htmlPageUrl) {
      this.getHtml(this.props.htmlPageUrl);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getImage = imageUrl => {
    this._isMounted && this.setState({ isFetching: true });
    AppUtility.getImage(
      imageUrl,
      objectURL => {
        this._isMounted &&
          this.setState(
            {
              image: objectURL,
              isFetching: false
            },
            () => {
              if (this.props.resizeWindow) {
                this.props.resizeWindow();
              }
            }
          );
      },
      () => {
        this._isMounted &&
          this.setState({
            isFetching: false
          });
      }
    );
  };

  getHtml = htmlPageUrl => {
    this._isMounted && this.setState({ isFetching: true });
    AppUtility.getHtml(
      htmlPageUrl,
      (html, plainTextLength) => {
        // let html = `<img src="CONTENT_SERVICE/article-images/themes.png"><h1>The Three Ways</h1><img src="CONTENT_SERVICE/article-images/themes.png"><img src="CONTENT_SERVICE/article-images/epics-vs-stories-agile-development.png">`;
        this.replaceImageSrc(html);
        this.props.getNumberOfWords(plainTextLength);
      },
      () => {
        this._isMounted &&
          this.setState({
            isFetching: false
          });
      }
    );
  };

  replaceImageSrc = async html => {
    var d = document.createElement('div');
    d.innerHTML = html;

    for (let index = 0; index < d.getElementsByTagName('img').length; index++) {
      const element = d.getElementsByTagName('img')[index];
      let imagePath = element.getAttribute('src');
      let requestImagePath = imagePath.replace('CONTENT_SERVICE', '');
      let objectURL = await this.fetchImage(requestImagePath);
      html = html.replace(imagePath, objectURL);
    }
    this._isMounted &&
      this.setState({
        isFetching: false,
        html: html
      });
  };

  fetchImage = imagePath => {
    let accessToken = Authorization.getAccessToken();
    let url = CONTENT_SERVICE_API_ENDPOINT + imagePath;
    return new Promise(function(resolve, reject) {
      fetch(url, {
        headers: { Authorization: accessToken }
      })
        .then(response => {
          return response.blob();
        })
        .then(blob => {
          let objectURL = URL.createObjectURL(blob);
          resolve(objectURL);
        });
    });
  };

  shouldComponentUpdate(nextprops) {
    if (this.props.imageUrl !== nextprops.imageUrl) {
      this.getImage(nextprops.imageUrl);
    }
    return true;
  }

  returnJSX = () => {
    let props = _.omit(
      this.props,
      'imageUrl',
      'isImageSrc',
      'isBgImage',
      'resizeWindow'
    );

    if (this.props.isImageSrc) {
      return <img alt="" src={this.state.image} {...props} />;
    } else if (this.props.isBgImage) {
      return (
        <div
          style={{ backgroundImage: `url(${this.state.image})` }}
          {...props}
        />
      );
    } else if (this.props.htmlPageUrl) {
      return <div dangerouslySetInnerHTML={{ __html: this.state.html }} />;
    } else {
      return '';
    }
  };

  render() {
    if (!this.state.isFetching) {
      return this.returnJSX();
    } else {
      return '';
    }
  }
}

export default ResourseHandler;
