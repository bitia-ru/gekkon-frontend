import React     from 'react';
import RouteCard from './RouteCard';
import * as R    from 'ramda';

const RouteCardTable = (props) => (
    <React.Fragment>
        {R.times((n) => <ul key={n} style={{display: 'flex', justifyContent: 'center', listStyleType: 'none'}}>
                {
                    R.slice(n * props.perLine, (n + 1) * props.perLine, props.routes).map(route => (
                        <RouteCard key={route.id} route={route}></RouteCard>
                    ))
                }
            </ul>
            , Math.ceil(props.routes.length / props.perLine))}
    </React.Fragment>
);
export default RouteCardTable;
