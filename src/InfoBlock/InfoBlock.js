import React, {Component} from 'react';
import Slider             from '../Slider/Slider';
import * as R             from 'ramda';
import PropTypes          from 'prop-types';
import './InfoBlock.css';

export default class InfoBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: 0
        }
    }

    onClick = () => {
        if (this.state.position < this.props.sectors.length) {
            this.props.changeSectorFilter(this.props.sectors[this.state.position].id);
            this.setState({position: this.state.position + 1});
        } else {
            this.setState({position: 0});
            this.props.changeSectorFilter(0);
        }
    };

    render() {
        let mapIndexed = R.addIndex(R.map);
        return <div className="info-block__bottom">
            <div className="info-block__info">
                <div className="info-block__info-inner">
                    {mapIndexed((el, index) => <div key={index} className="info-block__info-item">
                        <div className="info-block">
                            <div className="info-block__number">
                                {el.count}
                            </div>
                            <p className="info-block__descr">
                                {el.label}
                            </p>
                        </div>
                    </div>, this.props.infoData)}
                </div>

                <button className="info-block__info-button" onClick={this.onClick}>
					<span className="info-block__info-icon">
						<svg aria-hidden="true">
							<use xlinkHref="/public/info-block-img/arrow.svg#arrow"></use>
						</svg>
					</span>
                </button>
            </div>
            <Slider numOfPositions={this.props.sectors.length} position={this.state.position}/>
        </div>;
    }
}

InfoBlock.propTypes = {
    sectors: PropTypes.array.isRequired,
    infoData: PropTypes.array.isRequired,
    changeSectorFilter: PropTypes.func.isRequired
};
