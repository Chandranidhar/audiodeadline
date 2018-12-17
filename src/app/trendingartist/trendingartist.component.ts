import { Component, OnInit } from '@angular/core';
import {Commonservices} from "../app.commonservices";
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer} from '@angular/platform-browser';
import {Http} from "@angular/http";
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';

declare var $:any;
declare var moment: any;
@Component({
  selector: 'app-trendingartist',
  templateUrl: './trendingartist.component.html',
  styleUrls: ['./trendingartist.component.css'],
  providers: [Commonservices]
})

export class TrendingartistComponent implements OnInit {
    public serverurl;
    public userlist;
    public showLoader;
    public isGenreModalShown = 0;
    public musicgenrearray=[];
    public dancegenrearray=[];
    public selectedgenrearray=[];
    public statearray=[];
    public selectedstatearray=[];
    public isStateModalShown = 0;
    // public stateForm: FormGroup;
    public cityForm: FormGroup;
    public zipcodeForm: FormGroup;
    public isCityModalShown = 0;
    public isZipcodeModalShown = 0;
    public fb;
    public cityarray=[];
    public selectedcityarray=[];
    public zipcodearray=[];
    public selectedzipcodearray=[];
    public selectedstatesearcharray=[];
    public selectedcitysearcharray=[];
    public selectedzipsearcharray=[];
    public commonsearcharray=[];
    public selectedpost:any={};
    public picArray:any=[];
    public isPicModalShow:any=0;
    public piclimitstart:any=0;
    public piclimitend:any=1;
    public pic_user_id;
    public commentval:any='';
    public ismodalcomment:any = 0;
    public userdata: CookieService;
    public isloggedin:any=0;
    public image;
    public user_id;
    public currentpicturelikecount:any=0;
    public selectedpictureindex:any=0;
    public tabselectedpictureindex:any=0;
    public selectedpicture:any;

    public musicArray:any=[];
    public selectedaudiourl:any='';
    public selectedaudio:any={};
    public selectedaudioindex:any=0;
    public audioplayerindex:any=0;
    public chosenaudiotitle:any='';
    public chosenaudiourl:any='';
    public audiousername:any;
    public isaudioplay:boolean=false;
    public audioDuration:any='';
    public playstate:any='';
    public oldvolume:any=0;
    public audioDurationfortrending:any='';
    public ismuteaudio:boolean = false;
    public shuffleflag:boolean = false;
    public value:any=75;
    public value1:any=0;
    public options;
    public options1;
    public real_name;
    public currentmusiclikecount:any=0;
    public isModalMusicShown:boolean=false;
    public audiouploadurl;
    public currentlikecount:any=0;

    public videoArray:any=[];
    public selectedvideo:any={};
    public currentvideoid:any;
    public videoplayerindex:any=0;
    public videoplayfag:any=false;
    public currentvideotype:any;
    public choosenvideourl:any;
    public satizedurl:any='';
    public scrolled:any=0;
    public isModalVideoShown:any= false;


    constructor( userdata: CookieService, private _commonservices: Commonservices, private _http: Http, fb:FormBuilder,private sanitizer: DomSanitizer) {

        this.serverurl=_commonservices.url;

        this.value =75;                     //volume  slider
        this.options={
            floor: 0,
            ceil: 100
        };

        this.value1=0;                      //duration slider
        this.options1= {
            floor: 0,
            ceil: 200
        };

        this.audiouploadurl=_commonservices.audiouploadurl;

        this.showLoader = 0;
        this.ismodalcomment  = 0;
        this.fb=fb;
        this.shuffleflag = false;
        this.satizedurl= sanitizer;

        this.userdata = userdata;
        if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')
            this.isloggedin=1;
        this.image = this.userdata.get('image');
        this.user_id = this.userdata.get('user_id');
        this.real_name = this.userdata.get('real_name');


    }

    ngOnInit() {
        this.getartistlist();
        this. getgenrelist1();
        this.  getstatelist();

        this.cityForm = this.fb.group({

            cityname: ["", Validators.required]

        });
        this.zipcodeForm = this.fb.group({

            zipcode: ["", Validators.required]

        });
       /* this.stateForm = this.fb.group({

            state: ["",Validators.required]

        });*/

    }
    convertunixtotimeago(val:any){
        return moment.unix(val).startOf('minute').fromNow();

    }

