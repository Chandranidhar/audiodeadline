import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
declare var $:any;
declare var moment: any;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
  providers: [Commonservices]
})
export class FriendsComponent implements OnInit {

  public userdata: CookieService;
  public siteurl;
  public serverurl;
  public user_name;
  public user_id;
  public fan;
  public friendsarray:any=[];

  constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices) {

    this.userdata = userdata;
    this.serverurl=_commonservices.url;
    this.siteurl=_commonservices.siteurl;

    if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')

    this.user_name = this.userdata.get('user_name');
    this.user_id = this.userdata.get('user_id');

  }

  ngOnInit() {

    this.friendslist();
  }

  friendslist(){
    let link = this.serverurl+'getuserdetailsbyfriendtype';
    let data ={ 'user_id': this.user_id};
    this._http.post(link ,data)
        .subscribe(res=>{

          let result:any={};
          result= res.json();
          if(result.status=='success'){

            /*console.log('result.item...................');
            console.log(result.item);*/
            let items = result.item;

            for(let i in items){
              if(items[i].friend_by == this.user_id){
                /*console.log('items[i].userdata[0].fan');
                console.log(items[i].userdata[0].fan);*/

                if(items[i].userdata[0].fan == 1){

                  this.friendsarray.push(items[i].userdata[0]);
                }
              }
              if(items[i].friend_id == this.user_id){
               /* console.log('items[i].userdatafrom[0].fan');
                console.log(items[i].userdatafrom[0].fan);*/

                if(items[i].userdatafrom[0].fan == 1){

                  this.friendsarray.push(items[i].userdatafrom[0]);
                }
              }

            }
/*
            console.log('this.friendsarray');
            console.log(this.friendsarray);*/
          }
        })


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

}
