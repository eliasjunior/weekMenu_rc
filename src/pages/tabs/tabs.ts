import { Component } from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {IngredientShoppingListComponent} from "../ingredient/components/Ingredient.shopping.list.component";
import {SettingsComponent} from "../settings/settings.component";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MenuComponent;
  tab2Root: any = IngredientShoppingListComponent;
  tab3Root: any = SettingsComponent;

  constructor() {

  }
}
