import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {ActivatedRoute } from '@angular/router';
import {Commonservices} from "../app.commonservices";
import { DomSanitizer} from '@angular/platform-browser';
import {Http} from "@angular/http";
import { FacebookService, InitParams,UIParams, UIResponse } from 'ngx-facebook';
declare var $:any;
declare var moment: any;


@Component({
  selector: 'app-trendingmusics',
  templateUrl: './trendingmusics.component.html',
  styleUrls: ['./trendingmusics.component.css'],
  providers: [Commonservices]
})
export class TrendingmusicsComponent implements OnInit,AfterViewInit {
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

  public value2:any=0;
  public value3:any=0;
  public options2;
  public options3;
  public userdata: CookieService;
  public siteurl;
  public serverurl;
  public musicdetailArray:any=[];
  public chosenaudiourlfortrending:any='';
  public chosenaudiotitletrending:any;
  public audiousernamefortrending:any;
  private audioplayerindextrending:any=0;
  public audioDurationfortrending:any='';
  public isaudioplayfortrending:boolean=false;
  public playstatetrending:any='';
  public isloggedin:any=0;
  public user_name;
  public user_id;
  public image;
  public scrolled:any=0;
  public ismuteaudiotrending:boolean = false;
  public shuffleflag2:boolean = false;
  public oldvolumetrending:any=0;
  public currentmusiclikecount:any=0;
  public selectedmusictrending:any={};
  public selectedmusictrendinguserid:any;
  public commentval:any='';
  public generalshareurl:any='';
  public shareflag:any;
  public selectedsharedpost:any;



  constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices,private sanitizer: DomSanitizer,public FBS: FacebookService) {

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



    this.userdata = userdata;
    this.serverurl=_commonservices.url;
    this.siteurl=_commonservices.siteurl;
    console.log('routes');
    console.log(this.activeRoute.snapshot.params);
    this.user_name = this.userdata.get('user_name');
    this.user_id = this.userdata.get('user_id');
    this.image = this.userdata.get('image');


    if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')
      this.isloggedin=1;

    if(this.activeRoute.snapshot.params.id==null || typeof(this.activeRoute.snapshot.params.id)=='undefined') {

      console.log('in profile ...');

      console.log('this.image');
      console.log(this.image);
      console.log('this.user_name');
      console.log(this.user_name);
      /*this.isuserprofile = 0;*/
    }else{
      this.user_name = this.activeRoute.snapshot.params.name;
      this.user_id = this.activeRoute.snapshot.params.id;
      console.log('this.user_id');
      console.log(this.user_id);
      console.log('this.user_name');
      console.log(this.user_name);
      /* this.isuserprofile = 1;*/
    }

    let initParams: InitParams = {
      appId: '906815096194208',
      xfbml: true,
      version: 'v2.8'
    };

    FBS.init(initParams);
  }

  ngOnInit() {
    this.getallmusic();
   /* this.playstatetrending = setInterval(() => {

      this.getallmusic();


    }, 15000);*/
  }

  ngAfterViewInit(){

  }

  fbshare(type:any) {

    console.log('fbshare');
    console.log(type);

    const options: UIParams = {
      method: 'share',
      href: 'http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75'
    };

    this.FBS.ui(options)
        .then((res: UIResponse) => {
          console.log('Got the users profile', res);
        })
        .catch(this.handleError);

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

  changeaudioplayertimertrending(){
    console.log('this is timer change');
    console.log('this.value2');
    console.log(this.value2);
    let myAudio:any = {};
    myAudio=  document.querySelector("#audioplayer4");
    myAudio.currentTime =this.value2;
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
    console.log('value  1 chaged .......');
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
            console.log('this.musicdetailArray');
            console.log(this.musicdetailArray);
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


                    console.log('this.selectedmusictrending in for loop1');
                    console.log(this.selectedmusictrending);
                    console.log('this.selectedmusictrending.comments.....');
                    console.log(this.selectedmusictrending.comments);
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
    console.log('$(myAudio).length');
    console.log($(myAudio).length);
    console.log($('#audioplayer4').length);

    console.log('myAudio');
    console.log(myAudio);
    console.log(myAudio.duration);

    this.audioDurationfortrending = myAudio.duration.toFixed(0);
    console.log('audioDurationfortrending');
    console.log(this.audioDurationfortrending);
    // myAudio.currentTime =23;
    if (this.isaudioplayfortrending) {
      myAudio.pause();
      clearInterval(this.playstatetrending);
      this.isaudioplayfortrending=false;
    } else {
      myAudio.play();
      myAudio.volume=this.value3/100;
      this.playstatetrending = setInterval(() => {
        console.log('in onplay interval ....');
        console.log(myAudio.currentTime);
        this.value2 = (myAudio.currentTime.toFixed(0));
        console.log(this.value2);
        //this.setaudiotimer(Math.ceil(myAudio.currentTime));
        console.log(this.value3);


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
    console.log(this.value3);
    console.log(this.oldvolumetrending);
    console.log(myAudio.volume);


  }


  playaudiotrending(val:any){
    /*console.log('val');
     console.log(val);
     console.log('val.userdata[0].firstname');
     console.log(val.userdata[0].firstname);*/
    this.chosenaudiotitletrending = val.title_music;
    this.audiousernamefortrending = val.userdata[0].firstname+' '+val.userdata[0].lastname;
    this.selectedmusictrending= val;
    console.log('this.selectedmusictrending');
    console.log(this.selectedmusictrending);
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
            console.log('result view');
            console.log(result);
            if(result.status=='success'){

              this.getallmusic();

              console.log('suceess view');
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

        console.log($(myAudio).length);
        console.log($('#audioplayer4').length);

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
            console.log(result);
            if (result.status == 'success') {


              this.getallmusic();
              console.log('suceess like');
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

  showmusicunlike(val:any) {

    if (this.isloggedin == 1) {
      this.currentmusiclikecount = val;
      let link4 = this.serverurl + 'deletevideolike';
      var data = {'user_id': this.user_id, videoid: val._id};
      this._http.post(link4, data)
          .subscribe(res=> {

            var result = res.json();
            console.log(result);
            if (result.status == 'success') {

              this.getallmusic();
              console.log('suceess unlike');
            }
          })
    }
  }



  addcomment(val:any){

    // this.selectedpost = val;

    console.log('val');
    console.log(val);
    // this.selectedvideo=val;
    console.log('this.musicdetailArray');
    console.log(this.musicdetailArray);

    // this.currentvideoidtrending=this.selectedvideo._id;

    console.log(val.keyCode);
    console.log(val.shiftKey);
    if(val.keyCode==13 && !val.shiftKey && this.commentval.length>0){

      console.log('submit comment here ....');
      let link = this.serverurl+'addcomment';
      let data = {'post_id': this.selectedmusictrending._id,'user_id':this.user_id, 'comment':this.commentval};
      console.log('data');
      console.log(data);
      this._http.post(link, data)
          .subscribe(val =>{

            let res:any={};
            res = val.json();
            console.log('success');
            console.log('res');
            console.log(res.item);

            this.getallmusic();
            this.selectedmusictrending.comments=res.item;
            console.log('this.selectedmusictrending.comments');
            console.log(this.selectedmusictrending.comments);

            this.commentval='';


          })
    }
  }

  private handleError(error) {
    console.error('Error processing action', error);
  }

  ngAfterViewChecked(){

    let children = document.getElementsByClassName("fbsharelink");

    for (let i = 0; i < children.length; i++) {
      children[i].addEventListener("click", (event: Event) => {
        //alert("Hello world!");
        console.log("Hello world!");
        console.log("Hello world!b66");
        console.log(event);
        this.fbshare('audio');
        /*this.fbshare('trendingaudio');
         this.fbshare('video');
         this.fbshare('picture');
         this.fbshare('trendingpicture');*/
      });
    }

    let children1 = document.getElementsByClassName("twittersharelink");

    for (let i1 = 0; i1 < children1.length; i1++) {
      children1[i1].addEventListener("click", (event: Event) => {
        //alert("Hello 112!");
        console.log("Hello 11!");
        console.log("Hello world!11");
        console.log(event);
        this.generalshare(this.shareflag,'twitter');
      });
    }

    let children2 = document.getElementsByClassName("googlesharelink");

    for (let i2 = 0; i2 < children2.length; i2++) {
      children2[i2].addEventListener("click", (event: Event) => {
        //alert("Hello 112!");
        console.log("Hello 11!");
        console.log("Hello world!11");
        console.log(event);
        this.generalshare(this.shareflag,'google');
      });
    }

    let children3 = document.getElementsByClassName("linkedinsharelink");

    for (let i3 = 0; i3 < children3.length; i3++) {
      children3[i3].addEventListener("click", (event: Event) => {
        //alert("Hello 112!");
        console.log("Hello 11!");
        console.log("Hello world!11");
        console.log(event);
        this.generalshare(this.shareflag,'linkedin');
      });
    }

    let children4 = document.getElementsByClassName("tumblrsharelink");

    for (let i4 = 0; i4 < children4.length; i4++) {
      children4[i4].addEventListener("click", (event: Event) => {
        //alert("Hello 112!");
        console.log("Hello 11!");
        console.log("Hello world!11");
        console.log(event);
        this.generalshare(this.shareflag,'tumblr');
      });
    }

  }

  generalshare(type:any,stype:any){

    if(stype=='twitter' && type=='trendingaudio') {
      console.log('this.selectedaudio');
      console.log(this.selectedsharedpost._id);
      this.generalshareurl = 'https://twitter.com/intent/tweet?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }


    if(stype=='google' && type=='trendingaudio') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://plus.google.com/share?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }


    if(stype=='linkedin' && type=='trendingaudio') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://www.linkedin.com/shareArticle?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }


    if(stype=='tumblr' && type=='trendingaudio') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }
    console.log('this.generalshareurl');
    console.log(this.generalshareurl);


    let gsharelink:any;
    gsharelink = document.getElementsByClassName("gsharelink");
    //gsharelink.click();
    //$('.gsharelink').click();
    setTimeout(()=> {
      this.gsharelink.nativeElement.click();
    },500);

  }

  setshareflag(type:any,selectedpost:any){

    this.shareflag = type;
    this.selectedsharedpost=selectedpost;
    console.log('in setshareflag');
    console.log(type);
  }

}
