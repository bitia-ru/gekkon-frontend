import React            from 'react';
import {withRouter}     from 'react-router-dom';
import Axios            from 'axios';
import Qs               from 'qs';
import ApiUrl           from '../ApiUrl';
import {
    loadRoutes,
    loadSectors,
    saveUser,
    saveToken,
    removeToken
}                       from '../actions';
import {connect}        from 'react-redux';
import Content          from '../Content/Content'
import Header           from '../Header/Header';
import Footer           from '../Footer/Footer';
import RoutesShowModal  from '../RoutesShowModal/RoutesShowModal';
import RoutesEditModal  from '../RoutesEditModal/RoutesEditModal';
import * as R           from 'ramda';
import Cookies          from "js-cookie";
import SignUpForm       from '../SignUpForm/SignUpForm';
import LogInForm        from '../LogInForm/LogInForm';
import Profile          from '../Profile/Profile';
import Authorization    from '../Authorization';
import {ToastContainer} from 'react-toastr';
import StickyBar        from '../StickyBar/StickyBar';

const NumOfDays = 7;

Axios.interceptors.request.use(config => {
    config.paramsSerializer = params => {
        return Qs.stringify(params, {arrayFormat: "brackets"});
    };
    return config;
});

class SpotsShow extends Authorization {
    constructor(props) {
        super(props);

        this.state = Object.assign(this.state, {
            spotId: parseInt(this.props.match.params.id, 10),
            sectorId: 0,
            sector: {},
            categoryFrom: '1a',
            categoryTo: '9c+',
            period: 0,
            name: '',
            page: 1,
            numOfPages: 1,
            perPage: 3,
            spot: {},
            infoData: [],
            routesModalVisible: false,
            currentShown: {},
            editMode: false,
            ascents: [],
            ctrlPressed: false,
            numOfActiveRequests: 0
        });
        this.numOfActiveRequests = 0;
    }

    componentDidMount() {
        if (Cookies.get('user_session_token') !== undefined) {
            let token = Cookies.get('user_session_token');
            this.props.saveToken(token);
            this.signIn(token);
        }
        this.reloadSpot();
        this.reloadSectors();
        this.reloadRoutes(0);
        this.reloadAscents();
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }

    onKeyDown = (event) => {
        if (event.key === 'Control') {
            this.setState({ctrlPressed: true})
        }
    };

    onKeyUp = (event) => {
        if (event.key === 'Control') {
            this.setState({ctrlPressed: false})
        }
    };

