import {Ingredient} from "../ingredient.model";
import {Category} from "../category.model";
import {Injectable} from "@angular/core";
import {BaseService} from "../../services/base.service";
import {IngredientApiService} from "./ingredient.api.service";
import {IngredientRecipeAttributes} from "../ingredient.recipe.model";
import "rxjs/add/operator/map";
import {Platform} from "ionic-angular";

/**
 * Created by eliasmj on 08/08/2016.
 */

@Injectable()
export class IngredientService extends BaseService
{

    constructor(public ingredientApiService: IngredientApiService, platform: Platform){
        super(platform)
    }

    getCategories() {
        return this.ingredientApiService
            .getCategory()
    }

    getCategoriesIngredient(recipeId :string) {

        return this.ingredientApiService
            .getCategoryAllWithIngredientRecipe(recipeId)
            .map(response => {
                //let categories = this.convertDocsToCategories(response);
                //console.log(">>>>>> ?", categories)
                return response;
            }).catch(this.errorHandler)

    }

    public getIngredient(id: String) {
        return this.ingredientApiService
            .getIngredient(id)
            .map(this.parseIngredient)
            .catch(this.errorHandler)
    }

    public getCategoryAndIngredientShopping() {
        return this.ingredientApiService
            .getCategoryAndIngredientShopping()
            .map(response => {

                //let categories = this.convertDocsToCategories(response);

                return response;
            }).catch(this.errorHandler)
    }

    public getIngredientRecipeAttributes(ingredientId: String, recipeId: String) {
        return this.ingredientApiService
            .getIngredientRecipeAttributes(ingredientId, recipeId)
            .map(this.parseIngredientRecipeAttributes)
            .catch(this.errorHandler)
    }

    public saveCategory(category: Category) {
        return this.ingredientApiService
            .saveCategory(category)
    }

    public saveIngredient(ingredient: Ingredient, attributes: IngredientRecipeAttributes) {
        return this.ingredientApiService
            .saveIngredient(ingredient, attributes)
    }

    public saveAttributeIngredient(attribute: IngredientRecipeAttributes) {
        return this.ingredientApiService.saveIngredientAttribute(attribute);
    }

    public saveManyAttribute(attributeList: IngredientRecipeAttributes[]) {
        return this.ingredientApiService.saveManyAttributes(attributeList);
    }

    private parseIngredientRecipeAttributes(ingRec) {
        return ingRec;
    }

    private parseIngredient(doc) : Ingredient{

        let ingredient = new Ingredient();
        ingredient.parseIngredient(doc);

        return ingredient;
    }
}
