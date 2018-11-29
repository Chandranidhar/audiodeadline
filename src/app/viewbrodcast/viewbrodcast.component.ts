import { Component, OnInit } from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {Http} from '@angular/http';

@Component({
  selector: 'app-viewbrodcast',
  templateUrl: './viewbrodcast.component.html',
  styleUrls: ['./viewbrodcast.component.css'],
    providers: [Commonservices]
})
export class ViewbrodcastComponent implements OnInit {

    commonservices:Commonservices;
    private userdata: CookieService;
    public serverurl;
    public userid;
    public username;
    public fb_access_token;
    public FB_APP_ID;
    public FB_APP_SECRET;


    constructor(private _commonservices: Commonservices, userdata: CookieService, private router: Router,private _http: Http) {
        this.fb_access_token = '';
        this.userdata = userdata;
        this.commonservices=_commonservices;
      this.serverurl=_commonservices.url;
      this.FB_APP_ID=_commonservices.FB_APP_ID;
      this.FB_APP_SECRET=_commonservices.FB_APP_SECRET;
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
                    this.fb_access_token = userdet.fb_access_token;
                    this.username = userdet.username;
                }
            },error => {
                console.log("Oooops!");
            });
    }


    postinfb(){
        console.log(1);
        /*var link = 'https://graph.facebook.com/me/feed?message=Hello Fans!&access_token='+this.fb_access_token;
        var data = {};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                console.log(result);
            },error => {
                console.log("Oooops!");
            });*/
    }

}
