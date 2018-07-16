var unirest = require('unirest');
var Q = require('q');
const url2 = "https://6171ddb2-5591-4f5f-937e-fe48a41b1837-bluemix:a0d601f29c9601c494038949bcbaa26deefbe73c71e31e948be91cfa9ce506f9@6171ddb2-5591-4f5f-937e-fe48a41b1837-bluemix.cloudant.com";
const url = "https://1634dd6a-1741-4de7-9c4e-3d6f2543538e-bluemix:7dc590eccbcabca41ed8d2466a08c8e752d55ee544bd09567ec61c231ce2b21b@1634dd6a-1741-4de7-9c4e-3d6f2543538e-bluemix.cloudant.com";


class CloudantConnect {
    constructor() {
        this.log = this.Update('login');
        this.event = this.Update('event');
    }
    //geter and setter
    // method
    addUser(d){
        let env = this;
        unirest.post(url+'/login')
        .headers({Accept: 'application/json', 'Content-Type': 'application/json'})
        .send({ 
            user:d.user,
            passwd:d.pswd2,
            squad:"",
            name:d.name,
            Lname:d.Lname,
            birthday:d.d1,
            anniversary:d.d2,
            config:d.config
        })
        .end(function (response) {
            //env.log = env.Update('login');
            //response.body.docs;
            //console.log(response.body.docs);
        });
    }

    Update(db){
        var defer = new Q.defer();
        let fields = {};
        switch(db){
            case 'login':
                fields = {
                    selector: {
                        "user": {
                            "$gt": ""
                        }
                    },
                    "fields": [
                        "user",
                        "passwd",
                        "squad",
                        "name",
                        "Lname",
                        "birthday",
                        "anniversary",
                        "config",
                    ]
                }
            break;
            case 'events':
            fields = {
                selector: {
                   "_id": {
                      "$gt": "0"
                   }
                }
             };
            break;
            default:
            break;
        }
      
        unirest.post(url+'/'+db+'/_find')
            .headers({Accept: 'application/json', 'Content-Type': 'application/json'})
            .send( fields )
            .end(function (response) {
                //this.log = response.body.docs;
                defer.resolve(response.body.docs);
                // asignTo(db,response.body.docs);
            });    
        return defer.promise;
    }
    asignTo(db,resp){
        switch(db){
            case 'login':
                this.log = resp;
            break;
            default:
            break;

        }
    }
}

module.exports = {
    url:url,
    db:  new CloudantConnect()
}