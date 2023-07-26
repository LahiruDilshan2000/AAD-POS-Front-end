export class Order{
    constructor(orderId, customer, itemArray, orderDate) {
        this._orderId = orderId;
        this._customer = customer;
        this._itemArray = itemArray;
        this._orderDate = orderDate;
    }
    get orderId(){ return this._orderId}

    set orderId(orderId){ this._orderId = orderId}

    get customer(){ return this._customer}

    set customer(customer){ this._customer = customer}

    get itemArray(){ return this._itemArray}

    set itemArray(itemArray){ this._itemArray = itemArray}

    get orderDate(){ return this._orderDate}

    set orderDate(orderDate){ this._orderDate = orderDate}
}