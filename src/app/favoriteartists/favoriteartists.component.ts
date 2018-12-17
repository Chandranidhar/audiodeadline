import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Commonservices} from "../app.commonservices";
import {Http} from "@angular/http";
import {ActivatedRoute } from '@angular/router';
declare var $:any;
declare var moment: any;

@Component({
  selector: 'app-favoriteartists',
  templateUrl: './favoriteartists.component.html',
  styleUrls: ['./favoriteartists.component.css'],
  providers: [Commonservices]
})
export class FavoriteartistsComponent implements OnInit {

  public userdata: CookieService;
  public siteurl;
  public serverurl;
  public user_name;
  public user_id;
  public fan;
  public favoritesarray:any=[];

  constructor(userdata: CookieService, private activeRoute: ActivatedRoute,private _http: Http,  private _commonservices: Commonservices) {

    this.userdata = userdata;
    this.serverurl=_commonservices.url;
    this.siteurl=_commonservices.siteurl;

    if(this.userdata.get('user_id')!=null && this.userdata.get('user_id')!='')

    this.user_name = this.userdata.get('user_name');
    this.user_id = this.userdata.get('user_id');

  }

  ngOnInit() {

    this.friendslist();
  }


  friendslist(){
    let link = this.serverurl+'getuserdetailsbyfriendtype';
    let data ={ 'user_id': this.user_id};
    this._http.post(link ,data)
        .subscribe(res=>{

          let result:any={};
          result= res.json();
          if(result.status=='success'){

            /*console.log('result.item...................');
             console.log(result.item);*/
            let items = result.item;

            for(let i in items){
              if(items[i].friend_by == this.user_id){
                /*console.log('items[i].userdata[0].fan');
                 console.log(items[i].userdata[0].fan);*/
                if(items[i].userdata[0].fan == 0){

                  this.favoritesarray.push(items[i].userdata[0]);
                }

              }
              if(items[i].friend_id == this.user_id){
                /* console.log('items[i].userdatafrom[0].fan');
                 console.log(items[i].userdatafrom[0].fan);*/
                if(items[i].userdatafrom[0].fan == 0){

                  this.favoritesarray.push(items[i].userdatafrom[0]);
                }

              }

            }
             /*console.log('this.favoritesarray');
             console.log(this.favoritesarray);*/
          }
        })


  }

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

}
