export class Order_Item{
    constructor(item, qty, total) {
        this._item = item;
        this._qty = qty;
        this._total = total;
    }
    get item(){ return this._item}

    set Item(item){ this._item = item}

    get qty(){return this._qty}

    set qty(qty){this._qty = qty}

    get total(){return this._total}

    set total(total){this._total = total}
}