import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import {GetCategoryColor} from '../Constants/Categories';
import moment             from 'moment';
import {GetUserName}      from '../Constants/User';
import './RouteDataTable.css';

export default class RouteDataTable extends Component {
    render() {
        let name = this.props.route.author ? GetUserName(this.props.route.author) : null;
        return <div className="route-data-table">
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Сложность:
                </div>
                <div className="route-data-table-item">
                    <div className="route-data-table__category-track">{this.props.route.category}</div>
                    <div className="route-data-table__category-track-color"
                         style={{backgroundColor: GetCategoryColor(this.props.route.category)}}></div>
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Народная категория:
                </div>
                <div className="route-data-table-item">
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Тип:
                </div>
                <div className="route-data-table-item">
                    {this.props.route.kind}
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Дата накрутки:
                </div>
                <div className="route-data-table-item">
                    {this.props.route.installed_at ? moment(this.props.route.installed_at).format('DD.MM.YYYY') : ''}
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Дата cкрутки:
                </div>
                <div className="route-data-table-item">
                    {this.props.route.installed_until ? moment(this.props.route.installed_until).format('DD.MM.YYYY') : ''}
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Накрутчик:
                </div>
                <div className="route-data-table-item">
                    <a className="route-data-table__link">{name === null ? 'Неизвестный накрутчик' : name}</a>
                </div>
            </div>
        </div>;
    }
}

RouteDataTable.propTypes = {
    route: PropTypes.object.isRequired
};
