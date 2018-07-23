var unirest = require('unirest');
var Q = require('q');
const url = "https://1634dd6a-1741-4de7-9c4e-3d6f2543538e-bluemix:7dc590eccbcabca41ed8d2466a08c8e752d55ee544bd09567ec61c231ce2b21b@1634dd6a-1741-4de7-9c4e-3d6f2543538e-bluemix.cloudant.com";


class CloudantConnect {
    constructor() {
        this.log = this.Update('login');
        this.event = this.Update('events');
    }
    //geter and setter
    // method
    
    updateProfile(rev, data){
        unirest.put(url+'/login/'+data['id'])
        .headers({Accept: 'application/json', 'Content-Type': 'application/json', 'If-Match':rev})
        .send({ 
            'user':data['user'],
            'passwd':data['passwd'],
            'squad':data['squad'],
            'name':data['name'],
            'Lname':data['Lname'],
            'birthday':data['birthday'],
            'anniversary':data['anniversary'],
            'config':data['config']
         })
        .end(function (response) {
           //this.log() = this.Update('login');
        });
    }

    addEvent(d){
        unirest.post(url+'/events')
        .headers({Accept: 'application/json', 'Content-Type': 'application/json'})
        .send({ 
            manager:d['manager'],
            list:d['squad'],
            name:d['name'],
            type:d['type'],
            date:d['date'],
            custom:d['custom']
        })
        .end(function (response) { });
    }

    updateEvent(d){
        unirest.put(url+'/events/'+d['_id'])
        .headers({Accept: 'application/json', 'Content-Type': 'application/json','If-Match':d['_rev']})
        .send({ 
            manager:d['manager'],
            list:d['squad'],
            name:d['name'],
            type:d['type'],
            date:d['date'],
            custom:d['custom'],
            messages:d["messages"]
        })
        .end(function (response) { });
    }

    deleteEvent(rev,id){
        unirest.delete(url+'/events/'+id)
        .headers({Accept: 'application/json', 'Content-Type': 'application/json', 'If-Match':rev})
        .end(function (response) {
           //this.log() = this.Update('login');
        });
    }

    addUser(d){
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
        .end(function (response) { });
    }

    Update(db){
        var defer = new Q.defer();
        let fields = {};
        switch(db){
            case 'login':
                fields = {
                    selector: {
                        "_id": {
                            "$gt": "0"
                         }
                    },
                    "fields": [
                        "_id",
                        "_rev",
                        "user",
                        "passwd",
                        "squad",
                        "name",
                        "Lname",
                        "birthday",
                        "anniversary",
                        "config"
                    ]
                };
            break;
            case 'events':
            fields = {
                selector: {
                    "_id": {
                        "$gt": ""
                    }
                },
                "fields": [
                    "_id",
                    "_rev",
                    "manager",
                    "list",
                    "name",
                    "type",
                    "date",
                    "custom",
                    "messages"
                ]
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
                
            });    
        return defer.promise;
    }
}

module.exports = {
    url:url,
    db:  new CloudantConnect()
}