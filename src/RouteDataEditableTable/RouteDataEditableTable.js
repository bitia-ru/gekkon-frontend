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
import {DATE_FORMAT}      from '../Constants/Date'
import './RouteDataEditableTable.css';

export default class RouteDataEditableTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSlider: false
        }
    }

    render() {
        return <div className="route-data-table">
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Сложность:
                </div>
                <div className="route-data-table__table-item route-data-table__table-item-right">
                    <div className="route-data-table__category-track-wrap">
                        <div className="route-data-table__category-track-info" onClick={() => this.setState({showSlider: !this.state.showSlider})}>
                            <div className="route-data-table__category-track">{this.props.route.category}</div>
                            <div
                                className="route-data-table__category-track-color"
                                style={{backgroundColor: GetCategoryColor(this.props.route.category)}}></div>
                        </div>
                        {this.state.showSlider ? <CategorySlider category={this.props.route.category}
                                                                 hide={() => this.setState({showSlider: false})}
                                                                 changeCategory={(category) => this.props.onRouteParamChange(category, 'category')}/> : ''}
                    </div>
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Тип:
                </div>
                <div className="route-data-table-item">
                    {this.props.sector.kind === 'mixed' ? <div className="modal__field-select">
                        <ComboBox
                            onChange={(id) => this.props.onRouteParamChange(R.find(R.propEq('id', id), ROUTE_KINDS).title, 'kind')}
                            size='small'
                            style='transparent'
                            currentId={this.props.route.kind ? R.find(R.propEq('title', this.props.route.kind), ROUTE_KINDS).id : 0}
                            textFieldName='title'
                            items={ROUTE_KINDS}/>
                    </div> : <React.Fragment>{this.props.route.kind}</React.Fragment>}
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Дата накрутки:
                </div>
                <div className="modal__table-item modal__table-item-right">
                    <div className="modal__field-select">
                        <DatePickerBlock date={this.props.route.installed_at ? moment(this.props.route.installed_at) : null}
                                         dateFormat={DATE_FORMAT}
                                         onChange={(date) => this.props.onRouteParamChange(date.format(), 'installed_at')}/>
                    </div>
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Дата cкрутки:
                </div>
                <div className="modal__table-item modal__table-item-right">
                    <div className="modal__field-select">
                        <DatePickerBlock date={this.props.route.installed_until ? moment(this.props.route.installed_until) : null}
                                         dateFormat={DATE_FORMAT}
                                         onChange={(date) => this.props.onRouteParamChange(date.format(), 'installed_until')}/>
                    </div>
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Накрутчик:
                </div>
                <ComboBoxPerson selectedUser={this.props.route.author} users={this.props.users} onSelect={(author) => this.props.onRouteParamChange(author, 'author')}/>
            </div>
        </div>;
    }
}

RouteDataEditableTable.propTypes = {
    route: PropTypes.object.isRequired,
    sector: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    onRouteParamChange: PropTypes.func.isRequired
};
