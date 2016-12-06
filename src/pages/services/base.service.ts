/**
 * Created by eliasmj on 05/08/2016.
 */
import 'rxjs/add/observable/fromPromise';
import {Observable} from "rxjs";
import {Toast, ToastOptions} from "ionic-native";

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import PouchMemory from 'pouchdb-adapter-memory'
import {appConstant} from "../constants/app.constant";

export class BaseService {

    protected _db;

    protected allDocs;

    constructor() {
        //for chrome
        window["PouchDB"] = PouchDB;
        PouchDB.plugin(PouchMemory);
        PouchDB.plugin(PouchDBFind);
    }

    public initDB () {

        this._db = new PouchDB('weekmenu', {adapter: 'websql'});
        //this._db = new PouchDB('weekmenu', {adapter: 'memory'});

        //PouchDB.debug.enable('*');
        //PouchDB.debug.disable();

        this._db.on('error', function (err) {
            console.error("DB ERROR **********")
            console.error(err)
            console.error('***************** END error log');
        });
    }

    syncDataBase(){
        return this._db.replicate.to('http://192.168.0.12:5984/weekmenu');
    }

    importSyncDataBase(){
        // return this._db.replicate.from('http://192.168.0.12:5984/weekmenu');
        return this._db.replicate.from('http://10.157.196.224:5984/weekmenu');
    }

    public getIndexes() {
        this._db.getIndexes()
            .then(response => {
                console.log("result", response)
            }).catch(reason => this.handleError('Problem to get the indexes', reason));
    }

    public message(message) {

        let options : ToastOptions =  {
            styling : {backgroundColor : '#32db64'},
            message : message,
            position: 'top'
        } ;

        Toast.showWithOptions(options)
            .subscribe(null, err => {
                console.error("toast failed", err);
            });
    }

    public messageError(message) {

        let options : ToastOptions =    {
            styling : {backgroundColor : '#ed0c0c'},
            message : message,
            position: 'top'
        } ;

        console.log("Should show toast error message")

        Toast.showWithOptions(options)
            .subscribe(null, err => {
                console.error("toast failed", err);
            });
    }

    deleteDb() {
        return this._db.destroy().then(function (response) {
            // success
            console.log("DB Success deleted");

            return Promise.resolve('Deleted');

        }).catch(function (err) {
            console.log('error to delete db', err);
            return Promise.reject('error to delete db');
        });
    }

    add(object) {

        /*
         * You should also prefer put() to post(),
         * because when you post(),
         * you are missing an opportunity to use allDocs() to sort documents by _id (because your _ids are random).
         * For more info, read the PouchDB pro tips.
         * */

        object._id = object._id.trim();
        object.updateDate = new Date();

        if(object.name) {
            object.name = object.name.trim();
        }

        return this._db.put(object);
    }

    update(object) {

        let id = object._id || object;

        return this._db.get(id)
            .then( doc => {
                //update via _rev
                object._rev = doc._rev;
                object.updateDate = new Date();
                return this._db.put(object)
            }).catch(err =>  {
                console.error("Failed to get on update", err);
               // throwError(err);
            } );
    }

    updateIndex(designDoc) {

        this.get(designDoc._id)
            .then(docGet => {

                designDoc._rev = docGet._rev;

                console.log("get to update", designDoc)

                this._db.put(designDoc)
                    .then(doc => this.createdViewLogs(doc))
                    .catch(err =>
                    {
                        if (err.name !== 'conflict') {
                            throw err;
                        }
                        console.log("conflict to update",err)
                        // ignore if doc already exists
                    });
            })
            .catch(reason => {

                if(reason.name = "not_found") {

                    console.log("Failed to update, not found, trying to create")

                    this.add(designDoc)
                        .then(response => {
                            console.log('view created', response);
                        })
                        .catch(reason => {
                           console.error("create view failed", reason);
                        });
                } else {
                    console.error("Failed to update", reason)
                }
            });
    }

    updateMany(docs) {
        console.log("BULK", docs)
        return this._db.bulkDocs(docs);
    }

    getMany(docs) {
        console.log("GET MANY", docs);
        return this._db.bulkGet(docs);
    }

