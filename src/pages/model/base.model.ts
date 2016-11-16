/**
 * Created by eliasmj on 02/09/2016.
 */

export class
Base
{

    public name;
    public _deleted;
    public _rev;
    public _id;
    public type;
    public updateDate;

    constructor(type: string)
    {
        this.type = type;
    }

    parse(doc) {

        this.name = doc.name;
        this._id = doc._id;
        this._rev = doc._rev;
        this._deleted = doc._deleted;
        this.updateDate = doc.updateDate;
    }
}
