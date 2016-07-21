import { Component } from '@angular/core';
import { Modal, NavController, ViewController } from 'ionic-angular';


@Component({
  templateUrl: 'build/workers/edit-schedule.component.html'
})
export class EditScheduleComponent {

  constructor(private view: ViewController){

  }

  public schedule = {
    weekdays: ['M', 'T', 'W'],
    time_of_day: '07:00',
    duration: '01:00'
  };

  dismiss(){
    this.view.dismiss();
  }
}
