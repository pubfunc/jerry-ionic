import { Component, OnInit } from '@angular/core';
import { Platform, ionicBootstrap, NavController, MenuController, ToastController } from 'ionic-angular';
import { ParticleService } from '../../particle/particle.service';

import { GeyserComponent } from '../geyser/geyser.component';

@Component({
  templateUrl: 'build/views/dashboard/dashboard.component.html',
  providers: [ ParticleService ]
})
export class DashboardComponent  implements OnInit{

  public isAuthUser: boolean;

  public credentials = {
    username: '',
    password: ''
  };

  public devices: Array<any>;
  public defaultDevice: string = null;

  constructor(
    private particle: ParticleService,
    private toast: ToastController,
    private nav: NavController
    ) {
    this.isAuthUser = false;
    this.defaultDevice = particle.getDefaultDevice();
  }

  ngOnInit() {
    this.isAuthUser = this.particle.hasToken();
    this.refreshDeviceList();
  }

  login() {

    this.particle.login( this.credentials ).then(
      data => {
        this.isAuthUser = true;
      },
      err => {
        console.error('Particle login fail', err);
        this.toastBadCredentials();
      }
    );
  }

  setDefault(device : any){
    this.particle.setDefaultDevice(device.id);
    this.toastDefaultSet();
    this.defaultDevice = device.id;
  }

  refreshDeviceList(){
    this.particle.listDevices().then(
      devices => {
        this.devices = devices;
      },
      err => {
        console.log('device-list err', err);        
      }
    );
  }

  toastBadCredentials(){

  }

  toastLoginSuccess(){

  }

  toastDefaultSet(){
    this.toast.create({
      message: "Default device set",
      duration: 3000
    }).present();
  }

  openGeyser(){
    this.nav.push(GeyserComponent);
  }


}
