import {Component, OnInit, TemplateRef} from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CookieService} from 'ngx-cookie-service';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AmbassadorsignupComponent} from '../ambassadorsignup/ambassadorsignup.component';

@Component({
  selector: 'app-communitysignup',
  templateUrl: './communitysignup.component.html',
  styleUrls: ['./communitysignup.component.css'],
    providers: [Commonservices]
})
export class CommunitysignupComponent implements OnInit {
    modalRef: BsModalRef;
    public dataForm: FormGroup;
    private fb;
    public serverurl;
    public chkerror;
    public state2;
    public parent;
    public mediaid;
    public is_error;
    private userdata: CookieService;
    private user_id;

    constructor(fb: FormBuilder,private _http: Http,private router: Router, private _commonservices : Commonservices,private route:ActivatedRoute, userdata: CookieService,private modalService: BsModalService) {
        this.userdata = userdata;
        //redirecting to profie page
        // this.user_id = userdata.get('user_id');
        // console.log('this.user_id');
        // console.log(this.user_id);
        // if(this.user_id!=''){
        //     this.router.navigateByUrl('/profile');
        // }



        this.chkerror = 0;
        this.is_error = 0;
        this.fb = fb;
        this.serverurl=_commonservices.url;


        this.parent = '';
        this.mediaid = '';
        this.route.params.subscribe(params=>{
            if(typeof (params.uname) != 'undefined'){
                this.parent = params.uname;
                this.userdata.set('affiliatename', this.parent);
                this.addNoOfClick();
            }else{
                let userdata2: any;
                userdata2= userdata.get('affiliatename');
                if (typeof (userdata2) != 'undefined' && userdata2 != ''){
                    this.parent = userdata2;
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


    //


    }

  ngOnInit() {
      this.dataForm = this.fb.group({
          firstname: ["", Validators.required],
          lastname: ["", Validators.required],
          phone: ["", Validators.required],
          email: ["", CommunitysignupComponent.validateEmail],
          username: ["", CommunitysignupComponent.validateUsername],
          password: ["", Validators.required],
          confirmpassword: ["", Validators.required],
          gender: ["", Validators.required],
          accepttermscond: [false],
          musicians: [false],
          dancer: [false],
          model: [false],
          signupaffiliate: [false],
          fan: [true],
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
                confirmPassword.setErrors({'incorrect': true});
                return {
                    mismatchedPasswords: true
                };
            }
        }
  }

    onChangeCategory(){
        if(this.dataForm.controls['musicians'].value || this.dataForm.controls['dancer'].value || this.dataForm.controls['model'].value){
            this.dataForm.controls['fan'].setValue(false);
        }
        if(!this.dataForm.controls['musicians'].value && !this.dataForm.controls['dancer'].value && !this.dataForm.controls['model'].value){
            this.dataForm.controls['fan'].setValue(true);
        }
    }

    dosubmit(formval,template: TemplateRef<any>) {
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
                var link = this.serverurl+'signup';
                var data = {
                    firstname: formval.firstname,
                    lastname: formval.lastname,
                    phone: formval.phone,
                    email: formval.email,
                    username: formval.username,
                    password: formval.password,
                    gender: formval.gender,
                    parent: this.parent,
                    mediaid: this.mediaid,
                    dancer: 0,
                    model: 0,
                    musicians: 0,
                    fan: 0,
                    signupaffiliate: 0,
                };

                if(formval.dancer){
                    data.dancer = 1;
                }
                if(formval.model){
                    data.model = 1;
                }
                if(formval.musicians){
                    data.musicians = 1;
                }
                if(formval.fan){
                    data.fan = 1;
                }
                if(formval.signupaffiliate){
                    data.signupaffiliate = 1;
                }

                this._http.post(link, data)
                    .subscribe(res => {
                        var result = res.json();
                        if(result.status=='success'){

                            var udetails = result.result.ops[0];

                            if(udetails.musicians == 1 || udetails.dancer == 1 || udetails.model == 1){
                                this.userdata.set('signupuserdata',JSON.stringify(udetails));
                                this.router.navigateByUrl('/community-signup-step-2/'+udetails._id);
                            }else if(udetails.signupaffiliate == 1){
                                this.router.navigateByUrl('/agreement/'+udetails._id);
                            }else{
                                this.modalRef = this.modalService.show(template);

                                this.dataForm.controls['firstname'].setValue('');
                                this.dataForm.controls['lastname'].setValue('');
                                this.dataForm.controls['phone'].setValue('');
                                this.dataForm.controls['email'].setValue('');
                                this.dataForm.controls['username'].setValue('');
                                this.dataForm.controls['password'].setValue('');
                                this.dataForm.controls['confirmpassword'].setValue('');
                                this.dataForm.controls['gender'].setValue('');
                                this.dataForm.controls['accepttermscond'].setValue(false);
                                this.dataForm.controls['musicians'].setValue(false);
                                this.dataForm.controls['dancer'].setValue(false);
                                this.dataForm.controls['model'].setValue(false);
                                this.dataForm.controls['signupaffiliate'].setValue(false);
                                this.dataForm.controls['fan'].setValue(true);

                                for (x in this.dataForm.controls) {
                                    this.dataForm.controls[x].markAsUntouched();
                                }
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

    closep(){
        this.modalRef.hide();
    }

    addNoOfClick(){
        var link =this.serverurl+'addNoOfClick';
        var data = {username:this.parent};

        this._http.post(link, data)
            .subscribe(res => {
                console.log("Success!");
            },error => {
                console.log("Oooops!");
            });
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
}
