import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
import { DomSanitizer} from '@angular/platform-browser';
import { FacebookService, InitParams,UIParams, UIResponse } from 'ngx-facebook';

declare var $:any;
declare var moment: any;
declare var FB: any;
//declare var scrolled = 0;

@Component({
    selector: 'app-artistsexchange',
    templateUrl: './artistsexchange.component.html',
    styleUrls: ['./artistsexchange.component.css'],
    providers: [Commonservices]
})
export class ArtistsexchangeComponent implements OnInit,AfterViewInit {
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

    /*html1: string = `
<div class="socialmediaicons socialmediaiconsform">    
        <span *ngFor="let val of playlistarray">
        <p>{{val.playlist_name}}</p>
</span>
      <input type="checkbox" name="watchlater" value="watchlater" > Watch later        
      <a href="javascript:void(0)" class="createlabel createplaylist"><i class="fa fa-plus"></i> Create new playlist</a>   
      <div class="hide">
        <input class="form-control" placeholder="Enter playlist name..." tabindex="0" maxlength="150">           
        <input type="button" value="Create"> 
      </div>  
</div>
`;*/
    html1='';

    html2: string = `
<div class="socialmediaicons socialmediaiconsform">    
<form action="">
      <input type="checkbox" name="watchlater" value="watchlater" > Watch later        
      <a href="javascript:void(0)" class="createlabel createplaylist2"><i class="fa fa-plus"></i> Create new playlist</a>   
      <div class="hide">
        <input class="form-control" placeholder="Enter playlist name..." tabindex="0" maxlength="150">           
        <input type="button" value="Create"> 
      </div>  
</form>
</div>
`;
    /*for share popover*/


    //
    // tabs: any[] = [
    //   {
    //     title: 'Dynamic Title 2',
    //     content: 'Dynamic content 2',
    //     customClass: 'customClass'
    //   },{
    //     title: 'Dynamic Title 2',
    //     content: 'Dynamic content 2',
    //     customClass: 'customClass'
    //   }
    // ];
    public userdata: CookieService;

    public modalform: FormGroup;
    public linkform: FormGroup;
    public pictureform: FormGroup;
    public musicform: FormGroup;
    public fbpageform: FormGroup;
    public playlistform: FormGroup;
    public videoplaylistform: FormGroup;

    public siteurl;
    public demourl;
    public demourl1;
    public consumer_key;
    public consumer_secret;

    public routeParams:any;
    public real_name;
    public serverurl;
    public user_name;
    public selectedFile:File;
    public uploadurl;
    public pictureuploadurl;
    public audiouploadurl;
    public image;
    public imageserror:boolean;
    public showLoader;
    public loaderflag:boolean;
    public user_id;
    public scrolled:any=0;
    public isModalShown:boolean= false;
    public isModalVideoShown:boolean= false;
    public isModalLinkShown:boolean= false;
    public iscommonmodal:boolean= false;
    public commonmodalmessage:any= '';
    public fan;
    public musicians;
    public dancer;
    public model;
    public signupaffiliate;
    public fb;
    public scrapimage:any;
    public scraptitle:any='';
    public scrapdesc:any;
    public showlinksscrap:boolean=false;

    public videoArray:any=[];
    public isVideoSaved:any;
    public showpreviewvideo:boolean;
    public timerflag:any=0;
    public satizedurl:any='';
    public choosenvideourl:any;
    public tempval:any;
    public iscommonconfirmmodal:boolean=false;
    public commonconfirmmodalmessage:any='';
    public currentvideotype:any='';
    public currentvideoid:any;
    public linkArray:any=[];
    public tempval1:any;
    public deleteflag:any;
    public isuserprofile = 1;
    public isModalPicShown;
    public picArray:any=[];
    public tempUploadFilename:any='';
    public isModalPicDetail;
    public isModalMusicShown;
    public musicArray:any=[];
    public value:any=75;
    public value1:any=0;
    public value2:any=0;
    public value3:any=0;
    public piclimitstart:any=0;
    public piclimitend:any=8;
    public currentvideoviewcount:any=0;
    public currentlikecount:any=0;
    public currentmusiclikecount:any=0;
    public currentpicturelikecount:any=0;
    public currentlinklikecount:any=0;
    public commentval:any='';

    public options;
    public options1;
    public options2;
    public options3;


    public videodetailArray:any=[];
    public picturedetailArray:any=[];
    public musicdetailArray:any=[];
    public choosenvideourlfortrending:any;
    public currentvideotypetrending:any;

    public isaudioplayfortrending:boolean=false;

    public chosenaudiourl:any;
    public isaudioplay:boolean=false;
    public audioDuration:any='';
    public playstate:any='';
    public oldvolume:any=0;
    public audioDurationfortrending:any='';
    public ismuteaudio:boolean = false;
    public selectedaudiourl:any='';
    public chosenaudiotitle:any;


    public playstatetrending:any='';
    public twitterinterval:any='';

    public oldvolumetrending:any=0;

    public chkerror;
    public chkerror2;
    private audioplayerindex:any=0;
    private audioplayerindextrending:any=0;
    public shuffleflag:boolean = false;

    public audiousername:any;
    public chosenaudiotitletrending:any;
    public chosenaudiourlfortrending:any='';
    public audiousernamefortrending:any;
    public videoplayfag:any=false;
    public shuffleflag2:boolean = false;
    public ismuteaudiotrending:boolean = false;
    public selectedpicture:any;
    public selectedpicturetrending:any;
    public currentvideoidtrending:any='';
    public selectedpictureuserid:any;
    public ismodalcomment:any = 0;
    public currentaudioid:any = '';
    public selectedpictureindex:any=0;
    public selectedpictureobject:any={};
    public tabselectedpictureindex:any=0;
    public commentarray:any=[];
    public selectedvideo:any={};
    public selectedaudio:any=[];
    public selectedaudioindex:any=0;
    private isloggedin:any=0;
    public selectedpost:any={};
    private videoplayerindex:any=0;
    public selectedvideotrending:any={};
    public twitter_oauth_token:any='';
    public twitter_oauth_token_secret:any='';
    public twitterhtml:any='';
    public insta_access_token:any='';
    public insta_followers_count:any='';
    public instausername:any='';
    public instainterval;
    public instauserid;
    public instafeedarray:any=[];
    public twitterresult:any='';
    public twitterresultarr:any=[];
    public isModalfbShown:boolean = false;
    //public facebook_page_url:any='https://www.facebook.com/marshmellomusic/';
    public facebook_page_url:any='';
    public selectedmusictrending:any={};
    public twitterfeed:any='';
    public fanlikearray:any=[];
    public fanmusiclikearray:any=[];
    public fanvideolikearray:any=[];
    public fanlinklikearray:any=[];
    public generalshareurl:any='';
    public shareflag:any;
    public selectedsharedpost:any;

    public selectedinstapost:any=[];
    public generalshareurlold:any='0';
    public generalshareurloldtype:any='0';
    public instacommentarray:any=[];
    public isPlaylistModalShown:any= false;
    public isPlaylistVideoModalShown:any= false;
    public musicplaylistarray:any=[];
    public playlistarray:any=[];
    public lastsharetime:any=0;
    public userprofile_id;
    public userfriendlist:any=[];
    public twitter_timelineid:any='';
    public twitter_timelineurl:any='';
    //public FBS:any;




    constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices,fb:FormBuilder,private sanitizer: DomSanitizer,public FBS: FacebookService) {

        this.chkerror = 0;
        //this.FBS=FBS;
        this.chkerror2 = 0;
        this.ismodalcomment  = 0;
        // this.ismuteaudio = false;

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
        this.demourl=_commonservices.demourl;
        this.demourl1=_commonservices.demourl1;
        this.consumer_key=_commonservices.CONSUMER_KEY;
        this.consumer_secret=_commonservices.CONSUMER_SECRET;
        this.fb=fb;
        this.uploadurl=_commonservices.uploadurl;
        this.pictureuploadurl=_commonservices.pictureuploadurl;
        this.audiouploadurl=_commonservices.audiouploadurl;
        this.imageserror = false;
        this.satizedurl= sanitizer;
        this.showLoader = 0;
        this.loaderflag = false;
        this.isVideoSaved = 0;
        this.showpreviewvideo = false;
        this.isModalPicDetail = false;
        this.isModalMusicShown = false;
        this.isModalfbShown = false;
        this.shuffleflag = false;
        this.shuffleflag2 = false;


        this.siteurl=_commonservices.siteurl;

      /*  console.log('routes');
        console.log(this.activeRoute.snapshot.params);*/

        // this.image= '';

        if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')
            this.isloggedin=1;

        this.user_name = this.userdata.get('user_name');
        this.user_id = this.userdata.get('user_id');
        this.fan = 0;
        // this.image = this.userdata.get('image');

        if(this.activeRoute.snapshot.params.id==null || typeof(this.activeRoute.snapshot.params.id)=='undefined') {
            // console.log('in profile ...');

            this.isuserprofile = 0;

            this.fan = this.userdata.get('fan');
        }else{
            console.log('in user profile ...');
            this.user_name = this.activeRoute.snapshot.params.name;
            // this.user_id = this.activeRoute.snapshot.params.id;
            this.userprofile_id = this.activeRoute.snapshot.params.id;
            console.log('this.user_id in userprofile');
            console.log(this.user_id);
            console.log(this.userprofile_id);

            this.isuserprofile = 1;
           /* this.isloggedin=1;*/

        }




        let initParams: InitParams = {
            appId: '2034821446556410',
            xfbml: true,
            version: 'v2.8'
        };

        FBS.init(initParams);

       /* share(url: string) {

            let params: UIParams = {
                href: 'https://github.com/zyra/ngx-facebook',
                method: 'share'
            };

            this.fb.ui(params)
                .then((res: UIResponse) => console.log(res))
                .catch((e: any) => console.error(e));
        }*/




        /*call user related function*/

        var link2= this.serverurl+'getDetailsByUsername';
        var data = {'username':this.user_name};
        // console.log('username');
        // console.log(data.username);
        this._http.post(link2, data)
            .subscribe(res => {
                var result = res.json();
                // console.log('result.item');
                // console.log(result.item);
                if(result.status=='success'){

                    this.real_name = result.item[0].realname;
                    this.facebook_page_url=result.item[0].facebookpage;
                    // console.log('facebook_page_url');
                    // console.log(this.facebook_page_url);
                    setTimeout(()=> {
                        // console.log('facebook_page_url');
                        // console.log(this.facebook_page_url);
                        FB.XFBML.parse();                   /*http://fbdevwiki.com/wiki/FB.XFBML.parse*/
                        // console.log('facebook_page_url');
                        // console.log(this.facebook_page_url);
                    },2000);

                    this.fan=result.item[0].fan;
                    // console.log('this.fan');
                    // console.log(this.fan);

                    /*
                     this.musicians=result.item.musicians;
                     this.dancer=result.item.dancer;
                     this.model=result.item.model;
                     this.signupaffiliate=result.item.signupaffiliate;*/
                    /*    this.twitter_oauth_token=result.item.twitter_oauth_token;
                     this.twitter_oauth_token_secret=result.item.twitter_oauth_token_secret;

                     this.insta_access_token = result.item.insta_access_token;
                     this.insta_followers_count = result.item.insta_access_token;
                     this.instausername = result.item.instausername;*/
                    this.twitter_oauth_token = result.item[0].twitter_oauth_token;
                    /*console.log(this.twitter_oauth_token);*/
                    this.twitter_oauth_token_secret = result.item[0].twitter_oauth_token_secret;
                    this.twitter_timelineid = result.item[0].twitter_timelineid;
                    this.twitter_timelineurl = result.item[0].twitter_timelineurl;
                    this.insta_access_token = result.item[0].insta_access_token;
                    this.insta_followers_count = result.item[0].insta_access_token;
                    this.instausername = result.item[0].instausername;
                    this.instauserid = result.item[0].instauserid;
                    this.twitterfeed = result.item[0].twitterfeed;
                    /*console.log('this.twitterresult in userdata');
                    console.log(this.twitterfeed)*/;
                    // console.log(result.item[0]);
                    if(this.twitterfeed !=null && this.twitterfeed.length>30){
                        this.twitterresult=this.twitterfeed;
                    }

                //console.log(result._body);
                // this.twitterhtml = result._body;
               /* console.log('twiter result');
                console.log(this.twitterresult);*/
                if(this.twitterresult.length>30){
                    //alert(11);
                    //$('#twitterfeeddiv').html(this.twitterresult);
                }
                else{
                    /*alert(this.twitterresult);
                    alert(this.twitterresult.length);
                    alert(this.twitterfeed.length);*/
                }

                    this.gettwitterposts();
                    this.getinstaposts();
                    /* if(this.twitter_oauth_token=='' && this.twitter_oauth_token_secret==''){

                     this.gettwitterfeed();
                     }*/
                    /* if(this.twitter_oauth_token!='' && this.twitter_oauth_token_secret!=''){


                     let link4= this.demourl+'getvaluefortwitter.php?oauth_token='+this.twitter_oauth_token+'&oauth_token_secret='+this.twitter_oauth_token_secret;  //consumer_key,secret
                     this._http.get(link4)
                     .subscribe(res =>{

                     /!*  let result = res.json();
                     console.log('result');
                     console.log(result);*!/
                     })

                     }*/


                    if(result.item[0].images != null)
                        this.image = 'https://audiodeadline.com/nodeserver/uploads/'+result.item[0].images;
                    else
                        this.image= '../../assets/images/default_profile_pic.jpg';
                    // console.log('this.real_name');

                }
            }, error => {
                // console.log("Oooops!");
            });

        if(this.fan==0){

            this.getVideoDetails();
            this.getLinkDetails();
            this.getPictureDetails();
            this.getmusicdetails();
            this.getplaylists();
        }

        this.getallvideo();
        // this.getmusicdetails();     /*wrong*/
        this.getallpicture();
        this.getallmusic();
        this.getLinkDetails();
        this.getfanlikeditems();
        this.getplaylists();

        //this.callininterval();







        /*call user related function*/






// this.real_name = this.userdata.get('real_name');                     //getting the full name from cookieservice



        // console.log('result.msg.firstname');
        // console.log(result.msg.firstname);
    }

    ngAfterViewInit(){

    }
    callininterval(){
        setInterval(() => {

            if(this.fan==0){

                this.getVideoDetails();
                this.getLinkDetails();
                this.getPictureDetails();
                this.getmusicdetails();
            }

            this.getallvideo();
            // this.getmusicdetails();     /*wrong*/
            this.getallpicture();
            this.getallmusic();
            this.getLinkDetails();
            this.getfanlikeditems();


        }, 1200000);


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
        if(type=='audio'){

             options = {
                method: 'share',

                href: 'http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id
            };

            /*console.log('audio');
            console.log('selectedsharedpost');
            console.log(this.selectedsharedpost);*/


        }
        if( type=='trendingaudio'){

             options = {
                method: 'share',

                href: 'http://artistxp.com/sharetools.php?type=m&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id
            };

            /*console.log('trending audio');
            console.log('selectedsharedpost');
            console.log(this.selectedsharedpost);*/
        }
        if(type=='video'){

             options = {
                method: 'share',

                href: 'http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id
            };

           /* console.log('video');
            console.log('selectedsharedpost');
            console.log(this.selectedsharedpost);*/

        }
        if(type=='trendingvideo'){

             options = {
                method: 'share',

                href: 'http://artistxp.com/sharetools.php?type=v&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id
            };


        }
        if(type=='picture'){

             options = {
                method: 'share',
                // href: 'http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75'
                href: 'http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id
            };
            //console.log('picture');
            //console.log('selectedsharedpost');
            //console.log(this.selectedsharedpost);


        }
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

         // console.log(options.href);
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


    showvideoaddmodal(){
        this.modalform = this.fb.group({
            title: ['', Validators.required],
            type: [''],
            privacy: ['', Validators.required],
            _id: [''],
            videoUrl: ['', Validators.required],
            accepttermscond: [false],

        });
        this.isModalVideoShown=true;
        this.showpreviewvideo=false;
    }
    showlinkaddmodal(){
        this.isModalLinkShown=true;

    }

    showpicturemodal(){

            this.isModalPicShown =  true;
    }
    showmusicmodal(){

        this.isModalMusicShown= true;
        this.selectedaudiourl='';
    }


    showfbpagemodal(){

        this.isModalfbShown = true;
    }

    convertunixtotimeago(val:any){
        return moment.unix(val).startOf('minute').fromNow();

    }

    playthumbfan(item:any){            // playing the thumbnail video

        this.choosenvideourl='';
        //console.log('play thumb callled  ....');
        //console.log(item);
        this.selectedvideo = item;
        this.selectedpost = item;
        this.videoplayerindex=this.videoArray.indexOf(item);
        if(item.videoviews[0]!=null){

            this.currentvideoviewcount = item.videoviews[0].vcount;
        }
        else{

            this.currentvideoviewcount = 0;
        }
        if(item.videolikes[0]!=null){

            this.currentlikecount = item.videolikes[0].vlike;
        }
        else {
            this.currentlikecount = 0;
        }
        this.currentvideotype='';
        this.currentvideoid=item._id;
        //this.currentvideotype='youtube';
        if(item.type=='vimeo'){

            let vimeourl = item.videoUrl.split('/');
            let videoid = vimeourl[vimeourl.length - 1];
           /* console.log('videoid ......');
            console.log(videoid);*/
            this.currentvideotype='vimeo';
            this.choosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

        }
        if(item.type=='youtube') {
            setTimeout(()=> {    //<<<---    using ()=> syntax
                let videourl = item.videoUrl.split('v=');
                this.choosenvideourl='';
                let videoid = videourl[videourl.length - 1];
                this.choosenvideourl=videoid;
               /* console.log('videoid');
                console.log(this.choosenvideourl);*/
                this.currentvideotype='youtube';
                // console.log(videoid);
            }, 50);
            //let url = item.videoUrl.replace('watch?v=', 'embed/');

            //this.choosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }

    }
    playthumb(item:any){            // playing the thumbnail video

        this.choosenvideourl='';
       /* console.log('play thumb callled  ....');
        console.log(item);*/
        this.selectedvideo = item;
        this.selectedpost = item;
        this.videoplayerindex=this.videoArray.indexOf(item);
        if(item.videoviews[0]!=null){

            this.currentvideoviewcount = item.videoviews[0].vcount;
        }
        else{

            this.currentvideoviewcount = 0;
        }
        if(this.videoArray[0].videolikes[0]!=null){

            this.currentlikecount = this.videoArray[0].videolikes[0].vlike;
        }
        else {
            this.currentlikecount = 0;
        }
        this.currentvideotype='';
        this.currentvideoid=item._id;
        //this.currentvideotype='youtube';
        if(item.type=='vimeo'){

            let vimeourl = item.videoUrl.split('/');
            let videoid = vimeourl[vimeourl.length - 1];
           /* console.log('videoid ......');
            console.log(videoid);*/
            this.currentvideotype='vimeo';
            this.choosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

        }
        if(item.type=='youtube') {
            setTimeout(()=> {    //<<<---    using ()=> syntax
                let videourl = item.videoUrl.split('v=');
                this.choosenvideourl='';
                let videoid = videourl[videourl.length - 1];
                this.choosenvideourl=videoid;
               /* console.log('videoid');
                console.log(this.choosenvideourl);*/
                this.currentvideotype='youtube';
               /* console.log(videoid);*/
            }, 50);
            //let url = item.videoUrl.replace('watch?v=', 'embed/');

            //this.choosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }

    }



    playthumbtrending(item:any){            // playing the thumbnail video

        this.currentvideotypetrending='';
        this.selectedvideotrending = item;
        this.selectedpost = item;
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
    setval1(){
        // console.log('value  1 chaged .......');
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

        setTimeout(()=> {
            if (isNaN(this.audioDuration)) {
                this.audioDuration=0;
                this.playmusic();
                this.playmusic();
            }
        },2000);

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
               /* console.log('in onplay interval ....');
                console.log(myAudio.currentTime);*/
                    this.value1 = (myAudio.currentTime.toFixed(0));
                   /* console.log(this.value1);
                    //this.setaudiotimer(Math.ceil(myAudio.currentTime));
                    console.log(this.value);*/


            }, 1000);
            this.isaudioplay=true;
        }
        myAudio.onpause = function(){
            //this.playstate.clearInterval();
            clearInterval(this.playstate);
        };


    }


    playmusicfortrending(){
        let myAudio :any = {};
        myAudio = document.querySelector("#audioplayer4");
       /* console.log('$(myAudio).length');
        console.log($(myAudio).length);
        console.log($('#audioplayer4').length);

        console.log('myAudio');
        console.log(myAudio);
        console.log(myAudio.duration);*/

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
                this.value2 = (myAudio.currentTime.toFixed(0));
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



    updatesantizedurl(){
        if(this.modalform.controls['type'].value=='vimeo') {
            let vimeourl = this.modalform.controls['videoUrl'].value.split('/');
            let videoid = vimeourl[vimeourl.length - 1];
           /* console.log('vimeourl');
            console.log(vimeourl);*/
            this.satizedurl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);
        }
        if(this.modalform.controls['type'].value=='youtube') {
            let url = this.modalform.controls['videoUrl'].value.replace('watch?v=', 'embed/');
           /* console.log('url');
            console.log(url);*/
            this.satizedurl = this.sanitizer.bypassSecurityTrustResourceUrl(url);


        }
        /*console.log('this.satizedurl updated ...');
        console.log(this.satizedurl);*/
    }
    getthumbnail(item:any){                     //getting the thumbnail image

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



    showvideopreview(){
        this.showpreviewvideo=true;
        this.updatesantizedurl();
       /* console.log('this.satizedurl');
        console.log(this.satizedurl);*/

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

                        if(this.fan==0){
                            this.getVideoDetails();
                            this.getallvideo();
                        }
                        if(this.fan==1){
                            this.getfanlikeditems();
                            this.getallvideo();
                        }

                        // console.log('suceess like');
                    }
                })

        }
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

                        if(this.fan==0){
                            this.getmusicdetails();
                            this.getallmusic();
                        }
                        if(this.fan==1){
                            this.getfanlikeditems();
                            this.getallmusic();
                        }

                        /*this.getmusicdetails();
                        this.getallmusic();*/
                        // console.log('suceess like');
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

                        this.getPictureDetails();
                        this.getallpicture();
                       /* console.log('this.tabselectedpictureindex');
                        console.log(this.tabselectedpictureindex);*/
                        if (this.selectedpictureindex > 0) {
                            // console.log('selected picture index block');

                            // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                            this.selectedpicture = this.picturedetailArray[this.selectedpictureindex];
                        }
                        if (this.tabselectedpictureindex > 0) {
                            // console.log('selected picture index block');

                            // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                            this.selectedpicture = this.picArray[this.tabselectedpictureindex];
                        }
                        // console.log('suceess like');


                    }
                })

        }
    }
    showlinklike(val:any){

        if (this.isloggedin==1) {
            let user_id = this.userdata.get('user_id');
            this.currentlinklikecount = val;
            let link4 = this.serverurl + 'addvideolike';
            var data = {'user_id': user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    // console.log(result);
                    if (result.status == 'success') {


                        // console.log('suceess like');
                        if(this.fan==0)this.getLinkDetails();
                        if(this.fan==1)this.getfanlikeditems();
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

                        if(this.fan==0){
                            this.getVideoDetails();
                            this.getallvideo();
                        }
                        if(this.fan==1){
                            this.getfanlikeditems();
                            this.getallvideo();
                        }

                        // console.log('suceess unlike');
                    }
                })
        }
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

                        if(this.fan==0){
                            this.getmusicdetails();
                            this.getallmusic();
                        }
                        if(this.fan==1){
                            this.getfanlikeditems();
                            this.getallmusic();
                        }

                        // console.log('suceess unlike');
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

                        this.getPictureDetails();
                        this.getallpicture();
                        // console.log('suceess unlike');
                    }
                })
        }
    }
    showlinkunlike(val:any) {
        /*console.log('val');
        console.log(val);*/
        if (this.isloggedin == 1) {
            let user_id = this.userdata.get('user_id');
            this.currentlinklikecount = val;
            let link4 = this.serverurl + 'deletevideolike';
            var data = {'user_id': user_id, videoid: val._id};
            this._http.post(link4, data)
                .subscribe(res=> {

                    var result = res.json();
                    // console.log(result);
                    if (result.status == 'success') {


                        // console.log('suceess unlike');
                        if(this.fan==0)this.getLinkDetails();
                        if(this.fan==1)this.getfanlikeditems();
                    }
                })
        }
    }

    showpicturedetail(val:any){
        // this.selectedpictureobject = val;

        this.selectedpicture = val;
        this.selectedpost = val;
        this.isModalPicDetail = true;
       /* console.log('this.picturedetailArray');
        console.log(this.picturedetailArray);
        console.log('this.picturedetailArray[0].user_id');
        console.log(this.picturedetailArray[0].user_id);*/
        this.selectedpictureindex = this.picturedetailArray.indexOf(val);
        this.tabselectedpictureindex = this.picArray.indexOf(val);
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

                    this.getPictureDetails();
                    this.getallpicture();
                    // console.log('suceess');
                }
            })
    }

    scrollleft(){

        if(this.piclimitstart<8)
        {
            this.piclimitend = 8;
            this.piclimitstart = 0;
        }else {
            this.piclimitend -= 8;
            this.piclimitstart -= 8;
        }
    }
    scrollright(){
        if(this.piclimitstart<this.picArray.length) {
            this.piclimitend += 8;
            this.piclimitstart += 8;
        }



    }



    ngOnInit() {
//this.gettwitterposts();
        // var link = this.serverurl+'signup2';
        // var dataval ={
        //
        //     _id: this.userid,
        //     images: this.image,
        // };

        this.pictureform = this.fb.group({

            title_pic: ["", Validators.required],
            desc_pic: ["", Validators.required],
            privacy: ["", Validators.required],
            _id: [""],
            image_pic: ["", Validators.required],
        });

        this.musicform = this.fb.group({

            title_music: ["", Validators.required],
            privacy: ["", Validators.required],
            _id: [""],
            music: ["",Validators.required],
            accepttermscond: [false],
        });
        this.fbpageform = this.fb.group({


            _id: [""],
            facebookpage: ["",Validators.required],
            accepttermscond: [false],
        });



        this.linkform = this.fb.group({
            linkUrl: ["", Validators.required],
            _id:[""],
            privacy:["", Validators.required]

        });

        this.playlistform = this.fb.group({
            playlist_name: ["", Validators.required],
            _id:[""],
            type:[""]

        });

        this.videoplaylistform = this.fb.group({
            playlist_name: ["", Validators.required],
            _id:[""],
            type:[""]

        });



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






    }


    showcommentmodal(val:any){
        this.selectedpicture = val;
        this.selectedpost = val;


        this.ismodalcomment  = 1;


        /*this.getPictureDetails();
        this.getallpicture();
        this.getmusicdetails();
        this.getallmusic();
        this.getLinkDetails();
        this.getVideoDetails();
        this.getallvideo();*/
    }

    addcomment(val:any){

        // console.log('val');
        // console.log(val);

      /*  // this.selectedpicture = val;
        console.log('this.musicArray');
        console.log(this.musicArray);
*/
        this.currentaudioid= this.selectedaudio._id;
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
                    if(this.fan==0) {
                        this.getPictureDetails();
                        this.getmusicdetails();
                        this.getLinkDetails();
                        this.getVideoDetails();
                    }
                    else{
                        this.getfanlikeditems();
                    }

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
    getPictureDetails(){

        let link10= this.serverurl+'getPictureListByUserid';
        let dataID = {'user_id': this.user_id};
        /*console.log('dataID');
        console.log(dataID);*/

        this._http.post(link10,dataID)
            .subscribe(res=> {
                let result = res.json();
                if(result.status=='success') {

/*
                    console.log('picmodal result');
                    console.log(result);*/
                    this.picArray = result.item;
                   /* console.log('this.picArray');
                    console.log(this.picArray);*/
                    if (this.picArray.length > 0) {


                        if(this.selectedpost.comments == null)this.selectedpost = this.picArray[0];

                        if (this.picArray[0].picturelikes[0] != null) {

                            this.currentpicturelikecount = this.picArray[0].picturelikes[0].vlike;
                        }
                        else {
                            this.currentpicturelikecount = 0;
                        }
                        if (this.tabselectedpictureindex > 0) {
                            // console.log('selected picture index block');

                            // this.showpicturedetail(this.picturedetailArray[this.selectedpictureindex]);
                            this.selectedpost = this.picArray[this.tabselectedpictureindex];
                        }


                        if ((this.selectedpost.comments) == null) {

                            this.selectedpost = this.picArray[0];

                        }
                        else {
                            for (let c1 in this.picArray) {
                                if (this.picArray[c1]._id == this.selectedpost._id) {
                                    this.selectedpost = this.picArray[c1];
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
                }

            })
    }



    getVideoDetails(){


        let link4= this.serverurl+'getVideoListByUserid';
        let dataID = {'user_id': this.user_id};
        this._http.post(link4,dataID)
            .subscribe(res =>{

                let result = res.json();
                if(result.status=='success'){

                    /*console.log('video result');
                    console.log(result);*/
                    this.videoArray=result.item;
                    /*console.log('first element .... of video array ');          //showing the chosen video
                    console.log(this.videoArray[0]);*/
                    let oldselectedvideo = this.selectedvideo.videoUrl;
                   /* console.log('oldselectedvideo');
                    console.log(oldselectedvideo);*/
                    if(this.videoArray.length>0 && !this.videoplayfag){

                        if((this.selectedvideo.comments)==null) {
                            this.selectedvideo = this.videoArray[0];
                        }
                        /*console.log('this.selectedvideo');
                        console.log(typeof(this.selectedvideo));
                        console.log((this.selectedvideo));*/

                        if(this.videoplayerindex>0 && (this.selectedvideo.comments)==null){

                            this.selectedvideo = this.videoArray[this.videoplayerindex];
                        }
                        let tempvurl=this.videoArray[0].videoUrl;
                       /* console.log('tempvurl....');
                        console.log(tempvurl);*/
                        this.currentvideoid=this.videoArray[0]._id;
                        //this.choosenvideourl=this.videoArray[0].videoUrl;

                        if((this.selectedvideo.comments)==null) {          // for updating the selected video's data
                            // console.log('in null block ...');
                            this.selectedvideo = this.videoArray[0];
                        }
                        else{

                            /*console.log('this.selectedvideo');
                            console.log(this.selectedvideo);*/

                            for(let c1 in this.videoArray){
                                if(this.videoArray[c1]._id==this.selectedvideo._id){
                                    this.selectedvideo=this.videoArray[c1];
                                    // console.log('in selection block ....');
                                   if(oldselectedvideo!=this.selectedvideo.videoUrl){
                                       /*console.log('in selection block oldselectedvideo....');
                                       console.log('this.selectedvideo');
                                       console.log(this.selectedvideo);*/
                                       setTimeout(()=> {
                                           this.playthumb(this.selectedvideo);
                                       },50);
                                   }
                                    if(this.selectedvideo._id==this.selectedpost._id)this.selectedpost=this.videoArray[c1];
                                    // if
                                }
                            }

                        }
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
                            /*console.log('videoid ......');
                            console.log(videoid);*/
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
                                   /* console.log('vimeo json result ....');
                                    console.log(result);
                                    console.log(result[0].thumbnail_large);*/
                                    this.videoArray[x1].thumbnail=result[0].thumbnail_large;

                                }, error => {
                                    // console.log("Oooops!");
                                });
                        }
                    }




                }
            })
    }
    getLinkDetails(){


        let link4= this.serverurl+'getLinkListByUserid';
        let dataID = {'user_id': this.user_id};
        this._http.post(link4,dataID)
            .subscribe(res =>{

                let result = res.json();
                if(result.status=='success'){

                   /* console.log('video result');
                    console.log(result);*/
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

    changeaudioplayervolume(){

        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer1");
        myAudio.volume =this.value/100;
        if(this.value==0) this.ismuteaudio=true;
        else this.ismuteaudio=false;
    }
    changeaudioplayervolumetrending(){

        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer4");
        myAudio.volume =this.value3/100;
        if(this.value3==0) this.ismuteaudiotrending=true;
        else this.ismuteaudiotrending=false;
    }


    changeaudioplayertimer(){
        /*console.log('this is timer change');
        console.log('this.value1');
        console.log(this.value1);*/
        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer1");
        myAudio.currentTime =this.value1;
    }

    changeaudioplayertimertrending(){
       /* console.log('this is timer change');
        console.log('this.value2');
        console.log(this.value2);*/
        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer4");
        myAudio.currentTime =this.value2;
    }

    setaudiotimer(val:any){
        // console.log(' audio timer called ....');
        this.value1=val;
    }


    muteaudio(){
        this.value=0;
        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer1");
        this.oldvolume=myAudio.volume;
        myAudio.volume =0;
        this.ismuteaudio = true;

    }
    muteaudiotrending(){
        this.value3=0;
        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer4");
        this.oldvolumetrending=myAudio.volume;
        myAudio.volume =0;
        this.ismuteaudiotrending = true;

    }



    unmuteaudio(){

        let myAudio:any = {};
        myAudio=  document.querySelector("#audioplayer1");
        myAudio.volume = this.oldvolume;
        this.ismuteaudio = false;
        this.value = this.oldvolume*100;
        /*console.log(this.value);
        console.log(this.oldvolume);
        console.log(myAudio.volume);*/


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

    playshuffle() {

        let randomVal = this.getRandomInt(0,this.musicArray.length);
        this.playaudio(this.musicArray[randomVal]);
    }
    playshufflefortrending() {

        let randomVal = this.getRandomInt(0,this.musicdetailArray.length);
        this.playaudiotrending(this.musicdetailArray[randomVal]);
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
                this.playmusicfortrending();
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
                   /* console.log('result view');
                    console.log(result);*/
                    if(result.status=='success'){

                        this.getallmusic();

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

               /* console.log($(myAudio).length);
                console.log($('#audioplayer4').length);*/

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


    playaudio(val:any){
       /* console.log('val ..');
        console.log(val);*/
        //alert(5);
       /* console.log('this.audioplayerindex');
        console.log(this.audioplayerindex);
        console.log('this.musicArray.indexOf(val)');
        console.log(this.musicArray.indexOf(val));*/

        let oldaudio:any={};
        if(this.selectedaudio!=null ) oldaudio=this.selectedaudio;
        this.selectedaudio = val;
        this.selectedpost = val;

     /*   console.log('val.indexOf(this.musicdetailArray)');
        console.log(this.musicdetailArray.indexOf(val));*/
       /* console.log('this.audioplayerindex');
        console.log(this.audioplayerindex);*/
        this.chosenaudiotitle = val.title_music;
        //this.audiousername = this.real_name;
        this.audiousername = val.userdata[0].firstname+" "+val.userdata[0].lastname;
        if(this.audioplayerindex==this.musicArray.indexOf(val) && oldaudio.music!=val.music)
        {
            /*console.log('equal index ......');
            console.log('equal index ......');*/
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
            //alert(3);
            this.audioplayerindex = this.musicArray.indexOf(val);
            this.chosenaudiourl = '';
/*
            console.log('chosenaudiourl');
            console.log(this._commonservices.siteurl + 'nodeserver/uploads/audio/' + val.user_id + '/' + val.music);
            console.log(this.chosenaudiourl);*/
            this.isaudioplay = false;
            setTimeout(()=> {
                this.chosenaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl + 'nodeserver/uploads/audio/' + val.user_id + '/' + val.music);
            }, 500);
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
                        // console.log('result view');
                        // console.log(result);
                        if(result.status=='success'){

                            if(this.fan==0)this.getmusicdetails();
                            if(this.fan==1)this.getfanlikeditems();

                            // console.log('suceess view');
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

                    setTimeout(()=> {
                        if (isNaN(this.audioDuration)) {
                            this.playmusic();
                            this.playmusic();
                        }
                    },2000);
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

    shuffleon(){

        this.shuffleflag = true;
    }

    shuffleontrending(){

        this.shuffleflag2 = true;
    }


    shuffleoff(){

        this.shuffleflag = false;
    }
    shuffleofftrending(){

        this.shuffleflag2 = false;
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
                    /*console.log('this.selectedaudio.music');
                    console.log(this.selectedaudio.music);*/
                    let oldselectedaudio = this.selectedaudio.music;
                    if(this.musicArray.length>0  && !this.isaudioplay){

                        //this.selectedaudio = this.musicArray[0];
                        //oldselectedaudio = this.selectedaudio.music;

                        /*if(this.audioplayerindex>0){

                            this.selectedaudio = this.musicArray[this.audioplayerindex];
                        }*/
                        if((this.selectedaudio.comments)==null){

                            this.selectedaudio = this.musicArray[0];
                            this.chosenaudiotitle = this.musicArray[0].title_music;
                            this.audiousername = this.real_name;
                            oldselectedaudio = this.selectedaudio.music;

                         }
                        else  {
                            for(let c1 in this.musicArray){
                                if(this.musicArray[c1]._id==this.selectedaudio._id){
                                    this.selectedaudio=this.musicArray[c1];
                                    if(this.selectedaudio._id==this.selectedpost._id)this.selectedpost=this.musicArray[c1];
                                    this.chosenaudiotitle = this.musicArray[c1].title_music;
                                    this.audiousername = this.musicArray[c1].userdata[0].firstname+' '+this.musicArray[c1].userdata[0].lastname;
/*
                                    console.log('this.selectedmusictrending in for loop1');
                                    console.log(this.selectedaudio);
                                    console.log('this.selectedmusictrending.comments.....');
                                    console.log(this.selectedaudio.music);
                                    console.log('oldselectedaudio');
                                    console.log(oldselectedaudio);
                                    console.log('this.selectedaudio.music');
                                    console.log(this.selectedaudio.music);*/



                                }
                            }
                        }

                        if(oldselectedaudio!=this.selectedaudio.music ){
                           /* console.log('in selection block oldselectedvideo....');
                            console.log('this.selectedaudio');
                            console.log(this.selectedaudio);*/
                            setTimeout(()=> {
                                //this.audioplayerindex=-9;
                                //if(this.isaudioplay) this.isaudioplay= false;
                                //else this.isaudioplay=true;
                                //this.playaudio(this.selectedaudio);
                            },400);
                        }

                        this.chosenaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.user_id+'/'+ this.musicArray[0].music);
                        this.selectedaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.user_id+'/'+ this.musicArray[0].music);

                      /*  this.chosenaudiotitle = this.musicArray[0].title_music;
                        this.audiousername = this.real_name;
*/
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
                            if(isNaN(this.audioDuration)){
                                setTimeout(()=> {
                                    this.playmusic();
                                    this.playmusic();
                                    this.audioDuration=0;
                                },2000);
                            }
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



    onFileUpdated(event){

        this.selectedFile = event.target.files[0];
        this.showLoader = 1;

        const uploadData = new FormData();
        uploadData.append('file', this.selectedFile);

        this._http.post(this.uploadurl, uploadData)
            .subscribe(event => {
                var res = event.json();
                // console.log(res);

                if(res.error_code == 0){
                    this.image = res.filename;
                    // console.log(123);

                    // this.imagepath = './nodeserver/uploads/';
                    // this.image = res.imagepath.filename;
                    this.image = 'https://audiodeadline.com/nodeserver/uploads/'+res.filename;
                    var link3=this.serverurl+'updateProfileImg';
                    var dataval ={
                        'userid':this.user_id,
                        'images':res.filename
                    };
                    this.showLoader = 0;
                    this.isModalShown = true;           //modal enables here
                    /*console.log('dataval');
                    console.log(dataval);*/
                    this._http.post(link3,dataval)
                        .subscribe(data => {

                            var res = data.json();
                            if(res.status=='success'){

                                this.user_id = res.items._id;
                                res.filename = res.items.images;

                            }
                            }, error =>{

                            // console.log('Error');
                            }

                        );


                    /*console.log('this.image');
                    console.log(this.image);*/

                }
                else{
                    this.showLoader=0;
                }
            });
    }


    onFileUpload(event){

        this.selectedFile = event.target.files[0];
        this.showLoader = 1;

        const uploadData = new FormData();
        uploadData.append('file', this.selectedFile);

        this._http.post(this.pictureuploadurl+'?user_id='+this.user_id, uploadData)
            .subscribe(event =>{



                    var res = event.json();
                    // console.log(res);

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

    onaudioUpload(event){

        // console.log('audio');

        this.selectedFile = event.target.files[0];
        // console.log('loader');
        this.showLoader = 1;

        const uploadData = new FormData();
        uploadData.append('file', this.selectedFile);
        this.selectedaudiourl='';



        this._http.post(this.audiouploadurl+'?user_id='+this.user_id, uploadData)
            .subscribe(event =>{
                /*this.showLoader = 0;*/

                var res = event.json();
                // console.log(res);

                if(res.error_code == 0){
                    // this.image = res.filename;
                    // console.log(this.image);
                    this.tempUploadFilename = res.filename;
                    this.musicform.patchValue({
                        music : this.tempUploadFilename
                    });
                    this.showLoader = 0;
                    /*console.log('this.tempUploadFilename');
                    console.log(this.tempUploadFilename);*/

                    this.selectedaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.user_id+'/'+ this.tempUploadFilename);

                    /*console.log('this.selectedaudiourl');
                    console.log(this.selectedaudiourl);
                    console.log(this.chosenaudiourl);*/

                }
            });
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
    editLink(item:any){

        this.linkform = this.fb.group({
            linkUrl: [item.linkUrl, Validators.required],
            _id: [item._id],
            privacy: [item.privacy, Validators.required]
        });
        this.isModalLinkShown=true;
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
    deleteVideo(flag:any,id:any,flag1){

        this.deleteflag=flag1;
        this.tempval=id;
        if(flag==0){
            this.iscommonconfirmmodal=true;
            if(flag1==1) this.commonconfirmmodalmessage='Are you sure you want to delete this video ?';
            if(flag1==2) this.commonconfirmmodalmessage='Are you sure you want to delete this link ?';
            if(flag1==3) this.commonconfirmmodalmessage='Are you sure you want to delete this picture ?';
            if(flag1==4) this.commonconfirmmodalmessage='Are you sure you want to delete this music ?';
        }
        // console.log(id);
        if(flag==1) {
            this.iscommonconfirmmodal=false;

           if(flag1==1) var link2 = this.serverurl + 'deleteVideoByID';
           if(flag1==2) var link2 = this.serverurl + 'deleteLinkByID';
           if(flag1==3) var link2 = this.serverurl + 'deletePicByID';
           if(flag1==4) var link2 = this.serverurl + 'deleteMusicByID';

            var data = {'id': id};
            // console.log('username');
            // console.log(data.username);
            this._http.post(link2, data)
                .subscribe(res => {
                    var result = res.json();
                    /*console.log(result.item);*/
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
                        this.getLinkDetails();
                        this.getPictureDetails();
                        this.getmusicdetails();
                    }
                }, error => {
                    // console.log("Oooops!");
                });
        }

    }


//video modal

    modalSubmit(formval){
        this.chkerror2 = 0;
        let x: any;
        for (x in this.modalform.controls) {
            // console.log(this.modalform.controls[x]);

            this.modalform.controls[x].markAsTouched();

            // console.log(this.modalform.controls[x].valid);

        }
       /* console.log('this.modalform.value');
        console.log(this.modalform.value);
        console.log('this.modalform.valid');
        console.log(this.modalform.valid);*/

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
                                this.getallvideo();
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


    //link modal..

    linkSubmit(formval){

        let x: any;
        for (x in this.linkform.controls) {
            // console.log(this.linkform.controls[x]);

            this.linkform.controls[x].markAsTouched();

            // console.log(this.linkform.controls[x].valid);

        }
        if(this.linkform.valid && this.scraptitle.length>4){

            let link5='';
            /*console.log('formval');
            console.log(formval);*/
            if(formval._id=='' || formval._id== null)
                link5=this.serverurl+'addlinks';
            else
                link5=this.serverurl+'editlinks';
            let data = formval;
            data.user_id= this.user_id;
            data.title= this.scraptitle;
            data.image= this.scrapimage;
            data.desc= this.scrapdesc;
            // console.log(data);
            this._http.post(link5,data)
                .subscribe(val =>{
                    let res=val.json();
                    if(res.status='success'){
                        /*console.log('res.status');
                        console.log(res.status);*/
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
    playlistSubmit(formval){

        let x: any;
        for (x in this.playlistform.controls) {
            // console.log(this.playlistform.controls[x]);

            this.playlistform.controls[x].markAsTouched();

            // console.log(this.playlistform.controls[x].valid);

        }

        /*console.log('this.playlistform.value');
        console.log(this.playlistform.value);
        console.log('this.playlistform.valid');
        console.log(this.playlistform.valid);*/
        if(this.playlistform.valid){

            let link9 = '';
            if(formval._id=='' || formval._id== null)
                link9=this.serverurl+'addplaylist';


            let data=formval;
            data.user_id = this.user_id;
            data.type='music';
            // console.log(data);
            // this.showLoader = 1;
            this._http.post(link9,data)

                .subscribe(val =>{

                        var res = val.json();
                        //loader
                        if (res.status=='success'){
                           /* console.log('Success');
                            console.log('result of playlist');
                            console.log(res.item.ops[0]);*/
                            // this.musicplaylistarray = res.item.ops[0];
                            this.getplaylists();


                        }

                    }, error =>{

                        // console.log('Error');
                    }
                )

        }

    }

    getplaylists(){
        let link = this.serverurl+'getPlaylistByUserid';
        let dataID = {'user_id': this.user_id};
        this._http.post(link, dataID)
            .subscribe(res=>{

                let result:any={};
                result= res.json();
                /*console.log('result of playlist ...');
                console.log(result);*/
                this.playlistarray= result;
                this.html1="<div>5465656</div>";
            });


    }


    videoplaylistSubmit(formval){

        let x: any;
        for (x in this.videoplaylistform.controls) {
            // console.log(this.videoplaylistform.controls[x]);

            this.videoplaylistform.controls[x].markAsTouched();

            // console.log(this.videoplaylistform.controls[x].valid);

        }

        /*console.log('this.videoplaylistform.value');
        console.log(this.videoplaylistform.value);
        console.log('this.videoplaylistform.valid');
        console.log(this.videoplaylistform.valid);*/
        if(this.videoplaylistform.valid){

            let link9 = '';
            if(formval._id=='' || formval._id== null)
                link9=this.serverurl+'addplaylist';


            let data=formval;
            data.user_id = this.user_id;
            data.type='video';
            // console.log(data);
            // this.showLoader = 1;
            this._http.post(link9,data)

                .subscribe(val =>{

                        var res = val.json();
                        //loader
                        if (res.status=='success'){
                            /*console.log('Success');
                            console.log('result of playlist');
                            console.log(res.item.ops[0]);*/
                            this.isPlaylistVideoModalShown = false;


                        }

                    }, error =>{

                        // console.log('Error');
                    }
                )

        }

    }



    //picture modal submit

    pictureSubmit(formval){
        let x: any;
        for (x in this.pictureform.controls) {
            // console.log(this.pictureform.controls[x]);

            this.pictureform.controls[x].markAsTouched();

            // console.log(this.pictureform.controls[x].valid);

        }
       /* console.log('this.pictureform.value');
        console.log(this.pictureform.value);
        console.log('this.pictureform.valid');
        console.log(this.pictureform.valid);*/

        if(this.pictureform.valid){

            let link9 = '';
            if(formval._id=='' || formval._id== null)
            link9=this.serverurl+'addpics';

            else
                link9=this.serverurl+'editpics';

            let data=formval;
            data.user_id = this.user_id;
            // console.log(data);
            this.showLoader = 1;
            this._http.post(link9,data)

                .subscribe(val =>{

                        var res = val.json();
                        //loader
                        if (res.status=='success'){
                            // console.log('Success');
                            this.showLoader = 0;
                            this.isModalPicShown= false;
                            // console.log('reset starts');
                            this.pictureform.reset();
                            this.tempUploadFilename = '';
                            // console.log('reset ends');
                            this.getPictureDetails();
                            this.getallpicture();

                        }

                    }, error =>{

                        // console.log('Error');
                    }
                )

        }

    }

    //music modal submit

    musicSubmit(formval){


        this.chkerror = 0;
        let x: any;
        for (x in this.musicform.controls) {
            // console.log(this.musicform.controls[x]);

            this.musicform.controls[x].markAsTouched();

            // console.log(this.musicform.controls[x].valid);

        }
        /*console.log('this.musicform.value');
        console.log(this.musicform.value);
        console.log('this.musicform.valid');
        console.log(this.musicform.valid);
        console.log('formval');
        console.log(formval);*/

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
                // console.log(data);
                this._http.post(link11,data)
                    .subscribe(val =>{

                        var res = val.json();
                        if (res.status=='success'){

                            // console.log('Success');
                            this.showLoader = 0;
                            this.isModalMusicShown= false;

                            // console.log('reset starts');
                            this.musicform.reset();
                            this.selectedaudiourl='';
                            //clearInterval(this.playstate);
                            // this.playmusic();
                            //this.playmusic();
                            if(this.isaudioplay){

                                //this.audioplayerindex++;
                            }
                            // console.log('reset ends');
                            this.getmusicdetails();
                            this.getallmusic();


                        }

                    }, error =>{

                        // console.log('Error');

                    });
            }

        }


    }


    fbpageSubmit(formval){

        this.chkerror = 0;
        let x: any;
        for (x in this.fbpageform.controls) {
            // console.log(this.fbpageform.controls[x]);

            this.fbpageform.controls[x].markAsTouched();

            // console.log(this.fbpageform.controls[x].valid);

        }
        /*console.log('this.fbpageform.value');
        console.log(this.fbpageform.value);
        console.log('this.fbpageform.valid');
        console.log(this.fbpageform.valid);
        console.log('formval');
        console.log(formval);*/
        if(this.fbpageform.valid){
            if ((formval.accepttermscond == false || formval.accepttermscond == null)) {
                this.chkerror = 1;
                this.fbpageform.controls['accepttermscond'].setErrors({'incorrect': true});
                return false;
            }
            else {

                let link11 = '';
                if(formval._id=='' || formval._id== null){

                    link11=this.serverurl+'addfacebookpageinfo';
                    let data = formval;
                    data.user_id = this.user_id;
                    // console.log('data');
                    // console.log(data);
                    this._http.post(link11,data)
                        .subscribe(res=>{

                            let result:any={};
                            result= res.json();
                            // console.log('result of ofbpage');
                            // console.log(result);
                            // console.log('result[0].facebookpage 1');
                            console.log(result.item.facebookpage);
                            if (result.status=='success'){
                                // console.log('Success');
                                this.facebook_page_url='';
                                FB.XFBML.parse();
                                this.facebook_page_url = result.item.facebookpage;
                                this.fbpageform.reset();
                                this.isModalfbShown = false;
                                setTimeout(()=> {
                                    // console.log('facebook_page_url2');
                                    // console.log(this.facebook_page_url);
                                    FB.XFBML.parse();
                                    // console.log('facebook_page_url3');
                                    // console.log(this.facebook_page_url);
                                    // console.log(result);
                                },4000);

                               /* console.log('facebook_page_url4');
                                console.log(this.facebook_page_url);*/

                            }

                        })



                }


            }
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

    getlinkdata(flag:any){
       let templink= this.linkform.controls['linkUrl'].value;

        let link5='https://audiodeadline.com/scrappage.php?url='+templink;
        //let data = {};
        //data.user_id= this.user_id;
        //console.log(data);
        this._http.get(link5)
            .subscribe(val =>{

                let res=val.json();
                // console.log(res);
                if(flag==1)this.showlinksscrap=true;
                this.scrapdesc=res.description;
                this.scrapimage=res.images[0];
                this.scraptitle=res.title;
                if(flag==3) this.linkSubmit({});
            })
    }
    onStateChange(event){
       /* console.log('event ....');
        console.log(event);*/
        this.videoplayfag=true;
        if(event.data == -1){
            var link2= this.serverurl+'addvideoviews';

            //video view user id from cookie
            let user_id = this.userdata.get('user_id');

            var data = {'user_id':user_id,videoid:this.currentvideoid};
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
            if(this.fan==0)this.getVideoDetails();
            if(this.fan==1)this.getfanlikeditems();
        }
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


    onHidden(){                 //modal hide function

        this.isModalShown = false;
        this.isModalVideoShown = false;
        this.isVideoSaved = 0;
        this.isModalPicShown= false;
        this.isModalLinkShown = false;
        this.isModalMusicShown= false;
        this.isModalPicDetail= false;
        this.ismodalcomment = false;
        this.isModalfbShown = false;
        this.iscommonconfirmmodal=false;
        this.iscommonmodal=false;
        this.isPlaylistModalShown = false;

    }

    hideModal(){
        this.isModalLinkShown = false;
        this.iscommonconfirmmodal=false;
    }


    /*getallvideo(){


        let link4= this.serverurl+'trendingVideoList';
        this._http.get(link4)
            .subscribe(res =>{

                let result = res.json();
                if(result.status=='success'){

                    console.log('video result');
                    console.log(result);
                    this.videodetailArray=result.item;
                    if( this.videodetailArray.length>0 && !this.videoplayfag){
                        this.currentvideoidtrending=this.videodetailArray[0]._id;
                        if(this.videodetailArray[0].type=='vimeo'){
                            let tempvurl=this.videodetailArray[0].videoUrl;
                            let vimeourl = tempvurl.split('/');
                            let videoid = vimeourl[vimeourl.length - 1];
                            console.log('videoid ......');
                            console.log(videoid);
                            this.currentvideotypetrending='vimeo';
                            this.choosenvideourlfortrending = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);
                        }
                        if(this.videodetailArray[0].type=='youtube' && !this.videoplayfag) {
                            let videourl = this.videodetailArray[0].videoUrl.split('v=');
                            let videoid = videourl[videourl.length - 1];
                            this.choosenvideourlfortrending=videoid;
                            this.currentvideotypetrending='youtube';
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
    }*/


    getallvideo(){


        let link4= this.serverurl+'trendingVideoList';
        this._http.get(link4)
            .subscribe(res =>{

                let result = res.json();
                if(result.status=='success'){

                  /*  console.log('video result 12');
                    console.log(result);*/
                    let oldvideodetailarray=this.videodetailArray;
                    this.videodetailArray=result.item;



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
                                if(this.selectedpost._id==this.selectedvideotrending._id)this.selectedpost=this.videodetailArray[c1];
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

                }
            })
    }
    getallpicture(){


        let link4= this.serverurl+'trendingPictureList';
        this._http.get(link4)
            .subscribe(res =>{

                let result = res.json();
                if(result.status=='success') {

                    /*console.log('result');
                    console.log(result);*/
                    this.picturedetailArray = result.item;

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
                }
            })
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
                    /*console.log('this.musicdetailArray');
                    console.log(this.musicdetailArray);
                    console.log('this.musicdetailArray[4].userdata[0].firstname');
                    console.log(this.musicdetailArray[0].userdata[0].firstname+' '+this.musicdetailArray[0].userdata[0].lastname);*/
                    if(this.musicdetailArray.length>0 && !this.isaudioplayfortrending){
                       /* console.log('chosenmusicurl');
                        console.log(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.musicdetailArray[0].user_id+'/'+ this.musicdetailArray[0].music);
*/


                        this.chosenaudiourlfortrending = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.musicdetailArray[0].user_id+'/'+ this.musicdetailArray[0].music);
                        // this.chosenvideourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoid);

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
                                    if(this.selectedmusictrending._id==this.selectedpost._id)this.selectedpost=this.musicdetailArray[c1];
                                    this.chosenaudiotitletrending = this.musicdetailArray[c1].title_music;
                                    this.audiousernamefortrending = this.musicdetailArray[c1].userdata[0].firstname+' '+this.musicdetailArray[c1].userdata[0].lastname;
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

    gettwitterfeed(){

     /*   let link4= this.demourl+'index.php';
        this._http.get(link4)
            .subscribe(res =>{

                let result = res.json();
                console.log('result');
                console.log(result);
            })*/
        this.twitterinterval =   setInterval(() => {
           this.getuservalue();
            /*console.log('in set interval..');*/

        }, 10000);
        // console.log(' this.twitter_oauth_token 1  -- '+this.twitter_oauth_token);



    }

    getinstafeed(){

        this.instainterval = setInterval(() => {

            this.getuservalue();
            // console.log('insta set interval..');

        }, 10000);

        // console.log('insta set interval doesnt enter');
    }

    getuservalue(){

        var link2= this.serverurl+'getDetailsByUsername';
        var data = {'username':this.user_name};
       /* console.log('username');
        console.log(data.username);*/
        this._http.post(link2, data)
            .subscribe(res=>{

                var result = res.json();
               /* console.log('result.item');
                console.log(result);
                console.log('result.item[0].instauserid');
                console.log(result.item[0].instauserid);*/
                if(result.status=='success') {

                    this.twitter_oauth_token = result.item[0].twitter_oauth_token;
                    this.twitter_oauth_token_secret = result.item[0].twitter_oauth_token_secret;
                    this.twitter_timelineid = result.item[0].twitter_timelineid;
                    this.twitter_timelineurl = result.item[0].twitter_timelineurl;
                    this.insta_access_token = result.item[0].insta_access_token;
                    this.insta_followers_count = result.item[0].insta_access_token;
                    this.instausername = result.item[0].instausername;
                    this.instauserid = result.item[0].instauserid;
                    this.facebook_page_url=result.item[0].facebookpage;


                    // console.log(' this.twitter_oauth_token   -- '+this.twitter_oauth_token);
                    if(this.twitter_oauth_token!='' && this.twitter_oauth_token_secret!=''){
                        clearInterval(this.twitterinterval);
                        // console.log('in clear interval');
                        this.gettwitterposts();
                    }
                    if(this.insta_access_token!='' && this.insta_followers_count!=''){
                        clearInterval(this.instainterval);
                        // console.log('in clear interval insta');
                        // this.gettwitterposts();
                        this.getinstaposts();
                    }
                }
            })
    }
    /*gettwitterposts(){
        //let link= this.demourl+'gettwitterposts.php?oauth_token='+this.twitter_oauth_token+'&oauth_token_secret='+this.twitter_oauth_token_secret+'&consumer_key='+this.consumer_key+'&consumer_secret='+this.consumer_secret+'&sess=0';
        let link= this.demourl+'ttest.php?oauth_token='+this.twitter_oauth_token+'&oauth_token_secret='+this.twitter_oauth_token_secret+'&consumer_key='+this.consumer_key+'&consumer_secret='+this.consumer_secret+'&sess=0';
        //alert(link);
        this._http.get(link)
            .subscribe(res=>{
                let result:any={};
                result= res.json();
                // /result=result._body;
                console.log('newtwitter result');
                console.log(result);

                this.twitterresult = result.data;

                //console.log(result._body);
                // this.twitterhtml = result._body;
                console.log('newtwitter result data  ....');
                console.log(this.twitterresult);
                console.log(this.twitterresult.length);
                if(this.twitterresult!=null && this.twitterresult.length>0){
                    let y=0;
                    for(let i=0;i<=this.twitterresult.length;i++){

                        if(this.twitterresultarr[y]==null) this.twitterresultarr[y]=[];
                        this.twitterresultarr[y].push(this.twitterresult[i]);
                        if((i+1)%3==0) y++;

                    }

                    console.log('this.twitterresultarr');
                    console.log(this.twitterresultarr);
                }

            })

    }*/
    gettwitterposts(){
        let link= this.demourl+'gettwitterposts.php?oauth_token='+this.twitter_oauth_token+'&oauth_token_secret='+this.twitter_oauth_token_secret+'&consumer_key='+this.consumer_key+'&consumer_secret='+this.consumer_secret+'&sess=0';
        this._http.get(link)
            .subscribe(res=>{
                let result:any={};
                result= res;
                /*console.log('result');
                console.log(result);*/
                if(result.length>30)this.twitterresult = result._body;

                //console.log(result._body);
                // this.twitterhtml = result._body;
                /*console.log('twiter result');
                console.log(this.twitterresult);*/
                if(result.length>30) {
                    //alert(53);
                    //$('#twitterfeeddiv').html(this.twitterresult);
                }else{
                    //alert(54);
                }
            })

    }

    getinstaposts(){

        let link = this.demourl1+'index.php?userid='+this.instauserid+'&access_token='+this.insta_access_token;
        this._http.get(link)
            .subscribe(res=>{

                if(this.instauserid!='' && this.insta_access_token!=null){

                var result = res.json();
               /* console.log('result of getinstaposts()');
                console.log(result);
                console.log(result.data);*/
                    this.instafeedarray = result.data;
                   /* console.log('this.instafeedarray');
                    console.log(this.instafeedarray);
                    console.log('this.instafeedarray._id');
                    console.log(this.instafeedarray._id);
                    console.log('this.insta_access_token');
                    console.log(this.insta_access_token);*/

                }
            })
        }


        getfanlikeditems(){

            let link = this.serverurl+'fanlikeitemlist';
            let data={user_id:this.user_id};
            this._http.post(link,data)
                .subscribe(res=>{

                    let result:any={};
                    result = res.json();
                   /* console.log('result');
                    console.log(result.item);*/
                    this.fanlikearray = result.item;
                   /* console.log('this.fanlikearray');
                    console.log(this.fanlikearray);
                    console.log('this.selectedpost');
                    console.log(this.selectedpost);*/
                    this.fanmusiclikearray=[];
                    this.fanvideolikearray=[];
                    this.fanlinklikearray=[];
                    this.musicArray=[];
                    for(let val in this.fanlikearray){
                        if(this.selectedpost._id==this.fanlikearray[val].videoid){

                            if(this.fanlikearray[val].musics.length>0) {
                                this.selectedpost=this.fanlikearray[val].musics[0];
                                this.selectedaudio=this.fanlikearray[val].musics[0];
                            }
                            if(this.fanlikearray[val].videos.length>0) {
                                this.selectedpost=this.fanlikearray[val].videos[0];
                                this.selectedvideo=this.fanlikearray[val].videos[0];
                            }
                            if(this.fanlikearray[val].links.length>0) this.selectedpost=this.fanlikearray[val].links[0];
                        }

                        if(this.fanlikearray[val].musics.length>0){

                            this.fanmusiclikearray.push(this.fanlikearray[val]);
                            this.musicArray.push(this.fanlikearray[val].musics[0]);
                            /*console.log('this.fanmusiclikearray');
                            console.log(this.fanmusiclikearray);
                            console.log('this.selectedaudio');
                            console.log(this.selectedaudio);
                            console.log(this.selectedaudio.length);*/

                            if(this.musicArray.length==1 && this.selectedaudio.length==0){
                                this.audiousername = this.musicArray[0].userdata[0].firstname+" "+this.musicArray[0].userdata[0].lastname;
                                this.chosenaudiotitle = this.musicArray[0].title_music;
                                this.chosenaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.musicArray[0].user_id+'/'+ this.musicArray[0].music);
                                this.selectedaudiourl = this.sanitizer.bypassSecurityTrustResourceUrl(this._commonservices.siteurl+'nodeserver/uploads/audio/'+this.musicArray[0].user_id+'/'+ this.musicArray[0].music);
                                this.selectedaudio=this.musicArray[0];
                                this.selectedpost=this.musicArray[0];

                                /*  this.chosenaudiotitle = this.musicArray[0].title_music;
                                 this.audiousername = this.real_name;
                                 */
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
                                    if(isNaN(this.audioDuration)){
                                        setTimeout(()=> {
                                            this.playmusic();
                                            this.playmusic();
                                            this.audioDuration=0;
                                        },2000);
                                    }
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
                            }




                            //this.musicArray=this.fanmusiclikearray;
                            // /this.isaudioplay=true;
                            /*this.playaudio(this.fanlikearray[val].musics[0]);
                            setTimeout(()=> {
                                this.playmusic();
                            },4000);*/

                            // /this.playmusic();
                            /*this.dancegenrearray.push(result.res[i]);*/
                        }
                        if(this.fanlikearray[val].videos.length>0){
                            //if(this.fanvideolikearray.length==0) this.playthumbfan(this.fanlikearray[val]);
                            this.fanvideolikearray.push(this.fanlikearray[val]);
                          /*  console.log('this.selectedpost');
                            console.log(this.selectedpost);*/
                            if(this.fanvideolikearray.length==1 && this.currentvideoid==null){
                                this.playthumbfan(this.fanlikearray[val].videos[0]);
                                this.selectedpost=this.fanlikearray[val].videos[0];
                                this.selectedvideo=this.fanlikearray[val].videos[0];
                               /* console.log(52);
                                console.log(this.selectedpost._id);
                                console.log(this.fanlikearray[val].videoid);*/
                            }
                           /* console.log('this.fanvideolikearray');
                            console.log(this.fanvideolikearray);*/


                            for (let x1 in this.fanvideolikearray){
                                if(this.fanvideolikearray[x1].videos[0].type=='vimeo'){
                                    let tempvurl=this.fanvideolikearray[x1].videos[0].videoUrl;
                                   /* console.log('tempvurl');
                                    console.log(tempvurl);*/
                                    let vimeourl = tempvurl.split('/');
                                    let videoid = vimeourl[vimeourl.length - 1];
                                    this._http.get('https://vimeo.com/api/v2/video/'+videoid+'.json')
                                        .subscribe(res => {
                                            var result = res.json();
                                            /*console.log('vimeo json result ....');
                                            console.log(result);
                                            console.log(result[0].thumbnail_large);*/
                                            this.fanvideolikearray[x1].videos[0].thumbnail=result[0].thumbnail_large;

                                        }, error => {
                                            // console.log("Oooops!");
                                        });
                                }
                            }

                        }
                        if(this.fanlikearray[val].links.length>0){

                            this.fanlinklikearray.push(this.fanlikearray[val]);
                            /*console.log('this.fanlinklikearray');
                            console.log(this.fanlinklikearray);*/

                        }
                    }


                })
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
               /* this.fbshare('trendingaudio',this.selectedsharedpost);
                this.fbshare('video',this.selectedsharedpost);
                this.fbshare('trendingvideo',this.selectedsharedpost);
                this.fbshare('picture',this.selectedsharedpost);*/


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
        let children5 = document.getElementsByClassName("createplaylist");
       /* console.log('children length---');
        console.log(children5);
        console.log(children5.length);*/

        for (let i5 = 0; i5 < children5.length; i5++) {
            /*console.log('getEventListeners--- for chil4');
            console.log($._data(children5[i5], "events"));*/
            //children4[i4].removeEventListener("click");

            children5[i5].addEventListener("click", (event: Event) => {
                //alert("Hello 69!");
               /* console.log("Hello children5!");

                console.log(event);*/
                this.isPlaylistModalShown = true;

            });

        }


        let children6 = document.getElementsByClassName("createplaylist2");
        /*console.log('children length---');
        console.log(children6);
        console.log(children6.length);*/

        for (let i6 = 0; i6 < children6.length; i6++) {
          /*  console.log('getEventListeners--- for chil4');
            console.log($._data(children6[i6], "events"));*/
            //children4[i4].removeEventListener("click");

            children6[i6].addEventListener("click", (event: Event) => {
                //alert("Hello 69!");
               /* console.log("Hello children5!");

                console.log(event);*/
                this.isPlaylistVideoModalShown = true;

            });

        }

    }

    generalshare(type:any,stype:any){
        if(this.generalshareurlold!=this.generalshareurl || this.generalshareurloldtype!=stype) {
            if (stype == 'twitter' && type == 'audio') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio._id);*/
                this.generalshareurl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);


            }
            if (stype == 'twitter' && type == 'video') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedvideo._id);
                console.log(this.selectedvideo.user_id);*/
                this.generalshareurl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);


            }
            if (stype == 'twitter' && type == 'trendingvideo') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedvideo._id);
                console.log(this.selectedvideo.user_id);*/
                this.generalshareurl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);


            }
            if (stype == 'twitter' && type == 'picture') {
               /* console.log('this.selectedaudio');
                console.log(this.selectedsharedpost._id);
                console.log(this.selectedsharedpost.user_id);*/
                this.generalshareurl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);


            }
            /*  if(stype=='twitter' && type=='trendingpicture') {
             console.log('this.selectedaudio');
             console.log(this.selectedsharedpost._id);
             console.log(this.selectedsharedpost.user_id);
             this.generalshareurl = 'https://twitter.com/intent/tweet?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

             }*/

            if (stype == 'twitter' && type == 'trendingaudio') {
               /* console.log('this.selectedaudio');
                console.log(this.selectedsharedpost._id);*/
                this.generalshareurl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
            if (stype == 'twitter' && type == 'link') {
               /* console.log('this.selectedaudio');
                console.log(this.selectedsharedpost._id);*/
                this.generalshareurl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=l&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }

            if (stype == 'google' && type == 'audio') {
               /* console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://plus.google.com/share?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
            if (stype == 'google' && type == 'video') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://plus.google.com/share?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
            if (stype == 'google' && type == 'trendingvideo') {
              /*  console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://plus.google.com/share?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
            if (stype == 'google' && type == 'picture') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://plus.google.com/share?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
            /*if(stype=='google' && type=='trendingpicture') {
             console.log('this.selectedaudio');
             console.log(this.selectedaudio);
             this.generalshareurl = 'https://plus.google.com/share?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

             }*/
            if (stype == 'google' && type == 'trendingaudio') {
               /* console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://plus.google.com/share?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
            if (stype == 'google' && type == 'link') {
               /* console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://plus.google.com/share?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=l&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }


            if (stype == 'linkedin' && type == 'audio') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
            if (stype == 'linkedin' && type == 'video') {
               /* console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
            if (stype == 'linkedin' && type == 'trendingvideo') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }

            if (stype == 'linkedin' && type == 'picture') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
            /* if(stype=='linkedin' && type=='trendingpicture') {
             console.log('this.selectedaudio');
             console.log(this.selectedaudio);
             this.generalshareurl = 'https://www.linkedin.com/shareArticle?url='+encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);

             }*/
            if (stype == 'linkedin' && type == 'trendingaudio') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
            if (stype == 'linkedin' && type == 'link') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=l&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }

            if (stype == 'tumblr' && type == 'audio') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);
                /* this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75');*/

            }
            if (stype == 'tumblr' && type == 'video') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);
                /* this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75');*/

            }
            if (stype == 'tumblr' && type == 'trendingvideo') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=v&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);
                /* this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75');*/

            }

            if (stype == 'tumblr' && type == 'picture') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=p&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);
                /* this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=5bf50f4560c4416209c032e4&itemid=5bf6490f249d4cd32803db75');*/

            }
             if(stype=='tumblr' && type=='link') {
             console.log('this.selectedaudio');
             console.log(this.selectedaudio);
             this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl='+encodeURIComponent('http://artistxp.com/sharetools.php?type=l&userid='+this.selectedsharedpost.user_id+'&itemid='+this.selectedsharedpost._id);


             }
            if (stype == 'tumblr' && type == 'trendingaudio') {
                /*console.log('this.selectedaudio');
                console.log(this.selectedaudio);*/
                this.generalshareurl = 'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl=' + encodeURIComponent('http://artistxp.com/sharetools.php?type=m&userid=' + this.selectedsharedpost.user_id + '&itemid=' + this.selectedsharedpost._id);

            }
           /* console.log('this.generalshareurl');
            console.log(this.generalshareurl);
            console.log(this.generalshareurlold);*/


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

    getinstavalue(item:any){

        /*console.log('item');
        console.log(item);*/
        this.selectedinstapost = item;
        /*console.log('this.selectedinstapost.id');
        console.log(this.selectedinstapost.id);
        console.log(this.insta_access_token);*/
        let link =  this.demourl1+'instacomments.php?media_id='+this.selectedinstapost.id+'&access_token='+this.insta_access_token;
        this._http.get(link)
            .subscribe(res=>{

                let result:any;
                result = res.json();
                /*console.log('result  of getinstavalue');
                console.log(result.data);*/
                this.instacommentarray = result.data;



            })

    }


    addfriend(){

        let link = this.serverurl+'userfriendlist';
        if(this.fan==0){

            let data = {'friend_id':this.userprofile_id,'user_id': this.user_id, type:'follow'};
        }
        if(this.fan==1){

            let data = {'friend_id':this.userprofile_id,'user_id': this.user_id, type:'friend'};
        }

        this._http.post(link, data)
            .subscribe(res=>{

                let result:any = {};
                result = res.json();
                console.log('result of userfriend list');
                console.log(result.item.ops[0]);
                this.userfriendlist.push(result.item.ops[0]);
                console.log('this.userfriendlist');
                console.log(this.userfriendlist[0]._id);

            })
    }
}


