import React, {Component} from 'react';
import Content            from '../Content/Content';
import Header             from '../Header/Header';
import Footer             from '../Footer/Footer';

export default class Layout extends Component {
    render() {
        return <React.Fragment>
            <Header/>
            <Content/>
            <Footer/>
        </React.Fragment>;
    }
}
