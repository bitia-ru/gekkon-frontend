import { Component } from 'react';

export default class ScrollToTopOnMount extends Component {
  componentDidMount() {
    document.getElementById('app').firstChild.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}
