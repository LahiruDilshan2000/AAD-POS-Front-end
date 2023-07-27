export class Order{
    constructor(orderID, customerID, orderDate, itemArray) {
        this.orderID = orderID;
        this.customerID = customerID;
        this.orderDate = orderDate;
        this.itemArray = itemArray;
    }
    /*get orderId(){ return this._orderId}

    set orderId(orderId){ this._orderId = orderId}

    get customer(){ return this._customer}

    set customer(customer){ this._customer = customer}

    get itemArray(){ return this._itemArray}

    set itemArray(itemArray){ this._itemArray = itemArray}

    get orderDate(){ return this._orderDate}

    set orderDate(orderDate){ this._orderDate = orderDate}*/
}