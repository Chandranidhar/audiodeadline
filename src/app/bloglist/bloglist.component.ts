import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Http} from '@angular/http';
import {Commonservices} from '../app.commonservices';
import {$} from 'protractor';


@Component({
  selector: 'app-bloglist',
  templateUrl: './bloglist.component.html',
  styleUrls: ['./bloglist.component.css'],
    providers: [Commonservices]
})
export class BloglistComponent implements OnInit {

    modalRef: BsModalRef;
    public serverurl;
    public bloglist;
    public idx;
    public searchText;


    constructor(private _commonservices: Commonservices,private _http: Http,private modalService: BsModalService) {
        this.serverurl=_commonservices.url;
        this.getBlogList();
    }

  ngOnInit() {
  }

    getBlogList(){
        var link =this.serverurl+'bloglist';
        var data = {};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                this.bloglist = result.res;
            },error => {
                console.log("Oooops!");
            });
    }
    cngstatus(item){
        var status = 1;
        if(typeof (item.status) != 'undefined')
            status = 1-parseInt(item.status);
        var link =this.serverurl+'cngstatus';
        var data = {_id:item._id,status : status,type:'blog'};

        this._http.post(link, data)
            .subscribe(res => {
                item.status = status;
            },error => {
                console.log("Oooops!");
            });
    }

    openDelModal(template: TemplateRef<any>,item) {
        this.idx = this.bloglist.indexOf(item);
        this.modalRef = this.modalService.show(template, {class: 'modal-md'});
    }

    confirm(): void {
        var link =this.serverurl+'deleteblog';
        var data = {_id:this.bloglist[this.idx]._id};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if(result.status == 'success'){
                    this.bloglist.splice(this.idx, 1);
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
