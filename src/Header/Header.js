import React, {Component} from 'react';
import InfoBlock          from "../InfoBlock/InfoBlock";
import MainNav            from "../MainNav/MainNav";
import PropTypes          from 'prop-types';
import '../logo.css';
import './Header.css';

export default class Header extends Component {
    render() {
        return <header className="header">
            <div className="header__top">
                <div className="header__logo">
                    <a href="#" className="logo">
					<span className="logo__icon">
						<img src="/public/logo-img/logo.svg" alt="Gekkon"/>
					</span>
                    </a>
                </div>
                <MainNav changeNameFilter={this.props.changeNameFilter} logIn={this.props.logIn}
                         logOut={this.props.logOut}/>
            </div>
            <ul className="header__items-container">
                <li className="header__item"
                    style={{backgroundImage: `url(${this.props.data.photo ? this.props.data.photo.url : ''})`}}>
                    <div className="header__item-wrapper">
                        <h1 className="header__item-header">
                            {this.props.data.name}
                        </h1>
                        <p className="header__item-subtitle">
                            {this.props.data.description}
                        </p>
                    </div>
                </li>
            </ul>
            <InfoBlock sectors={this.props.sectors}
                       infoData={this.props.infoData}
                       changeSectorFilter={this.props.changeSectorFilter}/>
        </header>;
    }
}

Header.propTypes = {
    data: PropTypes.object.isRequired,
    infoData: PropTypes.array.isRequired,
    sectors: PropTypes.array.isRequired,
    changeSectorFilter: PropTypes.func.isRequired,
    changeNameFilter: PropTypes.func.isRequired,
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired
};
