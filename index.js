class UI {
    printGameTitle() {
        console.log("H A N G M A N")
    }

    printGreetingMessage() {
        console.log("The game will be available soon.")
    }

    run() {
        this.printGameTitle()
        this.printGreetingMessage()
    }
}

const ui = new UI()

ui.run()