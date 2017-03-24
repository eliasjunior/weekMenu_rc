import {Base} from "../../model/base.model";
/**
 * Created by eliasmj on 14/12/2016.
 */

export class IngredientRecipeAttributes extends Base
{

    labelQuantity: string;
    quantity: number;
    itemSelectedForShopping: boolean;
    ingredientId : string;
    recipeId : string

    constructor()
    {
        super('IngredientRecipeAttributes')
    }

}