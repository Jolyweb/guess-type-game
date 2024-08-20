import { KEYBOARD_LETTERS, WORDS } from './consts'

const gameDiv = document.getElementById('game')
const logoH1 = document.getElementById('logo')

let triesLeft
let winCount

const createPlaceHolderHTML = () => {
	const word = sessionStorage.getItem('word')

	const wordArray = Array.from(word)

	const placeHolderHTML = wordArray.reduce(
		(acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_<h1>`,
		''
	)
	return `<div id="placeholders" class="placeholder-wrapper">${placeHolderHTML}</div>`
}

const createKeyboard = () => {
	const keyboard = document.createElement('div')
	keyboard.classList.add('keyboard')
	keyboard.id = 'keyboard'

	const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
		return (
			acc +
			`<button class="button-primary keyboard-button" id='${curr}'>${curr}</button>`
		)
	}, '')

	keyboard.innerHTML = keyboardHTML
	return keyboard
}

const createGameIMG = () => {
	const image = document.createElement('img')
	image.src = 'images/hg-0.png'
	image.alt = 'game image'
	image.classList.add('game-img')
	image.id = 'game-img'

	return image
}

const checkLetter = letter => {
	const word = sessionStorage.getItem('word')
	const inputLetter = letter.toLowerCase()
	if (!word.includes(inputLetter)) {
		const triesCounter = document.getElementById('tries-left')
		triesLeft -= 1
		triesCounter.innerText = triesLeft

		const gameImg = document.getElementById('game-img')
		gameImg.src = `images/hg-${10 - triesLeft}.png`

		if (triesLeft === 0) {
			stopGame('lose')
		}
	} else {
		const wordArray = Array.from(word)
		wordArray.forEach((currentLetter, i) => {
			if (currentLetter === inputLetter) {
				winCount += 1
				if (winCount === word.length) {
					stopGame('win')
					return
				}
				document.getElementById(`letter_${i}`).innerText =
					inputLetter.toUpperCase()
			}
		})
	}
}

const stopGame = status => {
	document.getElementById('placeholders').remove()
	document.getElementById('tries').remove()
	document.getElementById('keyboard').remove()
	document.getElementById('quit').remove()

	const word = sessionStorage.getItem('word')

	if (status === 'win') {
		//win
		document.getElementById('game-img').src = 'images/hg-win.png'
		document.getElementById('game').innerHTML +=
			'<h2 class="result-header win ">You WON: </h2>'
	} else if (status === 'lose') {
		document.getElementById('game').innerHTML +=
			'<h2 class="result-header lose ">You LOST: </h2>'
	} else if (status === 'quit') {
		logoH1.classList.remove('logo-sm')
		document.getElementById('game-img').remove()
	}

	document.getElementById(
		'game'
	).innerHTML += `<p>The word was: <span class="result-word">${word.toUpperCase()}</span></p><button id="play-again" class="button-primary px-5 py-2 mt-5">Again</button>`

	document.getElementById('play-again').onclick = startGame
}

export const startGame = () => {
	triesLeft = 10
	winCount = 0

	logoH1.classList.add('logo-sm')
	const randomIndex = Math.floor(Math.random() * WORDS.length)
	const wordToGuess = WORDS[randomIndex]
	sessionStorage.setItem('word', wordToGuess)

	gameDiv.innerHTML = createPlaceHolderHTML()

	gameDiv.innerHTML +=
		'<p id="tries" class="mt-2">TRIES LEFT <span id="tries-left" class="font-medium text-red-600">10</span></p>'

	const keyboardDiv = createKeyboard()
	keyboardDiv.addEventListener('click', event => {
		// console.log(event.target.id)
		if (event.target.tagName.toLowerCase() === 'button') {
			event.target.disabled = true
			checkLetter(event.target.id)
		}
	})

	const gameImg = createGameIMG()
	gameDiv.prepend(gameImg)

	gameDiv.appendChild(keyboardDiv)

	gameDiv.insertAdjacentHTML(
		'beforeend',
		'<button id="quit" class="button-secondary px-2 py-1 mt-4">QUIT</button>'
	)
	document.getElementById('quit').onclick = () => {
		const isSure = confirm('Вы уверены?')
		if (isSure) {
			stopGame('quit')
		}
	}
}
