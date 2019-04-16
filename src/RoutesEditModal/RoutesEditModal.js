import React, {Component}           from 'react';
import Button                       from '../Button/Button';
import RouteDataEditableTable       from '../RouteDataEditableTable/RouteDataEditableTable';
import RouteEditor                  from '../RouteEditor/RouteEditor';
import CloseButton                  from '../CloseButton/CloseButton';
import ButtonHandler                from '../ButtonHandler/ButtonHandler';
import PropTypes                    from 'prop-types';
import Axios                        from 'axios/index';
import * as R                       from 'ramda';
import ApiUrl                       from '../ApiUrl';
import {DEFAULT_COMMENTS_DISPLAYED} from '../Constants/Comments'
import {withRouter}                 from 'react-router-dom';
import {connect}                    from 'react-redux';
import {
    updateRoute,
    addRoute,
    increaseNumOfActiveRequests,
    decreaseNumOfActiveRequests
}                                   from "../actions";
import {ToastContainer}             from 'react-toastr';
import {CATEGORIES}                 from "../Constants/Categories";
import StickyBar                    from '../StickyBar/StickyBar';
import './RoutesEditModal.css';

class RoutesEditModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: (this.props.route.photo === null ? '/public/img/route-img/route.jpg' : this.props.route.photo.url),
            object_id: null,
            quoteComment: null,
            commentContent: '',
            comments: [],
            numOfDisplayedComments: DEFAULT_COMMENTS_DISPLAYED,
            descriptionCollapsed: false,
            numOfLikes: 0,
            numOfComments: 0,
            isLiked: false,
            likeId: 0,
            numOfRedpoints: 0,
            numOfFlash: 0,
            ascent: null,
            currentPointers: [],
            currentPointersOld: [],
            route: R.clone(this.props.route),
            users: [],
            waitSaving: false,
            fieldsOld: {}
        };
    }

    componentDidMount() {
        let route = R.clone(this.state.route);
        if (this.state.route.photo) {
            route.photo = route.photo.url;
        }
        if (this.state.route.category === null) {
            route.category = CATEGORIES[0];
        }
        this.setState({fieldsOld: route, route: R.clone(route)});
        this.loadPointers();
        this.loadUsers();
    }

    displayError = (error) => {
        if (error.response.status === 404 && error.response.statusText === 'Not Found') {
            this.container.error(error.response.data.message, 'Ошибка', {closeButton: true});
            return;
        }
        if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
            this.container.error(error.response.data, 'Ошибка', {closeButton: true});
            return;
        }
        this.container.error("Неожиданная ошибка", 'Ошибка', {closeButton: true});
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

    save = () => {
        this.setState({waitSaving: true});
        let paramList = ['number', 'name', 'author_id', 'category', 'kind', 'installed_at', 'installed_until', 'description'];
        let formData = new FormData();
        if (JSON.stringify(this.state.currentPointers) !== JSON.stringify(this.state.currentPointersOld)) {
            let mark = R.clone(this.props.route.mark);
            if (!mark) {
                mark = {colors: {holds: 1, marks: 1}};
            }
            let x = R.map((pointer) => pointer.x, this.state.currentPointers);
            let y = R.map((pointer) => pointer.y, this.state.currentPointers);
            let angle = R.map((pointer) => pointer.angle, this.state.currentPointers);
            mark.pointers = {x: x, y: y, angle: angle};
            formData.append('route[mark][colors][holds]', 1);
            formData.append('route[mark][colors][marks]', 1);
            for (let i in x) {
                formData.append('route[mark][pointers][x][]', x[i]);
                formData.append('route[mark][pointers][y][]', y[i]);
                formData.append('route[mark][pointers][angle][]', angle[i]);
            }
        }
        for (let i in paramList) {
            if (this.props.route[paramList[i]] !== this.state.route[paramList[i]]) {
                formData.append(`route[${paramList[i]}]`, this.state.route[paramList[i]]);
            }
        }
        if (this.state.route.id === null) {
            formData.append('route[sector_id]', this.state.route.sector_id);
            if (this.props.sector.kind !== 'mixed') {
                formData.append('route[kind]', this.state.route.kind);
            }
        }
        if (this.state.route.photo !== (this.props.route.photo ? this.props.route.photo.url : null)) {
            formData.append('route[photo]', this.state.route.photoFile);
        }
        this.props.increaseNumOfActiveRequests();
        if (this.props.route.id !== null) {
            Axios({
                url: `${ApiUrl}/v1/routes/${this.props.route.id}`,
                method: 'patch',
                data: formData,
                headers: {'TOKEN': this.props.token},
                config: {headers: {'Content-Type': 'multipart/form-data'}}
            })
                .then(response => {
                    this.props.decreaseNumOfActiveRequests();
                    this.setState({waitSaving: false});
                    this.props.updateRoute(this.props.route.id, response.data.payload);
                    this.props.afterSubmit(response.data.payload);
                }).catch(error => {
                this.props.decreaseNumOfActiveRequests();
                this.displayError(error);
                this.setState({waitSaving: false});
            });
        } else {
            Axios({
                url: `${ApiUrl}/v1/routes`,
                method: 'post',
                data: formData,
                headers: {'TOKEN': this.props.token},
                config: {headers: {'Content-Type': 'multipart/form-data'}}
            })
                .then(response => {
                    this.props.decreaseNumOfActiveRequests();
                    this.setState({waitSaving: false});
                    this.props.addRoute(response.data.payload);
                    this.props.afterSubmit(response.data.payload);
                }).catch(error => {
                this.props.decreaseNumOfActiveRequests();
                this.displayError(error);
                this.setState({waitSaving: false});
            });
        }
    };

    loadPointers = () => {
        let pointers = (this.props.route.mark && this.props.route.mark.pointers) ? this.props.route.mark.pointers : {
            x: [],
            y: [],
            angle: []
        };
        let mapIndexed = R.addIndex(R.map);
        pointers = mapIndexed((x, index) => {
            return {
                x: parseFloat(x),
                y: parseFloat(pointers.y[index]),
                dx: 0,
                dy: 0,
                angle: parseInt(pointers.angle[index], 10)
            }
        }, pointers.x);
        this.setState({currentPointers: pointers, currentPointersOld: pointers});
    };

    updatePointers = (pointers) => {
        this.setState({currentPointers: pointers});
    };

    onRouteParamChange = (value, paramName) => {
        let route = this.state.route;
        route[paramName] = value;
        if (paramName === 'author') {
            route['author_id'] = value.id;
        }
        if (paramName === 'photo' && value === null) {
            route['photoFile'] = null;
        }
        this.setState({route: route})
    };

    onFileRead = (event) => {
        this.onRouteParamChange(this.fileReader.result, 'photo');
    };

    onFileChosen = (file) => {
        this.fileReader = new FileReader();
        this.fileReader.onloadend = this.onFileRead;
        this.fileReader.readAsDataURL(file);
        this.onRouteParamChange(file, 'photoFile');
    };

    content = () => {
        let saveDisabled = (JSON.stringify(this.state.route) === JSON.stringify(this.state.fieldsOld) && JSON.stringify(this.state.currentPointers) === JSON.stringify(this.state.currentPointersOld));
        return <div className="modal-overlay__wrapper">
            <div className="modal modal-overlay__modal">
                <div className="modal-block__close">
                    <CloseButton onClick={() => this.props.onClose()}/>
                </div>
                <div className="modal__track-block">
                    <div className="modal__track">
                        <div className="modal__track-descr">
                            <div className="modal__track-descr-picture"></div>
                            <div className="modal__track-descr-text">
                                Загрузите фото трассы
                            </div>
                        </div>
                        {this.state.route.photo ?
                            <RouteEditor route={this.props.route}
                                         routePhoto={typeof(this.state.route.photo) === 'string' ? this.state.route.photo : this.state.route.photo.url}
                                         pointers={this.state.currentPointers}
                                         editable={true}
                                         updatePointers={this.updatePointers}/> : ''}
                        <div className="btn-handler__track-toggles">
                            <input type="file" hidden={true} ref={(ref) => this.fileInput = ref}
                                   onChange={(event) => this.onFileChosen(event.target.files[0])}/>
                            {this.state.route.photo ?
                                <React.Fragment><ButtonHandler onClick={() => this.fileInput.click()}
                                                               title="Обновить фото"
                                                               xlinkHref="/public/img/btn-handler/btn-handler-sprite.svg#icon-btn-reload"/><ButtonHandler
                                    onClick={() => this.onRouteParamChange(null, 'photo')} title="Удалить фото"
                                    xlinkHref="/public/img/btn-handler/btn-handler-sprite.svg#icon-btn-close"/></React.Fragment> :
                                <ButtonHandler onClick={() => this.fileInput.click()} title="Загрузить фото"
                                               xlinkHref="/public/img/btn-handler/btn-handler-sprite.svg#icon-btn-download"/>}
                        </div>
                    </div>
                    <div
                        className="modal__track-footer modal__track-footer-edit-mode">
                        <div className="modal__track-footer-edit-mode-item">
                            <Button size="small" style="gray" title="Отмена"
                                    onClick={this.props.cancel}></Button>
                        </div>
                        <div className="modal__track-footer-edit-mode-item">
                            <Button size="small" style="normal" title="Сохранить"
                                    isWaiting={this.state.waitSaving}
                                    disabled={saveDisabled}
                                    onClick={this.save}></Button>
                        </div>
                    </div>
                </div>
                <div className="modal__track-info">
                    <div className="modal__track-header">
                        <h1 className="modal__title">
                            № <input type="text"
                                     onChange={(event) => this.onRouteParamChange(event.target.value, 'number')}
                                     className="modal__title-input modal__number-input modal__title-input_dark"
                                     maxLength="6"
                                     value={this.state.route.number === null ? '' : this.state.route.number}/>
                            <span className="modal__title-place">(“</span>
                            <input type="text"
                                   onChange={(event) => this.onRouteParamChange(event.target.value, 'name')}
                                   className="modal__title-input"
                                   value={this.state.route.name === null ? '' : this.state.route.name}/>
                            <span
                                className="modal__title-place">”)</span>
                        </h1>
                        <RouteDataEditableTable route={this.state.route}
                                                sector={this.props.sector}
                                                onRouteParamChange={this.onRouteParamChange}
                                                users={this.state.users}/>
                    </div>
                    <div className="modal__item modal__descr-item">
                        <div className="collapsable-block">
                            <button className="collapsable-block__header collapsable-block__header_edit">
                                Описание
                            </button>
                            <textarea className="modal__descr-edit"
                                      onChange={(event) => this.onRouteParamChange(event.target.value, 'description')}
                                      value={this.state.route.description ? this.state.route.description : ''}></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    };

    render() {
        return <React.Fragment>
            <ToastContainer
                ref={ref => this.container = ref}
                onClick={() => this.container.clear()}
                className="toast-top-right"
            />
            <div className="modal-overlay">
                <StickyBar loading={this.props.numOfActiveRequests > 0} content={this.content()} hideLoaded={true}/>
            </div>
        </React.Fragment>;
    }
}

RoutesEditModal.propTypes = {
    route: PropTypes.object.isRequired,
    sector: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    afterSubmit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user,
    token: state.token,
    numOfActiveRequests: state.numOfActiveRequests
});

const mapDispatchToProps = dispatch => ({
    updateRoute: (id, route) => dispatch(updateRoute(id, route)),
    addRoute: (route) => dispatch(addRoute(route)),
    increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
    decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesEditModal));
