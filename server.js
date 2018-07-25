const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;
const cloudant = require('./query');
var unirest = require('unirest');
//var sleep = require('sleep');
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

function managerList(manager){
    gerency = {
        jis:['penguins','seals','tequila','saviors']
    };
    return gerency[manager];
}

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
    setTimeout(function() {
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
        case 'updateEvent':
        cloudant.db.event.then(r => {
            r.forEach(x => {
                if(x['_id'] == req.body['data']['_id']){
                    x['messages'] = req.body['data']['messages'];
                    cloudant.db.updateEvent(x);
                }    
            });
            resp = {
                error:"none"
            }
            cloudant.db.event = cloudant.db.Update('events');
            res.send(resp);
        })
        break;
        break;
        case 'events':
            cloudant.db.event.then(r => {
                data = [];
                r.forEach(x => {
                    //if custom is yes revew myself on custome list else revew manager and return events
                    if(new Date(x.date).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)){
                        if(x.manager == "jis"){
                            data.push(x);
                        }
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
    }, Math.trunc(petition/4));
});

setInterval(function() {
    t1 = new Date();
    t2 = new Date(); //aux
    t1.setDate(t2.getDate() + 5);
    t1 = t1.toISOString().substring(0, 10);
    t2 = t2.toISOString().substring(0, 10);
    cloudant.db.log.then(r => {
        r.forEach(val=>{
            cloudant.db.event.then(ev => {
                notexistbr = true;
                notexistan = true;
                ev.forEach(e=>{
                    if(e['name'] == val['user'].split('@')[0]){
                        if(e['type']=="birthday" || val['config'] == 'false' ){
                            notexistbr = false;
                            if (e['date'] != val['birthday']){
                                notexistbr = true;
                                cloudant.db.deleteEvent(e['_rev'],e['_id']);
                            }
                        }
                        if(e['type']=="anniversary" || val['config'] == 'false'){
                            notexistan = false;
                            if (e['date'] != val['anniversary']){
                                notexistbr = true;
                                cloudant.db.deleteEvent(e['_rev'],e['_id']);
                            }
                        }
                    }   
                    if( e['date'].substring(0, 10) <= t2 && val['config'] == 'true' ){
                        // send mail
                        let comment = "";
                        e['messages'].forEach(m=>{
                            comment += "\n"+m['user']+":\n"+m['message'];
                        });
                        let aux = (e['type']=="anniversary")?'We are so proud to have you as part of our work family. We hope that you keep up the good work for many years to come!':'Wishing you much happiness on your special day. Have an unforgettable birthday';
                        aux += ( comment.length > 0)?'\nsome coworkers share with you a congratulate message':'';
                        comment = "<@"+e['name']+">, "+aux+comment;
                        unirest.put("https://hooks.slack.com/services/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")
                        .headers({'Content-type': 'application/json'})
                        .send({ 
                            "username": (e['list'])?e['list']:' your Squad' + " and tribiu",
                            "icon_emoji": (e['type'] == "birthday")?":birthday:":":congapartyparrot-9224:",
                            "text": comment
                        })
                        .end(function (response) { 
                         });
                        cloudant.db.deleteEvent(e['_rev'],e['_id']);
                        cloudant.db.event = cloudant.db.Update("events");
                        //sendMail(val['user'], "Congratulations","",formatMailMessage("Congratulations","<p class='sc'>happy birthday <p> "+val['name']+" we have a message for you","We wish you an amazing year that ends with accomplishing all the great goals <br> that you have set!","0"));
                    }
                });
                if( val['config'] == 'true'){
                    if( val['birthday'].substring(0, 10) >= t2 && val['birthday'].substring(0, 10) <= t1 && notexistbr ){
                        cloudant.db.addEvent({
                            manager:'jis', //change in a future
                            list:val['squad'],
                            name:val['user'].split('@')[0],
                            type:'birthday',
                            date:val['birthday'],
                            custom:"no",
                            messages:[]
                        });
                        //send link to mail
                        cloudant.db.event = cloudant.db.Update('events');
                        cloudant.db.log.then(usrList=>{
                            ml = managerList('jis');
                            usrList.forEach(usr=>{
                                ml.forEach(msq => {
                                    if(usr["squad"] == msq && usr["name"] != val['name'] ){
                                        sendMail(usr['user'], "Someone's birthday is coming","",formatMailMessage("congratulate to "+val['name'],"<p class='sc'> Hi "+usr["name"]+"<p> "+val['name']+"'s birthday is coming, actually you can prepare messages to this day ","to see more dates memorable, go to app in https://ibmemories.w3ibm.mybluemix.net/","0"));
                                    }
                                });
                            });
                        });
                    }
                    if( val['anniversary'].substring(0, 10) >= t2 && val['anniversary'].substring(0, 10) <= t1 && notexistan){
                        cloudant.db.addEvent({
                            manager:'jis',
                            list:val['squad'],
                            name:val['user'].split('@')[0],
                            type:'anniversary',
                            date:val['anniversary'],
                            custom:"no",
                            messages:[]
                        });
                        cloudant.db.event = cloudant.db.Update('events');
                        cloudant.db.log.then(usrList=>{
                            ml = managerList('jis');
                            usrList.forEach(usr=>{
                                ml.forEach(msq => {
                                    if(usr["squad"] == msq && usr["name"] != val['name'] ){
                                        sendMail(val['user'], "Someone's anniversary on IBM is coming","",formatMailMessage("congratulate to "+val['name'],"<p class='sc'>Hi "+usr["name"]+"<p> "+val['name']+"'s anniversary on IBM is coming, actually you can prepare messages to this day ","to see more dates memorable, go to app in https://ibmemories.w3ibm.mybluemix.net/","0"));
                                    }
                                });
                            });
                        });
                    }
                }
            });
        });
    });
    cloudant.db.event = cloudant.db.Update("events");
    //debug false
},5000);

//sendMail("berrospe.he@gmail.com","Congratulations","",formatMailMessage("Congratulations","<p class='sc'>happy Birthday<p> javier we have a message for you","We wish you an amazing year that ends with accomplishing all the great goals <br> that you have set!","0"));

const server = http.createServer(app);
server.listen(port,() => console.log('running at port '+port));