import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Button from '../Button/Button';
import RouteDataEditableTable from '../RouteDataEditableTable/RouteDataEditableTable';
import RouteEditor from '../RouteEditor/RouteEditor';
import CloseButton from '../CloseButton/CloseButton';
import ButtonHandler from '../ButtonHandler/ButtonHandler';
import { DEFAULT_CATEGORY } from '../../Constants/Categories';
import StickyBar from '../StickyBar/StickyBar';
import RoutePhotoCropper from '../RoutePhotoCropper/RoutePhotoCropper';
import {
  isNeeded as exifRotateIgnoredIsNeeded,
  fixRoutePhotoUpdateParams,
} from '../../Workarounds/EXIFRotateIgnored';
import SchemeModal from '../SchemeModal/SchemeModal';
import ShowSchemeButton from '../ShowSchemeButton/ShowSchemeButton';
import RouteContext from '../../contexts/RouteContext';
import NewRoute from '../../Constants/NewRoute';
import { avail } from '../../utils';
import './RoutesEditModal.css';
import { loadRouteMarkColors } from '../../stores/route_mark_colors/utils';
import { loadUsers } from '../../stores/users/utils';
import { loadSector } from '../../stores/sectors/utils';
import { addRoute, loadRoute, updateRoute } from '../../stores/routes/utils';
import getArrayByIds from '../../utils/getArrayByIds';
import { NUM_OF_DAYS } from '../../Constants/Route';
import { ApiUrl } from '../../Environ';
import getState from '../../utils/getState';
import reloadSector from '../../utils/reloadSector';
import reloadRoutes from '../../utils/reloadRoutes';

class RoutesEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPointers: [],
      currentPointersOld: [],
      route: undefined,
      fieldsOld: {},
      showCropper: false,
      photo: {
        content: null, file: null, crop: null, rotate: null,
      },
      routeImageLoading: true,
      schemeModalVisible: false,
      isWaiting: false,
    };
    this.mouseOver = false;
  }

  componentDidMount() {
    const {
      sectors,
      match,
      loadUsers: loadUsersProp,
      routeMarkColors,
      loadRoute: loadRouteProp,
      loadSector: loadSectorProp,
      loadRouteMarkColors: loadRouteMarkColorsProp,
    } = this.props;
    const sectorId = match.params.sector_id ? parseInt(match.params.sector_id, 10) : null;
    const routeId = this.getRouteId();
    if (routeId === null && !sectors[sectorId]) {
      const params = {};
      params.numOfDays = NUM_OF_DAYS;
      loadSectorProp(
        `${ApiUrl}/v1/sectors/${sectorId}`,
        params,
        (response) => {
          this.afterSectorIsLoaded(response.data.payload);
        },
      );
    }
    if (routeId === null && sectors[sectorId]) {
      this.afterSectorIsLoaded(sectors[sectorId]);
    }
    if (routeId) {
      loadRouteProp(
        `${ApiUrl}/v1/routes/${this.getRouteId()}`,
        (response) => {
          const route = response.data.payload;
          const routeCopy = R.clone(route);
          if (route.photo) {
            routeCopy.photo = routeCopy.photo.url;
          }
          if (route.category === null) {
            routeCopy.category = DEFAULT_CATEGORY;
          }
          this.setState({ fieldsOld: routeCopy, route: R.clone(routeCopy) });
          this.loadPointers(route);
        },
      );
    }
    loadUsersProp();
    if (routeMarkColors.length === 0) {
      loadRouteMarkColorsProp();
    }
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

    afterSectorIsLoaded = (sector) => {
      const {
        user,
      } = this.props;
      this.newRoute = R.clone(NewRoute);
      this.newRoute.sector_id = sector.id;
      if (sector.kind !== 'mixed') {
        this.newRoute.kind = sector.kind;
      }
      this.newRoute.category = DEFAULT_CATEGORY;
      if (user.role === 'user') this.newRoute.data.personal = true;
      this.setState({ route: R.clone(this.newRoute) });
    };

    getRouteId = () => {
      const { match } = this.props;
      return (
        match.params.route_id
          ? parseInt(match.params.route_id, 10)
          : null
      );
    };

    onKeyDown = (event) => {
      const { onClose } = this.props;
      if (event.key === 'Escape') {
        onClose();
      }
    };

    updateRoute = (params) => {
      const {
        history,
        match,
        updateRoute: updateRouteProp,
      } = this.props;
      const routeId = this.getRouteId();
      this.setState({ isWaiting: true });
      updateRouteProp(
        `${ApiUrl}/v1/routes/${routeId}`,
        params,
        () => history.push(R.replace('/edit', '', `${match.url}`)),
        () => this.setState({ isWaiting: false }),
      );
    };

    createRoute = (params) => {
      const {
        history,
        match,
        sectors,
        addRoute: addRouteProp,
      } = this.props;
      this.setState({ isWaiting: true });
      addRouteProp(
        params,
        (response) => {
          history.push(
            R.replace('new', response.data.payload.id, `${match.url}`),
          );
          reloadSector(response.data.payload.sector_id);
          reloadRoutes(
            sectors[response.data.payload.sector_id].spot_id, response.data.payload.sector_id,
          );
        },
        () => this.setState({ isWaiting: false }),
      );
    };

    changed = (newValue, oldValue) => JSON.stringify(newValue) !== JSON.stringify(oldValue);

    save = () => {
      const {
        routes, sectors, user,
      } = this.props;
      const {
        currentPointers, currentPointersOld, route, photo,
      } = this.state;
      const sector = sectors[route.sector_id];
      const routeId = this.getRouteId();
      const routeProp = routeId ? routes[routeId] : this.newRoute;
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
        formData.append('route[category]', route.category);
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
        this.updateRoute(formData);
      } else {
        this.createRoute(formData);
      }
    };

    loadPointers = (currentRoute) => {
      let route;
      if (currentRoute) {
        route = currentRoute;
      } else {
        const { routes } = this.props;
        const routeId = this.getRouteId();
        route = routeId ? routes[routeId] : this.newRoute;
      }
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
      const newRoute = R.clone(route);
      newRoute[paramName] = value;
      if (paramName === 'author') {
        newRoute.author_id = value.id;
      }
      if (paramName === 'photo' && value === null) {
        newRoute.photoFile = null;
      }
      this.setState({ route: newRoute });
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
        cancel,
        user,
        routeMarkColors,
        users,
      } = this.props;
      const {
        route,
        fieldsOld,
        currentPointers,
        currentPointersOld,
        routeImageLoading,
        schemeModalVisible,
        isWaiting,
      } = this.state;
      const routeChanged = JSON.stringify(route) !== JSON.stringify(fieldsOld);
      const markChanged = JSON.stringify(currentPointers) !== JSON.stringify(currentPointersOld);
      const saveDisabled = (!routeChanged && !markChanged);
      const iconImage = require('../../../../img/btn-handler/btn-handler-sprite.svg');
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
                    save={this.saveRoutePositionAndClose}
                    close={this.resetRoutePositionAndClose}
                  />
                )
                : (
                  <>
                    {
                      avail(route) && <>
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
                              onClick={() => this.setState({schemeModalVisible: true})}
                            />
                            {
                              ((route && !route.photo) || !routeImageLoading) && (
                                <div className="modal__track-descr">
                                  <div className="modal__track-descr-picture" />
                                  <div className="modal__track-descr-text">Загрузите фото трассы</div>
                                </div>
                              )
                            }
                            {
                              route && route.photo
                                ? (
                                  <RouteEditor
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
                                route && route.photo
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
                                value={route.number ? route.number : ''}
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
                                value={route.name ? route.name : ''}
                              />
                              <span className="modal__title-place">”)</span>
                            </h1>
                            <RouteDataEditableTable
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
                    }
                  </>
                )
            }
          </div>
        </div>
      );
    };

    render() {
      const { onClose, loading } = this.props;
      const {
        showCropper,
        photo,
        route,
      } = this.state;
      return (
        <RouteContext.Provider value={{ route }}>
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
                    loading={loading}
                    hideLoaded
                  >
                    {this.content()}
                  </StickyBar>
                )
            }
          </div>
        </RouteContext.Provider>
      );
    }
}

RoutesEditModal.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  sectors: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  routeMarkColors: PropTypes.array,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
  routes: state.routesStore.routes,
  user: state.usersStore.users[state.usersStore.currentUserId],
  users: getArrayByIds(state.usersStore.sortedUserIds, state.usersStore.users),
  routeMarkColors: state.routeMarkColorsStore.routeMarkColors,
  loading: getState(state),
});

const mapDispatchToProps = dispatch => ({
  loadRouteMarkColors: () => dispatch(loadRouteMarkColors()),
  loadUsers: () => dispatch(loadUsers()),
  loadSector: (url, params, afterLoad) => dispatch(loadSector(url, params, afterLoad)),
  loadRoute: (url, afterLoad) => dispatch(loadRoute(url, afterLoad)),
  updateRoute: (url, params, afterSuccess, afterAll) => dispatch(
    updateRoute(url, params, afterSuccess, afterAll),
  ),
  addRoute: (params, afterSuccess, afterAll) => dispatch(addRoute(params, afterSuccess, afterAll)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesEditModal));
