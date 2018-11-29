import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Commonservices} from '../app.commonservices';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {DomSanitizer} from '@angular/platform-browser';
import {CookieService} from 'ngx-cookie-service';

@Component({
    selector: 'app-blogadd',
    templateUrl: './blogadd.component.html',
    styleUrls: ['./blogadd.component.css'],
    providers: [Commonservices]
})

export class BlogaddComponent implements OnInit {

  public dataForm: FormGroup;
  public fb;
  public serverurl;
  public siteurl;
  public nodeurl;
  public userid;
  public is_error;
  public videolink;
  public videolinkerror:boolean;
  public imageserror:boolean;
  public videos:any;
  public images:any;
  public selectedFile:File;

  constructor(fb: FormBuilder,private _commonservices : Commonservices,private _http: Http,private router: Router,private sanitizer: DomSanitizer, userdata: CookieService) {
    this.fb = fb;
    this.videos = [];
    this.images = [];
    this.videolinkerror = false;
    this.imageserror = false;
    this.serverurl=_commonservices.url;
    this.siteurl=_commonservices.siteurl;
    this.nodeurl=_commonservices.nodeurl;
      let userdata2: any;
      userdata2= userdata.get('userdetails');

      if (typeof (userdata2) == 'undefined' || userdata2 == ''){
          this.router.navigateByUrl('/login');
      }else{
          userdata2 =JSON.parse(userdata2);
          this.userid = userdata2._id;
      }
  }

  ngOnInit(){
    this.dataForm = this.fb.group({
        title: ["", Validators.required],
        description: ["", Validators.required],
        videolink: [""]
    });
  }

  getYTURL(item){
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+item+'?rel=0&amp;showinfo=0');
  }

  addYTvideo(){
      this.videolinkerror = false;
      var yt_regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      var ytsaerch = this.dataForm.controls['videolink'].value;
      if(ytsaerch != ''){
          if(typeof (ytsaerch.match(yt_regex)) != 'undefined' &&  (ytsaerch.match(yt_regex)) && typeof (ytsaerch.match(yt_regex)[1]) != 'undefined'){
              var videoId =ytsaerch.match(yt_regex)[1];
              this.videos.push(videoId);
              this.dataForm.controls['videolink'].setValue('');
          }else{
              this.videolinkerror = true;
          }
      }else{
          this.videolinkerror = true;
      }
  }

    onFileChanged(event) {
        this.imageserror = false;
        this.selectedFile = event.target.files[0];

        const uploadData = new FormData();
        uploadData.append('file', this.selectedFile);

        this._http.post(this.nodeurl+'uploads', uploadData)
            .subscribe(event => {
                var res = event.json();
                if(res.error_code == 0){
                    this.images.push(res.filename);
                }else{
                    this.imageserror = true;
                }
            });
    }

  dosubmit(formval){
    let x: any;
    for (x in this.dataForm.controls){
      this.dataForm.controls[x].markAsTouched();
    }

    if (this.dataForm.valid){
        var link = this.serverurl+'addblog';
        var data = {
            title: formval.title,
            description: formval.description,
            videos: this.videos,
            images: this.images,
            userid: this.userid
        };

        this._http.post(link, data)
            .subscribe(res => {
                var result = res.json();
                if(result.status=='success'){
                    this.router.navigate(['/blog-list']);
                }
            }, error => {
                console.log("Oooops!");
            });
    }
  }
}
