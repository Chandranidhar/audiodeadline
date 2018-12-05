import { Component, OnInit } from '@angular/core';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
declare var $:any;
declare var moment: any;


@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
  providers: [Commonservices]
})
export class CommunityComponent implements OnInit {

  public serverurl;
  public userlist;
  public showLoader;
  public fb;
  public statearray=[];
  public selectedstatearray=[];
  public isStateModalShown = 0;
  public cityForm: FormGroup;
  public isCityModalShown = 0;
  public cityarray=[];
  public selectedcityarray=[];
  public zipcodeForm: FormGroup;
  public isZipcodeModalShown = 0;
  public zipcodearray=[];
  public selectedzipcodearray=[];

  constructor( private _commonservices: Commonservices, private _http: Http, fb:FormBuilder) {


    this.serverurl=_commonservices.url;

    this.showLoader = 0;
    this.fb=fb;
  }

  ngOnInit() {

    this.getfanlist();
    this.getstatelist();

    this.cityForm = this.fb.group({

      cityname: ["", Validators.required]

    });
    this.zipcodeForm = this.fb.group({

      zipcode: ["", Validators.required]

    });
  }


  getfanlist(){
    this.showLoader = 1;
    let link= this.serverurl+'userfanlist';
    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
          console.log("result");
          console.log(result);
          this.userlist = result.item;
          console.log('userlist');
          console.log(this.userlist);
          this.showLoader = 0;

          /*
           console.log('userlist');
           console.log(this.userlist);
           console.log(this.userlist[1].fullname);
           console.log(this.userlist[1].musicians);*/

        },error => {
          console.log("Oooops!");
        });

  }


  imgPath(img){


    return 'https://audiodeadline.com/nodeserver/uploads/'+img;
  }

  unixtodatetimeConverter(flag,UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = (months[a.getMonth()]);
    if(month.toString().length==1) month='0'+month;
    var date = (a.getDate());
    if(date<10) var dates='0'+date.toString();
    else var dates=date.toString();
    var hours = (a.getHours());
    if(hours<10) var hour='0'+hours;
    else var hour=hours.toString();
    var min = (a.getMinutes());
    if(min.toString().length==1) var mins='0'+min;
    else var mins=min.toString();
    var sec = (a.getSeconds());
    if(sec.toString().length==1) var secs='0'+sec;
    else var secs=sec.toString();
    var ampm = ((hours) >= 12) ? "PM" : "AM";
    // if( flag==0)var time = month + '-' + dates + '-'+year ;
    if( flag==0)var time = dates + '-' + month + '-'+year ;
    if( flag==1)var time  =  hour + ':' + mins + ':' + secs+ " "+ampm ;
    return time;
  }

  getstatelist(){

    let link = this.serverurl+'getusastates';
    this._http.get(link)
        .subscribe(val => {

          var result = val.json();
          /* console.log('result');
           console.log('result[0].name');
           console.log(result[0].name);*/
          for (let i in result) {
            if (result.length > 0) {

              this.statearray.push(result[i]);
              // console.log(this.statearray);
            }
            /*this.cityarray = result.*/
          }
        })
  }

  selectedstate(val:any){


    console.log('val');
    console.log(val);
    this.selectedstatearray.push(val);
  }

  removeselectedstate(vals:any){

    let index = this.selectedstatearray.indexOf(vals);
    console.log('index');
    console.log(index);
    this.selectedstatearray.splice(index,1);

  }

  showstatemodal(){

    this.isStateModalShown = 1;
  }
  showcitymodal(){

    this.isCityModalShown = 1;
  }

  showzipmodal(){

    this.isZipcodeModalShown = 1;
  }

  citysubmit(formval){

    for (let x in this.cityForm.controls) {

      this.cityForm.controls[x].markAsTouched();


    }
    console.log('this.cityForm.valid');
    console.log(this.cityForm.valid);
    if(this.cityForm.valid){

      this.cityarray.push(formval);
      console.log('this.cityarray');
      console.log(this.cityarray);
      this.selectedcityarray.push(formval);
      console.log(' this.selectedcityarray');
      console.log( this.selectedcityarray);
      this.cityForm.reset();

    }
  }

  ZipCodeSubmit(formval){

    for (let x in this.zipcodeForm.controls) {

      this.zipcodeForm.controls[x].markAsTouched();


    }
    console.log('this.zipcodeForm.valid');
    console.log(this.zipcodeForm.valid);
    if(this.zipcodeForm.valid){

      this.zipcodearray.push(formval);
      console.log('this.zipcodearray');
      console.log(this.zipcodearray);
      this.selectedzipcodearray.push(formval);
      console.log(' this.selectedzipcodearray');
      console.log( this.selectedzipcodearray);
      this.zipcodeForm.reset();

    }
  }

  removeselectedcity(vals:any){


    let index = this.selectedcityarray.indexOf(vals);
    this.selectedcityarray.splice(index,1);
    console.log(' this.selectedcityarray');
    console.log( this.selectedcityarray);

  }
  removeselectedzip(vals:any){


    let index = this.selectedzipcodearray.indexOf(vals);
    this.selectedzipcodearray.splice(index,1);
    console.log(' this.selectedzipcodearray');
    console.log( this.selectedzipcodearray);

  }

  onHidden(){
    this.isCityModalShown = 0;
    this.isZipcodeModalShown = 0;
    this.isStateModalShown = 0;


  }

}
