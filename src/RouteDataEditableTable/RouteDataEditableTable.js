import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import CategorySlider     from '../CategorySlider/CategorySlider';
import {GetCategoryColor} from '../Constants/Categories';
import ComboBox           from '../ComboBox/ComboBox';
import {ROUTE_KINDS}      from '../Constants/Route';
import DatePickerBlock    from '../DatePickerBlock/DatePickerBlock';
import ComboBoxPerson     from '../ComboBoxPerson/ComboBoxPerson';
import * as R             from 'ramda';
import moment             from 'moment';
import {DATE_FORMAT}      from '../Constants/Date';
import RouteColorPicker   from '../RouteColorPicker/RouteColorPicker';
import './RouteDataEditableTable.css';

export default class RouteDataEditableTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSlider: false
        }
    }

    onHoldsColorSelect = (holdsColor) => {
        const {onRouteParamChange} = this.props;
        onRouteParamChange(holdsColor, 'holds_color');
    };

    onMarksColorSelect = (marksColor) => {
        const {onRouteParamChange} = this.props;
        onRouteParamChange(marksColor, 'marks_color');
    };

    render() {
        const {
                  route, onRouteParamChange, routeMarkColors, sector, users,
              } = this.props;
        const {showSlider} = this.state;
        let kindId;
        if (route.kind) {
            kindId = R.find(R.propEq('title', route.kind), ROUTE_KINDS).id;
        }
        return <div className="route-data-table">
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Сложность:
                </div>
                <div className="route-data-table__table-item route-data-table__table-item-right">
                    <div className="route-data-table__category-track-wrap">
                        <div className="route-data-table__category-track-info"
                             role="button"
                             tabIndex={0}
                             style={{outline: 'none'}}
                             onClick={() => this.setState({showSlider: !showSlider})}>
                            <div className="route-data-table__category-track">
                                {route.category}
                            </div>
                            <div
                                className="route-data-table__category-track-color"
                                style={{backgroundColor: GetCategoryColor(route.category)}}></div>
                        </div>
                        {
                            showSlider
                                ? (
                                    <CategorySlider
                                        category={route.category}
                                        hide={() => this.setState({showSlider: false})}
                                        changeCategory={
                                            (category) => onRouteParamChange(category, 'category')
                                        }
                                    />
                                )
                                : ''
                        }
                    </div>
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Цвет зацепов:
                </div>
                <div className="route-data-table-item">
                    <RouteColorPicker editable={true} routeMarkColors={routeMarkColors}
                                      route={route}
                                      fieldName='holds_color'
                                      onSelect={this.onHoldsColorSelect}/>
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Цвет маркировки:
                </div>
                <div className="route-data-table-item">
                    <RouteColorPicker editable={true} routeMarkColors={routeMarkColors}
                                      route={route}
                                      fieldName='marks_color'
                                      onSelect={this.onMarksColorSelect}/>
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Тип:
                </div>
                <div className="route-data-table-item">
                    {
                        sector.kind === 'mixed'
                            ? (
                                <div className="modal__field-select">
                                    <ComboBox
                                        onChange={
                                            (id) => onRouteParamChange(
                                                R.find(R.propEq('id', id), ROUTE_KINDS).title,
                                                'kind',
                                            )
                                        }
                                        size='small'
                                        style='transparent'
                                        currentId={route.kind ? kindId : 0}
                                        textFieldName='text'
                                        items={ROUTE_KINDS}/>
                                </div>
                            )
                            : (
                                <React.Fragment>
                                    {R.find(R.propEq('title', route.kind), ROUTE_KINDS).text}
                                </React.Fragment>
                            )
                    }
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Дата накрутки:
                </div>
                <div className="modal__table-item modal__table-item-right">
                    <div className="modal__field-select">
                        <DatePickerBlock
                            date={route.installed_at ? moment(route.installed_at) : null}
                            dateFormat={DATE_FORMAT}
                            onChange={(date) => onRouteParamChange(date.format(), 'installed_at')}
                        />
                    </div>
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Дата cкрутки:
                </div>
                <div className="modal__table-item modal__table-item-right">
                    <div className="modal__field-select">
                        <DatePickerBlock
                            date={route.installed_until ? moment(route.installed_until) : null}
                            dateFormat={DATE_FORMAT}
                            onChange={
                                (date) => onRouteParamChange(date.format(), 'installed_until')
                            }
                        />
                    </div>
                </div>
            </div>
            {
                (!route.data.personal)
                    ? (
                        <div className="route-data-table-row">
                            <div className="route-data-table-item route-data-table-item_header">
                                Накрутчик:
                            </div>
                            <ComboBoxPerson
                                selectedUser={route.author}
                                users={users}
                                onSelect={(author) => onRouteParamChange(author, 'author')}/>
                        </div>
                    )
                    : ''
            }
        </div>;
    }
}

RouteDataEditableTable.propTypes = {
    route: PropTypes.object.isRequired,
    sector: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    onRouteParamChange: PropTypes.func.isRequired,
    routeMarkColors: PropTypes.array.isRequired
};
