var fs = require("fs"),
    readline = require("readline");

var express = require('express');
var app = express();
var port = process.env.PORT || 3008;
var request = require('request');
var cheerio = require('cheerio');
var mailer = require("nodemailer");
var moment = require('moment');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
app.use(
    bodyParser.json({
        parameterLimit: 10000000,
        limit: '90mb'
    })
);
app.use(
    bodyParser.urlencoded({
        parameterLimit: 10000000,
        limit: '90mb',
        extended: false})
);
var datetimestamp='';
var filename='';
var EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
emitter.setMaxListeners(0)
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(function(req, res, next) {
    //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var mongodb = require('mongodb');
var db;
var url = 'mongodb://localhost:27017/audiodeadline';
var MongoClient = mongodb.MongoClient;
MongoClient.connect(url, function (err, database) {
    if(err){
        console.log(err);
    }else{
        db=database;
        console.log("connected");
    }
});

var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        filename=file.originalname.split('.')[0].replace(' ','') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, filename);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/uploads', function(req, res) {

    datetimestamp = moment().unix();
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        res.json({error_code:0,filename:filename});
    });
});


app.get('/testing', function (req, resp) {
    console.log("hi");
    resp.send("success");
});

app.get('/signup',function(req,resp){
    var collection = db.collection('user');
    var crypto = require('crypto');
    var secret = req.query.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    var admin = 0;
    if(req.query.type == 'admin'){
        admin = 1;
    }

    var parentname = req.query.parent;
    var address = '';
    if(typeof (req.query.address) != 'undefined'){
        address = req.query.address;
    }
    var address2 = '';
    if(typeof (req.query.address2) != 'undefined'){
        address2 = req.query.address2;
    }
    var city = '';
    if(typeof (req.query.city) != 'undefined'){
        city = req.query.city;
    }
    var state = '';
    if(typeof (req.query.state) != 'undefined'){
        state = req.query.state;
    }
    var zip = '';
    if(typeof (req.query.zip) != 'undefined'){
        zip = req.query.zip;
    }
    var gender = '';
    if(typeof (req.query.gender) != 'undefined'){
        gender = req.query.gender;
    }
    var rsvp = 0;
    if(typeof (req.query.rsvp) != 'undefined'){
        rsvp = parseInt(req.query.rsvp);
    }
    var signupaffiliate = 0;
    if(typeof (req.query.signupaffiliate) != 'undefined'){
        signupaffiliate = parseInt(req.query.signupaffiliate);
    }
    var ambassador = 0;
    if(typeof (req.query.ambassador) != 'undefined'){
        ambassador = parseInt(req.query.ambassador);
    }
    var dancer = 0;
    if(typeof (req.query.dancer) != 'undefined'){
        dancer = parseInt(req.query.dancer);
    }
    var model = 0;
    if(typeof (req.query.model) != 'undefined'){
        model = parseInt(req.query.model);
    }
    var musicians = 0;
    if(typeof (req.query.musicians) != 'undefined'){
        musicians = parseInt(req.query.musicians);
    }
    var fan = 0;
    if(typeof (req.query.fan) != 'undefined'){
        fan = parseInt(req.query.fan);
    }

    db.collection('csvdata').find({email:req.query.email}).toArray(function(errc,itemsc){
        if(itemsc.length > 0){
            parentname = 'seanaudio';
        }
        collection.find({email:req.query.email}).toArray(function(err,items){
            if(items.length==0){
                collection.find({username: req.query.username}).toArray(function(err,items){
                    if(items.length==0){
                        collection.insert([{
                            firstname: req.query.firstname,
                            lastname: req.query.lastname,
                            phone: req.query.phone,
                            email: req.query.email,
                            username: req.query.username,
                            password: hash,
                            address: address,
                            address2: address2,
                            city: city,
                            state: state,
                            zip: zip,
                            rsvp: rsvp,
                            signupaffiliate: signupaffiliate,
                            parent: parentname,
                            added_time: moment().unix(),
                            admin: admin,
                            status: 1,
                            agreement: 0,
                            noofclick: 0,
                            mediaid: req.query.mediaid,
                            gender: gender,
                            ambassador: ambassador,
                            dancer: dancer,
                            model: model,
                            musicians: musicians,
                            fan: fan,
                            accesscode: '',
                        }], function (err, result){
                            if(err){
                                resp.send(JSON.stringify({'status':'failed'}));
                            } else {
                                var smtpTransport = mailer.createTransport("SMTP", {
                                    service: "Gmail",
                                    auth: {
                                        user: "itplcc40@gmail.com",
                                        pass: "DevelP7@"
                                    }
                                });

                                var name=req.query.firstname+' '+req.query.lastname;
                                var email=req.query.email;
                                var loginlink='https://audiodeadline.com/login';

                                if((signupaffiliate == 1)){
                                    var mail = {
                                        from: "Admin <itplcc40@gmail.com>",
                                        to: req.query.email,
                                        subject: 'You are signed up for the audio deadline ticket RSVP and Affiliate Program!',
                                        html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>audiodeadline</title></head><body><div style="max-width: 600px; margin: 0 auto;"><div style=" background: #ccd4dc; border-top: solid 5px #000; padding: 10px 0;"> <img src="https://audiodeadline.com/assets/images/logo.png"  alt="#" style="display: block; margin: 0 auto;"><p style="padding: 25px 20px 0 20px; margin: 0px; text-align: center; font-size: 22px; color: #000; font-family: Arial; text-transform: uppercase;">You are signed up for the audio deadline ticket RSVP and affiliate program!</p></div><div style="background: #ccd4dc;"> <img src="https://audiodeadline.com/assets/images/audiodeadline_mailimg1.png" alt="#" style="display: block; margin: 0 auto; width: 100%;"></div><div style="background: #ccd4dc; padding:20px 10px; text-align: center; font-size: 24px; text-transform: uppercase; font-family:Arial; font-weight: bold;">AUDIO DEADLINE IS AN EVOLUTION IN MUSIC<span style="font-size: 24px; display: block; padding-top: 20px; font-weight: normal;"> YOU HAVE JOINED THE MUSIC REVOLUTION AND WE WILL RISE ABOVE TOGETHER.</span></div><div style="background: #fff; border: solid 1px #ccd4dc; padding:20px 10px; text-align: center; font-size: 16px; line-height: 24px;  font-family:Arial; ">You are RSVPed to be told when streaming tickets to the Audio Deadline show go up for purchase AND you are currently signed up to use our share links and social broadcast tools to bring others to sign up under you! Everyone signs up under you that makes any purchases on our portal will pay you 10% and if they sign up to be an affiliate promoter you will ALSO get 10% from all the audience they bring! Streaming tickets go on sale October 1st for the first Audio Deadline happening in January 2019!</div><div style="background: #ccd4dc; padding: 4px; text-align: center; font-family: Arial; font-size: 22px; color: #000;"><div style="border: double 6px #fff; padding: 10px;"><strong>Your sign in link:</strong> <a href="'+loginlink+'" target="_blank; " style="color: #ee680f;"> '+loginlink+'</a></div></div><div style="background: #fff; border: solid 1px #ccd4dc; padding:20px 10px; text-align: center; font-size: 20px; line-height: 24px;  font-family:Arial; "><div style="display: block; color:#0ebce7; margin: 0px; padding-bottom: 15px; font-weight: bold; text-align: center; font-size: 20px; line-height: 24px;  font-family:Arial;"> Your username:<span style="font-weight: normal; color: #000; padding-left: 10px;">'+email+'</span></div><div style="display: block; color:#0ebce7; margin: 0px; padding-bottom: 15px; font-weight: bold; text-align: center; font-size: 20px; line-height: 24px;  font-family:Arial;">  Password: <span style="font-weight: normal; color: #000; padding-left: 10px;">Password you put on time of registration (Hidden due to security)</span></div><div style="display: block; text-align: center; text-transform: uppercase; font-weight: bold; color: #ee680f; text-align: center; font-size: 24px; line-height: 30px;  font-family:Arial;"> Sign in and start marketing right away!</div></div><div style="background: #ccd4dc;  padding:20px 10px; text-align: center; font-size: 16px; line-height: 24px;  font-family:Arial; ">We are building an incredible massive online community of musicians, fans and excitement around our ground breaking and inspiring new online streaming show, Audio Deadline. The social network and share technology is all free to users and every quarter we have a live streaming event they can purchase streaming tickets as well as other commerce opportunities.<br/><br/>On the Audio Deadline online steaming show itself we seek to unify the sound of well-known and A-list and participating independent artists for a single song, on a single day, and filmed in single takes from multiple angles. This allows for the ultimate interactive experience that artists can share with their fans and peers.<br/><br/><strong> WHILE AUDIO DEADLINE IS STREAMING LIVE, THE ARTISTS ARE CREATING THEIR MUSIC AND FANS ARE VIRTUALLY RIGHT THERE IN THE STUDIO WITH THEM.</strong><br/><br/>The Audio Deadline show is surrounded by one of the most dynamic technologies for musicians to have ever launched online! Musicians can complete to be on the show through votes, add all their media and trade traffic with thousands of other artists in our Artist Exchange.<br/><br/>We look forward to sharing all the excitement with you and we’ll see you on the AudioDeadline.com portal!</div></div></body></html>'
                                    }
                                }else if((rsvp == 1)){
                                    var mail = {
                                        from: "Admin <itplcc40@gmail.com>",
                                        to: req.query.email,
                                        subject: 'You are signed up for the audio deadline streaming ticket RSVP!',
                                        html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>audiodeadline</title></head><body><div style="max-width: 600px; margin: 0 auto;"><div style=" background:  #1c2831; padding: 15px; text-align: center; font-family: Arial; font-size: 22px; color: #fff; text-transform: uppercase;">You are signed up for the audio deadline streaming ticket RSVP!</div><div><img src="https://audiodeadline.com/assets/images/audiodeadline_mailimg2.jpg" alt="#" style="display: block; margin: 0 auto; width: 100%;"></div><div style="background: #e4e8f2; padding:20px 10px; text-align: center; font-family:Arial; "><img src="https://audiodeadline.com/assets/images/logo.png"  alt="#" style="display: block; margin: 0 auto;"><p style="margin: 0; padding: 20px 0 0 0; line-height: 34px; color: #1c2831; font-size: 24px; text-transform: uppercase; font-weight: bold; ">AUDIO DEADLINE IS AN EVOLUTION IN MUSIC<br>YOU HAVE JOINED THE MUSIC REVOLUTION AND WE WILL RISE ABOVE TOGETHER.</p></div><div style="background: #1c2831; padding:20px 20px; text-align: center; font-family:Arial; "><p style="font-size: 18px; color: #fff; line-height: 26px; margin: 0; padding: 0 0 15px 0;">You are RSVPed to be told when streaming tickets to the Audio Deadline show go up for purchase. <b>Streaming tickets go on sale October 1st for the first Audio Deadline happening in January 2019! If you buy within the first 14 days from our official opening day on October 1st you will receive a $5 discount!</b></p><div style="display: block; color:#0ebce7; margin: 0px; padding-bottom: 15px; font-weight: bold;  font-family:Arial; font-size: 18px;">  Your sign in link: <a href="'+loginlink+'" target="_blank" style="font-weight: normal; color: #fff; padding-left: 10px;">'+loginlink+'</a></div><div style="display: block; color:#0ebce7; margin: 0px; padding-bottom: 15px; font-weight: bold; font-family:Arial; font-size: 18px;">  Your username: <span style="font-weight: normal; color: #fff; padding-left: 10px;">'+email+'</span></div><div style="display: block; color:#0ebce7; margin: 0px; padding-bottom: 15px; font-weight: bold; font-family:Arial; font-size: 18px;">  Your password: <span style="font-weight: normal; color: #fff; padding-left: 10px;">Password you put on time of registration (Hidden due to security)</span></div><div style="display: block; text-align: center; text-transform: uppercase; font-weight: bold; color: #ee680f; font-size: 24px; padding-top: 10px; font-family: Arial;"> Sign in and start marketing right away!</div></div><div style="background: #e4e8f2; padding:20px 20px; text-align: center; font-family:Arial; font-size: 16px; color: #1c2831; line-height: 24px; border-bottom: solid 5px #1c2831; ">We are building an incredible massive online community of musicians, fans and excitement around our ground breaking and inspiring new online streaming show, Audio Deadline. On the Audio Deadline online steaming show itself we seek to unify the sound of well-known and A-list and participating independent artists for a single song, on a single day, and filmed in single takes from multiple angles. This allows for the ultimate interactive experience that artists can share with their fans and peers.<br/><br/><strong> WHILE AUDIO DEADLINE IS STREAMING LIVE, THE ARTISTS ARE CREATING THEIR MUSIC AND FANS ARE VIRTUALLY RIGHT THERE IN THE STUDIO WITH THEM.</strong><br/><br/>We look forward to sharing all the excitement with you and we’ll see you on the AudioDeadline.com portal!</div></div></body></html>'
                                    }
                                }else{
                                        var mail = {
                                            from: "Admin <itplcc40@gmail.com>",
                                            to: req.query.email,
                                            subject: 'Welcome to Audiodeadline.com',
                                            html: '<p>Hello,</p>' + '<p>Thank you for your interest in Audiodeadline.com. On behalf of our team and management, we would like you to know we are excited that you’re on board with us!</p>' + '<P>Below is your  login information. </p>' + '<p>Your Login Url:' + loginlink + '<p>User Name: ' + email + '</p>' + '<p>Password: Password you put on time of registration (Hidden due to security) </p>' + '<P>We look forward to working closely with you. </P>'
                                        }
                                }


                                smtpTransport.sendMail(mail, function (error, response) {
                                    smtpTransport.close();
                                });
                                resp.send(JSON.stringify({'status':'success','result':result}));
                            }
                        });
                    }
                    if(items.length>0){
                        resp.send(JSON.stringify({'status':'error','msg':'Username already exist..!'}));
                        return;
                    }
                });
            }
            if(items.length>0){
                resp.send(JSON.stringify({'status':'error','msg':'Email id already exist..!'}));
                return;
            }
        });
    });

});

