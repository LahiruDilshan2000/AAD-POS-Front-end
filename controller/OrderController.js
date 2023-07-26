import {Order} from "../models/Order.js";
import {Order_Item} from "../models/Order_Item.js";
import {getAllDB, saveOrderDB} from "../db/DB.js";
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
        this.handleComboBox();
        this.handleQty();
    }

    handleOrderID() {

        let arr = getAllDB("ORDER");
        if (arr.length === 0) {
            $('#order_id').text("MD-00001");
            return;
        }
        let old_arr = arr[arr.length - 1]._orderId;
        let t = old_arr.split("-");
        let x = +t[1];
        x++;
        $('#order_id').text("MD-" + String(x).padStart(5, '0'));
    }

    handDateTime() {

        var date = new Date();
        $('#date').text(date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear());
    }

    handleComboBox() {

        getAllDB("ITEM").map((value) => {
            $('#itemCodeCmb').append("<option>" + value._itemCode + "</option>");
        });

        getAllDB("DATA").map((value) => {
            $('#customerCmb').append("<option>" + value._id + "</option>");
        });

        document.getElementById('orderDeleteBtn').style.display = "none";
    }

    handleCustomerDetails(id) {

        getAllDB("DATA").map((value) => {
            if (value._id === id) {
                cus = value;
                $('#customer_name').text(value._id);
                $('#customer_address').text(value._address);
                $('#customer_contact').text(value._contact);

                $('#customerCmb').css({borderBottom: "1px solid #ced4da"});
                cus = value;
            }
        });
    }

    handleItemDetails(itemCode) {

        getAllDB("ITEM").map((value) => {
            if (value._itemCode === itemCode) {
                itm = value;
                $('#des').text(value._description);
                $('#unit_price').text(value._unitPrice);
                $('#qty_on_hand').text(value._qtyOnHand);

                $('#itemCodeCmb').css({borderBottom: "1px solid #ced4da"});
                itm = value;
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

        let index = order_item_arr.findIndex(value => value._item._itemCode === selectedItemCode);

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

    }

    handleDeleteItem(){

        order_item_arr.splice(order_item_arr.findIndex(value => value._item._itemCode === selectedItemCode), 1);

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

        return order_item_arr.findIndex(value => value._item._itemCode === $('#itemCodeCmb :selected').text());

    }

    handleSaveOrder() {

        if (order_item_arr.length === 0) {
            alert("Please add the order details first !");
            return;
        }

        saveOrderDB(new Order($('#order_id').text(), cus, order_item_arr, $('#date').text()));

        order_item_arr = [];

        document.getElementById("customerCmb").selectedIndex = 0;
        document.getElementById('customerCmb').disabled = false;
        $('#customer_name').text(".");
        $('#customer_address').text(".");
        $('#customer_contact').text(".");

        this.handleLoadTable();
        this.handleOrderID();
        handleRefreshAll();
        handleRefreshTable();
    }

    handleLoadTable() {

        $('#orderTbl tbody tr').remove();

        order_item_arr.map((value) => {
            var row = "<tr>" +
                "<td>" + value._item._itemCode + "</td>" +
                "<td>" + value._item._description + "</td>" +
                "<td>" + value._item._qtyOnHand + "</td>" +
                "<td>" + value._item._unitPrice + "</td>" +
                "<td>" + value._qty + "</td>" +
                "<td>" + value._total + "</td>" +
                "</tr>";

            $('#orderTbl tbody').append(row);

        });
    }

    handleTableClickEvent() {

        $('#orderTbl tbody').on('click', 'tr', (event) => {

            var arr = document.getElementById('itemCodeCmb');
            for (var i = 0; i < arr.length; i++){
                if(arr[i].value === $(event.target).closest('tr').find('td').eq(0).text()){
                    arr.selectedIndex = i;
                }
            }
            selectedItemCode = $(event.target).closest('tr').find('td').eq(0).text();
            $('#des').text($(event.target).closest('tr').find('td').eq(1).text());
            $('#qty_on_hand').text($(event.target).closest('tr').find('td').eq(2).text());
            $('#unit_price').text($(event.target).closest('tr').find('td').eq(3).text());
            $('#qty').val($(event.target).closest('tr').find('td').eq(4).text());

            index = order_item_arr.findIndex(value => value._item._itemCode === $("#itemCodeCmb :selected").text());

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

new OrderController();