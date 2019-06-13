import React, {Component} from 'react';
import MainNav            from "../MainNav/MainNav";
import Logo               from "../Logo/Logo";
import Button             from "../Button/Button";
import PropTypes          from 'prop-types';
import './MainPageHeader.css';

export default class MainPageHeader extends Component {

    render() {
        return <header className="main-page-header">
            <div className="main-page-header__top">
                <Logo/>
                <MainNav changeNameFilter={this.props.changeNameFilter} logIn={this.props.logIn} signUp={this.props.signUp}
                         logOut={this.props.logOut} user={this.props.user} openProfile={this.props.openProfile}/>
            </div>
            <div className="main-page-header__content">
                <div className="main-page-header__text">
                    <h1 className="main-page-header__title">
                        Не можешь вспомнить свою первую 6С?
                    </h1>
                    <p className="main-page-header__descr">Не пытайся запоминать боль, записывай</p>
                    <div className="main-page-header__button-wrapper">
                        {
                            this.props.user === null
                                ? (
                                    <React.Fragment>
                                        <Button size="big"
                                                style="normal"
                                                title="Зарегистрироваться"
                                                onClick={this.props.signUp}>
                                        </Button>
                                        <Button size="big"
                                                style="transparent"
                                                title="Войти"
                                                onClick={this.props.logIn}>
                                        </Button>
                                    </React.Fragment>
                                )
                                : ''
                        }
                    </div>
                </div>
                <div className="main-page-header__img">
                    <picture>
                        <source media="(max-width: 1600px)"
                                srcSet="/public/img/main-page-header-img/main-page-header-img_desktop-md.png"/>
                        <img src="/public/img/main-page-header-img/main-page-header-img.png" alt="Скалолаз"/>
                    </picture>
                </div>
            </div>
        </header>;
    }
}

MainPageHeader.propTypes = {
    changeNameFilter: PropTypes.func.isRequired,
    logIn: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
    openProfile: PropTypes.func.isRequired
};
