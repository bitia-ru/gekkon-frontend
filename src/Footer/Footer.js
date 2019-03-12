import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import {Link}             from 'react-router-dom';
import './Footer.css';
import './social_links.css';

export default class Footer extends Component {
    render() {
        return <footer className="footer">
            <div className="footer__container">
                <div className="footer__block-group">
                    <div className="footer__item">
                        <h3 className="footer__header">
                            Аккаунт
                        </h3>
                        <ul className="footer__list">
                            {this.props.user === null ? <React.Fragment>
                                <li className="footer__list-item">
                                    <a onClick={this.props.logIn} className="footer__list-link">
                                        Вход
                                    </a>
                                </li>
                                <li className="footer__list-item">
                                    <a onClick={this.props.logIn} className="footer__list-link">
                                        Регистрация
                                    </a>
                                </li>
                            </React.Fragment> : <li className="footer__list-item">
                                <a onClick={this.props.logOut} className="footer__list-link">
                                    Выход
                                </a>
                            </li>}
                        </ul>
                    </div>
                    <div className="footer__item">
                        <h3 className="footer__header">
                            Разделы
                        </h3>
                        <ul className="footer__list">
                            <li className="footer__list-item">
                                <Link to="/users" className="footer__list-link">Скалолазы</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/" className="footer__list-link">Скалодромы</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/crags" className="footer__list-link">Скалы</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__item">
                        <h3 className="footer__header">
                            Информация
                        </h3>
                        <ul className="footer__list">
                            <li className="footer__list-item">
                                <Link to="/about" className="footer__list-link">О нас</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/howtohelp" className="footer__list-link">Чем нам помочь</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__item">
                        <h3 className="footer__header">
                            Помощь
                        </h3>
                        <ul className="footer__list">
                            <li className="footer__list-item">
                                <Link to="/faq" className="footer__list-link">FAQ</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer__social">
                    <h3 className="footer__header">
                        Соцсети
                    </h3>
                    <ul className="social-links">
                        <li>
                            <a href="https://www.instagram.com" className="social-links__link">
                                <svg>
                                    <use
                                        xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-facebook"></use>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://ru-ru.facebook.com/" className="social-links__link">
                                <svg>
                                    <use
                                        xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-twitter"></use>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://vk.com/club172115153" className="social-links__link">
                                <svg>
                                    <use
                                        xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-inst"></use>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://vk.com/club172115153" className="social-links__link">
                                <svg>
                                    <use
                                        xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-youtube"></use>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>;
    }
}

Footer.propTypes = {
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired
};
