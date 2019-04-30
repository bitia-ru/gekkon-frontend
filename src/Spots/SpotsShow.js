import React              from 'react';
import {withRouter, Link} from 'react-router-dom';
import Axios              from 'axios';
import Qs                 from 'qs';
import ApiUrl             from '../ApiUrl';
import {
    loadRoutes,
    loadSectors,
    saveUser,
    saveToken,
    removeToken,
    increaseNumOfActiveRequests,
    decreaseNumOfActiveRequests,
    updateRoute,
    addRoute
} from '../actions';
import {connect}          from 'react-redux';
import Content            from '../Content/Content'
import Header             from '../Header/Header';
import Footer             from '../Footer/Footer';
import RoutesShowModal    from '../RoutesShowModal/RoutesShowModal';
import RoutesEditModal    from '../RoutesEditModal/RoutesEditModal';
import * as R             from 'ramda';
import Cookies            from "js-cookie";
import SignUpForm         from '../SignUpForm/SignUpForm';
import LogInForm          from '../LogInForm/LogInForm';
import Profile            from '../Profile/Profile';
import Authorization      from '../Authorization';
import {ToastContainer}   from 'react-toastr';
import StickyBar          from '../StickyBar/StickyBar';

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
            sectorId: this.props.match.params.sector_id ? parseInt(this.props.match.params.sector_id, 10) : 0,
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
            comments: [],
            numOfComments: 0,
            numOfLikes: 0,
            isLiked: false,
            likeId: 0,
            ascent: null,
            numOfRedpoints: 0,
            numOfFlash: 0,
            users: [],
            editRouteIsWaiting: false
        });
        this.loadingRouteId = this.props.match.params.route_id;
    }

    componentDidMount() {
        this.props.history.listen((location, action) => {
            if (action === 'POP') {
                let data = location.pathname.split('/');
                if (data.length > 3 && data[3] === 'sectors') {
                    let sectorId = parseInt(data[4], 10);
                    if (data.length > 5 && data[5] === 'routes') {
                        this.loadingRouteId = data[6];
                        this.setState({sectorId: sectorId});
                    } else {
                        this.setState({sectorId: sectorId, profileFormVisible: (location.hash === '#profile'), routesModalVisible: false});
                    }
                    this.reloadSector(sectorId);
                    this.reloadSectors();
                    this.reloadRoutes(sectorId);
                    this.reloadUserAscents();
                } else {
                    if (data.length > 3 && data[3] === 'routes') {
                        this.loadingRouteId = data[4];
                        this.setState({sectorId: 0});
                    } else {
                        this.setState({sectorId: 0, profileFormVisible: (location.hash === '#profile'), routesModalVisible: false});
                    }
                    this.reloadSpot();
                    this.reloadSectors();
                    this.reloadRoutes(0);
                    this.reloadUserAscents();
                }
            }
        });

        if (Cookies.get('user_session_token') !== undefined) {
            let token = Cookies.get('user_session_token');
            this.props.saveToken(token);
            this.signIn(token);
        }
        if (this.state.sectorId === 0) {
            this.reloadSpot();
        } else {
            this.reloadSector(this.state.sectorId);
        }
        this.reloadSectors();
        this.reloadRoutes(this.state.sectorId);
        this.reloadUserAscents();
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

    reloadUserAscents = (userId) => {
        let id = (userId ? userId : (this.props.user ? this.props.user.id : null));
        if (!id) {
            this.setState({ascents: []});
            return;
        }
        this.props.increaseNumOfActiveRequests();
        Axios.get(`${ApiUrl}/v1/users/${id}/ascents`)
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                this.setState({ascents: response.data.payload});
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error);
        });
    };

    onRouteClick = (id) => {
        let self = this;
        if (this.state.sectorId === 0) {
            this.props.history.push(`/spots/${this.state.spotId}/routes/${id}`);
        } else {
            this.props.history.push(`/spots/${this.state.spotId}/sectors/${this.state.sectorId}/routes/${id}`);
        }
        this.reloadComments(id);
        this.reloadLikes(id);
        this.reloadAscents(id);
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
            this.props.history.push(`/spots/${this.state.spotId}`);
        } else {
            this.reloadSector(this.state.sectorId);
            this.props.history.push(`/spots/${this.state.spotId}/sectors/${this.state.sectorId}`);
        }
        this.reloadUserAscents();
    };

    afterLogOut = () => {
        this.setState({ascents: []});
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
        this.props.increaseNumOfActiveRequests();
        Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}`, {params: params})
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
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
            this.props.decreaseNumOfActiveRequests();
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
        this.props.increaseNumOfActiveRequests();
        Axios.get(`${ApiUrl}/v1/sectors/${id}`, {params: params})
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
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
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error);
        });
    };

    reloadSectors = () => {
        this.props.increaseNumOfActiveRequests();
        Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}/sectors`)
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                this.props.loadSectors(response.data.payload);
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
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
            this.props.increaseNumOfActiveRequests();
            Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}/routes`, {params: params})
                .then(response => {
                    this.props.decreaseNumOfActiveRequests();
                    this.setState({numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / this.state.perPage))});
                    this.props.loadRoutes(response.data.payload);
                    if (this.loadingRouteId) {
                        let routeId = parseInt(this.loadingRouteId, 10);
                        this.loadingRouteId = null;
                        this.reloadComments(routeId);
                        this.reloadLikes(routeId);
                        this.reloadAscents(routeId);
                        this.setState({currentShown: R.find((route) => route.id === routeId, response.data.payload), routesModalVisible: true, editMode: false})
                    }
                }).catch(error => {
                this.props.decreaseNumOfActiveRequests();
                this.displayError(error);
            });
        } else {
            this.props.increaseNumOfActiveRequests();
            Axios.get(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, {params: params})
                .then(response => {
                    this.props.decreaseNumOfActiveRequests();
                    this.setState({numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / this.state.perPage))});
                    this.props.loadRoutes(response.data.payload);
                    if (this.loadingRouteId) {
                        let routeId = parseInt(this.loadingRouteId, 10);
                        this.loadingRouteId = null;
                        this.reloadComments(routeId);
                        this.reloadLikes(routeId);
                        this.reloadAscents(routeId);
                        this.setState({currentShown: R.find((route) => route.id === routeId, response.data.payload), routesModalVisible: true, editMode: false})
                    }
                }).catch(error => {
                this.props.decreaseNumOfActiveRequests();
                this.displayError(error);
            });
        }
    };

    changeSectorFilter = (id) => {
        if (id !== 0) {
            this.reloadSector(id);
            this.props.history.push(`/spots/${this.state.spotId}/sectors/${id}`);
            this.setState({sectorId: id, page: 1});
        } else {
            this.reloadSpot();
            this.props.history.push(`/spots/${this.state.spotId}`);
            this.setState({sectorId: id, page: 1});
        }
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

    afterSubmitLogInForm = (userId) => {
        this.reloadSectors(null, null, null, null, null, 1, 1);
        if (this.state.sectorId === 0) {
            this.reloadSpot(userId);
        } else {
            this.reloadSector(this.state.sectorId, userId);
        }
        this.reloadUserAscents(userId);
    };

    removeRoute = () => {
        if (window.confirm("Удалить трассу?")) {
            this.props.increaseNumOfActiveRequests();
            Axios({
                url: `${ApiUrl}/v1/routes/${this.state.currentShown.id}`,
                method: 'delete',
                headers: {'TOKEN': this.props.token}
            })
                .then(response => {
                    this.props.decreaseNumOfActiveRequests();
                    this.reloadRoutes(null, null, null, null, null, 1);
                    this.closeRoutesModal();
                }).catch(error => {
                this.props.decreaseNumOfActiveRequests();
                this.displayError(error)
            });
        }
        this.setState({ctrlPressed: false});
    };

    addRoute = () => {
        this.props.increaseNumOfActiveRequests();
        Axios.get(`${ApiUrl}/v1/routes/new`, {headers: {'TOKEN': this.props.token}})
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                let newRoute = R.clone(response.data.payload);
                newRoute.sector_id = this.state.sectorId;
                if (this.state.sector.kind !== 'mixed') {
                    newRoute.kind = this.state.sector.kind;
                }
                this.loadUsers();
                this.setState({currentShown: newRoute, routesModalVisible: true, editMode: true});
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error);
        });
    };

    goToProfile = () => {
        if (this.state.sectorId === 0) {
            this.props.history.push(`/spots/${this.state.spotId}#profile`);
        } else {
            this.props.history.push(`/spots/${this.state.spotId}/sectors/${this.state.sectorId}#profile`);
        }
        this.setState({routesModalVisible: false, profileFormVisible: true});
    };

    openProfileForm = () => {
        this.setState({profileFormVisible: true});
        if (this.state.sectorId === 0) {
            this.props.history.push(`/spots/${this.state.spotId}#profile`);
        } else {
            this.props.history.push(`/spots/${this.state.spotId}/sectors/${this.state.sectorId}#profile`);
        }
    };

    closeProfileForm = () => {
        this.setState({profileFormVisible: false});
        if (this.state.sectorId === 0) {
            this.props.history.push(`/spots/${this.state.spotId}`);
        } else {
            this.props.history.push(`/spots/${this.state.spotId}/sectors/${this.state.sectorId}`);
        }
    };

    flatten = (arr) => {
        if (arr.length === 0) {
            return [];
        }
        return R.map((e) => R.concat([e], this.flatten(e['route_comments'])), arr);
    };

    formattedCommentsData = (data) => {
        let self = this;
        return R.map((comment) => {
            let c = R.clone(comment);
            c['route_comments'] = R.flatten(self.flatten(c['route_comments']));
            return c
        }, data);
    };

    reloadComments = (routeId) => {
        this.props.increaseNumOfActiveRequests();
        Axios.get(`${ApiUrl}/v1/routes/${routeId}/route_comments`)
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                this.setState({
                    comments: this.formattedCommentsData(response.data.payload),
                    numOfComments: response.data.metadata.all
                });
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error)
        });
    };

    removeComment = (comment) => {
        if (!window.confirm("Удалить комментарий?")) {
            return;
        }
        this.props.increaseNumOfActiveRequests();
        Axios({
            url: `${ApiUrl}/v1/route_comments/${comment.id}`,
            method: 'delete',
            headers: {'TOKEN': this.props.token}
        })
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                this.reloadComments(this.state.currentShown.id);
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error)
        });
    };

    saveComment = (params, afterSuccess) => {
        this.props.increaseNumOfActiveRequests();
        Axios.post(`${ApiUrl}/v1/route_comments`, params, {headers: {'TOKEN': this.props.token}})
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                this.reloadComments(this.state.currentShown.id);
                if (afterSuccess) {
                    afterSuccess();
                }
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error)
        });
    };

    reloadLikes = (routeId) => {
        this.props.increaseNumOfActiveRequests();
        Axios.get(`${ApiUrl}/v1/routes/${routeId}/likes`)
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                let like = this.props.user === null ? 0 : (R.find(R.propEq('user_id', this.props.user.id))(response.data.payload));
                let isLiked = this.props.user === null ? false : (like !== undefined);
                this.setState({
                    numOfLikes: response.data.metadata.all,
                    isLiked: isLiked,
                    likeId: like === undefined ? 0 : like.id
                });
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error)
        });
    };

    onLikeChange = () => {
        this.props.increaseNumOfActiveRequests();
        if (this.state.isLiked) {
            Axios({
                url: `${ApiUrl}/v1/likes/${this.state.likeId}`,
                method: 'delete',
                headers: {'TOKEN': this.props.token}
            })
                .then(response => {
                    this.props.decreaseNumOfActiveRequests();
                    this.reloadLikes(this.state.currentShown.id);
                }).catch(error => {
                this.props.decreaseNumOfActiveRequests();
                this.displayError(error)
            });
        } else {
            let params = {like: {user_id: this.props.user.id, route_id: this.state.currentShown.id}};
            Axios.post(`${ApiUrl}/v1/likes`, params, {headers: {'TOKEN': this.props.token}})
                .then(response => {
                    this.props.decreaseNumOfActiveRequests();
                    this.reloadLikes(this.state.currentShown.id);
                }).catch(error => {
                this.props.decreaseNumOfActiveRequests();
                this.displayError(error)
            });
        }
    };

    reloadAscents = (routeId) => {
        this.props.increaseNumOfActiveRequests();
        Axios.get(`${ApiUrl}/v1/routes/${routeId}/ascents`)
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                let ascent = this.props.user === null ? null : (R.find(R.propEq('user_id', this.props.user.id))(response.data.payload));
                this.setState({
                    ascent: ascent === undefined ? null : ascent,
                    numOfRedpoints: R.filter(R.propEq('result', 'red_point'), response.data.payload).length,
                    numOfFlash: R.filter(R.propEq('result', 'flash'), response.data.payload).length
                });
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error)
        });
    };

    changeAscentResult = () => {
        this.props.increaseNumOfActiveRequests();
        if (this.state.ascent) {
            let result = this.state.ascent.result === 'red_point' ? 'flash' : (this.state.ascent.result === 'flash' ? 'unsuccessful' : 'red_point');
            let params = {ascent: {result: result}};
            Axios({
                url: `${ApiUrl}/v1/ascents/${this.state.ascent.id}`,
                method: 'patch',
                params: params,
                headers: {'TOKEN': this.props.token}
            })
                .then(response => {
                    this.props.decreaseNumOfActiveRequests();
                    this.reloadAscents(this.state.currentShown.id);
                }).catch(error => {
                this.props.decreaseNumOfActiveRequests();
                this.displayError(error)
            });

        } else {
            let result = "red_point";
            let params = {ascent: {result: result, user_id: this.props.user.id, route_id: this.state.currentShown.id}};
            Axios.post(`${ApiUrl}/v1/ascents`, params, {headers: {'TOKEN': this.props.token}})
                .then(response => {
                    this.props.decreaseNumOfActiveRequests();
                    this.reloadAscents(this.state.currentShown.id);
                }).catch(error => {
                this.props.decreaseNumOfActiveRequests();
                this.displayError(error)
            });
        }
    };

    loadUsers = () => {
        this.props.increaseNumOfActiveRequests();
        Axios.get(`${ApiUrl}/v1/users`, {headers: {'TOKEN': this.props.token}})
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                let users = R.sort((u1, u2) => u2.statistics.numOfCreatedRoutes - u1.statistics.numOfCreatedRoutes, response.data.payload);
                this.setState({users: users})
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error)
        });
    };

    createRoute = (params) => {
        this.props.increaseNumOfActiveRequests();
        this.setState({editRouteIsWaiting: true});
        Axios({
            url: `${ApiUrl}/v1/routes`,
            method: 'post',
            data: params,
            headers: {'TOKEN': this.props.token},
            config: {headers: {'Content-Type': 'multipart/form-data'}}
        })
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                this.setState({editRouteIsWaiting: false, editMode: false, currentShown: R.clone(response.data.payload)});
                this.props.addRoute(response.data.payload);
                this.setState({
                    comments: [],
                    numOfComments: 0,
                    ascents: [],
                    ascent: null,
                    numOfComments: 0,
                    numOfLikes: 0,
                    isLiked: false,
                    likeId: 0,
                    numOfRedpoints: 0,
                    numOfFlash: 0,
                })
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error);
            this.setState({editRouteIsWaiting: false});
        });
    };

    updateRoute = (params) => {
        this.props.increaseNumOfActiveRequests();
        this.setState({editRouteIsWaiting: true});
        Axios({
            url: `${ApiUrl}/v1/routes/${this.state.currentShown.id}`,
            method: 'patch',
            data: params,
            headers: {'TOKEN': this.props.token},
            config: {headers: {'Content-Type': 'multipart/form-data'}}
        })
            .then(response => {
                this.props.decreaseNumOfActiveRequests();
                this.setState({editRouteIsWaiting: false, editMode: false, currentShown: response.data.payload});
                this.props.updateRoute(this.state.currentShown.id, response.data.payload);
            }).catch(error => {
            this.props.decreaseNumOfActiveRequests();
            this.displayError(error);
            this.setState({editRouteIsWaiting: false});
        });
    };

    content = () => {
        return <React.Fragment>
            {this.state.routesModalVisible ?
                (this.state.editMode ?
                    <RoutesEditModal onClose={this.closeRoutesModal}
                                     sector={this.state.sectorId === 0 ? R.find((sector) => sector.id === this.state.currentShown.sector_id, this.props.sectors) : this.state.sector}
                                     cancel={this.state.currentShown.id === null ? () => this.setState({routesModalVisible: false}) : () => this.setState({editMode: false})}
                                     users={this.state.users}
                                     user={this.props.user}
                                     numOfActiveRequests={this.props.numOfActiveRequests}
                                     createRoute={this.createRoute}
                                     updateRoute={this.updateRoute}
                                     isWaiting={this.state.editRouteIsWaiting}
                                     route={this.state.currentShown}/> :
                    <RoutesShowModal onClose={this.closeRoutesModal} openEdit={() => {this.loadUsers(); this.setState({editMode: true})}}
                                     removeRoute={this.removeRoute} ctrlPressed={this.state.ctrlPressed}
                                     goToProfile={this.goToProfile} comments={this.state.comments}
                                     removeComment={this.removeComment} saveComment={this.saveComment}
                                     numOfComments={this.state.numOfComments}
                                     numOfLikes={this.state.numOfLikes}
                                     isLiked={this.state.isLiked}
                                     onLikeChange={this.onLikeChange}
                                     user={this.props.user}
                                     numOfActiveRequests={this.props.numOfActiveRequests}
                                     ascent={this.state.ascent}
                                     numOfRedpoints={this.state.numOfRedpoints}
                                     numOfFlash={this.state.numOfFlash}
                                     changeAscentResult={this.changeAscentResult}
                                     route={this.state.currentShown}/>) : ''}
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
            {(this.props.user && this.state.profileFormVisible) ?
                <Profile user={this.props.user} onFormSubmit={this.submitProfileForm}
                         removeVk={this.removeVk}
                         numOfActiveRequests={this.props.numOfActiveRequests}
                         showToastr={this.showToastr}
                         enterWithVk={this.enterWithVk}
                         isWaiting={this.state.profileIsWaiting}
                         closeForm={this.closeProfileForm} formErrors={this.state.profileFormErrors}
                         resetErrors={this.profileResetErrors}/> : ''}
            <ToastContainer
                ref={ref => this.container = ref}
                onClick={() => this.container.clear()}
                className="toast-top-right"
            />
            <Header
                data={this.state.sectorId === 0 ? this.state.spot : this.state.sector}
                sectors={this.props.sectors}
                sectorId={this.state.sectorId}
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
            <StickyBar loading={this.props.numOfActiveRequests > 0} content={this.content()}/>
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
    token: state.token,
    numOfActiveRequests: state.numOfActiveRequests
});

const mapDispatchToProps = dispatch => ({
    loadRoutes: routes => dispatch(loadRoutes(routes)),
    loadSectors: sectors => dispatch(loadSectors(sectors)),
    saveUser: user => dispatch(saveUser(user)),
    saveToken: token => dispatch(saveToken(token)),
    removeToken: () => dispatch(removeToken()),
    updateRoute: (id, route) => dispatch(updateRoute(id, route)),
    addRoute: (route) => dispatch(addRoute(route)),
    increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
    decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
