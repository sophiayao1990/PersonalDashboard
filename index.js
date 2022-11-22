const weather = document.getElementById("weather");
const todoList = document.getElementById("todo-list");
const todoInput = document.getElementById("todo-input");
const todoForm = document.getElementById("todo-form");
const main = document.getElementById("main");

/** background section
 * This is the code section for background
 */

// backaground image list
const backgroundImageList = ["olivia1", "olivia2", "olivia3"];
let backgroundImageListIndex = 0;
//default background image
main.style.backgroundImage = `url(images/${backgroundImageList[backgroundImageListIndex]}.jpg)`;
setInterval(function () {
  backgroundImageListIndex =
    (backgroundImageListIndex + 1) % backgroundImageList.length;
  main.style.backgroundImage = `url(images/${backgroundImageList[backgroundImageListIndex]}.jpg)`;
}, 5000);

/**crypto & stock section
 * This is the code for both the crypto and stock section
 */
//Crypto

//font color change based on the price change
function fontColorChange(change, elementId) {
  if (change > 0) {
    document.getElementById(elementId).style.color = "green";
  } else if (change < 0) {
    document.getElementById(elementId).style.color = "red";
  } else {
    document.getElementById(elementId).style.color = "black";
  }
}
function getCurrentCrypto(coinName, coinElementId) {
  fetch(`https://api.coingecko.com/api/v3/coins/${coinName}`)
    .then((res) => {
      if (!res.ok) {
        throw Error(`Cannot get the ${coinName} data`);
      }
      return res.json();
    })
    .then((data) => {
      let coinChange24h = data.market_data.price_change_percentage_24h;
      document.getElementById(coinElementId).innerHTML = `
            <h4 class="col">${data.name}</h4>
            <p class="col">$${data.market_data.current_price.usd.toFixed(2)}</p>
            <span id='coinChange24h-${coinName}' class="col">${coinChange24h.toFixed(
        2
      )}%</span>        
        `;
      fontColorChange(coinChange24h, `coinChange24h-${coinName}`);
    })
    .catch((err) => console.error(err));
}
getCurrentCrypto("bitcoin", "btc");
getCurrentCrypto("ethereum", "eth");
setInterval(() => getCurrentCrypto("bitcoin", "btc"), 50000);
setInterval(() => getCurrentCrypto("ethereum", "eth"), 50000);

function getCurrentStock(stockName, stockElementId) {
  fetch(
    `https://api.marketstack.com/v1/intraday?access_key=803f599c990fd6a341af3c4c79f174b8&symbols=${stockName}`
  )
    .then((res) => {
      if (!res.ok) {
        throw Error(`Cannot get the ${stockName} data`);
      }
      return res.json();
    })
    .then((data) => {
      // console.log(data)
      const stockChange24h =
        (data.data[0].close - data.data[0].open) / data.data[0].open;
      document.getElementById(stockElementId).innerHTML = `
            <h4 class="col">${data.data[0].symbol}</h4>
            <p class="col">$${data.data[0].open.toFixed(2)}</p>
            <span id="stockChange24h-${stockName}" class="col">${stockChange24h.toFixed(
        2
      )}%</span>        
        `;
      fontColorChange(stockChange24h, `stockChange24h-${stockName}`);
    });
}
getCurrentStock("AAPL", "aapl");
getCurrentStock("TSLA", "tsla");
setInterval(() => getCurrentStock("AAPL", "aapl"), 50000);
setInterval(() => getCurrentStock("TSLA", "tsla"), 50000);

//Weather
navigator.geolocation.getCurrentPosition((position) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=957f77f95dfed1a4157a09f091cd5673&units=metric`
  )
    .then((res) => {
      if (!res.ok) {
        throw Error("Cannot get the weather data");
      }
      return res.json();
    })
    .then((data) => {
      const weatherIconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weather.innerHTML = `
            <img src=${weatherIconUrl} />
            <p>${data.weather[0].main}</p>
            <p class="temp">${Math.round(data.main.temp)}ºC</p>
            <p><i class='fas fa-map-marker-alt'></i> ${data.name}</p>
            `;
    })
    .catch((err) => console.log(err));
});

//time
function getCurrentTime() {
  let d = new Date();
  let currentTime = d.toLocaleTimeString("en-us", { timeStyle: "medium" });
  let [time, amOrPm] = currentTime.split(" ");
  document.getElementById("time").textContent = time;
  document.getElementById("ampm").textContent = amOrPm;
}
getCurrentTime();
setInterval(getCurrentTime, 1000);

//Todo
let todoArr = [];
function renderTodo() {
  todoList.innerHTML = "";
  for (let todo of todoArr) {
    todoList.innerHTML += `<li>
                                <input type="checkbox" id="${todo._id}" ${
      todo.completed ? "checked" : ""
    } onchange="handleChange('${todo._id}')" >  
                                ${todo.description} 
                                <button onclick="deleteTodo('${
                                  todo._id
                                }')"><i class="fa-solid fa-trash-can"></i></button>
                               </li>`;
  }
}

function handleChange(id) {
  var raw = JSON.stringify({
    completed: document.getElementById(id).checked,
  });

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`https://api-nodejs-todolist.herokuapp.com/task/${id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

//GET all todos
var myHeaders = new Headers();
myHeaders.append(
  "Authorization",
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzEwYmRiODYxMzFkZTAwMTc0NzdmZmEiLCJpYXQiOjE2NjIwNDIzMTF9.lJU9dhFVxEnbdkoYGOvFAx8lWQcjgUr1kJz7-toHUeo"
);
myHeaders.append("Content-Type", "application/json");

function getAllTodos() {
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("https://api-nodejs-todolist.herokuapp.com/task", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      todoArr = result.data;
      console.log(result.data);
      renderTodo();
    })
    .catch((error) => console.log("error", error));
}
getAllTodos();

//Add new todo
todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var raw = JSON.stringify({
    description: `${todoInput.value}`,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://api-nodejs-todolist.herokuapp.com/task", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      getAllTodos();
      todoForm.reset();
    })
    .catch((error) => console.log("error", error));
});

// DEL todo by ID
function deleteTodo(id) {
  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };
  fetch(`https://api-nodejs-todolist.herokuapp.com/task/${id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => getAllTodos())
    .catch((error) => console.log("error", error));
}
