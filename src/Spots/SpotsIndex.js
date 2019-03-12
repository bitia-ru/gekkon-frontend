import React           from 'react';
import MainPageHeader  from "../MainPageHeader/MainPageHeader";
import MainPageContent from "../MainPageContent/MainPageContent";
import Footer          from "../Footer/Footer";
import {saveUser}      from "../actions";
import {connect}       from "react-redux";
import {withRouter}    from "react-router-dom";

import {UserItemsData} from "../data";

const USER = {id: 1, login: UserItemsData[0].title, avatar: '/public/user-icon/avatar.jpg'};

class SpotsIndex extends React.Component {

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
            <MainPageContent/>
            <Footer user={this.props.user}
                    logIn={this.logIn}
                    logOut={this.logOut}/>
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    saveUser: user => dispatch(saveUser(user))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
