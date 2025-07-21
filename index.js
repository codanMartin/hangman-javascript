const input = require('sync-input');

class HangmanGameInstance {
    constructor(wordToGuess) {
        this.wordToGuess = wordToGuess;
        this.guessed = false;
    }

    guess(word) {
        this.guessed = word === this.wordToGuess;
        return this.guessed;
    }

    getResultMessage() {
        return this.guessed ? "You survived!" : "You lost!";
    }
}

class HangmanGameController {
    constructor(ui) {
        this.ui = ui;
        this.secretWord = "python";
    }

    playRound() {
        const game = new HangmanGameInstance(this.secretWord);
        const guess = this.ui.promptForGuess();
        game.guess(guess);
        this.ui.showResult(game.getResultMessage());
    }
}

class UI {
    showTitle() {
        console.log("H A N G M A N");
    }

    showWelcomeMessage() {
        console.log("The game will be available soon.");
    }

    promptForGuess() {
        return input("Guess the word: ");
    }

    showResult(message) {
        console.log(message);
    }
}

class HangmanApp {
    constructor() {
        this.ui = new UI();
        this.controller = new HangmanGameController(this.ui);
    }

    run() {
        this.ui.showTitle();
        this.ui.showWelcomeMessage();
        this.controller.playRound();
    }
}

const app = new HangmanApp();
app.run();
