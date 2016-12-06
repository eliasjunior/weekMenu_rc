import {Base} from "../model/base.model";
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

    categoryId: string;
    ing_type: string;
    recipe_ids: string [] = [];
    checked: boolean = false;
    quantities: Quantity [] = [];
    expiryDate:string;
    verify:boolean = false;
    labelQuantity: string;
    updateCheck: Date;
    shopping: boolean;


    constructor()
    {
        super('INGREDIENT');
    }

    public parseIngredient(responseIngredient) {

        super.parse(responseIngredient);

        this.categoryId = responseIngredient.categoryId;
        this.ing_type = responseIngredient.ing_type;
        this.expiryDate = responseIngredient.expiryDate;
        this.verify = responseIngredient.verify;
        this.checked = responseIngredient.checked;
        this.updateCheck = responseIngredient.updateCheck;


        this.shopping = responseIngredient.shopping;

        //console.log("??" + this.name, this.shopping)

        // if(isUndefined(responseIngredient.shopping)) {
        //    // this.shopping = true;
        // } else {
        //
        // }

        if(responseIngredient.quantities) {

            responseIngredient.quantities.forEach(quantRow => {

                let quantity = new Quantity();
                quantity.parseIngredient(quantRow);
                this.quantities.push(quantity);

            });
        }

        if (!responseIngredient.recipe_ids) {
            this.recipe_ids = [];
        } else {
            this.recipe_ids = responseIngredient.recipe_ids;
        }
    }


    public setLabelQuantity(recipeId: string) {
        if(recipeId) {
            let quantity: Quantity = this.quantities.find(quantity => {
                return quantity.recipeId === recipeId
            });

            if(quantity) {
                this.labelQuantity = quantity.qtd + " " + quantity.typeQuantity + ", *" + recipeId
            }else {
                this.labelQuantity =" *" + recipeId
            }

          //  console.log("labelQuantity "+ this.name, this.labelQuantity, quantity)
        }
    }

    getUpdateCheck(){

        if(this.updateCheck){
            let myDate: Date = new Date(this.updateCheck.toString())

            let formatted = myDate.getDate()
                + "/" + (myDate.getMonth() + 1)
                +"/" + myDate.getFullYear()
                + " " + myDate.getHours()
                + ":" + myDate.getMinutes();

            return formatted;
        } else
            return "";
    }

}
