import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalService, BsModalRef} from "ngx-bootstrap";
import {Commonservices} from "../app.commonservices";
import {Router} from "@angular/router";
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-artistheader',
  templateUrl: './artistheader.component.html',
  styleUrls: ['./artistheader.component.css'],
  providers: [Commonservices]
})
export class ArtistheaderComponent implements OnInit {
  modalRef: BsModalRef;
  commonServices:Commonservices;
  private cookieData:CookieService;


  public liWidth:any;
  public liWidth2:any;

  public user_id;
  private userdata;
  constructor(private modalService: BsModalService,private router: Router, private _commonservices: Commonservices,userdata: CookieService) {

    this.commonServices = _commonservices;
    this.userdata = userdata;
    this.user_id = userdata.get('user_id');
    console.log('this.user_id');
    console.log(this.user_id);
    if(this.user_id=='' )
    this.liWidth = '16.46%';
    else
      this.liWidth='16.46%';

    if(this.user_id=='' )
      this.liWidth2='16.46%';
    else
      this.liWidth2 = '16.46%';

  }



  ngOnInit() {

  }

  showPopup(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  closep(){
    this.modalRef.hide();
  }

  gotoSignUp(){
    this.modalRef.hide();
    this.router.navigateByUrl('/signup');
  }
  // logout(){
  //   this.cookieData.deleteAll();
  //   this.router.navigateByUrl('/login');
  // }

}