    reloadAscents = () => {
        if (!this.props.user) {
            this.setState({ascents: []});
            return;
        }
        this.numOfActiveRequests++;
        this.setState({numOfActiveRequests: this.numOfActiveRequests});
        Axios.get(`${ApiUrl}/v1/users/${this.props.user.id}/ascents`)
            .then(response => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
                this.setState({ascents: response.data.payload});
            }).catch(error => {
            this.numOfActiveRequests--;
            this.setState({numOfActiveRequests: this.numOfActiveRequests});
            this.displayError(error);
        });
    };

    onRouteClick = (id) => {
        this.setState({
            routesModalVisible: true,
            editMode: false,
            currentShown: R.find(R.propEq('id', id))(this.props.routes)
        });
    };

    closeRoutesModal = () => {
        this.setState({routesModalVisible: false});
        if (this.state.sectorId === 0) {
            this.reloadSpot();
        } else {
            this.reloadSector(this.state.sectorId);
        }
        this.reloadAscents();
    };

    afterLogOut = () => {
        this.reloadAscents();
        this.reloadRoutes(null, null, null, null, null, 1, 0);
        if (this.state.sectorId === 0) {
            this.reloadSpot(0);
        } else {
            this.reloadSector(this.state.sectorId, 0);
        }
    };

    reloadSpot = (userId) => {
        let currentUserId = (userId === null || userId === undefined) ? (this.props.user === null ? 0 : this.props.user.id) : userId;
        let params = {};
        if (currentUserId !== 0) {
            params.user_id = currentUserId;
        }
        this.numOfActiveRequests++;
        this.setState({numOfActiveRequests: this.numOfActiveRequests});
        Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}`, {params: params})
            .then(response => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
                let infoData = [
                    {count: response.data.metadata.num_of_sectors, label: 'Залов'},
                    {count: response.data.metadata.num_of_routes, label: 'Трасс'}
                ];
                if (currentUserId !== 0) {
                    infoData = R.append({
                        count: response.data.metadata.num_of_unfulfilled,
                        label: 'Невыполненных трасс'
                    }, infoData);
                }
                this.setState({
                    spot: response.data.payload,
                    infoData: infoData
                });
            }).catch(error => {
            this.numOfActiveRequests--;
            this.setState({numOfActiveRequests: this.numOfActiveRequests});
            this.displayError(error);
        });
    };

    reloadSector = (id, userId) => {
        let currentUserId = (userId === null || userId === undefined) ? (this.props.user === null ? 0 : this.props.user.id) : userId;
        let params = {};
        if (currentUserId !== 0) {
            params.user_id = currentUserId;
        }
        params.numOfDays = NumOfDays;
        this.numOfActiveRequests++;
        this.setState({numOfActiveRequests: this.numOfActiveRequests});
        Axios.get(`${ApiUrl}/v1/sectors/${id}`, {params: params})
            .then(response => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
                let infoData = [
                    {count: response.data.metadata.num_of_routes, label: 'Трасс'},
                    {count: response.data.metadata.num_of_new_routes, label: 'Новых трасс'}
                ];
                if (currentUserId !== 0) {
                    infoData = R.append({
                        count: response.data.metadata.num_of_unfulfilled,
                        label: 'Невыполненных трасс'
                    }, infoData);
                }
                this.setState({
                    sector: response.data.payload,
                    infoData: infoData
                });
            }).catch(error => {
            this.numOfActiveRequests--;
            this.setState({numOfActiveRequests: this.numOfActiveRequests});
            this.displayError(error);
        });
    };

    reloadSectors = () => {
        this.numOfActiveRequests++;
        this.setState({numOfActiveRequests: this.numOfActiveRequests});
        Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}/sectors`)
            .then(response => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
                this.props.loadSectors(response.data.payload);
            }).catch(error => {
            this.numOfActiveRequests--;
            this.setState({numOfActiveRequests: this.numOfActiveRequests});
            this.displayError(error);
        });
    };

    reloadRoutes = (sectorId, categoryFrom, categoryTo, name, period, page) => {
        let currentSectorId = parseInt((sectorId === null || sectorId === undefined) ? this.state.sectorId : sectorId, 10);
        let currentCategoryFrom = (categoryFrom === null || categoryFrom === undefined) ? this.state.categoryFrom : categoryFrom;
        let currentCategoryTo = (categoryTo === null || categoryTo === undefined) ? this.state.categoryTo : categoryTo;
        let currentName = (name === null || name === undefined) ? this.state.name : name;
        let currentPeriod = (period === null || period === undefined) ? this.state.period : period;
        let currentPage = (page === null || page === undefined) ? this.state.page : page;
        let params = {filters: {category: [[currentCategoryFrom], [currentCategoryTo]]}};
        if (currentName !== '') {
            params.filters.name = {like: currentName};
        }
        if (currentPeriod !== 0) {
            let d = new Date();
            let dFrom = new Date(d);
            switch (currentPeriod) {
                case 1:
                    dFrom.setDate(d.getDate() - 1);
                    break;
                case 2:
                    dFrom.setDate(d.getDate() - 7);
                    break;
                case 3:
                    dFrom.setMonth(d.getMonth() - 1);
                    break;
                case 4:
                    dFrom.setYear(d.getFullYear() - 1);
                    break;
            }
            params.filters.installed_at = [[dFrom], [d]];
        }
        params.limit = this.state.perPage;
        params.offset = (currentPage - 1) * this.state.perPage;
        if (currentSectorId === 0) {
            this.numOfActiveRequests++;
            this.setState({numOfActiveRequests: this.numOfActiveRequests});
            Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}/routes`, {params: params})
                .then(response => {
                    this.numOfActiveRequests--;
                    this.setState({numOfActiveRequests: this.numOfActiveRequests});
                    this.setState({numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / this.state.perPage))});
                    this.props.loadRoutes(response.data.payload);
                }).catch(error => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
                this.displayError(error);
            });
        } else {
            this.numOfActiveRequests++;
            this.setState({numOfActiveRequests: this.numOfActiveRequests});
            Axios.get(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, {params: params})
                .then(response => {
                    this.numOfActiveRequests--;
                    this.setState({numOfActiveRequests: this.numOfActiveRequests});
                    this.setState({numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / this.state.perPage))});
                    this.props.loadRoutes(response.data.payload);
                }).catch(error => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
                this.displayError(error);
            });
        }
    };

    changeSectorFilter = (id) => {
        if (id !== 0) {
            this.reloadSector(id);
        } else {
            this.reloadSpot();
        }
        this.setState({sectorId: id, page: 1});
        this.reloadRoutes(id, null, null, null, null, 1);
    };

    changeCategoryFilter = (categoryFrom, categoryTo) => {
        if (categoryFrom !== null) {
            this.setState({categoryFrom: categoryFrom, page: 1})
        }
        if (categoryTo !== null) {
            this.setState({categoryTo: categoryTo, page: 1})
        }
        this.reloadRoutes(null, categoryFrom, categoryTo, null, null, 1);
    };

    changePeriodFilter = (period) => {
        this.setState({period: period, page: 1});
        this.reloadRoutes(null, null, null, null, period, 1);
    };

    changeNameFilter = (searchString) => {
        this.setState({name: searchString});
        this.reloadRoutes(null, null, null, searchString, null, 1);
    };

    changePage = (page) => {
        this.setState({page: page});
        this.reloadRoutes(null, null, null, null, null, page);
    };

    afterSubmitLogInForm = (response) => {
        this.reloadSectors(null, null, null, null, null, 1, 1);
        if (this.state.sectorId === 0) {
            this.reloadSpot(response.data.payload.user.id);
        } else {
            this.reloadSector(this.state.sectorId, response.data.payload.user.id);
        }
    };

    removeRoute = () => {
        if (window.confirm("Удалить трассу?")) {
            this.numOfActiveRequests++;
            this.setState({numOfActiveRequests: this.numOfActiveRequests});
            Axios({
                url: `${ApiUrl}/v1/routes/${this.state.currentShown.id}`,
                method: 'delete',
                headers: {'TOKEN': this.props.token}
            })
                .then(response => {
                    this.numOfActiveRequests--;
                    this.setState({numOfActiveRequests: this.numOfActiveRequests});
                    this.reloadRoutes(null, null, null, null, null, 1);
                    this.closeRoutesModal();
                }).catch(error => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
                this.displayError(error)
            });
        }
        this.setState({ctrlPressed: false});
    };

    addRoute = () => {
        this.numOfActiveRequests++;
        this.setState({numOfActiveRequests: this.numOfActiveRequests});
        Axios.get(`${ApiUrl}/v1/routes/new`, {headers: {'TOKEN': this.props.token}})
            .then(response => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
                let newRoute = R.clone(response.data.payload);
                newRoute.sector_id = this.state.sectorId;
                if (this.state.sector.kind !== 'mixed') {
                    newRoute.kind = this.state.sector.kind;
                }
                this.setState({currentShown: newRoute, routesModalVisible: true, editMode: true});
            }).catch(error => {
            this.numOfActiveRequests--;
            this.setState({numOfActiveRequests: this.numOfActiveRequests});
            this.displayError(error);
        });
    };

    afterSubmit = (currentShown) => {
        this.setState({editMode: false, currentShown: currentShown});
    };

    content = () => {
        return <React.Fragment>
            {this.state.routesModalVisible ?
                (this.state.editMode ?
                    <RoutesEditModal onClose={this.closeRoutesModal}
                                     sector={this.state.sectorId === 0 ? R.find((sector) => sector.id === this.state.currentShown.sector_id, this.props.sectors) : this.state.sector}
                                     cancel={this.state.currentShown.id === null ? () => this.setState({routesModalVisible: false}) : () => this.setState({editMode: false})}
                                     afterSubmit={this.afterSubmit}
                                     route={this.state.currentShown.id === null ? this.state.currentShown : R.find((r) => r.id === this.state.currentShown.id, this.props.routes)}/> :
                    <RoutesShowModal onClose={this.closeRoutesModal} openEdit={() => this.setState({editMode: true})}
                                     removeRoute={this.removeRoute} ctrlPressed={this.state.ctrlPressed}
                                     route={R.find((r) => r.id === this.state.currentShown.id, this.props.routes)}/>) : ''}
            {this.state.signUpFormVisible ?
                <SignUpForm onFormSubmit={this.submitSignUpForm} closeForm={this.closeSignUpForm}
                            enterWithVk={this.enterWithVk}
                            isWaiting={this.state.signUpIsWaiting}
                            formErrors={this.state.signUpFormErrors}
                            resetErrors={this.signUpResetErrors}/> : ''}
            {this.state.resetPasswordFormVisible ?
                <ResetPasswordForm onFormSubmit={this.submitResetPasswordForm} closeForm={this.closeResetPasswordForm}
                                   isWaiting={this.state.resetPasswordIsWaiting}
                                   formErrors={this.state.resetPasswordFormErrors} email={this.state.email}
                                   resetErrors={this.resetPasswordResetErrors}/> : ''}
            {this.state.logInFormVisible ?
                <LogInForm onFormSubmit={this.submitLogInForm} closeForm={this.closeLogInForm}
                           enterWithVk={this.enterWithVk}
                           isWaiting={this.state.logInIsWaiting}
                           resetPassword={this.resetPassword}
                           formErrors={this.state.logInFormErrors}
                           resetErrors={this.logInResetErrors}/> : ''}
            {this.state.profileFormVisible ?
                <Profile user={this.props.user} onFormSubmit={this.submitProfileForm}
                         isWaiting={this.state.profileIsWaiting}
                         closeForm={this.closeProfileForm} formErrors={this.state.profileFormErrors}
                         resetErrors={this.profileResetErrors}/> : ''}
            <ToastContainer
                ref={ref => this.container = ref}
                onClick={() => this.container.clear()}
                className="toast-top-right"
            />
            <Header
                data={this.state.sectorId === 0 ? this.state.spot : this.props.sectors[R.findIndex(R.propEq('id', this.state.sectorId))(this.props.sectors)]}
                sectors={this.props.sectors}
                infoData={this.state.infoData}
                changeSectorFilter={this.changeSectorFilter}
                changeNameFilter={this.changeNameFilter}
                user={this.props.user}
                openProfile={this.openProfileForm}
                signUp={this.signUp}
                logIn={this.logIn}
                logOut={this.logOut}/>
            <Content routes={this.props.routes}
                     ascents={this.state.ascents}
                     user={this.props.user}
                     ctrlPressed={this.state.ctrlPressed}
                     addRoute={this.addRoute}
                     sectorId={this.state.sectorId}
                     page={this.state.page}
                     numOfPages={this.state.numOfPages}
                     period={this.state.period}
                     onRouteClick={this.onRouteClick}
                     changePeriodFilter={this.changePeriodFilter}
                     changeCategoryFilter={this.changeCategoryFilter}
                     changePage={this.changePage}/>
        </React.Fragment>
    };

    render() {
        return <div
            style={{overflow: (this.state.routesModalVisible || this.state.signUpFormVisible || this.state.logInFormVisible || this.state.profileFormVisible ? 'hidden' : '')}}>
            <StickyBar loading={this.state.numOfActiveRequests > 0} content={this.content()}/>
            <Footer user={this.props.user}
                    logIn={this.logIn}
                    signUp={this.signUp}
                    logOut={this.logOut}/>
        </div>
    }
}

const mapStateToProps = state => ({
    routes: state.routes,
    sectors: state.sectors,
    user: state.user,
    token: state.token
});

const mapDispatchToProps = dispatch => ({
    loadRoutes: routes => dispatch(loadRoutes(routes)),
    loadSectors: sectors => dispatch(loadSectors(sectors)),
    saveUser: user => dispatch(saveUser(user)),
    saveToken: token => dispatch(saveToken(token)),
    removeToken: () => dispatch(removeToken())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
