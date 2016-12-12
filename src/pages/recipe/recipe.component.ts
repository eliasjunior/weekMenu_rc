/**
 * Created by eliasmj on 05/08/2016.
 */
import {Component, Input} from '@angular/core';
import {NavController, NavParams, LoadingController} from "ionic-angular";
import {IngredientComponent} from "../ingredient/Ingredient.component";
import {RecipeService} from "./recipe.service";
import {Recipe} from "./recipe.model";
import {RecipeListComponent} from "./recipe.list.component";
import {IngredientService} from "../ingredient/ingredient.service";
import {IngredientListComponent} from "../ingredient/Ingredient.list.component";
import {Category} from "../ingredient/category.model";
import {Response} from "@angular/http";
import {Observable} from "rxjs";

@Component({
    selector: 'recipe-component',
    templateUrl : 'recipe-component.html'
})

export class RecipeComponent {

    public categories : Category[];
    @Input() recipe: Recipe;
    public mainMeals = [];

    constructor(private navCtrl : NavController,
                private navParam : NavParams,
                private recipeService: RecipeService,
                private ingredientService: IngredientService,
                private loadingCtrl: LoadingController){


        this.navCtrl = navCtrl;

        if(this.navParam.get('recipe')) {
            this.recipe = this.navParam.get('recipe');

        } else {
            this.recipe = new Recipe();
        }

        console.log("RECIPE ", this.recipe)

        this.mainMeals = recipeService.getMainMealList();
     }

    ionViewDidEnter() {

        //clean the array
        this.categories = [];

        //get from here instead the attribute class recipe
        if(this.navParam.get('recipe')) {
            this.refreshListIngredients();
        }
    }

    private refreshListIngredients() {

        // let loader = this.loadingCtrl.create({
        //     content: "Please wait..."
        // });
        // loader.present();
        //
        // this.recipeService.getRecipe(this.recipe._id)
        //     .subscribe(recipe => {
        //
        //     }, err => console.error(err)
        //     , () => this.displayList(loader))

    }

    private displayList(loader) {
        loader.dismiss();
    }

    addIngredient(recipeId : string){

        if(!recipeId) {
            console.error("Show error message or disable button to fill the name");
            this.recipeService.message('Tap Save before add ingredients')
        } else {

            this.navCtrl.push(IngredientListComponent, {recipeId : recipeId});
        }

    }

    editIngredient(ingredientId) {
        this.navCtrl.push(IngredientComponent, {ingredientId : ingredientId, recipeId: this.recipe._id});
    }

    saveRecipe(){

        this.recipe.isInMenuWeek = true;

        this.recipeService.saveRecipe(this.recipe)
            .subscribe(response =>
            {
                console.log("Save or update!!", response);

                this.recipeService.message('Recipe saved successfully!');

                if(this.categories.length > 0) {
                    this.navCtrl.push(RecipeListComponent);
                } else {
                    this.recipeService.message('Should save at least one ingredient');
                    // console.log("Should save at least one ingredient")
                }

            }, err => console.error("Error to get post recipe"))

    }
}
