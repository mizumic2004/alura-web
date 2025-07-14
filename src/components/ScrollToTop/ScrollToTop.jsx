import React, { Component } from 'react';
import './ScrollToTop.css';

class ScrollToTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        const isVisible = window.scrollY > 200;
        this.setState({ isVisible });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    render() {
        return (
            <div
                id="scrollToTopButton"
                className={`fix_icon_top ${this.state.isVisible ? 'show' : ''}`}
                onClick={this.scrollToTop}
            >
                <i className="top_icon fas fa-chevron-up"></i>
            </div>
        );
    }
}

export default ScrollToTop;
