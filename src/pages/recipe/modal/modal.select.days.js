"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var week_day_constant_1 = require("../../constants/week.day.constant");
var ModalSelectDays = (function () {
    function ModalSelectDays(viewCtrl, params) {
        //this.recipesCount = this.params.get('recipesCount');
        this.viewCtrl = viewCtrl;
        this.params = params;
        //public weekDays = weekDays;
        this.days = [];
        this.days.push({ name: week_day_constant_1.weekDays.ZERO, label: 0 });
        this.days.push({ name: week_day_constant_1.weekDays.ONE, label: 1 });
        this.days.push({ name: week_day_constant_1.weekDays.TWO, label: 2 });
        this.days.push({ name: week_day_constant_1.weekDays.THREE, label: 3 });
        this.days.push({ name: week_day_constant_1.weekDays.FOUR, label: 4 });
        this.days.push({ name: week_day_constant_1.weekDays.FIVE, label: 5 });
        this.days.push({ name: week_day_constant_1.weekDays.SIX, label: 6 });
    }
    ModalSelectDays.prototype.selectDay = function (day) {
        this.viewCtrl.dismiss(day.name);
    };
    ModalSelectDays.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ModalSelectDays = __decorate([
        core_1.Component({
            templateUrl: 'modal-select-days.html'
        })
    ], ModalSelectDays);
    return ModalSelectDays;
}());
exports.ModalSelectDays = ModalSelectDays;
