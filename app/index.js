const express = require('express')
const app = express();
const fetch = require("node-fetch");
const serviceUrl = 'https://services.grability.rappi.com/api/restaurant-bus/stores/catalog/home/v2';
const restaurantBasePosition = {'lat':3.4242814233739614, 'lng':-76.54170365914733};
const usersPositions = [];
let totalIndex = 0;
let totalIndexItems = 0;

usersPositions.push( {'lat':3.4329935, 'lng':-76.5293033} );
usersPositions.push( {'lat':3.4215012, 'lng':-76.5550201} );
usersPositions.push( {'lat':3.4036164, 'lng':-76.5425194} );
usersPositions.push( {'lat':3.3858673, 'lng':-76.5194594} );

app.get('/', (req, res) => {
   
    for (let index = 0; index < usersPositions.length; index++) {
        let url = serviceUrl;
        getFetchData(url, usersPositions[index]);   
    }
    setTimeout(() => {
        console.log('Posición promedio: ', (totalIndex/totalIndexItems).toFixed(0));
     }, 2000);
});

app.listen(8000, () => {
  console.log('Running')
});

getFetchData = async function(url, userData){
    fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer UHhuaTBLV2F6THp0b2E4dU9OWXlPYTdNN3FPN2ow'
          },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify({"lat":userData.lat,"lng":userData.lng,"store_type":"restaurant","is_prime":false,"states":["opened","unavailable"]})
         
    })
    .then(res => res.json())
    .then(data => {
        //console.log(data)
        const jsonData = data;
        const distancebtw = getKms(restaurantBasePosition.lat, restaurantBasePosition.lng,userData.lat, userData.lng );
        console.log('Distancia con usuario:', distancebtw)
        
            const resultStores = jsonData.stores;

            resultStores.forEach(function(store){
                
                if(store.name.toLowerCase().includes('salchiborondo')){ // Asumo el nombre del restaurante
                    console.log('Nombre restaurante: ' ,store.name);
                    console.log('Está en la posición: ', store.index);
                    totalIndex = totalIndex + store.index;
                    totalIndexItems++;
                }                    
            });        
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