import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
import { FacebookService, InitParams,UIParams, UIResponse } from 'ngx-facebook';

declare var $:any;
declare var moment: any;

@Component({
  selector: 'app-myvideo',
  templateUrl: './myvideo.component.html',
  styleUrls: ['./myvideo.component.css'],
  providers: [Commonservices]
})
export class MyvideoComponent implements OnInit,AfterViewInit {
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
  public siteurl;
  public serverurl;
  public user_name;
  public user_id;
  private image;
  public videoArray:any=[];
  public selectedvideo:any={};
  public currentvideoid:any;
  public videoplayerindex:any=0;
  public videoplayfag:any=false;
  public currentvideotype:any;
  public choosenvideourl:any;
  public isloggedin:any=0;
  public currentlikecount:any=0;
  private playstate:any;
  public commentval:any='';
  public scrolled:any=0;
  public showpreviewvideo:boolean;
  public modalform: FormGroup;
  public fb;
  public isModalVideoShown:boolean = false;
  public chkerror2;
  public showLoader;
  public isVideoSaved:any;
  public deleteflag:any;
  public tempval:any;
  public iscommonconfirmmodal:boolean=false;
  public commonconfirmmodalmessage:any='';
  public iscommonmodal:boolean= false;
  public commonmodalmessage:any= '';
  public satizedurl:any='';
  public cookie_user_id:any;
  public generalshareurl:any='';
  public shareflag:any;
  public selectedsharedpost:any;
  public lastsharetime:any=0;
  public generalshareurlold:any='0';
  public generalshareurloldtype:any='0';


  constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices,private sanitizer: DomSanitizer,fb:FormBuilder, public FBS: FacebookService) {

    this.userdata = userdata;
    this.serverurl=_commonservices.url;
    this.siteurl=_commonservices.siteurl;
    this.fb = fb;
    this.chkerror2 = 0;
    this.showLoader = 0;
    this.isVideoSaved = 0;
    this.satizedurl= sanitizer;


    this.showpreviewvideo = false;
    console.log('routes');
    console.log(this.activeRoute.snapshot.params);


    if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')
      this.isloggedin=1;

    this.user_name = this.userdata.get('user_name');
    this.user_id = this.userdata.get('user_id');
    this.cookie_user_id = this.userdata.get('user_id');

    if(this.activeRoute.snapshot.params.id==null || typeof(this.activeRoute.snapshot.params.id)=='undefined') {

      console.log('in profile ...');

     /* this.image = this.userdata.get('image');
      console.log('this.image');
      console.log(this.image);*/
      console.log('this.user_name');
      console.log(this.user_name);
      this.isuserprofile = 0;
    }else{
      this.user_name = this.activeRoute.snapshot.params.name;
      this.user_id = this.activeRoute.snapshot.params.id;
      console.log('this.image');
      console.log(this.image);
      console.log('this.user_id');
      console.log(this.user_id);
      console.log(this.user_name);
      console.log(this.user_name);
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

    this.modalform = this.fb.group({
      _id: [""],
      title: ["", Validators.required],
      type: [""],
      privacy: ["", Validators.required],
      accepttermscond: [false],
      // videoUrl: ["", [
      //     Validators.required,
      //     Validators.pattern("/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/")]]

      videoUrl: ["", Validators.required],

    });

    var link2= this.serverurl+'getDetailsByUsername';
    var data = {'username':this.user_name};
    console.log('username');
    console.log(data.username);

    this._http.post(link2, data)
        .subscribe(res => {
          var result = res.json();
          console.log('result.item');
          console.log(result.item);
          console.log('result.item[0].images');
          console.log(result.item[0].images);
          if(result.status=='success'){


            if(result.item[0].images != null)
              this.image = 'https://audiodeadline.com/nodeserver/uploads/'+result.item[0].images;
            else
              this.image= '../../assets/images/default_profile_pic.jpg';
            console.log('this.image');
            console.log(this.image);
          }
        }, error => {
          console.log("Oooops!");
        });

    this.getVideoDetails();

    this.playstate = setInterval(() => {

      this.getVideoDetails();


    }, 15000);

  }

  ngAfterViewInit(){

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

  getVideoDetails(){


    let link4= this.serverurl+'getVideoListByUserid';
    let dataID = {'user_id': this.user_id};
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



            /* if(this.videoArray.length>0 && !this.videoplayfag){

               this.currentvideoid=this.videoArray[0]._id;

               if((this.selectedvideo.comments)==null) {
                 this.selectedvideo = this.videoArray[0];
               }
               console.log('this.selectedvideo');
               console.log(typeof(this.selectedvideo));
               console.log((this.selectedvideo));

               if(this.videoplayerindex>0 && (this.selectedvideo.comments)==null){

                 this.selectedvideo = this.videoArray[this.videoplayerindex];
               }
               let tempvurl=this.videoArray[0].videoUrl;
               console.log('tempvurl....');
               console.log(tempvurl);
               this.currentvideoid=this.videoArray[0]._id;
               //this.choosenvideourl=this.videoArray[0].videoUrl;
               if(this.videoArray[0].type=='vimeo' && !this.videoplayfag){
                 if(this.videoArray[0].videoviews[0]!=null){
                   this.currentvideoviewcount = this.videoArray[0].videoviews[0].vcount;
                 }
                 else {

                   this.currentvideoviewcount = 0;
                 }


                 if(this.videoArray[0].videolikes[0]!=null){

                   this.currentlikecount = this.videoArray[0].videolikes[0].vlike;
                 }
                 else {
                   this.currentlikecount = 0;
                 }



                 let vimeourl = tempvurl.split('/');
                 let videoid = vimeourl[vimeourl.length - 1];
                 console.log('videoid ......');
                 console.log(videoid);
                 this.currentvideotype='vimeo';
                 this.choosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

               }
               if(this.videoArray[0].type=='youtube' && !this.videoplayfag) {
                 let videourl = this.videoArray[0].videoUrl.split('v=');
                 let videoid = videourl[videourl.length - 1];
                 this.choosenvideourl=videoid;
                 this.currentvideotype='youtube';
               }

             }

             //getting thumbnail of vimeo videos
             for (let x1 in this.videoArray){
               if(this.videoArray[x1].type=='vimeo'){
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
             }*/




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
              this.getVideoDetails();
            }
          }, error => {
            console.log("Oooops!");
          });
      //this.getVideoDetails();
      this.getVideoDetails();
    }
    if(event.data==0){
      this.videoplayfag=true;
      this.getVideoDetails();
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


              this.getVideoDetails();
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


              this.getVideoDetails();
              console.log('suceess unlike');
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

    // this.selectedpost = val;

    console.log('val');
    console.log(val);
    // this.selectedvideo=val;
    console.log('this.videoArray');
    console.log(this.videoArray);

    // this.currentvideoidtrending=this.selectedvideo._id;
    console.log('this.currentvideoid');
    console.log(this.currentvideoid);

    console.log(val.keyCode);
    console.log(val.shiftKey);
    if(val.keyCode==13 && !val.shiftKey && this.commentval.length>0){

      console.log('submit comment here ....');
      let link = this.serverurl+'addcomment';
      let data = {'post_id': this.selectedvideo._id,'user_id':this.user_id, 'comment':this.commentval};
      console.log('data');
      console.log(data);
      this._http.post(link, data)
          .subscribe(val =>{

            var res = val.json();
            console.log('success');
            console.log('res');
            console.log(res.item);

            this.getVideoDetails();
            this.selectedvideo.comments=res.item;

            this.commentval='';






          })
    }
  }


  editVideo(item:any){
    this.showpreviewvideo=false;
    this.modalform = this.fb.group({
      title: [item.title, Validators.required],
      type: [item.type],
      privacy: [item.privacy, Validators.required],
      accepttermscond: [item.accepttermscond],
      _id: [item._id],
      videoUrl: [item.videoUrl, Validators.required],

    });
    this.isModalVideoShown=true;
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

              this.getVideoDetails();

            }
          }, error => {
            console.log("Oooops!");
          });
    }

  }

  //video modal

  modalSubmit(formval){
    this.chkerror2 = 0;
    let x: any;
    for (x in this.modalform.controls) {
      console.log(this.modalform.controls[x]);

      this.modalform.controls[x].markAsTouched();

      console.log(this.modalform.controls[x].valid);

    }
    console.log('this.modalform.value');
    console.log(this.modalform.value);
    console.log('this.modalform.valid');
    console.log(this.modalform.valid);

    if (this.modalform.valid){

      if (formval.accepttermscond == false || formval.accepttermscond == null) {
        this.chkerror2 = 1;
        this.modalform.controls['accepttermscond'].setErrors({'incorrect': true});
        return false;
      } else{


        let  link3='';
        if(formval._id=='')
          link3=this.serverurl+'addvideos';
        else
          link3=this.serverurl+'editvideos';
        let data=formval;
        data.user_id = this.user_id;
        console.log(data);
        this.showLoader = 1;
        this._http.post(link3,data)

            .subscribe(val =>{

                  var res = val.json();
                  //loader
                  if (res.status=='success'){
                    console.log('Success');
                    this.isModalVideoShown= false;
                    this.showLoader = 0;                //loader
                    this.isVideoSaved = 1;
                    this.modalform.reset();
                    this.getVideoDetails();         // updating the video after inserting

                    // this.getallpicture();
                    // this.getallmusic();

                  }

                }, error =>{

                  console.log('Error');
                }
            )

      }




    }
  }

  updatesantizedurl(){
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
  }

  showvideopreview(){
    this.showpreviewvideo=true;
    this.updatesantizedurl();
    console.log('this.satizedurl');
    console.log(this.satizedurl);

  }

  onHidden(){                 //modal hide function


    this.isModalVideoShown= false;
    this.isVideoSaved = 0;
    this.iscommonconfirmmodal = false;
    this.iscommonmodal = false;


  }

  fbshare(type:any,item:any) {

    let currenttime =new Date().getTime();
    let options: any = {};

    if(type=='video'){

      options = {
        method: 'share',

        href: 'http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id
      };

    }

    setTimeout(()=> {
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
       /* console.log("Hello world!");
        console.log("Hello world!b66");
        console.log(event);*/
        this.fbshare(this.shareflag,this.selectedsharedpost);
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
    if(this.generalshareurlold!=this.generalshareurl || this.generalshareurloldtype!=stype) {

    if(stype=='twitter' && type=='video') {
      console.log('this.selectedaudio');
      console.log(this.selectedvideo._id);
      console.log(this.selectedvideo.user_id);
      this.generalshareurl = 'https://twitter.com/intent/tweet?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);


    }

    if(stype=='google' && type=='video') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://plus.google.com/share?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }

    if(stype=='linkedin' && type=='video') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://www.linkedin.com/shareArticle?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }

    if(stype=='tumblr' && type=='video') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);
      /* this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75');*/

    }

    console.log('this.generalshareurl');
    console.log(this.generalshareurl);


    let gsharelink:any;
    gsharelink = document.getElementsByClassName("gsharelink");
    //gsharelink.click();
    //$('.gsharelink').click();
     this.generalshareurlold = this.generalshareurl;
     this.generalshareurloldtype = stype;
    setTimeout(()=> {
      this.gsharelink.nativeElement.click();
    },500);

  }
  }

  setshareflag(type:any,selectedpost:any){

    this.shareflag = type;
    this.selectedsharedpost=selectedpost;
    console.log('in setshareflag');
    console.log(type);
  }




}