    scrollup(){
        //document.getElementById("vlist").scrollIntoView();

        this.scrolled = this.scrolled - 300;
        $(".scrollbar").stop().animate({
            scrollTop: this.scrolled
        });
    }
    scrolldown(){
        //document.getElementById("vlist").scrollIntoView();
        //var scrolled = 0;

        this.scrolled = this.scrolled + 300;
        $(".scrollbar").stop().animate({
            scrollTop: this.scrolled
        });
    }

    getVideoDetails(item){


        let link4= this.serverurl+'getVideoListByUserid';
        this.pic_user_id = item;
        let dataID = {'user_id': this.pic_user_id};
        this._http.post(link4,dataID)
            .subscribe(res =>{

                let result = res.json();
                if(result.status=='success'){

                    console.log('video result');
                    console.log(result);
                    this.videoArray=result.item;
                    console.log('first element .... of video array ');          //showing the chosen video
                    console.log(this.videoArray[0]);
                    let oldselectedvideo = this.selectedvideo.videoUrl;

                    if( this.videoArray.length>0 && !this.videoplayfag){
                        this.currentvideoid =this.videoArray[0]._id;
                        //this.selectedvideotrending=this.videodetailArray[0];
                        console.log('this.selectedvideo.comments');
                        console.log(this.selectedvideo.comments);


                        if(this.videoArray[0].type=='vimeo'){
                            let tempvurl=this.videoArray[0].videoUrl;
                            let vimeourl = tempvurl.split('/');
                            let videoid = vimeourl[vimeourl.length - 1];
                            console.log('videoid ......');
                            console.log(videoid);

                            if((this.selectedvideo.comments)==null){
                                this.currentvideotype='vimeo';
                                this.choosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);
                            }
                        }
                        if(this.videoArray[0].type=='youtube' && !this.videoplayfag) {
                            let videourl = this.videoArray[0].videoUrl.split('v=');
                            let videoid = videourl[videourl.length - 1];
                            if((this.selectedvideo.comments)==null){
                                this.choosenvideourl=videoid;
                                this.currentvideotype='youtube';

                                /*  this.choosenvideourlfortrending=videoid;
                                 this.currentvideotypetrending='youtube';*/

                            }
                        }

                        if((this.selectedvideo.comments)==null) {
                            console.log('in null block ...');
                            this.selectedvideo = this.videoArray[0];
                        }
                        else{

                            console.log('this.selectedvideo');
                            console.log(this.selectedvideo);
                            for(let c1 in this.videoArray){
                                if(this.videoArray[c1]._id==this.selectedvideo._id){
                                    this.selectedvideo=this.videoArray[c1];
                                    if(oldselectedvideo!=this.selectedvideo.videoUrl){
                                        console.log('in selection block oldselectedvideo....');
                                        console.log('this.selectedvideo');
                                        console.log(this.selectedvideo);
                                        setTimeout(()=> {
                                            this.playthumb(this.selectedvideo);
                                        },50);
                                    }

                                    if(this.selectedvideo._id==this.selectedpost._id)this.selectedpost=this.videoArray[c1];
                                }
                            }

                        }
                    }
                    if( this.videoArray.length>0 && this.videoplayfag){
                        for(let c1 in this.videoArray){
                            if(this.videoArray[c1]._id==this.selectedvideo._id){
                                this.selectedvideo=this.videoArray[c1];

                            }
                        }
                    }
                    for (let x1 in this.videoArray){
                        if(this.videoArray[x1].type=='vimeo' && !this.videoplayfag){
                            let tempvurl=this.videoArray[x1].videoUrl;
                            let vimeourl = tempvurl.split('/');
                            let videoid = vimeourl[vimeourl.length - 1];
                            this._http.get('https://vimeo.com/api/v2/video/'+videoid+'.json')
                                .subscribe(res => {
                                    var result = res.json();
                                    console.log('vimeo json result ....');
                                    console.log(result);
                                    console.log(result[0].thumbnail_large);
                                    this.videoArray[x1].thumbnail=result[0].thumbnail_large;

                                }, error => {
                                    console.log("Oooops!");
                                });
                        }
                    }

                    this.isModalVideoShown= true;
                }
            })
    }

    playthumb(item:any){            // playing the thumbnail video


        this.choosenvideourl='';
        console.log('play thumb callled  ....');
        console.log(item);
        this.currentvideotype='';
        this.selectedvideo = item;
        this.currentvideoid=item._id;
        //this.currentvideotype='youtube';
        if(item.type=='vimeo'){

            let vimeourl = item.videoUrl.split('/');
            let videoid = vimeourl[vimeourl.length - 1];
            console.log('videoid ......');
            console.log(videoid);
            this.currentvideotype='vimeo';
            this.choosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

        }
        if(item.type=='youtube') {
            setTimeout(()=> {    //<<<---    using ()=> syntax
                let videourl = item.videoUrl.split('v=');
                this.choosenvideourl='';
                let videoid = videourl[videourl.length - 1];
                this.choosenvideourl=videoid;

                console.log('videoid');
                console.log(this.choosenvideourl);
                this.currentvideotype='youtube';
                console.log(videoid);
            }, 50);
            //let url = item.videoUrl.replace('watch?v=', 'embed/');

            //this.choosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }

    }

    getthumbnail(item:any){                     //getting the thumbnail image

        if(item.type=='youtube') {
            let url = item.videoUrl.replace('watch?v=', 'embed/');
            url=url.split('/');
            let urlid=url[url.length-1];
            //return "https://i1.ytimg.com/vi/"+urlid+"/0.jpg";
            return this.sanitizer.bypassSecurityTrustResourceUrl("https://i1.ytimg.com/vi/"+urlid+"/0.jpg");
        }
        if(item.type=='vimeo'){

            return this.sanitizer.bypassSecurityTrustResourceUrl(item.thumbnail);           //this.videoArray[x1].thumbnail

        }
    }

    onStateChange(event){
        console.log('event ....');
        console.log(event);
        this.videoplayfag=true;
        if(event.data == -1){
            var link2= this.serverurl+'addvideoviews';
            var data = {'user_id':this.user_id,videoid:this.currentvideoid};
            console.log('username');
            //console.log(data.username);
            this._http.post(link2, data)
                .subscribe(res => {
                    var result = res.json();
                    console.log(result.item);
                    if(result.status=='success'){
                        //this.getVideoDetails();
                        this.getVideoDetails(this.pic_user_id);
                    }
                }, error => {
                    console.log("Oooops!");
                });
            //this.getVideoDetails();
            this.getVideoDetails(this.pic_user_id);
        }
        if(event.data==0){
            this.videoplayfag=true;
            this.getVideoDetails(this.pic_user_id);
        }
    }

    showvideolike(val:any) {
        if (this.isloggedin == 1) {
            this.currentlikecount = val;
            let link4 = this.serverurl + 'addvideolike';
            var data = {'user_id': this.user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    console.log(result);
                    if (result.status == 'success') {


                        this.getVideoDetails(this.pic_user_id);
                        console.log('suceess like');
                    }
                })

        }
    }

    showvideounlike(val:any) {

        if (this.isloggedin == 1) {
            this.currentlikecount = val;
            let link4 = this.serverurl + 'deletevideolike';
            var data = {'user_id': this.user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    console.log(result);
                    if (result.status == 'success') {


                        this.getVideoDetails(this.pic_user_id);
                        console.log('suceess unlike');
                    }
                })
        }
    }

  /*  updatesantizedurl(){
        if(this.modalform.controls['type'].value=='vimeo') {
            let vimeourl = this.modalform.controls['videoUrl'].value.split('/');
            let videoid = vimeourl[vimeourl.length - 1];
            console.log('vimeourl');
            console.log(vimeourl);
            this.satizedurl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);
        }
        if(this.modalform.controls['type'].value=='youtube') {
            let url = this.modalform.controls['videoUrl'].value.replace('watch?v=', 'embed/');
            console.log('url');
            console.log(url);
            this.satizedurl = this.sanitizer.bypassSecurityTrustResourceUrl(url);


        }
        console.log('this.satizedurl updated ...');
        console.log(this.satizedurl);
    }*/

    playbackward(){
        let indexval=0;
        if(this.shuffleflag==true){

            this.playshuffle();
        }else
        {
            if(this.audioplayerindex> 0 )
                indexval=this.audioplayerindex-1;
            else {
                this.audioplayerindex = 0;
            }
            this.isaudioplay = false;
            this.playaudio(this.musicArray[indexval]);
        }


    }

    playshuffle() {

        let randomVal = this.getRandomInt(0,this.musicArray.length);
        this.playaudio(this.musicArray[randomVal]);
    }


    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    playforward(){
        let indexval=0;
        if(this.shuffleflag==true){
            this.playshuffle();
        }else {
            if(this.audioplayerindex <this.musicArray.length)

                indexval=this.audioplayerindex+1;
            else {
                this.audioplayerindex = this.musicArray.length;
            }

            this.isaudioplay = false;
            this.playaudio(this.musicArray[indexval]);
        }

    }
    shuffleon(){

        this.shuffleflag = true;
    }

    shuffleoff(){

        this.shuffleflag = false;
    }

    muteaudio(){
        this.value=0;
        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer1");
        this.oldvolume=myAudio.volume;
        myAudio.volume =0;
        this.ismuteaudio = true;

    }

    unmuteaudio(){

        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer1");
        myAudio.volume = this.oldvolume;
        this.ismuteaudio = false;
        this.value = this.oldvolume*100;
        /* console.log(this.value);
         console.log(this.oldvolume);
         console.log(myAudio.volume);*/



    }
    setval1(){
        // console.log('value  1 chaged .......');
    }


    changeaudioplayervolume(){

        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer1");
        myAudio.volume =this.value/100;
        if(this.value==0) this.ismuteaudio=true;
        else this.ismuteaudio=false;
    }

    playmusic(){
        let myAudio :any = {};
        myAudio = document.querySelector("#audioplayer1");


        this.audioDuration = myAudio.duration.toFixed(0);

        if (this.isaudioplay) {
            myAudio.pause();
            clearInterval(this.playstate);
            this.isaudioplay=false;
        } else {
            myAudio.play();
            myAudio.volume=this.value/100;
            this.playstate = setInterval(() => {

                this.value1 = (myAudio.currentTime.toFixed(0));


            }, 1000);
            this.isaudioplay=true;
        }
        myAudio.onpause = function(){
            clearInterval(this.playstate);
        };


    }

    playaudio(val:any){
        /*console.log('val');
         console.log(val);*/
        this.selectedaudio = val;

        /*   console.log('val.indexOf(this.musicdetailArray)');
         console.log(this.musicdetailArray.indexOf(val));*/
        /* console.log('this.audioplayerindex');
         console.log(this.audioplayerindex);*/
        this.chosenaudiotitle = val.title_music;

        this.audiousername = this.musicArray[0].userdata[0].firstname+' '+this.musicArray[0].userdata[0].lastname;
        if(this.audioplayerindex==this.musicArray.indexOf(val))
        {
            /* console.log('equal index ......');
             console.log('equal index ......');*/
            if(this.isaudioplay==false){
                this.playmusic();
            }
            else {
                let myAudio:any = {};
                myAudio=  document.querySelector("#audioplayer1");
                myAudio.pause();
                this.isaudioplay = false;
                return;
            }

        }
        else {
            this.audioplayerindex = this.musicArray.indexOf(val);

            this.chosenaudiourl = '';

            /* console.log('chosenaudiourl');
             console.log(this.chosenaudiourl);*/
            this.isaudioplay = false;
            setTimeout(()=> {
                this.chosenaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl + 'nodeserver/uploads/audio/' + this.pic_user_id + '/' + val.music);
            }, 100);
            this.value1 = 0;
            setTimeout(()=> {    //<<<---    using ()=> syntax

                let myAudio:any = {};
                myAudio=  document.querySelector("#audioplayer1");
                //this.audioDuration = myAudio.duration.toFixed(0);
                //myAudio.pause();
                clearInterval(this.playstate);
                /*----------for counting view -------------*/
                let link = this.serverurl+'addmusicview';
                var data = {'user_id':this.user_id,_id:val._id};
                this._http.post(link,data)
                    .subscribe(res=>{

                        let result:any = {};
                        result = res.json();
                        /*  console.log('result view');
                         console.log(result);*/
                        if(result.status=='success'){

                            this.getmusicdetails(this.pic_user_id);

                            // console.log('suceess view');
                        }
                    });

                /*-----------------------*/
                this.isaudioplay = false;
                this.value1 = 0;

                //myAudio.play();
                //this.isaudioplay=true;
                /*
                 console.log($(myAudio).length);
                 console.log($('#audioplayer1').length);*/
                // myAudio.currentTime =23;
                if (this.isaudioplay) {
                    myAudio.pause();
                    clearInterval(this.playstate);
                    this.isaudioplay = false;
                } else {
                    this.value1 = 0;
                    clearInterval(this.playstate);
                    myAudio.play();
                    this.options1 = {
                        floor: 0,
                        ceil: myAudio.duration.toFixed(0)
                    };
                    myAudio.volume=this.value/100;
                    this.audioDuration = myAudio.duration.toFixed(0);
                    //console.log('audioDuration');
                    //console.log(this.audioDuration);

                    this.playstate = setInterval(() => {
                        //console.log('in onplay interval ....');
                        //console.log(myAudio.currentTime);
                        this.value1 = (myAudio.currentTime.toFixed(0));
                        //console.log(this.value1);
                        //console.log(this.value);


                    }, 1000);
                    this.isaudioplay = true;
                }
                myAudio.onpause = function () {
                    //this.playstate.clearInterval();
                    clearInterval(this.playstate);
                };

                //this.playmusic();
            }, 1000);

        }

    }

    convertsecstoformat(totalSeconds) {
        var hours   = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        // round seconds
        seconds = Math.round(seconds * 100) / 100

        var result = (hours < 10 ? "0" + hours : hours);
        result += ":" + (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
        return result;
    }

    showmusiclike(val:any) {

        if (this.isloggedin == 1) {
            this.currentmusiclikecount = val;
            let link4 = this.serverurl + 'addvideolike';
            var data = {'user_id': this.user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    // console.log(result);
                    if (result.status == 'success') {


                        this.getmusicdetails(this.pic_user_id);
                        // console.log('suceess like');
                    }
                })

        }
    }

    showmusicunlike(val:any) {

        if (this.isloggedin == 1) {
            this.currentmusiclikecount = val;
            let link4 = this.serverurl + 'deletevideolike';
            var data = {'user_id': this.user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    // console.log(result);
                    if (result.status == 'success') {

                        this.getmusicdetails(this.pic_user_id);
                        // console.log('suceess unlike');
                    }
                })
        }
    }

    getmusicdetails(item){

        let link5= this.serverurl+'getMusiclistByUserid';
        this.pic_user_id = item;
        let dataId = {'user_id': this.pic_user_id};
        this._http.post(link5, dataId)
            .subscribe( res =>{

                let result = res.json();
                if(result.status=='success'){

                    this.musicArray = result.item;

                    if(this.musicArray.length>0  && !this.isaudioplay){

                        this.selectedaudio = this.musicArray[0];

                        if(this.audioplayerindex>0){

                            this.selectedaudio = this.musicArray[this.audioplayerindex];
                        }

                        if((this.selectedaudio.comments)==null){

                            this.selectedaudio = this.musicArray[0];
                            this.chosenaudiotitle = this.musicArray[0].title_music;
                            this.audiousername = this.musicArray[0].userdata[0].firstname+' '+this.musicArray[0].userdata[0].lastname;
                        }
                        else  {
                            for(let c1 in this.musicArray){
                                if(this.musicArray[c1]._id==this.selectedaudio._id){
                                    this.selectedaudio=this.musicArray[c1];
                                    this.chosenaudiotitle = this.musicArray[c1].title_music;
                                    this.audiousername = this.musicArray[c1].userdata[0].firstname+' '+this.musicArray[c1].userdata[0].lastname;

                                    console.log('this.selectedaudio in for loop1');
                                    console.log(this.selectedaudio);
                                    console.log('this.selectedaudio.comments.....');
                                    console.log(this.selectedaudio.comments);

                                }
                            }
                        }
                        this.chosenaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.user_id+'/'+ this.musicArray[0].music);
                        this.selectedaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.user_id+'/'+ this.musicArray[0].music);

                        if(this.musicArray[0].musiclikes[0]!=null){

                            this.currentlikecount = this.musicArray[0].musiclikes[0].vlike;
                        }
                        else {
                            this.currentlikecount = 0;
                        }

                        setTimeout(()=> {    //<<<---    using ()=> syntax
                            let myAudio:any = {};
                            myAudio=  document.querySelector("#audioplayer1");
                            this.audioDuration = myAudio.duration.toFixed(0);
                            this.value1  = 0;
                            this.options1= {
                                floor: 0,
                                ceil: myAudio.duration.toFixed(0)
                            };

                            myAudio.volume=this.value/100;

                        }, 1000);

                    }

                    this.isModalMusicShown = true;
                }
            })
    }

    changeaudioplayertimer(){
        console.log('this is timer change');
        console.log('this.value1');
        console.log(this.value1);
        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer1");
        myAudio.currentTime =this.value1;
    }


    getgenrelist1(){

        var link2 = this.serverurl+'genretrendinglist';
        this._http.get(link2)
            .subscribe(val=> {

                let result:any={};
                result = val.json();
               /* console.log('result.res');
                console.log(result.res);
                console.log('result.res.type');
                console.log(result.res[0].type);*/
                for(let i in result.res){

                    if(result.res[i].type =="Dancer"){

                        this.dancegenrearray.push(result.res[i]);
                       /* console.log('this.dancegenrearray');
                        console.log(this.dancegenrearray);*/
                    }

                    if(result.res[i].type =="Musician"){

                        this.musicgenrearray.push(result.res[i]);
                      /*  console.log('this.musicgenrearray');
                        console.log(this.musicgenrearray);*/

                    }
                }


            },error => {

                console.log('Error!!!');
            })
    }

    getstatelist(){

        let link = this.serverurl+'getusastates';
        this._http.get(link)
            .subscribe(val => {

                let result:any={};
                result = val.json();
               /* console.log('result');
                console.log('result[0].name');
                console.log(result[0].name);*/
                for (let i in result) {
                    if (result.length > 0) {

                        this.statearray.push(result[i]);
                        // console.log(this.statearray);
                    }
                    /*this.cityarray = result.*/
                }
            })
    }


    selectedstate(val:any){



        console.log('val');
        console.log(val);
        this.selectedstatearray.push(val);
        this.selectedstatesearcharray.push(val.abbreviation);
        console.log(this.selectedstatesearcharray);
    }
    removeselectedstate(vals:any){

        let index = this.selectedstatearray.indexOf(vals);
        console.log('index');
        console.log(index);
        this.selectedstatearray.splice(index,1);
        this.selectedstatesearcharray.splice(index,1);
        this.getSearchedValueByQuery();

    }
    selectedgenre(valm:any){
        console.log('valm');
        console.log(valm);
        this.selectedgenrearray.push(valm);

        }

    removeselectedgenre(vals:any){


       /* console.log('vals');
        console.log(vals);*/
        let index = this.selectedgenrearray.indexOf(vals);
       /* console.log('index');
        console.log(index);*/
        this.selectedgenrearray.splice(index,1);
       /* this.selectedgenrearray.splice(vals);

        console.log('vals..');
        console.log(vals);*/
        /*console.log('vals..');
        console.log(vals);*/
    }




    getartistlist(){
        this.showLoader = 1;
        var link= this.serverurl+'trendingArtistList';
        this._http.get(link)
            .subscribe(res => {
                let result:any={};
                result = res.json();

                this.userlist = result.id;
                console.log('userlist');
                console.log(this.userlist);
                this.showLoader = 0;
               /*
                console.log("result");
                console.log(result);
                console.log('userlist');
                console.log(this.userlist);
                console.log(this.userlist[1].fullname);
                console.log(this.userlist[1].musicians);*/

            },error => {
                console.log("Oooops!");
            });

        // if(this.userlist.musicians == 1){
        //         let link=this.serverurl+'genrelist';
        //         let data = {'type':'active','musicians':1,'model':0,'dancer':0};
        //
        //         this._http.post(link,data)
        //             .subscribe(res => {
        //                 let result1 = res.json();
        //
        //                 this.genrelist = result1.res;
        //                 console.log('this.genrelist');
        //                 console.log(this.genrelist);
        //             }, error => {
        //                 console.log("Oooops!");
        //             });
        //     }

            // if(this.dancer == 1){
            //     let link=this.serverurl+'genrelist';
            //     let data = {'type':'active','musicians':0,'model':0,'dancer':1};
            //
            //     this._http.post(link,data)
            //         .subscribe(res => {
            //             let result1 = res.json();
            //             this.genrelist1 = result1.res;
            //         }, error => {
            //             console.log("Oooops!");
            //         });
            // }
    }




    showgenremodal(){

        this.isGenreModalShown = 1;
    }
    showstatemodal(){

        this.isStateModalShown = 1;
    }
    showcitymodal(){

        this.isCityModalShown = 1;
    }
    showzipmodal(){

        this.isZipcodeModalShown = 1;
    }


    citysubmit(formval){

        for (let x in this.cityForm.controls) {

            this.cityForm.controls[x].markAsTouched();


        }
        console.log('this.cityForm.valid');
        console.log(this.cityForm.valid);
        if(this.cityForm.valid){

            this.cityarray.push(formval);
            console.log('this.cityarray');
            console.log(this.cityarray);
            this.selectedcityarray.push(formval);
            this.selectedcitysearcharray.push(formval.cityname);
            console.log(' this.selectedcitysearcharray');
            console.log( this.selectedcitysearcharray);
            this.cityForm.reset();

        }
    }

    ZipCodeSubmit(formval){

        for (let x in this.zipcodeForm.controls) {

            this.zipcodeForm.controls[x].markAsTouched();


        }
        console.log('this.zipcodeForm.valid');
        console.log(this.zipcodeForm.valid);
        if(this.zipcodeForm.valid){

            this.zipcodearray.push(formval);
            console.log('this.zipcodearray');
            console.log(this.zipcodearray);
            this.selectedzipcodearray.push(formval);
            this.selectedzipsearcharray.push(formval.zipcode);
            console.log(' this.selectedzipsearcharray');
            console.log( this.selectedzipsearcharray);
            this.zipcodeForm.reset();

        }
    }

    removeselectedcity(vals:any){


        let index = this.selectedcityarray.indexOf(vals);
        this.selectedcityarray.splice(index,1);
        this.selectedcitysearcharray.splice(index,1);
        console.log(' this.selectedcityarray');
        console.log( this.selectedcityarray);
        this.getSearchedValueByQuery();

    }
    removeselectedzip(vals:any){


        let index = this.selectedzipcodearray.indexOf(vals);
        this.selectedzipcodearray.splice(index,1);
        this.selectedzipsearcharray.splice(index,1);
        console.log(' this.selectedzipcodearray');
        console.log( this.selectedzipcodearray);
        this.getSearchedValueByQuery();

    }



    /*ngAfterViewChecked(){

        //setTimeout(()=> {    //<<<---    using ()=> syntax
            $('.gn5').each(function () {
                let htmlval=$(this).find('.genretextintrending').html();
                console.log('htmlval');
                console.log(htmlval);
                console.log($(this).html());
                console.log($(this).find('.genretextintrending').length);
                //$(this).html(htmlval.substr(0,(htmlval.length-1)));
            });
        //}, 500);


       /!* let htmlval=$('.genretextintrending').html();
        console.log('htmlval');
        console.log(htmlval);*!/
        //$('.genretextintrending').html(htmlval.substr(0,(htmlval.length-1)));
    }*/

    getgenrelist(item){
        // console.log('genre text called');
        if (item.length==0)
        return 'N/A';
        else {
            let genretext='';
            for(let x in item){

                for(let y in item[x].genredetail){

                    genretext+=item[x].genredetail[y]['genrename']+',';
                }
                /*console.log('genretext');
                console.log(genretext);*/
            }
            genretext=genretext.substr(0,genretext.length-1);
            return genretext;
        }
    }


    imgPath(img){

        return 'https://audiodeadline.com/nodeserver/uploads/'+img;
    }

    getSearchedValueByQuery(){

        let link = this.serverurl+'getsearchedvalue';
        let data = {'state':this.selectedstatesearcharray,'zip':this.selectedzipsearcharray,'city':this.selectedcitysearcharray,'fan':0};
        this._http.post(link,data)
            .subscribe(res=>{

                let result:any={};
                result= res.json();
                console.log('result');
                console.log(result);
                this.commonsearcharray=result.item;
                // this.commonsearcharray.push(result);
                console.log('this.commonsearcharray');
                console.log(this.commonsearcharray);

                /*this.isStateModalShown = 0;
                this.isCityModalShown = 0;
                this.isZipcodeModalShown = 0;
*/
            })
    }

    getPictureDetails(item){

        let link10= this.serverurl+'getPictureListByUserid';
        this.pic_user_id = item;
        let dataID = {'user_id': item};
        console.log('dataID');
         console.log(dataID);

        this._http.post(link10,dataID)
            .subscribe(res=> {
                let result = res.json();
                if(result.status=='success') {

                    /*
                     console.log('picmodal result');
                     console.log(result);*/
                    this.picArray = result.item;
                     console.log('this.picArray');
                     console.log(this.picArray);
                    this.isPicModalShow = 1;

                    for(let i in this.picArray){
                        this.showcommentmodal(i);
                    }

                    if (this.picArray.length > 0) {


                        if(this.selectedpost.comments == null)this.selectedpost = this.picArray[0];

                        if (this.picArray[0].picturelikes[0] != null) {

                            this.currentpicturelikecount = this.picArray[0].picturelikes[0].vlike;
                        }
                        else {
                            this.currentpicturelikecount = 0;
                        }
                        if (this.tabselectedpictureindex > 0) {

                            this.selectedpost = this.picArray[this.tabselectedpictureindex];
                        }


                        if ((this.selectedpost.comments) == null) {

                            this.selectedpost = this.picArray[0];

                        }
                        else {
                            for (let c1 in this.picArray) {
                                if (this.picArray[c1]._id == this.selectedpost._id) {
                                    this.selectedpost = this.picArray[c1];


                                }
                            }
                        }

                    }
                }

            })
    }

    showpicturelike(val:any) {
        if (this.isloggedin==1) {
            this.currentpicturelikecount = val;
            let link4 = this.serverurl + 'addvideolike';
            var data = {'user_id': this.user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {


                    var result = res.json();
                    // console.log(result);
                    if (result.status == 'success') {

                        this.getPictureDetails(this.pic_user_id);

                        /* console.log('this.tabselectedpictureindex');
                         console.log(this.tabselectedpictureindex);*/

                        if (this.tabselectedpictureindex > 0) {
                            // console.log('selected picture index block');

                            // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                            this.selectedpicture = this.picArray[this.tabselectedpictureindex];
                        }
                        // console.log('suceess like');


                    }
                })

        }
    }

    getlikeonstatus(val:any){
        //console.log('getlikeonstatus .......');
        //console.log(val);
        if(val.length==0) return false;
        else {
            for(let x in val){

                if(this.user_id==val[x].user_id) return true;
            }


        }
        return false ;
    }

    showpictureunlike(val:any) {

        if (this.isloggedin == 1) {
            this.currentpicturelikecount = val;
            let link4 = this.serverurl + 'deletevideolike';
            var data = {'user_id': this.user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    // console.log(result);
                    if (result.status == 'success') {

                        this.getPictureDetails(this.pic_user_id);

                    }
                })
        }
    }

    scrollleft(){

        if(this.piclimitstart<1)
        {
            this.piclimitend = 1;
            this.piclimitstart = 0;
        }else {
            this.piclimitend -= 1;
            this.piclimitstart -= 1;
        }


    }
    scrollright(){
        if(this.piclimitstart<this.picArray.length) {
            this.piclimitend += 1;
            this.piclimitstart += 1;
        }


    }

    showcommentmodal(val:any){
        this.selectedpicture = val;
        this.selectedpost = val;


    }

    addcomment(val:any){


        if(val.keyCode==13 && !val.shiftKey && this.commentval.length>0){

            let link = this.serverurl+'addcomment';
            let data = {'post_id': this.selectedpost._id,'user_id':this.pic_user_id, 'comment':this.commentval};
             console.log('data');
             console.log(data);
            this._http.post(link, data)
                .subscribe(val =>{

                    var res = val.json();

                        this.getPictureDetails(this.pic_user_id);
                        this.getmusicdetails(this.pic_user_id);
                        this.getVideoDetails(this.pic_user_id);

                    // this.selectedaudio.comments=res.item;
                    // this.selectedpost.comments=res.item;
                    this.commentval='';






                })
        }
    }

    onHidden(){
        this.isCityModalShown = 0;
        this.isZipcodeModalShown = 0;
        this.isGenreModalShown = 0;
        this.isStateModalShown = 0;
        this.isPicModalShow = 0;
        this.ismodalcomment = 0;
        this.isModalMusicShown= false;
        this.isModalVideoShown= false;


    }

}
