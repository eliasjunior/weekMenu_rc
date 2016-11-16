import {Ingredient} from "./ingredient.model";
import {Category} from "./category.model";
import {Injectable} from "@angular/core";
import {BaseService} from "../services/base.service";
import {appConstant} from "../constants/app.constant";
import {Recipe} from "../recipe/recipe.model";

/**
 * Created by eliasmj on 08/08/2016.
 */

@Injectable()
export class IngredientService extends BaseService
{


    createView() {
        this.createViewRecipeWeekIngredient();
        //to add the index its O(n), Its runs N docs per DB, during the insertion couchDB add the index to a b-tree, and then running in log(n)
        this.createViewCatIngredient();
    }

    getCategories() {
        return super.getAll("CATEGORY");
    }

    getCategoriesIngredient(value :string) {

        let options : any = {include_docs : true};

        if(value !== null) {
            options.key = value;
            console.log("Search key cat", value)
        }

        return this._db.query(appConstant.CAT_INGREDIENT_INDEX, options)
            .then(response => {
                console.log("getCategoriesIngredient view", response)
                return Promise.resolve(this.populateCategory(response.rows))
            })
            .catch(reason => {
                console.error("Error getting view getCategoriesIngredient", reason);
                return Promise.reject(reason);
            });
    }

    getViewRecipeWeekIngredient (value: string) : Promise<Category[]>{
        //console.log("INGREDIENT_WEEK_INDEX", value)

        let categories : Category [] = [];
        let recipes : Recipe[] = [];

        return this._db.query(appConstant.INGREDIENT_WEEK_INDEX, {include_docs : true})
            .then(viewQuery => {

                console.log("****** VIEW QUERY * ", viewQuery)

                //remove null, they are deleted, for some reason its coming
                let rows = viewQuery.rows.filter(row => row.doc !== undefined)

                //console.log("VIEW QUERY * ", rows)

                //need to get the week's menu separated
                rows.forEach(row => {

                    if(row.doc.type === appConstant.RECIPE_TYPE) {

                        let recipe = new Recipe();
                        recipe.parseRecipe(row.doc);

                        recipes.push(recipe);
                    }
                });

                rows.forEach(row => {

                    if(row.doc.type === appConstant.CATEGORY_TYPE) {

                        let currentRecipeKey = row.key;

                        //check if it's in menu week
                        if(recipes.find(recipe => recipe._id === currentRecipeKey)) {
                            //this create the category and add the ingredients on it.
                            categories =
                                this.addRowToCategories(
                                    this.parseCategory(row),
                                    this.parseIngredient(row),
                                    categories, currentRecipeKey);

                        }
                    }

                });

                return Promise.resolve(categories);
            })
            .catch(reason => {
                return Promise.reject(reason);
            });
    }

    public addRowToCategories(category: Category, ingredient: Ingredient,
                              categories: Category [], currentRecipeKey?: string) {

        let catIndex = categories.findIndex(cat => cat._id === category._id);

        if(catIndex !== -1) {
            // console.log("CAT ONE MORE ", categories[catIndex].name, "==="+ingredient.name+"===")

            ingredient.setLabelQuantity(currentRecipeKey);

            categories[catIndex]['ingredients'].push(ingredient);

            // //check if the ingredient is already in the list, if so NEED to sum the quantity
            // let ingIndex = categories[catIndex]['ingredients'].findIndex(ing => ing._id === ingredient._id);
            //
            // //not repeat ingredient in the cat
            // if(ingIndex === -1) {
            //     //add ingredient to the category, same category
            //     categories[catIndex]['ingredients'].push(ingredient);
            // } else {
            //     //sum the quantity
            //     let ingredientIn = categories[catIndex]['ingredients'][ingIndex];
            //
            //     //in case repeats the recipe
            //     ingredientIn.setSumQuantity(currentRecipeKey)
            // }

        } else {
            //NEW CAT
            ingredient.setLabelQuantity(currentRecipeKey);
            category.ingredients.push(ingredient);
            categories.push(category);
        }

        return categories;
    }

    public convertIdIngredientTocategories(ids: string) {


       // let categories : Category [] = [];

          //TODO
         //TODO
        //TODO create view to get ingredient by id and category

    }

    insertCategory(category: Category) {
        category._id = category.name;

        category.name = category.name.toLowerCase();
        return super.add(category);

    }

    updateCategory(category) {

        return super.update(category);
    }

