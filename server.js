let cors = require('cors');
let helmet = require('helmet');
let cookieParser = require('cookie-parser');
let parser = require('body-parser');
let morgan = require('morgan');
let express = require('express');
let app = express();
let session = require('express-session');
let path = require('path');
let fs = require('fs');
let https = require('https');
let ejs = require('ejs');
require('dotenv').config();

var privateKey = fs.readFileSync(`${process.env.HOST_LISTEN}-key.pem`, 'utf8');
var certificate = fs.readFileSync(`${process.env.HOST_LISTEN}.pem`, 'utf8');

var credentials = { key: privateKey, cert: certificate };

app.set('trust proxy', 1);
app.use(session({
    secret: 'KronosDevPro',
    name: 'SessionID',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 }
}));
app.use(morgan('combined'));
app.use(parser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'assets/public')));
app.set('views', './assets/public/view');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    if (req.headers.host === '127.0.0.1' || req.headers.host === 'localhost') res.redirect(`https://${process.env.HOST_LISTEN}/`);
    res.sendFile(__dirname + '/assets/public/index.min.html');
});

app.post('/meteo', (req, res) => {
    var Weather_req = https.get((process.env.API_OWM_LINK + req.body.API_SEARCH + process.env.API_OWM_KEY), (Weather_res) => {
        if (Weather_res.statusCode === 200) {
            Weather_res.on('data', (data) => {
                data = JSON.parse((data.toString('utf-8')))
                var Country_req = https.get(`https://restcountries.eu/rest/v2/alpha/${data.sys.country}?fields=name;flag`, (Country_res) => {
                    if (Country_res.statusCode === 200) {
                        Country_res.on('data', (dataCountry) => {
                            dataCountry = JSON.parse((dataCountry.toString('utf-8')))
                            var UV_req = https.get((process.env.API_OWM_LINKUV + `&lat=${data.coord.lat}&lon=${data.coord.lon}` + process.env.API_OWM_KEY), (UV_res) => {
                                if (UV_res.statusCode) {
                                    UV_res.on('data', (UV) => {
                                        UV = JSON.parse((UV.toString('utf-8')));
                                        app.render('meteo', { 'data': data, 'dataCountry': dataCountry, 'UV': UV }, (err, str) => {
                                            res.send({ 'type': "DataView", 'data': data, 'dataCountry': dataCountry, 'UV': UV, 'View': str });
                                        });
                                    });
                                } else {
                                    app.render('notif', { 'type': "api" }, (err, str) => {
                                        res.send({ 'type': "notif", 'View': str });
                                    });
                                };
                            });
                        });
                    } else {
                        app.render('notif', { 'type': "api" }, (err, str) => {
                            res.send({ 'type': "notif", 'View': str });
                        });
                    };
                });
            });
        } else {
            app.render('notif', { 'type': "api" }, (err, str) => {
                res.send({ 'type': "notif", 'View': str });
            });
        };
    });
});


app.post('/notif', (req, res) => {
    app.render('notif', { 'type': req.body.type }, (err, str) => {
        res.send({ 'type': "notif", 'View': str });
    });
});

app.post('/dev', (req, res) => {
    console.log(req.body, req.body.API_SEARCH);
    https.get((process.env.API_OWM_LINK + req.body.API_SEARCH + process.env.API_OWM_KEY), Weather_res => {
        Weather_res.on('data', data => {
            data = JSON.parse(data.toString('utf8'))

            console.log(data)
            res.send(data)
        });
    });
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT_LISTEN, process.env.HOST_LISTEN);
console.log(`[*] Listen on https://${process.env.HOST_LISTEN}`);