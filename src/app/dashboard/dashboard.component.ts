import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {Http} from "@angular/http";
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [Commonservices]
})
export class DashboardComponent implements OnInit {
  private userdata: CookieService;
  public userdetails:any=[];
  items:any;
  commonservices:Commonservices;
  coockieData:CookieService;
  public userid;
  public serverurl;
  constructor(private _http: Http, private router: Router, userdata: CookieService, private _commonservices: Commonservices) {
    this.coockieData= userdata;
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverurl=_commonservices.url;
    let userdata2: any;
    userdata2= userdata.get('userdetails');

    if (typeof (userdata2) == 'undefined' || userdata2 == '') {
      this.router.navigateByUrl('/login');
    } else {
        userdata2 =JSON.parse(userdata2);
      this.userid = userdata2._id;
      if(userdata2.admin == 0){
          if(userdata2.signupaffiliate == 1){
              if(userdata2.agreement == 0){
                  this.router.navigateByUrl('/agreement/'+userdata2._id);
              }else{
                  this.router.navigateByUrl('/affiliate-dashboard');
              }
          }else if(userdata2.ambassador == 1){
              if(userdata2.agreement == 0){
                  this.router.navigateByUrl('/ambassador-agreement/'+userdata2._id);
              }else{
                  this.router.navigateByUrl('/ambassador-dashboard');
              }
          }else {
              this.router.navigateByUrl('/user-dashboard');
          }
      }
    }
  }

  ngOnInit() {
  }
}
