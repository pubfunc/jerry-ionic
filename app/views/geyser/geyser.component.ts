import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ModalController } from 'ionic-angular';

import * as moment from 'moment';

import { ParticleService } from '../../particle/particle.service';
import { EditScheduleComponent } from './edit-schedule.component';


@Component({
  templateUrl: 'build/views/geyser/geyser.component.html',
  providers: [ ParticleService ]
})
export class GeyserComponent implements OnInit {

  public lastEventTime = moment(0);

  public schedule = [];

  public state = {
    element_on: false,
    temperature: -100,
    code: 0,
    label: 'Loading...'
  };

  public config = {
    ideal_temp: 0,
    override_option: false,
    override_duration: 0,
    override_start_time: moment(0),
    show_override_controls: false
  };

  constructor(
    public menu: MenuController, 
    private nav: NavController, 
    private modal: ModalController,
    private particle: ParticleService
    ) {

  }

  ngOnInit() {

    this.particle.getEventStream().then(
      stream => {
        stream.on('jerry/geyser/state', (e) => this.handleGeyserStateEvent(e));
        stream.on('jerry/geyser/config', (e) => this.handleGeyserConfigEvent(e));
        stream.on('jerry/geyser/schedule', (e) => this.handleGeyserScheduleEvent(e));
      }
    );

    this.updateVariables();

  }

  // {"data":""tmp":55.00,"ov_sta":8000,"ov_dur":500,"ov_opt":120","ttl":"60","published_at":"2016-07-21T19:16:32.374Z","coreid":"2e0043001047353138383138","name":"jerry/geyser/config"}

  handleGeyserConfigEvent(event){

    var data = JSON.parse('{' + event.data + '}');

    this.config.ideal_temp = data.tmp;
    this.config.override_start_time = data.ov_sta;
    this.config.override_duration = data.ov_dur;
    this.config.override_option = data.ov_opt;

    this.lastEventTime = moment(event.published_at);
  }

  handleGeyserScheduleEvent(event){

    this.lastEventTime = moment(event.published_at);
  }

  handleGeyserStateEvent(event){
    var data = JSON.parse('{' + event.data + '}');
    console.log('geyser state', data);
    this.state.element_on = data.elem;
    this.state.temperature = data.temp;

    switch(data.stat){
      case 55:
        this.state.label = 'GEYSER_STATE_ERROR';
      break;
      case 65:
        this.state.label = 'GEYSER_STATE_OFF';
      break;
      case 75:
        this.state.label = 'GEYSER_STATE_HEATED';
      break;
      case 85:
        this.state.label = 'GEYSER_STATE_SCHEDULED';
      break;
      case 95:
        this.state.label = 'GEYSER_STATE_OVERRIDE';
      break;
      case 100:
        this.state.label = 'GEYSER_OVERRIDE_ON';
      break;
      case 120:
        this.state.label = 'GEYSER_OVERRIDE_OFF';
      break;
    }

    this.state.code = data.stat;

    this.lastEventTime = moment(event.published_at);
  }


  private parseScheduleString(scheduleString : string){
    this.schedule = [];
    var scheduleRows = scheduleString.split(',');
    var i = 0;

    scheduleRows.pop();

    scheduleRows.forEach(row => {
      var cols = row.split(':');

      var tod = new Date(Number(cols[1]) * 1000);

      this.schedule.push({
        weekdays: Number(cols[0]).toString(2),
        time_of_day: tod.toISOString().substr(11,5),
        duration: moment.duration(Number(cols[2]), 'seconds')
      });

      i++;

    });

    console.log("Schedule parsed", this.schedule);

  }

  private updateVariables(){
    this.particle.getVariable('g_schedule').then(
      value => {
        this.parseScheduleString(value.body.result);
      }
    );

    this.particle.getVariable('g_ov_opt').then(
      value => {
        this.config.override_option = (value.body.result == 100);
      }
    );
    this.particle.getVariable('g_ov_dur').then(
      value => {
        this.config.override_duration = value.body.result;
      }
    );
    this.particle.getVariable('g_ov_start').then(
      value => {
        this.config.override_start_time = moment(Number(value.body.result));
      }
    );
    this.particle.getVariable('g_temp').then(
      value => {
        this.config.ideal_temp = Number(value.body.result);
      }
    );
  }


  goEditSchedule(){
    let modal = this.modal.create(EditScheduleComponent);
    modal.present(modal);
  }



}
