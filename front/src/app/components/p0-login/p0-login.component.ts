import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-p0-login',
  templateUrl: './p0-login.component.html',
  styleUrls: ['./p0-login.component.css']
})
export class P0LoginComponent implements OnInit {

  id_ldap = "";
  pwd_ldap = "";


  constructor(public userService: UserService, public route: Router) { }

  ngOnInit(): void {
  }


  login() {
    if (!this.id_ldap){
      alert("veuillez saisie votre email!")
    }else if (!this.pwd_ldap){
      alert("veuillez saisie votre mot de passe!")
    } else {
      let data = { username: this.id_ldap, password: this.pwd_ldap };
      localStorage.setItem('token', "HQK64Gdgd77hhzyLKHKFS")
      this.route.navigate(['home']);
    }

    // this.userService.login(data).subscribe((res) => {
    //   localStorage.setItem('token', res['token'])
    //   this.route.navigate(['home']);
    // }, err => this.showError = true);
  }

}
