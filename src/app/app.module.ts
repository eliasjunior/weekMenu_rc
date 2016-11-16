import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import {IngredientComponent} from "../pages/ingredient/Ingredient.component";
import {RecipeComponent} from "../pages/recipe/recipe.component";
import {IngredientListComponent} from "../pages/ingredient/Ingredient.list.component";
import {RecipeListComponent} from "../pages/recipe/recipe.list.component";
import {MenuComponent} from "../pages/menu/menu.component";
import {IngredientShoppingListComponent} from "../pages/ingredient/Ingredient.shopping.list.component";
import {SettingsComponent} from "../pages/settings/settings.component";
import {UtilService} from "../pages/services/util.service";
import {IngredientService} from "../pages/ingredient/ingredient.service";
import {RecipeService} from "../pages/recipe/recipe.service";
import {RecipeIngredientShoppingComponent} from "../pages/recipe/recipe.ingredient.shopping.component";
import {IngredientGeneratorComponent} from "../pages/ingredient/ingredient.generator.component";
import {ModalConfirmation} from "../pages/ingredient/modal/modal.confirmation";
import {ModalRecipes} from "../pages/ingredient/modal/modal.recipes";
import {ModalSelectDays} from "../pages/recipe/modal/modal.select.days";

@NgModule({
    declarations: [
        MyApp,
        IngredientComponent,
        IngredientListComponent,
        RecipeComponent,
        RecipeListComponent,
        MenuComponent,
        IngredientShoppingListComponent,
        IngredientGeneratorComponent,
        SettingsComponent,
        RecipeIngredientShoppingComponent,
        ModalConfirmation,
        ModalRecipes,
        ModalSelectDays,
        TabsPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        IngredientComponent,
        IngredientListComponent,
        RecipeComponent,
        RecipeListComponent,
        MenuComponent,
        IngredientShoppingListComponent,
        IngredientGeneratorComponent,
        SettingsComponent,
        RecipeIngredientShoppingComponent,
        ModalConfirmation,
        ModalRecipes,
        ModalSelectDays,
        TabsPage
    ],
    providers: [RecipeService,  IngredientService, UtilService]
})
export class AppModule {}
