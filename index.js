const input = require('sync-input');

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
    }

    isUserGuessCorrect(userGuess) {
        return userGuess === this.wordToGuess
    }

    getHintOnWordToGuess() {
        if (!this.wordToGuess) return ""

        const baseCharacters = this.wordToGuess.split("").splice(0, 3).join("")
        const dashes = this.wordToGuess.length - 3 > 0 ? ("-").repeat(this.wordToGuess.length - 3) : ""

        return `${baseCharacters}${dashes}`
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
        const hint = game.getHintOnWordToGuess()
        const userGuess = this.ui.promptForGuess(hint);

        if (game.isUserGuessCorrect(userGuess)) {
            this.repository.markWordGuessed(secretWord, true)
            this.ui.showGuessPassedMessage()
        } else {
            this.ui.showGuessFailedMessage()
        }
    }
}

class UI {
    showTitle() {
        console.log("H A N G M A N");
    }

    promptForGuess(word = "") {
        return input(`Guess the word ${word}: `);
    }

    showGuessPassedMessage() {
        console.log("You survived!");
    }

    showGuessFailedMessage() {
        console.log("You lost!");
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

        this.ui.showTitle();
        this.controller.playRound();
    }
}

const app = new HangmanApp();
app.run();