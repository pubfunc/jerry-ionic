import { Component, OnInit } from '@angular/core';
import { Platform, ionicBootstrap, NavController, MenuController } from 'ionic-angular';
import { ParticleService } from '../particle/particle.service';


@Component({
  templateUrl: 'build/auth/login.component.html',
  providers: [ ParticleService ]
})
export class LoginComponent  implements OnInit{

  public isAuthUser: boolean;

  public credentials = {
    username: '',
    password: ''
  };

  constructor(public menu: MenuController, private particle: ParticleService) {
    this.isAuthUser = false;
  }

  ngOnInit() {
    this.isAuthUser = this.particle.hasToken();
  }

  login() {

    this.particle.login( this.credentials ).then(
      data => {
        this.isAuthUser = true;
      },
      err => {

      }
    );
  }


}
