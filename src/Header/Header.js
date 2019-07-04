import React     from 'react';
import InfoBlock from "../InfoBlock/InfoBlock";
import MainNav   from "../MainNav/MainNav";
import Logo      from "../Logo/Logo";
import PropTypes from 'prop-types';
import './Header.css';

const Header = ({
                    changeNameFilter,
                    logIn,
                    signUp,
                    openProfile,
                    logOut,
                    user,
                    data,
                    sectors,
                    infoData,
                    sectorId,
                    changeSectorFilter,
                }) => (
    <header className="header">
        <div className="header__top">
            <Logo/>
            <MainNav changeNameFilter={changeNameFilter} logIn={logIn}
                     signUp={signUp} openProfile={openProfile}
                     logOut={logOut} user={user}/>
        </div>
        <ul className="header__items-container">
            <li className="header__item"
                style={{backgroundImage: `url(${data.photo ? data.photo.url : ''})`}}>
                <div className="header__item-wrapper">
                    <h1 className="header__item-header">
                        {data.name}
                    </h1>
                    <p className="header__item-subtitle">
                        {data.description}
                    </p>
                </div>
            </li>
        </ul>
        <InfoBlock sectors={sectors}
                   infoData={infoData}
                   sectorId={sectorId}
                   changeSectorFilter={changeSectorFilter}/>
    </header>
);

Header.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object.isRequired,
    infoData: PropTypes.array.isRequired,
    sectors: PropTypes.array.isRequired,
    changeSectorFilter: PropTypes.func.isRequired,
    changeNameFilter: PropTypes.func.isRequired,
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired,
    openProfile: PropTypes.func.isRequired,
    sectorId: PropTypes.number.isRequired,
};

Header.defaultProps = {
    user: null,
};

export default Header;
