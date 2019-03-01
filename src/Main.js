import React           from 'react';
import {Switch, Route} from 'react-router-dom';
import Routes          from './Routes/Routes';
import Root            from './Root';

export default class Main extends React.Component {

    render() {
        return <main>
            <Switch>
                <Route exact path='/' component={Root}/>
                <Route path='/routes' component={Routes}/>
            </Switch>
        </main>
    }
}

