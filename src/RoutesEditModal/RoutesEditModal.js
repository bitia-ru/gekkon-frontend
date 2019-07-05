import React, {Component}     from 'react';
import Button                 from '../Button/Button';
import RouteDataEditableTable from '../RouteDataEditableTable/RouteDataEditableTable';
import RouteEditor            from '../RouteEditor/RouteEditor';
import CloseButton            from '../CloseButton/CloseButton';
import ButtonHandler          from '../ButtonHandler/ButtonHandler';
import PropTypes              from 'prop-types';
import * as R                 from 'ramda';
import {CATEGORIES}           from "../Constants/Categories";
import StickyBar              from '../StickyBar/StickyBar';
import RoutePhotoCropper      from '../RoutePhotoCropper/RoutePhotoCropper';
import './RoutesEditModal.css';

export default class RoutesEditModal extends Component {

    constructor(props) {
        super(props);

        const {route} = this.props;
        this.state = {
            url: (route.photo === null ? '/public/img/route-img/route.jpg' : route.photo.url),
            object_id: null,
            currentPointers: [],
            currentPointersOld: [],
            route: R.clone(route),
            fieldsOld: {},
            showCropper: false,
            photo: {content: null, file: null, crop: null, rotate: null}
        };
        this.mouseOver = false;
    }

    componentDidMount() {
        const {route} = this.state;
        let routeCopy = R.clone(route);
        if (route.photo) {
            routeCopy.photo = routeCopy.photo.url;
        }
        if (route.category === null) {
            routeCopy.category = CATEGORIES[6];
        }
        this.setState({fieldsOld: routeCopy, route: R.clone(routeCopy)});
        this.loadPointers();
        window.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
    }

    onKeyDown = (event) => {
        const {onClose} = this.props;
        if (event.key === 'Escape') {
            onClose();
        }
    };

    changed = (newValue, oldValue) => {
        return JSON.stringify(newValue) !== JSON.stringify(oldValue);
    };

    save = () => {
        const {
                  route: routeProp, sector, user, updateRoute, createRoute,
              } = this.props;
        const {
                  currentPointers, currentPointersOld, route, photo,
              } = this.state;
        let paramList = [
            'number',
            'name',
            'author_id',
            'category',
            'kind',
            'installed_at',
            'installed_until',
            'description'
        ];
        let formData = new FormData();
        let pointersChanged = this.changed(currentPointers, currentPointersOld);
        let holdsColorsChanged = this.changed(routeProp.holds_color, route.holds_color);
        let marksColorsChanged = this.changed(routeProp.marks_color, route.marks_color);
        if (pointersChanged || holdsColorsChanged || marksColorsChanged) {
            let x = R.map((pointer) => pointer.x, currentPointers);
            let y = R.map((pointer) => pointer.y, currentPointers);
            let angle = R.map((pointer) => pointer.angle, currentPointers);
            if (route.holds_color) {
                formData.append('route[mark][colors][holds]', route.holds_color.id);
            }
            if (route.marks_color) {
                formData.append('route[mark][colors][marks]', route.marks_color.id);
            }
            for (let i in x) {
                formData.append('route[mark][pointers][x][]', x[i]);
                formData.append('route[mark][pointers][y][]', y[i]);
                formData.append('route[mark][pointers][angle][]', angle[i]);
            }
        }
        for (let i in paramList) {
            if (routeProp[paramList[i]] !== route[paramList[i]]) {
                formData.append(`route[${paramList[i]}]`, route[paramList[i]]);
            }
        }
        if (route.id === null) {
            formData.append('route[sector_id]', route.sector_id);
            if (sector.kind !== 'mixed') {
                formData.append('route[kind]', route.kind);
            }
        }
        if (route.photo !== (routeProp.photo ? routeProp.photo.url : null)) {
            formData.append('route[photo]', route.photoFile);
        }
        if (photo.crop !== null) {
            formData.append('data[photo][cropping][x]', Math.round(photo.crop.x));
            formData.append('data[photo][cropping][y]', Math.round(photo.crop.y));
            formData.append('data[photo][cropping][width]', Math.round(photo.crop.width));
            formData.append('data[photo][cropping][height]', Math.round(photo.crop.height));
        }
        if (photo.rotate !== null) {
            formData.append('data[photo][rotation]', photo.rotate);
        }
        if (routeProp.data.personal || user.id === route.author_id) {
            formData.append('data[personal]', true);
        }
        if (routeProp.id !== null) {
            updateRoute(formData);
        } else {
            createRoute(formData);
        }
    };

