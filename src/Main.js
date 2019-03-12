import React           from 'react';
import {Switch, Route} from 'react-router-dom';
import SpotsIndex      from './Spots/SpotsIndex';
import SpotsShow       from './Spots/SpotsShow';
import CragsIndex      from './Crags/CragsIndex';

export default class Main extends React.Component {

    render() {
        return <main>
            <Switch>
                <Route exact path='/' component={SpotsIndex}/>
                <Route exact path='/crags' component={CragsIndex}/>
                <Route path='/spots/:id' component={SpotsShow}/>
            </Switch>
        </main>
    }
}

