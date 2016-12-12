import {Injectable} from "@angular/core";
import {IngredientService} from "../ingredient/ingredient.service";
import {RecipeService} from "../recipe/recipe.service";
//import {appConstant} from "../constants/app.constant";

@Injectable()
export class UtilService {
    constructor(
                public recipeService : RecipeService,
                public ingredientService : IngredientService) {

    }

}
