/**
 * Created by eliasmj on 08/08/2016.
 */

export class MealDetail {

    constructor(public  label: string, public icon: string){

    }
}

export class MainMeal
{

    constructor(public name: string, public mealDetail: MealDetail) {

    }

}
