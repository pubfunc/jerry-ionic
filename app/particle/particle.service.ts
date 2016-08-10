import { Injectable } from '@angular/core';

declare var Particle;

@Injectable()
export class ParticleService {

  private devices: any[];
  private particle: any;
  private token: string;
  private deviceId: string = null;

  constructor() {
      this.particle = new Particle();
      this.devices = [];
      this.loadToken();
      this.loadDefaultDevice();
  }

  hasToken(){
    return this.token && this.token.length > 10;
  }

  login(credentials:any){
    console.debug('Particle login creds', credentials);

    var promise = this.particle.login( credentials )
    promise.then(
      data => {
        console.log('Particle login success', data);
        this.token = data.body.access_token;
        this.storeToken();
      },
      err => {
        console.error('Particle login err', err);
      }
    );

    return promise;
  }

  getEventStream(){

    var promise = this.particle.getEventStream({
      auth: this.token,
      deviceId: this.deviceId,
    });

    return promise;
  }


  getVariable(name: string){

    var promise = this.particle.getVariable({
      auth: this.token,
      deviceId: this.deviceId,
      name: name
    });

    return promise;

  }

  callFunction(name:string, argument:string){

    return new Promise<any>(
      (resolve, reject) => {
        this.particle.callFunction({
          deviceId: this.deviceId,
          name: name,
          argument: argument,
          auth: this.token
        }).then(
          res => {
            resolve(res);
          },
          err => {
            console.error('call function err', err);
            reject(err);
          }
        );
      }
    );

  }

  listDevices(){
    return new Promise<Array<any>>(
      (resolve, reject) => {
        this.particle.listDevices({ auth: this.token })
          .then(
            res => {
              console.info('List Devices success ', res);
              this.devices = res.body;
              resolve(this.devices);
            },
            err => {
              console.error('List devices call failed: ', err);
              reject();
            }
          );
      }
    );

  }

  setDefaultDevice(deviceId: string){
    this.deviceId = deviceId;
    this.storeDefaultDevice();
  }

  getDefaultDevice(){
    return this.deviceId;    
  }

  private loadDefaultDevice(){
    return this.deviceId = localStorage.getItem('particle-device');    
  }

  private storeDefaultDevice(){
    localStorage.setItem('particle-device', this.deviceId);    
  }


  private loadToken(){
    return this.token = localStorage.getItem('particle-token');
  }

  private storeToken(){
    localStorage.setItem('particle-token', this.token);
  }




}
