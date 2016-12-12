import {Injectable} from "@angular/core";
import {BaseApiService} from "../services/base.api.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Category} from "./category.model";

@Injectable()
export class IngredientApiService extends BaseApiService {

    private categories : Category [] = [];

    constructor(public http: Http) {
        super()
    }

    // private recipes : Recipe[];
    public getListDocs() {

        if(!this.categories) {

            return this.http
                .get(this.host + "/category")
                .map(this.extractData)
                .catch(this.handleError)

        } else {
            return Observable.create(observer => {
                observer.next(this.categories);
                observer.complete();
            });
        }
    }

    getIngredient(id: String){
        return this.http
            .get(this.host + "/ingredient/"+id)
            .map(this.extractData)
            .catch(this.handleError)
    }

    getCategory(id: String){
        return this.http
            .get(this.host + "/category/"+id)
            .map(this.extractData)
            .catch(this.handleError)
    }

    getCatgories(){
        return this.http
            .get(this.host + "/category")
            .map(this.extractData)
            .catch(this.handleError)
    }

}
