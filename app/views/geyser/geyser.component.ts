import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ModalController } from 'ionic-angular';

import * as moment from 'moment';

import { GeyserConfigComponent } from './geyser-config.component';

import { Geyser } from './geyser';

@Component({
  templateUrl: 'build/views/geyser/geyser.component.html',
})
export class GeyserComponent implements OnInit {

  public lastEventTime = moment(0);


  constructor(
    private nav: NavController, 
    private modal: ModalController,
    private geyser: Geyser
    ) {}


  ngOnInit() {



  }


  openConfig(){
    let modal = this.modal.create(GeyserConfigComponent);
    modal.present(modal);
  }



}
