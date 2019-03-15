import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './RouteDataTable.css';

export default class RouteDataTable extends Component {
    render() {
        return <div className="route-data-table">
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Сложность:
                </div>
                <div className="route-data-table-item">
                    <div className="route-data-table__category-track">{this.props.route.category}</div>
                    <div className="route-data-table__category-track-color route-data-table__category-track-color_5c"></div>
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Народная категория:
                </div>
                <div className="route-data-table-item">
                    7/10
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
                    {this.props.route.installed_at}
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Дата cкрутки:
                </div>
                <div className="route-data-table-item">
                    {this.props.route.installed_until}
                </div>
            </div>
            <div className="route-data-table-row">
                <div className="route-data-table-item route-data-table-item_header">
                    Накрутчик:
                </div>
                <div className="route-data-table-item">
                    <a href="#" className="route-data-table__link">{(this.props.route.author && this.props.route.author.name) ? this.props.route.author.name : ''}</a>
                </div>
            </div>
        </div>;
    }
}

RouteDataTable.propTypes = {
    route: PropTypes.object.isRequired
};
