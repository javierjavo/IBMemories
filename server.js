const express = require('express');
const http = require('http');
const path = require('path');
var unirest = require('unirest');
var bodyParser = require('body-parser');

const url = "https://6171ddb2-5591-4f5f-937e-fe48a41b1837-bluemix:a0d601f29c9601c494038949bcbaa26deefbe73c71e31e948be91cfa9ce506f9@6171ddb2-5591-4f5f-937e-fe48a41b1837-bluemix.cloudant.com";
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

function getSquadList(squad){
    /* get list attached at that name*/
    let squads = {
        penguins:['poncho','enrique','gus','lalo','carlos','brandon','javier'],
        seals:["chingo de rasita"]
    }
    return squads[squad];
}

function getEventFor(myself){
    /* la asignacion manual se colecta de una db */
    let evnts = [{
        id:1,
        list:"penguins",
        name:"name",
        type:"Birthday",
        date:"Date",
        custom:"yes"
      },{
        id:2,
        list:"penguins",
        name:"name",
        type:"Birthday",
        date:"Date",
        custom:"no"
      },{
        id:3,
        list:"penguins",
        name:"name",
        type:"Birthday",
        date:"Date",
        custom:"no"
      },{
        id:4,
        list:['javier','pepe','toño'],
        name:"name",
        type:"Birthday",
        date:"Date",
        custom:"yes"
      }];
    //

    eventResp = [];
    evnts.forEach(x => {
        let list = (typeof x.list == "string" || x.list instanceof String)?getSquadList(x.list):x.list;
        list.forEach(user=>{
            if(user == myself){
                eventResp.push(x);
            }
        });
    }); 
    return eventResp;
}

app.post("/q", function (req, res) {
    let s = req.body['type'];
    let resp = {'error':"connection refused"};
    switch (s){
        case 'login':
            //check on db replace the true
            unirest.post(url+'/login/_find')
            .headers({Accept: 'application/json', 'Content-Type': 'application/json'})
            //.send({ "parameter": 23, "foo": "bar" })
            .send({ 
                selector:{
                    "_id":{
                        "$gt":"0"
                    }
                }
            })
            .end(function (response) {
                console.log(response.body);
                console.log(response.code);
            });
            let logStatus = (true)?'pass':'none';
            resp = {
                'data':logStatus,
                'error':"none"
            }
            delete logStatus;
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
            delete mail,data;
            break;
        case 'getAll':
            //take data from db
            let squad = "penguins";
            let name = req.body['mail'];
            let lName = req.body['mail'];
            resp = {
                'squad':squad,
                'name':name,
                'lName':lName,
                'birthday':new Date(),
                'anniversary':new Date(),
                'share':true,
                'error':"none"
            }
            delete squad,name,lName;
            break;
        case 'getPersonList':
            let filterValueL = req.body['filterValue'];
            db = ['test,','t,','e,','s,','t,']
            resp = {
                data: db.filter(option => option.toLowerCase().indexOf(filterValueL) === 0),
                'error':"none"
            }
            break;
        case 'getSquadList':
            let filterValueS = req.body['filterValue'];
            db = ["v,",'a,','l,','u,','e,','s,','q,']
            resp = {
                data: db.filter(option => option.toLowerCase().indexOf(filterValueS) === 0),
                'error':"none"
            }
            break;
        case 'events':
            let maile = req.body['mail'];
            let ev = [] 
            ev = getEventFor(maile);
            resp = {
                data:ev,
                error:"none"
            }
            delete maile,ev;
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