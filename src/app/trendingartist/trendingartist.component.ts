import { Component, OnInit } from '@angular/core';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
declare var $:any;
@Component({
  selector: 'app-trendingartist',
  templateUrl: './trendingartist.component.html',
  styleUrls: ['./trendingartist.component.css'],
  providers: [Commonservices]
})

export class TrendingartistComponent implements OnInit {
    public serverurl;
    public userlist;
    public showLoader;
    public isGenreModalShown = 0;
    public musicgenrearray=[];
    public dancegenrearray=[];
    public selectedgenrearray=[];
    public statearray=[];
    public selectedstatearray=[];
    public isStateModalShown = 0;
    public cityForm: FormGroup;
    public zipcodeForm: FormGroup;
    public isCityModalShown = 0;
    public isZipcodeModalShown = 0;
    public fb;
    public cityarray=[];
    public selectedcityarray=[];
    public zipcodearray=[];
    public selectedzipcodearray=[];
    public selectedstatesearcharray=[];
    public selectedcitysearcharray=[];
    public selectedzipsearcharray=[];
    public commonsearcharray=[];

    constructor( private _commonservices: Commonservices, private _http: Http, fb:FormBuilder) {

        this.serverurl=_commonservices.url;

        this.showLoader = 0;
        this.fb=fb;


    }

    ngOnInit() {
        this.getartistlist();
        this. getgenrelist1();
        this.  getstatelist();

        this.cityForm = this.fb.group({

            cityname: ["", Validators.required]

        });
        this.zipcodeForm = this.fb.group({

            zipcode: ["", Validators.required]

        });

    }

    getgenrelist1(){

        var link2 = this.serverurl+'genretrendinglist';
        this._http.get(link2)
            .subscribe(val=> {

                var result = val.json();
               /* console.log('result.res');
                console.log(result.res);
                console.log('result.res.type');
                console.log(result.res[0].type);*/
                for(let i in result.res){

                    if(result.res[i].type =="Dancer"){

                        this.dancegenrearray.push(result.res[i]);
                       /* console.log('this.dancegenrearray');
                        console.log(this.dancegenrearray);*/
                    }

                    if(result.res[i].type =="Musician"){

                        this.musicgenrearray.push(result.res[i]);
                      /*  console.log('this.musicgenrearray');
                        console.log(this.musicgenrearray);*/

                    }
                }


            },error => {

                console.log('Error!!!');
            })
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
        this.selectedstatesearcharray.push(val.abbreviation);
        console.log(this.selectedstatesearcharray);
    }
    removeselectedstate(vals:any){

        let index = this.selectedstatearray.indexOf(vals);
        console.log('index');
        console.log(index);
        this.selectedstatearray.splice(index,1);
        this.selectedstatesearcharray.splice(index,1);
        this.getSearchedValueByQuery();

    }
    selectedgenre(valm:any){
        console.log('valm');
        console.log(valm);
        this.selectedgenrearray.push(valm);

        }

    removeselectedgenre(vals:any){


       /* console.log('vals');
        console.log(vals);*/
        let index = this.selectedgenrearray.indexOf(vals);
       /* console.log('index');
        console.log(index);*/
        this.selectedgenrearray.splice(index,1);
       /* this.selectedgenrearray.splice(vals);

        console.log('vals..');
        console.log(vals);*/
        /*console.log('vals..');
        console.log(vals);*/
    }




