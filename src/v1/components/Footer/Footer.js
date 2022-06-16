import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SocialLinkButton from '../SocialLinkButton/SocialLinkButton';
import {
  VK_LINK,
  TWITTER_LINK,
} from '../../Constants/SocialLinks';
import { notReady, notExist } from '../../utils';
import './Footer.css';

const Footer = ({
  logIn, signUp, logOut, user,
}) => {
  const socialLinksSprite = require(
    '../../../../img/social-links-sprite/social-links-sprite.svg',
  ).default;
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__block-group">
          <div className="footer__item">
            <h3 className="footer__header">
              Аккаунт
            </h3>
            <ul className="footer__list">
              {
                !notReady(user) && (
                  <>
                    {
                      notExist(user)
                        ? (
                          <>
                            <li className="footer__list-item">
                              <a
                                onClick={logIn}
                                role="link"
                                tabIndex={0}
                                className="footer__list-link"
                              >
                                Вход
                              </a>
                            </li>
                            <li className="footer__list-item">
                              <a
                                onClick={signUp}
                                role="link"
                                tabIndex={0}
                                className="footer__list-link"
                              >
                                Регистрация
                              </a>
                            </li>
                          </>
                        )
                        : (
                          <li className="footer__list-item">
                            <a
                              onClick={logOut}
                              role="link"
                              tabIndex={0}
                              className="footer__list-link"
                            >
                              Выход
                            </a>
                          </li>
                        )
                    }
                  </>
                )
              }
            </ul>
          </div>
          <div className="footer__item">
            <h3 className="footer__header">
              Разделы
            </h3>
            <ul className="footer__list">
              <li className="footer__list-item">
                <Link to="/" className="footer__list-link">Скалодромы</Link>
              </li>
              <li className="footer__list-item">
                <Link to="/crags"
                      className="footer__list-link footer__list-link-disabled">Скалы</Link>
              </li>
            </ul>
          </div>
          <div className="footer__item">
            <h3 className="footer__header">Информация</h3>
            <ul className="footer__list">
              <li className="footer__list-item">
                <Link to="/about" className="footer__list-link">О нас</Link>
              </li>
            </ul>
          </div>
          <div className="footer__item">
            <h3 className="footer__header">Помощь</h3>
            <ul className="footer__list">
              <li className="footer__list-item">
                <Link to="/faq" className="footer__list-link">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__social">
          <h3 className="footer__header">Соцсети</h3>
          <ul className="social-links">
            <li>
              <SocialLinkButton
                href={VK_LINK}
                xlinkHref={`${socialLinksSprite}#icon-vk`}
              />
            </li>
            <li>
              <SocialLinkButton
                href={TWITTER_LINK}
                xlinkHref={`${socialLinksSprite}#icon-twitter`}
              />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  user: PropTypes.object,
  logIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
};

export default Footer;
