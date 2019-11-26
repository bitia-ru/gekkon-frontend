import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Button from '../Button/Button';
import RouteDataEditableTable from '../RouteDataEditableTable/RouteDataEditableTable';
import RouteEditor from '../RouteEditor/RouteEditor';
import CloseButton from '../CloseButton/CloseButton';
import ButtonHandler from '../ButtonHandler/ButtonHandler';
import { CATEGORIES } from '../Constants/Categories';
import StickyBar from '../StickyBar/StickyBar';
import RoutePhotoCropper from '../RoutePhotoCropper/RoutePhotoCropper';
import {
  isNeeded as exifRotateIgnoredIsNeeded,
  fixRoutePhotoUpdateParams,
} from '../Workarounds/EXIFRotateIgnored';
import SchemeModal from '../SchemeModal/SchemeModal';
import ShowSchemeButton from '../ShowSchemeButton/ShowSchemeButton';
import './RoutesEditModal.css';

export default class RoutesEditModal extends Component {
  constructor(props) {
    super(props);

    const { route } = this.props;
    this.state = {
      currentPointers: [],
      currentPointersOld: [],
      route: R.clone(route),
      fieldsOld: {},
      showCropper: false,
      photo: {
        content: null, file: null, crop: null, rotate: null,
      },
      routeImageLoading: true,
      schemeModalVisible: false,
    };
    this.mouseOver = false;
  }

