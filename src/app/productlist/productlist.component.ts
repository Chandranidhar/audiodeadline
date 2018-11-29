import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalService, BsModalRef} from "ngx-bootstrap";
import {Http} from "@angular/http";
import {Commonservices} from "../app.commonservices";

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
  providers: [Commonservices]
})
export class ProductlistComponent implements OnInit {
  modalRef: BsModalRef;
  public serverurl;
  public productlist;
  public idx;

  constructor(private _commonservices: Commonservices,private _http: Http,private modalService: BsModalService) {
    this.serverurl=_commonservices.url;
    this.getProductList();
  }

  ngOnInit() {
  }

  getProductList(){
    var link =this.serverurl+'productlist';
    var data = {};

    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();
          this.productlist = result.res;
        },error => {
          console.log("Oooops!");
        });

  }

  cngstatus(item){
    var status = 1;
    if(typeof (item.status) != 'undefined')
      status = 1-parseInt(item.status);
    var link =this.serverurl+'cngstatusproduct';
    var data = {_id:item._id,status : status,type:'user'};

    this._http.post(link, data)
        .subscribe(res => {
          item.status = status;
        },error => {
          console.log("Oooops!");
        });
  }


  openDelModal(template: TemplateRef<any>,item) {
    this.idx = this.productlist.indexOf(item);
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
  }

  confirm(): void {
    var link =this.serverurl+'deleteproduct';
    var data = {_id:this.productlist[this.idx]._id};

    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();
          if(result.status == 'success'){
            this.productlist.splice(this.idx, 1);
          }
          this.modalRef.hide();
        },error => {
          console.log("Oooops!");
          this.modalRef.hide();
        });
  }

  decline(): void {
    this.modalRef.hide();
  }


}
