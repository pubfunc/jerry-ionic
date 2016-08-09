import { Geyser, GeyserConfig, GeyserSchedule } from './geyser';
import { Component } from '@angular/core';
import { Modal, NavController, ViewController, NavParams } from 'ionic-angular';


@Component({
  templateUrl: 'build/views/geyser/geyser-config.component.html'
})
export class GeyserConfigComponent {

  public schedule: GeyserSchedule;
  public config: GeyserConfig;

  constructor(
    private view: ViewController, 
    private params: NavParams, 
    private geyser: Geyser
    ){

      this.config = this.geyser.config.clone();
      this.schedule = this.geyser.schedule.clone();

  }

  dismiss(){
    this.view.dismiss();
  }

}
