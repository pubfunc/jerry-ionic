import { Geyser, GeyserConfig, GeyserSchedule, GeyserScheduleItem } from './geyser';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { Modal, NavController, ViewController, NavParams, PickerController, PickerOptions, ModalController } from 'ionic-angular';

import { GeyserScheduleItemComponent } from './geyser-schedule-item.component';


@Pipe({name: 'joinWeekdays'})
export class JoinWeekdays implements PipeTransform {
  transform(map: any, glue: string = ','): string {
    console.log('pipe weekdays', map);
    let days = [];
    if(map.mon) days.push('Mon'); 
    if(map.tue) days.push('Tue'); 
    if(map.wed) days.push('Wed'); 
    if(map.thu) days.push('Thu'); 
    if(map.fri) days.push('Fri');
    if(map.sat) days.push('Sat'); 
    if(map.sun) days.push('Sun');

    if(days.length == 0) return 'Not Set';

    return days.join(glue); 
  }
}

@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {
  transform(hour_min: string): string {

    let parts = hour_min.split(':');
    let res = '';
    if(Number(parts[0])) res += Number(parts[0]) + 'h';
    if(Number(parts[1])) res += Number(parts[1]) + 'm';
    return res;
  }
}



@Component({
  templateUrl: 'build/views/geyser/geyser-config.component.html',
  pipes: [JoinWeekdays, DurationPipe]
})
export class GeyserConfigComponent {

  public schedule: GeyserSchedule;
  public config: GeyserConfig;
  public type: string;


  constructor(
    private view: ViewController, 
    private params: NavParams, 
    private geyser: Geyser,
    private picker: PickerController,
    private modal: ModalController
    ){

      this.type = this.params.get('type');

      this.config = this.geyser.config.clone();
      this.schedule = this.geyser.schedule.clone();
  }


  save(){
    switch(this.type){
      case 'schedule':
        this.geyser.saveSchedule(this.schedule);
      break; 
      case 'config':
      break; 
      case 'override':
      break;
    }
  }

  dismiss(){
    this.view.dismiss();
  }

  addScheduleItem(){
    this.schedule.items.push(new GeyserScheduleItem);
  }

  editScheduleItem(item: GeyserScheduleItem, index: number){

    let modal = this.modal.create(GeyserScheduleItemComponent, { index: index, item: item });

    modal.onDidDismiss(res => {
      console.log(res);
      
      // this.schedule.items[res.index].weekdays = res.item.weekdays;
      // this.schedule.items[res.index].tod = res.item.tod;
      // this.schedule.items[res.index].duration = res.item.duration;

      this.schedule.items[res.index] = res.item;

      console.log(this.schedule.items[res.index]);
    });
    
    modal.present();

  }


}





