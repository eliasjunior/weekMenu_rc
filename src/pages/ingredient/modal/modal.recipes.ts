import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";
import {Recipe} from "../../recipe/model/recipe.model";

@Component({
    templateUrl: 'modal-recipes.html'
})
export class ModalRecipes {

    recipes : Recipe [];
    recipesCount: any;

    constructor(
        private viewCtrl: ViewController,
        private params: NavParams)
    {

        this.recipes = [];
        this.recipes = this.params.get('recipes');
        this.recipesCount = this.params.get('recipesCount');

        //add count ingredients that the recipe is in.
        this.recipes.forEach(recipe => {

            Object.keys(this.recipesCount).forEach(key => {

                if(key === recipe._id) {
                    recipe.countIngredient = this.recipesCount[key];
                    console.log("Recipe", recipe._id, recipe.countIngredient)
                }

            });

        });

        this.recipes.sort(function(a, b){
            if(a.countIngredient > b.countIngredient) {
                return -1
            }

            if(a.countIngredient < b.countIngredient) {
                return 1
            }
            return 0;
        });
    }

    dismiss() {
        this.viewCtrl.dismiss([]);
    }
}
