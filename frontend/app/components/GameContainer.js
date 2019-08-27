import { h, Component } from 'preact';
import PropTypes from 'prop-types';

// Note: If you are using p5, you can uncomment all of the p5 lines
// and things should just work =)

const { p5 } = window;

class GameContainer extends Component {
    componentWillMount() {
        //Include all scripts here
        require('script-loader!app/index.js');

    }

    componentDidMount() {
        this.p5Game = new p5(null, document.getElementById('game-container'));
    }

    componentWillUnmount() {
        this.p5Game.remove();
    }

    render() {
        return (
            <div id={'game-container'} />
        );
    }
}

export default GameContainer;
