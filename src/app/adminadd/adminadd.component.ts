import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {SignupComponent} from '../signup/signup.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Commonservices} from '../app.commonservices';
import {Http} from '@angular/http';

@Component({
  selector: 'app-adminadd',
  templateUrl: './adminadd.component.html',
  styleUrls: ['./adminadd.component.css'],
    providers: [Commonservices]
})
export class AdminaddComponent implements OnInit {
    public dataForm: FormGroup;
    public fb;
    public serverurl;
    public is_error;
    public state2;

  constructor(fb: FormBuilder,private _commonservices : Commonservices,private _http: Http,private router: Router) {
      this.fb = fb;
      this.serverurl=_commonservices.url;

      let link=this.serverurl+'getusastates';
      this._http.get(link)
          .subscribe(res => {
              let result1 = res.json();
              this.state2 = result1;
          }, error => {
              console.log("Oooops!");
          });
  }

  ngOnInit() {
      this.dataForm = this.fb.group({
          firstname: ["", Validators.required],
          lastname: ["", Validators.required],
          phone: ["", Validators.required],
          email: ["", SignupComponent.validateEmail],
          username: ["", Validators.required],
          password: ["", Validators.required],
          confirmpassword: ["", Validators.required],
          address: ["", Validators.required],
          address2: [""],
          city: ["", Validators.required],
          state: ["", Validators.required],
          zip: ["", Validators.required],
          rsvp: [false],
          signupaffiliate: [false],
      }, {validator: this.matchingPasswords('password', 'confirmpassword')});
  }

    static validateEmail(control: FormControl){
      if(control.value==''){
          return { 'invalidemail': true };
      }
      if ( !control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
          return { 'invalidemail': true };
      }
    }

    public matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
        return (group: FormGroup): {[key: string]: any} => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];

            if (password.value !== confirmPassword.value) {
                console.log('mismatch');
                console.log(this.dataForm.controls['confirmpassword'].valid);

                return {
                    mismatchedPasswords: true
                };
            }
        }
    }

    dosubmit(formval) {
        let x: any;
        for (x in this.dataForm.controls) {
            this.dataForm.controls[x].markAsTouched();
        }
        var link = this.serverurl+'signup';
        if (this.dataForm.valid) {
            var data = {
                firstname: formval.firstname,
                lastname: formval.lastname,
                phone: formval.phone,
                email: formval.email,
                username: formval.username,
                password: formval.password,
                address: formval.address,
                address2: formval.address2,
                city: formval.city,
                state: formval.state,
                zip: formval.zip,
                rsvp: formval.rsvp,
                signupaffiliate: formval.signupaffiliate,
                parent: 0,
                type : 'admin'
            };

            this._http.post(link, data)
                .subscribe(res => {
                    var result = res.json();
                    if(result.status=='success'){
                        this.router.navigate(['/admin-list']);                    }
                    else {
                        this.is_error= result.msg;
                    }
                }, error => {
                    console.log("Oooops!");
                });
        }
    }

}
