import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
declare var $: any;
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css'],
  providers: [Commonservices]
})
export class ContactusComponent implements OnInit {
  public dataForm: FormGroup;
  private fb;
  commonservices:Commonservices;
  public serverurl;
  items:any;

  constructor(fb: FormBuilder,private _http: Http,private router: Router, private _commonservices: Commonservices) {
    this.fb = fb;
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverurl=_commonservices.url;
    console.log(this.serverurl);

  }

  ngOnInit() {
    this.dataForm = this.fb.group({
      fullname: ["", Validators.required],
      email: ["", ContactusComponent.validateEmail],
      phoneno: ["", Validators.required],
      message: ["", Validators.required],
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

    for (x in this.dataForm.controls) {
      console.log(this.dataForm.controls[x]);
      this.dataForm.controls[x].markAsTouched();
    }

    console.log("??????????????????????");
    console.log(this.dataForm.valid);
    //var link = 'http://localhost:3005/contactus';
    var link = this.serverurl+'contactus';
    if (this.dataForm.valid) {
    var data = {
      fullname: formval.fullname,
      email: formval.email,
      phoneno: formval.phoneno,
      message: formval.message,
    };

    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();
          //console.log(result.status);
           this.router.navigate(['/contactus']);

        }, error => {
          console.log("Oooops!");
        });
    }
  }

}






