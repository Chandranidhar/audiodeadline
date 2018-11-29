import { Component, OnInit } from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {Http} from '@angular/http';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css'],
    providers: [Commonservices]
})
export class MyaccountComponent implements OnInit {
    commonservices:Commonservices;
    coockieData:CookieService;
    items:any;
    public serverurl;
    public userid;
    public userdetails;

    constructor(private _http: Http, private router: Router, userdata: CookieService, private _commonservices: Commonservices){
        this.coockieData= userdata;
        this.commonservices=_commonservices;
        this.items = _commonservices.getItems();
        this.serverurl=_commonservices.url;
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
                }
            },error => {
                console.log("Oooops!");
            });
    }

}
