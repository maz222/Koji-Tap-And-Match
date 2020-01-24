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
        email: "",
        name:  "",
		optIn: false,
        isSubmitting: false,
        submitted: false
    };

    handleClose = () => {
        window.setAppView("intro");
    }

    handleSubmit = (e) => {
        if(this.state.submitted) {
            return;
        }
        e.preventDefault();
        this.setState({ isSubmitting: true });
        console.log(this.state);
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
                this.setState({submitted:true, isSubmitting:false});
            })
            .catch(err => {
                this.setState({submitted:true, isSubmitting:false});
                console.log(err);
            });
    }

    render() {
    	const VCC = Koji.config.submitScore;
		let pageStyle = {
			display:'flex',
			justifyContent:'center',
			backgroundColor:VCC.background.mainBackground.backgroundColor,
			width:window.innerWidth + 'px',
			height:'100vh'
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
            height:'100%'
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
		};
		const labelStyle = {display:'block',marginBottom:'10px', fontWeight:'bold',color:'rgb(60,60,60)'};
		const inputStyle = {display:'block',width:'calc(100% - 20px)',padding:'10px',border:0,boxShadow:'0 0 0 1px rgba(0,0,0,.2)',borderRadius:'2px'};
		const submitButtonStyle = {float:'right',padding:'10px 20px 10px 20px',backgroundColor:VCC.submitButton.backgroundColor,border:0,borderRadius:'5px',
			color:'rgb(240,240,240)',fontSize:'1em', minWidth:'25%'};
		const wrapperStyle = {width:'100%', margin:'20px 0 0 0'};
        const ruleStyle = {border:'.5px solid rgba(0,0,0,.1)',margin:'20px 0 20px 0'};
        const checkboxStyle = {display:'none'};
        let formEnd = this.state.isSubmitting ? <div>{VCC.submitButton.activeContent}</div> : <button type="submit" style={submitButtonStyle}>{VCC.submitButton.defaultContent}</button>;
        formEnd = this.state.submitted ? <div style={{fontWeight:'bold'}}>{"Score submitted!"}</div> : formEnd;
		let scoreForm = (
			<form onSubmit={(e) => {this.handleSubmit(e)}} style={{marginBottom:'20px',width:'calc(80% - 60px)',padding:'30px',backgroundColor:'rgb(240,240,240)',borderRadius:'2px', boxShadow:'0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'}}>
				<h2 style={{width:'100%',textAlign:'center'}}>{this.props.score}</h2>
				<div style={wrapperStyle}>
					<label for="name" style={labelStyle}>{VCC.nameField.content}</label>
					<input type="text" id="name" style={inputStyle} required pattern=".*\S+.*" onChange={(e) => {this.setState({name:e.target.value});}} />
				</div> 
				<div style={wrapperStyle}>
					<label for="email" style={labelStyle}>{'Email (optional)'}</label>
					<input type="email" id="email" style={inputStyle} onChange={(e) => {this.setState({email:e.target.value});}}/>
				</div>
				<div style={{...wrapperStyle, display:'flex', justifyContent:'left', alignItems:'center'}}>
                    <label style={{...labelStyle, margin:0}}>
                        <input type="checkbox"  style={{margin:'0 5px 0 0'}} checked={this.state.optIn} onClick={(e) => {this.setState({optIn:!this.state.optIn})}}/>
                        {'Contact me via email'}
                    </label>
				</div>
                <hr style={ruleStyle}/>
				<div style={wrapperStyle}>
                    {formEnd}
				</div>
			</form>
		);

        const buttonStyle = {width:'80%',padding:'20px 10px 20px 10px', margin:'20px', borderRadius:'5px', border:0, boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'};
		const subBannerStyle = {width:'calc(80% - 60px', padding:'30px', textAlign:'center', color:'rgb(10,10,10)', backgroundColor:'rgba(240,240,240)', marginBottom:'20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'};
        const submittedBanner = (
            <div style={subBannerStyle}>{"Score Submitted!"}</div>
        );
        return(
			<div id="leadboard-screen" style={pageStyle}>
				<div style={columnWrapperStyle}>
					<h1 style={bannerStyle}>{VCC.title.content}</h1>
					{this.state.submitted ? submittedBanner : scoreForm}
                    <button style={{...buttonStyle, backgroundColor:VCC.playAgainButton.backgroundColor, color:VCC.playAgainButton.color}} onClick={(e) => {window.setAppView('game')}}>{VCC.playAgainButton.content}</button>
                    {this.state.submitted ? <button style={{...buttonStyle, backgroundColor:VCC.leaderboardButton.backgroundColor, color:VCC.leaderboardButton.color}} onClick={(e) => {window.setAppView('leaderboard')}}>{VCC.leaderboardButton.content}</button> : null}
				</div>
			</div>
		);
    }
}

export default SetScore;
