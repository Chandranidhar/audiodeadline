import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
declare var $:any;
declare var moment: any;

@Component({
  selector: 'app-mediawall',
  templateUrl: './mediawall.component.html',
  styleUrls: ['./mediawall.component.css'],
  providers: [Commonservices]
})
export class MediawallComponent implements OnInit {

  public userdata: CookieService;

  public serverurl;
  public showLoader:any = 0;
  public currentlikecount:any=0;
    public currentpicturelikecount:any=0;
  public siteurl;
  public demourl;
  public demourl1;
  public fb;
  public videodetailArray:any=[];
  public picturedetailArray:any=[];
  public musicdetailArray:any=[];
  public commontrendingarray:any=[];
  public user_name;
  public isuserprofile:any = 0;
  public fan:any;
  public user_id:any;
  public isloggedin:any = 0;
  public image:any;
  public selectedpost:any={};
  public isModalPicDetail:any= false;
    public tabselectedpictureindex:any=0;

  public value2:any=[];
  public value3:any=0;
  public options2:any=[];
  public options3;
  public shuffleflag2:boolean = false;
  public selectedmusictrending:any={};
  public chosenaudiotitletrending:any;
  public chosenaudiourlfortrending:any='';
  public audiousernamefortrending:any;
  public audioplayerindextrending:any=0;
  public isaudioplayfortrending:boolean=false;
  public playstatetrending:any='';
  public audioDurationfortrending:any='';
  public oldvolumetrending:any=0;
  public ismuteaudiotrending:boolean = false;
  public currentmusiclikecount:any=0;

  public videoplayfag:any=false;
  public currentvideoidtrending:any='';
  public selectedvideotrending:any={};
  public currentvideotypetrending:any;
  public choosenvideourlfortrending:any;

  public musicLimit:any = 10;
  public musicSkip:any = 0;
  public videoLimit:any = 10;
  public videoSkip:any = 0;
  public pictureLimit:any = 10;
  public pictureSkip:any = 0;
  public selectedpictureuserid:any;
  public commentval:any = '';
  public selectedpictureindex:any;
  public ismodalcomment:any = 0;

  constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices,fb:FormBuilder, private sanitizer: DomSanitizer) {


    // this.value2=0;                      //trending audio duration slider
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
    this.demourl=_commonservices.demourl;
    this.demourl1=_commonservices.demourl1;
    this.fb=fb;
    this.shuffleflag2 = false;
    if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')
      this.isloggedin=1;

    this.user_name = this.userdata.get('user_name');
    this.user_id = this.userdata.get('user_id');
    this.fan = 0;
    this.image = this.userdata.get('image');

    if(this.activeRoute.snapshot.params.id==null || typeof(this.activeRoute.snapshot.params.id)=='undefined') {
      // console.log('in profile ...');

      this.isuserprofile = 0;

      this.fan = this.userdata.get('fan');
    }else{
      console.log('in user profile ...');
      this.user_name = this.activeRoute.snapshot.params.name;
      this.user_id = this.activeRoute.snapshot.params.id;             /*----*/

      console.log('this.user_id in userprofile');
      console.log(this.user_id);


        this.isloggedin=1;
      this.isuserprofile = 1;

      /* this.isloggedin=1;*/

    }
  }

  ngOnInit() {


    this.getallvideo();
    this.getallmusic();
    this.getallpicture();
    this.getfeedofusers();





  }


  showpicturedetail(val:any){
    // this.selectedpictureobject = val;

    this.selectedpost = val;
    this.isModalPicDetail = true;
    /* console.log('this.picturedetailArray');
     console.log(this.picturedetailArray);
     console.log('this.picturedetailArray[0].user_id');
     console.log(this.picturedetailArray[0].user_id);*/

    this.tabselectedpictureindex = this.commontrendingarray.indexOf(val);
    /* console.log('this.selectedpictureindex');
     console.log(this.selectedpictureindex); */
    /*console.log('this.tabselectedpictureindex');
     console.log(this.tabselectedpictureindex);*/

    this.selectedpictureuserid= val.user_id;
    let link3 = this.serverurl+'addpicview';
    var data = {'user_id':this.user_id,_id:val._id};
    this._http.post(link3,data)
        .subscribe(res=> {

          var result = res.json();
          // console.log(result);
          if(result.status=='success'){

            this.getallpicture();
            // console.log('suceess');
          }
        })
  }

  getthumbnail(item:any){             //getting the thumbnail image


    if(item.type=='youtube') {

      let url = item.videoUrl.replace('watch?v=', 'embed/');
      url=url.split('/');
      let urlid=url[url.length-1];
      //return "https://i1.ytimg.com/vi/"+urlid+"/0.jpg";
      return this.sanitizer.bypassSecurityTrustResourceUrl("https://i1.ytimg.com/vi/"+urlid+"/0.jpg");
      // this.videoThumbnailimage = this.sanitizer.bypassSecurityTrustResourceUrl("https://i1.ytimg.com/vi/"+urlid+"/0.jpg");


    }
    if(item.type=='vimeo'){

      return this.sanitizer.bypassSecurityTrustResourceUrl(item.thumbnail);           //this.videoArray[x1].thumbnail

    }
  }
  playthumbtrending(item:any){            // playing the thumbnail video

    this.currentvideotypetrending='';
    this.selectedvideotrending = item;
    // this.selectedpost = item;
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
        // console.log('videoid');
        this.currentvideotypetrending='youtube';
        // console.log(videoid);
      }, 50);
      //let url = item.videoUrl.replace('watch?v=', 'embed/');

      //this.choosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

  }
  getallvideo(){


    let link4= this.serverurl+'trendingVideoListwithlimit';
    this._http.post(link4,{'limit':this.videoLimit, 'skip':this.videoSkip})
        .subscribe(res =>{

          let result = res.json();
          if(result.status=='success'){

            /*  console.log('video result 12');
             console.log(result);*/
            let oldvideodetailarray=this.videodetailArray;
            // this.videodetailArray.push(result.item);
            this.videodetailArray=result.item;
              for(let i in this.videodetailArray){

                  if(this.videodetailArray[i].type=='vimeo'){
                      let tempvurl=this.videodetailArray[i].videoUrl;
                      let vimeourl = tempvurl.split('/');
                      let videoid = vimeourl[vimeourl.length - 1];
                      this.videodetailArray[i].vurl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

                  }
                  if(this.videodetailArray[i].type=='youtube' && !this.videoplayfag) {
                      let videourl = this.videodetailArray[i].videoUrl.split('v=');
                      let videoid = videourl[videourl.length - 1];

                      this.videodetailArray[i].vurl = videoid;
                  }

              }



            if( this.videodetailArray.length>0 && !this.videoplayfag){
              this.currentvideoidtrending=this.videodetailArray[0]._id;
              //this.selectedvideotrending=this.videodetailArray[0];
              /* console.log('this.selectedvideotrending.comments');
               console.log(this.selectedvideotrending.comments);*/


              if(this.videodetailArray[0].type=='vimeo'){
                let tempvurl=this.videodetailArray[0].videoUrl;
                let vimeourl = tempvurl.split('/');
                let videoid = vimeourl[vimeourl.length - 1];
                /* console.log('videoid ......');
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
                 /* if(this.selectedpost._id==this.selectedvideotrending._id)this.selectedpost=this.videodetailArray[c1];*/
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
                      /* console.log('vimeo json result ....');
                       console.log(result);
                       console.log(result[0].thumbnail_large);*/
                      this.videodetailArray[x1].thumbnail=result[0].thumbnail_large;

                    }, error => {
                      // console.log("Oooops!");
                    });
              }
            }

             this.getfeedofusers();
          }


        })
  }
  onStateChangetrending(event){
    // console.log('event ....');
    // console.log(event.data);
    this.videoplayfag=true;
    if(event.data == -1){
      var link2= this.serverurl+'addvideoviews';
      var data = {'user_id':this.user_id,videoid:this.currentvideoidtrending};
      // console.log('username');
      //console.log(data.username);
      this._http.post(link2, data)
          .subscribe(res => {
            var result = res.json();
            // console.log(result.item);
            if(result.status=='success'){
              //this.getVideoDetails();
            }
          }, error => {
            // console.log("Oooops!");
          });
      //this.getVideoDetails();
    }
    if(event.data==0){
      this.videoplayfag=true;
      this.getallvideo();
    }
  }
  getallpicture(){


    let link4= this.serverurl+'trendingPictureListwithlimit';
    this._http.post(link4,{'limit':this.pictureLimit, 'skip':this.pictureSkip})
        .subscribe(res =>{

          let result = res.json();
          if(result.status=='success') {
            // this.picturedetailArray.push(result.item);
            this.picturedetailArray=result.item;
            console.log('this.picturedetailArray');
             console.log(this.picturedetailArray);

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
                    /*
                     console.log('this.selectedpicture in for loop1');
                     console.log(this.selectedpost);
                     console.log('this.selectedpicture.comments.....');
                     console.log(this.selectedpost.comments);*/

                  }
                }
              }



            }

            this.getfeedofusers();
          }

        })
  }


  setmusictimeandoption(val,i){

      setTimeout(()=> {    //<<<---    using ()=> syntax
          let myAudio:any = {};
          myAudio=  document.querySelector("#audioplayer4"+val._id);
          //this.audioDurationfortrending = myAudio.duration.toFixed(0);
          this.musicdetailArray[i].duration=myAudio.duration.toFixed(0);
          this.value2[val._id]  = 0;
          this.options2[val._id]= {
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
      }, 1900);
  }


  getallmusic(){


    let link4= this.serverurl+'trendingMusicListwithlimit';
    this._http.post(link4,{'limit':this.musicLimit, 'skip':this.musicSkip})
        .subscribe(res =>{

          let result = res.json();
          if(result.status=='success'){
            /*
             console.log('result');
             console.log(result);*/
            // this.musicdetailArray.push(result.item);
            this.musicdetailArray=result.item;
            console.log('this.musicdetailArray');
             console.log(this.musicdetailArray);
            if(this.musicdetailArray.length>0 && !this.isaudioplayfortrending){
              /*this.chosenaudiourlfortrending = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.musicdetailArray[0].user_id+'/'+ this.musicdetailArray[0].music);*/
              // this.chosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);


                for(let i in this.musicdetailArray){

                    this.musicdetailArray[i].murl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl + 'nodeserver/uploads/audio/' + this.musicdetailArray[i].user_id + '/' + this.musicdetailArray[i].music);
                    this.value2[this.musicdetailArray[i]._id]=0;
                    this.setmusictimeandoption(this.musicdetailArray[i],i);
                }

              if(this.audioplayerindextrending>0){

                this.selectedmusictrending = this.musicdetailArray[this.audioplayerindextrending];
              }

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
                      if(this.selectedpost._id==this.selectedmusictrending._id)this.selectedpost=this.videodetailArray[c1];

                    /*console.log('this.selectedmusictrending in for loop1');
                     console.log(this.selectedmusictrending);
                     console.log('this.selectedmusictrending.comments.....');
                     console.log(this.selectedmusictrending.comments);*/
                  }
                }
              }
              /*this.chosenaudiotitletrending = this.musicdetailArray[0].title_music;
               this.audiousernamefortrending = this.musicdetailArray[0].userdata[0].firstname+' '+this.musicdetailArray[0].userdata[0].lastname;*/


              setTimeout(()=> {    //<<<---    using ()=> syntax
                let myAudio:any = {};
                  myAudio=  document.querySelector("#audioplayer4"+this.musicdetailArray[0]._id);
                  this.audioDurationfortrending = myAudio.duration.toFixed(0);
                  this.value2[this.musicdetailArray[0]._id]  = 0;
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

           this.getfeedofusers();

          }
        })
  }
  changeaudioplayertimertrending(){
    /* console.log('this is timer change');
     console.log('this.value2');
     console.log(this.value2);*/
    let myAudio:any = {};
    myAudio=  document.querySelector("#audioplayer4"+this.selectedmusictrending._id);
    myAudio.currentTime =this.value2[this.selectedmusictrending._id];
  }
  setval1(){

      let myAudio:any = {};
      myAudio=  document.querySelector("#audioplayer4"+this.selectedmusictrending._id);
      myAudio.currentTime =this.value2[this.selectedmusictrending._id];
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

  playaudiotrending(val:any){
    /*console.log('val');
     console.log(val);
     console.log('val.userdata[0].firstname');
     console.log(val.userdata[0].firstname);*/

    this.selectedmusictrending = val;
    this.chosenaudiotitletrending = val.title_music;
    this.audiousernamefortrending = val.userdata[0].firstname+' '+val.userdata[0].lastname;
    if(this.audioplayerindextrending==this.musicdetailArray.indexOf(val))
    {
      /*console.log('equal index ......');
       console.log('equal index ......');*/
      if(this.isaudioplayfortrending==false){
        this.playmusicfortrending(val);
      }
      else {
        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer4"+val._id);
        myAudio.pause();
        this.isaudioplayfortrending = false;
        return;
      }

    }
    else {
      clearInterval(this.playstatetrending);
      this.isaudioplayfortrending = false;
        this.value2[val._id] = 0;
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

              //this.getallmusic();

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
          this.value2[val._id]= 0;
        this.chosenaudiourlfortrending = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl + 'nodeserver/uploads/audio/' + val.user_id + '/' + val.music);
      }, 1500);
        this.value2[val._id] = 0;
      setTimeout(()=> {    //<<<---    using ()=> syntax

        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer4"+val._id);
        clearInterval(this.playstatetrending);
        this.isaudioplayfortrending = false;
          this.value2[val._id] = 0;

        //myAudio.play();
        //this.isaudioplay=true;

        /* console.log($(myAudio).length);
         console.log($('#audioplayer4').length);*/

        if (this.isaudioplayfortrending) {
          myAudio.pause();
          clearInterval(this.playstatetrending);
          this.isaudioplayfortrending = false;
        } else {
            this.value2[val._id] = 0;
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
            this.value2[val._id] = (myAudio.currentTime.toFixed(0));
            //console.log(this.value1);
            //console.log(this.value);


          }, 1800);
          this.isaudioplayfortrending = true;
        }
        myAudio.onpause = function () {
          //this.playstate.clearInterval();
          clearInterval(this.playstatetrending);
        };

        //this.playmusic();
      }, 2000);

    }

  }


  playmusicfortrending(val:any){

    let myAudio :any = {};
    myAudio = document.querySelector("#audioplayer4"+val._id);
     /*console.log('$(myAudio).length');
     console.log($(myAudio).length);
     console.log($('#audioplayer4').length);

     console.log('myAudio');
     console.log(myAudio);
     console.log(myAudio.duration);*/
    this.selectedmusictrending = val;
    this.chosenaudiotitletrending = val.title_music;
    this.audiousernamefortrending = val.userdata[0].firstname+' '+val.userdata[0].lastname;
    this.chosenaudiourlfortrending = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl + 'nodeserver/uploads/audio/' + val.user_id + '/' + val.music);

    this.audioDurationfortrending = myAudio.duration.toFixed(0);
    /*console.log('audioDurationfortrending');
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
        /*console.log('in onplay interval ....');
         console.log(myAudio.currentTime);*/
        this.value2[val._id] = (myAudio.currentTime.toFixed(0));
        /* console.log(this.value2);
         //this.setaudiotimer(Math.ceil(myAudio.currentTime));
         console.log(this.value3);*/


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

  changeaudioplayervolumetrending(){

    let myAudio:any = {};
    myAudio=  document.querySelector("#audioplayer4");
    myAudio.volume =this.value3/100;
    if(this.value3==0) this.ismuteaudiotrending=true;
    else this.ismuteaudiotrending=false;
  }

  convertunixtotimeago(val:any){
    return moment.unix(val).startOf('minute').fromNow();

  }

  showmusiclike(val:any) {

    if (this.isloggedin == 1) {
      this.currentmusiclikecount = val;
      let user_id = this.userdata.get('user_id');
      let link4 = this.serverurl + 'addvideolike';
      var data = {'user_id': user_id, videoid: val._id};
      this._http.post(link4, data)
          .subscribe(res=> {

            var result = res.json();
            // console.log(result);
            if (result.status == 'success') {


              this.getallmusic();



              /*this.getmusicdetails();
               this.getallmusic();*/
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

  showmusicunlike(val:any) {

    if (this.isloggedin == 1) {
      this.currentmusiclikecount = val;
      let user_id = this.userdata.get('user_id');
      let link4 = this.serverurl + 'deletevideolike';
      var data = {'user_id': user_id, videoid: val._id};
      this._http.post(link4, data)
          .subscribe(res=> {

            var result = res.json();
            // console.log(result);
            if (result.status == 'success') {

              this.getallmusic();
              console.log('suceess unlike');
            }
          })
    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a,b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  getfeedofusers(){


    this.commontrendingarray = this.videodetailArray.concat(this.musicdetailArray,this.picturedetailArray);

    console.log('this.commontrendingarray');
    console.log(this.commontrendingarray);

    this.commontrendingarray.sort(this.dynamicSort("-added_time"));
    setTimeout(()=> {
      //this.commontrendingarray = this.commontrendingarray.slice(9, this.commontrendingarray.length);
    },500);


    console.log('this.commontrendingarray');
    console.log(this.commontrendingarray);



    /*for(let i in this.commontrendingarray){


     }*/
  }

  loadMoreValue(){

    this.getnextvalueoftrendingmusic();
    this.getnextvalueoftrendingvideo();
    this.getnextvalueoftrendingphotos();

  }

  getnextvalueoftrendingmusic(){

    let link = this.serverurl + 'trendingMusicListwithlimit';
    //this.musicLimit = this.musicLimit+10;
    this.musicSkip = this.musicSkip+10;
    console.log(this.musicLimit);
    console.log(this.musicSkip);
    this._http.post(link,{'limit':this.musicLimit,'skip':this.musicSkip})
        .subscribe(res => {

            console.log('yuyuuturu');
            let result:any = {};
            result = res.json();
            console.log('result of getnextvalueoftrendingmusic');
            console.log(result);
            console.log(result.item.length);
            this.commontrendingarray = this.commontrendingarray.concat(result.item);

            console.log('this.commontrendingarray');
            console.log(this.commontrendingarray);

            this.commontrendingarray.sort(this.dynamicSort("-added_time"));
        });
  }

  getnextvalueoftrendingvideo(){
      let link = this.serverurl + 'trendingVideoListwithlimit';
      //this.musicLimit = this.musicLimit+10;
      this.videoSkip = this.videoSkip+10;
      console.log(this.videoLimit);
      console.log(this.videoSkip);
      this._http.post(link,{'limit':this.videoLimit,'skip':this.videoSkip})
          .subscribe(res => {

              console.log('----yuyuuturu');
              let result:any = {};
              result = res.json();
              console.log('result of getnextvalueoftrendingvideo');
              console.log(result);
              let tempvideoarray = result.item;

              for(let i in tempvideoarray){

                  if(tempvideoarray[i].type=='vimeo'){
                      let tempvurl=tempvideoarray[i].videoUrl;
                      let vimeourl = tempvurl.split('/');
                      let videoid = vimeourl[vimeourl.length - 1];
                      tempvideoarray[i].vurl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

                  }
                  if(tempvideoarray[i].type=='youtube' ) {
                      let videourl = tempvideoarray[i].videoUrl.split('v=');
                      let videoid = videourl[videourl.length - 1];

                      tempvideoarray.vurl = videoid;
                  }

              }


              this.commontrendingarray = this.commontrendingarray.concat(tempvideoarray);

              console.log('this.commontrendingarray');
              console.log(this.commontrendingarray);

              this.commontrendingarray.sort(this.dynamicSort("-added_time"));
          });

  }
  getnextvalueoftrendingphotos(){
      let link = this.serverurl + 'trendingPictureListwithlimit';
      //this.musicLimit = this.musicLimit+10;
      this.pictureSkip = this.pictureSkip+10;
      console.log(this.pictureLimit);
      console.log(this.pictureSkip);
      this._http.post(link,{'limit':this.pictureLimit,'skip':this.pictureSkip})
          .subscribe(res => {

              console.log('----yuyuuturu');
              let result:any = {};
              result = res.json();
              console.log('result of getnextvalueoftrendingphotos');
              console.log(result);
              this.commontrendingarray = this.commontrendingarray.concat(result.item);

              console.log('this.commontrendingarray');
              console.log(this.commontrendingarray);

              this.commontrendingarray.sort(this.dynamicSort("-added_time"));
          });

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
            let user_id = this.userdata.get('user_id');
            let link4 = this.serverurl + 'deletevideolike';
            var data = {'user_id': user_id, videoid: val._id};
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
                        /* console.log('this.tabselectedpictureindex');
                         console.log(this.tabselectedpictureindex);*/
                       /* if (this.selectedpictureindex > 0) {
                            // console.log('selected picture index block');

                            // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                            this.selectedpicture = this.picturedetailArray[this.selectedpictureindex];
                        }
                        if (this.tabselectedpictureindex > 0) {
                            // console.log('selected picture index block');

                            // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
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

                        this.getallpicture();
                        // console.log('suceess unlike');
                    }
                })
        }
    }
  addcomment(val:any){

        // console.log('val');
        // console.log(val);

        /*  // this.selectedpicture = val;
         console.log('this.musicArray');
         console.log(this.musicArray);
         */

        /*  console.log('this.currentaudioid');
         console.log(this.currentaudioid);

         console.log(val.keyCode);
         console.log(val.shiftKey);*/
        if(val.keyCode==13 && !val.shiftKey && this.commentval.length>0){

            /*console.log('submit comment here ....');*/
            let link = this.serverurl+'addcomment';
            let data = {'post_id': this.selectedpost._id,'user_id':this.user_id, 'comment':this.commentval};
            /* console.log('data');
             console.log(data);*/
            this._http.post(link, data)
                .subscribe(val =>{

                    var res = val.json();
                    /*  console.log('success');
                     console.log('res');
                     console.log(res.item);*/

                    this.getallpicture();

                    this.getallmusic();

                    this.getallvideo();
                    this.getfeedofusers();



                    this.commentval='';
                    /*console.log('this.tabselectedpictureindex');
                     console.log(this.tabselectedpictureindex);
                     if(this.selectedpictureindex>0){
                     console.log('selected picture index block');

                     // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                     this.selectedpicture = this.picturedetailArray[this.selectedpictureindex];
                     }*/





                })
        }
    }

    showcommentmodal(val:any){
        // this.selectedpicture = val;
        this.selectedpost = val;


        this.ismodalcomment  = 1;

        console.log(this.selectedpost);
        console.log(this.isloggedin);


        /*this.getPictureDetails();
         this.getallpicture();
         this.getmusicdetails();
         this.getallmusic();
         this.getLinkDetails();
         this.getVideoDetails();
         this.getallvideo();*/
    }
  onHidden(){
      this.isModalPicDetail = false;
      this.ismodalcomment  = 0;
      this.showLoader = 0;
  }



}
