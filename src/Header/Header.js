import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfoBlock from '../InfoBlock/InfoBlock';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';
import './Header.css';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgImageLoaded: false,
    };
    this.photosInternal = {};
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.data.photo) {
      return;
    }
    if (this.photosInternal[newProps.data.photo.url] !== undefined) {
      return;
    }
    this.setState({ bgImageLoaded: false });
    this.photosInternal[newProps.data.photo.url] = new Image();
    this.photosInternal[newProps.data.photo.url].onload = () => (
      this.setState({ bgImageLoaded: true })
    );
    this.photosInternal[newProps.data.photo.url].src = newProps.data.photo.url;
  }

  render() {
    const {
      logIn,
      signUp,
      openProfile,
      logOut,
      user,
      data,
      changeSectorFilter,
    } = this.props;
    const { bgImageLoaded } = this.state;

    return (
      <header className="header">
        <div className="header__top">
          <Logo />
          <MainNav
            logIn={logIn}
            signUp={signUp}
            openProfile={openProfile}
            logOut={logOut}
            user={user}
          />
        </div>
        <ul className="header__items-container">
          <li
            className="header__item"
            style={
              (data.photo && bgImageLoaded)
                ? { backgroundImage: `url(${this.photosInternal[data.photo.url].src})` }
                : {}
            }
          >
            <div className="header__item-wrapper">
              <h1 className="header__item-header">{data.name}</h1>
              <p className="header__item-subtitle">{data.description}</p>
            </div>
          </li>
        </ul>
        <InfoBlock
          infoData={data.infoData}
          changeSectorFilter={changeSectorFilter}
        />
      </header>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object.isRequired,
  changeSectorFilter: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  openProfile: PropTypes.func.isRequired,
};
