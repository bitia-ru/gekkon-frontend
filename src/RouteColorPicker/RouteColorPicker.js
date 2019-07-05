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
        const {onSelect} = this.props;
        this.setState({droppedDown: false});
        onSelect(routeMarkColor);
    };

    onBlur = () => {
        if (!this.mouseOver) {
            this.setState({droppedDown: false})
        }
    };

    render() {
        const {
                  route, fieldName, editable, routeMarkColors,
              } = this.props;
        const {droppedDown} = this.state;
        let routeColor = route[fieldName];
        let hasPhotoOrColor = routeColor && (routeColor.photo || routeColor.color);
        return <div className="mark-color-picker__wrap" onClick={() => {
            if (editable) {
                this.setState({droppedDown: !droppedDown})
            }
        }} onBlur={this.onBlur} tabIndex={1} onMouseLeave={() => this.mouseOver = false}
                    onMouseOver={() => this.mouseOver = true}>
            <div className="mark-color-picker__info">
                <div
                    className="mark-color-picker__color"
                    style={(hasPhotoOrColor) ? (route[fieldName].photo ? {
                        backgroundImage: `url(${route[fieldName].photo.url})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat'
                    } : {
                        backgroundColor: route[fieldName].color
                    }) : {
                        backgroundImage: 'url(/public/img/route-img/no_color.png)',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat'
                    }}></div>
            </div>
            <div className="mark-color-picker__name">
                {
                    route[fieldName]
                        ? route[fieldName].name
                        : 'не задан'
                }
            </div>
            {
                droppedDown
                    ? (
                        <div
                            className="combo-box__dropdown modal__combo-box-drowdown combo-box__dropdown_active">
                            <div
                                className="combo-box__dropdown-wrapper">
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
                                    </li>, routeMarkColors)}
                            </div>
                        </div>
                    )
                    : ''
            }
        </div>;
    }
}

RouteColorPicker.propTypes = {
    onSelect: PropTypes.func,
    routeMarkColors: PropTypes.array,
    route: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    fieldName: PropTypes.string.isRequired,
};

RouteColorPicker.defaultProps = {
    onSelect: null,
    routeMarkColors: null,
};
