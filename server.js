const express = require('express');
const http = require('http');
const path = require('path');
var bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.post("/q", function (req, res) {
    let s = req.body['type'];
    let resp = {'error':"connection refused"};
    switch (s){
        case 'login':
            //check on db replace the true
            let logStatus = (true)?'pass':'none';
            resp = {
                'data':logStatus,
                'error':"none"
            }
            break;
        case 'update':
            let mail = req.body['mail'];
            //get data
            let data = {
                'squad':req.body['squad'],
                'name':req.body['name'],
                'lName':req.body['lName'],
                'birthday':req.body['birthday'],
                'anniversary':req.body['anniversary'],
                'share':req.body['share']
            }
            /* update data from db */
            resp = {
                'status':'update has finished success correctly',
                'error':"none"
            }
            break;
        case 'getAll':
            //take data from db
            let squad = "penguins",
            name = req.body['mail'],
            lName = req.body['mail'];
            resp = {
                'squad':squad,
                'name':name,
                'lName':lName,
                'birthday':new Date(),
                'anniversary':new Date(),
                'share':true,
                'error':"none"
            }
            break;
        default:
            resp = {'error':"command none found"}
            break;
    }
    res.send(resp);
    return;
  });
  
const server = http.createServer(app);
server.listen(port,() => console.log('running at port '+port));