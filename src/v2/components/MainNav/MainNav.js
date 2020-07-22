import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import UserIcon from '../UserIcon/UserIcon';
import { changeTab } from '@/v1/actions';
import './MainNav.css';


class MainNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchOpened: false,
      searchStarted: false,
      searchString: '',
    };
  }

  showSearch = () => {
    this.setState({ searchOpened: true });
  };

  hideSearch = () => {
    const { searchStarted } = this.state;
    if (searchStarted) {
      return;
    }
    this.setState({ searchOpened: false });
  };

  searchSubmitted = () => {
    this.setState({ searchOpened: false, searchStarted: false, searchString: '' });
  };

  keyPress = (event) => {
    if (event.key === 'Enter') {
      this.searchSubmitted();
    }
  };

  render() {
    const {
      changeTab: changeTabProp,
      tab,
      history,
    } = this.props;

    const { searchOpened } = this.state;
    const inputClass = (searchOpened ? ' main-nav__search-input_active' : '');
    const tab1Class = (tab === 1 ? ' main-nav__nav-list-link_active' : '');
    const tab2Class = (tab === 2 ? ' main-nav__nav-list-link_active' : '');
    const tab3Class = (tab === 3 ? ' main-nav__nav-list-link_active' : '');

    return (
      <div className="main-nav__container-v2">
        <Link to="/crags" id="linkToCrags" />
        <Link to="/" id="linkToSpots" />
        <div className="main-nav">
          <div className="main-nav" onMouseLeave={this.hideSearch}>
            { false
                && <button
                  className="main-nav__search"
                  type="button"
                  onMouseEnter={this.showSearch}
                  onClick={this.searchSubmitted}
                >
                  <div className="main-nav__search-icon">
                    <svg aria-hidden="true">
                      <use xlinkHref={`${require('./images/search.svg')}#search`} />
                    </svg>
                  </div>
                </button>
            }
            <div className="main-nav__block">
              <input
                type="text"
                onChange={
                  event => this.setState({ searchString: event.target.value })
                }
                onFocus={() => this.setState({ searchStarted: true })}
                onKeyPress={this.keyPress}
                placeholder="Введите строку для поиска"
                className={
                  `main-nav__search-input${inputClass}`
                }
              />
              <nav className="main-nav__nav">
                <ul className="main-nav__nav-list">
                  <li className="main-nav__nav-list-item">
                    <a
                      href="#"
                      onClick={() => {
                        changeTabProp(1);
                        document.getElementById('linkToSpots').click();
                      }}
                      className={`main-nav__nav-list-link${tab1Class}`}
                    >
                      Скалодромы
                    </a>
                  </li>
                  <li className="main-nav__nav-list-item">
                    <a
                      href="#"
                      onClick={() => {
                        changeTabProp(2);
                        document.getElementById('linkToCrags').click();
                      }}
                      className={`main-nav__nav-list-link${tab2Class} main-nav__nav-list-link-disabled`}
                    >
                      Скалы
                    </a>
                  </li>
                  <li className="main-nav__nav-list-item">
                    <a
                      onClick={event => {
                        event.stopPropagation();
                        changeTabProp(3);
                        history.push('/users');
                      }}
                      className={`main-nav__nav-list-link${tab3Class}`}
                    >
                      Рейтинги
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <UserIcon />
        </div>
      </div>
    );
  }
}

MainNav.propTypes = {
  changeTab: PropTypes.func,
  tab: PropTypes.number,
};

MainNav.defaultProps = {
  changeTab: null,
  tab: null,
};

const mapStateToProps = state => ({
  tab: state.tab,
});

const mapDispatchToProps = dispatch => ({
  changeTab: tab => dispatch(changeTab(tab)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainNav));
