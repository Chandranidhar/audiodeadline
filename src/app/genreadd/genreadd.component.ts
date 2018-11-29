import { Component, OnInit } from '@angular/core';
import {SignupComponent} from '../signup/signup.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Commonservices} from '../app.commonservices';
import {Http} from '@angular/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-genreadd',
  templateUrl: './genreadd.component.html',
  styleUrls: ['./genreadd.component.css'],
    providers: [Commonservices]
})
export class GenreaddComponent implements OnInit {
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
          genrename: ["", Validators.required],
          type: ["", Validators.required],
      });
  }

    dosubmit(formval){
        let x: any;
        for (x in this.dataForm.controls) {
            this.dataForm.controls[x].markAsTouched();
        }

        if (this.dataForm.valid) {
            var link = this.serverurl+'addgenre';
            var data = {
                genrename: formval.genrename,
                type: formval.type,
            };

            this._http.post(link, data)
                .subscribe(res => {
                    var result = res.json();
                    if(result.status=='success'){
                        this.router.navigate(['/genre-list']);                    }
                    else {
                        this.is_error= result.msg;
                    }
                }, error => {
                    console.log("Oooops!");
                });
        }

    }

}
