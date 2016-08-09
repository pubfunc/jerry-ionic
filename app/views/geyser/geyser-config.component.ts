import { Geyser, GeyserConfig, GeyserSchedule, GeyserScheduleItem } from './geyser';
import { Component } from '@angular/core';
import { Modal, NavController, ViewController, NavParams, PickerController } from 'ionic-angular';


@Component({
  templateUrl: 'build/views/geyser/geyser-config.component.html'
})
export class GeyserConfigComponent {

  public schedule: GeyserSchedule;
  public config: GeyserConfig;

  constructor(
    private view: ViewController, 
    private params: NavParams, 
    private geyser: Geyser,
    private picker: PickerController
    ){

      this.config = this.geyser.config.clone();
      this.schedule = this.geyser.schedule.clone();
  }

  dismiss(){
    this.view.dismiss();
  }

  addScheduleItem(){
    this.schedule.items.push(new GeyserScheduleItem);
  }

  setTime(){
    this.picker
        .create({})
        .present()
        .then(
          res => {
            console.log(res);
          },
          rej => {
            console.log(rej);
          }
        );
  }



}


