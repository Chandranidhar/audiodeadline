import { Component, OnInit } from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {CookieService} from 'ngx-cookie-service';
import {Http} from '@angular/http';
import {Router} from '@angular/router';

@Component({
    selector: 'app-adminleft',
    templateUrl: './adminleft.component.html',
    styleUrls: ['./adminleft.component.css'],
    providers: [Commonservices]
})

export class AdminleftComponent implements OnInit {
  commonservices:Commonservices;
  coockieData:CookieService;
  items:any;
  public serverurl;
  public userid;
  public username;
  public userdetails;
  public userroles;

  constructor(private _http: Http, private router: Router, userdata: CookieService, private _commonservices: Commonservices){
    this.coockieData= userdata;
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverurl=_commonservices.url;
    this.userroles = [];
    let userdata2: any;
    userdata2= userdata.get('userdetails');

    if (typeof (userdata2) == 'undefined' || userdata2 == ''){
      this.router.navigateByUrl('/login');
    }else{
      userdata2 =JSON.parse(userdata2);
      this.userid = userdata2._id;
      this.username = userdata2.username;
        if(userdata2.admin == 1){
            this.userroles.push('admin');
        }
        if(userdata2.signupaffiliate == 1){
            this.userroles.push('affiliate');
        }
        if(userdata2.ambassador == 1){
            this.userroles.push('ambassador');
        }
        if(userdata2.dancer == 1){
            this.userroles.push('dancer');
        }
        if(userdata2.model == 1){
            this.userroles.push('model');
        }
        if(userdata2.musicians == 1){
            this.userroles.push('musicians');
        }
        if(userdata2.fan == 1){
            this.userroles.push('fan');
        }
      this.getUserDetails();
    }
  }
  ngOnInit(){

  }
  logout(){
    this.coockieData.deleteAll();
    this.router.navigateByUrl('/login');
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
          }
          },error => {
          console.log("Oooops!");
        });
  }
}