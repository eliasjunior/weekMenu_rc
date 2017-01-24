import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {BaseApiService} from "../../services/base.api.service";
import {Recipe} from "../recipe.model";
import {Ingredient} from "../../ingredient/ingredient.model";
import {UtilService} from "../../services/util.service";

@Injectable()
export class RecipeApiService extends BaseApiService{

    private recipes : any;

    constructor(public http: Http,
                private utilService: UtilService) {
        super()
    }

    // private recipes : Recipe[];
    public geRecipeDocs() {

        if(!this.recipes) {

            return this.http
                .get(this.utilService.host + "/recipe")
                .map(this.extractData)
                .catch(this.handleError)

        } else {
            return Observable.create(observer => {
                observer.next(this.recipes);
                observer.complete();
            });
        }
    }

    public get(id: String){
        return this.http
            .get(this.utilService.host + "/recipe/"+id)
            .map(this.extractData)
            .catch(this.handleError)
    }

    public saveRecipe(recipe: Recipe){

        //add date to the recipes
        recipe.menus = [];

        if(recipe._id) {

            return this.http
                .put(this.utilService.host + "/recipe", recipe,  this.getHeadersOption())
                .map(this.extractData)
                .catch(this.handleError)

        } else {

            return this.http
                .post(this.utilService.host + "/recipe", recipe,  this.getHeadersOption())
                .map(this.extractData)
                .catch(this.handleError)
        }
    }

    public linkRecipeToCategory(recipeId: string, ingredient: Ingredient) {

        let requestPayLod = {
            _id: recipeId, ingredient : ingredient
        }

        return this.http
            .put(this.utilService.host + "/recipe/ingredient", requestPayLod,  this.getHeadersOption())
            .map(this.extractData)
            .catch(this.handleError)

    }

    public getRecipeCategories(recipeId: string) {
        return this.http
            .get(this.utilService.host + "/recipe/category/"+recipeId)
            .map(this.extractData)
            .catch(this.handleError)
    }

    public getRecipeAttributes(recipeId) {
        return this.http
            .get(this.utilService.host + "/recipe/category/currentAttribute/"+recipeId)
            .map(this.extractData)
            .catch(this.handleError)
    }
}
