import React                from 'react';
import {withRouter}         from 'react-router-dom';
import Axios                from 'axios';
import Qs                   from 'qs';
import ApiUrl               from '../ApiUrl';
import {
    loadRoutes,
    loadSectors
}                           from '../actions';
import {connect}            from 'react-redux';
import RouteCardTable       from '../Elements/RouteCardTable';
import Select               from '../Elements/Select';
import FromToCategoryFilter from '../Elements/FromToCategoryFilter';
import {Spinner}            from 'spin.js';
import 'spin.js/spin.css';
import {opts}               from '../Constants/SpinnerOptions';
import {PERIOD_FILTERS}               from '../Constants/PeriodFilters';

const SpotId = 1;

Axios.interceptors.request.use(config => {
    config.paramsSerializer = params => {
        return Qs.stringify(params, {arrayFormat: "brackets"});
    };
    return config;
});

class RoutesIndex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sectorId: 0,
            categoryFrom: '1a',
            categoryTo: '9c+',
            period: 'all',
            name: ''
        }
    }

    componentDidMount() {
        this.reloadSectors();
        this.reloadRoutes(0);
    }

    reloadSectors = () => {
        Axios.get(`${ApiUrl}/v1/spots/${SpotId}/sectors`)
            .then(response => {
                this.props.loadSectors(response.data);
            }).catch(error => {
            alert(error)
        });
    };

    reloadRoutes = (sectorId, categoryFrom, categoryTo, name, period) => {
        let currentSectorId = parseInt((sectorId === null || sectorId === undefined) ? this.state.sectorId : sectorId, 10);
        let currentCategoryFrom = (categoryFrom === null || categoryFrom === undefined) ? this.state.categoryFrom : categoryFrom;
        let currentCategoryTo = (categoryTo === null || categoryTo === undefined) ? this.state.categoryTo : categoryTo;
        let currentName = (name === null || name === undefined) ? this.state.name : name;
        let currentPeriod = (period === null || period === undefined) ? this.state.period : period;
        let params = {filters: {category: [[currentCategoryFrom], [currentCategoryTo]]}};
        if (currentName !== '') {
            params.filters.name = {like: currentName};
        }
        if (currentPeriod !== 'all') {
            let d = new Date();
            let dFrom = new Date(d);
            switch (currentPeriod) {
                case 'day':
                    dFrom.setDate(d.getDate() - 1);
                    break;
                case 'month':
                    dFrom.setMonth(d.getMonth() - 1);
                    break;
                case 'week':
                    dFrom.setDate(d.getDate() - 7);
                    break;
                case 'year':
                    dFrom.setYear(d.getFullYear() - 1);
                    break;
            }
            params.filters.installed_at = [[dFrom], [d]];
        }
        let target = document.getElementById('app');
        let spinner = new Spinner(opts).spin(target);
        if (currentSectorId === 0) {
            Axios.get(`${ApiUrl}/v1/spots/${SpotId}/routes`, {params: params})
                .then(response => {
                    this.props.loadRoutes(response.data);
                    spinner.stop(target);
                }).catch(error => {
                spinner.stop(target);
                alert(error);
            });
        } else {
            Axios.get(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, {params: params})
                .then(response => {
                    this.props.loadRoutes(response.data);
                    spinner.stop(target);
                }).catch(error => {
                spinner.stop(target);
                alert(error)
            });
        }
    };

    changeSectorFilter = (event) => {
        this.setState({sectorId: event.target.value});
        this.reloadRoutes(event.target.value);
    };

    changeCategoryFilter = (categoryFrom, categoryTo) => {
        if (categoryFrom !== null) {
            this.setState({categoryFrom: categoryFrom})
        }
        if (categoryTo !== null) {
            this.setState({categoryTo: categoryTo})
        }
        this.reloadRoutes(null, categoryFrom, categoryTo);
    };

    changePeriodFilter = (event) => {
        this.setState({period: event.target.value});
        this.reloadRoutes(null, null, null, null, event.target.value);
    };

    changeNameFilter = (event) => {
        this.setState({name: event.target.value});
        this.reloadRoutes(null, null, null, event.target.value);
    };

    render() {
        return <div>
            <h1>Трассы</h1>
            <p>
                <Select onChange={this.changeSectorFilter} allText='Все трассы' items={this.props.sectors}
                        valueName='id'
                        textName='name' value={this.state.sectorId}/>
            </p>
            <p>
                <FromToCategoryFilter onChange={this.changeCategoryFilter} categoryFrom={this.state.categoryFrom}
                                      categoryTo={this.state.categoryTo}/>
            </p>
            <p>
                <span>Найти:</span>
                <input value={this.state.name} onChange={this.changeNameFilter}/>
            </p>
            <p>
                <Select onChange={this.changePeriodFilter} items={PERIOD_FILTERS} valueName='value' textName='text'
                        value={this.state.period}/>
            </p>
            <div>
                <RouteCardTable routes={this.props.routes} perLine={3}></RouteCardTable>
            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    routes: state.routes,
    sectors: state.sectors
});

const mapDispatchToProps = dispatch => ({
    loadRoutes: routes => dispatch(loadRoutes(routes)),
    loadSectors: sectors => dispatch(loadSectors(sectors))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesIndex));
