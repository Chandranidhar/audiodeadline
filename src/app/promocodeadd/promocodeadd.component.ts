import { Component, OnInit } from '@angular/core';
import {Commonservices} from "../app.commonservices";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-promocodeadd',
  templateUrl: './promocodeadd.component.html',
  styleUrls: ['./promocodeadd.component.css'],
  providers: [Commonservices]
})
export class PromocodeaddComponent implements OnInit {
  public dataForm: FormGroup;
  public fb;
  public is_error;
  public serverurl;

  constructor(fb: FormBuilder,private _commonservices : Commonservices,private _http: Http,private router: Router) {
    this.fb = fb;
    this.serverurl=_commonservices.url;
  }

  ngOnInit() {
    this.dataForm = this.fb.group({
      promocode: ["", PromocodeaddComponent.validateUsername],
      description: ["", Validators.required],
      amount: ["", PromocodeaddComponent.validateAmount],
    });
  }

  static validateUsername(control: FormControl){
    if(control.value==''){
      return { 'blankprocode': true };
    }

    if ( !control.value.match(/^[A-Za-z0-9]*$/)){
      return { 'invalidprocode': true };
    }
  }

  static validateAmount(control: FormControl){
    if(control.value==''){
      return { 'blankamount': true };
    }
    if(parseFloat(control.value) >= 100){
      return { 'maxamount': true };
    }

    if ( !control.value.match(/^[0-9\.]*$/)){
      return { 'invalidamount': true };
    }
  }

  dosubmit(formval) {
    let x: any;
    for (x in this.dataForm.controls) {
      this.dataForm.controls[x].markAsTouched();
    }

    if (this.dataForm.valid) {
      var link = this.serverurl+'addpromocode';
      var data = {
        promocode: formval.promocode,
        description: formval.description,
        amount: formval.amount,
      };

      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            if(result.status=='success'){
              this.router.navigate(['/promocode-list']);                    }
            else {
              this.is_error= result.msg;
            }
          }, error => {
            console.log("Oooops!");
          });
    }
  }

}
