import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";

@Component({
  selector: 'app-productedit',
  templateUrl: './productedit.component.html',
  styleUrls: ['./productedit.component.css'],
  providers: [Commonservices]
})
export class ProducteditComponent implements OnInit {
  public dataForm: FormGroup;
  public fb;
  public is_error;
  public serverurl;
  public productid;

  constructor(fb: FormBuilder,private _commonservices : Commonservices,private _http: Http,private router: Router,private route:ActivatedRoute) {
    this.fb = fb;
    this.serverurl=_commonservices.url;

    this.route.params.subscribe(params=>{
      this.productid = params['id'];
      this.getProductDetails();
    });

  }

  ngOnInit() {
    this.dataForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      price: ["", ProducteditComponent.validatePrice],
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

  getProductDetails(){
    var link =this.serverurl+'productdetails';
    var data = {_id: this.productid};

    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();
          if (result.status == 'success' && typeof(result.item) != 'undefined'){
            let userdet = result.item;
            this.dataForm.controls['name'].setValue(userdet.name);
            this.dataForm.controls['description'].setValue(userdet.description);
            this.dataForm.controls['price'].setValue(userdet.price.toString());
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

    if (this.dataForm.valid) {
      var link = this.serverurl+'updateproduct';
      var data = {
        _id: this.productid,
        name: formval.name,
        description: formval.description,
        price: formval.price,
      };

      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            if(result.status=='success'){
              this.router.navigate(['/product-list']);
            }
            else {
              this.is_error= result.msg;
            }
          }, error => {
            console.log("Oooops!");
          });
    }
  }



}
