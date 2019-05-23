import React, { Component } from 'react';
import ResourseHandler from '../../global-components/ResourseHandlerComponent';

class ArticleListComponent extends Component {
  render() {
    const list = this.props.list;
    const listItems = list.map(item => (
      <div
        onClick={() => this.props.viewPost(item, item.articleData.article)}
        key={item._id}
        className="blogs cursor-pointer"
      >
        <button to="#" className="reading-btn reading-grey">
          {item.subjectname}
        </button>
        <div className="blogs-content-wrap">
          <div className="blogs-content">
            <h2>{item.articleData.article.title}</h2>
            <div className="mins">
              Added: <span>{item.addedOn}</span>
            </div>
          </div>

          {item && (
            <ResourseHandler
              isBgImage={true}
              className="blogs-thumbnail"
              imageUrl={item.articleData.article.thumbnail}
            />
          )}
        </div>
      </div>
    ));

    return listItems;
  }
}

export default ArticleListComponent;
