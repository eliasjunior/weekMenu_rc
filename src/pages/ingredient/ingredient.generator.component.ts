import {Component} from "@angular/core";
import {Platform, LoadingController, ModalController} from "ionic-angular";
import {IngredientService} from "./ingredient.service";
import {Category} from "./category.model";
import {Ingredient} from "./ingredient.model";
import {ModalRecipes} from "./modal/modal.recipes";
import {RecipeService} from "../recipe/recipe.service";
import {Recipe} from "../recipe/recipe.model";
import {MainMeal} from "../recipe/main.meal.model";
import {weekDays} from "../constants/week.day.constant";

@Component({
    selector: 'ingredient',
    templateUrl: 'ingredient-generator.html'
})
export class IngredientGeneratorComponent {

    categories: Category [];
    listLoaded = false;
    mainMeals: MainMeal [];
    weekDays = weekDays;

    constructor(
        public platform : Platform,
        public ingredientService: IngredientService,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
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

        this.ingredientService.getCategoriesIngredient(null)
            .then(categories => {

                this.displayList(loader);
                //It needs zone when came from menu footer button
                this.categories = categories;
            })
            .catch(reason => {
                this.displayList(loader);
                console.error("problem get view", reason);
            });
    }

    private displayList(loader) {
        loader.dismiss();
        this.listLoaded = true;
    }

    public verifyRecipe() {
        //TODO check the ingredient in each recipe

        let recipesCountObj = {};

        this.categories.forEach(category => {

            //check if the ingredient is linked to a recipe, create a json with the recipe name/id and
            //count number that the ingredient has the recipe.
            category.ingredients
                .filter(ingredient => {
                    return ingredient.verify === true
                        && ingredient.recipe_ids
                        && ingredient.recipe_ids.length > 0
                }).forEach(ingr => {

                    ingr.recipe_ids.forEach(id => {

                        if(!recipesCountObj[id]) {
                            recipesCountObj[id] = 1;
                        } else {
                            recipesCountObj[id] = recipesCountObj[id] + 1;
                        }
                    });
                });

        });

        let recipesIdsBulk = {docs : []};

        //build id
        Object.keys(recipesCountObj).forEach( key => {
            let recipeId = key;

            recipesIdsBulk.docs.push({"id" : recipeId});

        });

        this.recipeService.getMany(recipesIdsBulk)
            .then(response => {
                console.log("getMany RESPONSE", response);

                this.createModalRecipes(response, recipesCountObj);

            })
            .catch(reason => console.error(reason));

        //get the recipes sorted by occurrences
        //show recipe list based on the ingredient use in each one
    }

    createModalRecipes(response, recipesCount) {

        let recipes : Recipe [] = [];

        response.results.forEach(row => {

            let recipe : Recipe = new Recipe();

            recipe.parseRecipe(row.docs[0].ok);

            recipe.populateMainMeail(this.mainMeals);

            recipes.push(recipe);

        });

        let modal = this.modalCtrl.create(ModalRecipes, {'recipes' : recipes, 'recipesCount' : recipesCount});

        modal.onDidDismiss(result => {
            console.log("result ", result);
        });

        modal.present();
    }

    public pickIngredient(ingredient: Ingredient) {

        console.log("verify", ingredient.verify)

        //ingredient.verify = ingredient.verify;
    }
}
