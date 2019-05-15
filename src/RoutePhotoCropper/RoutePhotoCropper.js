import React, {Component} from 'react';
import ReactCrop          from "react-image-crop";
import PropTypes          from 'prop-types';
import Button             from '../Button/Button';
import ButtonHandler      from '../ButtonHandler/ButtonHandler';
import {CROP_DEFAULT}     from '../Constants/Route';
import "react-image-crop/dist/ReactCrop.css";
import './RoutePhotoCropper.css';

export default class RoutePhotoCropper extends Component {
    state = {
        crop: CROP_DEFAULT,
        rotate: 0,
        image: null,
        src: this.props.src
    };

    onImageLoaded = (image) => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = crop => {
        this.setState({crop});
    };

    makeClientCrop = (crop) => {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = this.getCroppedImg(
                this.imageRef,
                crop,
                "newFile.jpeg"
            );
            this.setState({croppedImageUrl});
        }
    };

    getCroppedImg = (image, crop, fileName) => {
        this.setState({image: image});
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, "image/jpeg");
        });
    };

    rotate = () => {
        let image = this.imageRef;
        let canvas = document.createElement('canvas');
        canvas.width = image.naturalHeight;
        canvas.height = image.naturalWidth;

        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let width = canvas.width;
        let height = canvas.height;
        let ctx = canvas.getContext('2d');

        ctx.translate(x, y);
        ctx.rotate(90 * Math.PI / 180);
        ctx.drawImage(image, -height / 2, -width / 2, height, width);
        ctx.rotate(-90 * Math.PI / 180);
        ctx.translate(-x, -y);

        let new_image_url = canvas.toDataURL();
        this.setState({rotate: (this.state.rotate + 90) % 360, src: new_image_url, crop: CROP_DEFAULT})
    };

    render() {
        return <React.Fragment>
            <div style={{position: 'absolute', marginTop: 20, marginLeft: 'calc(100% - 65px)', zIndex: 300, display: 'flex'}}>
                <ButtonHandler onClick={this.rotate}
                               title="Поворот"
                               xlinkHref="/public/img/btn-handler/btn-handler-sprite.svg#icon-btn-reload"/>
                <ButtonHandler
                    onClick={this.props.close} title="Закрыть"
                    xlinkHref="/public/img/btn-handler/btn-handler-sprite.svg#icon-btn-close"/>
            </div>
            <div style={{
                position: 'absolute',
                marginTop: 'calc(100vh - 45px)',
                marginLeft: 'calc(100% - 165px)',
                zIndex: 300
            }}>
                <Button size="small" style="normal" title="Сохранить"
                        onClick={() => this.state.croppedImageUrl.then(
                            (e) => this.props.save(e, this.state.crop, this.state.rotate, this.state.image)
                        )}>
                </Button>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100%',
                width: '100%',
                backgroundColor: '#000000'
            }}>
                <div style={{zIndex: 200}}>
                    {this.props.src ?
                        <ReactCrop
                            src={this.state.src}
                            crop={this.state.crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        /> : ''}
                </div>
            </div>
        </React.Fragment>;
    }
}

RoutePhotoCropper.propTypes = {
    close: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
};
