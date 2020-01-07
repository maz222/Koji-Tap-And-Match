import { h, Component } from 'preact';
import PropTypes from 'prop-types';

// Note: If you are using p5, you can uncomment all of the p5 lines
// and things should just work =)

const { p5 } = window;

class GameContainer extends Component {
    componentWillMount() {
        //Include all scripts here
        require('script-loader!app/index.js');

        require('script-loader!app/components/BottomBar.js');
        require('script-loader!app/components/GameGrid.js');
        require('script-loader!app/components/Item.js');
        require('script-loader!app/components/GameButtons.js');
        require('script-loader!app/components/TopBar.js');
        require('script-loader!app/components/LevelFactory.js');
        require('script-loader!app/components/SoundController.js');
        require('script-loader!app/components/Particles.js'); 
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
