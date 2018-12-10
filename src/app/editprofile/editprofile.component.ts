import { Component, OnInit } from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {FormArray, FormBuilder, FormGroup, Validators,ValidatorFn, AbstractControl} from '@angular/forms';
import {CommunitysignupComponent} from '../communitysignup/communitysignup.component';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
declare var $:any;

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css'],
  providers: [Commonservices]

})
export class EditprofileComponent implements OnInit {

  public dataForm: FormGroup;
  private fb;
  private userdata:CookieService;
  private userdatanew:CookieService;
  private serverurl;
  private nodeurl;
  private uploadurl;
  public siteurl;
  private userid;
  public userdetails;
  public genrelist;
  public genrelist1;
  public state;
  private musicians;
  private model;
  private dancer;
  private website;
  private experience;
  public imageserror:boolean;
  public selectedFile:File;
  public image;
  public exparr;
  public webarr;
  private usergenrelist: any;
  public showLoader: any;


  public isupdatedatamodal:any;
  public showpasswordmodal:any=0;
    public passwordForm:FormGroup;
    public passworderrormsg:any='';

  constructor(fb: FormBuilder,private _http: Http,private router: Router, private _commonservices : Commonservices,private route:ActivatedRoute, userdata: CookieService) {

    this.userdatanew = userdata;
    this.fb = fb;
    this.image = '';
    this.exparr = [];
    this.webarr = [];
    this.serverurl=_commonservices.url;
    this.nodeurl=_commonservices.nodeurl;
    this.siteurl=_commonservices.siteurl;
    this.uploadurl=_commonservices.uploadurl;
    this.imageserror = false;

    this.isupdatedatamodal= false;

    let link2=this.serverurl+'getusastates';

    this._http.get(link2)
        .subscribe(res => {
          let result1 = res.json();
          this.state = result1;
        }, error => {
          console.log("Oooops!");
        });


    this.route.params.subscribe(params=>{
      this.userid = params['id'];

      this.dataForm = this.fb.group({



        firstname:["",Validators.required],
        lastname:["",Validators.required],
        email: ["", CommunitysignupComponent.validateEmail],
        username: ["", CommunitysignupComponent.validateUsername],

        phone: ["", Validators.required],

        realname: ["",Validators.required],
        alias: ["",Validators.required],
        gender: ["",Validators.required],
        musicgenre: [""],
        dancergenre: [""],
        ethnicity: [""],
        ability: [""],
        bio: ["",Validators.required],
        city: ["",Validators.required],
        address: ["",Validators.required],
        state: ["",Validators.required],
        zip: ["",Validators.required],
        experience: this.fb.array([]),
        // experience: this.fb.array([this.createExp('')]),
        // website: this.fb.array([this.createWebsite('')]),
        website: this.fb.array([]),
      });


        this.passwordForm = this.fb.group({

            old_password: ["", Validators.required],
            _id:[""],
            password:['',Validators.required],
            confirmPassword:['',Validators.compose([Validators.required,
                this.equalToPass('password')
            ])],
        });
      var link =this.serverurl+'dashboard';
      var data = {_id: this.userid};

      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            this.showLoader = 1;
            if (result.status == 'success' && typeof(result.item) != 'undefined'){
              let userdata2 = result.item;

              this.userid = userdata2._id;
              this.userdetails = userdata2;
              this.musicians = userdata2.musicians;
              this.model = userdata2.model;
              this.dancer = userdata2.dancer;



              if(this.musicians == 1){
                let link=this.serverurl+'genrelist';
                let data = {'type':'active','musicians':1,'model':0,'dancer':0};

                this._http.post(link,data)
                    .subscribe(res => {
                      let result1 = res.json();
                      this.genrelist = result1.res;
                      //        to select the chosen value in music genre list
                      //starts here
                      if(this.musicians == 1 || this.dancer == 1){
                        let link=this.serverurl+'getusergenredetail';
                        let data = {'user_id':this.userid};

                        this._http.post(link,data)
                            .subscribe(res => {
                              let result1 = res.json();
                              this.usergenrelist = result1.item;
                             /* console.log('this.usergenrelist');
                              console.log(this.usergenrelist);*/
                              let musicgenarr=[];
                              let dancegenarr=[];
                              for(let x in this.usergenrelist){

                                console.log(this.usergenrelist[x]);
                                console.log($('select[name="musicgenre"]').find('option[ng-reflect-value="'+this.usergenrelist[x].genreid+'"]').length);
                                if($('select[name="musicgenre"]').find('option[ng-reflect-value="'+this.usergenrelist[x].genreid+'"]').length>0){
                                  musicgenarr.push(this.usergenrelist[x].genreid);
                                }
                                if($('select[name="dancergenre"]').find('option[ng-reflect-value="'+this.usergenrelist[x].genreid+'"]').length>0){
                                  dancegenarr.push(this.usergenrelist[x].genreid);
                                }
                                console.log($('select[name="musicgenre"]').find('option').length);
                              }
                              if(this.userdetails.musicians == 1 || this.userdetails.dancer == 1){
                                //this.dataForm.controls['ability'].setValidators(Validators.required);
                                this.dataForm.controls['musicgenre'].setValue(musicgenarr);
                                this.dataForm.controls['dancergenre'].setValue(dancegenarr);

                              }

                            }, error => {
                              console.log("Oooops!");
                            });
                      }


                      //ends here


                    }, error => {
                      console.log("Oooops!");
                    });
              }

              if(this.dancer == 1){
                let link=this.serverurl+'genrelist';
                let data = {'type':'active','musicians':0,'model':0,'dancer':1};

                this._http.post(link,data)
                    .subscribe(res => {
                      let result1 = res.json();
                      this.genrelist1 = result1.res;

                      if(this.musicians == 1 || this.dancer == 1){
                        let link=this.serverurl+'getusergenredetail';
                        let data = {'user_id':this.userid};

                        this._http.post(link,data)
                            .subscribe(res => {
                              let result1 = res.json();
                              this.usergenrelist = result1.item;
                              console.log('this.usergenrelist');
                              console.log(this.usergenrelist);
                              let musicgenarr=[];
                              let dancegenarr=[];
                              for(let x in this.usergenrelist){

                                console.log(this.usergenrelist[x]);
                                console.log($('select[name="musicgenre"]').find('option[ng-reflect-value="'+this.usergenrelist[x].genreid+'"]').length);
                                if($('select[name="musicgenre"]').find('option[ng-reflect-value="'+this.usergenrelist[x].genreid+'"]').length>0){
                                  musicgenarr.push(this.usergenrelist[x].genreid);
                                }
                                if($('select[name="dancergenre"]').find('option[ng-reflect-value="'+this.usergenrelist[x].genreid+'"]').length>0){
                                  dancegenarr.push(this.usergenrelist[x].genreid);
                                }
                                console.log($('select[name="musicgenre"]').find('option').length);
                              }
                              if(this.userdetails.musicians == 1 || this.userdetails.dancer == 1){
                                //this.dataForm.controls['ability'].setValidators(Validators.required);
                                this.dataForm.controls['musicgenre'].setValue(musicgenarr);
                                this.dataForm.controls['dancergenre'].setValue(dancegenarr);

                              }
                            }, error => {
                              console.log("Oooops!");
                            });
                      }
                    }, error => {
                      console.log("Oooops!");
                    });
              }

              this.showLoader = 0;


      if(this.userdetails.musicians == 1 || this.userdetails.dancer == 1){
                this.dataForm.controls['ability'].setValidators(Validators.required);
              }
              if(this.userdetails.musicians == 1){
                this.dataForm.controls['musicgenre'].setValidators(Validators.required);
              }
              if(this.userdetails.dancer == 1){
                this.dataForm.controls['dancergenre'].setValidators(Validators.required);
              }
              if(this.userdetails.model == 1){
                this.dataForm.controls['ethnicity'].setValidators(Validators.required);
              }

              this.dataForm.controls['firstname'].setValue(this.userdetails.firstname);
              this.dataForm.controls['lastname'].setValue(this.userdetails.lastname);
              this.dataForm.controls['email'].setValue(this.userdetails.email);
              this.dataForm.controls['username'].setValue(this.userdetails.username);
              this.dataForm.controls['phone'].setValue(this.userdetails.phone);
                this.image= this.userdetails.images;
              this.dataForm.controls['realname'].setValue(this.userdetails.firstname+' '+this.userdetails.lastname);
              this.dataForm.controls['gender'].setValue(this.userdetails.gender);
              this.dataForm.controls['alias'].setValue(this.userdetails.alias);
              this.dataForm.controls['bio'].setValue(this.userdetails.bio);
              this.dataForm.controls['city'].setValue(this.userdetails.city);
              // this.dataForm.controls['image'].setValue(this.userdetails.image);
              this.dataForm.controls['address'].setValue(this.userdetails.address);
              this.dataForm.controls['state'].setValue(this.userdetails.state);
              this.dataForm.controls['zip'].setValue(this.userdetails.zip);
              console.log('this.userdetails.website');
              console.log(this.userdetails.website);
              console.log('this.userdetails.website.length');
              console.log(this.userdetails.website.length);
                if(this.userdetails.website.length>0){

                    for( let i in this.userdetails.website){


                        this.addWebsite(this.userdetails.website[i]);

                    }
                }
                else
                {
                    this.addWebsite('');
                }

                console.log('this.userdetails.experience');
                console.log(this.userdetails.experience);
                console.log('this.userdetails.experience.length');
                console.log(this.userdetails.experience.length);
                if(this.userdetails.experience.length>0){

                    for( let i in this.userdetails.experience){

                        this.addExperience(this.userdetails.experience[i]);
                    }
                }
                else
                {
                    this.addExperience('');
                }



              if(this.userdetails.musicians == 1 || this.userdetails.dancer == 1){
                this.dataForm.controls['ability'].setValue(this.userdetails.ability);
              }

              if(this.userdetails.model == 1){
                this.dataForm.controls['ethnicity'].setValue(this.userdetails.ethnicity);
              }


            console.log('this.userdetails');
            console.log(this.userdetails);

            }
          },error => {
            console.log("Oooops!");
          });


    });
  }


    equalToPass(fieldname): ValidatorFn {                                 //password match custom function
        return (control: AbstractControl): { [key: string]: any } => {
            let input = control.value;
           /* console.log('control.value');
            console.log(control.value);
            console.log(control.root.value[fieldname]);*/
            let isValid = control.root.value[fieldname] == input;
           /* console.log('isValid');
            console.log(isValid);*/

            if (!isValid)
                return{
                    equalTo:true            //this value will be called
                };

        };

    }

  createWebsite(defaultVal): FormGroup {
    return this.fb.group({ name: [defaultVal,Validators.required] });
  }

  get websites(): FormGroup {
    return this.dataForm.get('website') as FormGroup;
  }
  addWebsite(defaultVal){
    this.website = this.dataForm.get('website') as FormArray;
    this.website.push(this.createWebsite(defaultVal));
  }

  delWebsite(index){
    const control = <FormArray>this.dataForm.controls['website'];
    if(control.length > 1)
      control.removeAt(index);
  }
  createExp(defaultVal): FormGroup {
    return this.fb.group({ name: [defaultVal,Validators.required] });
  }
  get experiences(): FormGroup {
    return this.dataForm.get('experience') as FormGroup;
  }
  addExperience(defaultVal){
    this.experience = this.dataForm.get('experience') as FormArray;
    this.experience.push(this.createExp(defaultVal));
  }

  delExperience(index){
    const control = <FormArray>this.dataForm.controls['experience'];
    if(control.length > 1)
      control.removeAt(index);
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

  ngOnInit() {
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];

    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile);

    this._http.post(this.uploadurl, uploadData)
        .subscribe(event => {
          var res = event.json();
          // console.log(res);

          if(res.error_code == 0){
            this.image = res.filename;




          }
        });
  }

  dosubmit(formval){
    this.markFormGroupTouched(this.dataForm);
    this.exparr = [];
    this.webarr = [];

   /* console.log('formval');
    console.log(formval);*/

    if (this.dataForm.valid ) {

      for(let n in formval.experience){
        this.exparr.push(formval.experience[n].name);
      }
      for(let n in formval.website){
        this.webarr.push(formval.website[n].name);
      }

      var link = this.serverurl+'editprofiledetails';
      var data = {
        _id: this.userid,
        firstname:formval.firstname,
        lastname:formval.lastname,
        email:formval.email,
        username:formval.username,
        phone:formval.phone,
        realname: formval.realname,
        alias: formval.alias,
        gender: formval.gender,
        musicgenre: formval.musicgenre,
        dancergenre: formval.dancergenre,
        ethnicity: formval.ethnicity,
        ability: formval.ability,
        bio: formval.bio,
        city: formval.city,
        address: formval.address,
        state: formval.state,
        zip: formval.zip,
        images: this.image,
        experience: this.exparr,
        website: this.webarr,
      };

      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            if(result.status=='success'){

                this.isupdatedatamodal= true;
                /*setTimeout(()=> {    //<<<---    using ()=> syntax
                    this.isupdatedatamodal = false;

                }, 4000);*/
              this.userdatanew.delete('affiliatename');
              this.userdatanew.delete('mediaid');
              this.userdatanew.delete('signupuserdata');
                // this.router.navigateByUrl('/profile');
            }
          }, error => {
            console.log("Oooops!");
          });
    }
  }


    passwordSubmit(formval){

        for(let i in this.passwordForm.controls){
            this.passwordForm.controls[i].markAsTouched();
            /*console.log(this.passwordForm.value);
            console.log(this.passwordForm.controls[i].valid);*/
        }

       /* console.log('this.passwordForm.valid');
        console.log(this.passwordForm.valid);*/
        let link = this.serverurl+'changepassword';

        let data={

            old_password:formval.old_password,
            password:formval.password,
            _id:this.userid

        };
        this._http.post(link ,data)
            .subscribe(res=>{

                let result:any= {};
                result= res.json();
                /*console.log(result);
                console.log(result.msg);*/
                this.passworderrormsg= result.msg;


            })





    }

    showPasswordModal(){

        this.showpasswordmodal = 1;

    }
    onHidden(){
        this.showpasswordmodal = 0
    }
}
