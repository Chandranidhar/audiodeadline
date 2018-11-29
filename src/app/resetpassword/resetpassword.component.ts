import { Component, OnInit } from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {CookieService} from 'ngx-cookie-service';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
    providers: [Commonservices]
})
export class ResetpasswordComponent implements OnInit {
    public loginform: FormGroup;
    private fb;
    private userdata: CookieService;
    private userdetails;
    items:any;
    commonservices:Commonservices;
    public serverurl;
    public accesscode;
    public is_error;
    public is_error1;

    constructor(fb: FormBuilder,private _http: Http,private router: Router, userdata: CookieService, private _commonservices: Commonservices,private route:ActivatedRoute,private sanitize: DomSanitizer) {
        this.fb = fb;
        this.userdata = userdata;
        this.commonservices=_commonservices;
        this.items = _commonservices.getItems();
        this.serverurl=_commonservices.url;

        this.route.params.subscribe(params=>{
            this.accesscode = params['accesscode'];
            this.chkaccesscode();
        });
    }

  ngOnInit() {
      this.loginform = this.fb.group({
          password: ["", Validators.required],
          confirmpassword: ["", Validators.required],
      },{validator: this.matchingPasswords('password', 'confirmpassword')});
  }

    public matchingPasswords(passwordKey: string, confirmPasswordKey: string){
        return (group: FormGroup): {[key: string]: any} => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];

            if (password.value !== confirmPassword.value){
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }

    resendlink(){
        alert(1);
    }

    chkaccesscode(){
        this.is_error1= 0;
        var link = this.serverurl+'chkaccesscode';
        var data = {
            accesscode: this.accesscode,
        };
        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if(result.status=='error'){
                    this.is_error1= 1;
                }
            }, error => {
                console.log("Oooops!");
            });
    }

    dosubmit(formval){
      this.is_error = 0;
      this.is_error1 = 0;
        let x: any;
        for (x in this.loginform.controls){
            this.loginform.controls[x].markAsTouched();
        }
        var link = this.serverurl+'resetpassword';
        if (this.loginform.valid){
            var data = {
                password: formval.password,
                accesscode: this.accesscode,
            };

            this._http.post(link, data)
                .subscribe(res => {
                    var result = res.json();
                    if(result.status=='success'){
                        this.router.navigate(['/login']);
                    }else{
                        this.is_error= result.msg;
                    }
                }, error => {
                    console.log("Oooops!");
                });
        }

    }

}
