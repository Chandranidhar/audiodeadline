import { Component, OnInit } from '@angular/core';
import {SignupComponent} from '../signup/signup.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Commonservices} from '../app.commonservices';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';

@Component({
    selector: 'app-adminedit',
    templateUrl: './adminedit.component.html',
    styleUrls: ['./adminedit.component.css'],
    providers: [Commonservices]
})

export class AdmineditComponent implements OnInit {
  public dataForm: FormGroup;
  public fb;
  public serverurl;
  public is_error;
  public state2;
  public userid;

  constructor(fb: FormBuilder,private _commonservices : Commonservices,private _http: Http,private router: Router,private route:ActivatedRoute){
    this.userid = '';
      this.fb = fb;
      this.serverurl=_commonservices.url;
    this.route.params.subscribe(params=>{
      this.userid = params['id'];
      this.getUserDetails();
    });

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
        email: [""],
        username: [""],
        address: ["", Validators.required],
        address2: [""],
        city: ["", Validators.required],
        state: ["", Validators.required],
        zip: ["", Validators.required],
        rsvp: [false],
        signupaffiliate: [false],
    });
  }

    getUserDetails(){
        var link =this.serverurl+'dashboard';
        var data = {_id: this.userid};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if (result.status == 'success' && typeof(result.item) != 'undefined'){
                    let userdet = result.item;
                    this.dataForm.controls['firstname'].setValue(userdet.firstname);
                    this.dataForm.controls['lastname'].setValue(userdet.lastname);
                    this.dataForm.controls['phone'].setValue(userdet.phone);
                    this.dataForm.controls['email'].setValue(userdet.email);
                    this.dataForm.controls['username'].setValue(userdet.username);
                    this.dataForm.controls['address'].setValue(userdet.address);
                    this.dataForm.controls['address2'].setValue(userdet.address2);
                    this.dataForm.controls['city'].setValue(userdet.city);
                    this.dataForm.controls['state'].setValue(userdet.state);
                    this.dataForm.controls['zip'].setValue(userdet.zip);
                }
            },error => {
                console.log("Oooops!");
            });

    }

    dosubmit(formval) {
        let x: any;
        for (x in this.dataForm.controls) {
            this.dataForm.controls[x].markAsTouched();
        }
        var link = this.serverurl + 'updateuser';
        if (this.dataForm.valid) {
            var data = {
                _id: this.userid,
                firstname: formval.firstname,
                lastname: formval.lastname,
                phone: formval.phone,
                email: formval.email,
                username: formval.username,
                address: formval.address,
                address2: formval.address2,
                city: formval.city,
                state: formval.state,
                zip: formval.zip
            };

            this._http.post(link, data)
                .subscribe(res => {
                    var result = res.json();
                    if (result.status == 'success') {
                        this.router.navigate(['/admin-list']);
                    }
                    else {
                        this.is_error = result.msg;
                    }
                }, error => {
                    console.log("Oooops!");
                });
        }
    }

}
