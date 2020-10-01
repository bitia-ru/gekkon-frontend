import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TabBar.css';
import * as R from 'ramda';

export default class TabBar extends Component {
  constructor(props) {
    super(props);

    const { activeTab } = this.props;
    this.state = {
      tab: activeTab,
    };
  }

    changeTab = (tab) => {
      this.setState({ tab });
    };

    getTabClass = (index) => {
      const { tab } = this.state;
      return (tab === (index + 1) ? ' tab__list-link_active' : '');
    };

    render() {
      const { activeList, titleList, contentList, styles } = this.props;
      const tabListStyles = styles ? `tab__list ${styles}` : 'tab__list';
      const { tab } = this.state;
      const mapIndexed = R.addIndex(R.map);
      return (
        <div className="tab">
          <div className={tabListStyles}>
            {titleList && mapIndexed((title, index) => (
              <div key={index} className="tab__list-item">
                <a
                  className={`tab__list-link${this.getTabClass(index)}`}
                  role="link"
                  tabIndex={0}
                  onClick={activeList[index] ? () => this.changeTab(index + 1) : null}
                  style={
                    activeList[index]
                      ? { outline: 'none' }
                      : { color: 'grey', outline: 'none' }}
                >
                  {title}
                </a>
              </div>
            ), titleList)}
          </div>
          <div className="tab__content">
            {contentList && mapIndexed((content, index) => (
              <div
                key={index}
                className="tab__content-item"
                style={{ display: (tab === (index + 1) ? '' : 'none') }}
              >
                {content}
              </div>
            ), contentList)}
          </div>
        </div>
      );
    }
}

TabBar.propTypes = {
  activeTab: PropTypes.number.isRequired,
  titleList: PropTypes.array,
  contentList: PropTypes.array,
  activeList: PropTypes.array.isRequired,
  styles: PropTypes.string,
};
