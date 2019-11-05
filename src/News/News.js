import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment';
import classNames from 'classnames';
import { GetUserName } from '../Constants/User';
import { MAX_LENGTH } from '../Constants/News';
import { routeCategoriesDiff } from '../Constants/Categories';
import { timeFromNow } from '../Constants/DateTimeFormatter';
import RouteColor from '../RouteColor/RouteColor';
import NewsTooltip from '../NewsTooltip/NewsTooltip';
import './News.css';

export default class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false,
    };
  }

  render() {
    const { data } = this.props;
    const { showTooltip } = this.state;
    const {
      user,
      title,
      routes,
      time,
      message,
    } = data;
    const categories = R.map(route => route.category, routes);
    let routesSorted;
    let category;
    let route;
    let rows;
    if (categories.length === 1) {
      [category] = categories;
      [route] = routes;
    } else {
      routesSorted = R.sort(routeCategoriesDiff, routes);
      rows = R.map(
        p => ({ count: p[1].length, category: p[0] }),
        R.toPairs(R.groupBy(r => r.category, routes)),
      );
    }
    moment.locale('ru');

    return (
      <div className="news">
        <div className="news__header">
          <div className="news__author-block">
            <div className="news__author-avatar">
              {user && user.avatar && <img src={user.avatar.url} alt={GetUserName(user)} />}
            </div>
            <div className="news__author-info">
              <div className="news__author-title">
                <div className="news__author-name" style={{ cursor: 'pointer' }}>
                  {user && GetUserName(user)}
                </div>
                <div className="news__author-data">{message}</div>
              </div>
              <div className="news__author-date">{timeFromNow(moment(time))}</div>
            </div>
          </div>
        </div>
        <div className="news__footer">
          <div className="news__track-block">
            <div
              className={
                classNames({
                  news__name: true,
                  news__name_small: title.length > MAX_LENGTH,
                })
              }
            >
              {title}
            </div>
            {
              category
                ? (
                  <div className="news__level-block">
                    <div className="news__level-block-item">
                      <div className="level">
                        <div className="level__item">
                          {category}
                        </div>
                      </div>
                    </div>
                    <div className="news__level-block-item">
                      <RouteColor size="medium" route={route} fieldName="holds_color" />
                    </div>
                  </div>
                )
                : (
                  <div
                    className="news__level-block"
                    onMouseEnter={() => this.setState({ showTooltip: true })}
                    onMouseLeave={() => this.setState({ showTooltip: false })}
                  >
                    <div className="news__level-block-item">
                      <div className="level">
                        <div className="level__title">от</div>
                        <div className="level__item">
                          {routesSorted[0].category}
                        </div>
                      </div>
                    </div>
                    <div className="news__level-block-item">
                      <div className="level">
                        <div className="level__title">до</div>
                        <div className="level__item level__item_7b">
                          {R.last(routesSorted).category}
                        </div>
                      </div>
                    </div>
                    { showTooltip && <NewsTooltip rows={rows} /> }
                  </div>
                )
            }
          </div>
        </div>
      </div>
    );
  }
}

News.propTypes = {
  data: PropTypes.object.isRequired,
};
