import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import Koji from '@withkoji/vcc';
import md5 from 'md5';

function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    if (delta == 0)
    h = 0;
    else if (cmax == r)
    h = ((g - b) / delta) % 6;
    else if (cmax == g)
    h = (b - r) / delta + 2;
    else
    h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
    h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return [h,s,l];
}

function formatHSL(hslArray) {
    return "hsl(" + hslArray[0] + "," + hslArray[1] + "%," + hslArray[2] + "%)"; 
}

class HoverButton extends Component {
	constructor(props) {
		super(props);
		this.state={active:false};
	}
	render() {
		let styling = this.state.active ? this.props.activeStyle : this.props.inactiveStyle;
		return(<button onClick={() => this.props.onClick()} style={styling} 
			onMouseEnter={() => this.setState({active:true})} 
			onMouseLeave={() => this.setState({active:false})}
			>{this.props.content}</button>)
	}
}

class SetScore extends Component {
    static propTypes = {
        score: PropTypes.number,
    };

    state = {
        email: '',
        name: Koji.config.submitScore.nameField.content,
        isSubmitting: false,
        submitted: false
    };

    handleClose = () => {
        window.setAppView("intro");
    }

    handleSubmit = (e) => {
        //e.preventDefault();

        if (this.state.name != "") {
            this.setState({ isSubmitting: true });

            const body = {
                name: this.state.name,
                score: this.props.score,
                privateAttributes: {
                    email: this.state.email,
                    optIn: this.state.optIn,
                },
            };
            const hash = md5(JSON.stringify(body));

            fetch(`${Koji.config.serviceMap.backend}/leaderboard/save`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': hash,
                },
                body: JSON.stringify(body),
            })
                .then((response) => response.json())
                .then((jsonResponse) => {
                    //window.setAppView("leaderboard");
                    console.log("??");
                    this.setState({submitted:true, isSubmitting:false});
                })
                .catch(err => {
                    console.log(err);
                    
                });
        }
    }

    render() {
    	const VCC = Koji.config.submitScore;
		let pageStyle = {
			display:'flex',
			justifyContent:'center',
			backgroundColor:VCC.background.mainBackground.backgroundColor,
			width:'100vw',
			height:window.innerHeight + 'px'
		};
		if(VCC.background.mainBackground.backgroundImage !== "") {
            pageStyle = {...pageStyle, backgroundImage:"url("+VCC.background.mainBackground.backgroundImage+")",backgroundPosition:"center",backgroundRepeat:"no-repeat"};
            pageStyle = {...pageStyle, backgroundSize:"cover"};
        }
		let columnWidth = Math.min(window.innerWidth, 800);
		let columnWrapperStyle = {
			display:'flex',
			flexDirection: 'column',
			alignItems:'center',
			//justifyContent:'space-around',
			backgroundColor:VCC.background.columnBackground.backgroundColor,
			width:columnWidth,
		};
        if(VCC.background.columnBackground.backgroundImage !== "") {
            columnWrapperStyle = {...columnWrapperStyle, backgroundImage:"url("+VCC.background.columnBackground.backgroundImage+")",backgroundPosition:"center",backgroundRepeat:"no-repeat"};
            columnWrapperStyle = {...columnWrapperStyle, backgroundSize:"cover"};
        }
		let bannerStyle = {
			color:VCC.title.color,
			textAlign:'center',
			fontSize:3 + "em",
			width:'calc(100% - 40px)',
			padding:'20px',
			borderRadius:'5px',
			marginTop:"20px",
		};

		let submitSheetStyle = {
			display:'flex',
			flexDirection:'column',
			justifyContent:'space-around',
			alignItems:'center',
			backgroundColor:'rgb(245,245,245)',
			borderRadius:'5px',
			width:'90%',
			padding:"40px 0 40px 0",
			marginTop:"20px"
		};

		let scoreStyle = {
			fontSize:'2em',
			marginBottom:'20px'
		};

		let nameStyle = {
			fontSize:'1em',
			borderRadius:'10px',
			textAlign:'center',
			padding:'10px',
			width:"calc(80% - 40px)",
			border:"3px solid black",
			backgroundColor:'rgba(0,0,0,0)',
			marginBottom:'20px',
			color: VCC.nameField.color
		}

		let submitStyle = {
			padding:'20px',
			fontSize:1 + 'em',
			border:"1px solid rgba(0,0,0,.25)",
			borderRadius:'10px',
			color:VCC.submitButton.color,
			backgroundColor:VCC.submitButton.backgroundColor,
			width:"calc(80% - 40px)"
		}
		let hoverColor = hexToHSL(VCC.submitButton.backgroundColor);
		hoverColor[2] = Math.max(0,hoverColor[2]-20);
		let submitHoverStyle = {...submitStyle, backgroundColor:formatHSL(hoverColor)};

		let playWidth = columnWidth * .9 *.8 - 40;
		let playAgainStyle = {
			padding:'20px',
			fontSize:1 + 'em',
			backgroundColor:VCC.playAgainButton.backgroundColor,
			color:VCC.playAgainButton.color,
			marginTop:'20px',
			border:0,
			borderRadius:'10px',
			boxShadow:'0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
			width: playWidth + 'px',
			marginBottom:'50px'
		}
		hoverColor = hexToHSL(VCC.playAgainButton.backgroundColor);
		hoverColor[2] = Math.max(0,hoverColor[2]-20);
		let playAgainHoverStyle = {...playAgainStyle, backgroundColor:formatHSL(hoverColor)};

        let submitCallback = this.state.submitted ? () => {window.setAppView("leaderboard")} : this.handleSubmit;
        let submitContent = this.state.submitted ? Koji.config.titleScreen.leaderboardButton.content : VCC.submitButton.defaultContent;
        if(!this.state.submitted && this.state.isSubmitting) {
            console.log(this.state);
            submitContent = VCC.submitButton.activeContent;
        }

		return(
			<div id="leadboard-screen" style={pageStyle}>
				<div style={columnWrapperStyle}>
					<h1 style={bannerStyle}>{VCC.title.content}</h1>
						<div id="submit-sheet" style={submitSheetStyle}>
							<h1 style={scoreStyle}>{this.props.score}</h1>
							<input type="text" style={nameStyle} value={this.state.name} onChange={(e) => this.setState({name:e.target.value})}></input>
							<HoverButton inactiveStyle={submitStyle} activeStyle={submitHoverStyle} onClick={submitCallback} content={submitContent}/>
						</div>
						<HoverButton inactiveStyle={playAgainStyle} activeStyle={playAgainHoverStyle} onClick={() => {window.setAppView("game")}} content={VCC.playAgainButton.content}/>
				</div>
			</div>
		);
    }
}

export default SetScore;
