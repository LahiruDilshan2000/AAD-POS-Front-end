export class OrderDetails{
    constructor(orderID, itemCode, unitPrice, qty, total) {
        this.orderID = orderID;
        this.itemCode = itemCode;
        this.unitPrice = unitPrice;
        this.qty = qty;
        this.total = total;
    }
}