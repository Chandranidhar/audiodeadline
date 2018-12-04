import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
import { FacebookService, InitParams,UIParams, UIResponse } from 'ngx-facebook';

declare var $:any;
declare var moment: any;

@Component({
  selector: 'app-trendingmedia',
  templateUrl: './trendingmedia.component.html',
  styleUrls: ['./trendingmedia.component.css'],
  providers: [Commonservices]
})
export class TrendingmediaComponent implements OnInit,AfterViewInit {
  @ViewChild('gsharelink') gsharelink: ElementRef;

  /*for share popover*/
  html: string = `
<div class="socialmediaicons socialmediaicons2">
                <a class="fa fa-facebook fbsharelink slink"></a>
              <a href="javascript:void(0)" class="fa fa-twitter twittersharelink slink"></a>
              <a href="javascript:void(0)" class="fa fa-google googlesharelink slink"></a>
              <a href="javascript:void(0)" class="fa fa-linkedin linkedinsharelink slink"></a> 
             <a href="javascript:void(0)" class="fa fa-tumblr tumblrsharelink slink"></a>
             </div>
`;

  public userdata: CookieService;
  public siteurl;
  public serverurl;
  public user_name;
  public user_id;
  public scrolled:any=0;
  public videodetailArray:any=[];
  public currentvideoidtrending:any='';
  public currentvideotypetrending:any;
  public choosenvideourlfortrending:any;
  public videoplayfag:any=false;
  public isloggedin:any=0;
  public currentlikecount:any=0;
  public selectedvideo:any;
  public selectedvideoindex:any=0;
  public selectedpost:any={};
  public commentval:any='';
  public selectedvideotrending:any={};
  public image;
  public playstatetrending:any;
  public generalshareurl:any='';
  public generalshareurlold:any='0';
  public generalshareurloldtype:any='0';
  public shareflag:any;
  public selectedsharedpost:any;

  public value2:any=0;
  public value3:any=0;
  public options2;
  public options3;
  public musicdetailArray:any=[];
  public chosenaudiourlfortrending:any='';
  public chosenaudiotitletrending:any;
  public audiousernamefortrending:any;
  private audioplayerindextrending:any=0;
  public audioDurationfortrending:any='';
  public isaudioplayfortrending:boolean=false;
  public ismuteaudiotrending:boolean = false;
  public shuffleflag2:boolean = false;
  public oldvolumetrending:any=0;
  public currentmusiclikecount:any=0;
  public selectedmusictrending:any={};
  public selectedmusictrendinguserid:any;

  public real_name;
  public picturedetailArray:any=[];
  public selectedpictureindex:any=0;
  public selectedpicture:any={};
  public currentpicturelikecount:any=0;
  public isModalPicDetail:boolean= false;
  public selectedpictureuserid:any='';
  public ismodalcomment:any = 0;
  public lastsharetime:any=0;

  constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices,private sanitizer: DomSanitizer,public FBS: FacebookService) {


    this.userdata = userdata;
    this.serverurl=_commonservices.url;
    this.siteurl=_commonservices.siteurl;
    this.ismodalcomment  = 0;

    this.value2=0;                      //trending audio duration slider
    this.options2= {
      floor: 0,
      ceil: 200
    };
    this.value3=75;                      //trending volume slider
    this.options3= {
      floor: 0,
      ceil: 100
    };

    this.user_name = this.userdata.get('user_name');
    this.user_id = this.userdata.get('user_id');
    this.image = this.userdata.get('image');
    this.real_name = this.userdata.get('real_name');
    if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')
      this.isloggedin=1;

    let initParams: InitParams = {
      appId: '2034821446556410',
      xfbml: true,
      version: 'v2.8'
    };

    FBS.init(initParams);

  }
  ngAfterViewInit(){

  }

  ngOnInit() {

    this.getallvideo();
    this.getallmusic();
    this.getallpicture();

    this.playstatetrending = setInterval(() => {

      this.getallvideo();


    }, 15000);
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

  getallvideo(){


    let link4= this.serverurl+'trendingVideoList';
    this._http.get(link4)
        .subscribe(res =>{

          let result = res.json();
          if(result.status=='success'){
/*
            console.log('video result 12');
            console.log(result);*/
            let oldvideodetailarray=this.videodetailArray;
            this.videodetailArray=result.item;



            if( this.videodetailArray.length>0 && !this.videoplayfag){
              this.currentvideoidtrending=this.videodetailArray[0]._id;
              //this.selectedvideotrending=this.videodetailArray[0];
             /* console.log('this.selectedvideotrending.comments');
              console.log(this.selectedvideotrending.comments);*/


              if(this.videodetailArray[0].type=='vimeo'){
                let tempvurl=this.videodetailArray[0].videoUrl;
                let vimeourl = tempvurl.split('/');
                let videoid = vimeourl[vimeourl.length - 1];
                /*console.log('videoid ......');
                console.log(videoid);*/

                if((this.selectedvideotrending.comments)==null){
                  this.currentvideotypetrending='vimeo';
                  this.choosenvideourlfortrending = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);
                }
              }
              if(this.videodetailArray[0].type=='youtube' && !this.videoplayfag) {
                let videourl = this.videodetailArray[0].videoUrl.split('v=');
                let videoid = videourl[videourl.length - 1];
                if((this.selectedvideotrending.comments)==null){
                  this.choosenvideourlfortrending=videoid;
                  this.currentvideotypetrending='youtube';
                }
              }



              /* if(this.videoplayerindex>0 && (this.selectedvideo.comments)==null){

               this.selectedvideo = this.videoArray[this.videoplayerindex];
               }*/



              if((this.selectedvideotrending.comments)==null) {
                // console.log('in null block ...');
                this.selectedvideotrending = this.videodetailArray[0];
              }
              else{

                /*console.log('this.selectedvideotrending');
                console.log(this.selectedvideotrending);*/
                for(let c1 in this.videodetailArray){
                  if(this.videodetailArray[c1]._id==this.selectedvideotrending._id){
                    this.selectedvideotrending=this.videodetailArray[c1];
                    if(this.selectedpost._id==this.selectedvideotrending._id)this.selectedpost=this.videodetailArray[c1];
                  }
                }

              }
            }
            if( this.videodetailArray.length>0 && this.videoplayfag){
              for(let c1 in this.videodetailArray){
                if(this.videodetailArray[c1]._id==this.selectedvideotrending._id){
                  this.selectedvideotrending=this.videodetailArray[c1];
                  if(this.selectedpost._id==this.selectedvideotrending._id)this.selectedpost=this.videodetailArray[c1];
                }
              }
            }
            for (let x1 in this.videodetailArray){
              if(this.videodetailArray[x1].type=='vimeo' && !this.videoplayfag){
                let tempvurl=this.videodetailArray[x1].videoUrl;
                let vimeourl = tempvurl.split('/');
                let videoid = vimeourl[vimeourl.length - 1];
                this._http.get('https://vimeo.com/api/v2/video/'+videoid+'.json')
                    .subscribe(res => {
                      var result = res.json();
                    /*  console.log('vimeo json result ....');
                      console.log(result);
                      console.log(result[0].thumbnail_large);*/
                      this.videodetailArray[x1].thumbnail=result[0].thumbnail_large;

                    }, error => {
                      // console.log("Oooops!");
                    });
              }
            }

          }
        })
  }

  playthumbtrending(item:any){            // playing the thumbnail video

    this.currentvideotypetrending='';
    this.selectedvideotrending = item;
    this.currentvideoidtrending=item._id;
    //this.currentvideotype='youtube';
    if(item.type=='vimeo'){

      let vimeourl = item.videoUrl.split('/');
      let videoid = vimeourl[vimeourl.length - 1];
     /* console.log('videoid ......');
      console.log(videoid);*/
      this.currentvideotypetrending='vimeo';
      this.choosenvideourlfortrending = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

    }
    if(item.type=='youtube') {
      setTimeout(()=> {    //<<<---    using ()=> syntax
        let videourl = item.videoUrl.split('v=');
        let videoid = videourl[videourl.length - 1];
        this.choosenvideourlfortrending=videoid;
      /*  console.log('videoid');*/
        this.currentvideotypetrending='youtube';
       /* console.log(videoid);*/
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

  onStateChangetrending(event){
    /*console.log('event ....');
    console.log(event);*/
    this.videoplayfag=true;
    if(event.data == -1){
      var link2= this.serverurl+'addvideoviews';
      var data = {'user_id':this.user_id,videoid:this.currentvideoidtrending};
      // console.log('username');
      //console.log(data.username);
      this._http.post(link2, data)
          .subscribe(res => {
            var result = res.json();
            console.log(result.item);
            if(result.status=='success'){
              //this.getVideoDetails();
              this.getallvideo();
            }
          }, error => {
            console.log("Oooops!");
          });

      this.getallvideo();
    }
    if(event.data==0){
      this.videoplayfag=true;
      this.getallvideo();
    }
  }

  unixtodatetimeConverter(flag,UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = (months[a.getMonth()]);
    if(month.toString().length==1) month='0'+month;
    var date = (a.getDate());
    if(date<10) var dates='0'+date.toString();
    else var dates=date.toString();
    var hours = (a.getHours());
    if(hours<10) var hour='0'+hours;
    else var hour=hours.toString();
    var min = (a.getMinutes());
    if(min.toString().length==1) var mins='0'+min;
    else var mins=min.toString();
    var sec = (a.getSeconds());
    if(sec.toString().length==1) var secs='0'+sec;
    else var secs=sec.toString();
    var ampm = ((hours) >= 12) ? "PM" : "AM";
    if( flag==0)var time = month + '-' + dates + '-'+year ;
    if( flag==1)var time  =  hour + ':' + mins + ':' + secs+ " "+ampm ;
    return time;
  }

  showvideolike(val:any) {
    if (this.isloggedin == 1) {
      this.currentlikecount = val;
      let link4 = this.serverurl + 'addvideolike';
      var data = {'user_id': this.user_id, videoid: val._id};
      this._http.post(link4, data)
          .subscribe(res=> {

            var result = res.json();
            // console.log(result);
            if (result.status == 'success') {


              this.getallvideo();
              // console.log('suceess like');
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
            // console.log(result);
            if (result.status == 'success') {


              this.getallvideo();
              // console.log('suceess unlike');
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

  addcomment(val:any){

    /*console.log('val');
    console.log(val);

    console.log(val.keyCode);
    console.log(val.shiftKey);*/
    if(val.keyCode==13 && !val.shiftKey && this.commentval.length>0){

      // console.log('submit comment here ....');
      let link = this.serverurl+'addcomment';
      let data = {'post_id': this.selectedpost._id,'user_id':this.user_id, 'comment':this.commentval};

      this._http.post(link, data)
          .subscribe(val =>{

            var res = val.json();


            this.getallpicture();

            this.getallmusic();

            this.getallvideo();


            this.commentval='';

          })
    }
  }

  changeaudioplayertimertrending(){
    /*console.log('this is timer change');
    console.log('this.value2');
    console.log(this.value2);*/
    let myAudio:any = {};
    myAudio=  document.querySelector("#audioplayer4");
    myAudio.currentTime =this.value2;
  }

  playbackwardffortrending(){
    let indexval=0;
    if(this.shuffleflag2==true){

      this.playshufflefortrending();
    }else
    {
      if(this.audioplayerindextrending> 0 )
        indexval=this.audioplayerindextrending-1;
      else {
        this.audioplayerindextrending = 0;
      }
      this.isaudioplayfortrending = false;
      this.playaudiotrending(this.musicdetailArray[indexval]);
    }


  }


  playforwardfortrending(){
    let indexval=0;
    if(this.shuffleflag2==true){
      this.playshufflefortrending();
    }else {
      if(this.audioplayerindextrending <this.musicdetailArray.length)

        indexval=this.audioplayerindextrending+1;
      else {
        this.audioplayerindextrending = this.musicdetailArray.length;
      }

      this.isaudioplayfortrending = false;
      this.playaudiotrending(this.musicdetailArray[indexval]);
    }

  }

  playshufflefortrending() {

    let randomVal = this.getRandomInt(0,this.musicdetailArray.length);
    this.playaudiotrending(this.musicdetailArray[randomVal]);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffleontrending(){

    this.shuffleflag2 = true;
  }

  shuffleofftrending(){

    this.shuffleflag2 = false;
  }

  setval1(){
    // console.log('value  1 chaged .......');
  }
  convertunixtotimeago(val:any){
    return moment.unix(val).startOf('minute').fromNow();

  }

  getallmusic(){


    let link4= this.serverurl+'trendingMusicList';
    this._http.get(link4)
        .subscribe(res =>{

          let result = res.json();
          if(result.status=='success'){
            /*
             console.log('result');
             console.log(result);*/
            this.musicdetailArray=result.item;

            /*console.log('this.musicdetailArray');
             console.log(this.musicdetailArray);
             console.log('this.musicdetailArray[4].userdata[0].firstname');
             console.log(this.musicdetailArray[0].userdata[0].firstname+' '+this.musicdetailArray[0].userdata[0].lastname);*/
            if(this.musicdetailArray.length>0 && !this.isaudioplayfortrending){

              this.selectedmusictrending = this.musicdetailArray[0];

              if(this.audioplayerindextrending>0){

                this.selectedmusictrending = this.musicdetailArray[this.audioplayerindextrending];
              }

              this.chosenaudiourlfortrending = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.musicdetailArray[0].user_id+'/'+ this.musicdetailArray[0].music);


              if((this.selectedmusictrending.comments)==null){

                this.selectedmusictrending = this.musicdetailArray[0];
                this.chosenaudiotitletrending = this.musicdetailArray[0].title_music;
                this.audiousernamefortrending = this.musicdetailArray[0].userdata[0].firstname+' '+this.musicdetailArray[0].userdata[0].lastname;
              }
              else  {
                for(let c1 in this.musicdetailArray){
                  if(this.musicdetailArray[c1]._id==this.selectedmusictrending._id){
                    this.selectedmusictrending=this.musicdetailArray[c1];
                    this.chosenaudiotitletrending = this.musicdetailArray[c1].title_music;
                    this.audiousernamefortrending = this.musicdetailArray[c1].userdata[0].firstname+' '+this.musicdetailArray[c1].userdata[0].lastname;


                 /*   console.log('this.selectedmusictrending in for loop1');
                    console.log(this.selectedmusictrending);
                    console.log('this.selectedmusictrending.comments.....');
                    console.log(this.selectedmusictrending.comments);*/
                  }
                }
              }

              /* for(let c1 in this.musicdetailArray){
               if(this.musicdetailArray[c1]._id==this.selectedmusictrending._id){
               this.selectedmusictrending=this.musicdetailArray[c1];

               console.log('this.selectedmusictrending in for loop2');
               console.log(this.selectedmusictrending);
               }
               }*/

              // this.chosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

              /* this.chosenaudiotitletrending = this.musicdetailArray[0].title_music;
               this.audiousernamefortrending = this.musicdetailArray[0].userdata[0].firstname+' '+this.musicdetailArray[0].userdata[0].lastname;*/


              setTimeout(()=> {    //<<<---    using ()=> syntax
                let myAudio:any = {};
                myAudio=  document.querySelector("#audioplayer4");
                this.audioDurationfortrending = myAudio.duration.toFixed(0);
                this.value2  = 0;
                this.options2= {
                  floor: 0,
                  ceil: myAudio.duration.toFixed(0)
                };

                /*console.log('$(myAudio).length');
                 console.log($(myAudio).length);
                 console.log($('#audioplayer4').length);

                 console.log('myAudio');
                 console.log(myAudio);
                 console.log(myAudio.duration);*/
                myAudio.volume=this.value3/100;
                //this.value=75;
                /* console.log('audioDuration for first time loading');
                 console.log(this.audioDurationfortrending);*/
              }, 1000);


            }

          }
        })
  }

  playmusicfortrending(){
    let myAudio :any = {};
    myAudio = document.querySelector("#audioplayer4");
   /* console.log('$(myAudio).length');
    console.log($(myAudio).length);
    console.log($('#audioplayer4').length);

    console.log('myAudio');
    console.log(myAudio);
    console.log(myAudio.duration);*/

    this.audioDurationfortrending = myAudio.duration.toFixed(0);
   /* console.log('audioDurationfortrending');
    console.log(this.audioDurationfortrending);*/
    // myAudio.currentTime =23;
    if (this.isaudioplayfortrending) {
      myAudio.pause();
      clearInterval(this.playstatetrending);
      this.isaudioplayfortrending=false;
    } else {
      myAudio.play();
      myAudio.volume=this.value3/100;
      this.playstatetrending = setInterval(() => {
       /* console.log('in onplay interval ....');
        console.log(myAudio.currentTime);*/
        this.value2 = (myAudio.currentTime.toFixed(0));
        // console.log(this.value2);
        //this.setaudiotimer(Math.ceil(myAudio.currentTime));
        // console.log(this.value3);


      }, 1000);
      this.isaudioplayfortrending=true;
    }
    myAudio.onpause = function(){
      //this.playstatetrending.clearInterval();
      clearInterval(this.playstatetrending);
    };


  }

  muteaudiotrending(){
    this.value3=0;
    let myAudio:any = {};
    myAudio=  document.querySelector("#audioplayer4");
    this.oldvolumetrending=myAudio.volume;
    myAudio.volume =0;
    this.ismuteaudiotrending = true;

  }

  unmuteaudiotrending(){

    let myAudio:any = {};
    myAudio=  document.querySelector("#audioplayer4");
    myAudio.volume = this.oldvolumetrending;
    this.ismuteaudiotrending = false;
    this.value3 = this.oldvolumetrending*100;
   /* console.log(this.value3);
    console.log(this.oldvolumetrending);
    console.log(myAudio.volume);*/


  }

  playaudiotrending(val:any){
    /*console.log('val');
     console.log(val);
     console.log('val.userdata[0].firstname');
     console.log(val.userdata[0].firstname);*/
    this.chosenaudiotitletrending = val.title_music;
    this.audiousernamefortrending = val.userdata[0].firstname+' '+val.userdata[0].lastname;
    this.selectedmusictrending= val;
    /*console.log('this.selectedmusictrending');
    console.log(this.selectedmusictrending);*/
    this.selectedmusictrendinguserid = val.user_id;

    if(this.audioplayerindextrending==this.musicdetailArray.indexOf(val))
    {
      /*console.log('equal index ......');
       console.log('equal index ......');*/
      if(this.isaudioplayfortrending==false){


        this.playmusicfortrending();
        /* let link = this.serverurl+'addmusicview';
         var data = {'user_id':this.user_id,_id:val._id};
         this._http.post(link,data)
         .subscribe(res=>{

         let result:any = {};
         result = res.json();
         console.log('result view');
         console.log(result);
         if(result.status=='success'){

         // this.getallmusic();

         console.log('suceess view');
         }
         });*/

      }
      else {
        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer4");
        myAudio.pause();
        this.isaudioplayfortrending = false;
        return;
      }

    }
    else {
      clearInterval(this.playstatetrending);
      this.isaudioplayfortrending = false;
      this.value2 = 0;
      this.audioplayerindextrending = this.musicdetailArray.indexOf(val);

      /*----------for counting view -------------*/
      let link = this.serverurl+'addmusicview';
      var data = {'user_id':this.user_id,_id:val._id};
      this._http.post(link,data)
          .subscribe(res=>{

            let result:any = {};
            result = res.json();
           /* console.log('result view');
            console.log(result);*/
            if(result.status=='success'){

              this.getallmusic();

              // console.log('suceess view');
            }
          });

      /*-----------------------*/
      this.chosenaudiourlfortrending = '';

      /* console.log('chosenaudiourlfortrending');
       console.log(this.chosenaudiourlfortrending);*/
      this.isaudioplayfortrending = false;
      setTimeout(()=> {
        clearInterval(this.playstatetrending);
        this.isaudioplayfortrending = false;
        this.value2 = 0;
        this.chosenaudiourlfortrending = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl + 'nodeserver/uploads/audio/' + val.user_id + '/' + val.music);
      }, 100);
      this.value2 = 0;
      setTimeout(()=> {    //<<<---    using ()=> syntax

        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer4");
        clearInterval(this.playstatetrending);
        this.isaudioplayfortrending = false;
        this.value2 = 0;

        //myAudio.play();
        //this.isaudioplay=true;

        /*console.log($(myAudio).length);
        console.log($('#audioplayer4').length);*/

        if (this.isaudioplayfortrending) {
          myAudio.pause();
          clearInterval(this.playstatetrending);
          this.isaudioplayfortrending = false;
        } else {
          this.value2 = 0;
          clearInterval(this.playstatetrending);
          myAudio.play();
          this.options2 = {
            floor: 0,
            ceil: myAudio.duration.toFixed(0)
          };
          myAudio.volume=this.value3/100;
          this.audioDurationfortrending = myAudio.duration.toFixed(0);
          //console.log('audioDuration');
          //console.log(this.audioDuration);

          this.playstatetrending = setInterval(() => {
            //console.log('in onplay interval ....');
            //console.log(myAudio.currentTime);
            this.value2 = (myAudio.currentTime.toFixed(0));
            //console.log(this.value1);
            //console.log(this.value);


          }, 1000);
          this.isaudioplayfortrending = true;
        }
        myAudio.onpause = function () {
          //this.playstate.clearInterval();
          clearInterval(this.playstatetrending);
        };

        //this.playmusic();
      }, 1000);

    }

  }

  changeaudioplayervolumetrending(){

    let myAudio:any = {};
    myAudio=  document.querySelector("#audioplayer4");
    myAudio.volume =this.value3/100;
    if(this.value3==0) this.ismuteaudiotrending=true;
    else this.ismuteaudiotrending=false;
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


              this.getallmusic();
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

              this.getallmusic();
              // console.log('suceess unlike');
            }
          })
    }
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


              this.getallpicture();
              // console.log('this.tabselectedpictureindex');
              // console.log(this.tabselectedpictureindex);
              if (this.selectedpictureindex > 0) {
                console.log('selected picture index block');

                // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                this.selectedpicture = this.picturedetailArray[this.selectedpictureindex];
              }
              /*  if (this.tabselectedpictureindex > 0) {
               console.log('selected picture index block');

               this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
               this.selectedpicture = this.picArray[this.tabselectedpictureindex];
               }*/
              // console.log('suceess like');


            }
          })

    }
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

              // this.getPictureDetails();
              this.getallpicture();
              // console.log('suceess unlike');
            }
          })
    }
  }

  showpicturedetail(val:any){
    // this.selectedpictureobject = val;

    this.selectedpicture = val;
    this.selectedpost = val;
   /* console.log('this.selectedpicture');
    console.log(this.selectedpicture);*/
    this.isModalPicDetail = true;
    /* console.log('this.picturedetailArray');
     console.log(this.picturedetailArray);
     console.log('this.picturedetailArray[0].user_id');
     console.log(this.picturedetailArray[0].user_id);*/
    this.selectedpictureindex = this.picturedetailArray.indexOf(val);
    /* this.tabselectedpictureindex = this.picArray.indexOf(val);*/
    /* console.log('this.selectedpictureindex');
     console.log(this.selectedpictureindex); */
    console.log('this.tabselectedpictureindex');
    /*console.log(this.tabselectedpictureindex);*/

    this.selectedpictureuserid= val.user_id;
    let link3 = this.serverurl+'addpicview';
    var data = {'user_id':this.user_id,_id:val._id};
    this._http.post(link3,data)
        .subscribe(res=> {

          var result = res.json();
        /*  console.log(result);*/
          if(result.status=='success'){

            /*this.getPictureDetails();*/
            this.getallpicture();
            /*console.log('suceess');*/
          }
        })
  }

  getallpicture(){


    let link4= this.serverurl+'trendingPictureList';
    this._http.get(link4)
        .subscribe(res =>{

          let result = res.json();
          if(result.status=='success') {

            /*console.log('result');
            console.log(result);*/
            this.picturedetailArray = result.item;

            if (this.picturedetailArray.length > 0) {

              if(this.selectedpost.comments == null)this.selectedpost = this.picturedetailArray[0];

              if (this.selectedpictureindex > 0) {
                // console.log('selected picture index block');

                // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                this.selectedpost = this.picturedetailArray[this.selectedpictureindex];
              }
              if ((this.selectedpost.comments) == null) {

                this.selectedpost = this.picturedetailArray[0];

              }
              else {
                for (let c1 in this.picturedetailArray) {
                  if (this.picturedetailArray[c1]._id == this.selectedpost._id) {
                    this.selectedpost = this.picturedetailArray[c1];
                    /* this.chosenaudiotitle = this.musicArray[c1].title_music;
                     this.audiousername = this.musicArray[c1].userdata[0].firstname+' '+this.musicArray[c1].userdata[0].lastname;*/

                    /*console.log('this.selectedpicture in for loop1');
                    console.log(this.selectedpost);
                    console.log('this.selectedpicture.comments.....');
                    console.log(this.selectedpost.comments);*/

                  }
                }
              }



            }
          }
        })
  }

  onHidden(){

    this.isModalPicDetail = false;
    this.ismodalcomment = false;
  }

  fbshare(type:any,item:any) {

    let currenttime =new Date().getTime();
    let options: any = {};

    if( type=='trendingaudio'){

      options = {
        method: 'share',

        href: 'http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id
      };

    }
    if(type=='trendingvideo'){

      options = {
        method: 'share',

        href: 'http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id
      };


    }
    if(type=='picture'){

      options = {
        method: 'share',
        // href: 'http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75'
        href: 'http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id
      };
    }

    setTimeout(()=> {
      //alert(currenttime - this.lastsharetime);
      //console.log('currenttime - this.lastsharetime');
      //console.log(currenttime - this.lastsharetime);

      if (currenttime - this.lastsharetime > 5000) {
        this.FBS.ui(options)
            .then((res: UIResponse) => {
              console.log('Got the users profile', res);
            })
            .catch(this.handleError);
        this.lastsharetime = currenttime;
      }

    },700);

  }

  private handleError(error) {
    console.error('Error processing action', error);
  }

  ngAfterViewChecked(){

    let children = document.getElementsByClassName("fbsharelink");

    for (let i = 0; i < children.length; i++) {
      children[i].addEventListener("click", (event: Event) => {
        //alert("Hello world!");

        this.fbshare(this.shareflag,this.selectedsharedpost);
      });
    }

    let children1 = document.getElementsByClassName("twittersharelink");

    for (let i1 = 0; i1 < children1.length; i1++) {
      children1[i1].addEventListener("click", (event: Event) => {
        //alert("Hello 112!");

        this.generalshare(this.shareflag,'twitter');
      });
    }

    let children2 = document.getElementsByClassName("googlesharelink");

    for (let i2 = 0; i2 < children2.length; i2++) {
      children2[i2].addEventListener("click", (event: Event) => {

        this.generalshare(this.shareflag,'google');
      });
    }

    let children3 = document.getElementsByClassName("linkedinsharelink");

    for (let i3 = 0; i3 < children3.length; i3++) {
      children3[i3].addEventListener("click", (event: Event) => {

        this.generalshare(this.shareflag,'linkedin');
      });
    }

    let children4 = document.getElementsByClassName("tumblrsharelink");

    for (let i4 = 0; i4 < children4.length; i4++) {
      children4[i4].addEventListener("click", (event: Event) => {

        this.generalshare(this.shareflag,'tumblr');
      });
    }

  }

  generalshare(type:any,stype:any){
    if(this.generalshareurlold!=this.generalshareurl || this.generalshareurloldtype!=stype) {

      if (stype == 'twitter' && type == 'trendingvideo') {

        this.generalshareurl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);


      }
      if (stype == 'twitter' && type == 'picture') {
        this.generalshareurl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);


      }
      /*  if(stype=='twitter' && type=='trendingpicture') {
       console.log('this.selectedaudio');
       console.log(this.selectedsharedpost._id);
       console.log(this.selectedsharedpost.user_id);
       this.generalshareurl = 'https://twitter.com/intent/tweet?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

       }*/

      if (stype == 'twitter' && type == 'trendingaudio') {

        this.generalshareurl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }


      if (stype == 'google' && type == 'trendingvideo') {

        this.generalshareurl = 'https://plus.google.com/share?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }
      if (stype == 'google' && type == 'picture') {

        this.generalshareurl = 'https://plus.google.com/share?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }
      /*if(stype=='google' && type=='trendingpicture') {
       console.log('this.selectedaudio');
       console.log(this.selectedaudio);
       this.generalshareurl = 'https://plus.google.com/share?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

       }*/
      if (stype == 'google' && type == 'trendingaudio') {

        this.generalshareurl = 'https://plus.google.com/share?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }



      if (stype == 'linkedin' && type == 'trendingvideo') {

        this.generalshareurl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }

      if (stype == 'linkedin' && type == 'picture') {

        this.generalshareurl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }
      /* if(stype=='linkedin' && type=='trendingpicture') {
       console.log('this.selectedaudio');
       console.log(this.selectedaudio);
       this.generalshareurl = 'https://www.linkedin.com/shareArticle?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

       }*/
      if (stype == 'linkedin' && type == 'trendingaudio') {

        this.generalshareurl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }


      if (stype == 'tumblr' && type == 'trendingvideo') {

        this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);
        /* this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75');*/

      }

      if (stype == 'tumblr' && type == 'picture') {

        this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);
        /* this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75');*/

      }
      /* if(stype=='tumblr' && type=='trendingpicture') {
       console.log('this.selectedaudio');
       console.log(this.selectedaudio);
       this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);
       /!* this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75');*!/

       }*/
      if (stype == 'tumblr' && type == 'trendingaudio') {

        this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }


      let gsharelink: any;
      gsharelink = document.getElementsByClassName("gsharelink");
      //gsharelink.click();
      //$('.gsharelink').click();
      this.generalshareurlold = this.generalshareurl;
      this.generalshareurloldtype = stype;
      setTimeout(()=> {
        this.gsharelink.nativeElement.click();
      }, 500);
    }

  }

  setshareflag(type:any,selectedpost:any){

    this.shareflag = type;
    this.selectedsharedpost=selectedpost;
    /*console.log('in setshareflag');
    console.log(type);*/
  }

  showcommentmodal(val:any){
    this.selectedpicture = val;
    this.selectedpost = val;


    this.ismodalcomment  = 1;


    /*this.getPictureDetails();
     this.getallpicture();
     this.getmusicdetails();
     this.getallmusic();
     this.getLinkDetails();
     this.getVideoDetails();
     this.getallvideo();*/
  }



}
