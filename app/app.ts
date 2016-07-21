import { Component, OnInit } from '@angular/core';
import { Platform, ionicBootstrap, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { LoginComponent } from './auth/login.component';
import { GeyserComponent } from './workers/geyser.component';

@Component({
    templateUrl: 'build/app.html',
})
export class MyApp implements OnInit{

  private rootPage:any;

  public authUser:any;
  public isAuthUser:boolean;

  constructor(private platform:Platform, private menu: MenuController/*, private nav: NavController*/) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      console.info('Platform Ready', platform);
      this.rootPage = GeyserComponent;
    });
  }

  ngOnInit(){

  }

  openGeyserModule(){
    this.rootPage = GeyserComponent;
    this.menu.close();
  }

  openAuthModule(){
    this.rootPage = LoginComponent;
    this.menu.close();
  }


}

ionicBootstrap(MyApp, []);