    loadPointers = () => {
        const {route} = this.props;
        let pointers = (route.mark && route.mark.pointers) ? route.mark.pointers : {
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
        const {route} = this.state;
        route[paramName] = value;
        if (paramName === 'author') {
            route.author_id = value.id;
        }
        if (paramName === 'photo' && value === null) {
            route.photoFile = null;
        }
        this.setState({route: route})
    };

    onFileRead = (event) => {
        const {photo} = this.state;
        let photoCopy = R.clone(photo);
        photoCopy.content = this.fileReader.result;
        this.mouseOver = false;
        this.setState({showCropper: true, photo: photoCopy});
    };

    onFileChosen = (file) => {
        const {photo} = this.state;
        this.fileReader = new FileReader();
        this.fileReader.onloadend = this.onFileRead;
        this.fileReader.readAsDataURL(file);
        let photoCopy = R.clone(photo);
        photoCopy.file = file;
        this.setState({photo: photoCopy});
    };

    saveCropped = (src, crop, rotate, image) => {
        const {route, photo} = this.state;
        route.photo = src;
        route.photoFile = photo.file;
        const isFullWidth = Math.abs(image.width - crop.width) < 1;
        const isFullHeight = Math.abs(image.height - crop.height) < 1;
        if (crop.width === 0 || crop.height === 0 || (isFullWidth && isFullHeight)) {
            let photoCopy = R.clone(photo);
            photoCopy.crop = null;
            photoCopy.rotate = (rotate === 0 ? null : rotate);
            this.setState({route: route, showCropper: false, photo: photoCopy});
        } else {
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            let photoCopy = R.clone(photo);
            photoCopy.crop = {
                x: crop.x * scaleX,
                y: crop.y * scaleY,
                width: crop.width * scaleX,
                height: crop.height * scaleY
            };
            photoCopy.rotate = (rotate === 0 ? null : rotate);
            this.setState({route: route, showCropper: false, photo: photoCopy});
        }
    };

    content = () => {
        const {
                  onClose,
                  route: routeProp,
                  cancel,
                  isWaiting,
                  sector,
                  user,
                  routeMarkColors,
                  users,
              } = this.props;
        const {
                  route, fieldsOld, currentPointers, currentPointersOld,
              } = this.state;
        const routeChanged = JSON.stringify(route) !== JSON.stringify(fieldsOld);
        const markChanged = JSON.stringify(currentPointers) !== JSON.stringify(currentPointersOld);
        let saveDisabled = (!routeChanged && !markChanged);
        return <div className="modal-overlay__wrapper">
            <div className="modal modal-overlay__modal">
                <div className="modal-block__close">
                    <CloseButton onClick={() => onClose()}/>
                </div>
                <div className="modal__track-block" onMouseOver={() => this.mouseOver = true}
                     onMouseLeave={() => this.mouseOver = false}>
                    <div className="modal__track">
                        <div className="modal__track-descr">
                            <div className="modal__track-descr-picture"></div>
                            <div className="modal__track-descr-text">
                                Загрузите фото трассы
                            </div>
                        </div>
                        {
                            route.photo
                                ? (
                                    <RouteEditor
                                        route={routeProp}
                                        routePhoto={
                                            typeof(route.photo) === 'string'
                                                ? route.photo
                                                : route.photo.url
                                        }
                                        pointers={currentPointers}
                                        editable={true}
                                        updatePointers={this.updatePointers}/>
                                )
                                : ''
                        }
                        <div className="btn-handler__track-toggles">
                            <input type="file" hidden={true} ref={(ref) => this.fileInput = ref}
                                   onChange={(event) => this.onFileChosen(event.target.files[0])}/>
                            {
                                route.photo
                                    ? (
                                        <React.Fragment>
                                            <ButtonHandler
                                                onClick={() => this.fileInput.click()}
                                                title="Обновить фото"
                                                xlinkHref="/public/img/btn-handler/btn-handler-sprite.svg#icon-btn-reload"
                                            />
                                            <ButtonHandler
                                                onClick={
                                                    () => this.onRouteParamChange(null, 'photo')
                                                }
                                                title="Удалить фото"
                                                xlinkHref="/public/img/btn-handler/btn-handler-sprite.svg#icon-btn-close"
                                            />
                                        </React.Fragment>
                                    )
                                    : (
                                        <ButtonHandler
                                            onClick={() => this.fileInput.click()}
                                            title="Загрузить фото"
                                            xlinkHref="/public/img/btn-handler/btn-handler-sprite.svg#icon-btn-download"
                                        />
                                    )
                            }
                        </div>
                    </div>
                    <div
                        className="modal__track-footer modal__track-footer-edit-mode">
                        <div className="modal__track-footer-edit-mode-item">
                            <Button size="small" style="gray" title="Отмена"
                                    onClick={cancel}></Button>
                        </div>
                        <div className="modal__track-footer-edit-mode-item">
                            <Button size="small" style="normal" title="Сохранить"
                                    isWaiting={isWaiting}
                                    disabled={saveDisabled}
                                    onClick={this.save}></Button>
                        </div>
                    </div>
                </div>
                <div className="modal__track-info" onMouseOver={() => this.mouseOver = true}
                     onMouseLeave={() => this.mouseOver = false}>
                    <div className="modal__track-header">
                        <h1 className="modal__title">
                            №
                            <input
                                type="text"
                                onChange={
                                    (event) => this.onRouteParamChange(
                                        event.target.value,
                                        'number',
                                    )
                                }
                                className="modal__title-input modal__number-input modal__title-input_dark"
                                maxLength="6"
                                value={route.number === null ? '' : route.number}/>
                            <span className="modal__title-place">(“</span>
                            <input type="text"
                                   onChange={
                                       (event) => this.onRouteParamChange(
                                           event.target.value,
                                           'name'
                                       )
                                   }
                                   className="modal__title-input"
                                   value={route.name === null ? '' : route.name}/>
                            <span
                                className="modal__title-place">”)</span>
                        </h1>
                        <RouteDataEditableTable route={route}
                                                sector={sector}
                                                onRouteParamChange={this.onRouteParamChange}
                                                user={user}
                                                routeMarkColors={routeMarkColors}
                                                users={users}/>
                    </div>
                    <div className="modal__item modal__descr-item">
                        <div>
                            <button
                                className="collapsable-block__header collapsable-block__header_edit"
                            >
                                Описание
                            </button>
                            <textarea className="modal__descr-edit"
                                      onChange={
                                          (event) => this.onRouteParamChange(
                                              event.target.value,
                                              'description'
                                          )
                                      }
                                      value={route.description ? route.description : ''}>
                            </textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    };

    render() {
        const {onClose, numOfActiveRequests} = this.props;
        const {showCropper, photo} = this.state;
        return <React.Fragment>
            <div className="modal-overlay"
                 onClick={showCropper ? null : () => {
                     if (!this.mouseOver) {
                         onClose()
                     }
                 }}>
                {
                    showCropper
                        ? (
                            <RoutePhotoCropper src={photo.content}
                                               close={() => this.setState({showCropper: false})}
                                               save={this.saveCropped}
                            />
                        )
                        : (
                            <StickyBar loading={numOfActiveRequests > 0}
                                       content={this.content()}
                                       hideLoaded={true}
                            />
                        )
                }
            </div>
        </React.Fragment>;
    }
}

RoutesEditModal.propTypes = {
    user: PropTypes.object,
    route: PropTypes.object.isRequired,
    sector: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    createRoute: PropTypes.func.isRequired,
    updateRoute: PropTypes.func.isRequired,
    isWaiting: PropTypes.bool.isRequired,
    numOfActiveRequests: PropTypes.number.isRequired,
    routeMarkColors: PropTypes.array.isRequired
};

RoutesEditModal.defaultProps = {
    user: null,
};
