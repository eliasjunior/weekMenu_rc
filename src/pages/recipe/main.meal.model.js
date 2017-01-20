/**
 * Created by eliasmj on 08/08/2016.
 */
"use strict";
var MealDetail = (function () {
    function MealDetail(label, icon) {
        this.label = label;
        this.icon = icon;
    }
    return MealDetail;
}());
exports.MealDetail = MealDetail;
var MainMeal = (function () {
    function MainMeal(name, mealDetail) {
        this.name = name;
        this.mealDetail = mealDetail;
    }
    return MainMeal;
}());
exports.MainMeal = MainMeal;
