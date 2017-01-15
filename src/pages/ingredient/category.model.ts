import {Ingredient} from "./ingredient.model";
import {Base} from "../model/base.model";
/**
 * Created by eliasmj on 11/08/2016.
 */

export class Category extends Base
{

    private recipe_ids : string [] = [];
    recipeId: string;
    ingredients : Ingredient [] = [];//to display only

    constructor()
    {
        super('CATEGORY')
    }

    setRecipeIds(newId: string) {

        if(!this.recipe_ids.find(id => id === newId)) {
            this.recipe_ids.push(newId);
        }
    }

    //check it if the ingredient is already in the array if not add to it
    setIngredient(ingredient: Ingredient) {

        let found = this.ingredients.find(ing => ing._id === ingredient._id);
        if(this.ingredients && !found) {
            this.ingredients.push(ingredient);
        }
    }

    public parseCategory(responseCat) {

        try {

            super.parse(responseCat);

            this.name = responseCat.name.toUpperCase();

        }catch (e) {
            console.error('cat parse error', e)
        }

    }
}
