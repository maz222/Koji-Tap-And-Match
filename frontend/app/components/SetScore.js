import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import Koji from '@withkoji/vcc';
import md5 from 'md5';

class SetScore extends Component {
    static propTypes = {
        score: PropTypes.number,
    };

    state = {
        email: '',
        name: '',
        isSubmitting: false,
        optIn: true,
    };

    componentDidMount() {
        //Activated with a delay so it doesn't lose focus immediately after click
        setTimeout(function () {
            this.nameInput.focus();
        }.bind(this), 100);

        if (this.props.score > 0) {
            const audioElem = document.getElementById('leaderboardAudio');
            if (audioElem) {
                audioElem.play();
            }
        }
    }

    handleClose = () => {
        window.setAppView("game");
    }

    handleSubmit = (e) => {
        console.log("???");
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
                    window.setAppView("leaderboard");
                })
                .catch(err => {
                    console.log(err);
                    
                });
        }
    }

    render() {
        return (
            <div style={{ position: "absolute", backgroundColor:'green', width: "100vw", height: "100vh" }}>
                <div className="title"
                    style={{ color: Koji.config.colors.titleColor }}>
                    {"Submit To Leaderboard"}
                </div>

                <div id={'leaderboard-set-score'} style={{ backgroundColor: 'red', borderColor: 'black' }}>
                    <form
                        id={'score-form'}
                        onSubmit={this.handleSubmit}
                    >
                        <div className={'input-wrapper'}>
                            <label className={'label'} style={{ color: Koji.config.colors.titleColor }}>
                                {"Score"}
                            </label>
                            <input
                                disabled
                                value={this.props.score}
                                style={{ color: Koji.config.colors.titleColor, borderColor: Koji.config.colors.titleColor }}
                            />
                        </div>

                        <div className={'input-wrapper'}>
                            <label className={'label'} style={{ color: Koji.config.colors.titleColor }}>
                                {"Name"}
                            </label>
                            <input
                                onChange={(event) => {
                                    this.setState({ name: event.target.value });
                                }}
                                type={'text'}
                                value={this.state.name}
                                required
                                style={{ color: Koji.config.colors.titleColor, borderColor: Koji.config.colors.titleColor }}
                                ref={(input) => { this.nameInput = input; }}
                            />
                        </div>

                        {
                            Koji.config.strings.emailInputEnabled &&
                            <div>
                                <div className={'input-wrapper'}>
                                    <label style={{ color: Koji.config.colors.titleColor }}>{'Your Email Address (Private)'}</label>
                                    <input
                                        onChange={(event) => {
                                            this.setState({ email: event.target.value });
                                        }}
                                        type={'email'}
                                        value={this.state.email}
                                        style={{ color: Koji.config.colors.titleColor, borderColor: Koji.config.colors.titleColor }}
                                    />
                                </div>
                                <div className={'checkbox-wrapper'}>
                                    <label for={'checkbox'} style={{ color: Koji.config.colors.titleColor }}>{Koji.config.strings.optInText}</label>
                                    <input
                                        id={'checkbox'}
                                        onChange={(event) => {
                                            this.setState({ optIn: event.target.checked });
                                        }}
                                        type={'checkbox'}
                                        checked={this.state.optIn}
                                        style={{ color: Koji.config.colors.titleColor, borderColor: Koji.config.colors.titleColor }}
                                    />
                                </div>
                            </div>
                        }

                        <button
                            disabled={this.state.isSubmitting}
                            htmlType={'submit'}
                            type={'submit'}
                            style={{ backgroundColor: Koji.config.colors.buttonColor, color: Koji.config.colors.buttonTextColor }}
                        >
                            {this.state.isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>

                    <button className="dismiss-button"
                        onClick={this.handleClose}
                        style={{ backgroundColor: Koji.config.colors.buttonColor, color: Koji.config.colors.buttonTextColor }}>
                        {"Cancel"}

                    </button>


                </div>
            </div>
        )
    }
}

export default SetScore;
