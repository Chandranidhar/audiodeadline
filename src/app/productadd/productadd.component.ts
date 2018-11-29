import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup} from "@angular/forms";
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-productadd',
  templateUrl: './productadd.component.html',
  styleUrls: ['./productadd.component.css'],
  providers: [Commonservices]
})
export class ProductaddComponent implements OnInit {
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
      name: ["", Validators.required],
      description: ["", Validators.required],
      price: ["", ProductaddComponent.validatePrice],
    });
  }

  static validatePrice(control: FormControl){
    if(control.value==''){
      return { 'blankprice': true };
    }

    if ( !control.value.match(/^[0-9\.]*$/)){
      return { 'invalidprice': true };
    }
  }

  dosubmit(formval) {
    let x: any;
    for (x in this.dataForm.controls) {
      this.dataForm.controls[x].markAsTouched();
    }

    if (this.dataForm.valid) {
      var link = this.serverurl+'addproduct';
      var data = {
        name: formval.name,
        description: formval.description,
        price: formval.price,
      };

      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            if(result.status=='success'){
              this.router.navigate(['/product-list']);                    }
            else {
              this.is_error= result.msg;
            }
          }, error => {
            console.log("Oooops!");
          });
    }
  }


}
