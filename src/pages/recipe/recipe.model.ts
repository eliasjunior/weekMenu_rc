/**
 * Created by eliasmj on 05/08/2016.
 */

import {Category} from "../ingredient/category.model";
import {Base} from "../model/base.model";

export class MenuHistory extends Base {

    dateCreated : string;

    constructor() {
        super('MENU_HISTORY');
    }
}

export class Recipe extends Base {

    checked : boolean = false;
    weekDay: string;
    menus: MenuHistory [];
    categories : Category[]; //to display
    ingredient_ids: string [];
    mainMealValue: string;
    mainMeal: any;
    countIngredient: number;
    description: string;

    constructor() {
        super('RECIPE');
    }

    public parseRecipe(responseRecipe) {

        super.parse(responseRecipe);

        this.weekDay = responseRecipe.weekDay;
        this.ingredient_ids = responseRecipe.ingredient_ids;
        this.checked = responseRecipe.checked;
        this.menus = responseRecipe.menus;
        this.mainMealValue = responseRecipe.mainMealValue;
        this.description = responseRecipe.description;

    }

    populateMainMeail(mainMeals) {

        mainMeals.forEach(mainMeal => {

            if(mainMeal.name === this.mainMealValue){
                this.mainMeal = mainMeal;
            }
        });
    }

    public getDayValue() {

        let dayValue = { "Monday" : 1, "Tuesday" : 2, "Wednesday" : 3,
            "Thursday" : 4, "Friday" : 5, "Saturday": 6 , "Sunday" : 0};

        if(!this.weekDay ) {
            return -1
            //show first, if you want to show latest need to be bigger then 7 of the list
        } else {
            return dayValue[this.weekDay];
        }
    }
}