  componentDidMount() {
    const { route } = this.state;
    const routeCopy = R.clone(route);
    if (route.photo) {
      routeCopy.photo = routeCopy.photo.url;
    }
    if (route.category === null) {
      routeCopy.category = CATEGORIES[6];
    }
    this.setState({ fieldsOld: routeCopy, route: R.clone(routeCopy) });
    this.loadPointers();
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

    onKeyDown = (event) => {
      const { onClose } = this.props;
      if (event.key === 'Escape') {
        onClose();
      }
    };

    changed = (newValue, oldValue) => JSON.stringify(newValue) !== JSON.stringify(oldValue);

    save = () => {
      const {
        route: routeProp, sector, user, updateRoute, createRoute,
      } = this.props;
      const {
        currentPointers, currentPointersOld, route, photo,
      } = this.state;
      const paramList = [
        'number',
        'name',
        'author_id',
        'category',
        'kind',
        'installed_at',
        'installed_until',
        'description',
      ];
      const formData = new FormData();
      const pointersChanged = this.changed(currentPointers, currentPointersOld);
      const holdsColorsChanged = this.changed(routeProp.holds_color, route.holds_color);
      const marksColorsChanged = this.changed(routeProp.marks_color, route.marks_color);
      if (pointersChanged || holdsColorsChanged || marksColorsChanged) {
        const x = R.map(pointer => pointer.x, currentPointers);
        const y = R.map(pointer => pointer.y, currentPointers);
        const angle = R.map(pointer => pointer.angle, currentPointers);
        if (route.holds_color) {
          formData.append('route[mark][colors][holds]', route.holds_color.id);
        }
        if (route.marks_color) {
          formData.append('route[mark][colors][marks]', route.marks_color.id);
        }
        for (const i in x) {
          formData.append('route[mark][pointers][x][]', x[i]);
          formData.append('route[mark][pointers][y][]', y[i]);
          formData.append('route[mark][pointers][angle][]', angle[i]);
        }
      }
      for (const i in paramList) {
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
      if (JSON.stringify(routeProp.data.position) !== JSON.stringify(route.data.position)) {
        formData.append('data[position][left]', route.data.position.left);
        formData.append('data[position][top]', route.data.position.top);
      }
      if (routeProp.id !== null) {
        updateRoute(formData);
      } else {
        createRoute(formData);
      }
    };

    loadPointers = () => {
      const { route } = this.props;
      let pointers = (route.mark && route.mark.pointers) ? route.mark.pointers : {
        x: [],
        y: [],
        angle: [],
      };
      const mapIndexed = R.addIndex(R.map);
      pointers = mapIndexed((x, index) => ({
        x: parseFloat(x),
        y: parseFloat(pointers.y[index]),
        dx: 0,
        dy: 0,
        angle: parseInt(pointers.angle[index], 10),
      }), pointers.x);
      this.setState({ currentPointers: pointers, currentPointersOld: pointers });
    };

    updatePointers = (pointers) => {
      this.setState({ currentPointers: pointers });
    };

    onRouteParamChange = (value, paramName) => {
      const { route } = this.state;
      route[paramName] = value;
      if (paramName === 'author') {
        route.author_id = value.id;
      }
      if (paramName === 'photo' && value === null) {
        route.photoFile = null;
      }
      this.setState({ route });
    };

    onFileRead = () => {
      const { photo } = this.state;
      const photoCopy = R.clone(photo);
      photoCopy.content = this.fileReader.result;
      this.mouseOver = false;
      this.setState({ showCropper: true, photo: photoCopy });
    };

    onFileChosen = (file) => {
      const { photo } = this.state;
      this.fileReader = new FileReader();
      this.fileReader.onloadend = this.onFileRead;
      this.fileReader.readAsDataURL(file);
      const photoCopy = R.clone(photo);
      photoCopy.file = file;
      this.setState({ photo: photoCopy });
    };

    saveCropped = (src, crop, rotate, image, exifAngle) => {
      const { route, photo } = this.state;
      route.photo = src;
      route.photoFile = photo.file;
      const isFullWidth = Math.abs(image.width - crop.width) < 1;
      const isFullHeight = Math.abs(image.height - crop.height) < 1;
      if (crop.width === 0 || crop.height === 0 || (isFullWidth && isFullHeight)) {
        let photoCopy = R.clone(photo);
        photoCopy.crop = null;
        photoCopy.rotate = (rotate === 0 ? null : rotate);
        if (exifRotateIgnoredIsNeeded(exifAngle)) {
          photoCopy = fixRoutePhotoUpdateParams(exifAngle, photoCopy);
        }
        this.setState({ route, showCropper: false, photo: photoCopy });
      } else {
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        let photoCopy = R.clone(photo);
        photoCopy.crop = {
          x: crop.x * scaleX,
          y: crop.y * scaleY,
          width: crop.width * scaleX,
          height: crop.height * scaleY,
        };
        photoCopy.rotate = (rotate === 0 ? null : rotate);
        if (exifRotateIgnoredIsNeeded(exifAngle)) {
          photoCopy = fixRoutePhotoUpdateParams(exifAngle, photoCopy);
        }
        this.setState({ route, showCropper: false, photo: photoCopy });
      }
    };

    saveRoutePositionAndClose = (position) => {
      const { route } = this.state;
      const data = R.clone(route.data);
      data.position = R.clone(position);
      this.onRouteParamChange(data, 'data');
      this.setState({ schemeModalVisible: false });
    };

    resetRoutePositionAndClose = () => {
      this.setState({ schemeModalVisible: false });
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
        diagram,
      } = this.props;
      const {
        route,
        fieldsOld,
        currentPointers,
        currentPointersOld,
        routeImageLoading,
        schemeModalVisible,
      } = this.state;
      const routeChanged = JSON.stringify(route) !== JSON.stringify(fieldsOld);
      const markChanged = JSON.stringify(currentPointers) !== JSON.stringify(currentPointersOld);
      const saveDisabled = (!routeChanged && !markChanged);
      const iconImage = require('../../img/btn-handler/btn-handler-sprite.svg');
      return (
        <div className="modal-overlay__wrapper">
          <div className="modal modal-overlay__modal">
            <div className="modal-block__close">
              <CloseButton
                onClick={
                  schemeModalVisible
                    ? this.resetRoutePositionAndClose
                    : () => onClose()
                }
              />
            </div>
            {
              schemeModalVisible
                ? (
                  <SchemeModal
                    currentRoute={route}
                    editable
                    diagram={diagram}
                    save={this.saveRoutePositionAndClose}
                    close={this.resetRoutePositionAndClose}
                  />
                )
                : (
                  <>
                    <div
                      className="modal__track-block"
                      onMouseOver={() => {
                        this.mouseOver = true;
                      }}
                      onMouseLeave={() => {
                        this.mouseOver = false;
                      }}
                    >
                      <div className="modal__track">
                        <ShowSchemeButton
                          disabled={diagram === null}
                          title={diagram === null ? 'Схема зала ещё не загружена' : ''}
                          onClick={() => this.setState({ schemeModalVisible: true })}
                        />
                        {
                          (!route.photo || !routeImageLoading) && (
                            <div className="modal__track-descr">
                              <div className="modal__track-descr-picture" />
                              <div className="modal__track-descr-text">Загрузите фото трассы</div>
                            </div>
                          )
                        }
                        {
                          route.photo
                            ? (
                              <RouteEditor
                                route={routeProp}
                                routePhoto={
                                  typeof (route.photo) === 'string'
                                    ? route.photo
                                    : route.photo.url
                                }
                                pointers={currentPointers}
                                editable
                                updatePointers={this.updatePointers}
                                routeImageLoading={routeImageLoading}
                                onImageLoad={() => this.setState({ routeImageLoading: false })}
                              />
                            )
                            : ''
                        }
                        <div className="btn-handler__track-toggles">
                          <input
                            type="file"
                            hidden
                            ref={(ref) => {
                              this.fileInput = ref;
                            }}
                            onChange={event => this.onFileChosen(event.target.files[0])}
                          />
                          {
                            route.photo
                              ? (
                                <React.Fragment>
                                  <ButtonHandler
                                    onClick={() => this.fileInput.click()}
                                    title="Обновить фото"
                                    xlinkHref={`${iconImage}#icon-btn-reload`}
                                  />
                                  <ButtonHandler
                                    onClick={
                                      () => this.onRouteParamChange(null, 'photo')
                                    }
                                    title="Удалить фото"
                                    xlinkHref={`${iconImage}#icon-btn-close`}
                                  />
                                </React.Fragment>
                              )
                              : (
                                <ButtonHandler
                                  onClick={() => this.fileInput.click()}
                                  title="Загрузить фото"
                                  xlinkHref={`${iconImage}#icon-btn-download`}
                                />
                              )
                          }
                        </div>
                      </div>
                      <div
                        className="modal__track-footer modal__track-footer-edit-mode"
                      >
                        <div className="modal__track-footer-edit-mode-item">
                          <Button
                            size="small"
                            style="gray"
                            title="Отмена"
                            onClick={cancel}
                          />
                        </div>
                        <div className="modal__track-footer-edit-mode-item">
                          <Button
                            size="small"
                            style="normal"
                            title="Сохранить"
                            isWaiting={isWaiting}
                            disabled={saveDisabled}
                            onClick={this.save}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="modal__track-info"
                      onMouseOver={() => {
                        this.mouseOver = true;
                      }}
                      onMouseLeave={() => {
                        this.mouseOver = false;
                      }}
                    >
                      <div className="modal__track-header">
                        <h1 className="modal__title">
                          {'№ '}
                          <input
                            type="text"
                            onChange={
                              event => this.onRouteParamChange(
                                event.target.value,
                                'number',
                              )
                            }
                            className="modal__title-input modal__number-input modal__title-input_dark"
                            maxLength="6"
                            value={route.number === null ? '' : route.number}
                          />
                          <span className="modal__title-place">(“</span>
                          <input
                            type="text"
                            onChange={
                              event => this.onRouteParamChange(
                                event.target.value,
                                'name',
                              )
                            }
                            className="modal__title-input"
                            value={route.name === null ? '' : route.name}
                          />
                          <span className="modal__title-place">”)</span>
                        </h1>
                        <RouteDataEditableTable
                          route={route}
                          sector={sector}
                          onRouteParamChange={this.onRouteParamChange}
                          user={user}
                          routeMarkColors={routeMarkColors}
                          users={users}
                        />
                      </div>
                      <div className="modal__item modal__descr-item">
                        <div>
                          <button
                            type="button"
                            className="collapsable-block__header collapsable-block__header_edit"
                          >
                            Описание
                          </button>
                          <textarea
                            className="modal__descr-edit"
                            onChange={
                              event => this.onRouteParamChange(
                                event.target.value,
                                'description',
                              )
                            }
                            value={route.description ? route.description : ''}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )
            }
          </div>
        </div>
      );
    };

    render() {
      const { onClose, numOfActiveRequests } = this.props;
      const {
        showCropper,
        photo,
      } = this.state;
      return (
        <>
          <div
            className="modal-overlay"
            onClick={showCropper ? null : () => {
              if (!this.mouseOver) {
                onClose();
              }
            }}
          >
            {
              showCropper
                ? (
                  <RoutePhotoCropper
                    src={photo.content}
                    close={() => this.setState({ showCropper: false })}
                    save={this.saveCropped}
                  />
                )
                : (
                  <StickyBar
                    loading={numOfActiveRequests > 0}
                    content={this.content()}
                    hideLoaded
                  />
                )
            }
          </div>
        </>
      );
    }
}

RoutesEditModal.propTypes = {
  user: PropTypes.object,
  diagram: PropTypes.string,
  route: PropTypes.object.isRequired,
  sector: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  createRoute: PropTypes.func.isRequired,
  updateRoute: PropTypes.func.isRequired,
  isWaiting: PropTypes.bool.isRequired,
  numOfActiveRequests: PropTypes.number.isRequired,
  routeMarkColors: PropTypes.array.isRequired,
};
