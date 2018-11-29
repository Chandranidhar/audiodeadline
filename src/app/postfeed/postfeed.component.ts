import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
declare var $:any;
declare var moment: any;

@Component({
  selector: 'app-postfeed',
  templateUrl: './postfeed.component.html',
  styleUrls: ['./postfeed.component.css'],
  providers: [Commonservices]

})
export class PostfeedComponent implements OnInit {

  public serverurl;
  public userdata: CookieService;
  public siteurl;
  public postusername:any='';
  public postuserimage:any='';
  public musicarray:any=[];
  public userimage;
    public audioDuration:any='';
    public playstate:any='';
    public isaudioplay:boolean=false;
  public ismuteaudio:boolean = false;
    public value:any=75;
    public value1:any=0;
    public options;
    public options1;
    public oldvolume:any=0;
    public chosenaudiourl:any='';
    public isloggedin:any=0;
    public currentmusiclikecount:any = 0;
    public user_id;

    public currentaudioid:any='';
    public commentval:any='';
    public currentpicturelikecount:any = 0;
    public currentvideoid:any;
    public videoplayfag:any=false;
    public currentvideourl:any= '';
    public currentvideolikecount:any=0;


  constructor(userdata: CookieService, public activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices, private sanitizer: DomSanitizer) {

    this.serverurl=_commonservices.url;
    this.siteurl=_commonservices.siteurl;
    this.userdata = userdata;

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

      this.userimage = this.userdata.get('image');

      console.log('routes');

      console.log(this.activeRoute.snapshot.params);
      this.user_id = this.userdata.get('user_id');
      if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!=''){

          this.isloggedin=1;

      }
      if(this.activeRoute.snapshot.params.type=='p'){
          let link3 = this.serverurl+'addpicview';
          var data = {'user_id':this.user_id,_id:this.activeRoute.snapshot.params.id};
          this._http.post(link3,data)
              .subscribe(res=> {

                  var result = res.json();
                  console.log(result);
                  if(result.status=='success'){

                      console.log('suceess');

                  }
              });
      }

