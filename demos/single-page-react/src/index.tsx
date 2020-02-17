import * as React from 'react';
import { render } from 'react-dom';
import './index.scss';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <div className="Message">
                    Hello React
                </div> 
            </div>
        );
    }
}

render(<App />, document.getElementById('app'));