app.get('/contactus',function(req,resp){
    var collection = db.collection('contactus');
    collection.insert([{
        fullname: req.query.fullname,
        email: req.query.email,
        phoneno: req.query.phoneno,
        message: req.query.message,
        added_time: moment().unix()
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'failed'}));
        } else {
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/userlogin', function (req, resp) {
    var crypto = require('crypto');
    var secret = req.query.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    //resp.send(JSON.stringify({'status':'error','msg':req.query.email}));
    //return;
    var collection = db.collection('user');

    collection.find({ email:req.query.email}).toArray(function(err, items){
        if(items.length==0){
            resp.send(JSON.stringify({'status':'error','msg':'Email ID invalid...'}));
            return;
        }
        if(items.length>0 && items[0].password!=hash){
            resp.send(JSON.stringify({'status':'error','msg':'Password Doesnot match'}));
            return;
        }
        if(items.length>0 && items[0].status==0){
            resp.send(JSON.stringify({'status':'error','msg':'This is Inactive User'}));
            return;
        }
        if(items.length>0 && items[0].password==hash){
            resp.send(JSON.stringify({'status':'success','msg':items[0]}));
            return;
        }
    });
});

app.get('/allemail',function(req,resp){
    var collection= db.collection('user');
    var email=req.query.email;
    collection.find({email: email}).toArray(function(err, items){
        if(items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }
        if(items.length>0){
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/emaildetails',function(req,resp){
    var collection= db.collection('user');
    //var collection= db.collection('userview');
    /*var o_id = new mongodb.ObjectID('5ba4c822885f8c543ab4b0f8');
    collection.update({_id: o_id}, {$set: {fan: 1}},function(err, results) {
        console.log(1);
    });*/
    /*collection.deleteOne({_id: o_id}, function(err, results) {
        console.log(1);
    });
    collection.update({signupaffiliate: ""}, {$set: {accesscode: ''}},{upsert:true,multi:true},function(err, results) {
        console.log(1);
    });*/
    collection.find().toArray(function(err, items){
        resp.send(JSON.stringify(items));
    });
});

app.get('/dashboard',function(req,resp){
    var resitem = {};
    var collection = db.collection('user');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.find({_id:o_id}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':resitem}));
        }
    });
});

app.get('/kendrick',function(req,resp){
    var collection = db.collection('tickets');
    collection.insert([{
        firstname: req.query.firstname,
        lastname: req.query.lastname,
        email: req.query.email,
        phone: req.query.phone,
        zipcode: req.query.zipcode,
        terms: req.query.terms,
        source: 'kendrick',
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'failed'}));
        } else {
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/usher',function(req,resp){
    var collection = db.collection('tickets');
    collection.insert([{
        firstname: req.query.firstname,
        lastname: req.query.lastname,
        email: req.query.email,
        phone: req.query.phone,
        zipcode: req.query.zipcode,
        terms: req.query.terms,
        source: 'usher',
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'failed'}));
        } else {
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/sevynstreeter',function(req,resp){
    var collection = db.collection('tickets');
    collection.insert([{
        firstname: req.query.firstname,
        lastname: req.query.lastname,
        email: req.query.email,
        phone: req.query.phone,
        zipcode: req.query.zipcode,
        terms: req.query.terms,
        source: 'sevynstreeter',
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'failed'}));
        } else {
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/getusastates',function (req,resp) {
    var usastates=[
        {
            "name": "Alabama",
            "abbreviation": "AL"
        },
        {
            "name": "Alaska",
            "abbreviation": "AK"
        },
        {
            "name": "American Samoa",
            "abbreviation": "AS"
        },
        {
            "name": "Arizona",
            "abbreviation": "AZ"
        },
        {
            "name": "Arkansas",
            "abbreviation": "AR"
        },
        {
            "name": "California",
            "abbreviation": "CA"
        },
        {
            "name": "Colorado",
            "abbreviation": "CO"
        },
        {
            "name": "Connecticut",
            "abbreviation": "CT"
        },
        {
            "name": "Delaware",
            "abbreviation": "DE"
        },
        {
            "name": "District Of Columbia",
            "abbreviation": "DC"
        },
        {
            "name": "Federated States Of Micronesia",
            "abbreviation": "FM"
        },
        {
            "name": "Florida",
            "abbreviation": "FL"
        },
        {
            "name": "Georgia",
            "abbreviation": "GA"
        },
        {
            "name": "Guam",
            "abbreviation": "GU"
        },
        {
            "name": "Hawaii",
            "abbreviation": "HI"
        },
        {
            "name": "Idaho",
            "abbreviation": "ID"
        },
        {
            "name": "Illinois",
            "abbreviation": "IL"
        },
        {
            "name": "Indiana",
            "abbreviation": "IN"
        },
        {
            "name": "Iowa",
            "abbreviation": "IA"
        },
        {
            "name": "Kansas",
            "abbreviation": "KS"
        },
        {
            "name": "Kentucky",
            "abbreviation": "KY"
        },
        {
            "name": "Louisiana",
            "abbreviation": "LA"
        },
        {
            "name": "Maine",
            "abbreviation": "ME"
        },
        {
            "name": "Marshall Islands",
            "abbreviation": "MH"
        },
        {
            "name": "Maryland",
            "abbreviation": "MD"
        },
        {
            "name": "Massachusetts",
            "abbreviation": "MA"
        },
        {
            "name": "Michigan",
            "abbreviation": "MI"
        },
        {
            "name": "Minnesota",
            "abbreviation": "MN"
        },
        {
            "name": "Mississippi",
            "abbreviation": "MS"
        },
        {
            "name": "Missouri",
            "abbreviation": "MO"
        },
        {
            "name": "Montana",
            "abbreviation": "MT"
        },
        {
            "name": "Nebraska",
            "abbreviation": "NE"
        },
        {
            "name": "Nevada",
            "abbreviation": "NV"
        },
        {
            "name": "New Hampshire",
            "abbreviation": "NH"
        },
        {
            "name": "New Jersey",
            "abbreviation": "NJ"
        },
        {
            "name": "New Mexico",
            "abbreviation": "NM"
        },
        {
            "name": "New York",
            "abbreviation": "NY"
        },
        {
            "name": "North Carolina",
            "abbreviation": "NC"
        },
        {
            "name": "North Dakota",
            "abbreviation": "ND"
        },
        {
            "name": "Northern Mariana Islands",
            "abbreviation": "MP"
        },
        {
            "name": "Ohio",
            "abbreviation": "OH"
        },
        {
            "name": "Oklahoma",
            "abbreviation": "OK"
        },
        {
            "name": "Oregon",
            "abbreviation": "OR"
        },
        {
            "name": "Palau",
            "abbreviation": "PW"
        },
        {
            "name": "Pennsylvania",
            "abbreviation": "PA"
        },
        {
            "name": "Puerto Rico",
            "abbreviation": "PR"
        },
        {
            "name": "Rhode Island",
            "abbreviation": "RI"
        },
        {
            "name": "South Carolina",
            "abbreviation": "SC"
        },
        {
            "name": "South Dakota",
            "abbreviation": "SD"
        },
        {
            "name": "Tennessee",
            "abbreviation": "TN"
        },
        {
            "name": "Texas",
            "abbreviation": "TX"
        },
        {
            "name": "Utah",
            "abbreviation": "UT"
        },
        {
            "name": "Vermont",
            "abbreviation": "VT"
        },
        {
            "name": "Virgin Islands",
            "abbreviation": "VI"
        },
        {
            "name": "Virginia",
            "abbreviation": "VA"
        },
        {
            "name": "Washington",
            "abbreviation": "WA"
        },
        {
            "name": "West Virginia",
            "abbreviation": "WV"
        },
        {
            "name": "Wisconsin",
            "abbreviation": "WI"
        },
        {
            "name": "Wyoming",
            "abbreviation": "WY"
        }
    ];
    resp.send(usastates);
});

app.get('/adminlist',function(req,resp){
    var collection= db.collection('userview');
    cond = {
        $and : [
            {admin : 1},
            { username: { $ne: "samsujj" } }
        ]
    };
    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });

});

