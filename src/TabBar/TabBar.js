import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './TabBar.css';
import * as R             from "ramda";

export default class TabBar extends Component {
    constructor(props) {
        super(props);

        const {activeTab} = this.props;
        this.state = {
            tab: activeTab
        }
    }

    changeTab = (tab) => {
        this.setState({tab: tab});
    };

    render() {
        const {activeList, titleList, contentList} = this.props;
        const {tab} = this.state;
        let mapIndexed = R.addIndex(R.map);
        return <div className="tab">
            <ul className="tab__list">
                {mapIndexed((title, index) => <li key={index} className="tab__list-item">
                    <a className={'tab__list-link' + (tab === (index + 1) ? ' tab__list-link_active' : '')}
                       onClick={activeList[index] ? () => this.changeTab(index + 1) : null}
                       style={activeList[index] ? {} : {color: 'grey'}}>{title}</a>
                </li>, titleList)}
            </ul>
            <ul className="tab__content">
                {mapIndexed((content, index) => <li key={index} className="tab__content-item"
                                                    style={{display: (tab === (index + 1) ? '' : 'none')}}>
                    {content}
                </li>, contentList)}
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
