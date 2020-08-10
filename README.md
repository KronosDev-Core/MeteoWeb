# MeteoWeb
need mkcert

Install module :
```
npm install && mkcert hostname && npm test
```

conf .env file :
```env
PORT_LISTEN=443
HOST_LISTEN=hostname
API_OWM_KEY="&appid=API_KEY&units=metric&lang=en"
API_OWM_LINK="https://api.openweathermap.org/data/2.5/weather?"
API_OWM_LINKUV="https://api.openweathermap.org/data/2.5/uvi?"
```