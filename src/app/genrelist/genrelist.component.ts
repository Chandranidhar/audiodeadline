import {Component, OnInit, TemplateRef} from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Http} from '@angular/http';

@Component({
  selector: 'app-genrelist',
  templateUrl: './genrelist.component.html',
  styleUrls: ['./genrelist.component.css'],
    providers: [Commonservices]
})
export class GenrelistComponent implements OnInit {
    modalRef: BsModalRef;
    public serverurl;
    public genrelist;
    public idx;

  constructor(private _commonservices: Commonservices,private _http: Http,private modalService: BsModalService) {
      this.serverurl=_commonservices.url;
      this.getGenreList();
  }

  ngOnInit() {
  }

    getGenreList(){
        var link =this.serverurl+'genrelist';
        var data = {};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                this.genrelist = result.res;
            },error => {
                console.log("Oooops!");
            });

    }


    cngstatus(item){
        var status = 1;
        if(typeof (item.status) != 'undefined')
            status = 1-parseInt(item.status);
        var link =this.serverurl+'cngstatusgenre';
        var data = {_id:item._id,status : status,type:'user'};

        this._http.post(link, data)
            .subscribe(res => {
                item.status = status;
            },error => {
                console.log("Oooops!");
            });
    }

    openDelModal(template: TemplateRef<any>,item) {
        this.idx = this.genrelist.indexOf(item);
        this.modalRef = this.modalService.show(template, {class: 'modal-md'});
    }

    confirm(): void {
        var link =this.serverurl+'deletegenre';
        var data = {_id:this.genrelist[this.idx]._id};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if(result.status == 'success'){
                    this.genrelist.splice(this.idx, 1);
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
