import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
import { FacebookService, InitParams,UIParams, UIResponse } from 'ngx-facebook';

declare var moment: any;

@Component({
  selector: 'app-photogallery',
  templateUrl: './photogallery.component.html',
  styleUrls: ['./photogallery.component.css'],
  providers: [Commonservices]
})
export class PhotogalleryComponent implements OnInit,AfterViewInit  {
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
  public image;
  public isloggedin:any=0;
  public real_name;
  public picturedetailArray:any=[];
  public selectedpictureindex:any=0;
  public selectedpicture:any={};
  public currentpicturelikecount:any=0;
  public isModalPicDetail:boolean= false;
  public selectedpictureuserid:any='';
  public commentval:any='';
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

    this.user_name = this.userdata.get('user_name');
    this.user_id = this.userdata.get('user_id');
    this.image = this.userdata.get('image');
    this.real_name = this.userdata.get('real_name');

    if(this.activeRoute.snapshot.params.id==null || typeof(this.activeRoute.snapshot.params.id)=='undefined') {
      console.log('in profile ...');

      /*console.log('this.image');
      console.log(this.image);
      console.log('this.real_name');
      console.log(this.real_name);
      console.log(this.user_id);*/
      /*this.isuserprofile = 0;*/
    }else
    {
      this.user_name = this.activeRoute.snapshot.params.name;
      this.user_id = this.activeRoute.snapshot.params.id;
      /*console.log('this.user_id');
      console.log(this.user_id);
      console.log('this.user_name');
      console.log(this.user_name);
      console.log('this.real_name');
      console.log(this.real_name);
      console.log('this.image');
      console.log(this.image);*/
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


    this.getallpicture();
  }

  ngAfterViewInit(){

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

              /*this.getPictureDetails();*/
              this.getallpicture();
              console.log('this.tabselectedpictureindex');
              // console.log(this.tabselectedpictureindex);
              if (this.selectedpictureindex > 0) {
                console.log('selected picture index block');

                // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                this.selectedpicture = this.picturedetailArray[this.selectedpictureindex];
              }
            /*  if (this.tabselectedpictureindex > 0) {
                console.log('selected picture index block');

                // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                this.selectedpicture = this.picArray[this.tabselectedpictureindex];
              }*/
              console.log('suceess like');


            }
          })

    }
  }

  convertunixtotimeago(val:any){
    return moment.unix(val).startOf('minute').fromNow();

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
            console.log(result);
            if (result.status == 'success') {

              // this.getPictureDetails();
              this.getallpicture();
              console.log('suceess unlike');
            }
          })
    }
  }


  showpicturedetail(val:any){
    // this.selectedpictureobject = val;

    this.selectedpicture = val;
    console.log('this.selectedpicture');
    console.log(this.selectedpicture);
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
          console.log(result);
          if(result.status=='success'){

            /*this.getPictureDetails();*/
            this.getallpicture();
            console.log('suceess');
          }
        })
  }


  addcomment(val:any){

    // this.selectedpost = val;

    console.log('val');
    console.log(val);
    // this.selectedpicture=val;


    // this.currentvideoidtrending=this.selectedvideo._id;


    console.log(val.keyCode);
    console.log(val.shiftKey);
    if(val.keyCode==13 && !val.shiftKey && this.commentval.length>0){

      console.log('submit comment here ....');
      let link = this.serverurl+'addcomment';
      let data = {'post_id': this.selectedpicture._id,'user_id':this.user_id, 'comment':this.commentval};
      console.log('data');
      console.log(data);
      this._http.post(link, data)
          .subscribe(val =>{

            let res:any={};
            res = val.json();
            console.log('success');
            console.log('res');
            console.log(res.item);

            this.getallpicture();
            this.selectedpicture.comments=res.item;
            console.log('this.selectedpicture.comments');
            console.log(this.selectedpicture.comments);

            this.commentval='';






          })
    }
  }


  getallpicture(){


    let link4= this.serverurl+'trendingPictureList';
    this._http.get(link4)
        .subscribe(res =>{

          let result = res.json();
          if(result.status=='success'){

            console.log('result');
            console.log(result);
            this.picturedetailArray=result.item;

            if (this.picturedetailArray.length > 0) {

              if ((this.selectedpicture.comments) == null) {

                this.selectedpicture = this.picturedetailArray[0];

              }
              if (this.selectedpictureindex > 0) {
                console.log('selected picture index block');

                // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                this.selectedpicture = this.picturedetailArray[this.selectedpictureindex];
              }
              if ((this.selectedpicture.comments) == null) {

                this.selectedpicture = this.picturedetailArray[0];

              }
              else {
                for (let c1 in this.picturedetailArray) {
                  if (this.picturedetailArray[c1]._id == this.selectedpicture._id) {
                    this.selectedpicture = this.picturedetailArray[c1];
                    /* this.chosenaudiotitle = this.musicArray[c1].title_music;
                     this.audiousername = this.musicArray[c1].userdata[0].firstname+' '+this.musicArray[c1].userdata[0].lastname;*/

                    console.log('this.selectedpicture in for loop1');
                    console.log(this.selectedpicture);
                    console.log('this.selectedpicture.comments.....');
                    console.log(this.selectedpicture.comments);

                  }
                }
              }

            }

           /* if(this.selectedpictureindex>0){
              console.log('selected picture index block');

              // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
              this.selectedpicture = this.picturedetailArray[this.selectedpictureindex];
            }*/


          }
        })
  }

  onHidden(){

    this.isModalPicDetail = false;
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

    if(stype=='twitter' && type=='trendingpicture') {
      console.log('this.selectedaudio');
      console.log(this.selectedsharedpost._id);
      console.log(this.selectedsharedpost.user_id);
      this.generalshareurl = 'https://twitter.com/intent/tweet?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }


    if(stype=='google' && type=='trendingpicture') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://plus.google.com/share?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }


    if(stype=='linkedin' && type=='trendingpicture') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://www.linkedin.com/shareArticle?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

    }

    if(stype=='tumblr' && type=='trendingpicture') {
      console.log('this.selectedaudio');
      // console.log(this.selectedaudio);
      this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);
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
