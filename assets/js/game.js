//based on code from nat tuck's lecture code

export function valid_guess(guess) {
    let digits = [];
    let i;
    for (i = 0; i < guess.length; i++) {
        if (digits.includes(guess.substring(i,i+1))) {
            return false;
        } else {
            digits.push(guess.substring(i,i+1));
        }
    }
    return true;
}


export function zip_guesses_report(guesses, a, b) {
    let result = "";
    let i;
    for (i = 0; i < guesses.length; i++) {
        result = result.concat(guesses[i],"(",a[i],"A",b[i],"B","), ");
    }
    return result.substring(0, result.length - 2);
}
