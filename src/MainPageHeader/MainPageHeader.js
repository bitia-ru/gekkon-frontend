import React     from 'react';
import MainNav   from "../MainNav/MainNav";
import Logo      from "../Logo/Logo";
import Button    from "../Button/Button";
import PropTypes from 'prop-types';
import './MainPageHeader.css';

const MainPageHeader = ({
                            changeNameFilter,
                            logIn,
                            signUp,
                            logOut,
                            user,
                            openProfile,
                        }) => {
    const srcSet = "/public/img/main-page-header-img/main-page-header-img_desktop-md.png";
    return (
        <header className="main-page-header">
            <div className="main-page-header__top">
                <Logo/>
                <MainNav changeNameFilter={changeNameFilter} logIn={logIn} signUp={signUp}
                         logOut={logOut} user={user} openProfile={openProfile}/>
            </div>
            <div className="main-page-header__content">
                <div className="main-page-header__text">
                    <h1 className="main-page-header__title">
                        Не можешь вспомнить свою первую 6С?
                    </h1>
                    <p className="main-page-header__descr">
                        Не пытайся запоминать боль, записывай
                    </p>
                    <div className="main-page-header__button-wrapper">
                        {
                            user === null
                                ? (
                                    <React.Fragment>
                                        <Button size="big"
                                                style="normal"
                                                title="Зарегистрироваться"
                                                onClick={signUp}>
                                        </Button>
                                        <Button size="big"
                                                style="transparent"
                                                title="Войти"
                                                onClick={logIn}>
                                        </Button>
                                    </React.Fragment>
                                )
                                : ''
                        }
                    </div>
                </div>
                <div className="main-page-header__img">
                    <picture>
                        <source media="(max-width: 1600px)" srcSet={srcSet}/>
                        <img
                            src="/public/img/main-page-header-img/main-page-header-img.png"
                            alt="Скалолаз"
                        />
                    </picture>
                </div>
            </div>
        </header>
    );
}

MainPageHeader.propTypes = {
    user: PropTypes.object,
    changeNameFilter: PropTypes.func.isRequired,
    logIn: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
    openProfile: PropTypes.func.isRequired,
};

MainPageHeader.defaultProps = {
    user: null,
};

export default MainPageHeader;
