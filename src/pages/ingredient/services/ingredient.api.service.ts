import {Injectable} from "@angular/core";
import {BaseApiService} from "../../services/base.api.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Category} from "../category.model";
import {Ingredient} from "../ingredient.model";
import {IngredientRecipeAttributes} from "../ingredient.recipe.model";
import {UtilService} from "../../services/util.service";

@Injectable()
export class IngredientApiService extends BaseApiService {

    private categories : Category [] = [];

    constructor(public http: Http, private utilService: UtilService) {
        super()
    }

    // private recipes : Recipe[];
    public getCategoryAllWithIngredientRecipe(recipeId: string) {

        if(this.categories && this.categories.length === 0) {

            return this.http
                .get(this.utilService.host + "/category/check/"+recipeId)
                .map(this.extractData)
                .catch(this.handleError)

        } else {
            return Observable.create(observer => {
                observer.next(this.categories);
                observer.complete();
            });
        }
    }

    public getCategoryAndIngredientShopping() {

        return this.http
            .get(this.utilService.host + "/category/week/shopping")
            .map(this.extractData)
            .catch(this.handleError)

    }


    public getIngredient(id: String){
        return this.http
            .get(this.utilService.host + "/ingredient/"+id)
            .map(this.extractData)
            .catch(this.handleError)
    }

    public getCategory(){
        return this.http
            .get(this.utilService.host + "/category")
            .map(this.extractData)
            .catch(this.handleError)
    }

    public getIngredientRecipeAttributes(ingredientId, recipeId) {
        return this.http
            .get(this.utilService.host + "/ingredient/recipe/"+ingredientId+"/"+recipeId)
            .map(this.extractData)
            .catch(this.handleError)
    }



    public saveCategory(category: any) {
        //TODO not sure
        this.categories = [];

        if(category._id) {

            return this.http
                .put(this.utilService.host + "/category", category,  this.getHeadersOption())
                .map(this.extractData)
                .catch(this.handleError)

        } else {

            return this.http
                .post(this.utilService.host + "/category", category,  this.getHeadersOption())
                .map(this.extractData)
                .catch(this.handleError)
        }


    }

    public saveIngredient(ingredient: Ingredient, ingredientRecipe: IngredientRecipeAttributes) {

        let ingredientCommand = {ingredient:ingredient , ingredientRecipeAttributes: ingredientRecipe};

        this.categories = [];

        if(ingredient._id) {

            return this.http
                .put(this.utilService.host + "/ingredient", ingredientCommand,  this.getHeadersOption())
                .map(this.extractData)
                .catch(this.handleError);
        } else {

            return this.http
                .post(this.utilService.host + "/ingredient", ingredientCommand,  this.getHeadersOption())
                .map(this.extractData)
                .catch(this.handleError);
        }
    }

    public saveIngredientAttribute(attribute: IngredientRecipeAttributes) {
        if(attribute._id) {
            return this.http
                .put(this.utilService.host + "/ingredient/attribute", attribute, this.getHeadersOption())
                .map(this.extractData)
                .catch(this.handleError)
        }
    }

    public saveManyAttributes(attributes: IngredientRecipeAttributes []) {
        return this.http
            .put(this.utilService.host + "/ingredient/attribute/many", attributes, this.getHeadersOption())
            .map(this.extractData)
            .catch(this.handleError)
    }
}
