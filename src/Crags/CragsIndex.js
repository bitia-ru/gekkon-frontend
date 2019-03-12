import React                 from 'react';
import MainPageHeader        from '../MainPageHeader/MainPageHeader';
import Footer                from '../Footer/Footer';
import {saveUser, changeTab} from '../actions';
import {connect}             from 'react-redux';
import {withRouter}          from 'react-router-dom';

import {UserItemsData} from "../data";

const USER = {id: 1, login: UserItemsData[0].title, avatar: '/public/user-icon/avatar.jpg'};

class CragsIndex extends React.Component {

    componentDidMount() {
        window.history.back();
    }

    componentWillUnmount() {
        alert("Раздел находится в разработке");
        this.props.changeTab(1);
    }

    logIn = () => {
        this.props.saveUser(USER);
    };

    logOut = () => {
        this.props.saveUser(null);
    };

    changeNameFilter = (searchString) => {
        console.log(searchString);
    };

    render() {
        return <React.Fragment>
            <MainPageHeader
                changeNameFilter={this.changeNameFilter}
                user={this.props.user}
                logIn={this.logIn}
                logOut={this.logOut}/>
            <Footer user={this.props.user}
                    logIn={this.logIn}
                    logOut={this.logOut}/>
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    user: state.user,
    tab: state.tab
});

const mapDispatchToProps = dispatch => ({
    saveUser: user => dispatch(saveUser(user)),
    changeTab: tab => dispatch(changeTab(tab))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CragsIndex));
