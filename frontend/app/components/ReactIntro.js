import { h, Component } from 'preact';
import PropTypes from 'prop-types';

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

class IntroScreen extends Component {
    render() {
        const VCC = Koji.config.titleScreen;
        let pageStyle = {
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-around",
            alignItems:"center",
            width:"100vw",
            height:window.innerHeight + "px",
            backgroundColor:VCC.background.mainBackground.backgroundColor,
        };
        if(VCC.background.mainBackground.backgroundImage !== "") {
            pageStyle = {...pageStyle, backgroundImage:"url("+VCC.background.mainBackground.backgroundImage+")",backgroundPosition:"center",backgroundRepeat:"no-repeat"};
            pageStyle = {...pageStyle, backgroundSize:"cover"};
        }
        let windWidth = Math.min(800,window.innerWidth);
        let columnStyle = {
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-around",
            alignItems:"center",
            height:"100vh",
            width:windWidth + "px",
            backgroundColor:VCC.background.columnBackground.backgroundColor
        };
        if(VCC.background.columnBackground.backgroundImage !== "") {
            columnStyle = {...columnStyle, backgroundImage:"url("+VCC.background.columnBackground.backgroundImage+")",backgroundPosition:"center",backgroundRepeat:"no-repeat"};
            columnStyle = {...columnStyle, backgroundSize:"cover"};
        }
        let buttonWidth = windWidth - windWidth * .2 * 2;
        let titleStyle = {
            color:VCC.title.color,
            fontSize:"4em",
            textAlign:'center'
        };
        let descriptionStyle = {
            color:VCC.description.color,
            fontSize:"1.5em",
            backgroundColor:"rgba(0,0,0,.25)",
            borderRadius:"5px",
            padding:"10px",
            width:buttonWidth
        };
        let playButtonStyle = {
            color:VCC.playButton.color,
            fontSize:"2em",
            backgroundColor:VCC.playButton.backgroundColor,
            borderRadius:"10px",
            padding:"20px",
            border:0,
            width:buttonWidth+"px",
            outline:"none",
            boxShadow:"0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
        };
        let playHSL = hexToHSL(VCC.playButton.backgroundColor);
        playHSL[2] = Math.max(0,playHSL[2]-20);
        let playButtonHoverStyle = {...playButtonStyle, backgroundColor:formatHSL(playHSL)};
        let playCallback = () => {window.setAppView('game');}

        let leaderboardButtonStyle = {
            color:VCC.leaderboardButton.color,
            fontSize:"2em",
            backgroundColor:VCC.leaderboardButton.backgroundColor,
            borderRadius:"10px",
            padding:"20px",
            border:0,
            width:buttonWidth+"px",
            outline:"none",
            boxShadow:"0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"

        };
        let leaderboardHSL = hexToHSL(VCC.leaderboardButton.backgroundColor);
        leaderboardHSL[2] = Math.max(0,leaderboardHSL[2]-20);
        let leaderboardButtonHoverStyle = {...leaderboardButtonStyle, backgroundColor:formatHSL(leaderboardHSL)};
        let leaderboardCallback = () => {window.setAppView('leaderboard');}

        return(
            <div id="page" style={pageStyle}>
                <div style={columnStyle}>
                    <h1 style={titleStyle}>{VCC.title.content}</h1>
                    <p style={descriptionStyle}>{VCC.description.content}</p>
                    <HoverButton activeStyle={playButtonHoverStyle} inactiveStyle={playButtonStyle} content={VCC.playButton.content} onClick={playCallback}/>
                    <HoverButton activeStyle={leaderboardButtonHoverStyle} inactiveStyle={leaderboardButtonStyle} content={VCC.leaderboardButton.content} onClick={leaderboardCallback}/>
                </div>
            </div>
        );
    }
}

export default IntroScreen;