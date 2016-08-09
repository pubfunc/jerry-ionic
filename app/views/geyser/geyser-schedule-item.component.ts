import { Geyser, GeyserConfig, GeyserSchedule, GeyserScheduleItem } from './geyser';
import { Component } from '@angular/core';
import { Modal, NavController, ViewController, NavParams, PickerController, PickerOptions } from 'ionic-angular';


@Component({
  templateUrl: 'build/views/geyser/geyser-schedule-item.component.html'
})
export class GeyserScheduleItemComponent {

  public item: GeyserScheduleItem;
  public index: number;

  constructor(
    private view: ViewController, 
    private params: NavParams, 
    private geyser: Geyser,
    private picker: PickerController
    ){

      this.item = params.get('item').clone();
      this.index = params.get('index');
  }

  dismiss(){
    this.view.dismiss({item: this.item, index: this.index});
  }


}


