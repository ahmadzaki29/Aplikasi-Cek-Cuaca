const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

// Konfigurasikan paket dotenv
require('dotenv').config();

// Siapkan KUNCI API openweathermap 
const apiKey = `21341fb6ceeee375d5998d5ebc27a74c`;

// Siapkan konfigurasi aplikasi ekspres dan body-parser
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Atur tampilan default saat peluncuran
app.get('/', function(req, res) {

    // Ini tidak boleh mengambil dan menampilkan data apa pun di halaman indeks
    res.render('index', { weather: null, error: null });
});

// Pada permintaan posting, aplikasi akan mengambil data dari OpenWeatherMap menggunakan argumen yang diberikan
app.post('/', function(req, res) {

    // Dapatkan nama kota yang dikirimkan dalam formulir
    let city = req.body.city;

   // Gunakan nama kota itu untuk mengambil data
   // Gunakan API KEY di file '.env'e
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=21341fb6ceeee375d5998d5ebc27a74c`;

   // Permintaan data menggunakan URL
    request(url, function(err, response, body) {

        // Saat kembali, periksa data json yang diambil
        if (err) {
            res.render('index', { weather: null, error: 'Error, silahkan coba lagi' });
        } else {
            let weather = JSON.parse(body);

            // Kita akan menampilkannya di konsol hanya untuk memastikan bahwa data yang ditampilkan sesuai dengan yang kita inginkan
            console.log(weather);

            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, silahkan coba lagi' });
            } else {
                // kita akan menggunakan data yang didapat untuk menyiapkan keluaran 
                let place = `${weather.name}, ${weather.sys.country}`,
                    /* Kita akan menghitung zona waktu saat ini menggunakan data yang diambil*/
                    weatherTimezone = `${new Date(weather.dt * 1000 - (weather.timezone * 1000))}`;
                let weatherTemp = `${weather.main.temp}`,
                    weatherPressure = `${weather.main.pressure}`,
                    /* Kita akan mengambil ikon cuaca dan ukurannya menggunakan data ikon*/
                    weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    weatherDescription = `${weather.weather[0].description}`,
                    humidity = `${weather.main.humidity}`,
                    clouds = `${weather.clouds.all}`,
                    visibility = `${weather.visibility}`,
                    main = `${weather.weather[0].main}`,
                    weatherFahrenheit;
                weatherFahrenheit = ((weatherTemp * 9 / 5) + 32);

                // Kita juga akan membulatkan nilai derajat fahrenheit yang dihitung menjadi dua desimal
                function roundToTwo(num) {
                    return +(Math.round(num + "e+2") + "e-2");
                }
                weatherFahrenheit = roundToTwo(weatherFahrenheit);

                // Sekarang kita akan merender data ke halaman kita (index.ejs) sebelum menampilkannya
                res.render('index', { weather: weather, place: place, temp: weatherTemp, pressure: weatherPressure, icon: weatherIcon, description: weatherDescription, timezone: weatherTimezone, humidity: humidity, fahrenheit: weatherFahrenheit, clouds: clouds, visibility: visibility, main: main, error: null });
            }
        }
    });
});

// Kita akan mengatur konfigurasi port kita
app.listen(5000, function() {
    console.log('Weather app listening on port 5000!');
});