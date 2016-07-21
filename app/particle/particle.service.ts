import { Injectable } from '@angular/core';

declare var Particle;

@Injectable()
export class ParticleService {

  private devices: any[];
  private particle: any;
  private token: string;
  private deviceId = '2e0043001047353138383138';

  constructor() {
      this.particle = new Particle();
      this.devices = [];
      this.loadToken();
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
    console.debug('Particle getEventStream');

    var promise = this.particle.getEventStream({
      auth: this.token,
      deviceId: this.deviceId,
    });

    promise.then(
      stream => {
        console.log('Particle getEventStream success', stream);
        stream.on('event', data => {

          console.log('Particle event', data);
        });
      },
      err => {
        console.error('Particle getEventStream err', err);
      }
    );
    return promise;
  }


  getVariable(name: string){
    console.debug('Particle getVar');

    var promise = this.particle.getVariable({
      auth: this.token,
      deviceId: this.deviceId,
      name: name
    });

    promise.then(
      value => {
        console.info('Particle getVar success', name, value);
      },
      err => {
        console.error('Particle getVar err', err);
      }
    );
    return promise;

  }

  callFunction(deviceId:string, name:string, argument:string){
    console.debug('Particle callFunction', deviceId, name, argument);

    var promise = this.particle.callFunction({
      deviceId: deviceId,
      name: name,
      argument: argument,
      auth: this.token
    });

    promise.then(
      data => {
        console.log('Particle call success', data);
      },
      err => {
        console.error('Particle call err', err);
      }
    );
    return promise;
  }

  listDevices(){
    var promise = this.particle
        .listDevices({ auth: this.token });

    promise.then(
          devices => {
            console.info('List Devices success ', devices);
            this.devices = devices.body;
          },
          err => {
            console.error('List devices call failed: ', err);
          }
        );

    return promise;
  }


  loadToken(){
    return this.token = localStorage.getItem('particle-token');
  }

  storeToken(){
    localStorage.setItem('particle-token', this.token);
  }


}
