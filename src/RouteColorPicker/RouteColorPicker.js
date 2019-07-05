import React, {Component} from 'react';
import * as R             from 'ramda';
import PropTypes          from 'prop-types';
import classNames         from 'classnames';
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

    getColorStyle = (routeMarkColor) => {
        if (routeMarkColor && routeMarkColor.photo)
            return {backgroundImage: `url(${routeMarkColor.photo.url})`};
        else if (routeMarkColor && routeMarkColor.color) {
            return {backgroundColor: routeMarkColor.color}
        }
        return {backgroundImage: 'url(/public/img/route-img/no_color.png)'}
    };

    render() {
        const {
                  route, fieldName, editable, routeMarkColors,
              } = this.props;
        const {droppedDown} = this.state;
        const droppedDownClasses = classNames({
            'combo-box__dropdown': true,
            'modal__combo-box-drowdown': true,
            'combo-box__dropdown_active': true,
        });
        const itemClasses = classNames({
            'combo-box__dropdown-item': true,
            'combo-box__dropdown-item_padding-10': true,
        });
        return <div className="mark-color-picker__wrap" onClick={() => {
            if (editable) {
                this.setState({droppedDown: !droppedDown})
            }
        }} onBlur={this.onBlur} tabIndex={1} onMouseLeave={() => this.mouseOver = false}
                    onMouseOver={() => this.mouseOver = true}>
            <div className="mark-color-picker__info">
                <div
                    className="mark-color-picker__color"
                    style={this.getColorStyle(route[fieldName])}>
                </div>
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
                            className={droppedDownClasses}>
                            <div
                                className="combo-box__dropdown-wrapper">
                                {R.map((routeMarkColor) =>
                                    <li key={routeMarkColor.id}
                                        onClick={() => this.selectItem(routeMarkColor)}
                                        className={itemClasses}>
                                        <div className="mark-color-picker__item">
                                            <div
                                                className="mark-color-picker__color"
                                                style={this.getColorStyle(routeMarkColor)}>
                                            </div>
                                            <div className="mark-color-picker__item-text">
                                                {routeMarkColor.name}
                                            </div>
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
