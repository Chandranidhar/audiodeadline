import { Component, OnInit } from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.css'],
    providers: [Commonservices]
})
export class UpdateprofileComponent implements OnInit {
    public dataForm: FormGroup;
    public fb;
    commonservices:Commonservices;
    coockieData:CookieService;
    items:any;
    public serverurl;
    public userid;
    public userdetails;
    public is_error;
    public state2;

    constructor(private _http: Http, private router: Router, userdata: CookieService, private _commonservices: Commonservices,fb: FormBuilder){
        this.fb = fb;
        this.coockieData= userdata;
        this.commonservices=_commonservices;
        this.items = _commonservices.getItems();
        this.serverurl=_commonservices.url;
        let userdata2: any;
        userdata2= userdata.get('userdetails');
        userdata2= JSON.parse(userdata2);
        if (typeof (userdata2) == 'undefined'){
            this.router.navigateByUrl('/login');
        }else{
            this.userid = userdata2._id;
            this.getUserDetails();
        }

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
                        this.router.navigate(['/dashboard']);
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
