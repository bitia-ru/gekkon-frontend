import React           from 'react';
import {withRouter}    from 'react-router-dom';
import Axios           from 'axios';
import Qs              from 'qs';
import ApiUrl          from '../ApiUrl';
import {
    loadRoutes,
    loadSectors,
    saveUser
}                      from '../actions';
import {connect}                from 'react-redux';
import {Spinner}                from 'spin.js';
import 'spin.js/spin.css';
import {opts}                   from '../Constants/SpinnerOptions';
import Content                  from '../Content/Content'
import Header                   from '../Header/Header';
import Footer                   from '../Footer/Footer';
import RoutesShowModal          from '../Routes/RoutesShowModal';
import * as R                   from 'ramda';
import bcrypt                   from "bcryptjs";
import {SALT_ROUNDS}            from "../Constants/Bcrypt";
import {TOKEN_COOKIES_LIFETIME} from "../Constants/Cookies";
import Cookies                  from "js-cookie";

const NumOfDays = 7;

Axios.interceptors.request.use(config => {
    config.paramsSerializer = params => {
        return Qs.stringify(params, {arrayFormat: "brackets"});
    };
    return config;
});

class SpotsShow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
            routesShowModalVisible: false,
            currentShown: {}
        }
    }

    componentDidMount() {
        if (Cookies.get('user_session_token') !== undefined) {
            let params = {user_session: {token: Cookies.get('user_session_token')}};
            Axios.post(`${ApiUrl}/v1/user_sessions/sign_in`, params)
                .then(response => {
                    this.props.saveUser(response.data.payload.user);
                }).catch(error => {
                Cookies.remove('user_session_token', { path: '' });
            });
        }
        this.reloadSpot();
        this.reloadSectors();
        this.reloadRoutes(0);
    }

    onRouteClick = (id) => {
        this.setState({routesShowModalVisible: true, currentShown: R.find(R.propEq('id', id))(this.props.routes)});
    };

    closeRoutesShow = () => {
        this.setState({routesShowModalVisible: false});
        if (this.state.sectorId === 0) {
            this.reloadSpot();
        } else {
            this.reloadSector(this.state.sectorId);
        }
    };

    signUp = () => {
        let login = prompt('Введите login для регистрации', '');
        let password = prompt('Введите пароль для регистрации', '');
        let salt = bcrypt.genSaltSync(SALT_ROUNDS);
        let hash = bcrypt.hashSync(password, salt);
        let params = {user: {password_digest: hash, login: login, email: `${login}@mail.ru`}};
        Axios.post(`${ApiUrl}/v1/users`, params)
            .then(response => {
                this.logIn();
            }).catch(error => {
            alert(error);
        });
    };

    logIn = () => {
        let login = prompt('Введите login для входа', '');
        let password = prompt('Введите пароль для входа', '');
        let params = {user_session: {user: {login: login}}};
        Axios.get(`${ApiUrl}/v1/user_sessions/new`, {params: params})
            .then(response => {
                let hash = bcrypt.hashSync(password, response.data);
                let params = {user_session: {user: {password_digest: hash, login: login}}};
                Axios.post(`${ApiUrl}/v1/user_sessions`, params)
                    .then(response => {
                        Cookies.set('user_session_token', response.data.payload.token, {expires: TOKEN_COOKIES_LIFETIME});
                        this.props.saveUser(response.data.payload.user);
                        this.reloadSectors(null, null, null, null, null, 1, 1);
                        if (this.state.sectorId === 0) {
                            this.reloadSpot(response.data.payload.user.id);
                        } else {
                            this.reloadSector(this.state.sectorId, response.data.payload.user.id);
                        }
                    }).catch(error => {
                    alert(error);
                });
            }).catch(error => {
            alert(error)
        });
    };

    logOut = () => {
        Cookies.remove('user_session_token', { path: '' });
        this.props.saveUser(null);
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
        Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}`, {params: params})
            .then(response => {
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
            alert(error)
        });
    };

    reloadSector = (id, userId) => {
        let currentUserId = (userId === null || userId === undefined) ? (this.props.user === null ? 0 : this.props.user.id) : userId;
        let params = {};
        if (currentUserId !== 0) {
            params.user_id = currentUserId;
        }
        params.numOfDays = NumOfDays;
        Axios.get(`${ApiUrl}/v1/sectors/${id}`, {params: params})
            .then(response => {
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
            alert(error)
        });
    };

    reloadSectors = () => {
        Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}/sectors`)
            .then(response => {
                this.props.loadSectors(response.data.payload);
            }).catch(error => {
            alert(error)
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
        let target = document.getElementById('app');
        let spinner = new Spinner(opts).spin(target);
        if (currentSectorId === 0) {
            Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}/routes`, {params: params})
                .then(response => {
                    this.setState({numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / this.state.perPage))});
                    this.props.loadRoutes(response.data.payload);
                    spinner.stop(target);
                }).catch(error => {
                spinner.stop(target);
                alert(error);
            });
        } else {
            Axios.get(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, {params: params})
                .then(response => {
                    this.setState({numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / this.state.perPage))});
                    this.props.loadRoutes(response.data.payload);
                    spinner.stop(target);
                }).catch(error => {
                spinner.stop(target);
                alert(error)
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

    render() {
        return <React.Fragment>
            <div style={{overflow: (this.state.routesShowModalVisible ? 'hidden' : '')}}>
            {this.state.routesShowModalVisible ? <RoutesShowModal closeRoutesShow={this.closeRoutesShow} route={this.state.currentShown}/> : ''}
            <Header
                data={this.state.sectorId === 0 ? this.state.spot : this.props.sectors[R.findIndex(R.propEq('id', this.state.sectorId))(this.props.sectors)]}
                sectors={this.props.sectors}
                infoData={this.state.infoData}
                changeSectorFilter={this.changeSectorFilter}
                changeNameFilter={this.changeNameFilter}
                user={this.props.user}
                signUp={this.signUp}
                logIn={this.logIn}
                logOut={this.logOut}/>
            <Content routes={this.props.routes}
                     page={this.state.page}
                     numOfPages={this.state.numOfPages}
                     period={this.state.period}
                     onRouteClick={this.onRouteClick}
                     changePeriodFilter={this.changePeriodFilter}
                     changeCategoryFilter={this.changeCategoryFilter}
                     changePage={this.changePage}/>
            <Footer user={this.props.user}
                    logIn={this.logIn}
                    logOut={this.logOut}/>
            </div>
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    routes: state.routes,
    sectors: state.sectors,
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    loadRoutes: routes => dispatch(loadRoutes(routes)),
    loadSectors: sectors => dispatch(loadSectors(sectors)),
    saveUser: user => dispatch(saveUser(user))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
