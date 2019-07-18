import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';

// Import all components
import Navbar from './components/Navbar';
import Home from './components/Home';
import News from './components/News';



class App extends Component {
    
    componentDidMount() {
        console.log('App mounted');
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <Navbar />
                    <Route exact path = '/' component = { Home } />
                    <Route exact path = '/news' component = { News } />
                </div>
            </BrowserRouter>
        )
    }
}

export default App;