app.get('/affiliatelist',function(req,resp){
    var collection= db.collection('affiliateview');
    var cond = {};
    cond = {
        $and : [
            {admin : 0},
            {signupaffiliate: 1}
        ]
    };

    if(req.query.username != ''){
        cond = {
            $and : [
                {admin : 0},
                {signupaffiliate: 1},
                {parent:req.query.username}
            ]
        };
    }


    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/ambassadorlist',function(req,resp){
    var collection= db.collection('ambassadorview');
    var cond = {};
    cond = {
        $and : [
            {admin : 0},
            {ambassador: 1}
        ]
    };

    if(req.query.username != ''){
        cond = {
            $and : [
                {admin : 0},
                {ambassador: 1},
                {parent:req.query.username}
            ]
        };
    }


    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/musicianlist',function(req,resp){
    var collection= db.collection('userview');
    var cond = {};
    cond = {
        $and : [
            {admin : 0},
            {musicians: 1}
        ]
    };

    if(req.query.username != ''){
        cond = {
            $and : [
                {admin : 0},
                {musicians: 1},
                {parent:req.query.username}
            ]
        };
    }


    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/dancerlist',function(req,resp){
    var collection= db.collection('userview');
    var cond = {};
    cond = {
        $and : [
            {admin : 0},
            {dancer: 1}
        ]
    };

    if(req.query.username != ''){
        cond = {
            $and : [
                {admin : 0},
                {dancer: 1},
                {parent:req.query.username}
            ]
        };
    }


    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/modellist',function(req,resp){
    var collection= db.collection('userview');
    var cond = {};
    cond = {
        $and : [
            {admin : 0},
            {model: 1}
        ]
    };

    if(req.query.username != ''){
        cond = {
            $and : [
                {admin : 0},
                {model: 1},
                {parent:req.query.username}
            ]
        };
    }


    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/fanlist',function(req,resp){
    var collection= db.collection('userview');
    var cond = {};
    cond = {
        $and : [
            {admin : 0},
            {fan: 1}
        ]
    };

    if(req.query.username != ''){
        cond = {
            $and : [
                {admin : 0},
                {fan: 1},
                {parent:req.query.username}
            ]
        };
    }


    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/communityuserlist',function(req,resp){
    var collection= db.collection('userview');
    var cond = {};
    cond = {
        $and : [
            {admin : 0},
            {$or: [
                    {musicians : 1},
                    {dancer : 1},
                    {model : 1},
                    {fan : 1},
                ]}
        ]
    };

    if(req.query.username != ''){
        cond = {
            $and : [
                {admin : 0},
                {$or: [
                        {musicians : 1},
                        {dancer : 1},
                        {model : 1},
                        {fan : 1},
                    ]},
                {parent:req.query.username}
            ]
        };
    }


    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/userlist',function(req,resp){
    var collection= db.collection('userview');
    var cond = {};
    cond = {
        $and : [
            {admin : 0},
            {signupaffiliate: {$ne:1}},
            {ambassador:  {$ne:1}},
            {musicians:  {$ne:1}},
            {dancer:  {$ne:1}},
            {model:  {$ne:1}},
            {fan:  {$ne:1}}
        ]
    };

    if(req.query.username != ''){
        cond = {
            $and : [
                {admin : 0},
                {signupaffiliate:  {$ne:1}},
                {ambassador:  {$ne:1}},
                {musicians:  {$ne:1}},
                {dancer:  {$ne:1}},
                {model:  {$ne:1}},
                {fan:  {$ne:1}},
                {parent:req.query.username}
            ]
        };
    }

    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });

});

