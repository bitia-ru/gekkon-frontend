import React, {Component} from 'react';
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
                            <li className="footer__list-item">
                                <a href="#" className="footer__list-link">
                                    Вход
                                </a>
                            </li>
                            <li className="footer__list-item">
                                <a href="#" className="footer__list-link">
                                    Регистрация
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__item">
                        <h3 className="footer__header">
                            Разделы
                        </h3>
                        <ul className="footer__list">
                            <li className="footer__list-item">
                                <a href="#" className="footer__list-link">
                                    Группы
                                </a>
                            </li>
                            <li className="footer__list-item">
                                <a href="#" className="footer__list-link">
                                    Пользователи
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__item">
                        <h3 className="footer__header">
                            Информация
                        </h3>
                        <ul className="footer__list">
                            <li className="footer__list-item">
                                <a href="#" className="footer__list-link">
                                    Компания
                                </a>
                            </li>
                            <li className="footer__list-item">
                                <a href="#" className="footer__list-link">
                                    Пользователи
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__item">
                        <h3 className="footer__header">
                            Помощь
                        </h3>
                        <ul className="footer__list">
                            <li className="footer__list-item">
                                <a href="#" className="footer__list-link">
                                    Чат
                                </a>
                            </li>
                            <li className="footer__list-item">
                                <a href="#" className="footer__list-link">
                                    FAQ
                                </a>
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
