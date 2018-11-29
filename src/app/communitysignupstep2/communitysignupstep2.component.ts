import { Component, OnInit } from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommunitysignupComponent} from '../communitysignup/communitysignup.component';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
    selector: 'app-communitysignupstep2',
    templateUrl: './communitysignupstep2.component.html',
    styleUrls: ['./communitysignupstep2.component.css'],
    providers: [Commonservices]
})

export class Communitysignupstep2Component implements OnInit {
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

      let link2=this.serverurl+'getusastates';

      this._http.get(link2)
          .subscribe(res => {
              let result1 = res.json();
              this.state = result1;
          }, error => {
              console.log("Oooops!");
          });


      this.route.params.subscribe(params=>{
          this.userid = params['uid'];

          this.dataForm = this.fb.group({
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
              experience: this.fb.array([this.createExp('')]),
              website: this.fb.array([this.createWebsite('')]),
          });

          var link =this.serverurl+'dashboard';
          var data = {_id: this.userid};

          this._http.post(link, data)
              .subscribe(res => {
                  var result = res.json();
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
                              }, error => {
                                  console.log("Oooops!");
                              });
                      }

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
                      this.dataForm.controls['realname'].setValue(this.userdetails.firstname+' '+this.userdetails.lastname);
                      this.dataForm.controls['gender'].setValue(this.userdetails.gender);

                  }
              },error => {
                  console.log("Oooops!");
              });


      });


    /*let userdata2: any;
    userdata2= userdata.get('signupuserdata');


    if (typeof (userdata2) == 'undefined' || userdata2 == ''){
      this.router.navigateByUrl('/community-signup');
    }else{
      this.dataForm = this.fb.group({
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
          experience: this.fb.array([this.createExp('')]),
          website: this.fb.array([this.createWebsite('')]),
      });

      userdata2 =JSON.parse(userdata2);
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
                }, error => {
                    console.log("Oooops!");
                });
        }


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
        this.dataForm.controls['realname'].setValue(this.userdetails.firstname+' '+this.userdetails.lastname);
        this.dataForm.controls['gender'].setValue(this.userdetails.gender);
    }*/
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
                console.log(res);

                if(res.error_code == 0){
                    this.image = res.filename;




                }
            });
    }

  dosubmit(formval){
      this.markFormGroupTouched(this.dataForm);
      this.exparr = [];
      this.webarr = [];

    console.log('formval');
    console.log(formval);

    if (this.dataForm.valid ) {

        for(let n in formval.experience){
            this.exparr.push(formval.experience[n].name);
        }
        for(let n in formval.website){
            this.webarr.push(formval.website[n].name);
        }

        var link = this.serverurl+'signup2';
        var data = {
            _id: this.userid,
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
                    this.userdatanew.delete('affiliatename');
                    this.userdatanew.delete('mediaid');
                    this.userdatanew.delete('signupuserdata');
                    if(this.userdetails.signupaffiliate == 1){
                        this.router.navigateByUrl('/agreement/'+this.userdetails._id);
                    }else{
                        this.router.navigateByUrl('/');
                    }
                }
            }, error => {
                console.log("Oooops!");
            });
    }
  }

}
