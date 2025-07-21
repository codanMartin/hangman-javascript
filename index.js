const input = require('sync-input');

const DEFAULT_MAX_HANGMAN_ATTEMPTS = 8

class HangmanRepository {
    constructor() {
        this.secretWords = new Map()
    }

    addSecretWord(word) {
        if (!this.secretWords.has(word)) {
            this.secretWords.set(word, {guessedInThisInstance: false});
        }
    }

    markWordGuessed(word, isGuessed) {
        if (this.secretWords.has(word)) {
            const worldData = this.secretWords.get(word);
            this.secretWords.set(word, {...worldData, guessedInThisInstance: isGuessed});
        }
    }

    reinitializeRepository() {
        [...this.secretWords.entries()].forEach(([word, _]) => this.markWordGuessed(word, false));
    }

    getRandomUnguessedWord() {
        if (this.secretWords.size === 0) {
            return null
        }

        const unplayedWords = [...this.secretWords.entries()].filter(([_, data]) => !data.guessedInThisInstance);

        if (unplayedWords.length === 0) {
            this.reinitializeRepository()
            return this.getRandomUnguessedWord()
        }

        const [word] = unplayedWords[Math.floor(Math.random() * unplayedWords.length)]
        return word
    }
}

class HangmanGameInstance {
    constructor(wordToGuess) {
        this.wordToGuess = wordToGuess;
        this.guessHint = ("-").repeat(wordToGuess.length)
        this.attemptsLeft = DEFAULT_MAX_HANGMAN_ATTEMPTS
        this.isInstanceFinished = false;
        this.isInstanceWon = false;
    }

    dropAttemptsLeft() {
        --this.attemptsLeft;
        if (this.attemptsLeft === 0) {
            this.isInstanceFinished = true;
        }
        if (this.wordToGuess === this.guessHint) {
            this.isInstanceWon = true;
        }
    }

    testUserGuess(userGuess) {
        let updatedHint = this.guessHint.split('');
        let guessWasCorrect = false;

        for (let i = 0; i < this.wordToGuess.length; i++) {
            if (this.wordToGuess[i] === userGuess) {
                updatedHint[i] = userGuess;
                guessWasCorrect = true;
            }
        }

        this.guessHint = updatedHint.join('');
        this.dropAttemptsLeft()
        return guessWasCorrect
    }
}

class HangmanGameController {
    constructor(ui, repository) {
        this.ui = ui;
        this.repository = repository
    }

    playRound() {
        const secretWord = this.repository.getRandomUnguessedWord()
        const game = new HangmanGameInstance(secretWord);

        this.ui.showTitle()
        this.ui.showEmptyLine()

        do {
            this.ui.showGuessHint(game.guessHint)

            const userGuess = this.ui.promptForLetter().charAt(0)
            const guessWasCorrect = game.testUserGuess(userGuess)

            if (!guessWasCorrect) {
                this.ui.showGuessFailedMessage()
            }

            this.ui.showEmptyLine()
        } while (!game.isInstanceFinished)

        this.ui.showThanksForPlaying()
    }
}

class UI {
    promptForLetter() {
        return input("Input a letter: ");
    }

    showTitle() {
        console.log("H A N G M A N");
    }

    showEmptyLine() {
        console.log("")
    }

    showGuessHint(hint) {
        console.log(hint);
    }

    showGuessFailedMessage() {
        console.log("That letter doesn't appear in the word.");
    }

    showThanksForPlaying() {
        console.log("Thanks for playing!")
    }
}

class HangmanApp {
    constructor() {
        this.ui = new UI();
        this.repository = new HangmanRepository()
        this.controller = new HangmanGameController(this.ui, this.repository);
    }

    initialize() {
        this.repository.addSecretWord("python")
        this.repository.addSecretWord("java")
        this.repository.addSecretWord("swift")
        this.repository.addSecretWord("javascript")
    }

    run() {
        this.initialize()

        this.controller.playRound();
    }
}

const app = new HangmanApp();
app.run();