import {Component, OnInit, TemplateRef} from '@angular/core';
import {SignupComponent} from '../signup/signup.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Commonservices} from '../app.commonservices';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {Http} from '@angular/http';
import {invalid} from '@angular/compiler/src/render3/view/util';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ambassadorsignup',
  templateUrl: './ambassadorsignup.component.html',
  styleUrls: ['./ambassadorsignup.component.css'],
    providers: [Commonservices]
})
export class AmbassadorsignupComponent implements OnInit {
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

  constructor(fb: FormBuilder,private _http: Http,private router: Router, private _commonservices : Commonservices,private route:ActivatedRoute, userdata: CookieService,private modalService: BsModalService) {
      this.userdata = userdata;
      this.chkerror = 0;
      this.is_error = 0;
      this.fb = fb;
      this.serverurl=_commonservices.url;


      let link=this.serverurl+'getusastates';

      this._http.get(link)
          .subscribe(res => {
              let result1 = res.json();
              this.state2 = result1;
          }, error => {
              console.log("Oooops!");
          });


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
  }

  ngOnInit() {
      this.dataForm = this.fb.group({
          firstname: ["", Validators.required],
          lastname: ["", Validators.required],
          phone: ["", Validators.required],
          email: ["", AmbassadorsignupComponent.validateEmail],
          username: ["", AmbassadorsignupComponent.validateUsername],
          password: ["", Validators.required],
          confirmpassword: ["", Validators.required],
          state: ["", Validators.required],
          zip: ["", Validators.required],
          gender: ["", Validators.required],
          accepttermscond: [0],
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

    dosubmit(formval,template: TemplateRef<any>){
        this.is_error = 0;
      this.chkerror = 0;
        let x: any;
        for (x in this.dataForm.controls){
            console.log(x);
            this.dataForm.controls[x].markAsTouched();
        }
        if (this.dataForm.valid){
            if((formval.accepttermscond == false || formval.accepttermscond == 0)){
                this.chkerror = 1;
                this.dataForm.controls['accepttermscond'].setErrors({'incorrect': true});
                return false;
            }else{
                var link = this.serverurl+'signup';
                var data = {
                    firstname: formval.firstname,
                    lastname: formval.lastname,
                    phone: formval.phone,
                    email: formval.email,
                    username: formval.username,
                    password: formval.password,
                    state: formval.state,
                    zip: formval.zip,
                    gender: formval.gender,
                    parent: this.parent,
                    mediaid: this.mediaid,
                    ambassador: 1,
                };

                this._http.post(link, data)
                    .subscribe(res => {
                        var result = res.json();
                        if(result.status=='success'){
                            this.router.navigateByUrl('/ambassador-agreement/'+result.result.insertedIds[0]);
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
