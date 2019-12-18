import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import EXIF from 'exif-js';
import Button from '../Button/Button';
import ButtonHandler from '../ButtonHandler/ButtonHandler';
import { CROP_DEFAULT } from '../../Constants/Route';
import 'react-image-crop/dist/ReactCrop.css';
import './RoutePhotoCropper.css';

export default class RoutePhotoCropper extends Component {
  constructor(props) {
    super(props);

    const { src } = this.props;
    this.state = {
      crop: CROP_DEFAULT,
      rotate: 0,
      image: null,
      src,
    };
    this.exifAngle = null;
  }

    onImageLoaded = (image) => {
      this.imageRef = image;
      const self = this;
      EXIF.getData(image, function () {
        const orient = EXIF.getTag(this, 'Orientation');
        if (orient === undefined) { return; }
        const lookUp = {
          1: 0, 3: 180, 6: 90, 8: 270,
        };
        self.exifAngle = lookUp[orient];
      });
    };

    onCropComplete = (crop) => {
      this.makeClientCrop(crop);
    };

    onCropChange = (crop) => {
      this.setState({ crop });
    };

    makeClientCrop = (crop) => {
      if (this.imageRef && crop.width && crop.height) {
        const croppedImageUrl = this.getCroppedImg(
          this.imageRef,
          crop,
          'newFile.jpeg',
        );
        this.setState({ croppedImageUrl });
      }
    };

    getCroppedImg = (image, crop, fileName) => {
      this.setState({ image });
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const blobCopy = R.clone(blob);
          if (!blobCopy) {
            return;
          }
          blobCopy.name = fileName;
          window.URL.revokeObjectURL(this.fileUrl);
          this.fileUrl = window.URL.createObjectURL(blobCopy);
          resolve(this.fileUrl);
        }, 'image/jpeg');
      });
    };

    rotate = () => {
      const { rotate } = this.state;
      const image = this.imageRef;
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalHeight;
      canvas.height = image.naturalWidth;

      const x = canvas.width / 2;
      const y = canvas.height / 2;
      const { width } = canvas;
      const { height } = canvas;
      const ctx = canvas.getContext('2d');

      ctx.translate(x, y);
      ctx.rotate(90 * Math.PI / 180);
      ctx.drawImage(image, -height / 2, -width / 2, height, width);
      ctx.rotate(-90 * Math.PI / 180);
      ctx.translate(-x, -y);

      const newImageUrl = canvas.toDataURL();
      this.setState({ rotate: (rotate + 90) % 360, src: newImageUrl, crop: CROP_DEFAULT });
    };

    render() {
      const { close, save, src: srcProp } = this.props;
      const {
        croppedImageUrl, crop, rotate, image, src,
      } = this.state;
      const iconImage = require('../../../../img/btn-handler/btn-handler-sprite.svg');
      return (
        <React.Fragment>
          <div
            style={{
              position: 'absolute',
              marginTop: 20,
              marginLeft: 'calc(100% - 65px)',
              zIndex: 300,
              display: 'flex',
            }}
          >
            <ButtonHandler
              onClick={this.rotate}
              title="Поворот"
              xlinkHref={`${iconImage}#icon-btn-reload`}
            />
            <ButtonHandler
              onClick={close}
              title="Закрыть"
              xlinkHref={`${iconImage}#icon-btn-close`}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              marginTop: 'calc(100vh - 45px)',
              marginLeft: 'calc(100% - 165px)',
              zIndex: 300,
            }}
          >
            <Button
              size="small"
              style="normal"
              title="Сохранить"
              onClick={() => croppedImageUrl.then(
                e => save(e, crop, rotate, image, this.exifAngle),
              )}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100%',
              width: '100%',
              backgroundColor: '#000000',
            }}
          >
            <div style={{ zIndex: 200 }}>
              {
                srcProp
                  ? (
                    <ReactCrop
                      src={src}
                      crop={crop}
                      onImageLoaded={this.onImageLoaded}
                      onComplete={this.onCropComplete}
                      onChange={this.onCropChange}
                    />
                  )
                  : ''
              }
            </div>
          </div>
        </React.Fragment>
      );
    }
}

RoutePhotoCropper.propTypes = {
  src: PropTypes.string,
  close: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

RoutePhotoCropper.defaultProps = {
  src: null,
};
