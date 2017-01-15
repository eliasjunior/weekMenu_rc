import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import {RecipeService} from "../pages/recipe/recipe.service";
import {IngredientService} from "../pages/ingredient/services/ingredient.service";
import {UtilService} from "../pages/services/util.service";




@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage = TabsPage;

    constructor(
        platform: Platform,
        recipeService : RecipeService,
        ingredientService : IngredientService,
        utilService: UtilService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

        // recipeService.initDB();
        // ingredientService.initDB();

        StatusBar.styleDefault();
        Splashscreen.hide();
    });
  }
}