    getartistlist(){
        this.showLoader = 1;
        var link= this.serverurl+'trendingArtistList';
        this._http.get(link)
            .subscribe(res => {
                var result = res.json();

                this.userlist = result.id;
                console.log('userlist');
                console.log(this.userlist);
                this.showLoader = 0;
               /* console.log("result");
                console.log(result);
                console.log('userlist');
                console.log(this.userlist);
                console.log(this.userlist[1].fullname);
                console.log(this.userlist[1].musicians);*/

            },error => {
                console.log("Oooops!");
            });

        // if(this.userlist.musicians == 1){
        //         let link=this.serverurl+'genrelist';
        //         let data = {'type':'active','musicians':1,'model':0,'dancer':0};
        //
        //         this._http.post(link,data)
        //             .subscribe(res => {
        //                 let result1 = res.json();
        //
        //                 this.genrelist = result1.res;
        //                 console.log('this.genrelist');
        //                 console.log(this.genrelist);
        //             }, error => {
        //                 console.log("Oooops!");
        //             });
        //     }

            // if(this.dancer == 1){
            //     let link=this.serverurl+'genrelist';
            //     let data = {'type':'active','musicians':0,'model':0,'dancer':1};
            //
            //     this._http.post(link,data)
            //         .subscribe(res => {
            //             let result1 = res.json();
            //             this.genrelist1 = result1.res;
            //         }, error => {
            //             console.log("Oooops!");
            //         });
            // }
    }




    showgenremodal(){

        this.isGenreModalShown = 1;
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
            this.selectedcitysearcharray.push(formval.cityname);
            console.log(' this.selectedcitysearcharray');
            console.log( this.selectedcitysearcharray);
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
            this.selectedzipsearcharray.push(formval.zipcode);
            console.log(' this.selectedzipsearcharray');
            console.log( this.selectedzipsearcharray);
            this.zipcodeForm.reset();

        }
    }

    removeselectedcity(vals:any){


        let index = this.selectedcityarray.indexOf(vals);
        this.selectedcityarray.splice(index,1);
        this.selectedcitysearcharray.splice(index,1);
        console.log(' this.selectedcityarray');
        console.log( this.selectedcityarray);
        this.getSearchedValueByQuery();

    }
    removeselectedzip(vals:any){


        let index = this.selectedzipcodearray.indexOf(vals);
        this.selectedzipcodearray.splice(index,1);
        this.selectedzipsearcharray.splice(index,1);
        console.log(' this.selectedzipcodearray');
        console.log( this.selectedzipcodearray);
        this.getSearchedValueByQuery();

    }



    /*ngAfterViewChecked(){

        //setTimeout(()=> {    //<<<---    using ()=> syntax
            $('.gn5').each(function () {
                let htmlval=$(this).find('.genretextintrending').html();
                console.log('htmlval');
                console.log(htmlval);
                console.log($(this).html());
                console.log($(this).find('.genretextintrending').length);
                //$(this).html(htmlval.substr(0,(htmlval.length-1)));
            });
        //}, 500);


       /!* let htmlval=$('.genretextintrending').html();
        console.log('htmlval');
        console.log(htmlval);*!/
        //$('.genretextintrending').html(htmlval.substr(0,(htmlval.length-1)));
    }*/

    getgenrelist(item){
        // console.log('genre text called');
        if (item.length==0)
        return 'N/A';
        else {
            let genretext='';
            for(let x in item){

                for(let y in item[x].genredetail){

                    genretext+=item[x].genredetail[y]['genrename']+',';
                }
                /*console.log('genretext');
                console.log(genretext);*/
            }
            genretext=genretext.substr(0,genretext.length-1);
            return genretext;
        }
    }


    imgPath(img){

        return 'https://audiodeadline.com/nodeserver/uploads/'+img;
    }

    getSearchedValueByQuery(){

        let link = this.serverurl+'getsearchedvalue';
        let data = {'state':this.selectedstatesearcharray,'zip':this.selectedzipsearcharray,'city':this.selectedcitysearcharray,'fan':0};
        this._http.post(link,data)
            .subscribe(res=>{

                let result:any={};
                result= res.json();
                console.log('result');
                console.log(result);
                this.commonsearcharray=result.item;
                // this.commonsearcharray.push(result);
                console.log('this.commonsearcharray');
                console.log(this.commonsearcharray);

                /*this.isStateModalShown = 0;
                this.isCityModalShown = 0;
                this.isZipcodeModalShown = 0;
*/
            })
    }

    onHidden(){
        this.isCityModalShown = 0;
        this.isZipcodeModalShown = 0;
        this.isGenreModalShown = 0;
        this.isStateModalShown = 0;


    }

}
