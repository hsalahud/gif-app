
//Array of original topics that appear on the page when they load
let originalTopics = ['disappear', 'kitten', 'pupper']

//Topics that appear after the user searches them
let topics = []

//Since we find our gifs through the search API, it yields a fixed array of gifs. The variables below ensure we randomly select a gif
let randNum
let randNumArr = []

//This function creates buttons out of the gif terms
const loadGif = (topic) => {

    topic.forEach(element => {
        let parent = document.querySelector('#buttons')

        let button = document.createElement('button')
        button.textContent = element
        button.setAttribute('data-searchterm', element)
        button.setAttribute('id', element)
        button.className = 'gifGetter btn btn-warning active mb-2 mr-1'
        parent.append(button)

    });
}
//Creating buttons from searched terms. Empyt searches not allowed.
const loadSearchedGif = () => {
    if (document.querySelector('#gif-search').value.length > 0) {
        topics.push(document.querySelector('#gif-search').value)

        let parent = document.querySelector('#buttons')
        let button = document.createElement('button')
        let element = document.querySelector('#gif-search').value
        button.textContent = element
        button.setAttribute('data-searchterm', element)
        button.setAttribute('id', element)
        button.className = 'gifGetter btn btn-warning active mb-2 mr-1'
        parent.append(button)
        document.querySelector('#gif-search').value = ''
    }
}

//load default buttons
loadGif(originalTopics)

//Repetition refers to the same button that was clicked more than once consecutively
let repetition = false

//We keep track of which buttons we clicked on in these variables
let selection
let selectionArr = []

//generates a random number with which we select a key of a gif
const genNum = (arr) => {
    randNum = Math.floor(Math.random() * arr.length)
}

//reload function determines if a button was clicked consecutively or not
const reload = () => {

    if (selection === selectionArr[selectionArr.length - 2]) {
        repetition = true
    } else {
        repetition = false
        randNumArr = []
    }
}

//Toggle between pause and play
let toggle = false

//This function recognizes whether we have a two or more word phrase and replaces the space with '+'
//according to giphy search API guidelines, this improves the search feature.

const checkSpace = () => {
    if (selection.indexOf(' ') >= 0) {
        selection = selection.replace(/\s+/g, "+")
    }

    selectionArr.push(selection)
    reload()
    if (repetition === false) {
        document.querySelector('#gifContainer').innerHTML = ''
    } else {
        null
    }
}

//Generate 10 gifs randomly chosen and append them to the appropriate div
const genGifs = (response) => {
    for (let i = 0; i < 10; i++) {

        genNum(response)

        //This prevents us from selecting the same random number twice
        while (randNumArr.indexOf(randNum) !== -1) {
            genNum(response)
            if (randNumArr.indexOf(randNum) === -1) {

                break
            }
        }
        randNumArr.push(randNum)

        let { url: animated } = response[randNum].images.fixed_height
        let { url: still } = response[randNum].images.fixed_height_still
        let { rating } = response[randNum]

        let div = document.createElement('div')
        div.id = `rating${randNum}`
        div.style.display = 'inline-block'
        document.querySelector('#gifContainer').append(div)

        let image = document.createElement('img')
        image.className = 'gifImg rounded img-fluid mb-2 mr-2'
        image.setAttribute('src', still)
        image.setAttribute('alt', 'interest')
        image.setAttribute('data-still', `${still}`)
        image.setAttribute('data-animated', `${animated}`)

        let rate = document.createElement('h6')
        rate.className = 'rating text-light'
        rate.innerHTML = `
                Rating: <span class="badge badge-secondary text-uppercase">${rating}</span>
                `
        document.querySelector(`#rating${randNum}`).append(image)
        document.querySelector(`#rating${randNum}`).append(rate)
    }
}

//Pause or play gif on click
const pauseOrPlay = (gif) => {
    let { animated, still } = gif.dataset

    gif.src.includes('_s') ? toggle = false : toggle = true

    gif.setAttribute('src', toggle ? still : animated)
}

document.addEventListener('click', ({ target }) => {
    if (target.className.includes('gifGetter')) {

        selection = target.dataset.searchterm

        checkSpace()

        fetch(`https://api.giphy.com/v1/gifs/search?api_key=Mbd8uKbCwH8CwgJ9jrVZQYvZXjpwnXOa&q=${selection}&limit=50&offset=0&rating=G&lang=en`)
            .then(r => r.json())
            .then(r => {

                //The maximum number of gifs we call is 50. If we reach that number, then we start repeating gifs
                if (randNumArr.length >= 50) {
                    randNumArr = []
                }
                genGifs(r.data)

            })

            .catch(e => console.error(e))

    }
    else if (target.className === 'gifImg rounded img-fluid mb-2 mr-2') {
        pauseOrPlay(target)
    }
})

document.querySelector('#select-gif').addEventListener('click', e => {
    e.preventDefault()
    loadSearchedGif()
})