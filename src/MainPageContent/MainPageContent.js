import React, {Component} from 'react';
import * as R             from "ramda";
import SpotCard           from "../SpotCard/SpotCard";
import './MainPageContent.css';

import {SpotsData} from "../data";

export default class MainPageHeader extends Component {
    render() {
        return <div className="main-page-content">
            <div className="main-page-content__wrapper">
                <h2 className="main-page-content__title">
                    Скалодромы
                </h2>
            </div>
            <div className="main-page-content__container">
                {R.map((spot) => <SpotCard key={spot.id} spot={spot}/>, SpotsData)}
            </div>
        </div>;
    }
}

