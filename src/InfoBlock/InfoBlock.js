import React, {Component} from 'react';
import Slider             from '../Slider/Slider';
import * as R             from 'ramda';
import PropTypes          from 'prop-types';
import './InfoBlock.css';

export default class InfoBlock extends Component {

    onClick = () => {
        let sectorNum = R.findIndex((s) => s.id === this.props.sectorId, this.props.sectors) + 1;
        if (sectorNum < this.props.sectors.length) {
            this.props.changeSectorFilter(this.props.sectors[sectorNum].id);
        } else {
            this.props.changeSectorFilter(0);
        }
    };

    render() {
        let mapIndexed = R.addIndex(R.map);
        let sectorNum = R.findIndex((s) => s.id === this.props.sectorId, this.props.sectors) + 1;
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
							<use xlinkHref="/public/img/info-block-img/arrow.svg#arrow"></use>
						</svg>
					</span>
                </button>
            </div>
            <Slider numOfPositions={this.props.sectors.length} position={this.props.sectorId === 0 ? 0 : sectorNum}/>
        </div>;
    }
}

InfoBlock.propTypes = {
    sectors: PropTypes.array.isRequired,
    infoData: PropTypes.array.isRequired,
    changeSectorFilter: PropTypes.func.isRequired,
    sectorId: PropTypes.number.isRequired
};
