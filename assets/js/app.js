import "phoenix_html"
import 'milligram';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {zip_guesses_report, valid_guess} from './game';
import { ch_join, ch_push, ch_reset } from './socket';

//based on code from nat tuck's lecture code
function Bulls(_) {

    const [state, setState] = useState({
				guesses: [],
				a: [],
				b: [],
				lives: 8,
				won: false,
    });

    let {guesses, a, b, lives, won} = state;
    const [textbox, setTextbox] = useState("");
    const [warning, setWarning] = useState(false);
    let guesses_reports = zip_guesses_report(guesses,a,b);


    useEffect(() => {
	ch_join(setState);
    });

    function guess() {
        let valid = textbox.length === 4;
        let i;
	//might not need loop
        for (i = 0; i < 4; i ++) {
            valid = valid && Number.isInteger(Number(textbox));
        }
        if (valid && valid_guess(textbox)) {
            //let new_guesses = calculate_unique(guesses.concat(textbox));
            //console.log("guesses: ", new_guesses);
            //setGuesses(new_guesses);
	    ch_push({guess: textbox});
	    setTextbox("");
 	    setWarning(false);
        } else {
	    setWarning(true);
	}
    }

    //ensures the length of the textbox cannot exceed 4 characters
    function updateTextbox(ev) {
        let current_val = ev.target.value;
        let new_val = current_val.substring(0,4);
        setTextbox(new_val);
    }

    //triggers an event when a key is pressed
    function keyPress(ev) {
        if (ev.key === "Enter") {
            guess();
        }
    }

    function WonGame(props) {
        let {reset} = props;
        return (
            <div>
                <div class="row">
                    <div class="column column-40">
                        <h1>You Won!</h1>
                    </div>
                    <div class="column column-40">
                        <h1>Lives Left: {lives}</h1>
                    </div>

                </div>
                <div class="row">
                    <div class="column column-50">
                        <button onClick={reset}>Reset</button>
                    </div>
                    <div class="column column-50">
                        <h1>Guesses: {guesses_reports}</h1>
                    </div>
                </div>
            </div>
            );
    }

    function GameOver(props) {
        let {reset} = props;
        return (
            <div>
            <div class="row">
                <div class="column column-30 column-offset-10">
                    <h1>Game Over!</h1>
                </div>
            </div>
            <div class="row">
                <div class="column column-30 column-offset-25">
                    <button onClick={reset}>Reset</button>
                </div>
            </div>
            </div>
        );
    }

    function reset() {
	ch_reset();
        setState(({
		guesses: [],
		a: [],
		b: [],
		lives: 8,
		won: false,
    	}));
        setTextbox("");
	setWarning(false);
    }

    let warningText = (<div></div>);
    let body = null;
    let is_warning = warning;
    if (lives > 0) {
        if (won) {
            body = <WonGame reset={reset}/>;
        } else {
	    if (is_warning) {
                warningText = (
		   <div>
		   	Guesses must contain 4 unique numbers that haven't been 
			guessed yet
		   </div>
            );
	    } else {
		warningText = (<div></div>);
	    }
	    body = (
            	<div className="App">
                    <h1>Lives: {lives}</h1>
                    <p>
                        <input type="text"
                            value={textbox}
                            onChange={updateTextbox}
                            onKeyPress={keyPress} />
                            <button onClick={guess}>Guess</button>
                    </p>
                    <p>
                        <button onClick={reset}>Reset</button>
                    </p>
                    <h1>Guesses: {guesses_reports}</h1>
               	</div>
        	);
	    
	}
    } else {
        body = <GameOver reset={reset} />;
    }
    return <div className="container">
      {warningText}
      {body}
    </div>;

}

ReactDOM.render(
  <React.StrictMode>
    <Bulls />
  </React.StrictMode>,
  document.getElementById('root')
);
