import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

    render() {
        return (
            <div>hello</div>
        );
    }
}

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<App />, root);
