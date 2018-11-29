import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

declare const FB: any;

@Component({
  selector: 'app-sponsorlist',
  templateUrl: './sponsorlist.component.html',
  styleUrls: ['./sponsorlist.component.css']
})
export class SponsorlistComponent implements OnInit {

    coockieData:CookieService;
    public username;
    public userroles;

  constructor( userdata: CookieService,private router: Router) {
      this.coockieData= userdata;
      this.username = '';
      this.userroles = [];
      let userdata2: any;
      userdata2= userdata.get('userdetails');

      if (typeof (userdata2) == 'undefined' || userdata2 == ''){
          this.router.navigateByUrl('/login');
      }else {
          userdata2 = JSON.parse(userdata2);
          if (userdata2.admin == 1) {
              this.userroles.push('admin');
          }
          if (userdata2.signupaffiliate == 1) {
              this.userroles.push('affiliate');
              this.username = 'affiliate-'+userdata2.username;
          }
          if (userdata2.ambassador == 1) {
              this.userroles.push('ambassador');
          }
          if (userdata2.dancer == 1) {
              this.userroles.push('dancer');
          }
          if (userdata2.model == 1) {
              this.userroles.push('model');
          }
          if (userdata2.musicians == 1) {
              this.userroles.push('musicians');
          }
          if (userdata2.fan == 1) {
              this.userroles.push('fan');
          }
      }
  }

  ngOnInit() {
  }
    postinfb(username,media_id){
        var link = 'http://audiodeadline.com/sharetool.php?type=ticketsale&media_id='+media_id+'&username='+username+'&utype=sponsor';

        FB.ui({
            method: 'feed',
            link: link,
            name: " ",
            caption:" ",
            description: " "
        },function(response){
            console.log(response);
        });
    }

    copyText(val: string){
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

}
