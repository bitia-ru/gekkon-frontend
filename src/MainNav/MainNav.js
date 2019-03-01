import React, {Component} from 'react';
import UserIcon           from "../UserIcon/UserIcon";
import PropTypes          from 'prop-types';
import './MainNav.css';

export default class MainNav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: 1,
            searchOpened: false,
            searchStarted: false,
            searchString: ''
        }
    }

    showSearch = () => {
        this.setState({searchOpened: true});
    };

    hideSearch = () => {
        if (this.state.searchStarted) {
            return
        }
        this.setState({searchOpened: false})
    };

    searchSubmitted = () => {
        this.setState({searchOpened: false, searchStarted: false, searchString: ''});
        this.props.changeNameFilter(this.state.searchString);
    };

    keyPress = (event) => {
        if (event.key === 'Enter') {
            this.searchSubmitted()
        }
    };

    render() {
        return <div className="main-nav__container">
            <div className="main-nav">
                <div className="main-nav" onMouseLeave={this.hideSearch}>
                    <button className="main-nav__search"
                            onMouseEnter={this.showSearch}
                            onClick={this.searchSubmitted}>
                        <div className="main-nav__search-icon">
                            <svg aria-hidden="true">
                                <use xlinkHref="/public/main-nav-img/search.svg#search"></use>
                            </svg>
                        </div>
                    </button>
                    <div className="main-nav__block">
                        <input type="text"
                               onChange={(event) => this.setState({searchString: event.target.value})}
                               onFocus={() => this.setState({searchStarted: true})}
                               onKeyPress={this.keyPress}
                               placeholder="Введите строку для поиска"
                               className={'main-nav__search-input' + (this.state.searchOpened ? ' main-nav__search-input_active' : '')}/>
                        <nav className="main-nav__nav">
                            <ul className="main-nav__nav-list">
                                <li className="main-nav__nav-list-item">
                                    <a href="#"
                                       onClick={() => this.setState({tab: 1})}
                                       className={'main-nav__nav-list-link' + (this.state.tab === 1 ? ' main-nav__nav-list-link_active' : '')}>Скалодромы</a>
                                </li>
                                <li className="main-nav__nav-list-item">
                                    <a href="#"
                                       onClick={() => this.setState({tab: 2})}
                                       className={'main-nav__nav-list-link' + (this.state.tab === 2 ? ' main-nav__nav-list-link_active' : '')}>Скалы</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <UserIcon logIn={this.props.logIn} logOut={this.props.logOut}/>
            </div>
        </div>;
    }
}

MainNav.propTypes = {
    changeNameFilter: PropTypes.func.isRequired,
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired
};
