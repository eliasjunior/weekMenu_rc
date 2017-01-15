/**
 * Created by eliasmj on 08/08/2016.
 */
import {Recipe} from "./recipe.model";
import {MainMeal, MealDetail} from "./main.meal.model";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/fromPromise';
import {BaseService} from "../services/base.service";
import {RecipeApiService} from "./recipe.api.service";
import {Category} from "../ingredient/category.model";
import {Platform} from "ionic-angular";

@Injectable()
export class RecipeService extends BaseService
{
    private recipes: Recipe [];

    constructor(private recipeApiService : RecipeApiService, platform : Platform) {
        super(platform);
    }

    getRecipe(id: String) {
        return this.recipeApiService.get(id)
            .map(this.convertDocToRecipes)
            .catch(this.errorHandler)
    }

    getList() {

        return this.recipeApiService.geRecipeDocs()
            .map(this.convertDocsToRecipes)
            .catch(this.errorHandler)
    }

    public getMainMealList() {
        return [
            new MainMeal("fish", new MealDetail('Fish','fish.png')),
            new MainMeal("meat",  new MealDetail('Meat','meat-1.png')),
            new MainMeal("poultry",new MealDetail('Poultry','chicken-3.png')),
            new MainMeal("veg", new MealDetail('Vegetarian', 'veg-5.png')),
            new MainMeal("pasta", new MealDetail('Pasta', 'pasta-1.png')),
            new MainMeal("side", new MealDetail('Side', 'veg-5.png')),
            new MainMeal("groceries", new MealDetail('Groceries', 'groceries-1.png')),
            new MainMeal("other", new MealDetail('Other', 'images.png'))
        ]
    }

    public saveRecipe(recipe: Recipe){
        return this.recipeApiService.saveRecipe(recipe)
    }

    public linkRecipeToCategory(recipeId: string, categories: Category) {

        return this.recipeApiService.linkRecipeToCategory(recipeId, categories)
    }

    public getRecipeCategories(recipeId: string) {
        return this.recipeApiService.getRecipeCategories(recipeId);
    }

    public getRecipeAttributes(recipeId: string) {
        return this.recipeApiService.getRecipeAttributes(recipeId);
    }

    private convertDocsToRecipes(docs: any) : Recipe[]{

        let recipes : Recipe [] = [];
        //need to get the week's menu separated
        docs.forEach(doc => {

            let recipe = new Recipe();
            recipe.parseRecipe(doc);

            recipes.push(recipe);
        });

        return recipes;
    }

    private convertDocToRecipes(doc: any) : Recipe{

        let recipe = new Recipe();
        recipe.parseRecipe(doc);

        return doc;
    }

    //TODO need to test and call
    deleteRecipe(id: string){

        let newRecipes = this.recipes.filter(recipe => recipe.name !== id);

        console.log("Deleted filter", newRecipes);

        this.recipes = newRecipes;
    }
}
