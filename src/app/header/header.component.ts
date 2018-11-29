import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CookieService} from 'ngx-cookie-service';

declare  var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    modalRef: BsModalRef;
    public isLoggedIn:boolean;

  constructor(private modalService: BsModalService, userdata: CookieService) {
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

    showvideo(template: TemplateRef<any>){
        this.modalRef = this.modalService.show(template, {class: 'modal-md'});
    }

}
