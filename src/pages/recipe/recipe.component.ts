/**
 * Created by eliasmj on 05/08/2016.
 */
import {Component, Input} from '@angular/core';
import {NavController, NavParams, LoadingController} from "ionic-angular";
import {IngredientComponent} from "../ingredient/components/Ingredient.component";
import {RecipeService} from "./recipe.service";
import {Recipe} from "./recipe.model";
import {RecipeListComponent} from "./recipe.list.component";
import {IngredientService} from "../ingredient/services/ingredient.service";
import {IngredientListComponent} from "../ingredient/components/Ingredient.list.component";
import {Category} from "../ingredient/category.model";
import {Response} from "@angular/http";
import {Observable} from "rxjs";

@Component({
    selector: 'recipe-component',
    templateUrl : 'recipe-component.html'
})

export class RecipeComponent {

    @Input() recipe: Recipe;
    public mainMeals = [];

    constructor(private navCtrl : NavController,
                private navParam : NavParams,
                private recipeService: RecipeService,
                private loadingCtrl: LoadingController){


        this.navCtrl = navCtrl;

        if(this.navParam.get('recipe')) {
            this.recipe = this.navParam.get('recipe');

        } else {
            this.recipe = new Recipe();
        }

        this.mainMeals = recipeService.getMainMealList();
     }

    ionViewDidEnter() {

        //get from here instead the attribute class recipe
        if(this.navParam.get('recipe')) {
            this.refreshListIngredients();
        }
    }

    private refreshListIngredients() {

        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();

        this.recipeService.getRecipeCategories(this.recipe._id)
            .subscribe(recipe => {

                this.recipe = recipe;

            }, err => console.error(err)
             ,() => this.displayList(loader))

    }

    private displayList(loader) {
        loader.dismiss();
    }

    addIngredient(recipeId : string){

        if(!recipeId) {
            console.warn("problem, recipe is null!!");
            this.recipeService.message('Tap Save before add ingredients')
        } else {

            this.navCtrl.push(IngredientListComponent, {recipeId : recipeId});
        }

    }

    editIngredient(ingredient) {

        console.log("Ingredient ", ingredient)

        this.navCtrl.push(IngredientComponent, {ingredient : ingredient, recipeId: this.recipe._id});
    }

    saveRecipe(){

        this.recipeService.saveRecipe(this.recipe)
            .subscribe(response =>
            {
                console.log("Save or update!!", response);

                this.recipe._id = response._id;

                this.recipeService.message('Recipe saved successfully!');

            }, err => console.error("Error to get post recipe"))

    }
}
