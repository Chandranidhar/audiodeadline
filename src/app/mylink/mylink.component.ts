import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-mylink',
  templateUrl: './mylink.component.html',
  styleUrls: ['./mylink.component.css'],
  providers: [Commonservices]
})
export class MylinkComponent implements OnInit {

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




  constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices,fb:FormBuilder,private sanitizer: DomSanitizer) {

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
  }

  ngOnInit() {


    this.getLinkDetails();

    this.linkform = this.fb.group({
      linkUrl: ["", Validators.required],
      _id:[""],
      privacy:["", Validators.required]

    });

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

  onHidden(){
    this.isModalLinkShown=false;
    this.iscommonmodal=false;

  }

}
