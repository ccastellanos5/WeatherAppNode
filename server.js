const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const PORT = 4000;

const apiKey = '1c7f94652dea00993dbaca26ec59b898';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/',(req, res)=>{
  res.render('index', {w: {}, city: null, empty: true, error: null});
});

app.post('/',(req, res)=>{
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

  request(url, (err, response, body)=>{
    if(err){
      res.render('index', { w: {}, city: null, empty: true, error:'Error, please try again' });
      
    }
    else{
      let weather = JSON.parse(body);
      if(weather.main === undefined){
        res.render('index', { w: {}, city: null, empty: true, error:'Error, please try again' });
      }
      else{
        let temp = weather.main.temp - 273.15;
        let tempMin = weather.main.temp_min -273.15;
        let tempMax = weather.main.temp_max-273.15;
        let weatherHtml;

        weatherHtml = {
          weather: temp.toFixed(1),
          humidity: weather.main.humidity,
          temp_min: tempMin.toFixed(1),
          temp_max: tempMax.toFixed(1),
          country: weather.sys.country
        }

        res.render('index',{ w: weatherHtml, city: weather.name, empty: false, error:null });
      }
    }
  });

});

app.listen(PORT,()=>{
  console.log(`Server listenign on port ${PORT}`);
});

