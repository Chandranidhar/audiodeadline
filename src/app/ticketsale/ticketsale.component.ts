import { Component, OnInit } from '@angular/core';
import {CommunitysignupComponent} from '../communitysignup/communitysignup.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {Commonservices} from '../app.commonservices';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-ticketsale',
    templateUrl: './ticketsale.component.html',
    styleUrls: ['./ticketsale.component.css'],
    providers: [Commonservices]
})

export class TicketsaleComponent implements OnInit {
    public dataForm: FormGroup;
    private fb;
    public serverurl;
    public state;
    public montharr;
    public yeararr;
    public affiliate1;
    public affiliate2;
    public affiliate3;
    public media;
    public sponsor;
    public banner1;
    public banner2;
    public promoerror;
    public promosuccess;
    public promomsg;
    public is_error;
    public chkerror;
    public productid;

    constructor(fb: FormBuilder,private _http: Http, private _commonservices : Commonservices,private route:ActivatedRoute) {
        this.is_error = 0;
        this.chkerror = 0;
        this.promoerror=0;
        this.promosuccess=0;
        this.promomsg='';
        this.productid='5bb2163c785e0c0f2926c3fa';
        this.fb = fb;
        this.serverurl=_commonservices.url;
        this.yeararr= [];
        this.montharr= [
            {'val': '01','label':'Jan'},
            {'val': '02','label':'Feb'},
            {'val': '03','label':'Mar'},
            {'val': '04','label':'Apr'},
            {'val': '05','label':'May'},
            {'val': '06','label':'Jun'},
            {'val': '07','label':'Jul'},
            {'val': '08','label':'Aug'},
            {'val': '09','label':'Sep'},
            {'val': '10','label':'Oct'},
            {'val': '11','label':'Nov'},
            {'val': '12','label':'Dec'}
            ];

        let cdate = new Date();
        let currentYear = cdate.getFullYear();

        for(let i=currentYear; i<=(currentYear+20);i++){
            this.yeararr.push({'val': i,'label':i});
        }

        let link=this.serverurl+'getusastates';
        this._http.get(link)
            .subscribe(res => {
                let result1 = res.json();
                this.state = result1;
            }, error => {
                console.log("Oooops!");
            });

        this.affiliate1 = '';
        this.affiliate2 = '';
        this.affiliate3 = '';
        this.media = '';
        this.sponsor = '';
        this.banner1 = '';
        this.banner2 = '';

        this.route.params.subscribe(params=>{
            if(typeof (params.param1) != 'undefined'){
                let param1 = params.param1;
                if( param1.substring(0,7) == 'sponsor'){
                    this.sponsor = param1.substring(8);
                }
                if( param1.substring(0,5) == 'media'){
                    this.media = param1.substring(6);
                }
                if( param1.substring(0,9) == 'affiliate'){
                    this.affiliate1 = param1.substring(10);
                }
            }
            if(typeof (params.param2) != 'undefined'){
                let param2 = params.param2;
                if( param2.substring(0,7) == 'sponsor'){
                    this.sponsor = param2.substring(8);
                }
                if( param2.substring(0,5) == 'media'){
                    this.media = param2.substring(6);
                }
                if( param2.substring(0,9) == 'affiliate'){
                    this.affiliate1 = param2.substring(10);
                }
            }
            if(typeof (params.param3) != 'undefined'){
                let param3 = params.param3;
                if( param3.substring(0,7) == 'sponsor'){
                    this.sponsor = param3.substring(8);
                }
                if( param3.substring(0,5) == 'media'){
                    this.media = param3.substring(6);
                }
                if( param3.substring(0,9) == 'affiliate'){
                    this.affiliate1 = param3.substring(10);
                }
            }

            if(this.sponsor != '' && this.media != ''){
                let link1=this.serverurl+'getsponsormedia';
                var data1 = {
                    sponsor: this.sponsor
                };

                this._http.post(link1,data1)
                    .subscribe(res => {
                        let result1 = res.json();
                        if(result1.status == 'success'){
                            for(let n in result1.item){
                                let item = result1.item[n];
                                if(this.media == 'sponsor_media_11' || this.media == 'sponsor_media_12'){
                                    if(item.name == 'sponsor_media_11'){
                                        this.banner1 = item.image;
                                    }
                                    if(item.name == 'sponsor_media_12'){
                                        this.banner2 = item.image;
                                    }
                                }
                                if(this.media == 'sponsor_media_21' || this.media == 'sponsor_media_22'){
                                    if(item.name == 'sponsor_media_21'){
                                        this.banner1 = item.image;
                                    }
                                    if(item.name == 'sponsor_media_22'){
                                        this.banner2 = item.image;
                                    }
                                }
                                if(this.media == 'sponsor_media_31' || this.media == 'sponsor_media_32'){
                                    if(item.name == 'sponsor_media_31'){
                                        this.banner1 = item.image;
                                    }
                                    if(item.name == 'sponsor_media_32'){
                                        this.banner2 = item.image;
                                    }
                                }
                            }
                        }
                    }, error => {
                        console.log("Oooops!");
                    });
            }

            if(this.affiliate1 != ''){
                this.getAffParent();
            }

        });
    }

