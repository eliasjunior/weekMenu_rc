import {Base} from "../model/base.model";
import {appConstant} from "../constants/app.constant";
/**
 * Created by eliasmj on 04/09/2016.
 */

export class RecipeIng extends Base
{

    recipe_id : string
    ingredient_id: string

    constructor()
    {
        super(appConstant.RECIPE_ING_TYPE)
    }
}

