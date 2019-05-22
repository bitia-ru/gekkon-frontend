import React, {Component} from 'react';
import * as R             from 'ramda';
import PropTypes          from 'prop-types';
import './RouteColorPicker.css';

export default class RouteColorPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            droppedDown: false
        };
        this.mouseOver = false;
    }

    selectItem = (routeMarkColor) => {
        this.setState({droppedDown: false});
        this.props.onSelect(routeMarkColor);
    };

    onBlur = () => {
        if (!this.mouseOver) {
            this.setState({droppedDown: false})
        }
    };

    render() {
        let routeColor = this.props.route[this.props.fieldName];
        let hasPhotoOrColor = routeColor && (routeColor.photo || routeColor.color);
        return <div className="mark-color-picker__wrap" onClick={() => {
            if (this.props.editable) {
                this.setState({droppedDown: !this.state.droppedDown})
            }
        }} onBlur={this.onBlur} tabIndex={1} onMouseLeave={() => this.mouseOver = false}
                    onMouseOver={() => this.mouseOver = true}>
            <div className="mark-color-picker__info">
                <div
                    className="mark-color-picker__color"
                    style={(hasPhotoOrColor) ? (this.props.route[this.props.fieldName].photo ? {
                        backgroundImage: `url(${this.props.route[this.props.fieldName].photo.url})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat'
                    } : {
                        backgroundColor: this.props.route[this.props.fieldName].color
                    }) : {
                        backgroundImage: 'url(/public/img/route-img/no_color.png)',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat'
                    }}></div>
            </div>
            <div className="mark-color-picker__name">
                {this.props.route[this.props.fieldName] ? this.props.route[this.props.fieldName].name : 'не задан'}
            </div>
            {this.state.droppedDown ?
                <div className="combo-box__dropdown modal__combo-box-drowdown combo-box__dropdown_active">
                    <div className="combo-box__dropdown-wrapper">
                        {R.map((routeMarkColor) =>
                            <li key={routeMarkColor.id}
                                onClick={() => this.selectItem(routeMarkColor)}
                                className="combo-box__dropdown-item combo-box__dropdown-item_padding-10">
                                <div className="mark-color-picker__item">
                                    <div
                                        className="mark-color-picker__color"
                                        style={routeMarkColor.photo ? {
                                            backgroundImage: `url(${routeMarkColor.photo.url})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'contain',
                                            backgroundRepeat: 'no-repeat'
                                        } : (routeMarkColor.color ? {backgroundColor: routeMarkColor.color} : {
                                            backgroundImage: 'url(/public/img/route-img/no_color.png)',
                                            backgroundPosition: 'center',
                                            backgroundSize: 'contain',
                                            backgroundRepeat: 'no-repeat'
                                        })}></div>
                                    <div className="mark-color-picker__item-text">{routeMarkColor.name}</div>
                                </div>
                            </li>, this.props.routeMarkColors)}
                    </div>
                </div> : ''}
        </div>;
    }
}

RouteColorPicker.propTypes = {
    route: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    fieldName: PropTypes.string.isRequired
};
