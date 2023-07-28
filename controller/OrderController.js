import {Order} from "../models/Order.js";
import {Order_Item} from "../models/Order_Item.js";
import {OrderDetails} from "../models/OrderDetails.js";
import {handleRefreshAll} from "./DashBoardController.js";
import {handleRefreshTable} from "./RecentOrderDetailsController.js";

var order_item_arr = [];
var cus;
var itm;
var index;
var selectedItemCode;

export class OrderController {

    constructor() {
        $('#customerCmb').on('change', (event) => {
            this.handleCustomerDetails(event.target.value);
        });
        $('#itemCodeCmb').on('change', (event) => {
            this.handleItemDetails(event.target.value);
        });
        $('#orderAddBtn').on('click', () => {
            this.handleValidation();
        });
        $('#placeOrderBtn').on('click', () => {
            this.handleSaveOrder();
        });
        $('#orderDeleteBtn').on('click', () => {
            this.handleDeleteItem();
        });
        this.handleTableClickEvent();
        this.handDateTime();
        this.handleOrderID();
        this.handleLoadCustomerID();
        this.handleLoadItemCode();
        this.handleQty();
    }

    handleOrderID() {

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/order",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                if (resp.data.length === 0) {
                    $('#order_id').text("MD-00001");
                    return;
                }
                let old_arr = resp.data[resp.data.length - 1].orderID;
                let t = old_arr.split("-");
                let x = +t[1];
                x++;
                $('#order_id').text("MD-" + String(x).padStart(5, '0'));
            },
            error: (xhr,x,xs) => {
                console.log(xs);
            }
        });
    }

    handDateTime() {

        let date = new Date();
        let month = eval(date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        day = day.length === 1 ? "0"+day : day;
        month = month.length === 1 ? "0"+month : month;
        $('#date').text(date.getFullYear()+ "-" + month + "-" + day);
    }

    handleLoadCustomerID(){

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/customer",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                $('#customerCmb option').remove();
                $('#customerCmb').append("<option>" + "Choose..." + "</option>");
                resp.data.map((value) => {
                    $('#customerCmb').append("<option>" + value.id + "</option>");
                });
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleLoadItemCode(){

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/item",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                $('#itemCodeCmb option').remove();
                $('#itemCodeCmb').append("<option>" + "Choose..." + "</option>");
                resp.data.map((value) => {
                    $('#itemCodeCmb').append("<option>" + value.itemCode + "</option>");
                });
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });

        document.getElementById('orderDeleteBtn').style.display = "none";
    }

    handleCustomerDetails(id) {

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/customer",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                this.handleCustomerLabelColor('#000');
                resp.data.map((value) => {
                    if (value.id === id) {
                        cus = value;
                        $('#customer_name').text(value.name);
                        $('#customer_address').text(value.address);
                        $('#customer_contact').text(value.contact);

                        $('#customerCmb').css({borderBottom: "1px solid #ced4da"});
                        cus = value;
                    }
                });
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleItemDetails(itemCode) {

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/item",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                this.handleItemLabelColor('#000');
                resp.data.map((value) => {
                    if (value.itemCode === itemCode) {
                        itm = value;
                        $('#des').text(value.description);
                        $('#unit_price').text(value.unitPrice);
                        $('#qty_on_hand').text(value.qtyOnHand);

                        $('#itemCodeCmb').css({borderBottom: "1px solid #ced4da"});
                        itm = value;
                    }
                });
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleValidation() {

        $('#customerCmb :selected').text() === "Choose..." ? (alert("Please select the customer details !"), $('#customerCmb').focus(), $('#customerCmb').css({borderBottom: "2px solid red"})) :
            $('#itemCodeCmb :selected').text() === "Choose..." ? (alert("Please select the item details !"), $('#itemCodeCmb').focus(), $('#itemCodeCmb').css({borderBottom: "2px solid red"})) :
                !/\d+$/.test($('#qty').val()) ? (alert("Qty invalid or empty !"), $('#qty').focus(), $('#qty').css({borderBottom: "2px solid red"})) :
                    parseInt($('#qty').val()) > parseInt($('#qty_on_hand').text()) ? (alert("Noo much qty left www !"), $('#qty').focus(), $('#qty').css({borderBottom: "2px solid red"})) :
                        $('#orderAddBtn').text() === 'Add' ?  this.handleAddItem() : this.handleUpdateItem();
    }

    handleUpdateItem() {

        let index = order_item_arr.findIndex(value => value.item.itemCode === selectedItemCode);

        if ( parseInt($('#qty').val()) > parseInt($('#qty_on_hand').text())) {

            alert("Noo much qty left !");
            $('#qty').focus();
            $('#qty').css({borderBottom: "2px solid red"});
            return ;
        }

        order_item_arr[index] = new Order_Item(itm, $('#qty').val(), $('#qty').val() * $('#unit_price').text());

        $('#orderAddBtn').text('Add'), $('#addBtn').css({background: '#0d6efd', border: '#0d6efd'});

        this.handleLoadTable();
        this.handleClearFunction();
    }

    handleAddItem(){

        let index = this.handleIsExists();

        if (index === -1) {

            order_item_arr.push(new Order_Item(itm, $('#qty').val(), $('#qty').val() * $('#unit_price').text()));

        } else if ((parseInt(order_item_arr[index]._qty) + parseInt($('#qty').val())) > parseInt($('#qty_on_hand').text())) {

            alert("Noo much qty left !");
            $('#qty').focus();
            $('#qty').css({borderBottom: "2px solid red"});

        } else {

            order_item_arr[index]._qty = parseInt(order_item_arr[index]._qty) + parseInt($('#qty').val());
            order_item_arr[index]._total = parseInt(order_item_arr[index]._qty) * parseInt($('#unit_price').text());
        }

        document.getElementById('customerCmb').disabled = true;
        this.handleLoadTable();
        this.handleClearFunction();
    }

    handleClearFunction(){

        document.getElementById("itemCodeCmb").selectedIndex = 0;
        document.getElementById('orderDeleteBtn').style.display = "none";
        $('#orderAddBtn').text('Add');
        $('#orderAddBtn').css({background: '#0d6efd', border: '#0d6efd'});

        $('#des').text('.');
        $('#qty_on_hand').text(".");
        $('#unit_price').text(".");
        $('#qty').val("");

        this.handleItemLabelColor('#fff');

    }

    handleCustomerLabelColor(color){

        $('#customer_name').css({'color': color});
        $('#customer_address').css({'color': color});
        $('#customer_contact').css({'color': color});
    }

    handleDeleteItem(){

        order_item_arr.splice(order_item_arr.findIndex(value => value._item.itemCode === selectedItemCode), 1);

        this.handleLoadTable();
        this.handleClearFunction();

        if (order_item_arr.length === 0){
            document.getElementById("customerCmb").selectedIndex = 0;
            document.getElementById('customerCmb').disabled = false;
            $('#customer_name').text(".");
            $('#customer_address').text(".");
            $('#customer_contact').text(".");
        }
    }

    handleIsExists() {

        return order_item_arr.findIndex(value => value._item.itemCode === $('#itemCodeCmb :selected').text());

    }

    handleSaveOrder() {

        if (order_item_arr.length === 0) {
            alert("Please add the order details first !");
            return;
        }

        let itemArray = [];

        order_item_arr.map(value => {
            itemArray.push(new OrderDetails($('#order_id').text(), value._item.itemCode, value._item.unitPrice, value._qty, value._total));
        });

        let obj = JSON.stringify(new Order($('#order_id').text(), cus.id, $('#date').text(), itemArray));

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/order",
            type: "POST",
            data: obj,
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                if (resp.status === 200){
                    alert(resp.massage);
                    this.handleReloadDetails();
                }else {
                    alert(resp.data);
                }
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleReloadDetails(){

        order_item_arr = [];

        document.getElementById("customerCmb").selectedIndex = 0;
        document.getElementById('customerCmb').disabled = false;
        $('#customer_name').text(".");
        $('#customer_address').text(".");
        $('#customer_contact').text(".");

        this.handleCustomerLabelColor('#fff');

        this.handleLoadTable();
        this.handleOrderID();
        this.handDateTime();
        handleRefreshAll();
        handleRefreshTable();

    }

    handleItemLabelColor(color){

        $('#des').css({'color': color});
        $('#qty_on_hand').css({'color': color});
        $('#unit_price').css({'color': color});
    }

    handleLoadTable() {

        $('#orderTbl tbody tr').remove();

        order_item_arr.map((value) => {
            let row = "<tr>" +
                "<td>" + value._item.itemCode + "</td>" +
                "<td>" + value._item.description + "</td>" +
                "<td>" + value._item.qtyOnHand + "</td>" +
                "<td>" + value._item.unitPrice + "</td>" +
                "<td>" + value._qty + "</td>" +
                "<td>" + value._total + "</td>" +
                "</tr>";

            $('#orderTbl tbody').append(row);

        });
    }

    handleTableClickEvent() {

        $('#orderTbl tbody').on('click', 'tr', (event) => {

            var arr = document.getElementById('itemCodeCmb');
            for (let i = 0; i < arr.length; i++){
                if(arr[i].value === $(event.target).closest('tr').find('td').eq(0).text()){
                    arr.selectedIndex = i;
                }
            }
            selectedItemCode = $(event.target).closest('tr').find('td').eq(0).text();
            $('#des').text($(event.target).closest('tr').find('td').eq(1).text());
            $('#qty_on_hand').text($(event.target).closest('tr').find('td').eq(2).text());
            $('#unit_price').text($(event.target).closest('tr').find('td').eq(3).text());
            $('#qty').val($(event.target).closest('tr').find('td').eq(4).text());

            index = order_item_arr.findIndex(value => value._item.itemCode === $("#itemCodeCmb :selected").text());

            $('#orderAddBtn').text('Update');
            $('#orderAddBtn').css({
                background: '#5f27cd', border: '#5f27cd'
            });
            document.getElementById('orderDeleteBtn').style.display = "inline-block";
        });
    }

    handleQty() {

        $('#qty').on('keyup', () => {
            $('#qty').css({borderBottom: "1px solid #ced4da"});
        });
    }
}
export function handleReloadCustomerDetails() {
    orderController.handleLoadCustomerID();
    orderController.handDateTime();
    orderController.handleReloadDetails();
}
export function handleReloadItemDetails() {
    orderController.handleLoadItemCode();
    orderController.handDateTime();
    orderController.handleReloadDetails();
}

let orderController = new OrderController();