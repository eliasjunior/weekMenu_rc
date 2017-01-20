import {Component} from "@angular/core";
import {Platform, LoadingController, ModalController} from "ionic-angular";
import {Category} from "../category.model";
import {Ingredient} from "../ingredient.model";
import {ModalRecipes} from "../modal/modal.recipes";
import {RecipeService} from "../../recipe/recipe.service";
import {Recipe} from "../../recipe/recipe.model";
import {MainMeal} from "../../recipe/main.meal.model";

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

    private refreshList() {

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
