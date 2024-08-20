import '../style/style.css'
import { startGame } from './game'
import { darkModeHandler } from './utils'

darkModeHandler()

const startGameButton = document.getElementById('start-game')
startGameButton.addEventListener('click', startGame)
