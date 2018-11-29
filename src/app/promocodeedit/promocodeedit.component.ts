import { Component, OnInit } from '@angular/core';
import {Commonservices} from "../app.commonservices";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {Http} from "@angular/http";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-promocodeedit',
  templateUrl: './promocodeedit.component.html',
  styleUrls: ['./promocodeedit.component.css'],
  providers: [Commonservices]
})
export class PromocodeeditComponent implements OnInit {
  public dataForm: FormGroup;
  public fb;
  public is_error;
  public serverurl;
  public promocodeid;

  constructor(fb: FormBuilder,private _commonservices : Commonservices,private _http: Http,private router: Router,private route:ActivatedRoute) {
    this.fb = fb;
    this.serverurl=_commonservices.url;

    this.route.params.subscribe(params=>{
      this.promocodeid = params['id'];
      this.getPromoDetails();
    });

  }

  ngOnInit() {
    this.dataForm = this.fb.group({
      promocode: ["", PromocodeeditComponent.validateUsername],
      description: ["", Validators.required],
      amount: ["", PromocodeeditComponent.validateAmount],
    });
  }

  getPromoDetails(){
    var link =this.serverurl+'promocodedetails';
    var data = {_id: this.promocodeid};

    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();
          if (result.status == 'success' && typeof(result.item) != 'undefined'){
            let userdet = result.item;
            this.dataForm.controls['promocode'].setValue(userdet.promocode);
            this.dataForm.controls['description'].setValue(userdet.description);
            this.dataForm.controls['amount'].setValue(userdet.amount.toString());
          }
        },error => {
          console.log("Oooops!");
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
      var link = this.serverurl+'updatepromocode';
      var data = {
        _id: this.promocodeid,
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
