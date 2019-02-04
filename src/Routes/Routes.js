import React           from 'react';
import {Switch, Route} from 'react-router-dom';
import RoutesIndex     from './RoutesIndex';
import RoutesShow      from './RoutesShow';

export default class Routes extends React.Component {

    render() {
        return <Switch>
            <Route exact path='/routes' component={RoutesIndex}/>
            <Route path='/routes/:id' component={RoutesShow}/>
        </Switch>
    }
}
