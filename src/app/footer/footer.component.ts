import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    public isLoggedIn:boolean;

  constructor(userdata: CookieService) {
      let userdata2: any;
      userdata2= userdata.get('userdetails');

      if (typeof (userdata2) == 'undefined' || userdata2 == ''){
          this.isLoggedIn = false;
      }else{
          this.isLoggedIn = true;
      }
  }

  ngOnInit() {
  }

}