app.get('/cngstatus',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.update({_id: o_id}, {$set: {status: parseInt(req.query.status)}},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});

app.get('/deleteuser',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.deleteOne({_id: o_id}, function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'failed'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/updateuser',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.update({_id: o_id}, {$set: {
            firstname: req.query.firstname,
            lastname: req.query.lastname,
            phone: req.query.phone,
            address: req.query.address,
            address2: req.query.address2,
            city: req.query.city,
            state: req.query.state,
            zip: req.query.zip,
        }},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});

app.post('/updateusertwiiterfeed',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.body.id);
    collection.update({_id: o_id}, {$set: {
            twitterfeed: req.body.feed,
        }},function(err, results) {
        resp.send(JSON.stringify({'status':'success on twitter update !!'}));
    });
});
app.post('/updateusertwiiterfollowercount',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.body.id);
    collection.update({_id: o_id}, {$set: {
            twitterfollowercount: req.body.followers_count,
        }},function(err, results) {
        resp.send(JSON.stringify({'status':'success on twitter update !!'}));
    });
});

app.get('/changepassword',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.query._id);
    var crypto = require('crypto');
    var secretold = req.query.oldpassword;
    var hashold = crypto.createHmac('sha256', secretold)
        .update('password')
        .digest('hex');
    var secret = req.query.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    collection.find({ _id:o_id }).toArray(function(err, items){
        if(err){
            resp.send(JSON.stringify({'status':'error','msg':'Database Error. Try Again.'}));
            return;
        }else if(items[0].password!=hashold){
            resp.send(JSON.stringify({'status':'error','msg':'Password Does not match'}));
            return;
        }else{
            collection.update({_id: o_id}, {$set: {password: hash}},function(err, results) {
                resp.send(JSON.stringify({'status':'success'}));
            });
        }
    });
});


app.get('/csvimport', function (req, resp) {
    var file = "../uploadfiles/DiscoveryCapitalInfluencerList_3.76K_FULL_REPORT.csv";

    var rl = readline.createInterface({
        input: fs.createReadStream(file),
        output: null,
        terminal: false
    })

    var x = 0;
    rl.on("line", function(line) {
        var linearr = line.split(",");
        /*var collection = db.collection('csvdata');
        collection.insert([{
            email: linearr[0]
        }], function (err, result) {
            x++;
            console.log(x);
        });*/
    });

    rl.on("close", function() {
        resp.send(JSON.stringify({'status':'success'}));
    });
});

app.get('/csvlist',function(req,resp){
    var collection= db.collection('csvdata');
    collection.find().toArray(function(err, items){
        resp.send(JSON.stringify(items));
    });
});


app.get('/getDetailsByUsername',function(req,resp){
    var resitem = {};
    var collection = db.collection('user');
    collection.find({username:req.query.username}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});


app.get('/updateAccesstoken',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.update({_id: o_id}, {$set: {fb_access_token: req.query.access_token,fb_access_token_expire_in: (moment().unix()+parseInt(req.query.expires_in))}},function(err, results) {
        collection.find({ _id: o_id }).toArray(function(err, items){
            if(items.length==0){
                resp.send(JSON.stringify({'status':'error','msg':'Username invalid...'}));
                return;
            }else{
                resp.send(JSON.stringify({'status':'success','msg':items[0]}));
                return;
            }
        });
    });
});

app.get('/contractagrrement',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.update({_id: o_id}, {$set: {agreement: 1, sign: req.query.sign,agreement_time: (moment().unix())}},function(err, results) {
        collection.find({ _id: o_id }).toArray(function(err, items){
            if(items.length==0){
                resp.send(JSON.stringify({'status':'error','msg':'Invalid id...'}));
                return;
            }else{
                resp.send(JSON.stringify({'status':'success','msg':items[0]}));
                return;
            }
        });
    });
});

app.get('/addNoOfClick',function(req,resp){
    var collection= db.collection('user');
    collection.update({username: req.query.username}, { $inc: { noofclick: 1 } },function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
        return;
    });
});

