import { ModalController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { Platform, ionicBootstrap, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { DashboardComponent } from './views/dashboard/dashboard.component';
import { GeyserComponent } from './views/geyser/geyser.component';
import { Geyser } from './views/geyser/geyser';
import { ParticleService } from './particle/particle.service';

@Component({
    templateUrl: 'build/app.html',
    providers: [ ModalController ]
})
export class JerryApp implements OnInit{

  private rootPage:any;

  public authUser:any;
  public isAuthUser:boolean;

  constructor(
    private platform:Platform,
    private modal: ModalController
    ) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      console.info('Platform Ready', platform);
      this.rootPage = DashboardComponent;
    });
  }

  ngOnInit(){

  }


}

ionicBootstrap(JerryApp, [Geyser, ParticleService]);
