import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
import { FacebookService, InitParams,UIParams, UIResponse } from 'ngx-facebook';
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
declare var moment: any;

@Component({
  selector: 'app-myphotos',
  templateUrl: './myphotos.component.html',
  styleUrls: ['./myphotos.component.css'],
  providers: [Commonservices]
})
export class MyphotosComponent implements OnInit,AfterViewInit {
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
    public pictureuploadurl;
    public deleteflag:any;
    public tempval:any;
    public pictureform: FormGroup;
    public tempUploadFilename:any='';
    public isModalPicShown;
    public selectedFile:File;
    public showLoader;
  public isuserprofile = 1;
  public siteurl;
  public serverurl;
  public user_name;
  public user_id;
  public image;
  public isloggedin:any=0;
  public real_name;
  public picArray:any=[];
  public currentpicturelikecount:any=0;
  public tabselectedpictureindex:any=0;
  public selectedpicture:any={};
  public selectedpictureuserid:any='';
  public isModalPicDetail:boolean= false;
  public commentval:any='';
    public cookie_user_id:any;
    public fb;
    public iscommonconfirmmodal:boolean=false;
    public commonconfirmmodalmessage:any='';
    public iscommonmodal:boolean= false;
    public commonmodalmessage:any= '';
    public generalshareurl:any='';
    public shareflag:any;
    public selectedsharedpost:any;



    constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices,private sanitizer: DomSanitizer, fb:FormBuilder ,public FBS: FacebookService) {

        this.userdata = userdata;
        this.fb=fb;
        this.serverurl=_commonservices.url;
        this.siteurl=_commonservices.siteurl;
        this.pictureuploadurl=_commonservices.pictureuploadurl;
        this.showLoader = 0;

    console.log('routes');
    console.log(this.activeRoute.snapshot.params);


    if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')
      this.isloggedin=1;

    this.user_name = this.userdata.get('user_name');
    this.user_id = this.userdata.get('user_id');
    this.image = this.userdata.get('image');
    this.real_name = this.userdata.get('real_name');
        this.cookie_user_id = this.userdata.get('user_id');

    if(this.activeRoute.snapshot.params.id==null || typeof(this.activeRoute.snapshot.params.id)=='undefined') {
      console.log('in profile ...');

      /*console.log('this.image');
       console.log(this.image);
       console.log('this.real_name');
       console.log(this.real_name);
       console.log(this.user_id);*/
      this.isuserprofile = 0;
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

    this.getPictureDetails();
      this.pictureform = this.fb.group({

          title_pic: ["", Validators.required],
          desc_pic: ["", Validators.required],
          privacy: ["", Validators.required],
          _id: [""],
          image_pic: ["", Validators.required],
      });
  }
    ngAfterViewInit(){

    }

  convertunixtotimeago(val:any){
    return moment.unix(val).startOf('minute').fromNow();

  }
    showpicturemodal(){

        this.isModalPicShown =  true;
    }

    pictureSubmit(formval){
        let x: any;
        for (x in this.pictureform.controls) {
            console.log(this.pictureform.controls[x]);

            this.pictureform.controls[x].markAsTouched();

            console.log(this.pictureform.controls[x].valid);

        }
        console.log('this.pictureform.value');
        console.log(this.pictureform.value);
        console.log('this.pictureform.valid');
        console.log(this.pictureform.valid);

        if(this.pictureform.valid){

            let link9 = '';
            if(formval._id=='' || formval._id== null)
                link9=this.serverurl+'addpics';

            else
                link9=this.serverurl+'editpics';

            let data=formval;
            data.user_id = this.user_id;
            console.log(data);
            this.showLoader = 1;
            this._http.post(link9,data)

                .subscribe(val =>{

                        var res = val.json();
                        //loader
                        if (res.status=='success'){
                            console.log('Success');
                            this.showLoader = 0;
                            this.isModalPicShown= false;
                            console.log('reset starts');
                            this.pictureform.reset();
                            this.tempUploadFilename = '';
                            console.log('reset ends');
                            this.getPictureDetails();


                        }

                    }, error =>{

                        console.log('Error');
                    }
                )

        }

    }
    onFileUpload(event){

        this.selectedFile = event.target.files[0];
        this.showLoader = 1;

        const uploadData = new FormData();
        uploadData.append('file', this.selectedFile);

        this._http.post(this.pictureuploadurl+'?user_id='+this.user_id, uploadData)
            .subscribe(event =>{



                var res = event.json();
                console.log(res);

                if(res.error_code == 0){
                    // this.image = res.filename;
                    // console.log(this.image);

                    this.tempUploadFilename = res.filename;
                    this.pictureform.patchValue({
                        image_pic : this.tempUploadFilename
                    });
                    this.showLoader = 0;





                }
            });


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


    editPic(item:any){

        this.pictureform = this.fb.group({

            title_pic: [item.title_pic, Validators.required],
            desc_pic: [item.desc_pic, Validators.required],
            privacy: [item.privacy, Validators.required],
            _id: [item._id],
            image_pic: [item.image_pic, Validators.required],


        });
        this.isModalPicShown=true;
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


                        this.getPictureDetails();

                    }
                }, error => {
                    console.log("Oooops!");
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

              this.getPictureDetails();
              /*this.getallpicture();*/
              console.log('this.tabselectedpictureindex');
              console.log(this.tabselectedpictureindex);
              /*if (this.selectedpictureindex > 0) {
                console.log('selected picture index block');

                // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                this.selectedpicture = this.picturedetailArray[this.selectedpictureindex];
              }*/
                if (this.tabselectedpictureindex > 0) {
               console.log('selected picture index block');

               // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
               this.selectedpicture = this.picArray[this.tabselectedpictureindex];
               }
              console.log('suceess like');


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

             this.getPictureDetails();
              // this.getallpicture();
              console.log('suceess unlike');
            }
          })
    }
  }

  showpicturedetail(val:any){
    this.selectedpicture = val;
    console.log('this.selectedpicture');
    console.log(this.selectedpicture);
    this.isModalPicDetail = true;
     this.tabselectedpictureindex = this.picArray.indexOf(val);

    console.log('this.tabselectedpictureindex');
    console.log(this.tabselectedpictureindex);

    this.selectedpictureuserid= val.user_id;
    let link3 = this.serverurl+'addpicview';
    var data = {'user_id':this.user_id,_id:val._id};
    this._http.post(link3,data)
        .subscribe(res=> {

          var result = res.json();
          console.log(result);
          if(result.status=='success'){

            this.getPictureDetails();
            console.log('suceess');
          }
        })
  }


  addcomment(val:any){

    // this.selectedpost = val;



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

            this.getPictureDetails();
            this.selectedpicture.comments=res.item;
            console.log('this.selectedpicture.comments');
            console.log(this.selectedpicture.comments);

            this.commentval='';






          })
    }
  }

  getPictureDetails(){

    let link10= this.serverurl+'getPictureListByUserid';
    let dataID = {'user_id': this.user_id};
    console.log('dataID');
    console.log(dataID);

    this._http.post(link10,dataID)
        .subscribe(res=> {
          let result = res.json();
          if(result.status=='success') {


            console.log('picmodal result');
            console.log(result);
            this.picArray = result.item;
            console.log('this.picArray');
            console.log(this.picArray);
            if (this.picArray.length > 0) {


              if(this.selectedpicture.comments == null)
                this.selectedpicture = this.picArray[0];

              if (this.picArray[0].picturelikes[0] != null) {

                this.currentpicturelikecount = this.picArray[0].picturelikes[0].vlike;
              }
              else {
                this.currentpicturelikecount = 0;
              }
              if (this.tabselectedpictureindex > 0) {
                console.log('selected picture index block');

                // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                this.selectedpicture = this.picArray[this.tabselectedpictureindex];
              }


              if ((this.selectedpicture.comments) == null) {

                this.selectedpicture = this.picArray[0];

              }
              else {
                for (let c1 in this.picArray) {
                  if (this.picArray[c1]._id == this.selectedpicture._id) {
                    this.selectedpicture = this.picArray[c1];
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
          }

        })
  }

  onHidden(){

      this.isModalPicDetail = false;
      this.isModalPicShown=false;
      this.iscommonconfirmmodal=false;
      this.iscommonmodal = false;
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
                this.fbshare('picture');
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

        if(stype=='twitter' && type=='picture') {


            this.generalshareurl = 'https://twitter.com/intent/tweet?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);


        }

        if(stype=='google' && type=='picture') {
            console.log('this.selectedaudio');
            // console.log(this.selectedaudio);
            this.generalshareurl = 'https://plus.google.com/share?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

        }


        if(stype=='linkedin' && type=='picture') {
            console.log('this.selectedaudio');
            // console.log(this.selectedaudio);
            this.generalshareurl = 'https://www.linkedin.com/shareArticle?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

        }

        if(stype=='tumblr' && type=='picture') {
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
