export class Item{
    constructor(itemCode, description, unitPrice, qtyOnHand) {
        this.itemCode = itemCode;
        this.description = description;
        this.unitPrice = unitPrice;
        this.qtyOnHand = qtyOnHand;
    }
    /*get itemCode(){ return this._itemCode}

    set itemCode(itemCode){ this._itemCode = itemCode}

    get description(){ return this._description}

    set description(description){ this._description = description}

    get unitPrice(){ return this._unitPrice}

    set unitPrice(unitPrice){ this._unitPrice = unitPrice}

    get qtyOnHand(){ return this._qtyOnHand}

    set qtyOnHand(qtyOnHand){ this._qtyOnHand = qtyOnHand}*/
}