import { Injectable } from '@angular/core';
import { ParticleService } from '../../particle/particle.service';
import * as moment from 'moment';

export class GeyserConfig {
    constructor(
      public ideal_temp = 0,
      public override_option = false,
      public override_duration = 0,
      public override_start_time = ''
    ){}

    clone(){
      return new GeyserConfig(
        this.ideal_temp,
        this.override_option,
        this.override_duration,
        this.override_start_time
      );
    }
}

export class GeyserSchedule {
    constructor(
      public items: Array<GeyserScheduleItem> = []
    ){}

    clear(){
      this.items = [];
    }
    clone(){
      let clone_items = this.items.map(item => {
          return item.clone();
      });
      return new GeyserSchedule(clone_items);
    }
}

export class GeyserScheduleItem {
    constructor(
      public weekdays: Array<string> = [],
      public tod = moment(),
      public duration: number = 0
    ){}
    clone(){
      return new GeyserScheduleItem(
        this.weekdays,
        this.tod,
        this.duration
      );
    }
}


@Injectable()
export class Geyser {

  public state = {
    element_on: false,
    temperature: -100,
    code: 0,
    label: 'Loading...'
  };

  public config = new GeyserConfig;
  public schedule = new GeyserSchedule;


  constructor(private particle: ParticleService){
    this.particle.getEventStream().then(
      stream => {
        stream.on('jerry/geyser/state', (e) => this.parseStateEvent(e));
        stream.on('jerry/geyser/config', (e) => this.parseConfigEvent(e));
        stream.on('jerry/geyser/schedule', (e) => this.parseScheduleEvent(e));
      }
    );
    this.updateVariables();
  }



  private parseStateEvent(event: any){
    var data = JSON.parse(event.data);
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

  }

  // {"data":""tmp":55.00,"ov_sta":8000,"ov_dur":500,"ov_opt":120","ttl":"60","published_at":"2016-07-21T19:16:32.374Z","coreid":"2e0043001047353138383138","name":"jerry/geyser/config"}

  private parseConfigEvent(event: any){
    var data = JSON.parse(event.data);

    this.config.ideal_temp = data.tmp;
    this.config.override_start_time = data.ov_sta;
    this.config.override_duration = data.ov_dur;
    this.config.override_option = data.ov_opt;
  }

  private parseScheduleEvent(event:any){

  }

  private parseScheduleString(scheduleString : string){

    var scheduleRows = scheduleString.split(',');
    var i = 0;

    scheduleRows.pop();

    scheduleRows.forEach(row => {
      var cols = row.split(':');

      var tod = new Date(Number(cols[1]) * 1000);

      this.schedule.items.push({
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
        this.config.override_start_time = moment(Number(value.body.result)).toISOString();
      }
    );
    this.particle.getVariable('g_temp').then(
      value => {
        this.config.ideal_temp = Number(value.body.result);
      }
    );
  }

}



