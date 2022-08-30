// todo: https://jsonplaceholder.typicode.com/
// bored: http://www.boredapi.com/
// weather: https://openweathermap.org/current#geo
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API#getting_the_current_position
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
// crypto: https://www.coingecko.com/api/documentations/v3#/
const eth = document.getElementById('eth');
const btc = document.getElementById('btc');
const aapl = document.getElementById('aapl');
const tsla = document.getElementById('tsla');



const weather = document.getElementById('weather');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const todoForm = document.getElementById('todo-form');
const time = document.getElementById('time');
const main = document.getElementById('main')

//background
const images = ['olivia1', 'olivia2','olivia3'];
main.style.backgroundImage = `url(images/olivia3.jpg)`;
let i = 0;
setInterval(function() {
    main.style.backgroundImage = `url(images/${images[i]}.jpg)`;
    i = i + 1;
    if (i == images.length) {
      i =  0;
    }
}, 5000);




//Crypto
function getCurrentCrypto() {
    fetch('https://api.coingecko.com/api/v3/coins/bitcoin')
    .then (res => {
        if (!res.ok) {
            throw Error("Cannot get the bitcoin data");
        }
        return res.json();
    })
    .then(data => {
        let btcChange24h = data.market_data.price_change_percentage_24h;

        btc.innerHTML=`
            <h4 id="btc-name" class="col"><a href=${data.links.homepage[0]} target="_blank">${data.name}</a></h4>
            <p id="btc-price" class="col">$${data.market_data.current_price.usd.toFixed(2)}</p>
            <span id="btc-change24h" class="col">${btcChange24h.toFixed(2)}%</span>        
        `
        const btcChange = document.getElementById('btc-change24h');

        if(btcChange24h > 0 ) {
            btcChange.style.color = "green";
        } else if(btcChange24h < 0){
            btcChange.style.color = "red";
        } else {
            btcChange.style.color = "black";
        }
    })
    .catch(err => console.error(err));


    fetch('https://api.coingecko.com/api/v3/coins/ethereum')
    .then (res => {
        if (!res.ok) {
            throw Error("Cannot get the ethereum data");
        }
        return res.json();
    })
    .then(data => {
        let ethChange24h = data.market_data.price_change_percentage_24h;

        eth.innerHTML=`
            <h4 id="eth-name" class="col"><a href=${data.links.homepage[0]} target="_blank">${data.name}</a></h4>
            <p id="eth-price" class="col">$${data.market_data.current_price.usd.toFixed(2)}</p>
            <span id="eth-change24h" class="col">${ethChange24h.toFixed(2)}%</span>        
        `
        const ethChange = document.getElementById('eth-change24h');

        if(ethChange24h > 0 ) {
            ethChange.style.color = "green";
        } else if(ethChange24h < 0){
            ethChange.style.color = "red";
        } else {
            ethChange.style.color = "black";
        }
 
        })
    .catch(err => console.error(err));
    
}

getCurrentCrypto();
setInterval(getCurrentCrypto, 50000)

fetch(`http://api.marketstack.com/v1/intraday?access_key=803f599c990fd6a341af3c4c79f174b8&symbols=AAPL`)
    .then (res => {
        if (!res.ok) {
            throw Error("Cannot get the stock data");
        }
        return res.json();
    })
    .then(data => {
        console.log(data)

        const aaplChange24h = (data.data[0].close - data.data[0].open)/data.data[0].open
        aapl.innerHTML=`
            <h4 id="aapl-name" class="col">${data.data[0].symbol}</h4>
            <p id="aapl-price" class="col">$${data.data[0].open.toFixed(2)}</p>
            <span id="aapl-change24h" class="col">${aaplChange24h.toFixed(2)}%</span>        
        `
        const aaplChange = document.getElementById('aapl-change24h');

        if(aaplChange24h > 0 ) {
            aaplChange.style.color = "green";
        } else if(aaplChange24h < 0){
            aaplChange.style.color = "red";
        } else {
            aaplChange.style.color = "black";
        }
    })

    fetch(`http://api.marketstack.com/v1/intraday?access_key=803f599c990fd6a341af3c4c79f174b8&symbols=TSLA`)
    .then (res => {
        if (!res.ok) {
            throw Error("Cannot get the stock data");
        }
        return res.json();
    })
    .then(data => {
        const tslaChange24h = (data.data[0].close - data.data[0].open)/data.data[0].open
        tsla.innerHTML=`
            <h4 id="tsla-name" class="col">${data.data[0].symbol}</h4>
            <p id="tsla-price" class="col">$${data.data[0].open.toFixed(2)}</p>
            <span id="tsla-change24h" class="col">${tslaChange24h.toFixed(2)}%</span>        
        `
        const tslaChange = document.getElementById('tsla-change24h');

        if(tslaChange24h > 0 ) {
            tslaChange.style.color = "green";
        } else if(tslaChange24h < 0){
            tslaChange.style.color = "red";
        } else {
            tslaChange.style.color = "black";
        }
    })


    



//Weather
navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error('Cannot get the weather data')
            }
            return res.json();
        })
        .then(data => {
            const weatherIconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            weather.innerHTML=`
            <img src=${weatherIconUrl} />
            <p>${data.weather[0].main}</p>
            <p>${Math.round(data.main.temp)} ºC</p>
            <p>${data.name}</p>
            `
        })
        .catch(err => console.log(err))
})
// fetch(`http://api.openweathermap.org/data/2.5/weather?q=https://api.openweathermap.org/data/2.5/weather?lat={37}&lon={-122}&appid={957f77f95dfed1a4157a09f091cd5673}`)
//     .then(res => res.json())
//     .then(data => console.log(data))

//time
function getCurrentTime() {
    let d = new Date();
    let currentTime = d.toLocaleTimeString('en-us', {timeStyle: 'medium'});
    time.textContent = currentTime;
}
getCurrentTime()
setInterval(getCurrentTime, 1000)


//Todo
let todoArr = [];
function renderTodo() {
    todoList.innerHTML = '';
    for (let todo of todoArr) {
        todoList.innerHTML += `
        <li><input type="checkbox">   ${todo.title}</li>
        `
    } 
}

fetch('https://jsonplaceholder.typicode.com/todos')
    .then(res => res.json())
    .then(data => {
      todoArr = data.slice(0, 4);
      renderTodo();
  })

todoForm.addEventListener('submit', function(e){
    e.preventDefault()
    const todoInputValue = todoInput.value;
    const data = {
        title: todoInputValue
    }
    console.log(data)

    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }

    fetch('https://jsonplaceholder.typicode.com/todos', options)
        .then(res => res.json())
        .then(todo => {
            todoArr.push(todo)
            renderTodo()
            todoForm.reset()
        })
})



