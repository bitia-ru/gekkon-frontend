import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './CollapsableBlock.css';

export default class CollapsableBlock extends Component {

    render() {
        return <div className="collapsable-block">
            <button onClick={() => this.props.onCollapseChange(!this.props.isCollapsed)}
                    className={'collapsable-block__header' + (this.props.isCollapsed ? '' : ' collapsable-block__header_active')}>
                {this.props.title}
            </button>
            <React.Fragment>
                {this.props.isCollapsed ? '' :
                    <div className="collapsable-block__content">
                        {this.props.text}
                    </div>}
            </React.Fragment>
        </div>;
    }
}

CollapsableBlock.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    onCollapseChange: PropTypes.func.isRequired
};
