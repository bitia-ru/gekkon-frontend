import React  from 'react';
import {Link} from 'react-router-dom';

const RouteCard = (props) => (
    <div style={{
        width: 300,
        height: 400,
        border: '1px solid blue',
        borderRadius: 5,
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <img src={props.route.photo === null ? '' : props.route.photo.url}
             style={{flex: 2, width: '66%', objectFit: 'contain'}}/>
        <div style={{flex: 1}}>
            <li>
                <Link to={`/routes/${props.route.id}`}>{props.route.name}</Link>
            </li>
            <p>Test Description</p>
        </div>
    </div>
);
export default RouteCard;
