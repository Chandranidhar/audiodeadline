import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
import { DomSanitizer} from '@angular/platform-browser';
import { FacebookService, InitParams,UIParams, UIResponse } from 'ngx-facebook';

declare var FB: any;
declare var $:any;

@Component({
  selector: 'app-mylink',
  templateUrl: './mylink.component.html',
  styleUrls: ['./mylink.component.css'],
  providers: [Commonservices]
})
export class MylinkComponent implements OnInit,AfterViewInit {

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
  public real_name;
  public user_id;
  public serverurl;
  public user_name;
  public siteurl;
  public showLoader;
  public isModalLinkShown:boolean= false;
  public iscommonmodal:boolean= false;
  public commonmodalmessage:any= '';
  public iscommonconfirmmodal:boolean=false;
  public commonconfirmmodalmessage:any='';
  public fb;
  public scrapimage:any;
  public scraptitle:any='';
  public scrapdesc:any;
  public showlinksscrap:boolean=false;
  public linkArray:any=[];
  public tempval:any;
  public deleteflag:any;

  public linkform: FormGroup;
  public isloggedin:any=0;
  public currentlinklikecount:any=0;
  public cookie_user_id:any;
  public generalshareurlold:any='0';
  public generalshareurloldtype:any='0';
  public generalshareurl:any='';
  public shareflag:any;
  public selectedsharedpost:any;
  public lastsharetime:any=0;




  constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices,fb:FormBuilder,private sanitizer: DomSanitizer,public FBS: FacebookService) {

    this.userdata = userdata;
    this.serverurl=_commonservices.url;
    this.fb=fb;
    this.siteurl=_commonservices.siteurl;
    this.showLoader = 0;
    console.log('routes');
    console.log(this.activeRoute.snapshot.params);


    if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')
      this.isloggedin=1;

    this.user_name = this.userdata.get('user_name');
    this.user_id = this.userdata.get('user_id');
    this.real_name = this.userdata.get('real_name');
    this.cookie_user_id = this.userdata.get('user_id');

    if(this.activeRoute.snapshot.params.id==null || typeof(this.activeRoute.snapshot.params.id)=='undefined') {
      console.log('in profile ...');



      this.isuserprofile = 0;
    }else
    {
      this.user_name = this.activeRoute.snapshot.params.name;
      this.user_id = this.activeRoute.snapshot.params.id;

       this.isuserprofile = 1;
    }

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


    this.getLinkDetails();

    this.linkform = this.fb.group({
      linkUrl: ["", Validators.required],
      _id:[""],
      privacy:["", Validators.required]

    });

  }

  fbshare(type:any,item:any) {
    /*let options: any = {};
     var type;

     if(typeof (item.music) != 'undefined'){
     type = 'audio';
     }

     console.log(item);
     console.log(type);*/
    let currenttime =new Date().getTime();

    //this.currenttime

    let options: any = {};

    if(type=='link'){

      options = {
        method: 'share',
        // href: 'http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75'
        href: 'http://artistxp.com/sharetools.php?type=l&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id
      };
      //console.log('picture');
      //console.log('selectedsharedpost');
      //console.log(this.selectedsharedpost);


    }

    console.log(options.href);
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

  getLinkDetails(){


    let link4= this.serverurl+'getLinkListByUserid';
    let dataID = {'user_id': this.user_id};
    this._http.post(link4,dataID)
        .subscribe(res =>{

          let result = res.json();
          if(result.status=='success'){

            console.log('video result');
            console.log(result);
            this.linkArray=result.item;
            if(this.linkArray[0].linklikes[0]!=null){

              this.currentlinklikecount = this.linkArray[0].linklikes[0].vlike;
            }
            else {
              this.currentlinklikecount = 0;
            }

          }
        })
  }


  showlinklike(val:any){

    if (this.isloggedin==1) {
      this.currentlinklikecount = val;
      let link4 = this.serverurl + 'addvideolike';
      var data = {'user_id': this.user_id, videoid: val._id};
      this._http.post(link4, data)
          .subscribe(res=> {

            var result = res.json();
            console.log(result);
            if (result.status == 'success') {


              console.log('suceess like');
              this.getLinkDetails();
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

  showlinkunlike(val:any) {

    if (this.isloggedin == 1) {
      this.currentlinklikecount = val;
      let link4 = this.serverurl + 'deletevideolike';
      var data = {'user_id': this.user_id, videoid: val._id};
      this._http.post(link4, data)
          .subscribe(res=> {

            var result = res.json();
            console.log(result);
            if (result.status == 'success') {


              console.log('suceess unlike');
              this.getLinkDetails();
            }
          })
    }
  }

  editLink(item:any){

    this.linkform = this.fb.group({
      linkUrl: [item.linkUrl, Validators.required],
      _id: [item._id],
      privacy: [item.privacy, Validators.required]
    });
    this.isModalLinkShown=true;
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
              }, 1000);


              this.getLinkDetails();

            }
          }, error => {
            console.log("Oooops!");
          });
    }

  }

  getlinkdata(flag:any){
    let templink= this.linkform.controls['linkUrl'].value;

    let link5='https://audiodeadline.com/scrappage.php?url='+templink;
    //let data = {};
    //data.user_id= this.user_id;
    //console.log(data);
    this._http.get(link5)
        .subscribe(val =>{

          let res=val.json();
          console.log(res);
          if(flag==1)this.showlinksscrap=true;
          this.scrapdesc=res.description;
          this.scrapimage=res.images[0];
          this.scraptitle=res.title;
          if(flag==3) this.linkSubmit({});
        })
  }

  linkSubmit(formval){

    let x: any;
    for (x in this.linkform.controls) {
      console.log(this.linkform.controls[x]);

      this.linkform.controls[x].markAsTouched();

      console.log(this.linkform.controls[x].valid);

    }
    if(this.linkform.valid && this.scraptitle.length>4){

      let link5='';
      console.log('formval');
      console.log(formval);
      if(formval._id=='' || formval._id== null)
        link5=this.serverurl+'addlinks';
      else
        link5=this.serverurl+'editlinks';
      let data = formval;
      data.user_id= this.user_id;
      data.title= this.scraptitle;
      data.image= this.scrapimage;
      data.desc= this.scrapdesc;
      console.log(data);
      this._http.post(link5,data)
          .subscribe(val =>{
            let res=val.json();
            if(res.status='success'){
              console.log('res.status');
              console.log(res.status);
              this.linkform.reset();
              this.isModalLinkShown=false;
              this.showlinksscrap=false;
              this.getLinkDetails();
            }
          })
    }else{
      this.getlinkdata(3);
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
        /*
         console.log(event);
         console.log("Hello world!b66");*/

        //this.shareflag = type;
        //this.selectedsharedpost=selectedpost;

        this.fbshare(this.shareflag,this.selectedsharedpost);



      });
    }

    let children1 = document.getElementsByClassName("twittersharelink");

    for (let i1 = 0; i1 < children1.length; i1++) {
      children1[i1].addEventListener("click", (event: Event) => {
        //alert("Hello 112!");
        /*  console.log("Hello 11!");
         console.log("Hello world!11");
         console.log(event);*/
        this.generalshare(this.shareflag,'twitter');
      });
    }

    let children2 = document.getElementsByClassName("googlesharelink");

    for (let i2 = 0; i2 < children2.length; i2++) {
      children2[i2].addEventListener("click", (event: Event) => {
        //alert("Hello 112!");
        /* console.log("Hello 11!");
         console.log("Hello world!11");
         console.log(event);*/
        this.generalshare(this.shareflag,'google');
      });
    }

    let children3 = document.getElementsByClassName("linkedinsharelink");

    for (let i3 = 0; i3 < children3.length; i3++) {
      children3[i3].addEventListener("click", (event: Event) => {
        //alert("Hello 112!");
        /* console.log("Hello 11!");
         console.log("Hello world!11");
         console.log(event);*/
        this.generalshare(this.shareflag,'linkedin');
      });
    }

    let children4 = document.getElementsByClassName("tumblrsharelink");

    for (let i4 = 0; i4 < children4.length; i4++) {
      /*console.log('getEventListeners--- for chil4');
       console.log($._data(children4[i4], "events"));*/
      //children4[i4].removeEventListener("click");

      children4[i4].addEventListener("click", (event: Event) => {
        //alert("Hello 69!");
        /*console.log("Hello 11!");
         console.log("Hello world!11");
         console.log(event);*/
        this.generalshare(this.shareflag,'tumblr');
      });
      children4[i4].removeEventListener("click", (event: Event) => {
        // alert("Hello 77!");

      });
    }


  }

  generalshare(type:any,stype:any){
    if(this.generalshareurlold!=this.generalshareurl || this.generalshareurloldtype!=stype) {

      if (stype == 'twitter' && type == 'link') {
        /* console.log('this.selectedaudio');
         console.log(this.selectedsharedpost._id);*/
        this.generalshareurl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=l&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }

      if (stype == 'google' && type == 'link') {
        /* console.log('this.selectedaudio');
         console.log(this.selectedaudio);*/
        this.generalshareurl = 'https://plus.google.com/share?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=l&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }

      if (stype == 'linkedin' && type == 'link') {
        /*console.log('this.selectedaudio');
         console.log(this.selectedaudio);*/
        this.generalshareurl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=l&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

      }


      if(stype=='tumblr' && type=='link') {

        this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=l&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);


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

  onHidden(){
    this.isModalLinkShown=false;
    this.iscommonmodal=false;

  }

}