app.get('/addMediaNoOfClick',function(req,resp){
    var collection= db.collection('media');
    collection.update({name: req.query.mediaid}, { $inc: { noofclick: 1 } },function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
        return;
    });
});


app.get('/allblog',function(req,resp){
    var collection= db.collection('blog');
    collection.find().toArray(function(err, items){
        resp.send(JSON.stringify(items));
    });
});

app.get('/bloglist',function(req,resp){
    var collection= db.collection('blogview');
    collection.find().toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});


app.get('/addblog',function(req,resp){
    var o_id = new mongodb.ObjectID(req.query.userid);
    var collection= db.collection('blog');
    collection.insert([{
        title: req.query.title,
        description: req.query.description,
        videos: req.query.videos,
        images: req.query.images,
        added_by:o_id,
        added_time: moment().unix(),
        status: 1
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status': 'failed'}));
        } else {
            resp.send(JSON.stringify({'status': 'success'}));
        }
    });
});

app.get('/forgotpassword', function (req, resp) {
    var collection = db.collection('user');

    collection.find({ email:req.query.email}).toArray(function(err, items){
        if(items.length==0){
            resp.send(JSON.stringify({'status':'error','msg':'Email ID Does Not Exist'}));
            return;
        }else{
            var randomString1 = require('random-string');
            var randomcode= randomString1({length: 20, special: false});
            collection.update({ email:req.query.email}, {$set: {accesscode:randomcode}});

            var smtpTransport = mailer.createTransport("SMTP", {
                service: "Gmail",
                auth: {
                    user: "itplcc40@gmail.com",
                    pass: "DevelP7@"
                }
            });
            var resetlink = 'https://audiodeadline.com/resetpassword/'+randomcode;
            var mail = {
                from: "Admin <itplcc40@gmail.com>",
                to: req.query.email,
                subject: 'Please reset your password [Audiodeadline.com]',
                html: '<p>Hello,</p>' + '<p>We heard that you lost your GitHub password. Sorry about that!</p>' + '<P>But don\'t worry! You can use the following link to reset your password: </p>' + '<p><a href="' + resetlink + '">' + resetlink + '</a><p></p><p>Thanks </P>'
            }

            smtpTransport.sendMail(mail, function (error, response) {
                smtpTransport.close();
            });

            resp.send(JSON.stringify({'status':'success','msg':'Please check your mail. And reset your password.'}));
            return;
        }
    });
});

app.get('/resetpassword', function (req, resp) {
    var collection= db.collection('user');
    var crypto = require('crypto');
    var secret = req.query.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    collection.find({ accesscode:req.query.accesscode }).toArray(function(err, items){
        if(err){
            resp.send(JSON.stringify({'status':'error','msg':'Database Error. Try Again.'}));
            return;
        }else{

            collection.update({ accesscode:req.query.accesscode}, {$set: {password: hash}},function(err, results) {
                collection.update({ email:items[0].email}, {$set: {accesscode: ''}});
                resp.send(JSON.stringify({'status':'success'}));
            });
        }
    });
});

app.get('/chkaccesscode', function (req, resp) {
    var collection= db.collection('user');

    collection.find({ accesscode:req.query.accesscode }).toArray(function(err, items){
        if(err){
            resp.send(JSON.stringify({'status':'error','msg':'Database Error. Try Again.'}));
            return;
        }else{
            if(items.length > 0){
                resp.send(JSON.stringify({'status':'success','msg':''}));
                return;
            }else{
                resp.send(JSON.stringify({'status':'error','msg':'Database Error. Try Again.'}));
                return;
            }
        }
    });
});

app.get('/affiliatereportlist', function (req, resp) {
    var collection= db.collection('affiliatereportview');

    collection.find().toArray(function(err, items){
        if(items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }
        if(items.length>0){
            resp.send(JSON.stringify({'res':items}));
        }
    });
});


app.get('/changerole',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.query._id);

    var data = {};
    if(req.query.type == 'musicians')
        data = {'musicians': parseInt(req.query.tval)};
    if(req.query.type == 'dancer')
        data = {'dancer': parseInt(req.query.tval)};
    if(req.query.type == 'model')
        data = {'model': parseInt(req.query.tval)};
    if(req.query.type == 'signupaffiliate')
        data = {'signupaffiliate': parseInt(req.query.tval)};
    if(req.query.type == 'fan')
        data = {'fan': parseInt(req.query.tval)};

    collection.update({_id: o_id}, {$set: data},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});

app.get('/genrelist',function(req,resp){
    var collection= db.collection('genreview');
    var cond = {};
    var orobj = [];

    if(req.query.type == 'active'){
        if(req.query.musicians == 1){
            orobj.push({'type':'Musician'});
        }
        if(req.query.model == 1){
            orobj.push({'type':'Model'});
        }
        if(req.query.dancer == 1){
            orobj.push({'type':'Dancer'});
        }

        cond = {
            $and : [
                {status : 1},
                {$or: orobj}
            ]
        };
    }
    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/genretrendinglist',function(req,resp){
    var collection= db.collection('genre');
    var cond = {};

        cond =  {status : 1};

    collection.find(cond).toArray(function(err, items) {
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }

    });

});


/*
app.get('/statetrendinglist', function (req,resp) {

    var collection = db.collection('states');
    var cond = {};
    cond = {status : 1};
    collection.find(cond).toArray(function (err,items) {
        if(err || items.length==0){

            resp.send(JSON.stringify({'res':[]}));
        }
        else{

            resp.send(JSON.stringify({'res':items}));
        }

    })

});
*/


app.get('/addgenre',function(req,resp){
    var collection= db.collection('genre');
    collection.find({genrename:req.query.genrename}).toArray(function(err,items){
        if(items.length > 0){
            resp.send(JSON.stringify({'status':'error','msg':'This genre is already exist..!'}));
        }else{
            collection.insert([{
                genrename: req.query.genrename,
                type: req.query.type,
                added_time: moment().unix(),
                status: 1
            }], function (err, result) {
                if (err) {
                    resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
                } else {
                    resp.send(JSON.stringify({'status': 'success'}));
                }
            });
        }
    });
});


app.get('/cngstatusgenre',function(req,resp){
    var collection= db.collection('genre');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.update({_id: o_id}, {$set: {status: parseInt(req.query.status)}},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});

app.get('/deletegenre',function(req,resp){
    var collection= db.collection('genre');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.deleteOne({_id: o_id}, function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'failed'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/genredetails',function(req,resp){
    var resitem = {};
    var collection = db.collection('genre');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.find({_id:o_id}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':resitem}));
        }
    });
});

app.get('/updategenre',function(req,resp){
    var collection= db.collection('genre');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.update({_id: o_id}, {$set: {
            genrename: req.query.genrename,
            type: req.query.type,
        }},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});


app.get('/signup2',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.query._id);
    var genre = '';
    if(req.query.genre != ''){
        genre = new mongodb.ObjectID(req.query.genre);
    }

    var data = {
        realname: req.query.realname,
        alias: req.query.alias,
        gender: req.query.gender,
        genre: genre,
        ethnicity: req.query.ethnicity,
        ability: req.query.ability,
        bio: req.query.bio,
        city: req.query.city,
        address: req.query.address,
        state: req.query.state,
        zip: req.query.zip,
        images: req.query.images,
        experience: req.query.experience,
        website: req.query.website
    }
    var x,x1;
    var collection1= db.collection('usergenre');

    for(x in req.query.musicgenre){

        collection1.insert([{
            genreid: new mongodb.ObjectID(req.query.musicgenre[x]),
            userid: o_id,

        }], function (err, result) {
            if (err) {
                //resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
            } else {
                //resp.send(JSON.stringify({'status': 'success'}));
            }
        });
    }
    for(x in req.query.dancergenre){

        collection1.insert([{
            genreid: new mongodb.ObjectID(req.query.dancergenre[x]),
            userid: o_id,

        }], function (err, result) {
            if (err) {
                //resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
            } else {
                //resp.send(JSON.stringify({'status': 'success'}));
            }
        });
    }

    collection.update({_id: o_id}, {$set: data},function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'error'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});


