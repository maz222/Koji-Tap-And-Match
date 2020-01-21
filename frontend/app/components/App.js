import { h, Component } from 'preact';
import GameContainer from './GameContainer';
import Leaderboard from './Leaderboard';
import SetScore from './SetScoreReact.js';
import IntroScene from './ReactIntro.js';

//import SetScore from './SetScore.js';

export default class App extends Component {
	state = {
		score: 0,
		view: 'intro',
	};

	componentDidMount() {
		window.setAppView = view => { this.setState({ view }); }
		window.setScore = score => { this.setState({ score }); }
        //sessionStorage.setItem('isMuted',false);
        //sessionStorage.setItem('userName','');
	}

	render() {
		if (this.state.view === 'intro') {
			return (
				<div>
					<IntroScene />
				</div>
			)
		}        
		if (this.state.view === 'game') {
			return (
				<div>
					<GameContainer />
				</div>
			)
		}
		if (this.state.view === 'setScore') {
			return (
				<div>
					<SetScore score={this.state.score} />
				</div>
			)
		}
		if (this.state.view === 'leaderboard') {
			return (
				<div>
					<Leaderboard />
				</div>
			)
		}
		return null;
	}
}
