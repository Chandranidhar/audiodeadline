import {Component, OnInit, TemplateRef} from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {Http} from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-adminlist',
    templateUrl: './adminlist.component.html',
    styleUrls: ['./adminlist.component.css'],
    providers: [Commonservices]
})
export class AdminlistComponent implements OnInit {

    modalRef: BsModalRef;
    public serverurl;
    public userlist;
    public searchText;
    public idx;

    constructor(private _commonservices: Commonservices,private _http: Http,private modalService: BsModalService) {
        this.serverurl=_commonservices.url;
        this.getUserList();
    }

    ngOnInit() {

    }

    getUserList(){
        var link =this.serverurl+'adminlist';
        var data = {type : 'admin'};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                this.userlist = result.res;
                },error => {
                console.log("Oooops!");
            });
    }

    cngstatus(item){
        var status = 1;
        if(typeof (item.status) != 'undefined')
            status = 1-parseInt(item.status);
        var link =this.serverurl+'cngstatus';
        var data = {_id:item._id,status : status,type:'user'};

        this._http.post(link, data)
            .subscribe(res => {
                item.status = status;
            },error => {
                console.log("Oooops!");
            });
    }

    openDelModal(template: TemplateRef<any>,item) {
        this.idx = this.userlist.indexOf(item);
        this.modalRef = this.modalService.show(template, {class: 'modal-md'});
    }

    confirm(): void {
        var link =this.serverurl+'deleteuser';
        var data = {_id:this.userlist[this.idx]._id};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if(result.status == 'success'){
                    this.userlist.splice(this.idx, 1);
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