app.get('/editprofiledetails',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.query._id);
    var genre = '';
    if(req.query.genre != ''){
        genre = new mongodb.ObjectID(req.query.genre);
    }

    var data = {
        realname: req.query.realname,
        firstname: req.query.firstname,
        lastname: req.query.lastname,
        email: req.query.email,
        username: req.query.username,
        phone: req.query.phone,
        alias: req.query.alias,
        gender: req.query.gender,
        genre: genre,
        ethnicity: req.query.ethnicity,
        ability: req.query.ability,
        bio: req.query.bio,
        city: req.query.city,
        address: req.query.address,
        state: req.query.state,
        zip: req.query.zip,
        images: req.query.images,
        experience: req.query.experience,
        website: req.query.website
    }
    var x,x1;
    var collection1= db.collection('usergenre');
    collection1.remove({ userid: o_id });
    for(x in req.query.musicgenre){

        collection1.insert([{
            genreid: new mongodb.ObjectID(req.query.musicgenre[x]),
            userid: o_id,

        }], function (err, result) {
            if (err) {
                //resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
            } else {
                //resp.send(JSON.stringify({'status': 'success'}));
            }
        });
    }
    for(x in req.query.dancergenre){

        collection1.insert([{
            genreid: new mongodb.ObjectID(req.query.dancergenre[x]),
            userid: o_id,

        }], function (err, result) {
            if (err) {
                //resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
            } else {
                //resp.send(JSON.stringify({'status': 'success'}));
            }
        });
    }

    collection.update({_id: o_id}, {$set: data},function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'error'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});


/*app.get('/addacctoken',function(req,resp){
    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID('5b6c0c0d7fb62cc83631664e');
    collection.update({_id: o_id}, {$set: {added_time: moment().unix(),admin: 0}},function(err, results) {
        console.log(1);
    });
    collection.deleteOne({_id: o_id}, function(err, results) {
        console.log(1);
    });
    collection.find().toArray(function(err, items){
        for(n in items){
            var o_id = new mongodb.ObjectID(items[n]._id);
            collection.update({_id: o_id}, {$set: {fb_access_token:'',fb_access_token_expire_in: ''}},function(err, results) {
                console.log(1);
            });
        }
    });

});*/

//added by chandrani

app.get('/updateProfileImg',function(req,resp){


    var collection= db.collection('user');
    var o_id = new mongodb.ObjectID(req.query.userid);
    collection.update({_id: o_id}, {$set: {images: req.query.images}},function(err, results) {

        resp.send(JSON.stringify({'status':'success'}));
    });
});



