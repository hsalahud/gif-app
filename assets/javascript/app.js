let originalTopics = ['disappear', 'kitten', 'pupper']

let topics = []

const regenButtons = () => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

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

let repetition = false
const reload = () => {

    if (selection === selectionArr[selectionArr.length - 2]) {
        repetition = true
    } else {
        repetition = false
        randNumArr = []
    }
}


loadGif(originalTopics)
let selection
let selectionArr = []
let toggle = false
let randNum
let randNumArr = []


const genNum = (arr) => {
    randNum = Math.floor(Math.random() * arr.length)
}

document.addEventListener('click', e => {
    console.log(e.target.className)
    if (e.target.className.includes('gifGetter')) {

        selection = e.target.dataset.searchterm

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
        
        

            fetch(`https://api.giphy.com/v1/gifs/search?api_key=Mbd8uKbCwH8CwgJ9jrVZQYvZXjpwnXOa&q=${selection}&limit=50&offset=0&rating=G&lang=en`)
//`https://api.giphy.com/v1/gifs/random?api_key=Mbd8uKbCwH8CwgJ9jrVZQYvZXjpwnXOa&tag=${selection}`
                .then(r => r.json())

                .then(r => {

                    //console.log(r.data.rating)
console.log(r)
console.log(r.data)
                    
                    if (randNumArr.length>=50){
                        randNumArr = []
                    }

                    for (let i = 0; i < 10; i++) {
                        

                        genNum(r.data)

                        while (randNumArr.indexOf(randNum) !== -1) {
                            genNum(r.data)
                            if (randNumArr.indexOf(randNum) === -1) {
                                
                                break
                            }
                        }
                        randNumArr.push(randNum)
                        console.log(randNumArr)
                        console.log(randNum)

                    let { url: animated } = r.data[randNum].images.fixed_height
                    let { url: still } = r.data[randNum].images.fixed_height_still
                    let {rating} = r.data[randNum]
                    console.log(typeof(rating))


                    let div = document.createElement('div')
                    div.id = `rating${randNum}`
                    div.style.display = 'inline-block'
                    document.querySelector('#gifContainer').append(div)


                    let image = document.createElement('img')
                    image.className = 'gifImg rounded img-fluid mb-2 mr-2' //mx-auto d-block
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
                })

                .catch(e => console.error(e))
       
    }
    else if (e.target.className === 'gifImg rounded img-fluid mb-2 mr-2') {
        let { animated, still } = e.target.dataset

       console.log(e.target.src)
       e.target.src.includes('_s')? toggle=false : toggle=true
       
        e.target.setAttribute('src', toggle ? still : animated)
        console.log(toggle)

    }
})

document.querySelector('#select-gif').addEventListener('click', e => {
    e.preventDefault()
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
})