import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './TabBar.css';
import * as R             from "ramda";

export default class TabBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: this.props.activeTab
        }
    }

    changeTab = (tab) => {
        this.setState({tab: tab});
    };

    render() {
        let mapIndexed = R.addIndex(R.map);
        return <div className="tab">
            <ul className="tab__list">
                {mapIndexed((title, index) => <li key={index} className="tab__list-item">
                    <a className={'tab__list-link' + (this.state.tab === (index + 1) ? ' tab__list-link_active' : '')}
                       onClick={this.props.activeList[index] ? () => this.changeTab(index + 1) : () => {
                       }} style={this.props.activeList[index] ? {} : {color: 'grey'}}>{title}</a>
                </li>, this.props.titleList)}
            </ul>
            <ul className="tab__content">
                {mapIndexed((content, index) => <li key={index} className="tab__content-item" style={{display: (this.state.tab === (index + 1) ? '' : 'none')}}>
                    {content}
                </li>, this.props.contentList)}
            </ul>
        </div>
            ;
    }
}

TabBar.propTypes = {
    activeTab: PropTypes.number.isRequired,
    titleList: PropTypes.array.isRequired,
    contentList: PropTypes.array.isRequired,
    activeList: PropTypes.array.isRequired
};
