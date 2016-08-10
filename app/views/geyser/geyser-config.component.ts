import { Geyser, GeyserConfig, GeyserSchedule, GeyserScheduleItem } from './geyser';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { Modal, NavController, ViewController, NavParams, PickerController, PickerOptions, ModalController, ToastController } from 'ionic-angular';

import { GeyserScheduleItemComponent } from './geyser-schedule-item.component';


@Pipe({name: 'joinWeekdays'})
export class JoinWeekdays implements PipeTransform {
  transform(map: any, glue: string = ','): string {
    //console.log('pipe weekdays', map);
    let days = [];

    let workday_count = 0;
    let weekend_count = 0;

    if(map.mon) {
      days.push('Mon');
      workday_count++;
    } 
    if(map.tue) {
      days.push('Tue');
      workday_count++;
    } 
    if(map.wed) {
      days.push('Wed');
      workday_count++;
    } 
    if(map.thu) {
      days.push('Thu');
      workday_count++;
    } 
    if(map.fri) {
      days.push('Fri');
      workday_count++;
    }
    if(map.sat) {
      days.push('Sat');
      weekend_count++;
    } 
    if(map.sun) {
      days.push('Sun');
      weekend_count++;
    }

    if(days.length == 0) return 'Unset';

    if(workday_count == 5 && weekend_count == 2) return 'Mon-Sun';
    if(workday_count == 5 && weekend_count == 0) return 'Mon-Fri';
    if(weekend_count == 2 && workday_count == 0) return 'Sat-Sun';
  

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
    private modal: ModalController,
    private toast: ToastController
    ){

      this.type = this.params.get('type');

      this.config = this.geyser.config.clone();
      this.schedule = this.geyser.schedule.clone();
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

  dismiss(){
    this.view.dismiss();
  }

  save(){
    switch(this.type){
      case 'schedule':
        this.geyser.saveSchedule(this.schedule).then(
          res => {
            this.toastSaveSuccess();
            this.view.dismiss(res);
          },
          err => {
            this.toastSaveFailed();
            this.view.dismiss();            
          }
        );
      break; 
      case 'config':
      break; 
      case 'override':
      break;
    }
  }

  toastSaveSuccess(){
    this.toast.create({
      duration: 3000,
      message: "Geyser Updated!"
    }).present();
  }

  toastSaveFailed(){
    this.toast.create({
      duration: 3000,
      message: "ERROR Geyser Update failed!"
    }).present();
  }


}





