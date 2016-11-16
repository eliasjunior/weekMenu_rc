import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";
import {weekDays} from "../../constants/week.day.constant";


@Component({
    templateUrl: 'modal-select-days.html'
})
export class ModalSelectDays {

    //public weekDays = weekDays;

    public days : any [] = [];

    constructor(
        private viewCtrl: ViewController,
        private params: NavParams)
    {

        //this.recipesCount = this.params.get('recipesCount');

        this.days.push({name: weekDays.ZERO, label: 0});
        this.days.push({name: weekDays.ONE, label: 1});
        this.days.push({name: weekDays.TWO, label: 2});
        this.days.push({name: weekDays.THREE, label: 3});
        this.days.push({name: weekDays.FOUR, label: 4});
        this.days.push({name: weekDays.FIVE, label: 5});
        this.days.push({name: weekDays.SIX, label: 6});
    }

    selectDay(day: any) {
        this.viewCtrl.dismiss(day.name);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
