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
app.use(parser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    if (req.headers.host === '127.0.0.1') res.redirect(`https://${process.env.HOST_LISTEN}/`);
    res.sendFile(__dirname + '/index.html');
});

app.post('/env', (req, res) => {
    console.log(req.body);
    if (req.body.list === 'API_OWM_*') {
        res.send({ 'API_OWM_KEY': process.env.API_OWM_KEY, 'API_OWM_LINK': process.env.API_OWM_LINK, 'API_OWM_LINKUV': process.env.API_OWM_LINKUV });
    }
});

app.get('/dev', (req, res) => {});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT_LISTEN, process.env.HOST_LISTEN);