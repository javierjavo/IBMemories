const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;
const cloudant = require('./query');
var unirest = require('unirest');
var sleep = require('sleep');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var petition = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

function sendMail(to,subject,text){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sat.franciscojavier@gmail.com',
          pass: 'satprogram'
        }
      });
      
      var mailOptions = {
        from: 'sat.franciscojavier@gmail.com',
        to,
        subject,
        text
      };
      
      transporter.sendMail(mailOptions, function(error, info){ });
}

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
    sleep.sleep(Math.trunc(petition/4));
    petition++;
    let s = req.body['type'];
    let resp = {'error':"connection unstable low response"};
    switch (s){
        case 'addUser':
            cloudant.db.addUser(req.body['data']);
            cloudant.db.log = cloudant.db.Update('login');
            resp = {
                'data':"ok",
                'error':"update sussesfull"
            }
            res.send(resp);
        break;
        case 'login':
            cloudant.db.log.then(r => {
                resp = {
                    'data':"none",
                    'error':"Email is not correct, are you registered yet?"
                }   
                r.forEach(val=>{
                    if( val['user'] == req.body['user']){
                        if(val['passwd'] == req.body['passwd']){
                            resp = {
                                'data':"pass",
                                'error':"none"
                            }
                        }else{
                            resp = {
                                'data':"none",
                                'error':"Password incorrect"
                            }
                        }
                    }
                })
                res.send(resp);
            })
        break;
        case 'recoveryPasswd':
            cloudant.db.log.then(r => {
                resp = {
                    'data':"none",
                    'error':"Email is not correct, are you registered yet?"
                }   
                r.forEach(val=>{
                    if( val['user'] == req.body['user']){
                        sendMail(val['user'],'your Password','Hi'+val['user']+',\n we found your password : '+val['passwd'])+"\nremember that you can change it on your profile\nIBM and IBMemories wish you, a take nice day ;)";
                        resp = {
                            'data':"none",
                            'error':"check your mail"
                        } 
                    }
                })
                res.send(resp);
            })
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
        case 'getProfile':
            //take data from db
            cloudant.db.log.then(r => {
                resp = {
                    'data':"none",
                    'error':"can't connect to db"
                }   
                r.forEach(val=>{
                    if(val['user']==req.body['mail']){
                        resp = {
                            'squad':val['squad'],
                            'name':val['name'],
                            'lName':val['Lname'],
                            'birthday':val['birthday'],
                            'anniversary':val['anniversary'],
                            'share':val['config'],
                            'error':"none"
                        }
                        res.send(resp);
                    }
                })
            })
            return;
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
    petition--;
    return;
  });
  
setInterval(function() {
    d = new Date();
    d.setDate(d.getDate() + dias);
    //if(d.getMonth() == );
    console.log();
}, 1000);


const server = http.createServer(app);
server.listen(port,() => console.log('running at port '+port));