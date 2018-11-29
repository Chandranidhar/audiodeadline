import { Component, OnInit } from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-genreedit',
  templateUrl: './genreedit.component.html',
  styleUrls: ['./genreedit.component.css'],
    providers: [Commonservices]
})
export class GenreeditComponent implements OnInit {
    public dataForm: FormGroup;
    public fb;
    public is_error;
    public serverurl;
    public genreid;

    constructor(fb: FormBuilder,private _commonservices : Commonservices,private _http: Http,private router: Router,private route:ActivatedRoute) {
        this.fb = fb;
        this.serverurl=_commonservices.url;

        this.route.params.subscribe(params=>{
            this.genreid = params['id'];
            this.getGenreDetails();
        });
    }

  ngOnInit() {
      this.dataForm = this.fb.group({
          genrename: ["", Validators.required],
          type: ["", Validators.required],
      });
  }

    getGenreDetails(){
        var link =this.serverurl+'genredetails';
        var data = {_id: this.genreid};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if (result.status == 'success' && typeof(result.item) != 'undefined'){
                    let userdet = result.item;
                    this.dataForm.controls['genrename'].setValue(userdet.genrename);
                    this.dataForm.controls['type'].setValue(userdet.type);
                }
            },error => {
                console.log("Oooops!");
            });

    }

    dosubmit(formval){
        let x: any;
        for (x in this.dataForm.controls) {
            this.dataForm.controls[x].markAsTouched();
        }

        if (this.dataForm.valid) {
            var link = this.serverurl+'updategenre';
            var data = {
                _id: this.genreid,
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
