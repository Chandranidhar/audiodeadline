import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import {Commonservices} from "../app.commonservices";
import {CookieService} from 'ngx-cookie-service';

declare var $ : any;

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    providers: [Commonservices]
})

export class SignupComponent implements OnInit {
    public dataForm: FormGroup;
    private fb;
    items:any;
    public serverurl;
    public is_error;
    commonservices:Commonservices;
    public data: any = [];
    public state: any = [];
    public state2: any = [];
    public val;
    public mediaid;
    public chkerror;
    private userdata: CookieService;

    constructor(fb: FormBuilder,private _http: Http,private router: Router, private _commonservices : Commonservices,private route:ActivatedRoute, userdata: CookieService){
        this.chkerror = 0;
        this.userdata = userdata;
        this.fb = fb;
        this.commonservices=_commonservices;
        this.items = _commonservices.getItems();
        this.serverurl=_commonservices.url;

        let link=this.serverurl+'getusastates';

        this._http.get(link)
            .subscribe(res => {
                let result1 = res.json();
                this.state2 = result1;
                for(let i in result1){
                    this.state[i]= result1[i].name;
                }
                }, error => {
                console.log("Oooops!");
            });

        this.val = '';
        this.mediaid = '';
        this.route.params.subscribe(params=>{
            if(typeof (params.uname) != 'undefined'){
                this.val = params.uname;
                this.userdata.set('affiliatename', this.val);
                this.addNoOfClick();
            }else{
                let userdata2: any;
                userdata2= userdata.get('affiliatename');
                if (typeof (userdata2) != 'undefined' && userdata2 != ''){
                    this.val = userdata2;
                }
                let userdata3: any;
                userdata3= userdata.get('mediaid');
                if (typeof (userdata3) != 'undefined' && userdata3 != ''){
                    this.mediaid = userdata3;
                }
            }

            if(typeof (params.mediaid) != 'undefined'){
                this.mediaid = params.mediaid;
                this.userdata.set('mediaid', this.mediaid);
                this.addMediaNoOfClick();
            }else{
                let userdata3: any;
                userdata3= userdata.get('mediaid');
                if (typeof (userdata3) != 'undefined' && userdata3 != ''){
                    this.mediaid = userdata3;
                }
            }
        });
    }

    ngOnInit(){
        this.dataForm = this.fb.group({
            firstname: ["", Validators.required],
            lastname: ["", Validators.required],
            phone: ["", Validators.required],
            email: ["", SignupComponent.validateEmail],
            username: ["", SignupComponent.validateUsername],
            password: ["", Validators.required],
            confirmpassword: ["", Validators.required],
            address: ["", Validators.required],
            address2: [""],
            city: ["", Validators.required],
            state: [""],
            zip: ["", Validators.required],
            rsvp: [0],
            signupaffiliate: [0],
        },{validator: this.matchingPasswords('password', 'confirmpassword')});
    }

    static validateUsername(control: FormControl){
        if(control.value==''){
            return { 'invalidusername': true };
        }

        if ( !control.value.match(/^\S*$/)){
            return { 'invalidusername': true };
        }
    }
    static validateEmail(control: FormControl){
        if(control.value==''){
            return { 'invalidemail': true };
        }

        if ( !control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)){
            return { 'invalidemail': true };
        }
    }

    public matchingPasswords(passwordKey: string, confirmPasswordKey: string){
        return (group: FormGroup): {[key: string]: any} => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];

            if (password.value !== confirmPassword.value){
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }

    addMediaNoOfClick(){
        var link =this.serverurl+'addMediaNoOfClick';
        var data = {mediaid:this.mediaid};

        this._http.post(link, data)
            .subscribe(res => {
                console.log("Success!");
            },error => {
                console.log("Oooops!");
            });
    }
    addNoOfClick(){
        var link =this.serverurl+'addNoOfClick';
        var data = {username:this.val};

        this._http.post(link, data)
            .subscribe(res => {
                console.log("Success!");
                },error => {
                console.log("Oooops!");
            });
    }

    dosubmit(formval){
        this.chkerror = 0;
        let x: any;
        for (x in this.dataForm.controls){
            this.dataForm.controls[x].markAsTouched();
        }
        var link = this.serverurl+'signup';
        if (this.dataForm.valid){
            if((formval.rsvp == false || formval.rsvp == 0) && (formval.signupaffiliate == false || formval.signupaffiliate == 0)){
                this.chkerror = 1;
                return false;
            }else{
                var data = {
                    firstname: formval.firstname,
                    lastname: formval.lastname,
                    phone: formval.phone,
                    email: formval.email,
                    username: formval.username,
                    password: formval.password,
                    address: formval.address,
                    address2: formval.address2,
                    city: formval.city,
                    state: formval.state,
                    zip: formval.zip,
                    rsvp: formval.rsvp,
                    signupaffiliate: formval.signupaffiliate,
                    parent: this.val,
                    mediaid: this.mediaid
                };

                this._http.post(link, data)
                    .subscribe(res => {
                        var result = res.json();
                        if(result.status=='success'){
                            this.userdata.delete('affiliatename');
                            this.userdata.delete('mediaid');
                            if(formval.signupaffiliate == true || formval.signupaffiliate == "1"){
                                this.router.navigateByUrl('/agreement/'+result.result.insertedIds[0]);
                            }else{
                                $('#popthankyou').modal('show');
                            }
                        }else{
                            this.is_error= result.msg;
                        }
                        }, error => {
                        console.log("Oooops!");
                    });
            }
        }
    }
}