      this.getpostdetail();



  }

  ngOnInit() {
  }

  getpostdetail(){


      if(this.activeRoute.snapshot.params.type == 'm'){

          console.log('music');
          let link = this.serverurl+'getmusicdetailsbyid';
          let data = {music_id:this.activeRoute.snapshot.params.id};
          this._http.post(link , data)
              .subscribe(res=>{

                  let result:any = {};
                  result = res.json();
                  console.log('result of music list');
                  console.log(result);
                  console.log(result.item[0]);
                  this.musicarray =  result.item[0];
                  this.postusername = this.musicarray.userdata[0].firstname+' '+this.musicarray.userdata[0].lastname;
                  this.postuserimage = this.musicarray.userdata[0].images;
                  console.log('this.postuserimage');
                  console.log(this.postuserimage);
                  console.log('this.musicarray.added_time');
                  console.log(this.musicarray.added_time);
                  this.chosenaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this.siteurl + 'nodeserver/uploads/audio/' + this.musicarray.user_id + '/' + this.musicarray.music);
                  console.log('this.chosenaudiourl');
                  console.log(this.chosenaudiourl);
                  if(this.musicarray.musiclikes[0]!=null){

                      this.currentmusiclikecount = this.musicarray.musiclikes[0].vlike;
                  }
                  else {
                      this.currentmusiclikecount = 0;
                  }

                  let myAudio:any = {};                                 //loading the audio values 1st time
                  myAudio=  document.querySelector("#audioplayer1");

                  setTimeout(()=> {    //<<<---    using ()=> syntax

                      this.audioDuration = myAudio.duration.toFixed(0);
                      if(isNaN(this.audioDuration)){
                          console.log('myAudio.duration.toFixed(0)');
                          console.log(myAudio.duration.toFixed(0));
                          setTimeout(()=> {
                              this.playmusic();
                              this.playmusic();
                              this.audioDuration=0;
                          },3000);
                      }
                      this.value1  = 0;
                      this.options1= {
                          floor: 0,
                          ceil: myAudio.duration.toFixed(0)
                      };

                      myAudio.volume=this.value/100;

                  }, 2000);



              })
      }
      if(this.activeRoute.snapshot.params.type == 'v'){
          console.log('video');
          let link = this.serverurl+'getvideodetailsbyid';
          let data = {video_id:this.activeRoute.snapshot.params.id};
          this._http.post(link , data)
              .subscribe(res=>{

                  let result:any ={};
                  result= res.json();
                  console.log('result of video list');
                  console.log(result);
                  console.log(result.item[0]);
                  this.musicarray =  result.item[0];
                  console.log('this.musicarray');
                  console.log(this.musicarray);
                  this.postusername = this.musicarray.userdata[0].firstname+' '+this.musicarray.userdata[0].lastname;
                  this.postuserimage = this.musicarray.userdata[0].images;
                  console.log('this.postuserimage');
                  console.log(this.postuserimage);
                  console.log('this.musicarray.added_time');
                  console.log(this.musicarray.added_time);

                  if(this.musicarray.videolikes[0]!=null){

                      this.currentvideolikecount = this.musicarray.videolikes[0].vlike;
                  }
                  else {
                      this.currentvideolikecount = 0;
                  }


                  if(this.musicarray.type=='vimeo'){

                      let vimeourl = this.musicarray.videoUrl.split('/');
                      let videoid = vimeourl[vimeourl.length - 1];
                      console.log('videoid ......');
                      console.log(videoid);
                      // this.currentvideotype='vimeo';
                      this.currentvideourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

                  }
                  if(this.musicarray.type=='youtube') {
                      setTimeout(()=> {    //<<<---    using ()=> syntax
                          let videourl = this.musicarray.videoUrl.split('v=');
                          this.currentvideourl='';
                          let videoid = videourl[videourl.length - 1];
                          this.currentvideourl=videoid;

                          console.log('videoid');
                          console.log(this.currentvideourl);
                          // this.currentvideotype='youtube';
                          console.log(videoid);
                      }, 50);

                  }


              })


      }
      if(this.activeRoute.snapshot.params.type == 'p'){
          console.log('picture');

          let link = this.serverurl+'getpicturedetailsbyid';
          let data = {image_id:this.activeRoute.snapshot.params.id};
          this._http.post(link ,data)
              .subscribe(res=>{

                  let result:any ={};
                  result= res.json();
                  console.log('result of picture list');
                  console.log(result);
                  console.log(result.item[0]);
                  this.musicarray =  result.item[0];
                  console.log('this.musicarray');
                  console.log(this.musicarray);
                  this.postusername = this.musicarray.userdata[0].firstname+' '+this.musicarray.userdata[0].lastname;
                  this.postuserimage = this.musicarray.userdata[0].images;
                  console.log('this.postuserimage');
                  console.log(this.postuserimage);
                  console.log('this.musicarray.added_time');
                  console.log(this.musicarray.added_time);

                  if (this.musicarray.picturelikes[0] != null) {

                      this.currentpicturelikecount = this.musicarray.picturelikes[0].vlike;
                  }
                  else {
                      this.currentpicturelikecount = 0;
                  }
              })
      }


  }

    setval1(){
        console.log('value  1 chaged .......');
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

    convertunixtotimeago(val:any){
    return moment.unix(val).startOf('minute').fromNow();

  }


    playmusic(){
        let myAudio :any = {};
        myAudio = document.querySelector("#audioplayer1");
         /*console.log('$(myAudio).length');
         console.log($(myAudio).length);
         console.log($('#audioplayer1').length);

         console.log('myAudio');
         console.log(myAudio);*/
         console.log('myAudio.duration');
         console.log(myAudio.duration);
        console.log('this.audioDuration');
        console.log(this.audioDuration);

        this.audioDuration = myAudio.duration.toFixed(0);

        setTimeout(()=> {
            if (isNaN(this.audioDuration)) {
                this.audioDuration=0;
                this.playmusic();
                this.playmusic();
                console.log('this.audioDuration in settimeout');
                console.log(this.audioDuration);
            }
        },2000);
        console.log('this.audioDuration out of set timeout');
        console.log(this.audioDuration);

        /* console.log('audioDuration');
         console.log(this.audioDuration);*/
        // myAudio.currentTime =23;
        if (this.isaudioplay) {
            myAudio.pause();
            clearInterval(this.playstate);
            this.isaudioplay=false;
            /*----------------------------------------for counting view --------------------------------*/
            let link = this.serverurl+'addmusicview';
            var data = {'user_id':this.user_id,_id:this.musicarray._id};
            this._http.post(link,data)
                .subscribe(res=>{

                    let result:any = {};
                    result = res.json();
                    console.log('result view');
                    console.log(result);
                    if(result.status=='success'){

                        this.getpostdetail();
                        console.log('suceess view');
                    }
                });

            /*----------------------------------------------------------------------------------------*/


        } else {
            myAudio.play();
            myAudio.volume=this.value/100;
            this.playstate = setInterval(() => {
                console.log('in onplay interval ....');
                console.log(myAudio.currentTime);
                this.value1 = (myAudio.currentTime.toFixed(0));
                console.log(this.value1);
                //this.setaudiotimer(Math.ceil(myAudio.currentTime));
                console.log(this.value);


            }, 1000);
            this.isaudioplay=true;
        }
        myAudio.onpause = function(){
            //this.playstate.clearInterval();
            clearInterval(this.playstate);

        };


    }

    changeaudioplayervolume(){

        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer1");
        myAudio.volume =this.value/100;
        if(this.value==0) this.ismuteaudio=true;
        else this.ismuteaudio=false;
    }

    changeaudioplayertimer(){
        console.log('this is timer change');
        console.log('this.value1');
        console.log(this.value1);
        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer1");
        myAudio.currentTime =this.value1;
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
        console.log(this.value);
        console.log(this.oldvolume);
        console.log(myAudio.volume);


    }

    showmusiclike(val:any) {

        if (this.isloggedin == 1) {
            this.currentmusiclikecount = val;
            console.log('this.currentmusiclikecount');
            console.log(this.currentmusiclikecount);
            let user_id = this.userdata.get('user_id');
            let link4 = this.serverurl + 'addvideolike';
            var data = {'user_id': user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    console.log(result);
                    if (result.status == 'success') {

                        console.log('suceess like');
                        this.getpostdetail();
                    }
                })

        }
    }

    getlikeonstatus(val:any){
        console.log('getlikeonstatus .......');
        console.log(val);

        if(val.length==0) return false;
        else {
            for(let x in val)
            {
                if(this.user_id==val[x].user_id) return true;
            }


        }
        return false ;
    }

    showmusicunlike(val:any) {

        if (this.isloggedin == 1) {

            this.currentmusiclikecount = val;
            let user_id = this.userdata.get('user_id');
            let link4 = this.serverurl + 'deletevideolike';
            var data = {'user_id': user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    console.log(result);
                    if (result.status == 'success') {

                        console.log('suceess unlike');
                        this.getpostdetail();
                    }
                });
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
                    console.log(result);
                    if (result.status == 'success') {


                        console.log('suceess like');
                        this.getpostdetail();

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
                    console.log(result);
                    if (result.status == 'success') {

                        console.log('suceess unlike');
                        this.getpostdetail();
                    }
                })
        }
    }

    showvideolike(val:any) {
        if (this.isloggedin == 1) {
            this.currentvideolikecount = val;
            let link4 = this.serverurl + 'addvideolike';
            var data = {'user_id': this.user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    console.log(result);
                    if (result.status == 'success') {


                        this.getpostdetail();
                        console.log('suceess like');
                    }
                })

        }
    }

    showvideounlike(val:any) {

        if (this.isloggedin == 1) {
            this.currentvideolikecount = val;
            let link4 = this.serverurl + 'deletevideolike';
            var data = {'user_id': this.user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    console.log(result);
                    if (result.status == 'success') {


                        this.getpostdetail();
                        console.log('suceess unlike');
                    }
                })
        }
    }
    addcomment(val:any){

        console.log('val');
        // console.log(val);

        // this.selectedpicture = val;
        console.log('this.musicArray');
        console.log(this.musicarray);

        this.currentaudioid= this.musicarray._id;
        console.log('this.currentaudioid');
        console.log(this.currentaudioid);

        console.log(val.keyCode);
        console.log(val.shiftKey);
        if(val.keyCode==13 && !val.shiftKey && this.commentval.length>0){

            console.log('submit comment here ....');
            let link = this.serverurl+'addcomment';
            let data = {'post_id': this.musicarray._id,'user_id':this.user_id, 'comment':this.commentval};
            console.log('data');
            console.log(data);
            this._http.post(link, data)
                .subscribe(val =>{

                    var res = val.json();
                    console.log('success');
                    console.log('res');
                    console.log(res.item);

                    this.getpostdetail();

                    this.commentval='';





                })
        }
    }

    onStateChange(event){
        console.log('event ....');
        console.log(event);
        this.videoplayfag=true;
        if(event.data == -1){
            var link2= this.serverurl+'addvideoviews';
            var data = {'user_id':this.user_id,videoid:this.musicarray._id};
            console.log('username');
            //console.log(data.username);
            this._http.post(link2, data)
                .subscribe(res => {
                    var result = res.json();
                    console.log(result.item);
                    if(result.status=='success'){
                        //this.getVideoDetails();
                        this.getpostdetail();
                    }
                }, error => {
                    console.log("Oooops!");
                });
            //this.getVideoDetails();
            this.getpostdetail();
        }
        if(event.data==0){
            this.videoplayfag=true;
            this.getpostdetail();
        }
    }

}
