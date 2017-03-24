import {Component} from "@angular/core";
import {Platform, LoadingController} from "ionic-angular";
import {Category} from "../model/category.model";
import {Ingredient} from "../model/ingredient.model";
import {RecipeService} from "../../recipe/services/recipe.service";
import {MainMeal} from "../../recipe/model/main.meal.model";

@Component({
    selector: 'ingredient',
    templateUrl: 'ingredient-generator.html'
})
export class IngredientGeneratorComponent {

    categories: Category [];
    listLoaded = false;
    mainMeals: MainMeal [];

    constructor(
        public platform : Platform,
        public loadingCtrl: LoadingController,
        public recipeService: RecipeService
    ) {

        this.mainMeals = this.recipeService.getMainMealList();

    }

    ionViewDidEnter() {
        this.refreshList();
    }

    public refreshList() {

        this.categories = [];

        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });

        loader.present();
    }

    public verifyRecipe() {
        //TODO check the ingredient in each recipe

        let recipesCountObj = {};

        this.categories.forEach(category => {

        });

        let recipesIdsBulk = {docs : []};

        //build id
        Object.keys(recipesCountObj).forEach( key => {
            let recipeId = key;

            recipesIdsBulk.docs.push({"id" : recipeId});

        });

    }

    public pickIngredient(ingredient: Ingredient) {

        console.log("verify", ingredient.verify)

        //ingredient.verify = ingredient.verify;
    }
}
