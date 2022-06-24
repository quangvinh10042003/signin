import { Router } from '@angular/router';
import { AccountService } from './../../../services/account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  checkEye:boolean = true;
  emailInp:string='';
  passwordInp:string='';
  constructor(private accountService : AccountService, private router: Router) { }
  formAccount = new FormGroup({
    email: new FormControl(``, [
      Validators.required,
      Validators.pattern('^[a-zA-Z_.][a-zA-Z0-9]{0,10}@[a-z0-9]{4,10}\.[a-z]{2,5}$')
    ]),
    password: new FormControl(``, [
      Validators.required,
      Validators.minLength(8)
    ])
  })
  ngOnInit(): void {
    let data:any = sessionStorage.getItem('account');
    if(data){
      data = JSON.parse(data);
      this.emailInp = data.email;
      this.passwordInp = data.password;
    }
  }
  get form(): any {
    return this.formAccount.controls;
  }
  showEye(){
    let buttonEye = document.getElementById('showText') as HTMLDivElement | null;
    let inputPass = document.getElementById('password') as HTMLInputElement | null;
    if(inputPass?.value == ''){
      buttonEye?.classList.add('d-none');
    }else{
      buttonEye?.classList.remove('d-none');
    }
  }
  showPass(){
    let inputPass = document.getElementById('password') as HTMLInputElement | null;
    let eye = document.getElementById('eye') as HTMLDivElement | null;
    if(this.checkEye==true){
      inputPass?.setAttribute('type','text');
      eye?.setAttribute('class','fa-solid fa-eye-slash');
      this.checkEye = false;
    }else{
      inputPass?.setAttribute('type','password');
      eye?.setAttribute('class','fa-solid fa-eye');
      this.checkEye = true;
    }
  }
  onSubmit(){
    let MyData;
    this.accountService.getAll().subscribe((data:any)=>{
      MyData = data.find((item:any)=>{
        return this.emailInp === item.email && this.passwordInp === item.password;
      })
      if(MyData == null){
        let erorrDiv = document.getElementById('falseSignIn') as HTMLDivElement | null;
        erorrDiv?.classList.remove('d-none');
      }else{
        sessionStorage.removeItem('account');
        sessionStorage.setItem('accountSignIn', JSON.stringify(MyData));
        this.router.navigate(['']);
      }
    })
  }
}