    //TODO could be useful
    updateArray(id : string, arrayName: string, item) {

        console.log("updating array", id, arrayName, item);

        return this._db.get(id)
            .then( doc => {
                //update via _rev
                doc._rev = doc._rev;

                if(!doc[arrayName].find(id => id === item)) {
                    doc[arrayName].push(item);
                } else {
                    console.log("Id already linked");
                }

                return this._db.put(doc);
            }).catch(reason => console.error("Error to get", reason));
    }

    addArray(id: string, arrayName: string, ids: string[]) {
        console.log("adding to array", id, arrayName, ids);

        return this._db.get(id)
            .then( doc => {
                //update via _rev
                doc._rev = doc._rev;
                doc[arrayName] = ids;

                return this._db.put(doc);
            }).catch(reason => console.error("Error to get", reason));
    }

    _delete(object) {

        console.log("deleting", object);

        object._deleted = true;
        return this.update(object);

        //if you this it wont delete all rows
       // return this._db.remove(object);
    }

    _deleteMany(objectArray) {

        objectArray.forEach(object =>{
           object._deleted = true;
        });

        return this.updateMany(objectArray);
    }

    get(value) {
        return this._db.get(value);
    }

    getAll(type) {

         var observable = Observable.fromPromise(this._db.allDocs({ include_docs: true})
             .then(docs => {
                 //   console.log("RAW", docs)

                 // this.allDocs = docs.rows.map(row => {
                 //     //Dates are not automatically converted from a string.
                 //     //row.doc.Date = new Date(row.doc.Date);
                 //     return row.doc;
                 // });

                 this.allDocs = docs.rows.map(row => {
                     //Dates are not automatically converted from a string.
                     //row.doc.Date = new Date(row.doc.Date);

                     if(row.doc.type === type) {

                         return row.doc;
                     }
                 }).filter(doc => doc !== undefined);

                 this._db.changes({
                     filter: function (doc) {
                         return doc.deleted === true;
                     },
                     include_docs: true,
                     since: 'now'
                 }).on('change', this.onDataBaseChange);;


                 //console.log("All docs, type=" + type, this.allDocs);

                 return this.allDocs;
             }));
         return observable;
    }


    private onDataBaseChange(doc) {

        if(doc.type === "RECIPE") {
            console.log("RECIPE")

            //if deleted recipe, category.recipe_ids
        } else  if(doc.type === "CATEGORY") {
            console.log("CATEGORY");

            //need to delete ingredient
            //need to delete cats_ids

            //fetch recipe.
            //delete id from ingredient_ids

            //How to get the recipe with no ID!!

            //delete all ingredients ?

        }else  if(doc.type === "INGREDIENT") {
            //recipe.ingredient_ids
        }
    }

    public createDesignDoc(name, mapFunction) {
        var ddoc = {
            _id: '_design/' + name,
            views: {}
        }

        ddoc.views[name] = { map: mapFunction.toString() };
        return ddoc;
    }

    public createNewView() {
        this._db.createIndex({
            index: {
                fields: [appConstant.CAT_INGREDIENT_INDEX, appConstant.INGREDIENT_WEEK_INDEX, appConstant.RECIPE_INDEX ],
            }
        }).then(response => {console.log("response new plugin", response)})
            .catch(reason => this.handleError('index', reason));

    }

    public find() {
        this._db.find({
            selector: {name: '_design/' + appConstant.CAT_INGREDIENT_INDEX}
        }).then(function (result) {
            console.log("TEST PLUGIN", result);
        }).catch(reason => this.handleError('test', reason));
    }

    private createdViewLogs(doc) {
        console.log("Design view create ", doc)
    }

    private handleError(message, reason) {
        console.error(message, reason);
    }

}


// conflits
// db.get('config').catch(function (err) {
//     if (err.name === 'not_found') {
//         return {
//             _id: 'config',
//             background: 'blue',
//             foreground: 'white',
//             sparkly: 'false'
//         };
//     } else { // hm, some other error
//         throw err;
//     }
// }).then(function (configDoc) {
//     // sweet, here is our configDoc
// }).catch(function (err) {
//     // handle any errors
// });
