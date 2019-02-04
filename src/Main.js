import React           from 'react';
import {Switch, Route} from 'react-router-dom';
import Routes          from './Routes/Routes';

export default class Main extends React.Component {

    render() {
        return <main>
            <Switch>
                <Route path='/routes' component={Routes}/>
            </Switch>
        </main>
    }
}

