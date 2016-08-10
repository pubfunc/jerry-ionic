import { Injectable } from '@angular/core';
import { ParticleService } from '../../particle/particle.service';
import * as moment from 'moment';

export class GeyserConfig {
    constructor(
      public ideal_temp = 0,
      public override_option = false,
      public override_duration = 0,
      public override_start_time = '0000-00-00 00:00'
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
      public weekdays = {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
      },
      public tod = '00:00',
      public duration = '00:00'
    ){}
    clone(){
      return new GeyserScheduleItem(
        this.weekdays,
        this.tod,
        this.duration
      );
    }
    isset(){
      return this.weekdays.mon ||
              this.weekdays.tue ||
              this.weekdays.wed ||
              this.weekdays.thu ||
              this.weekdays.fri ||
              this.weekdays.sat ||
              this.weekdays.sun;    
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


  public saveSchedule(schedule: GeyserSchedule){
    console.log('save schedule', this.stringifySchedule(schedule), schedule);

    return this.particle
               .callFunction('setGSchedule', this.stringifySchedule(schedule));

  }

  public saveConfig(config: GeyserConfig){

  }


  private parseStateEvent(event: any){

    console.info('geyser state event', event);

    var data = JSON.parse(event.data);
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

    console.info('geyser config event', event);

    var data = JSON.parse(event.data);

    this.config.ideal_temp = data.tmp;
    this.config.override_start_time = data.ov_sta;
    this.config.override_duration = data.ov_dur;
    this.config.override_option = data.ov_opt;
  }

  private parseScheduleEvent(event:any){
    console.warn('TODO handle schedule event', event);
  }

  private stringifySchedule(schedule: GeyserSchedule){


    let rows = [];

    for (var i = 0; i < schedule.items.length; i++) {
      var item = schedule.items[i];
      var weekdayBits = 0;
      var durationSecs = moment.duration(item.duration).asSeconds();
      var todSecs = moment.duration(item.tod).asSeconds();

      if(item.weekdays.mon) weekdayBits += 64;
      if(item.weekdays.tue) weekdayBits += 32;
      if(item.weekdays.wed) weekdayBits += 16;
      if(item.weekdays.thu) weekdayBits += 8;
      if(item.weekdays.fri) weekdayBits += 4;
      if(item.weekdays.sat) weekdayBits += 2;
      if(item.weekdays.sun) weekdayBits += 1;

      rows.push([weekdayBits, todSecs, durationSecs].join(':'));
    }

    return rows.join(',') + ',';

  }

  private parseScheduleString(scheduleString : string){

    var scheduleRows = scheduleString.split(',');
    var i = 0;

    scheduleRows.pop();

    scheduleRows.forEach(row => {
      var cols = row.split(':');

      var tod = new Date(Number(cols[1]) * 1000);

      this.schedule.items.push(new GeyserScheduleItem(
        this.parseWeekdays(Number(cols[0])),
        moment(0).startOf('day').add("seconds", Number(cols[1])).format("HH:mm"),
        moment(0).startOf('day').add("seconds", Number(cols[2])).format("HH:mm")
      ));

      i++;

    });

    console.log("Schedule parsed", scheduleString, this.schedule);

  }

  private parseWeekdays(weekdaysBits: number){

    let weekdays : any = {};

    // weekdays.mon = weekdaysBits >= 128;
    // weekdaysBits = weekdaysBits % 128; 
    
    weekdays.mon = weekdaysBits >= 64;
    weekdaysBits = weekdaysBits % 64; 
    
    weekdays.tue = weekdaysBits >= 32;
    weekdaysBits = weekdaysBits % 32;

    weekdays.wed = weekdaysBits >= 16;
    weekdaysBits = weekdaysBits % 16;

    weekdays.thu = weekdaysBits >= 8;
    weekdaysBits = weekdaysBits % 8;

    weekdays.fri = weekdaysBits >= 4;
    weekdaysBits = weekdaysBits % 4; 

    weekdays.sat = weekdaysBits >= 2;
    weekdaysBits = weekdaysBits % 2; 

    weekdays.sun = weekdaysBits >= 1;
    weekdaysBits = weekdaysBits % 1; 

    return weekdays;
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



