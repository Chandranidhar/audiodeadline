import {Compiler, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {CookieService} from 'ngx-cookie-service';
import {Commonservices} from '../app.commonservices';
import { Meta } from '@angular/platform-browser';

declare const FB: any;

@Component({
    selector: 'app-affiliatedashboard',
    templateUrl: './affiliatedashboard.component.html',
    styleUrls: ['./affiliatedashboard.component.css'],
    providers: [Commonservices]
})

export class AffiliatedashboardComponent implements OnInit {
  commonservices:Commonservices;
    private userdata: CookieService;
  items:any;
  public serverurl;
  public userid;
  public userdetails;
  public enrollerdetails;
  public accessToken;
  public FB_APP_ID;
  public FB_APP_SECRET;
  public LI_CLIENT_ID;
  public LI_CLIENT_SECRET;
  public randomstr;
  public fb_access_token;
  public fbimg;
  public fbname;
  public username;
  public userlink;
  public images:any;

  constructor(private _http: Http, private router: Router, userdata: CookieService, private _commonservices: Commonservices,private meta: Meta,private _compiler: Compiler){

      this.userlink = '';
      this.images = ['https://audiodeadline.com/assets/images/Audience-1.png','https://audiodeadline.com/assets/images/Audience-3.png','https://audiodeadline.com/assets/images/Audience-4.png','https://audiodeadline.com/assets/images/BetoFly-1.png','https://audiodeadline.com/assets/images/BetoParedes-1.png','https://audiodeadline.com/assets/images/FliiStylzIntro-1.png','https://audiodeadline.com/assets/images/FliiStylzIntro-2.png','https://audiodeadline.com/assets/images/Musicians-2.png','https://audiodeadline.com/assets/images/Promoters-1.png','https://audiodeadline.com/assets/images/Promoters-2.png','https://audiodeadline.com/assets/images/Promoters-3.png'];
      this.images = ['https://audiodeadline.com/assets/images/shareimage1.png','https://audiodeadline.com/assets/images/shareimage2.png','https://audiodeadline.com/assets/images/shareimage3.png','https://audiodeadline.com/assets/images/shareimage4.png','https://audiodeadline.com/assets/images/shareimage5.png','https://audiodeadline.com/assets/images/shareimage6.png'];
      this.fbimg = '../../assets/images/profileimg.png';
      this.fbname = '';
      this.userdata = userdata;
      this.randomstr = makeid();
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverurl=_commonservices.url;
    this.FB_APP_ID=_commonservices.FB_APP_ID;
    this.FB_APP_SECRET=_commonservices.FB_APP_SECRET;
    this.LI_CLIENT_ID=_commonservices.LI_CLIENT_ID;
    this.LI_CLIENT_SECRET=_commonservices.LI_CLIENT_SECRET;
    let userdata2: any;
    userdata2= userdata.get('userdetails');
      userdata2 = JSON.parse(userdata2);
    if (typeof (userdata2) == 'undefined'){
      this.router.navigateByUrl('/login');
    }else{
      this.userid = userdata2._id;
      this.getUserDetails();
    }
  }

  ngOnInit() {
  }

  getUserDetails(){
    var link =this.serverurl+'dashboard';
    var data = {_id: this.userid};

    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();
          if (result.status == 'success' && typeof(result.item) != 'undefined'){
            let userdet = result.item;
            this.userdetails = userdet;
              this.username = userdet.username;
              this.userlink = 'https://audiodeadline.com/#/signup/'+this.username;
            if(userdet.parent != 0 && userdet.parent != ''){
                this.getEnrollerDetails(userdet.parent);
            }
              this.fb_access_token = userdet.fb_access_token;
              if(this.fb_access_token != ''){
                  this.getFBDetails();
              }
          }
          },error => {
          console.log("Oooops!");
        });
  }

    getEnrollerDetails(enrollerID){
        var link =this.serverurl+'getDetailsByUsername';
        var data = {username: enrollerID};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if (result.status == 'success' && typeof(result.item) != 'undefined'){
                    let userdet = result.item;
                    this.enrollerdetails = userdet;
                }
            },error => {
                console.log("Oooops!");
            });
    }


    copyText(val: string){
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }


    getLongLivedToken(){
        var link = 'https://graph.facebook.com/oauth/access_token?client_id='+this.FB_APP_ID+'&client_secret='+this.FB_APP_SECRET+'&grant_type=fb_exchange_token&fb_exchange_token='+this.accessToken;
        var data = {};

        this._http.get(link, data)
            .subscribe(res => {
                var result = res.json();
                this.updateAccesstoken(result.access_token,result.expires_in);
            },error => {
                console.log("Oooops!");
            });
    }

    updateAccesstoken(access_token,expires_in){
        var link =this.serverurl+'updateAccesstoken';
        var data = {_id: this.userid,access_token:access_token,expires_in:expires_in};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if(result.status=='success'){
                    this.userdata.set('userdetails', JSON.stringify(result.msg));
                }
                this.fb_access_token = access_token;
                this.getFBDetails();
            },error => {
                console.log("Oooops!");
            });
    }

    addfbaccount(){
      var ll = this;
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                var uid = response.authResponse.userID;
                ll.accessToken = response.authResponse.accessToken;
                ll.getLongLivedToken();
            } else {
                FB.login((result: any) => {
                    ll.accessToken = result.authResponse.accessToken;
                    ll.getLongLivedToken();
                }, { scope: 'email' });
            }
        });
    }

    getFBDetails(){
        var link = 'https://graph.facebook.com/me?fields=name,id,picture&access_token='+this.fb_access_token;
        var data = {};

        this._http.get(link, data)
            .subscribe(res => {
                var result = res.json();
                this.fbname = result.name;
                this.fbimg = result.picture.data.url;
                console.log(result);
            },error => {
                console.log("Oooops!");
            });
    }

    removefbaccount(){
        var link =this.serverurl+'updateAccesstoken';
        var data = {_id: this.userid,access_token:'',expires_in:''};

        this._http.post(link, data)
            .subscribe(res => {
                this.fbimg = '../../assets/images/profileimg.png';
                this.fbname = '';
                this.fb_access_token = '';
                var result = res.json();
                if(result.status=='success'){
                    this.userdata.set('userdetails', JSON.stringify(result.msg));
                }
            },error => {
                console.log("Oooops!");
            });
    }

    postinfb(username,media_id){
      /*FB.ui({
          method: 'feed',
          picture: this.images[ind],
          name: "",
          link:"",
          caption:"",
          description: "",
      },function(response){
          console.log(response);
      });*/
        /*FB.ui({
            method: 'feed',
            link: this.userlink,
            name: " ",
            caption:" ",
            description: " "
        },function(response){
            console.log(response);
        });*/

        var link = 'http://audiodeadline.com/sharetool.php?type=rsvpsignup&media_id='+media_id+'&username='+username;

        FB.ui({
            method: 'feed',
            link: link,
            name: " ",
            caption:" ",
            description: " "
        },function(response){
            console.log(response);
        });
    }

    postintw(ind){
        window.open('https://twitter.com/intent/tweet?url='+encodeURIComponent(this.userlink));
    }
    postinli(ind){
        window.open('https://www.linkedin.com/shareArticle?url='+encodeURIComponent(this.userlink));
    }
    postintm(ind){
        window.open('https://www.tumblr.com/widgets/share/tool?canonicalUrl='+encodeURIComponent(this.userlink)+'&title=Audio Deadline&caption=');
    }

}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
