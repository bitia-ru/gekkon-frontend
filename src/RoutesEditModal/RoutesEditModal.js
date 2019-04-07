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
import {updateRoute, addRoute}      from "../actions";
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
            realImageW: 0,
            realImageH: 0,
            currentImageW: 0,
            currentImageH: 0,
            currentLeftShift: 0,
            currentTopShift: 0,
            route: R.clone(this.props.route),
            users: [],
            waitSaving: false,
            fieldsOld: {},
            numOfActiveRequests: 0
        };
        this.numOfActiveRequests = 0;
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
        let img = new Image();
        let self = this;
        img.onload = function () {
            self.setState(
                {
                    realImageW: this.width,
                    realImageH: this.height
                });
            setTimeout(function () { //TODO nextTick
                self.updateDimensions();
            }, 1000);
        };
        img.src = this.state.url;
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

    updateDimensions = () => {
        this.setState(
            {
                currentImageW: this.state.realImageW / this.state.realImageH * this.currentContainerH(),
                currentImageH: this.currentContainerH(),
                currentLeftShift: (this.currentContainerW() - this.state.realImageW / this.state.realImageH * this.currentContainerH()) / 2.0
            });
    };

    loadUsers = () => {
        this.numOfActiveRequests++;
        this.setState({numOfActiveRequests: this.numOfActiveRequests});
        Axios.get(`${ApiUrl}/v1/users`, {headers: {'TOKEN': this.props.token}})
            .then(response => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
                let users = R.sort((u1, u2) => u2.statistics.numOfCreatedRoutes - u1.statistics.numOfCreatedRoutes, response.data.payload);
                this.setState({users: users})
            }).catch(error => {
            this.numOfActiveRequests--;
            this.setState({numOfActiveRequests: this.numOfActiveRequests});
            this.displayError(error)
        });
    };

    save = () => {
        this.setState({waitSaving: true});
        let mark = R.clone(this.props.route.mark);
        if (!mark) {
            mark = {colors: {holds: 1, marks: 1}};
        }
        let x = R.map((pointer) => pointer.x, this.state.currentPointers);
        let y = R.map((pointer) => pointer.y, this.state.currentPointers);
        let angle = R.map((pointer) => pointer.angle, this.state.currentPointers);
        mark.pointers = {x: x, y: y, angle: angle};
        let params = {route: {mark: mark}};
        let paramList = ['number', 'name', 'author_id', 'category', 'kind', 'installed_at', 'installed_until', 'description'];
        let formData = new FormData();
        for (let i in paramList) {
            if (this.props.route[paramList[i]] !== this.state.route[paramList[i]]) {
                params.route[paramList[i]] = this.state.route[paramList[i]];
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
        this.numOfActiveRequests++;
        this.setState({numOfActiveRequests: this.numOfActiveRequests});
        if (this.props.route.id !== null) {
            Axios({
                url: `${ApiUrl}/v1/routes/${this.props.route.id}`,
                method: 'patch',
                data: formData,
                headers: {'TOKEN': this.props.token},
                config: {headers: {'Content-Type': 'multipart/form-data'}}
            })
                .then(response => {
                    this.numOfActiveRequests--;
                    this.setState({numOfActiveRequests: this.numOfActiveRequests});
                    this.setState({waitSaving: false});
                    this.props.updateRoute(this.props.route.id, response.data.payload);
                    this.props.afterSubmit(response.data.payload);
                }).catch(error => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
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
                    this.numOfActiveRequests--;
                    this.setState({numOfActiveRequests: this.numOfActiveRequests});
                    this.setState({waitSaving: false});
                    this.props.addRoute(response.data.payload);
                    this.props.afterSubmit(response.data.payload);
                }).catch(error => {
                this.numOfActiveRequests--;
                this.setState({numOfActiveRequests: this.numOfActiveRequests});
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
                x: parseInt(x, 10),
                y: parseInt(pointers.y[index], 10),
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

    setImageContainer = (ref) => {
        this.imageContainer = ref;
    };

    currentContainerW = () => {
        return this.imageContainer ? this.imageContainer.offsetWidth : 0;
    };

    currentContainerH = () => {
        return this.imageContainer ? this.imageContainer.offsetHeight : 0;
    };

    containerX = () => {
        return this.imageContainer ? this.imageContainer.getBoundingClientRect().x : 0;
    };

    containerY = () => {
        return this.imageContainer ? this.imageContainer.getBoundingClientRect().y : 0;
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
                                         setImageContainer={this.setImageContainer}
                                         currentContainerW={this.currentContainerW()}
                                         currentContainerH={this.currentContainerH()}
                                         containerX={this.containerX()}
                                         containerY={this.containerY()}
                                         editable={true}
                                         realImageW={this.state.realImageW}
                                         realImageH={this.state.realImageH}
                                         currentImageW={this.state.currentImageW}
                                         currentImageH={this.state.currentImageH}
                                         currentLeftShift={this.state.currentLeftShift}
                                         currentTopShift={this.state.currentTopShift}
                                         updateDimensions={this.updateDimensions}
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
                <StickyBar loading={this.state.numOfActiveRequests > 0} content={this.content()} hideLoaded={true}/>
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
    token: state.token
});

const mapDispatchToProps = dispatch => ({
    updateRoute: (id, route) => dispatch(updateRoute(id, route)),
    addRoute: (route) => dispatch(addRoute(route))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesEditModal));
