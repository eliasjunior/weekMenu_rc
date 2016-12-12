import {Ingredient} from "./ingredient.model";
import {Category} from "./category.model";
import {Injectable} from "@angular/core";
import {BaseService} from "../services/base.service";
import {appConstant} from "../constants/app.constant";
import {Recipe} from "../recipe/recipe.model";
import {IngredientApiService} from "./ingredient.api.service";

/**
 * Created by eliasmj on 08/08/2016.
 */

@Injectable()
export class IngredientService extends BaseService
{

    constructor(public ingredientApiService: IngredientApiService){
        super()
    }

    getCategories() {

        return this.ingredientApiService
            .getCatgories()
            .map(this.convertDocsToCategoriesOnly)
            .catch(this.errorHandler)
    }

    getCategoriesIngredient(value :string) {

        return this.ingredientApiService.getListDocs()
            .map(this.convertDocsToCategories)
            .catch(this.errorHandler)

    }

    public getIngredient(id: String) {
        return this.ingredientApiService
            .getIngredient(id)
            .map(this.parseIngredient)
            .catch(this.errorHandler)
    }

    private convertDocsToCategories(docs: any) : Category[]{

        let categories : Category [] = [];
        //need to get the week's menu separated
        docs.forEach(doc => {

            categories.push(this.parseCategory(doc))

        });

        return categories;
    }

    private convertDocsToCategoriesOnly(docs: any) : Category[]{

        console.log("docs", docs)

        let categories : Category [] = [];
        //need to get the week's menu separated
        docs.forEach(doc => {

            let category = new Category();
            category.parseCategory(doc);
            categories.push(category);
        });

        return categories;
    }

    getViewRecipeWeekIngredient (value: string) : Promise<Category[]>{
        //console.log("INGREDIENT_WEEK_INDEX", value)

        return null
        // let categories : Category [] = [];
        // let recipes : Recipe[] = [];
        //
        // return this._db.query(appConstant.INGREDIENT_WEEK_INDEX, {include_docs : true})
        //     .then(viewQuery => {
        //
        //         console.log("****** VIEW QUERY * ", viewQuery)
        //
        //         //remove null, they are deleted, for some reason its coming
        //         let rows = viewQuery.rows.filter(row => row.doc !== undefined)
        //
        //         //console.log("VIEW QUERY * ", rows)
        //
        //         //need to get the week's menu separated
        //         rows.forEach(row => {
        //
        //             if(row.doc.type === appConstant.RECIPE_TYPE) {
        //
        //                 let recipe = new Recipe();
        //                 recipe.parseRecipe(row.doc);
        //
        //                 recipes.push(recipe);
        //             }
        //         });
        //
        //         rows.forEach(row => {
        //
        //             if(row.doc.type === appConstant.CATEGORY_TYPE) {
        //
        //                 let currentRecipeKey = row.key;
        //
        //                 //check if it's in menu week
        //                 if(recipes.find(recipe => recipe._id === currentRecipeKey)) {
        //                     //this create the category and add the ingredients on it.
        //                     categories =
        //                         this.addRowToCategories(
        //                             this.parseCategory(row),
        //                             this.parseIngredient(row),
        //                             categories, currentRecipeKey);
        //
        //                 }
        //             }
        //
        //         });
        //
        //         return Promise.resolve(categories);
        //     })
        //     .catch(reason => {
        //         return Promise.reject(reason);
        //     });
    }

    public addRowToCategories(category: Category, ingredient: Ingredient,
                              categories: Category [], currentRecipeKey?: string) {

        let catIndex = categories.findIndex(cat => cat._id === category._id);

        if(catIndex !== -1) {
            // console.log("CAT ONE MORE ", categories[catIndex].name, "==="+ingredient.name+"===")

            ingredient.setLabelQuantity(currentRecipeKey);

            categories[catIndex]['ingredients'].push(ingredient);

        } else {
            //NEW CAT
            ingredient.setLabelQuantity(currentRecipeKey);
            category.ingredients.push(ingredient);
            categories.push(category);
        }

        return categories;
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

    private parseCategory(doc) : Category {

        if(doc) {
            let category = new Category();
            category.parseCategory(doc);

            if(doc.ingredients && doc.ingredients.length > 0) {
                doc.forEach(ing => {
                    let ingredient = this.parseIngredient(ing);

                    category.ingredients.push(ingredient);
                });
            }

            return category;

        } else {
            console.warn("cat parse, doc is undefined");
            throw new Error("cat parse, doc is undefined")
        }

    }

    private parseIngredient(doc) : Ingredient{

        let ingredient = new Ingredient();
        ingredient.parseIngredient(doc);

        return ingredient;
    }

    linkRecipeToIng(recipeId : string, ingredient: Ingredient) {

        if(!recipeId) {
            console.error("RecipeId null!")
            return;
        }

        if(ingredient.checkedInCartShopping) {

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
