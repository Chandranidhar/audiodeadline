import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
declare var $ : any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
    providers: [Commonservices]
})

export class LoginComponent implements OnInit {
    public loginform: FormGroup;
    private fb;
    private userdata: CookieService;
    private userdetails;
    items:any;
    commonservices:Commonservices;
    public is_error;
    public serverurl;
    private user_id;
    public showLoader: any;


  constructor(fb: FormBuilder,private _http: Http,private router: Router, userdata: CookieService, private _commonservices: Commonservices) {


      this.showLoader = 0;

      this.fb = fb;
      this.userdata = userdata;
      this.commonservices=_commonservices;
      this.items = _commonservices.getItems();
      this.serverurl=_commonservices.url;

      //redirecting the page to profile page starts here
      this.user_id = userdata.get('user_id');
      console.log('this.user_id');
      console.log(this.user_id);
      if(this.user_id!=''){
          this.router.navigateByUrl('/profile');
      }
      // ends here
  }

    ngOnInit() {
        this.loginform = this.fb.group({
            email: ["", LoginComponent.validateEmail],
            password: ["", Validators.required],
        });

    }

    static validateEmail(control: FormControl){
        if(control.value==''){
            return { 'invalidemail': true };
        }
        if ( !control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return { 'invalidemail': true };
        }
    }


    dosubmit(formval) {
        let x: any;
        this.is_error = 0;
        for (x in this.loginform.controls) {
            console.log(this.loginform.controls[x]);
            this.loginform.controls[x].markAsTouched();
        }
        console.log(this.loginform.valid);
        var link = this.serverurl+'userlogin';

        // var link = 'http://localhost:3007/userlogin';
        if (this.loginform.valid) {
            var data = {
                email: formval.email,
                password: formval.password,
            };

            console.log(data);
            this.showLoader = 1;
            this._http.post(link, data)
                .subscribe(res => {
                    var result = res.json();
                    console.log(result.msg);
                    if(result.status=='success'){
                        this.userdata.set('userdetails', JSON.stringify(result.msg));

                        console.log(result);
                        console.log('result.msg.images');
                        console.log(result.msg.images);
                        this.userdata.set('real_name',result.msg.realname);
                        this.userdata.set('user_name',result.msg.username);
                        this.userdata.set('user_id',result.msg._id);
                        this.userdata.set('image',result.msg.images);
                        this.userdata.set('fan',result.msg.fan);
                        this.userdata.set('musicians',result.msg.musicians);
                        this.userdata.set('dancer',result.msg.dancer);
                        this.userdata.set('model',result.msg.model);
                        this.userdata.set('signupaffiliate',result.msg.signupaffiliate);
                        console.log('user_id');
                        console.log(result.msg._id);
                        console.log(result.msg.fan);
                        this.showLoader = 0;
                        //this.router.navigateByUrl('/dashboard');
                        //added by chandrani
                         if(result.msg.musicians == 1 || result.msg.fan == 1 || result.msg.dancer == 1 || result.msg.model == 1){


                             this.router.navigate(['/profile']);

                         }
                         else {
                             this.router.navigateByUrl('/dashboard');
                         }

                    }
                    else {
                        this.showLoader = 0;
                        this.is_error=result.msg;
                        console.log(this.is_error);
                        this.router.navigate(['/login']);
                    }
                }, error => {
                    console.log("Oooops!");

                    this.router.navigate(['/login']);
                });
        }
    }
}
