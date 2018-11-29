var fs = require("fs"), readline = require("readline");
var express = require('express');
var app = express();
var port = process.env.PORT || 3007;
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
        extended: false
    })
);

var datetimestamp='';
var filename='';
var EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
emitter.setMaxListeners(0);

app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(function(req, res, next) {
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
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        filename=file.originalname.split('.')[0].replace(' ','') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, filename);
    }
});

var upload = multer({
    storage: storage
}).single('file');

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
                            commission:0
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

                                if(typeof (req.query.fan) != 'undefined'){

                                    var mail = {
                                        from: "Admin <itplcc40@gmail.com>",
                                        to: req.query.email,
                                        subject: 'You are officially signed up for the ArtistXP.com pre-launch!',
                                        html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Artist XP</title></head><body><div style="max-width: 600px; margin: 0 auto;"><div style=" background:  #07031c; padding: 15px; text-align: center; font-family: Arial; font-size: 22px; color: #fff; text-transform: uppercase;"><img src="https://audiodeadline.com/assets/images/artistlogofooter.png"  alt="#" style="display: block; margin: 0 auto; width: 60%; margin-bottom: 6px;">You are officially signed up for the ArtistXP.com pre-launch!</div><div style="border-bottom: solid 5px #07031c;"><img src="https://audiodeadline.com/assets/images/artistxp_mail_img.jpg" alt="#" style="display: block; margin: 0 auto; width: 100%;"></div><div style="background: #e4e8f2; padding:20px 10px; text-align: center; font-family:Arial; "><p style="margin: 0; padding:0; line-height: 30px; color: #1c2831; font-size: 22px; text-transform: uppercase; font-weight: bold; ">Our social experience is bringing artists to the forefront and you will be one of the early adapters that know once we go live!</p></div><div style="background: #090c13; padding:20px 20px; text-align: center; font-family:Arial; "><p style="font-size: 16px; color: #fff; line-height: 22px; margin: 0; padding: 0;">Be sure to share this link for other to sign up too <a href="http://artistxp.com" style="color: #ee680f;">artistxp.com</a> so we can give you credit if you are an affiliate or plan to join as one later on!<br/><br/>Our social network will be going live on November 30th, 2018.  You are currently pre-registered for your profile and we will email you the minute you can come in, complete and participate!</b></p></div><div style="background: #e4e8f2; padding:20px 25px; text-align: center; font-family:Arial; font-size: 16px; color: #1c2831; line-height: 24px; "><strong style="display: block; color: #070826; font-size: 24px; padding: 0 0 15px 0;"> WHAT HAPPENS ON ARTISTXP.COM IS EXCITING.</strong>Artists along with all the regular users access features you would expect from a complete social experience. This includes friending, inviting others to join, stream chat (like your Facebook wall) and instant messaging. We have several unique features to our platform as well such as play list management, voting opportunities and more.<br/><br/>One of the biggest things that sets us apart and makes ArtistXP a premier destination on the web is the Artist Appreciation and Interactive features. Fans and other artists show what they have liked as well as media they have saved from the Artists on their video and audio media playlists. These are visible to all their friends and gives additional exposure directly to the artists they love.</div><div style="background: #090c13; padding:20px 20px; text-align: center; font-family:Arial; "><p style="font-size: 16px; color: #fff; line-height: 22px; margin: 0; padding:0;">We have special events and a quarterly live streamed show, The AudioDeadline.com Experience, where musicians, models and dancers win a chance to participate.<b>THIS IS GOING TO BE THE BIGGEST THING IN THE MUSIC INDUSTRY!</b><br/><br/><b>Again,</b> be sure to share this link for other to sign up too  <a href="http://artistxp.com" style="color: #ee680f;">artistxp.com</a> so we can give you credit if you are an affiliate or plan to join as one later on!</p></div></div></body></html>'
                                    }

                                    smtpTransport.sendMail(mail, function (error, response) {
                                        smtpTransport.close();
                                    });

                                }
                                if(typeof (req.query.rsvp) != 'undefined'){

                                    var mail = {
                                        from: "Admin <itplcc40@gmail.com>",
                                        to: req.query.email,
                                        subject: 'WELCOME TO THE AUDIODEADLINE.COM EXPERIENCE LIVE STREAMING SHOW!',
                                        html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>audiodeadline</title></head><body><div style="max-width: 600px; margin: 0 auto;"><div style=" background:  #1c2831; padding: 15px; text-align: center; font-family: Arial; font-size: 22px; color: #fff; text-transform: uppercase;">WELCOME TO THE AUDIODEADLINE.COM EXPERIENCE LIVE STREAMING SHOW!</div><div><img src="https://audiodeadline.com/assets/images/audiodeadline_mailimg22.jpg" alt="#" style="display: block; margin: 0 auto; width: 100%;"></div><div style="background: #e4e8f2; padding:20px 10px; text-align: center; font-family:Arial; "><img src="https://audiodeadline.com/assets/images/logo.png"  alt="#" style="display: block; margin: 0 auto;"></div><div style="background: #ccd4dc; padding:20px 10px; text-align: center; font-size: 24px; text-transform: uppercase; font-family:Arial; font-weight: bold;">WHILE AUDIO DEADLINE IS STREAMING LIVE, THE ARTISTS ARE CREATING THEIR MUSIC AND FANS ARE VIRTUALLY RIGHT THERE IN THE STUDIO WITH THEM.<span style="font-size: 24px; display: block; padding-top: 20px; font-weight: normal;">OUR CELEBRITY, AWARD WINNING HOST, FLII STYLZ AND HIS BEAUTIFUL CO-HOST, THE INSTAGRAM SENSATION, SANDRA SAGO ARE EXCITED TO HAVE YOU ON BOARD!</span></div><div style="background: #1c2831; padding:20px 20px; text-align: center; font-family:Arial; "><p style="font-size: 18px; color: #fff; line-height: 26px; margin: 0; padding: 0 0 15px 0;"><b>You are RSVP’d and will get an alert on November 30th 2018 when the streaming tickets to the Audio Deadline show goes up for purchase.</b></p><div style="display: block; color:#0ebce7; margin: 0px; padding-bottom: 15px; font-weight: bold;  font-family:Arial; font-size: 18px;">Your sign in link: <a href="'+loginlink+'" target="_blank" style="font-weight: normal; color: #fff; padding-left: 10px;">'+loginlink+'</a></div><div style="display: block; color:#0ebce7; margin: 0px; padding-bottom: 15px; font-weight: bold; font-family:Arial; font-size: 18px;">Your username: <span style="font-weight: normal; color: #fff; padding-left: 10px;">'+email+'</span></div><div style="display: block; color:#0ebce7; margin: 0px; padding-bottom: 15px; font-weight: bold; font-family:Arial; font-size: 18px;">Your password: <span style="font-weight: normal; color: #fff; padding-left: 10px;">Password you put on time of registration (Hidden due to security)</span></div></div><div style="background: #e4e8f2; padding:20px 20px; text-align: center; font-family:Arial; font-size: 16px; color: #1c2831; line-height: 24px; border-bottom: solid 5px #1c2831; "><strong>You have also been signed up in pre-launch for www.ArtistXP.com, a new social network that we are launching right along with the AudioDeadline.com Experience. We will be taking this live on November 30th!</strong><br><br>We are building a massive online community of musicians, fans and excitement around our ground breaking and inspiring new online streaming show. The social network and share technology is all free to users and every quarter we have a live streaming event they can purchase streaming tickets as well as other commerce opportunities.<br/><br/><strong>We look forward to sharing all the excitement with you and we’ll see you on the AudioDeadline.com portal!</strong></div></body></html>'
                                    }

                                    smtpTransport.sendMail(mail, function (error, response) {
                                        smtpTransport.close();
                                    });
                                }

                                if((signupaffiliate == 1)){
                                    var mail = {
                                        from: "Admin <itplcc40@gmail.com>",
                                        to: req.query.email,
                                        subject: 'WELCOME TO THE AUDIODEADLINE.COM EXPERIENCE NEW AFFILIATE!',
                                        html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>audiodeadline</title></head><body><div style="max-width: 600px; margin: 0 auto;"><div style=" background: #ccd4dc; border-top: solid 5px #000; padding: 10px 0;"><img src="https://audiodeadline.com/assets/images/logo.png"  alt="#" style="display: block; margin: 0 auto;"><p style="padding: 25px 20px 0 20px; margin: 0px; text-align: center; font-size: 22px; color: #000; font-family: Arial; text-transform: uppercase;">WELCOME TO THE AUDIODEADLINE.COM EXPERIENCE NEW AFFILIATE!</p></div><div style="background: #ccd4dc;"><img src="https://audiodeadline.com/assets/images/audiodeadline_mailimg21.png" alt="#" style="display: block; margin: 0 auto; width: 100%;"></div><div style="background: #ccd4dc; padding:20px 10px; text-align: center; font-size: 24px; text-transform: uppercase; font-family:Arial; font-weight: bold;">WHILE AUDIO DEADLINE IS STREAMING LIVE, THE ARTISTS ARE CREATING THEIR MUSIC AND FANS ARE VIRTUALLY RIGHT THERE IN THE STUDIO WITH THEM.<span style="font-size: 24px; display: block; padding-top: 20px; font-weight: normal;">We have our Celebrity award winning host, Flii Stylz and his beautiful co-host the Instagram sensation Sandra Sago excited to have you on board!</span></div><div style="background: #fff; border: solid 1px #ccd4dc; padding:20px 10px; text-align: center; font-size: 16px; line-height: 24px;  font-family:Arial; ">You are RSVPed and will get an alert on November 30th, 2019 when the Audio Deadline show go up for purchase AND you are currently signed up as an affiliate, so you can invite others to RSVP and get paid 10%!<br/><br/>Everyone that signs up under you and makes any purchases on our portal will pay you 10% and if they sign up to be an affiliate promoter you will ALSO get 5% from all the audience they bring! Streaming tickets go on sale November 30th for the first Audio Deadline happening in 13th APRIL 2019!</div><div style="background: #ccd4dc; padding: 4px; text-align: center; font-family: Arial; font-size: 22px; color: #000;"><div style="border: double 6px #fff; padding: 10px;"><strong>Your sign in link:</strong><a href="'+loginlink+'" target="_blank; " style="color: #ee680f;"> '+loginlink+'</a></div></div><div style="background: #fff; border: solid 1px #ccd4dc; padding:20px 10px; text-align: center; font-size: 20px; line-height: 24px;  font-family:Arial; "><div style="display: block; color:#0ebce7; margin: 0px; padding-bottom: 15px; font-weight: bold; text-align: center; font-size: 20px; line-height: 24px;  font-family:Arial;">Your username:<span style="font-weight: normal; color: #000; padding-left: 10px;">'+email+'</span></div><div style="display: block; color:#0ebce7; margin: 0px; padding-bottom: 15px; font-weight: bold; text-align: center; font-size: 20px; line-height: 24px;  font-family:Arial;">Password: <span style="font-weight: normal; color: #000; padding-left: 10px;">Password you put on time of registration (Hidden due to security)</span></div><div style="display: block; text-align: center; text-transform: uppercase; font-weight: bold; color: #ee680f; text-align: center; font-size: 24px; line-height: 30px;  font-family:Arial;">SIGN IN AND START MARKETING RIGHT AWAY!</div></div><div style="background: #ccd4dc;  padding:20px 10px; text-align: center; font-size: 16px; line-height: 24px;  font-family:Arial; "><strong>You can also start inviting others to join www.ArtistXP.com is a new social network that we are launching right along with the AudioDeadline.com Experience. </strong><br/><br/>We are building a massive online community of musicians, fans and excitement around our ground breaking and inspiring new online streaming show. The social network and share technology is all free to users and every quarter we have a live streaming event they can purchase streaming tickets as well as other commerce opportunities.<br/><br/>The Audio Deadline show is surrounded by one of the most dynamic technologies for musicians to have ever launched online! Musicians can complete to be on the show through votes, add all their media and trade traffic with thousands of other artists in our Artist Exchange.<br/><br/><strong>We look forward to sharing all the excitement with you and we’ll see you on the AudioDeadline.com portal!</strong></div></div></body></html>'
                                    }
                                    smtpTransport.sendMail(mail, function (error, response) {
                                        smtpTransport.close();
                                    });
                                }
                                if(typeof (req.query.laevent) != 'undefined'){

                                    var mail = {
                                        from: "Admin <itplcc40@gmail.com>",
                                        to: req.query.email,
                                        subject: 'YOU ARE SIGNED UP FOR THE AUDIODEADLINE.COM NETWORKING EVENT IN LOS ANGELES!',
                                        html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Audiodeadline</title></head><body><div style="max-width: 600px; margin: 0 auto; border: solid 1px #ccc;"><div style=" background:  #b8bdc1; padding: 15px; text-align: center; font-family: Arial; font-size: 22px; color: #fff; text-transform: uppercase;"><img src="https://audiodeadline.com/assets/images/logo.png" alt="#" style="display: block; margin: 0 auto;"></div><div style="background: #415362; display: block; text-transform: uppercase; font-weight: bold;  padding:15px 10px; text-align: center; font-family: Arial; font-size: 20px; color: #fff;">You are signed up for the AudioDeadline.com Networking event in Los Angeles!</div><div style="background: #11181e; overflow: hidden;"><img src="https://audiodeadline.com/assets/images/fstophomeblock1bg.jpg" style="width: 240%; margin: 0px;"></div><div style="background: #353637; padding:20px 20px; font-family:Arial; "><p style="font-size: 16px; color: #fff; line-height: 26px; margin: 0; padding: 0 0 15px 0;">Thank you for registering for our Networking Event in Los Angeles, CA on <span style="color: #ee680f;">November 30th 2018.</span><br/><br/>The event will start at 7PM and run until midnight. We have an open bar so get here early! We are expecting the event to be packed and may run out early.<br/><br/><b style="color: #ecce41;">LOCATION:</b> <span style="color: #ee680f;">The Willow - Hollywood Hills Mansion - 7853 Willow Glen RdLos Angeles, CA 90046</span><br/><br/>Come and meet the <span style="color: #ee680f;">CEO Beto Paredes</span> and our host and President <span style="color: #ee680f;">Flii Stylz</span> while learning what we have instore for our first AudioDeadline.com experience! There will be several music and entertainment industry executives and talent at our event. We will be announcing the official launch of our social Network <a href="https://www.artistxp.com/" target="_blank" style="color: #ee680f;"> www.ArtistXP.com</a> so be sure to make it!<br/><br/>If you require any more details, please call Kyndra Zamora at <a href="tel:208.690.9203" style="color: #ee680f;">208.690.9203</a> or email her at <a href="mailto:kyndra@audiodeadline.com" style="color: #ee680f;">kyndra@audiodeadline.com</a><br/><br/><b style="color: #ecce41;">Audio Deadline</b> Event staff – <a href="https://audiodeadline.com/" target="_blank" style="color: #ee680f;">www.AudioDeadline.com</a></p></div><div style="background: #e4e8f2; padding:20px 20px; text-align: center; font-family:Arial; font-size: 28px; color: #01b0f4; line-height: 32px; border-bottom: solid 5px #01b0f4; text-transform: uppercase; font-weight: bold; "><span style="display: block; padding-bottom: 20px;">Venue Pictures:</span><div style="clear: both;"></div><img src="https://audiodeadline.com/assets/images/audiodeadline_mailimg1.jpg" alt="#" style="width: 23%;  border: solid 1px #b5b8be; margin-right: 0.1%;"><img src="https://audiodeadline.com/assets/images/audiodeadline_mailimg2.jpg" alt="#"  style="width: 23%; margin: 0 0.1%; border: solid 1px #b5b8be;"><img src="https://audiodeadline.com/assets/images/audiodeadline_mailimg3.jpg" alt="#" style="width: 23%;  margin: 0 0.1%; border: solid 1px #b5b8be;"><img src="https://audiodeadline.com/assets/images/audiodeadline_mailimg4.jpg" alt="#" style="width: 23%;  border: solid 1px #b5b8be; margin-left: 0.1%;"><div style="clear: both;"></div></div></div></body></html>'
                                    }

                                    smtpTransport.sendMail(mail, function (error, response) {
                                        smtpTransport.close();
                                    });
                                }

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
        $and : [{admin : 1},{ username: { $ne: "samsujj" }}]
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
        $and : [{admin : 0}, {signupaffiliate: 1}]
    };
    if(req.query.username != ''){
        cond = {
            $and : [{admin : 0}, {signupaffiliate: 1}, {parent:req.query.username}]
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
        $and : [{admin : 0}, {ambassador: 1}]
    };

    if(req.query.username != ''){
        cond = {
            $and : [{admin : 0}, {ambassador: 1}, {parent:req.query.username}]
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
        $and : [{admin : 0}, {musicians: 1}]
    };

    if(req.query.username != ''){
        cond = {
            $and : [{admin : 0}, {musicians: 1}, {parent:req.query.username}]
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
        $and : [{admin : 0}, {dancer: 1}]
    };

    if(req.query.username != ''){
        cond = {
            $and : [{admin : 0}, {dancer: 1}, {parent:req.query.username}]
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
        $and : [{admin : 0}, {model: 1}]
    };

    if(req.query.username != ''){
        cond = {
            $and : [{admin : 0}, {model: 1}, {parent:req.query.username}]
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
        $and : [{admin : 0}, {fan: 1}]
    };

    if(req.query.username != ''){
        cond = {
            $and : [{admin : 0}, {fan: 1}, {parent:req.query.username}]
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
        $and : [{admin : 0}, {$or: [{musicians : 1}, {dancer : 1}, {model : 1}, {fan : 1}]}]
    };

    if(req.query.username != ''){
        cond = {
            $and : [{admin : 0}, {$or: [{musicians : 1}, {dancer : 1}, {model : 1}, {fan : 1}]}, {parent:req.query.username}]
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
        $and : [{admin : 0}, {signupaffiliate: {$ne:1}}, {ambassador:  {$ne:1}}, {musicians:  {$ne:1}}, {dancer:  {$ne:1}}, {model:  {$ne:1}}, {fan:  {$ne:1}}]
    };

    if(req.query.username != ''){
        cond = {
            $and : [{admin : 0}, {signupaffiliate:  {$ne:1}}, {ambassador:  {$ne:1}}, {musicians:  {$ne:1}}, {dancer:  {$ne:1}}, {model:  {$ne:1}}, {fan:  {$ne:1}}, {parent:req.query.username}]
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
        zip: req.query.zip
    }},function(err, results) {
        collection.find({ _id:o_id }).toArray(function(err2, items2){
            resp.send(JSON.stringify({'status':'success','msg':items2[0]}));
        });
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
            resp.send(JSON.stringify({'status':'success','item':resitem}));
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

    collection.find({$or: [{type : 3}, {type : 4}]}).toArray(function(err, items){
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
            $and : [{status : 1}, {$or: orobj}]
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
    var musicgenre = '';
    var dancergenre = '';
    if(req.query.musicgenre != ''){
        musicgenre = new mongodb.ObjectID(req.query.musicgenre);
    }
    if(req.query.dancergenre != ''){
        dancergenre = new mongodb.ObjectID(req.query.dancergenre);
    }

    var data = {
        realname: req.query.realname,
        alias: req.query.alias,
        gender: req.query.gender,
        musicgenre: musicgenre,
        dancergenre: dancergenre,
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

    collection.update({_id: o_id}, {$set: data},function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'error'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/getsponsormedia',function(req,resp){
    var collection= db.collection('mediaview');
    cond = { type: 2};
    if(req.query.sponsor != ''){
        cond = {
            $and : [
                {type : 2},
                { sponsor: req.query.sponsor }
                ]
        };
    }

    collection.find(cond).toArray(function(err, items) {
        if (!items) {
            resp.send(JSON.stringify({'status':'error','item':[]}));
        } else {
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});

app.get('/promocodelist',function(req,resp){
    var collection= db.collection('promocodeview');
    var cond = {};
    var orobj = [];

    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/addpromocode',function(req,resp){
    var collection= db.collection('promocode');
    var promocode = req.query.promocode;
    promocode = promocode.toUpperCase();

    collection.find({promocode:promocode}).toArray(function(err,items){
        if(items.length > 0){
            resp.send(JSON.stringify({'status':'error','msg':'This promocode is already exist..!'}));
        }else{
            collection.insert([{
                promocode: promocode,
                description: req.query.description,
                type: req.query.type,
                amount: parseFloat(req.query.amount),
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

app.get('/cngstatusprocode',function(req,resp){
    var collection= db.collection('promocode');
    var o_id = new mongodb.ObjectID(req.query._id);

    collection.update({_id: o_id}, {$set: {status: parseInt(req.query.status)}},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});

app.get('/deleteprocode',function(req,resp){
    var collection= db.collection('promocode');
    var o_id = new mongodb.ObjectID(req.query._id);

    collection.deleteOne({_id: o_id}, function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'failed'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/promocodedetails',function(req,resp){
    var resitem = {};
    var collection = db.collection('promocode');
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

app.get('/updatepromocode',function(req,resp){
    var collection= db.collection('promocode');
    var promocode = req.query.promocode;
    promocode = promocode.toUpperCase();
    var o_id = new mongodb.ObjectID(req.query._id);

    var cond = {
        $and : [
            {promocode:promocode},
            { _id: { $ne: o_id } }
            ]
    };

    collection.find(cond).toArray(function(err,items){
        if(items.length > 0){
            resp.send(JSON.stringify({'status':'error','msg':'This promocode is already exist..!'}));
        }else{
            collection.update({_id: o_id}, {$set: {
                promocode: promocode,
                description: req.query.description,
                type: req.query.type,
                amount: parseFloat(req.query.amount),
            }},function(err, results) {
                if (err) {
                    resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
                } else {
                    resp.send(JSON.stringify({'status': 'success'}));
                }
            });
        }
    });
});

app.get('/productlist',function(req,resp){
    var collection= db.collection('productview');
    var cond = {};

    collection.find(cond).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/addproduct',function(req,resp){
    var collection= db.collection('product');

    collection.insert([{
        name: req.query.name,
        description: req.query.description,
        price: parseFloat(req.query.price),
        added_time: moment().unix(),
        status: 1
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status': 'success'}));
        }
    });
});

app.get('/cngstatusproduct',function(req,resp){
    var collection= db.collection('product');
    var o_id = new mongodb.ObjectID(req.query._id);

    collection.update({_id: o_id}, {$set: {status: parseInt(req.query.status)}},function(err, results) {
        resp.send(JSON.stringify({'status':'success'}));
    });
});

app.get('/deleteproduct',function(req,resp){
    var collection= db.collection('product');
    var o_id = new mongodb.ObjectID(req.query._id);

    collection.deleteOne({_id: o_id}, function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'failed'}));
        }else{
            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});

app.get('/productdetails',function(req,resp){
    var resitem = {};
    var collection = db.collection('product');
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

app.get('/updateproduct',function(req,resp){
    var collection= db.collection('product');
    var o_id = new mongodb.ObjectID(req.query._id);

    collection.update({_id: o_id}, {$set: {
        name: req.query.name,
        description: req.query.description,
        price: parseFloat(req.query.price)
    }},function(err, results) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status': 'success'}));
        }
    });
});

app.get('/chkpromocode',function(req,resp){
    var collection= db.collection('promocodeview');
    var promocode = req.query.promocode;
    promocode = promocode.toUpperCase();
    cond = {
        $and : [
            {promocode : promocode},
            {status: 1 }
            ]
    };

    collection.find(cond).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Invalid Promocode. Try Again!'}));
        } else {
            if (items.length == 0) {
                resp.send(JSON.stringify({'status':'error','msg':'Invalid Promocode. Try Again!'}));
            } else {
                var disamount = items[0].amount;
                var msg = '';
                if(items[0].type == 'flat')
                    msg = 'Flat $'+disamount+' discount.';
                if(items[0].type == 'percentage')
                    msg = disamount+'% discount.';
                resp.send(JSON.stringify({'status':'success','msg': msg}));
            }
        }
    });
});

app.get('/chkpromocode1',function(req,resp){
    var collection= db.collection('promocodeview');
    var promocode = req.query.promocode;
    promocode = promocode.toUpperCase();
    cond = {
        $and : [
            {promocode : promocode},
            {status: 1 }
        ]
    };

    collection.find(cond).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Invalid Promocode. Try Again!'}));
        } else {
            if (items.length == 0) {
                resp.send(JSON.stringify({'status':'error','msg':'Invalid Promocode. Try Again!'}));
            } else {
                resp.send(JSON.stringify({'status':'success','item': items[0]}));
            }
        }
    });
});

app.get('/getaffparent',function(req,resp){
    var collection= db.collection('user');

    collection.find({'username':req.query.affiliate}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Affiliate does not exist.'}));
        } else {
            if (items.length == 0) {
                resp.send(JSON.stringify({'status':'error','msg':'Affiliate does not exist.'}));
            } else {
                resp.send(JSON.stringify({'status':'success','parent':items[0].parent,'affiliate':items[0].signupaffiliate,'ambassador':items[0].ambassador}));
            }
        }
    });
});

app.get('/ticketsale',function(req,resp){
    var userid = '';
    var username = '';
    var email = req.query.email;
    username = email.match(/^([^@]*)@/)[1];
    username = username.substring(0,4)+makeid(4)+moment().unix();
    username = username.toLowerCase();
    var crypto = require('crypto');
    var hash = crypto.createHmac('sha256', username)
        .update('password')
        .digest('hex');

    db.collection('user').find({email:req.query.email}).toArray(function(err1,items1){
        if(err1){
            resp.send(JSON.stringify({'status':'error','msg':'Database error occurred.'}));
        }else{
            if(items1.length > 0){
                userid = items1[0]._id;

                db.collection('user').update({username: items1[0].username}, {$set: {cardnumber: req.query.cardnumber,vaultid: req.query.token}});

                var promocode = req.query.promocode;
                promocode = promocode.toUpperCase();
                var subamount = req.query.subamount;
                var amount = req.query.amount;
                var disamount = req.query.disamount;
                subamount = parseFloat(subamount);
                subamount = subamount.toFixed(2);
                amount = parseFloat(amount);
                amount = amount.toFixed(2);
                disamount = parseFloat(disamount);
                disamount = disamount.toFixed(2);
                var productid = req.query.productid;
                productid = new mongodb.ObjectID(productid);

                var promohtml = '';
                if(promocode !=''){
                    promohtml = '<tr><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td><td width="62%" align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Promocode ('+ promocode +') </td><td align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important"> -$'+ disamount +'</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td></tr>';
                }

                var ordertime = moment().unix();

                db.collection('order').insert([{
                    userid: new mongodb.ObjectID(userid),
                    firstname: req.query.firstname,
                    lastname: req.query.lastname,
                    phone: req.query.phone,
                    email: req.query.email,
                    address: req.query.address,
                    city: req.query.city,
                    state: req.query.state,
                    zip: req.query.zip,
                    affiliate: req.query.affiliate1,
                    media: req.query.media,
                    sponsor: req.query.sponsor,
                    productid: productid,
                    promocode: req.query.promocode,
                    subtotal: subamount,
                    shipping: 0,
                    tax: 0,
                    discount: disamount,
                    total: amount,
                    added_time: ordertime,
                    transactionId: req.query.transactionId,
                }], function (err2, result2) {
                    if (err2) {
                        resp.send(JSON.stringify({'status': 'error', 'msg': 'Database error occurred.'}));
                    } else {

                        /*****************Order Mail [start]***************/
                        var smtpTransport = mailer.createTransport("SMTP", {
                            service: "Gmail",
                            auth: {
                                user: "itplcc40@gmail.com",
                                pass: "DevelP7@"
                            }
                        });


                        var mail = {
                            from: "Admin <itplcc40@gmail.com>",
                            to: req.query.email,
                            subject: 'You Ticket Order Successful!',
                            html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Retail customer connect</title></head><body><div style="width:640px; margin:0 auto; background:#000; padding:20px;"><div style="width:620px;"><div style="width:100%; background:#1d1f20; padding:10px; border-bottom: solid 1px #1d1f20; box-shadow:0 0 10px #888;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#afc5d8; padding:20px; border-bottom:solid 2px #ffc823;"><tr><td align="left" valign="middle"><img src="https://audiodeadline.com/assets/images/logo_mail.png"  alt="#" width="250"/></td></tr></table><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="center"><div style="margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:40px 0;background: #415f79;font-family:Arial,Helvetica,sans-serif"><tbody><tr><td align="left" valign="top"><div style="border-left:solid 6px #ffc823;padding:6px 6px 6px 10px"><h2 style="color:#fff;font-size:18px;font-weight:normal;margin:0;padding:0px;display:inline-block">Invoice to:</h2><br><h3 style="font-weight:normal;margin:5px 0 8px 0;padding:0px;font-size:22px;color:#efc956;display:inline-block">'+ req.query.firstname +' '+ req.query.lastname +'</h3><br><h4 style="font-weight:normal;margin:0;padding:0;font-size:14px;line-height:20px;color:#fff;display:inline-block; text-decoration:none;">'+ req.query.address +', '+ req.query.city +' '+ req.query.zip +', US<br /><a href="mailto:'+ req.query.email +'" target="_blank" style="color:#fff; display:inline-block; text-decoration:none;">'+ req.query.email +'</a></h4></div></td><td align="right" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="right" valign="middle" style="padding:2px 8px 0 0;color:#fff;font-size:14px">Invoice date: '+ moment(ordertime).format("Do, MMM YYYY") +'</td></tr><tr><td align="right" valign="middle" style="padding:15px 8px 0 0;color:#fff;font-size:20px">Total amount:$'+ amount +' </td></tr></tbody></table></td></tr></tbody></table><table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial,Helvetica,sans-serif"><tbody><tr><th width="2%" align="left" valign="middle" style="background:#5581a7">&nbsp;</th><th width="47%" align="left" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Item Description</th><th width="5%" align="left" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="https://audiodeadline.com/assets/images/rightarrow_mail.png" alt="#"></th><th width="9%" align="center" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"> Price</th><th width="5%" align="left" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="https://audiodeadline.com/assets/images/rightarrow_mail.png" alt="#"></th><th width="8%" align="center" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Qty. </th><th width="5%" align="left" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="https://audiodeadline.com/assets/images/rightarrow_mail.png" alt="#"></th><th width="16%" align="center" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Total </th><th width="2%" align="left" valign="middle" style="background:#5581a7">&nbsp;</th></tr><tr><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td><td align="left" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">Ticket</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td><td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$'+ subamount +'</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td><td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">1</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td><td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$'+ subamount +'</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td></tr></tbody></table><table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0px;margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#333; background: #425f78;"><tbody><tr><td width="100%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td><td width="62%" align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Subtotal</td><td align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$'+ subamount +'</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td></tr><tr><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td><td width="62%" align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Tax</td><td align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$0.00</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td></tr><tr><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td><td width="62%" align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Shipping</td><td align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$0.00</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td></tr>'+ promohtml +'<tr><td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td><td width="62%" align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c;font-size:22px!important">Grand Total</td><td align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c">$'+ amount +'</td><td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td></tr></tbody></table></td></tr></tbody></table><div style="width:auto;padding:30px;text-align:center;background:#f9bc07;color:#000; font-weight: bold; text-align:center;margin-top:20px">Thank you For Your Purchase Order</div></div></td></tr></tbody></table></div></div></div></body></html>'
                        }

                        smtpTransport.sendMail(mail, function (error, response) {
                            smtpTransport.close();
                        });
                        /*****************Order Mail [end]***************/

                        var orderid = result2.insertedIds[0];
                        if(req.query.affiliate1 != ''){
                            var commission1 = ((amount*10)/100);
                            commission1 = commission1.toFixed(2);

                            db.collection('commission').insert([{
                                username: req.query.affiliate1,
                                orderid: new mongodb.ObjectID(orderid),
                                commission: '10%',
                                amount: commission1,
                                added_time: moment().unix()
                            }]);

                            db.collection('user').find({username: req.query.affiliate1}).toArray(function(err99, item99) {
                                if(item99.length){
                                    var prevcomm = item99[0].commission;
                                    var currentcomm = parseFloat(prevcomm)+parseFloat(commission1);
                                    currentcomm = parseFloat(currentcomm);
                                    currentcomm = currentcomm.toFixed(2);
                                    db.collection('user').update({username: req.query.affiliate1}, {$set: {commission: currentcomm}});
                                }

                            });

                        }
                        if(req.query.affiliate2 != ''){
                            var commission2 = ((amount*5)/100);
                            commission2 = commission2.toFixed(2);

                            db.collection('commission').insert([{
                                username: req.query.affiliate2,
                                orderid: new mongodb.ObjectID(orderid),
                                commission: '5%',
                                amount: commission2,
                                added_time: moment().unix()
                            }]);

                            db.collection('user').find({username: req.query.affiliate2}).toArray(function(err99, item99) {
                                if(item99.length){
                                    var prevcomm = item99[0].commission;
                                    var currentcomm = parseFloat(prevcomm)+parseFloat(commission2);
                                    currentcomm = parseFloat(currentcomm);
                                    currentcomm = currentcomm.toFixed(2);
                                    db.collection('user').update({username: req.query.affiliate2}, {$set: {commission: currentcomm}});
                                }

                            });

                        }
                        if(req.query.affiliate3 != ''){
                            var commission3 = ((amount*3)/100);
                            commission3 = commission3.toFixed(2);

                            db.collection('commission').insert([{
                                username: req.query.affiliate3,
                                orderid: new mongodb.ObjectID(orderid),
                                commission: '3%',
                                amount: commission3,
                                added_time: moment().unix(),
                            }]);

                            db.collection('user').find({username: req.query.affiliate3}).toArray(function(err99, item99) {
                                if(item99.length){
                                    var prevcomm = item99[0].commission;
                                    var currentcomm = parseFloat(prevcomm)+parseFloat(commission3);
                                    currentcomm = parseFloat(currentcomm);
                                    currentcomm = currentcomm.toFixed(2);
                                    db.collection('user').update({username: req.query.affiliate3}, {$set: {commission: currentcomm}});
                                }

                            });

                        }
                        if(req.query.media == ''){
                            resp.send(JSON.stringify({'status':'success','msg':'Order Succesful.'}));
                        }else{
                            db.collection('sponsormailbody').find({sponsor: req.query.media}).toArray(function(err, items) {
                                if (err) {
                                    resp.send(JSON.stringify({'status':'success','msg':'Order Succesful.'}));
                                } else {
                                    resitem = items[0];
                                    if(resitem.mailbody == ''){
                                        resp.send(JSON.stringify({'status':'success','msg':'Order Succesful.'}));
                                    }else{
                                        var mail = {
                                            from: "Admin <itplcc40@gmail.com>",
                                            to: req.query.email,
                                            subject: resitem.mailsubject,
                                            html: resitem.mailbody
                                        }

                                        smtpTransport.sendMail(mail, function (error, response) {
                                            smtpTransport.close();
                                        });
                                        resp.send(JSON.stringify({'status':'success','msg':'Order Succesful.'}));
                                    }
                                }
                            });
                        }


                    }
                });
                /****order end*****/

            }else{
                db.collection('user').insert([{
                    firstname: req.query.firstname,
                    lastname: req.query.lastname,
                    phone: req.query.phone,
                    email: req.query.email,
                    username: username,
                    password: hash,
                    address: req.query.address,
                    address2: '',
                    city: req.query.city,
                    state: req.query.state,
                    zip: req.query.zip,
                    rsvp: 0,
                    signupaffiliate: 0,
                    parent: req.query.affiliate1,
                    added_time: moment().unix(),
                    admin: 0,
                    status: 1,
                    agreement: 0,
                    noofclick: 0,
                    mediaid: req.query.media,
                    gender: '',
                    ambassador: 0,
                    dancer: 0,
                    model: 0,
                    musicians: 0,
                    fan: 1,
                    accesscode: '',
                    commission: 0,
                    cardnumber: req.query.cardnumber,
                    vaultid: req.query.token
                }], function (err2, result2){
                    if(err2){
                        resp.send(JSON.stringify({'status':'error','msg':'Database error occurred.'}));
                    }else{
                        userid = result2.insertedIds[0];

                        /****order start*****/


                        var promocode = req.query.promocode;
                        promocode = promocode.toUpperCase();
                        var subamount = req.query.subamount;
                        var amount = req.query.amount;
                        var disamount = req.query.disamount;
                        subamount = parseFloat(subamount);
                        subamount = subamount.toFixed(2);
                        amount = parseFloat(amount);
                        amount = amount.toFixed(2);
                        disamount = parseFloat(disamount);
                        disamount = disamount.toFixed(2);
                        var productid = req.query.productid;
                        productid = new mongodb.ObjectID(productid);

                        var promohtml = '';
                        if(promocode !=''){
                            promohtml = '<tr><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td><td width="62%" align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Promocode ('+ promocode +') </td><td align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important"> -$'+ disamount +'</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td></tr>';
                        }

                        var ordertime = moment().unix();

                        db.collection('order').insert([{
                            userid: new mongodb.ObjectID(userid),
                            firstname: req.query.firstname,
                            lastname: req.query.lastname,
                            phone: req.query.phone,
                            email: req.query.email,
                            address: req.query.address,
                            city: req.query.city,
                            state: req.query.state,
                            zip: req.query.zip,
                            affiliate: req.query.affiliate1,
                            media: req.query.media,
                            sponsor: req.query.sponsor,
                            productid: productid,
                            promocode: req.query.promocode,
                            subtotal: subamount,
                            shipping: 0,
                            tax: 0,
                            discount: disamount,
                            total: amount,
                            added_time: ordertime,
                            transactionId: req.query.transactionId,
                        }], function (err2, result2) {
                            if (err2) {
                                resp.send(JSON.stringify({'status': 'error', 'msg': 'Database error occurred.'}));
                            } else {

                                /*****************Order Mail [start]***************/
                                var smtpTransport = mailer.createTransport("SMTP", {
                                    service: "Gmail",
                                    auth: {
                                        user: "itplcc40@gmail.com",
                                        pass: "DevelP7@"
                                    }
                                });

                                var mail = {
                                    from: "Admin <itplcc40@gmail.com>",
                                    to: req.query.email,
                                    subject: 'You are officially signed up for the ArtistXP.com pre-launch!',
                                    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Artist XP</title></head><body><div style="max-width: 600px; margin: 0 auto;"><div style=" background:  #07031c; padding: 15px; text-align: center; font-family: Arial; font-size: 22px; color: #fff; text-transform: uppercase;"><img src="https://audiodeadline.com/assets/images/artistlogofooter.png"  alt="#" style="display: block; margin: 0 auto; width: 60%; margin-bottom: 6px;">You are officially signed up for the ArtistXP.com pre-launch!</div><div style="border-bottom: solid 5px #07031c;"><img src="https://audiodeadline.com/assets/images/artistxp_mail_img.jpg" alt="#" style="display: block; margin: 0 auto; width: 100%;"></div><div style="background: #e4e8f2; padding:20px 10px; text-align: center; font-family:Arial; "><p style="margin: 0; padding:0; line-height: 30px; color: #1c2831; font-size: 22px; text-transform: uppercase; font-weight: bold; ">Our social experience is bringing artists to the forefront and you will be one of the early adapters that know once we go live!</p></div><div style="background: #090c13; padding:20px 20px; text-align: center; font-family:Arial; "><p style="font-size: 16px; color: #fff; line-height: 22px; margin: 0; padding: 0;">Be sure to share this link for other to sign up too <a href="http://artistxp.com" style="color: #ee680f;">artistxp.com</a> so we can give you credit if you are an affiliate or plan to join as one later on!<br/><br/>Our social network will be going live on November 30th, 2018.  You are currently pre-registered for your profile and we will email you the minute you can come in, complete and participate!</b></p></div><div style="background: #e4e8f2; padding:20px 25px; text-align: center; font-family:Arial; font-size: 16px; color: #1c2831; line-height: 24px; "><strong style="display: block; color: #070826; font-size: 24px; padding: 0 0 15px 0;"> WHAT HAPPENS ON ARTISTXP.COM IS EXCITING.</strong>Artists along with all the regular users access features you would expect from a complete social experience. This includes friending, inviting others to join, stream chat (like your Facebook wall) and instant messaging. We have several unique features to our platform as well such as play list management, voting opportunities and more.<br/><br/>One of the biggest things that sets us apart and makes ArtistXP a premier destination on the web is the Artist Appreciation and Interactive features. Fans and other artists show what they have liked as well as media they have saved from the Artists on their video and audio media playlists. These are visible to all their friends and gives additional exposure directly to the artists they love.</div><div style="background: #090c13; padding:20px 20px; text-align: center; font-family:Arial; "><p style="font-size: 16px; color: #fff; line-height: 22px; margin: 0; padding:0;">We have special events and a quarterly live streamed show, The AudioDeadline.com Experience, where musicians, models and dancers win a chance to participate.<b>THIS IS GOING TO BE THE BIGGEST THING IN THE MUSIC INDUSTRY!</b><br/><br/><b>Again,</b> be sure to share this link for other to sign up too  <a href="http://artistxp.com" style="color: #ee680f;">artistxp.com</a> so we can give you credit if you are an affiliate or plan to join as one later on!</p></div></div></body></html>'
                                }

                                smtpTransport.sendMail(mail, function (error, response) {
                                    smtpTransport.close();
                                });


                                var mail = {
                                    from: "Admin <itplcc40@gmail.com>",
                                    to: req.query.email,
                                    subject: 'You Ticket Order Successful!',
                                    html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Retail customer connect</title></head><body><div style="width:640px; margin:0 auto; background:#000; padding:20px;"><div style="width:620px;"><div style="width:100%; background:#1d1f20; padding:10px; border-bottom: solid 1px #1d1f20; box-shadow:0 0 10px #888;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#afc5d8; padding:20px; border-bottom:solid 2px #ffc823;"><tr><td align="left" valign="middle"><img src="https://audiodeadline.com/assets/images/logo_mail.png"  alt="#" width="250"/></td></tr></table><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="center"><div style="margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:40px 0;background: #415f79;font-family:Arial,Helvetica,sans-serif"><tbody><tr><td align="left" valign="top"><div style="border-left:solid 6px #ffc823;padding:6px 6px 6px 10px"><h2 style="color:#fff;font-size:18px;font-weight:normal;margin:0;padding:0px;display:inline-block">Invoice to:</h2><br><h3 style="font-weight:normal;margin:5px 0 8px 0;padding:0px;font-size:22px;color:#efc956;display:inline-block">'+ req.query.firstname +' '+ req.query.lastname +'</h3><br><h4 style="font-weight:normal;margin:0;padding:0;font-size:14px;line-height:20px;color:#fff;display:inline-block; text-decoration:none;">'+ req.query.address +', '+ req.query.city +' '+ req.query.zip +', US<br /><a href="mailto:'+ req.query.email +'" target="_blank" style="color:#fff; display:inline-block; text-decoration:none;">'+ req.query.email +'</a></h4></div></td><td align="right" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="right" valign="middle" style="padding:2px 8px 0 0;color:#fff;font-size:14px">Invoice date: '+ moment(ordertime).format("Do, MMM YYYY") +'</td></tr><tr><td align="right" valign="middle" style="padding:15px 8px 0 0;color:#fff;font-size:20px">Total amount:$'+ amount +' </td></tr></tbody></table></td></tr></tbody></table><table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial,Helvetica,sans-serif"><tbody><tr><th width="2%" align="left" valign="middle" style="background:#5581a7">&nbsp;</th><th width="47%" align="left" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Item Description</th><th width="5%" align="left" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="https://audiodeadline.com/assets/images/rightarrow_mail.png" alt="#"></th><th width="9%" align="center" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"> Price</th><th width="5%" align="left" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="https://audiodeadline.com/assets/images/rightarrow_mail.png" alt="#"></th><th width="8%" align="center" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Qty. </th><th width="5%" align="left" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="https://audiodeadline.com/assets/images/rightarrow_mail.png" alt="#"></th><th width="16%" align="center" valign="middle" style="background:#5581a7;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Total </th><th width="2%" align="left" valign="middle" style="background:#5581a7">&nbsp;</th></tr><tr><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td><td align="left" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">Ticket</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td><td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$'+ subamount +'</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td><td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">1</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td><td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$'+ subamount +'</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td></tr></tbody></table><table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0px;margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#333; background: #425f78;"><tbody><tr><td width="100%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td><td width="62%" align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Subtotal</td><td align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$'+ subamount +'</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td></tr><tr><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td><td width="62%" align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Tax</td><td align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$0.00</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td></tr><tr><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td><td width="62%" align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Shipping</td><td align="right" valign="middle" style="color:#fff;padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$0.00</td><td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td></tr>'+ promohtml +'<tr><td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td><td width="62%" align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c;font-size:22px!important">Grand Total</td><td align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c">$'+ amount +'</td><td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td></tr></tbody></table></td></tr></tbody></table><div style="width:auto;padding:30px;text-align:center;background:#f9bc07;color:#000; font-weight: bold; text-align:center;margin-top:20px">Thank you For Your Purchase Order</div></div></td></tr></tbody></table></div></div></div></body></html>'
                                }

                                smtpTransport.sendMail(mail, function (error, response) {
                                    smtpTransport.close();
                                });
                                /*****************Order Mail [end]***************/

                                var orderid = result2.insertedIds[0];
                                if(req.query.affiliate1 != ''){
                                    var commission1 = ((amount*10)/100);
                                    commission1 = commission1.toFixed(2);

                                    db.collection('commission').insert([{
                                        username: req.query.affiliate1,
                                        orderid: new mongodb.ObjectID(orderid),
                                        commission: '10%',
                                        amount: commission1,
                                        added_time: moment().unix()
                                    }]);

                                    db.collection('user').find({username: req.query.affiliate1}).toArray(function(err99, item99) {
                                        if(item99.length){
                                            var prevcomm = item99[0].commission;
                                            var currentcomm = parseFloat(prevcomm)+parseFloat(commission1);
                                            currentcomm = parseFloat(currentcomm);
                                            currentcomm = currentcomm.toFixed(2);
                                            db.collection('user').update({username: req.query.affiliate1}, {$set: {commission: currentcomm}});
                                        }

                                    });

                                }
                                if(req.query.affiliate2 != ''){
                                    var commission2 = ((amount*5)/100);
                                    commission2 = commission2.toFixed(2);

                                    db.collection('commission').insert([{
                                        username: req.query.affiliate2,
                                        orderid: new mongodb.ObjectID(orderid),
                                        commission: '5%',
                                        amount: commission2,
                                        added_time: moment().unix()
                                    }]);

                                    db.collection('user').find({username: req.query.affiliate2}).toArray(function(err99, item99) {
                                        if(item99.length){
                                            var prevcomm = item99[0].commission;
                                            var currentcomm = parseFloat(prevcomm)+parseFloat(commission2);
                                            currentcomm = parseFloat(currentcomm);
                                            currentcomm = currentcomm.toFixed(2);
                                            db.collection('user').update({username: req.query.affiliate2}, {$set: {commission: currentcomm}});
                                        }

                                    });

                                }
                                if(req.query.affiliate3 != ''){
                                    var commission3 = ((amount*3)/100);
                                    commission3 = commission3.toFixed(2);

                                    db.collection('commission').insert([{
                                        username: req.query.affiliate3,
                                        orderid: new mongodb.ObjectID(orderid),
                                        commission: '3%',
                                        amount: commission3,
                                        added_time: moment().unix()
                                    }]);

                                    db.collection('user').find({username: req.query.affiliate3}).toArray(function(err99, item99) {
                                        if(item99.length){
                                            var prevcomm = item99[0].commission;
                                            var currentcomm = parseFloat(prevcomm)+parseFloat(commission3);
                                            currentcomm = parseFloat(currentcomm);
                                            currentcomm = currentcomm.toFixed(2);
                                            db.collection('user').update({username: req.query.affiliate3}, {$set: {commission: currentcomm}});
                                        }

                                    });

                                }

                                if(req.query.media == ''){
                                    resp.send(JSON.stringify({'status':'success','msg':'Order Succesful.'}));
                                }else{
                                    db.collection('sponsormailbody').find({sponsor: req.query.media}).toArray(function(err, items) {
                                        if (err) {
                                            resp.send(JSON.stringify({'status':'success','msg':'Order Succesful.'}));
                                        } else {
                                            resitem = items[0];
                                            if(resitem.mailbody == ''){
                                                resp.send(JSON.stringify({'status':'success','msg':'Order Succesful.'}));
                                            }else{
                                                var mail = {
                                                    from: "Admin <itplcc40@gmail.com>",
                                                    to: req.query.email,
                                                    subject: resitem.mailsubject,
                                                    html: resitem.mailbody
                                                }

                                                smtpTransport.sendMail(mail, function (error, response) {
                                                    smtpTransport.close();
                                                });
                                                resp.send(JSON.stringify({'status':'success','msg':'Order Succesful.'}));
                                            }
                                        }
                                    });
                                }

                            }
                        });
                        /****order end*****/
                    }
                });
            }
        }
    });
});

app.get('/orderlist',function(req,resp){
    var collection= db.collection('orderview');
    var cond = {};

    if(req.query.username != ''){
        cond = {affiliate:req.query.username};
    }

    collection.find(cond).toArray(function(err, items) {
        if (!items) {
            resp.send(JSON.stringify({'status':'error','item':[]}));
        } else {
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});

app.get('/commisionlist',function(req,resp){
    var collection= db.collection('commisionview');
    var cond = {};

    if(req.query.username != ''){
        cond = {username:req.query.username};
    }

    collection.find(cond).toArray(function(err, items) {
        if (!items) {
            resp.send(JSON.stringify({'status':'error','item':[]}));
        } else {
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});

app.get('/commisiondetlist',function(req,resp){
    var collection= db.collection('commisiondetview');
    var cond = {};

    if(req.query.username != ''){
        cond = {username:req.query.username};
    }

    collection.find(cond).toArray(function(err, items) {
        if (!items) {
            resp.send(JSON.stringify({'status':'error','item':[]}));
        } else {
            resp.send(JSON.stringify({'status':'success','item':items}));
        }
    });
});

app.get('/frontbloglist',function(req,resp){
    var collection= db.collection('blogview');

    collection.find({status:1}).toArray(function(err, items){
        if(err || items.length==0){
            resp.send(JSON.stringify({'res':[]}));
        }else{
            resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/frontblogdetails',function(req,resp){
    var resitem = {};
    var collection = db.collection('blogview');
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


app.get('/medialist',function(req,resp){
    var collection = db.collection('media');

    collection.find().toArray(function(err, items){
        resp.send(JSON.stringify(items));
    });
});

app.get('/medialistbytype',function(req,resp){
    var collection = db.collection('media');
    var cond = {type: parseInt(req.query.type)};
    if(typeof (req.query.status) != 'undefined' ){
        cond = {
            type: parseInt(req.query.type),
            status: parseInt(req.query.status)
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

app.get('/addmedianew',function(req,resp){
//db.collection('media').update({ type: 5}, {$set: {status: 0}},{multi:true});
//var o_id = new mongodb.ObjectID('5bc420d7b64a93cc60f70dd5');
//db.collection('media').deleteOne({_id: o_id});
    /*db.collection('media').insert([{
     name: 'artistxp_insta_12',
     noofclick: 0,
     image: 'artistxpinsta012.jpg',
     type: 6,
     status: 0,
     sponsor: '',
     sortindex: 0
     }]);*/
    resp.send(JSON.stringify({'status': 'success'}));
});

app.get('/getsponsormailbody',function(req,resp) {
    var collection= db.collection('sponsormailbody');
    collection.find({sponsor: req.query.sponsor}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            if(items.length > 0){
                resitem = items[0];
                resp.send(JSON.stringify({'status':'success','item':resitem}));
            }else{
                resp.send(JSON.stringify({'status':'error','id':0}));
            }
        }
    });
});

app.get('/addsponsormailbody',function(req,resp) {
    var collection= db.collection('sponsormailbody');
    collection.find({sponsor: req.query.sponsor}).toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','item':[]}));
        } else {
            if(items.length > 0){
                collection.update({sponsor: req.query.sponsor}, {$set: {mailbody: req.query.mailbody,mailsubject: req.query.mailsubject}},function(err, results) {
                    resp.send(JSON.stringify({'status':'success'}));
                });
            }else{
                collection.insert([{
                    sponsor: req.query.sponsor,
                    mailsubject: req.query.mailsubject,
                    mailbody: req.query.mailbody
                }], function (err, result) {
                    if (err) {
                        resp.send(JSON.stringify({'status':'failed'}));
                    } else {
                        resp.send(JSON.stringify({'status':'success'}));
                    }
                });
            }
        }
    });
});

var server = app.listen(port,'audiodeadline.com', function () {
    var host = server.address().address;
    var port = server.address().port;
});

function makeid(ln=0) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < ln; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}