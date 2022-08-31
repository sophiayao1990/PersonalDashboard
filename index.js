// todo: https://jsonplaceholder.typicode.com/
// bored: http://www.boredapi.com/
// weather: https://openweathermap.org/current#geo
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API#getting_the_current_position
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
// crypto: https://www.coingecko.com/api/documentations/v3#/


// Stock percentage change calculation????
// todo fetch real data, delete?


const weather = document.getElementById('weather');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const todoForm = document.getElementById('todo-form');
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
function getCurrentCrypto(coinName, coinElementId) {
    fetch(`https://api.coingecko.com/api/v3/coins/${coinName}`)
    .then (res => {
        if (!res.ok) {
            throw Error(`Cannot get the ${coinName} data`);
        }
        return res.json();
    })
    .then(data => {
        let change24h = data.market_data.price_change_percentage_24h;
        document.getElementById(coinElementId).innerHTML=`
            <h4 class="col"><a href=${data.links.homepage[0]} target="_blank">${data.name}</a></h4>
            <p class="col">$${data.market_data.current_price.usd.toFixed(2)}</p>
            <span id='${coinName}-change24h' class="col">${change24h.toFixed(2)}%</span>        
        `
        const change = document.getElementById(`${coinName}-change24h`);

        if(change24h > 0 ) {
            change.style.color = "green";
        } else if(change24h < 0){
            change.style.color = "red";
        } else {
            change.style.color = "black";
        }
    })
    .catch(err => console.error(err));    
}
getCurrentCrypto("bitcoin","btc");
getCurrentCrypto("ethereum","eth");
setInterval(getCurrentCrypto("bitcoin","btc"), 50000)
setInterval(getCurrentCrypto("ethereum","eth"), 50000)

function getCurrentStock(stockName, stockElementId) {
    fetch(`http://api.marketstack.com/v1/intraday?access_key=803f599c990fd6a341af3c4c79f174b8&symbols=${stockName}`)
    .then (res => {
        if (!res.ok) {
            throw Error(`Cannot get the ${stockName} data`);
        }
        return res.json();
    })
    .then(data => {
        // console.log(data)
        const change24h = (data.data[0].close - data.data[0].open)/data.data[0].open
        document.getElementById(stockElementId).innerHTML=`
            <h4 class="col">${data.data[0].symbol}</h4>
            <p class="col">$${data.data[0].open.toFixed(2)}</p>
            <span id="${stockName}-change24h" class="col">${change24h.toFixed(2)}%</span>        
        `
        const change = document.getElementById(`${stockName}-change24h`);

        if(change24h > 0 ) {
            change.style.color = "green";
        } else if(change24h < 0){
            change.style.color = "red";
        } else {
            change.style.color = "black";
        }
    })
}
getCurrentStock("AAPL","aapl");
getCurrentStock("TSLA","tsla");
setInterval(getCurrentStock("AAPL","aapl"), 50000)
setInterval(getCurrentStock("TSLA","tsla"), 50000)



//Weather
navigator.geolocation.getCurrentPosition(position => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=957f77f95dfed1a4157a09f091cd5673&units=metric`)
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
            <p class="temp">${Math.round(data.main.temp)}ºC</p>
            <p><i class='fas fa-map-marker-alt'></i> ${data.name}</p>
            `
        })
        .catch(err => console.log(err))
})

//time
function getCurrentTime() {
    let d = new Date();
    let currentTime = d.toLocaleTimeString('en-us', {timeStyle: 'medium'});
    let [time, amOrPm] = currentTime.split(' ')
    document.getElementById("time").textContent = time;
    document.getElementById("ampm").textContent = amOrPm;    
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



