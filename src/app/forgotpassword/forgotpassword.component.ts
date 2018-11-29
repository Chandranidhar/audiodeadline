import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginComponent} from '../login/login.component';
import {Commonservices} from '../app.commonservices';
import {CookieService} from 'ngx-cookie-service';
import {Http} from '@angular/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
    providers: [Commonservices]
})
export class ForgotpasswordComponent implements OnInit {
    public loginform: FormGroup;
    private fb;
    private userdata: CookieService;
    private userdetails;
    items:any;
    commonservices:Commonservices;
    public is_error;
    public is_succ;
    public serverurl;

    constructor(fb: FormBuilder,private _http: Http,private router: Router, userdata: CookieService, private _commonservices: Commonservices) {
        this.fb = fb;
        this.userdata = userdata;
        this.commonservices=_commonservices;
        this.items = _commonservices.getItems();
        this.serverurl=_commonservices.url;
    }

  ngOnInit() {
      this.loginform = this.fb.group({
          email: ["", ForgotpasswordComponent.validateEmail]
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

    dosubmit(formval){
        let x: any;
        this.is_error = 0;
        this.is_succ = 0;
        for (x in this.loginform.controls) {
            this.loginform.controls[x].markAsTouched();
        }

        var link = this.serverurl+'forgotpassword';

        if (this.loginform.valid) {
            var data = {
                email: formval.email,
            };

            this._http.post(link, data)
                .subscribe(res => {
                    var result = res.json();

                    console.log(result);

                    if(result.status=='success'){
                        this.is_succ=result.msg;
                    }
                    else {
                        this.is_error=result.msg;
                    }
                }, error => {
                    console.log("Oooops!");
                });
        }
    }

}
