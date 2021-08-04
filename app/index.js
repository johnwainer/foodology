const express = require('express')
const app = express();
const fetch = require("node-fetch");
const serviceUrl = 'https://services.grability.rappi.com/api/restaurant-bus/stores/catalog/home/v2';
const restaurantBasePosition = {'lat':3.4242814233739614, 'lng':-76.54170365914733};
const usersPositions = [];

usersPositions.push( {'lat':3.4329935, 'lng':-76.5293033} );
usersPositions.push( {'lat':3.4215012, 'lng':-76.5550201} );
usersPositions.push( {'lat':3.4036164, 'lng':-76.5425194} );
usersPositions.push( {'lat':3.3858673, 'lng':-76.5194594} );

app.get('/', (req, res) => {
   
    for (let index = 0; index < usersPositions.length; index++) {
        let url = serviceUrl; // + '?lng=' + usersPositions[index].lng + '&lat=' + usersPositions[index].lat + '&view=web';
        console.log('-->', usersPositions[index])
        getFetchData(url, usersPositions[index]);
        
    }
});

app.listen(8000, () => {
  console.log('Running')
});

getFetchData = function(url, userData){
    fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer TGZjdmZHVm81UTJLTTJpM1ZmQ0hFT0puU2toYzFk'
          },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify({"lat":6.229207799999999,"lng":-75.5738344,"store_type":"restaurant","is_prime":false,"states":["opened","unavailable"]})
         
    })
    .then(res => res.json())
    .then(data => {
        const jsonData = data;
        const distancebtw = getKms(restaurantBasePosition.lat, restaurantBasePosition.lng,userData.lat, userData.lng );
        console.log('Distancia con usuario:', distancebtw)
        for(let x in jsonData){
            //console.log('--->', jsonData.stores);
            const resultStores = jsonData.stores;

            const findedResults = resultStores.find(store => store.name === 'Romero'); // Utilicé romero, al no saber el nombre del restaurante de Foodology

            console.log('Nombre restaurante: ' ,findedResults.name);
            console.log('Distancia del restautante: ', findedResults.saturation.distance);
            console.log('Está en la posición: ', findedResults.index);
        }
        return jsonData;
    })
    .catch(err => {
    return err;
    });
}

// Get distance between 2 points
getKms = function(lat1,lon1,lat2,lon2)
 {
    rad = function(x) {return x*Math.PI/180;}
    let R = 6378.137; 
    let dLat = rad( lat2 - lat1 );
    let dLong = rad( lon2 - lon1 );
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;
    return d.toFixed(3);
 }