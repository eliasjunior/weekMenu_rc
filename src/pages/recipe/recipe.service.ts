/**
 * Created by eliasmj on 08/08/2016.
 */
import {Recipe} from "./recipe.model";
import {MainMeal, MealDetail} from "./main.meal.model";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/fromPromise';
import {BaseService} from "../services/base.service";
import {Ingredient} from "../ingredient/ingredient.model";
import {appConstant} from "../constants/app.constant";
import {Base} from "../model/base.model";
import {Http} from "@angular/http";


@Injectable()
export class RecipeService extends BaseService
{
    private recipes;

    constructor(private http: Http) {
        super();
    }

    createView() {
        this.createViewRecipeIngredient();
    }

    private createViewRecipeIngredient() {
        //gambiarra watch typescript
        function emit(p,w){};
        //let log;

        var mapFunc = function mapFun(doc) {

            if(doc.type === "INGREDIENT" && !doc.deleted)
            {
                //log("doc.ingredient_ids >>>>>>>" + doc.recipe_ids)
                for(var idx in doc.recipe_ids) {
                    //log("idx=" + doc.recipe_ids[idx])
                    //emit(doc.recipe_ids[idx], null);
                    emit(doc.recipe_ids[idx], {_id : doc.categoryId, ingredient: doc});
                    //the param key will match the emit key
                }
            }
        }
        // save the design doc
        super.updateIndex(super.createDesignDoc(appConstant.RECIPE_INDEX, mapFunc));
    }

    convertRowsToRecipes(rows) {

        let recipes : Recipe [];
        //need to get the week's menu separated
        rows.forEach(row => {

            if(row.doc.type === appConstant.RECIPE_TYPE) {

                let recipe = new Recipe();
                recipe.parseRecipe(row.doc);

                recipes.push(recipe);
            }
        });

        return recipes;
    }

    getViewRecipeIngredient(value: string) {
        //console.log("INDEX KEY", value)

        if(value) {
            return this._db.query(appConstant.RECIPE_INDEX, {include_docs : true, key :  value});

        } else {
            return this._db.query(appConstant.RECIPE_INDEX, {include_docs : true});
        }
    }

    // private recipes : Recipe[];
    getList() {

        if(!this.recipes) {

            return super.getAll('RECIPE');

        } else {
            return Observable.create(observer => {
                observer.next(this.recipes);
                observer.complete();
            });
        }
    }

    getListMenu() {
        return Observable.fromPromise(this._db.allDocs({ include_docs: true})
            .then(docs => {

                let recipesMenu : Recipe [] = docs.rows.map(row => {
                    //Dates are not automatically converted from a string.
                    //row.doc.Date = new Date(row.doc.Date);

                    if(row.doc.type === "RECIPE" && row.doc.checked) {

                        let rec = new Recipe();
                        rec.parseRecipe(row.doc);
                        return rec;
                    }
                }).filter(doc => doc !== undefined);

               // console.log("menu lis =", recipesMenu);

                return recipesMenu;
            }));
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

    saveRecipe(recipe: Recipe){
        //this.recipes.push(recipe);

        //add date to the recipes
        recipe.menus = [];

        if(recipe._rev) {

            return super.update(recipe)

        } else {

            recipe._id = recipe.name;

            return super.add(recipe)
        }
    }

    linkIngredientToRecipe(recipeId : string, ingredients: Ingredient[]) {

        let ingredient_ids = ingredients.map(ingredient => ingredient._id);

        return super.addArray(recipeId, 'ingredient_ids' ,ingredient_ids);
    }

    getJsonFile() {

        this.http.get('files/base_data.json')
            .toPromise()
            .then(response => {
                console.log("FILE IS HERE", response.json())

                super.updateMany(response.json())

            }).catch(err => console.error("Could LOAD JSON", err))

    }

    public deleteViewRecipe(index) {

        return super.get('_design/'+index)
            .then(resp => {

                let model = resp as Base;

                let obj = {
                    _id : model._id,
                    _rev : model._rev
                }

                if(obj._id) {

                    return super._delete(obj);


                } else {
                    return Promise.reject("Error to retrieve to delete");
                }


            }).catch(err => {
                Promise.reject(err);
            });

    }

    //TODO need to test and call
    deleteRecipe(id: string){

        let newRecipes = this.recipes.filter(recipe => recipe.name !== id);

        console.log("Deleted filter", newRecipes);

        this.recipes = newRecipes;
    }
}
