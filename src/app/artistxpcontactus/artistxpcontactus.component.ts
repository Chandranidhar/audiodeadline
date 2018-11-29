import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-artistxpcontactus',
  templateUrl: './artistxpcontactus.component.html',
  styleUrls: ['./artistxpcontactus.component.css']
})
export class ArtistxpcontactusComponent implements OnInit {

  public dataForm: FormGroup;
  private fb;

  constructor(fb: FormBuilder) {


    this.fb = fb;
  }

  ngOnInit() {

    this.dataForm = this.fb.group({

      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", Validators.required],
      address: ["", Validators.required],
      message: ["", Validators.required],
    });
  }


  dosubmit(){

  }

}
