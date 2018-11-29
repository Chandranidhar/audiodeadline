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
  selector: 'app-trendingvideos',
  templateUrl: './trendingvideos.component.html',
  styleUrls: ['./trendingvideos.component.css'],
  providers: [Commonservices]
})
export class TrendingvideosComponent implements OnInit,AfterViewInit {
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
  public shareflag:any;
  public selectedsharedpost:any;


  constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices,private sanitizer: DomSanitizer,public FBS: FacebookService) {


    this.userdata = userdata;
    this.serverurl=_commonservices.url;
    this.siteurl=_commonservices.siteurl;
    console.log('routes');
    console.log(this.activeRoute.snapshot.params);


    if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')
      this.isloggedin=1;

    if(this.activeRoute.snapshot.params.id==null || typeof(this.activeRoute.snapshot.params.id)=='undefined') {

      console.log('in profile ...');
      this.user_name = this.userdata.get('user_name');
      this.user_id = this.userdata.get('user_id');
      this.image = this.userdata.get('image');
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
      console.log(this.user_name);
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

  ngAfterViewInit(){

  }

  ngOnInit() {

    this.getallvideo();

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
  convertunixtotimeago(val:any){
    return moment.unix(val).startOf('minute').fromNow();

  }
  getallvideo(){


    let link4= this.serverurl+'trendingVideoList';
    this._http.get(link4)
        .subscribe(res =>{

          let result = res.json();
          if(result.status=='success'){

            console.log('video result');
            console.log(result);
            let oldvideodetailarray=this.videodetailArray;
            this.videodetailArray=result.item;

            if(this.selectedvideoindex>0){
              console.log('selected video index block');

              // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
              // /this.selectedvideo = this.videodetailArray[this.selectedvideoindex];
            }


            if( this.videodetailArray.length>0 && !this.videoplayfag){
              this.currentvideoidtrending=this.videodetailArray[0]._id;
              //this.selectedvideotrending=this.videodetailArray[0];
              console.log('this.selectedvideotrending.comments');
              console.log(this.selectedvideotrending.comments);


              if(this.videodetailArray[0].type=='vimeo'){
                let tempvurl=this.videodetailArray[0].videoUrl;
                let vimeourl = tempvurl.split('/');
                let videoid = vimeourl[vimeourl.length - 1];
                console.log('videoid ......');
                console.log(videoid);

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

              if((this.selectedvideotrending.comments)==null) {
                console.log('in null block ...');
                this.selectedvideotrending = this.videodetailArray[0];
              }
              else{

                console.log('this.selectedvideotrending');
                console.log(this.selectedvideotrending);
                for(let c1 in this.videodetailArray){
                  if(this.videodetailArray[c1]._id==this.selectedvideotrending._id){
                    this.selectedvideotrending=this.videodetailArray[c1];
                  }
                }

              }
            }
            if( this.videodetailArray.length>0 && this.videoplayfag){
              for(let c1 in this.videodetailArray){
                if(this.videodetailArray[c1]._id==this.selectedvideotrending._id){
                  this.selectedvideotrending=this.videodetailArray[c1];
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
                      console.log('vimeo json result ....');
                      console.log(result);
                      console.log(result[0].thumbnail_large);
                      this.videodetailArray[x1].thumbnail=result[0].thumbnail_large;

                    }, error => {
                      console.log("Oooops!");
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
      console.log('videoid ......');
      console.log(videoid);
      this.currentvideotypetrending='vimeo';
      this.choosenvideourlfortrending = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

    }
    if(item.type=='youtube') {
      setTimeout(()=> {    //<<<---    using ()=> syntax
        let videourl = item.videoUrl.split('v=');
        let videoid = videourl[videourl.length - 1];
        this.choosenvideourlfortrending=videoid;
        console.log('videoid');
        this.currentvideotypetrending='youtube';
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

  onStateChangetrending(event){
    console.log('event ....');
    console.log(event);
    this.videoplayfag=true;
    if(event.data == -1){
      var link2= this.serverurl+'addvideoviews';
      var data = {'user_id':this.user_id,videoid:this.currentvideoidtrending};
      console.log('username');
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
      //this.getVideoDetails();
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
            console.log(result);
            if (result.status == 'success') {


              this.getallvideo();
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


              this.getallvideo();
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
    console.log('this.videodetailArray');
    console.log(this.videodetailArray);

    // this.currentvideoidtrending=this.selectedvideo._id;
    console.log('this.currentvideoidtrending');
    console.log(this.currentvideoidtrending);

    console.log(val.keyCode);
    console.log(val.shiftKey);
    if(val.keyCode==13 && !val.shiftKey && this.commentval.length>0){

      console.log('submit comment here ....');
      let link = this.serverurl+'addcomment';
      let data = {'post_id': this.selectedvideotrending._id,'user_id':this.user_id, 'comment':this.commentval};
      console.log('data');
      console.log(data);
      this._http.post(link, data)
          .subscribe(val =>{

            var res = val.json();
            console.log('success');
            console.log('res');
            console.log(res.item);

            this.getallvideo();
            this.selectedvideotrending.comments=res.item;

            this.commentval='';






          })
    }
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
        this.fbshare('trendingvideo');
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

    if(stype=='twitter' && type=='trendingvideo') {
      console.log('this.selectedaudio');
      /*console.log(this.selectedvideo._id);
      console.log(this.selectedvideo.user_id);*/
      this.generalshareurl = 'https://twitter.com/intent/tweet?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }

    if(stype=='google' && type=='trendingvideo') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://plus.google.com/share?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }

    if(stype=='linkedin' && type=='trendingvideo') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://www.linkedin.com/shareArticle?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }


    if(stype=='tumblr' && type=='trendingvideo') {
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