    getAffParent(){
        var link = this.serverurl+'getaffparent';
        var data = {
            affiliate: this.affiliate1
        };

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if(result.status=='success') {
                    this.affiliate2 = result.parent;
                    if(this.affiliate2 != '' && result.ambassador == 1){
                        this.getAffParent2();
                    }
                }
            }, error => {
                console.log("Oooops!");
            });
    }

    getAffParent2(){
        var link = this.serverurl+'getaffparent';
        var data = {
            affiliate: this.affiliate2
        };

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if(result.status=='success') {
                    this.affiliate3 = result.parent;
                }
            }, error => {
                console.log("Oooops!");
            });
    }

    ngOnInit() {
        this.dataForm = this.fb.group({
            firstname: ["", Validators.required],
            lastname: ["", Validators.required],
            address: ["", Validators.required],
            city: ["", Validators.required],
            state: ["", Validators.required],
            zip: ["", Validators.required],
            cardnumber: ["", Validators.required],
            expmon: ["", Validators.required],
            expyear: ["", Validators.required],
            cvv: ["", Validators.required],
            promocode: [""],
            accepttermscond: [false],
        });
    }

    chkPromocode(){
        this.promoerror=0;
        this.promosuccess=0;
        this.promomsg='';

        let promoval = this.dataForm.controls['promocode'].value;
        if(promoval != ''){
            var link = this.serverurl+'chkpromocode';
            var data = {
                promocode: promoval
            };

            this._http.post(link, data)
                .subscribe(res => {
                    var result = res.json();
                    if(result.status=='success') {
                        this.promosuccess = 1;
                        this.promomsg = result.msg;
                    }else{
                        this.promoerror = 1;
                        this.promomsg= result.msg;
                    }
                }, error => {
                    console.log("Oooops!");
                });
        }
    }

    dosubmit(formval){
        this.is_error = 0;
        this.chkerror = 0;
        let x: any;
        for (x in this.dataForm.controls) {
            this.dataForm.controls[x].markAsTouched();
        }

        if (this.dataForm.valid) {
            if ((formval.accepttermscond == false || formval.accepttermscond == 0)) {
                this.chkerror = 1;
                this.dataForm.controls['accepttermscond'].setErrors({'incorrect': true});
                return false;
            } else {
                var data = {
                    firstname: formval.firstname,
                    lastname: formval.lastname,
                    address: formval.address,
                    city: formval.city,
                    state: formval.state,
                    zip: formval.zip,
                    cardnumber: formval.cardnumber,
                    expmon: formval.expmon,
                    expyear: formval.expyear,
                    cvv: formval.cvv,
                    promocode: formval.promocode,
                    affiliate1: this.affiliate1,
                    affiliate2: this.affiliate2,
                    affiliate3: this.affiliate3,
                    media: this.media,
                    sponsor: this.sponsor,
                    productid: this.productid
                };

                console.log(data);
            }
        }
    }
}
