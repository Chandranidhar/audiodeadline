import {Component, OnInit, TemplateRef} from '@angular/core';
import {Commonservices} from '../app.commonservices';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-ambassadoragreement',
  templateUrl: './ambassadoragreement.component.html',
  styleUrls: ['./ambassadoragreement.component.css'],
    providers: [Commonservices]
})
export class AmbassadoragreementComponent implements OnInit {

    modalRef: BsModalRef;
    public serverurl;
    public userid;
    public fullname;
    public signval;
    public signval2;
    public currentdate;
    public error;
    private userdata: CookieService;

    constructor(private _commonservices : Commonservices,private _http: Http,private router: Router,private route:ActivatedRoute,private modalService: BsModalService, userdata: CookieService) {
        this.userdata = userdata;
        this.error = 0;
        this.signval = '';
        this.serverurl=_commonservices.url;
        this.currentdate = new Date();
        this.route.params.subscribe(params=>{
            this.userid = params['userid'];
            this.getUserDetails();
        });
    }

  ngOnInit() {
  }
    getUserDetails(){
        var link =this.serverurl+'dashboard';
        var data = {_id: this.userid};

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if (result.status == 'success' && typeof(result.item) != 'undefined'){
                    let userdet = result.item;
                    this.fullname = userdet.firstname+' '+userdet.lastname;
                    this.signval2 = userdet.firstname+' '+userdet.lastname;
                }
            },error => {
                console.log("Oooops!");
            });

    }

    openSignModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-md'});
    }

    onKey(ev){
        this.signval2 = ev.target.value;
    }

    cancel(){
        this.modalRef.hide();
    }
    agree(){
        this.signval = this.signval2;
        this.modalRef.hide();
    }

    contractagrrement(){
        this.error = 0;
        if(this.signval == ''){
            this.error = 1;
            return false;
        }else{
            var link =this.serverurl+'contractagrrement';
            var data = {_id: this.userid,sign: this.signval };

            this._http.post(link, data)
                .subscribe(res => {
                    var result = res.json();
                    if(result.status=='success'){
                        this.userdata.set('userdetails', JSON.stringify(result.msg));
                        this.router.navigateByUrl('/dashboard');
                    }
                },error => {
                    console.log("Oooops!");
                });
        }
    }

}
