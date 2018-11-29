import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {ActivatedRoute } from '@angular/router';
import {Commonservices} from "../app.commonservices";
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
import { DomSanitizer} from '@angular/platform-browser';
import {Http} from "@angular/http";
import { FacebookService, InitParams,UIParams, UIResponse } from 'ngx-facebook';

declare var $:any;
declare var moment: any;
@Component({
  selector: 'app-mymusicplayer',
  templateUrl: './mymusicplayer.component.html',
  styleUrls: ['./mymusicplayer.component.css'],
  providers: [Commonservices]
})
export class MymusicplayerComponent implements OnInit,AfterViewInit {
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
  public isuserprofile = 1;
  public musicform: FormGroup;
  public fb: FormBuilder;
  public siteurl;
  public serverurl;
  public user_name;
  public user_id;
  public image;
  public isloggedin:any=0;
  public musicArray:any=[];
  public selectedaudiourl:any='';
  public selectedaudio:any={};
  public selectedaudioindex:any=0;
  public audioplayerindex:any=0;
  public chosenaudiotitle:any='';
  public chosenaudiourl:any='';
  public audiousername:any;
  public currentlikecount:any=0;
  public isaudioplay:boolean=false;
  public audioDuration:any='';
  public playstate:any='';
  public oldvolume:any=0;
  public audioDurationfortrending:any='';
  public ismuteaudio:boolean = false;
  // public selectedaudiourl:any='';
  // public chosenaudiotitle:any;
  public shuffleflag:boolean = false;

  public value:any=75;
  public value1:any=0;
  public options;
  public options1;
  public real_name;
  public currentmusiclikecount:any=0;
  public commentval:any='';
  public isModalMusicShown:boolean=false;
  public deleteflag:any;
  public tempval:any;
  public iscommonconfirmmodal:boolean=false;
  public commonconfirmmodalmessage:any='';
  public iscommonmodal:boolean= false;
  public commonmodalmessage:any= '';
  public showLoader;
  public selectedFile:File;
  public audiouploadurl;
  public tempUploadFilename:any='';
  public chkerror;
  public cookie_user_id:any;
  public generalshareurl:any='';
  public shareflag:any;
  public selectedsharedpost:any;

  constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices,private sanitizer: DomSanitizer,fb:FormBuilder,public FBS: FacebookService) {

    this.chkerror = 0;

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

    this.fb=fb;
    this.showLoader = 0;
    this.audiouploadurl=_commonservices.audiouploadurl;

    this.userdata = userdata;
    this.serverurl=_commonservices.url;
    this.siteurl=_commonservices.siteurl;
    this.shuffleflag = false;
    console.log('routes');
    console.log(this.activeRoute.snapshot.params);


    if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')
      this.isloggedin=1;

    this.user_name = this.userdata.get('user_name');
    this.user_id = this.userdata.get('user_id');
    this.cookie_user_id = this.userdata.get('user_id');
    this.image = this.userdata.get('image');
    this.real_name = this.userdata.get('real_name');

    if(this.activeRoute.snapshot.params.id==null || typeof(this.activeRoute.snapshot.params.id)=='undefined') {
      console.log('in profile ...');

      console.log('this.image');
      console.log(this.image);
      console.log('this.real_name');
      console.log(this.real_name);
      console.log(this.user_id);
      this.isuserprofile = 0;
    }else
      {
      this.user_name = this.activeRoute.snapshot.params.name;
      this.user_id = this.activeRoute.snapshot.params.id;
      console.log('this.user_id');
      console.log(this.user_id);
      console.log('this.user_name');
      console.log(this.user_name);
        console.log('this.real_name');
        console.log(this.real_name);
        console.log('this.image');
        console.log(this.image);
       this.isuserprofile = 1;
    }

    let initParams: InitParams = {
      appId: '906815096194208',
      xfbml: true,
      version: 'v2.8'
    };

    FBS.init(initParams);


  }

  ngOnInit() {

    this.musicform = this.fb.group({

      title_music: ["", Validators.required],
      privacy: ["", Validators.required],
      _id: [""],
      music: ["",Validators.required],
      accepttermscond: [false],
    });

    this.getmusicdetails();
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
    console.log(this.value);
    console.log(this.oldvolume);
    console.log(myAudio.volume);



  }
  setval1(){
    console.log('value  1 chaged .......');
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
    /* console.log('$(myAudio).length');
     console.log($(myAudio).length);
     console.log($('#audioplayer1').length);

     console.log('myAudio');
     console.log(myAudio);
     console.log(myAudio.duration);*/

    this.audioDuration = myAudio.duration.toFixed(0);
    /* console.log('audioDuration');
     console.log(this.audioDuration);*/
    // myAudio.currentTime =23;
    if (this.isaudioplay) {
      myAudio.pause();
      clearInterval(this.playstate);
      this.isaudioplay=false;
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

  playaudio(val:any){
    console.log('val');
    console.log(val);
    this.selectedaudio = val;

    /*   console.log('val.indexOf(this.musicdetailArray)');
     console.log(this.musicdetailArray.indexOf(val));*/
    /* console.log('this.audioplayerindex');
     console.log(this.audioplayerindex);*/
    this.chosenaudiotitle = val.title_music;

    this.audiousername = this.musicArray[0].userdata[0].firstname+' '+this.musicArray[0].userdata[0].lastname;
    if(this.audioplayerindex==this.musicArray.indexOf(val))
    {
      console.log('equal index ......');
      console.log('equal index ......');
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
        this.chosenaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl + 'nodeserver/uploads/audio/' + this.user_id + '/' + val.music);
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
              console.log('result view');
              console.log(result);
              if(result.status=='success'){

                this.getmusicdetails();

                console.log('suceess view');
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

  convertunixtotimeago(val:any){
    return moment.unix(val).startOf('minute').fromNow();

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


              this.getmusicdetails();
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

              this.getmusicdetails();
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
    console.log('this.musicArray');
    console.log(this.musicArray);

    // this.currentvideoidtrending=this.selectedvideo._id;


    console.log(val.keyCode);
    console.log(val.shiftKey);
    if(val.keyCode==13 && !val.shiftKey && this.commentval.length>0){

      console.log('submit comment here ....');
      let link = this.serverurl+'addcomment';
      let data = {'post_id': this.selectedaudio._id,'user_id':this.user_id, 'comment':this.commentval};
      console.log('data');
      console.log(data);
      this._http.post(link, data)
          .subscribe(val =>{

            let res:any={};
            res = val.json();
            console.log('success');
            console.log('res');
            console.log(res.item);

            this.getmusicdetails();
            this.selectedaudio.comments=res.item;
            console.log('this.selectedaudio.comments');
            console.log(this.selectedaudio.comments);

            this.commentval='';






          })
    }
  }


  getmusicdetails(){

    let link5= this.serverurl+'getMusiclistByUserid';
    let dataId = {'user_id': this.user_id};
    this._http.post(link5, dataId)
        .subscribe( res =>{

          let result = res.json();
          if(result.status=='success'){

            /* console.log('result');
             console.log(result);
             console.log(result.item);*/
            this.musicArray = result.item;
            console.log('this.musicArray');
            console.log(this.musicArray);
            console.log('this.musicArray[0].user_id');
            console.log(this.musicArray[0].user_id);
            console.log('this.user_id');
            console.log(this.user_id);
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

              // if((this.selectedaudio.comments)==null)this.chosenaudiotitle = this.musicArray[0].title_music;
              // this.audiousername = this.real_name;
              // if((this.selectedaudio.comments)==null)this.audiousername = this.musicArray[0].userdata[0].firstname+' '+this.musicArray[0].userdata[0].lastname;

              if(this.musicArray[0].musiclikes[0]!=null){

                this.currentlikecount = this.musicArray[0].musiclikes[0].vlike;
              }
              else {
                this.currentlikecount = 0;
              }
              //myAudio.play();
              //myAudio.pause();

              setTimeout(()=> {    //<<<---    using ()=> syntax
                let myAudio:any = {};
                myAudio=  document.querySelector("#audioplayer1");
                this.audioDuration = myAudio.duration.toFixed(0);
                this.value1  = 0;
                this.options1= {
                  floor: 0,
                  ceil: myAudio.duration.toFixed(0)
                };

                /*console.log('$(myAudio).length');
                 console.log($(myAudio).length);
                 console.log($('#audioplayer1').length);

                 console.log('myAudio');
                 console.log(myAudio);
                 console.log(myAudio.duration);*/
                myAudio.volume=this.value/100;
                //this.value=75;
                /*console.log('audioDuration for first time loading');
                 console.log(this.audioDuration);*/
              }, 1000);

              // myAudio.currentTime =23;


            }

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

  editMusic(item:any){

    this.musicform = this.fb.group({
      title_music: [item.title_music, Validators.required],
      privacy: [item.privacy, Validators.required],
      _id: [item._id],
      accepttermscond: [item.accepttermscond],
      music: [item.music, Validators.required],

    });
    this.selectedaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.user_id+'/'+ item.music);



    this.isModalMusicShown=true;
  }

  deleteVideo(flag:any,id:any,flag1){

    this.deleteflag=flag1;
    this.tempval=id;
    if(flag==0){
      this.iscommonconfirmmodal=true;
      if(flag1==1) this.commonconfirmmodalmessage='Are you sure you want to delete this video ?';
      if(flag1==2) this.commonconfirmmodalmessage='Are you sure you want to delete this link ?';
      if(flag1==3) this.commonconfirmmodalmessage='Are you sure you want to delete this picture ?';
      if(flag1==4) this.commonconfirmmodalmessage='Are you sure you want to delete this picture ?';
    }
    console.log(id);
    if(flag==1) {
      this.iscommonconfirmmodal=false;

      if(flag1==1) var link2 = this.serverurl + 'deleteVideoByID';
      if(flag1==2) var link2 = this.serverurl + 'deleteLinkByID';
      if(flag1==3) var link2 = this.serverurl + 'deletePicByID';
      if(flag1==4) var link2 = this.serverurl + 'deleteMusicByID';

      var data = {'id': id};
      console.log('username');
      // console.log(data.username);
      this._http.post(link2, data)
          .subscribe(res => {
            var result = res.json();
            console.log(result.item);
            if (result.status == 'success') {
              this.iscommonmodal = true;

              if(flag1==1)this.commonmodalmessage = 'Video deleted successfully !!';
              if(flag1==2)this.commonmodalmessage = 'Link deleted successfully !!';
              if(flag1==3)this.commonmodalmessage = 'Picture deleted successfully !!';
              if(flag1==4)this.commonmodalmessage = 'Music deleted successfully !!';
              setTimeout(()=> {    //<<<---    using ()=> syntax
                this.iscommonmodal = false;
                this.commonmodalmessage = '';
              }, 4000);

              /*this.getVideoDetails();
              this.getLinkDetails();
              this.getPictureDetails();*/
              this.getmusicdetails();
            }
          }, error => {
            console.log("Oooops!");
          });
    }

  }

  musicSubmit(formval){


    this.chkerror = 0;
    let x: any;
    for (x in this.musicform.controls) {
      console.log(this.musicform.controls[x]);

      this.musicform.controls[x].markAsTouched();

      console.log(this.musicform.controls[x].valid);

    }
    console.log('this.musicform.value');
    console.log(this.musicform.value);
    console.log('this.musicform.valid');
    console.log(this.musicform.valid);
    console.log('formval');
    console.log(formval);

    if(this.musicform.valid){
      if ((formval.accepttermscond == false || formval.accepttermscond == null)) {
        this.chkerror = 1;
        this.musicform.controls['accepttermscond'].setErrors({'incorrect': true});
        return false;
      } else
      {

        let link11 = '';
        if(formval._id=='' || formval._id== null)
          link11=this.serverurl+'addmusics';

        else
          link11=this.serverurl+'editmusics';

        let data=formval;

        data.user_id = this.user_id;
        console.log(data);
        this._http.post(link11,data)
            .subscribe(val =>{

              var res = val.json();
              if (res.status=='success'){

                console.log('Success');
                this.showLoader = 0;
                this.isModalMusicShown= false;

                console.log('reset starts');
                this.musicform.reset();
                this.selectedaudiourl='';
                //clearInterval(this.playstate);
                // this.playmusic();
                this.playmusic();
                if(this.isaudioplay){

                  this.audioplayerindex++;
                }
                console.log('reset ends');
                this.getmusicdetails();



              }

            }, error =>{

              console.log('Error');

            });
      }

    }


  }

  onaudioUpload(event){

    // console.log('audio');

    this.selectedFile = event.target.files[0];
    console.log('loader');
    this.showLoader = 1;

    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile);
    this.selectedaudiourl='';



    this._http.post(this.audiouploadurl+'?user_id='+this.user_id, uploadData)
        .subscribe(event =>{
          /*this.showLoader = 0;*/

          var res = event.json();
          console.log(res);

          if(res.error_code == 0){
            // this.image = res.filename;
            // console.log(this.image);
            this.tempUploadFilename = res.filename;
            this.musicform.patchValue({
              music : this.tempUploadFilename
            });
            this.showLoader = 0;
            console.log('this.tempUploadFilename');
            console.log(this.tempUploadFilename);

            this.selectedaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.user_id+'/'+ this.tempUploadFilename);

            console.log('this.selectedaudiourl');
            console.log(this.selectedaudiourl);
            console.log(this.chosenaudiourl);

          }
        });
  }


  onHidden(){                 //modal hide function


    this.isModalMusicShown= false;
    this.iscommonconfirmmodal = false;
    this.iscommonmodal = false;


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
    if(stype=='twitter' && type=='audio') {
      console.log('this.selectedaudio');
      console.log(this.selectedaudio._id);
      this.generalshareurl = 'https://twitter.com/intent/tweet?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);


    }


    if(stype=='google' && type=='audio') {
      console.log('this.selectedaudio');
      console.log(this.selectedaudio);
      this.generalshareurl = 'https://plus.google.com/share?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }


    if(stype=='linkedin' && type=='audio') {
      console.log('this.selectedaudio');
      console.log(this.selectedaudio);
      this.generalshareurl = 'https://www.linkedin.com/shareArticle?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }


    if(stype=='tumblr' && type=='audio') {
      console.log('this.selectedaudio');
      console.log(this.selectedaudio);
      this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);
      /* this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75');*/

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
