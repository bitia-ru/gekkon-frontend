import React                 from 'react';
import MainPageHeader        from '../MainPageHeader/MainPageHeader';
import Footer                from '../Footer/Footer';
import {saveUser, changeTab} from '../actions';
import {connect}             from 'react-redux';
import {withRouter}          from 'react-router-dom';
import Authorization         from '../Authorization';
import SignUpForm            from '../SignUpForm/SignUpForm';
import LogInForm             from '../LogInForm/LogInForm';
import Profile               from '../Profile/Profile';

class CragsIndex extends Authorization {

    componentDidMount() {
        window.history.back();
    }

    componentWillUnmount() {
        alert("Раздел находится в разработке");
        this.props.changeTab(1);
    }

    changeNameFilter = (searchString) => {
        console.log(searchString);
    };

    openProfileForm = () => {
        this.setState({profileFormVisible: true});
    };

    closeProfileForm = () => {
        this.setState({profileFormVisible: false});
    };

    render() {
        return <div
            style={{overflow: (this.state.signUpFormVisible || this.state.logInFormVisible || this.state.profileFormVisible ? 'hidden' : '')}}>
            {
                this.state.signUpFormVisible
                    ? (
                        <SignUpForm onFormSubmit={this.submitSignUpForm}
                                    closeForm={this.closeSignUpForm}
                                    formErrors={this.state.signUpFormErrors}
                                    resetErrors={this.signUpResetErrors}
                        />
                    )
                    : ''
            }
            {
                this.state.logInFormVisible
                    ? (
                        <LogInForm onFormSubmit={this.submitLogInForm}
                                   closeForm={this.closeLogInForm}
                                   resetPassword={this.resetPassword}
                                   formErrors={this.state.logInFormErrors}
                                   resetErrors={this.logInResetErrors}
                        />
                    ) : ''
            }
            {
                (this.props.user && this.state.profileFormVisible)
                    ? (
                        <Profile user={this.props.user}
                                 onFormSubmit={this.submitProfileForm}
                                 closeForm={this.closeProfileForm}
                                 formErrors={this.state.profileFormErrors}
                                 resetErrors={this.profileResetErrors}
                        />
                    ) : ''
            }
            <MainPageHeader changeNameFilter={this.changeNameFilter}
                            user={this.props.user}
                            openProfile={this.openProfileForm}
                            logIn={this.logIn}
                            signUp={this.signUp}
                            logOut={this.logOut}/>
            <Footer user={this.props.user}
                    logIn={this.logIn}
                    signUp={this.signUp}
                    logOut={this.logOut}/>
        </div>
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