app.get('/getVideoListByUserid',function(req,resp){


    var collection = db.collection('uservideolistView');
    collection.find({user_id:new mongodb.ObjectID(req.query.user_id)}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            // resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});

app.get('/trendingVideoList',function(req,resp){


    var collection = db.collection('uservideolistView');
    collection.find({privacy:"public"}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            // resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});
app.get('/trendingPictureList',function(req,resp){


    var collection = db.collection('userpicturelistView');
    collection.find({privacy:"public"}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            // resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});
app.get('/trendingMusicList',function(req,resp){


    var collection = db.collection('usermusiclistView');
    collection.find({privacy:"public"}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            // resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});



app.get('/getPictureListByUserid',function(req,resp){


    var collection = db.collection('userpicturelistView');
    collection.find({user_id:new mongodb.ObjectID(req.query.user_id)}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            // resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});

app.get('/getMusiclistByUserid', function (req,resp) {
    var collection = db.collection('usermusiclistView');
    collection.find({user_id:new mongodb.ObjectID(req.query.user_id)}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            // resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });

});

app.get('/getLinkListByUserid',function(req,resp){


    var collection = db.collection('userlinklistView');
    collection.find({user_id:new mongodb.ObjectID(req.query.user_id)}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            // resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});
app.get('/getPlaylistByUserid',function(req,resp){


    var collection = db.collection('playlist');
    collection.find({user_id:new mongodb.ObjectID(req.query.user_id)}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            // resitem = items[0];
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});




app.get('/addvideos',function(req,resp){
    var collection= db.collection('video');

    collection.insert([{
        title: req.query.title,
        type: req.query.type,
        privacy: req.query.privacy,
        added_time: moment().unix(),
        videoUrl: req.query.videoUrl,
        accepttermscond: req.query.accepttermscond,
        status: 1,
        user_id:  new mongodb.ObjectID(req.query.user_id)
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status': 'success'}));
        }
    });
});
app.get('/addplaylist',function(req,resp){
    var collection= db.collection('playlist');

    collection.insert([{
        playlist_name: req.query.playlist_name,
        type: req.query.type,
        added_time: moment().unix(),
        user_id:  new mongodb.ObjectID(req.query.user_id)
    }], function (err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status': 'success','item':items}));
        }
    });
});

app.get('/addpics', function (req,resp) {

    var collection= db.collection('pictures');

    collection.insert([{
        title_pic: req.query.title_pic,
        desc_pic: req.query.desc_pic,
        privacy: req.query.privacy,
        added_time: moment().unix(),
        status: 1,
        image_pic:req.query.image_pic,
        user_id:  new mongodb.ObjectID(req.query.user_id)
    }], function (err, item) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status': 'success','item':item}));
        }
    });

});

app.get('/addcomment', function (req,resp) {

    var collection = db.collection('comment');
    collection.insert([{

        post_id: new mongodb.ObjectID(req.query.post_id),
        user_id: new mongodb.ObjectID(req.query.user_id),
        added_time: moment().unix(),
        parents_id:0,
        comment: req.query.comment,

    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {

            var collection1 = db.collection('commentview');
            collection1.find({post_id:new mongodb.ObjectID(req.query.post_id)}).toArray(function(err, items) {
                if (err) {
                    resp.send(JSON.stringify({'status':'error','id':0}));
                } else {
                    // resitem = items[0];
                    resp.send(JSON.stringify({'status':'success','item':items}));
                    return;
                }
            });
            // /resp.send(JSON.stringify({'status': 'success','item':items}));
        }
    });

});

app.get('/addmusics', function (req,resp) {

    var collection= db.collection('music');

    collection.insert([{
        title_music: req.query.title_music,
        privacy: req.query.privacy,
        added_time: moment().unix(),
        status: 1,
        music:req.query.music,
        accepttermscond:req.query.accepttermscond,
        user_id:  new mongodb.ObjectID(req.query.user_id)
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status': 'success'}));
        }
    });

});

app.get('/addvideoviews',function(req,resp){
    //var collection= db.collection('videoviews');
    var added_time= moment().unix();

    var collection = db.collection('videoviews');
    collection.deleteOne({user_id:new mongodb.ObjectID(req.query.user_id),videoid:new mongodb.ObjectID(req.query.videoid),added_time:added_time}, function(err, results) {
        if(err){
            //resp.send(JSON.stringify({'status':'failed'}));
        }else{
            //resp.send(JSON.stringify({'status':'success'}));
        }
    });
    collection.find({user_id:new mongodb.ObjectID(req.query.user_id),videoid:new mongodb.ObjectID(req.query.videoid),added_time:added_time}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            // resitem = items[0];
            //resp.send(JSON.stringify({'status':'success','item':items}));
            if(items.length==0){

                collection.insert([{
                    //title: req.query.title,
                    //type: req.query.type,
                    added_time: added_time,
                    //videoUrl: req.query.videoUrl,
                    videoid: new mongodb.ObjectID(req.query.videoid),
                    user_id:  new mongodb.ObjectID(req.query.user_id)
                }], function (err, result) {
                    if (err) {
                        resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
                    } else {
                        resp.send(JSON.stringify({'status': 'success'}));
                    }
                });

            }
        }
    });;



});


app.get('/addpicview',function(req,resp){
    //var collection= db.collection('videoviews');
    var added_time= moment().unix();

    var collection = db.collection('picviews');

    collection.insert([{

        added_time: added_time,
        pic_id: new mongodb.ObjectID(req.query._id),
        user_id:  new mongodb.ObjectID(req.query.user_id)
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status': 'success'}));
        }
    });


});


app.get('/addmusicview',function(req,resp){
    //var collection= db.collection('videoviews');
    var added_time= moment().unix();

    var collection = db.collection('musicviews');

    collection.insert([{

        added_time: added_time,
        music_id: new mongodb.ObjectID(req.query._id),
        user_id:  new mongodb.ObjectID(req.query.user_id)
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status': 'success'}));
        }
    });


});



app.get('/addvideolike',function(req,resp){

    var added_time= moment().unix();

    var collection = db.collection('videolikes');

    collection.insert([{

        added_time: added_time,
        videoid: new mongodb.ObjectID(req.query.videoid),
        user_id:  new mongodb.ObjectID(req.query.user_id)
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status': 'success'}));
        }
    });


});


app.get('/deletevideolike',function (req,resp) {

    var added_time= moment().unix();
    var collection = db.collection('videolikes');
  /*  collection.remove({ user_id:new mongodb.ObjectID(req.query.user_id), videoid:new mongodb.ObjectID(req.query.videoid) });*/
    /*collection.remove({ user_id:new mongodb.ObjectID(req.query.user_id)});*/
    collection.remove( { user_id: new mongodb.ObjectID(req.query.user_id) , videoid: new mongodb.ObjectID(req.query.videoid) }, true );
    resp.send(JSON.stringify({'status': 'success'}));





});


app.get('/deleteVideoByID',function(req,resp){
    var collection= db.collection('video');
    var o_id = new mongodb.ObjectID(req.query.id);
    collection.deleteOne({_id: o_id}, function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'failed'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/deletePicByID',function(req,resp){
    var collection= db.collection('pictures');
    var o_id = new mongodb.ObjectID(req.query.id);
    collection.deleteOne({_id: o_id}, function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'failed'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/deleteLinkByID',function(req,resp){
    var collection= db.collection('links');
    var o_id = new mongodb.ObjectID(req.query.id);
    collection.deleteOne({_id: o_id}, function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'failed'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});
app.get('/deleteMusicByID',function(req,resp){
    var collection= db.collection('music');
    var o_id = new mongodb.ObjectID(req.query.id);
    collection.deleteOne({_id: o_id}, function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'failed'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});


app.get('/addlinks',function(req,resp){
    var collection= db.collection('links');

    collection.insert([{

        added_time: moment().unix(),
        linkUrl: req.query.linkUrl,
        privacy: req.query.privacy,
        title: req.query.title,
        image: req.query.image,
        desc: req.query.desc,
        status: 1,
        user_id:  new mongodb.ObjectID(req.query.user_id)
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status': 'success'}));
        }
    });
});



app.get('/userfriendlist',function (req,resp) {

    var collection = db.collection('userfriendcollection');
    collection.insert([{

        friend_id:  new mongodb.ObjectID(req.query.friend_id),
        friend_by:  new mongodb.ObjectID(req.query.user_id),
        type: req.query.type,
        added_time: moment().unix(),
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','item':0}));
        } else {

            resp.send(JSON.stringify({'status':'success','item':result}));
            return;
        }
    });
});

app.get('/deleteUserFriendListByUserId',function(req,resp){
    var collection= db.collection('userfriendcollection');
    var cond = {};
    cond = {
        $and : [
            {friend_id : new mongodb.ObjectID(req.query.friend_id)},
            {friend_by:new mongodb.ObjectID(req.query.user_id)}

        ]
    };
    collection.deleteOne(cond, function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'failed','item':0}));
        }else{
            resp.send(JSON.stringify({'status':'success','item':results}));
        }
    });
});

app.get('/checkuserfriendrelations',function (req,resp) {
    resp.send(JSON.stringify({'status':'123','item':98}));
    return;
});
app.get('/checkuserfriendrelation',function (req,resp) {
    var collection= db.collection('userfriendcollection');
    var cond = {};
  /*  cond={
        $or:[

           [ {friend_id : new mongodb.ObjectID(req.query.friend_id)},
            {friend_by : new mongodb.ObjectID(req.query.user_id)}],

            [ {friend_id : new mongodb.ObjectID(req.query.user_id)},
                {friend_by : new mongodb.ObjectID(req.query.friend_id)}],

        ]

    };*/

    cond = {
        $or: [
            {$and: [
                {friend_id : new mongodb.ObjectID(req.query.friend_id)},
                {friend_by : new mongodb.ObjectID(req.query.user_id)}
            ]},
            {$and: [
                {friend_id : new mongodb.ObjectID(req.query.friend_id)},
                {friend_by : new mongodb.ObjectID(req.query.user_id)}
            ]}
        ]
    };
    collection.find(cond).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'status':'error','item':[]}));
        } else {
            resp.send(JSON.stringify({'status':'success','item':items.length}));
        }
    });
});

app.get('/editvideos',function(req,resp){
    var collection= db.collection('video');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.update({_id: o_id}, {$set: {
        title: req.query.title,
        type: req.query.type,
        privacy: req.query.privacy,
        added_time: moment().unix(),
        videoUrl: req.query.videoUrl,
        status: 1,
        accepttermscond:req.query.accepttermscond,
    }},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});


app.get('/editmusics',function(req,resp){
    var collection= db.collection('music');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.update({_id: o_id}, {$set: {
        title_music: req.query.title_music,
        privacy: req.query.privacy,
        added_time: moment().unix(),
        music: req.query.music,
        accepttermscond: req.query.accepttermscond,
        status: 1,
    }},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});

app.get('/editpics',function(req,resp){
    var collection= db.collection('pictures');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.update({_id: o_id}, {$set: {
        title_pic: req.query.title_pic,
        desc_pic: req.query.desc_pic,
        privacy: req.query.privacy,
        added_time: moment().unix(),
        status: 1,
        image_pic:req.query.image_pic,
    }},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});

app.get('/editlinks',function(req,resp){
    var collection= db.collection('links');
    var o_id = new mongodb.ObjectID(req.query._id);
    collection.update({_id: o_id}, {$set: {
        added_time: moment().unix(),
        linkUrl: req.query.linkUrl,
        privacy: req.query.privacy,
        title: req.query.title,
        image: req.query.image,
        desc: req.query.desc,
        status: 1,
    }},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});



app.get('/addlinkview',function(req,resp){
    var collection= db.collection('linkview');

    collection.insert([{

        added_time: moment().unix(),
        user_id:  new mongodb.ObjectID(req.query.user_id),
        linkid:  new mongodb.ObjectID(req.query.id)
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            var collection1 = db.collection('userlinklistView');
            collection1.find({_id:new mongodb.ObjectID(req.query.id)}).toArray(function(err, items) {
                if (err) {
                    resp.send(JSON.stringify({'status':'error','id':0}));
                } else {
                    // resitem = items[0];
                    resp.send(JSON.stringify({'status':'success','item':items}));
                }
            });
        }
    });
});

app.get('/getusergenredetail', function (req,resp) {

    var collection = db.collection('usergenre');
    collection.find({userid:new mongodb.ObjectID(req.query.user_id)}).toArray(function (err,items) {
            if(err){
                resp.send(JSON.stringify({'status':'error','id':0}));

            }   else{

                resp.send(JSON.stringify({'status':'success','item':items}));
            }
    });

});

app.get('/trendingArtistList',function (req,resp) {

    var collection = db.collection('userview_trending');
    var cond = {};
    cond = {
        $and : [
            {admin : 0},
            {$or: [
                {musicians : 1},
                {dancer : 1},
                {model : 1},

            ]}
        ]
    };

    collection.find(cond).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'status':'error','id':[]}));
        } else {
            resp.send(JSON.stringify({'status':'success','id':items}));
        }
    });

});

app.get('/userfanlist',function (req,resp) {

   /* resp.send(JSON.stringify({'status':'success','item':09,'t':3}));
    return;*/

    var collection = db.collection('userview_trending');
    var cond = {};
    cond = {
        $and : [
            {admin : 0},


                {fan:1},

        ]
    };
    collection.find(cond).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'status':'error','item':[]}));
        } else {
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });

});

app.get('/twitter',function(req,resp){
    var collection = db.collection('user');
    var user_id = new mongodb.ObjectID(req.query.logid);
    collection.find({_id:user_id}).toArray(function(err, items) {
        if(items.length>0){

            var data = {
                twitter_oauth_token: req.query.oauth_token,
                twitter_oauth_token_secret: req.query.oauth_token_secret,
                twitter_timelineid: req.query.timelineid,
                twitter_timelineurl: req.query.timelineurl,
            };

            /*collection.update({_id: o_id}, {$set: data},function(err, results) {
                resp.send(JSON.stringify({'status':'success'}));
            });*/
            collection.update({_id:user_id}, {$set: data}, true, true);
            //  resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id}));
            resp.send(JSON.stringify(items));

        }
    });
});

app.get('/twitterfeedusers', function (req,resp) {

    var collection = db.collection('user');


        collection.find({twitter_oauth_token: {$exists: true},twitter_oauth_token_secret: {$exists: true}}).toArray(function(err, items) {
            if (err) {
                console.log(err);
                resp.send(JSON.stringify({'status':'error','item':[]}));
            } else {
                resp.send(JSON.stringify({'status':'success','item':items,'itemcount':items.length}));
            }
        });


});


app.get('/usergetinstatoken',function(req,resp){
    var collection = db.collection('user');
    var user_id = new mongodb.ObjectID(req.query.userid);
    //resp.send(JSON.stringify(req.query));
    //return;
    collection.find({_id:user_id}).toArray(function(err, items) {
        if(items.length>0){

            var data = {
                insta_access_token:req.query.access_token,
                insta_followers_count:req.query.followers_count,
                instausername:req.query.instausername,
                instauserid:req.query.instauserid,

            };

            /*collection.update({_id: o_id}, {$set: data},function(err, results) {
                resp.send(JSON.stringify({'status':'success'}));
            });*/
            collection.update({_id:user_id}, {$set: data}, true, true);
            //  resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id}));
            resp.send(JSON.stringify(items));

        }
    });
});
app.get('/addfacebookpageinfo',function(req,resp){
    var collection = db.collection('user');
    var user_id = new mongodb.ObjectID(req.query.user_id);
    collection.find({_id:user_id}).toArray(function(err, items) {
        if(items.length>0){

            var data = {

                facebookpage:req.query.facebookpage,
                accepttermscond:req.query.accepttermscond,

            };

            collection.update({_id:user_id}, {$set: data}, true, true);

            resp.send(JSON.stringify({'status':'success','item':data,'itemcount':data.length}));

        }



    });
});

app.get('/fanlikeitemlist', function (req,resp) {

    var collection = db.collection('likeview_for_fan');
    var user_id = new mongodb.ObjectID(req.query.user_id);


    collection.find({user_id:user_id}).toArray(function(err, items){

        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'status':'error','item':[]}));
        } else {
            resp.send(JSON.stringify({'status':'success','item':items,'itemcount':items.length}));
        }

    });

});
/*for single post feed*/
app.get('/getmusicdetailsbyid',function (req,resp) {

    var collection = db.collection('usermusiclistView');
    var music_id = new mongodb.ObjectID(req.query.music_id);
    collection.find({_id:music_id}).toArray(function (err,items) {

        if(err){
            console.log(err);
            resp.send(JSON.stringify({'status':'error','item':[]}));
        }
        else {
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});

app.get('/getvideodetailsbyid',function (req,resp) {

    var collection = db.collection('uservideolistView');
    var video_id = new mongodb.ObjectID(req.query.video_id);
    collection.find({_id:video_id}).toArray(function (err,items) {

        if(err){
            console.log(err);
            resp.send(JSON.stringify({'status':'error','item':[]}));
        }
        else {
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});

app.get('/getpicturedetailsbyid',function (req,resp) {

    var collection = db.collection('userpicturelistView');
    var image_id = new mongodb.ObjectID(req.query.image_id);
    collection.find({_id:image_id}).toArray(function (err,items) {

        if(err){
            console.log(err);
            resp.send(JSON.stringify({'status':'error','item':[]}));
        }
        else {
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});

app.get('/getlinkdetailsbyid',function (req,resp) {

    var collection = db.collection('userlinklistView');
    var link_id = new mongodb.ObjectID(req.query.link_id);
    collection.find({_id:link_id}).toArray(function (err,items) {

        if(err){
            console.log(err);
            resp.send(JSON.stringify({'status':'error','item':[]}));
        }
        else {
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});

app.get('/getsearchedvalue', function(req,resp){

    var collection = db.collection('userview_trending');
    var searchquery={};
    searchquery['fan']=parseInt(req.query.fan);     //convert string into integer
    // searchquery['fan']=1;
    if(typeof(req.query.state)!='undefined' ) {
        searchquery['state'] = {$in: req.query.state};
    }
    if(typeof(req.query.zip)!='undefined' ) {
        searchquery['zip'] = {$in: req.query.zip};
    }
    if(typeof(req.query.city)!='undefined' ) {
        searchquery['city'] = {$in: req.query.city};
    }
    // resp.send(JSON.stringify({'status':'error','item':searchquery}));
    // return;

    collection.find((searchquery)).toArray(function (err,items) {

        if(err){
            console.log(err);
            resp.send(JSON.stringify({'status':'error','item':[]}));
        }
        else {
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });

    /*collection.aggregate([
        {
            $match: {
                $and: [

                    searchquery
                ]
            }
        }
    ]).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify(items));
        }
    });*/

});



var server = app.listen(port,'audiodeadline.com', function () {
    var host = server.address().address;
    var port = server.address().port;
});