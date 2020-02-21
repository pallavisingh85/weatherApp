/* Global Variables */
const apiKey = '&appid=c63f219b4f9c1c0b07f182ea03df4789';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e){
    console.log("performAction");
    const feel = document.getElementById('feelings').value;
    const zipcode =  document.getElementById('zip').value;
    retrieveData(baseURL, zipcode, apiKey)
    .then(function(data){
        data["userResponse"] = feel;
        data["date"] = newDate;
        postToServer('http://localhost:8000/setWeather', data)
        .then(function(data){
            retrieveFromServer('http://localhost:8000/all')
        })
    })
}

//ASYNC GET
const retrieveData = async (baseURL, zipcode, apiKey) => {
    const request = await fetch(baseURL+zipcode+apiKey);
    try{
        const allData = await request.json();
        return allData;
    }catch(error){
        console.log("error", error);
    }
}

//ASYNC POST
const postToServer = async(url , data) => {
    const request = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    try{
        const postResponse = await request.json();
        return postResponse;
    }catch(error){
       console.log("error", error);
    }
}

//ASYNC GET
const retrieveFromServer = async (url) => {
    const request = await fetch(url);
    try{
        const serverData = await request.json();
        console.log(serverData);
        updateUI(serverData);
        return serverData;
    }catch(error){
        console.log("error", error);
    }
}

function updateUI(serverData){
    document.getElementById('temp').innerHTML = serverData.temperature;
    document.getElementById('date').innerHTML = serverData.date;
    document.getElementById('content').innerHTML = serverData.userResponse;
}
