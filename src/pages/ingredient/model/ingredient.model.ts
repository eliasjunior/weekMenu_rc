import {Base} from "../../model/base.model";
import {IngredientRecipeAttributes} from "./ingredient.recipe.model";
/**
 * Created by eliasmj on 05/08/2016.
 */

export class Quantity extends Base {

    typeQuantity: string;
    qtd: number;
    recipeId: string;

    constructor(value?: number, typeQuantity? : string, recipeId? : string)
    {
        super('QUANTITY');

        this.qtd = value;
        this.typeQuantity = typeQuantity;
        this.recipeId = recipeId;
    }

    public parseIngredient(responseQuantity) {
        super.parse(responseQuantity);

        this.qtd = responseQuantity.qtd;
        this.typeQuantity = responseQuantity.typeQuantity;
        this.recipeId = responseQuantity.recipeId;
    }
}

export class Ingredient extends Base {

    _creator: string;
    ing_type: string;
    checkedInCartShopping: boolean = false;
    quantities: Quantity [] = [];
    expiryDate: string;
    verify: boolean = false;
    quantityUnitName: string;
    updateCheckDate: Date;

    tempRecipeLinkIndicator:boolean;

    attributes: IngredientRecipeAttributes[];

    constructor()
    {
        super('INGREDIENT');
    }

    public parseIngredient(responseIngredient) {

        super.parse(responseIngredient);

        this._creator = responseIngredient._creator;
        this.ing_type = responseIngredient.ing_type;
        this.expiryDate = responseIngredient.expiryDate;
        this.verify = responseIngredient.verify;
        this.checkedInCartShopping = responseIngredient.isInMenuWeek;
        this.updateCheckDate = responseIngredient.updateCheckDate;
        this.tempRecipeLinkIndicator = responseIngredient.tempRecipeLinkIndicator;

        if(responseIngredient.quantities) {

            responseIngredient.quantities.forEach(quantRow => {

                let quantity = new Quantity();
                quantity.parseIngredient(quantRow);
                this.quantities.push(quantity);

            });
        }
    }


    public setLabelQuantity(recipeId: string) {
        if(recipeId) {
            let quantity: Quantity = this.quantities.find(quantity => {
                return quantity.recipeId === recipeId
            });

            if(quantity) {
                this.quantityUnitName = quantity.qtd + " " + quantity.typeQuantity + ", *" + recipeId
            }else {
                this.quantityUnitName =" *" + recipeId
            }

          //  console.log("quantityUnitName "+ this.name, this.quantityUnitName, quantity)
        }
    }

}