    insertIngredient(ingredient: Ingredient, category :Category) {

        //Ingredient cat setting
        ingredient.categoryId = category._id;
        category._rev = category._rev;

        ingredient._id = ingredient.name;

        ingredient.ing_type = category._id + "_"+ingredient._id;

        console.log("Inserting!", ingredient);

        return super.add(ingredient);
    }

    updateIngredient(ingredient: Ingredient) {
        return super.update(ingredient);
    }

    //could be useful, dont delete right now
    linkRecipeToIngList(recipeId : string, ingredients: Ingredient[]) {

        ingredients.forEach(ingredient => {

            if(!ingredient.recipe_ids) {
                ingredient.recipe_ids = [];
            }

            ingredient.recipe_ids.push(recipeId);
        });

        return super.updateMany(ingredients);
    }


    public parseCategory(row) : Category {

        if(row.doc) {
            let category = new Category();
            category.parseCategory(row.doc);
            return category;

        } else {
            console.warn("cat parse, doc is undefined");
            throw new Error("cat parse, doc is undefined")
        }

    }

    public parseIngredient(row) : Ingredient{

        let ingredient = new Ingredient();
        ingredient.parseIngredient(row.value.ingredient);

        return ingredient;
    }

    linkRecipeToIng(recipeId : string, ingredient: Ingredient) {

        if(!recipeId) {
            console.error("RecipeId null!")
            return;
        }

        if(ingredient.checked) {

            ingredient.recipe_ids.push(recipeId);

        } else {
            ///another way and then using  let index = ingredient.recipe_ids.indexOf(recipeId); splice(index,1)

            //if the check is false, it meas that should remove the recipeId from the current array
            //then add the new array filtered without it.
            let newRecipeIds = ingredient.recipe_ids.filter(id => id !== recipeId);

            ingredient.recipe_ids = newRecipeIds;
        }

        return super.update(ingredient);
    }


    private createViewRecipeWeekIngredient() {

        //gambiarra watch typescript
        function emit(p,w){};
        let log;
        //**

        var mapFunc = function mapFun(doc) {

            log("**************************")
            log(doc)
            log("*************************END")

             if(doc.type === "INGREDIENT" && doc.shopping)
            {
                //log(doc.name +", doc.recipe_ids >>>>>>>" + doc.recipe_ids)
                for(var idx in doc.recipe_ids) {

                    emit(doc.recipe_ids[idx], {_id : doc.categoryId, ingredient: doc});

                }
            } else if(doc.type === "RECIPE" && doc.checked){
                    //log("RECIPES name >>>>>>>" + doc.name)
                    emit(doc._id, null);
            }

        }
        // save the design doc
        super.updateIndex(super.createDesignDoc(appConstant.INGREDIENT_WEEK_INDEX, mapFunc));
    }

    private createViewCatIngredient() {

        //gambiarra watch typescript
        function emit(p,w){};
        let log;
        //**

        var mapFunc = function mapFun(doc) {

            // join category data to ingredients
            if (doc.type === 'INGREDIENT' && !doc.deleted) {

                log("****** ingredient " +doc.name )
                emit(doc.categoryId, {_id : doc.categoryId, ing_type: doc.ing_type, ingredient : doc});
            }

        }
        // save the design doc
        super.updateIndex(super.createDesignDoc(appConstant.CAT_INGREDIENT_INDEX, mapFunc));
    }

    private populateCategory(rows) {

        let categoryList : Category [] = [];
        //doc category , key ingredient,
        rows.forEach(row => {

            // console.log("ROW", row)
            // console.log("Cat", row.doc.name , row.doc.type)
            // console.log("Ingred", row.value.ingredient)

            if(row.doc) {

                let catIndex = categoryList.findIndex(category => category._id === row.doc._id);

                if(catIndex === -1) {

                    let ingredient= new Ingredient();
                    ingredient.parseIngredient(row.value.ingredient);

                    let category = new Category();
                    category.parseCategory(row.doc);
                    category.ingredients.push(ingredient);

                    categoryList.push(category);

                } else {

                    let ingredient = new Ingredient();
                    ingredient.parseIngredient(row.value.ingredient);

                    categoryList[catIndex]['ingredients'].push(ingredient);
                }

            } else {
                console.warn(" Nasty PouchDb, deleted row in the query", row);
            }

        });

        return categoryList;
    }
}
