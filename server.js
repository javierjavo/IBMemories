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

function sendMail(to,subject,text,html){
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
        text,
        html
      };
      
      transporter.sendMail(mailOptions, function(error, info){ });
}

function formatMailMessage(tittle,stitle,Message){
    return `
    <style>
@import url(https://fonts.googleapis.com/css?family=Roboto:400,500,700);
@import url(https://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic);
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #323c41;
}
.sc{
    color:black;
}
.blog-card {
  width: 350px;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -250px 0 0 -175px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.5);
  text-align: center;
}
.spring-fever {
  background: rgba(84, 104, 110, 0.8);
}
.color-overlay {
  /* Rectangle 11: */
  background: rgba(84, 104, 110, 0.8);
  width: 350px;
  height: 500px;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  
}

.color-overlay {
  background: rgba(84, 104, 110, 0.8);
}

.title-content {
  text-align: center;
  margin: 70px 0 0 0;
  position: absolute;
  z-index: 20;
  width: 100%;
  top: 0;
  left: 0;
}

h3 {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 2px;
  color: #9cc9e3;
  font-family: "Roboto", sans-serif;
  margin-bottom: 0;
}

hr {
  width: 50%;
  height: 3px;
  margin: 20px auto;
  border: 0;
  background: #d0bb57;
}

.intro {
  width: 170px;
  margin: 0 auto;
  color: #dce3e7;
  font-family: "Droid Serif", serif;
  font-size: 13px;
  font-style: italic;
  line-height: 18px;
}

.card-info {
    width: 100%;
    height: 40%;
    text-align: left;
    position: absolute;
    bottom: 80px;
    left: 0;
    margin: 0 auto;
    padding: 0 50px;
    color: #dce3e7;
    font-family: "Droid Serif", serif;
    font-style: 16px;
    line-height: 24px;
    z-index: 20;
    opacity: 1;
}

</style>

<div class="blog-card spring-fever">
    <div class="title-content">
      <h3>`+tittle+`</h3>
      <hr />
      <div class="intro">`+stitle+`</div>
    </div><!-- /.title-content -->
    <div class="card-info">`+Message+`</div><!-- /.card-info -->
    <!-- overlays -->
    <div class="gradient-overlay"></div>
    <div class="color-overlay"></div>
</div>`;
}

app.post("/q", function (req, res) {
    sleep.sleep(Math.trunc(petition/4));
    petition++;
    let s = req.body['type'];
    let resp = {'error':"connection unstable low response"};
    switch (s){
        case 'addUser':{
            cloudant.db.addUser(req.body['data']);
            setTimeout(function(){
                cloudant.db.log = cloudant.db.Update('login');
            },500);

            resp = {
                'data':"you will redirected in a second",
                'error':"update sussesfull"
            }
            res.send(resp);
        }
        break;
        case 'login':
            cloudant.db.log.then(r => {
                let again = true;
                resp = {
                    'data':"none",
                    'error':"try"
                }
                while(again){
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
                    if(resp['error']=="try"){
                        cloudant.db.log = cloudant.db.Update('login');
                        resp['error'] = 'Email is not correct, are you registered yet?';
                    }else{
                        again = false;
                    }
                }
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
                        sendMail( 
                            val['user'],
                            'your Password',
                            'Hi'+val['user']+',\n we found your password : '+val['passwd']+"\nremember that you can change it on your profile\nIBM and IBMemories wish you, a take nice day ;)",
                            '');
                        resp = {
                            'data':"none",
                            'error':"check your mail"
                        }
                    }
                    res.send(resp);
                });
            });
        break;
        case 'update':
            cloudant.db.log.then(r => {
                resp = {
                    'data':"none",
                    'error':"can't connect to db"
                }   
                r.forEach(val=>{
                    if(val['user']==req.body['mail']){
                        let data = {
                            'id':val['_id'],
                            'user':val['user'],
                            'passwd':val['passwd'],
                            'squad':req.body['squad'],
                            'name':req.body['name'],
                            'Lname':req.body['Lname'],
                            'birthday':req.body['birthday'],
                            'anniversary':req.body['anniversary'],
                            'config':req.body['config'].toString()
                        };
                        cloudant.db.updateProfile(val['_rev'],data);
                        resp = {
                            'status':"update successful",
                            'error':"none"
                        }
                        setTimeout(function(){
                            cloudant.db.log = cloudant.db.Update('login');
                        },500);
                        res.send(resp);
                    }
                })
            })
            break;
        case 'getProfile':
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
                            'Lname':val['Lname'],
                            'birthday':val['birthday'],
                            'anniversary':val['anniversary'],
                            'config':val['config'],
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
            cloudant.db.event.then(r => {
                data = [];
                r.forEach(x => {
                    //if custom is yes revew myself on custome list else revew manager and return events
                    if(new Date(x.date).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)) 
                        if(x.manager == "jis"){
                            data.push(x);
                        }
                    else{
                        //delete and update
                        //cloudant.db.deleteEvent(x._rev,x._id);
                    }
                        
                });
                resp = {
                    data,
                    error:"none"
                }
                res.send(resp);
            })
            break;
        case 'addEvent':{
            cloudant.db.addEvent(req.body);
            cloudant.db.event = cloudant.db.Update('events');
            resp = {
                error:"todo cool"
            }
            res.send(resp);
        }
        break;
        default:
            resp = {'error':"command none found"}
            break;
    }
    petition--;
    return;
  });
  
setInterval(function() {
    t1 = new Date();
    t2 = new Date(); //aux
    t1.setDate(t2.getDate() + 5);
    t1 = t1.toISOString().substring(0, 10);
    t2 = t2.toISOString().substring(0, 10);

    cloudant.db.log.then(r => {
        r.forEach(val=>{
            if( val['config'] == 'true' ){
                if( val['birthday'].substring(0, 10) == t1 ){
                    cloudant.db.addEvent({
                        manager:'jis',
                        list:val['squad'],
                        name:val['name'],
                        type:'birthday',
                        date:val['birthday'],
                        custom:"no"
                    });
                    cloudant.db.event = cloudant.db.Update('events');
                }
                if( val['anniversary'].substring(0, 10) == t1 ){
                    cloudant.db.addEvent({
                        manager:'jis',
                        list:val['squad'],
                        name:val['name'],
                        type:'anniversary',
                        date:val['anniversary'],
                        custom:"no"
                    });
                    cloudant.db.event = cloudant.db.Update('events');
                }
                if( val['birthday'].substring(0, 10) == t2 ){
                    //create event br
                    //sendMail(val['user'], "Congratulations","",formatMailMessage("Congratulations","<p class='sc'>happy birthday <p> "+val['name']+" we have a message for you","We wish you an amazing year that ends with accomplishing all the great goals <br> that you have set!","0"));
                }
                if( val['anniversary'].substring(0, 10) == t2 ){
                    //create event anv
                    //sendMail(val['user'], "Congratulations","",formatMailMessage("Congratulations","<p class='sc'><p> "+val['name']+" we have a message for you","We wish you an amazing year that ends with accomplishing all the great goals <br> that you have set!","0"));
                }
            }
        })
    })
    //debug false
},(true)?86400000:10000);

//sendMail("berrospe.he@gmail.com","Congratulations","",formatMailMessage("Congratulations","<p class='sc'>happy Birthday<p> javier we have a message for you","We wish you an amazing year that ends with accomplishing all the great goals <br> that you have set!","0"));

const server = http.createServer(app);
server.listen(port,() => console.log('running at port '+port));