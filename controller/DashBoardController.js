import {Order} from "../models/Order.js";
import {getAllDB} from "../db/DB.js";

export class DashBoardController {

    constructor() {
        this.handleTableLoad();
        this.handleLabelData();
    }

    handleTableLoad() {

        $('#orderDetailTbl tbody tr').remove();

        getAllDB("ORDER").map(value => {

            let count = value._itemArray.length;
            let total = 0;
            for (let i = 0; i < count; i++) {

                total += value._itemArray[i]._total;
            }
            var row = "<tr>" +
                "<td>" + value._orderId + "</td>" +
                "<td>" + value._customer._id + "</td>" +
                "<td>" + value._customer._name + "</td>" +
                "<td>" + total + "</td>" +
                "<td>" + value._orderDate + "</td>" +
                "<td><div>Payed</div></td>" +
                "</tr>";

            $('#orderDetailTbl tbody').prepend(row);
        });
    }

    handleLabelData() {

        $('#totalCustomer').text(getAllDB("DATA").length);

        let count = 0;
        var todayIncome = 0;

        var date = new Date();
        var nowDate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

        getAllDB("ORDER").map(value => {
            if (value._orderDate === nowDate) {
                for (let i = 0; i < value._itemArray.length; i++) {
                    todayIncome += parseInt(value._itemArray[i]._total)
                }
                count++;
            }
        });
        $('#todayOrders').text(count);
        $('#todayIncome').text("Rs  " + todayIncome);
    }
}

export function handleRefreshAll() {
    dashBoardController.handleLabelData();
    dashBoardController.handleTableLoad();
}

let dashBoardController = new DashBoardController();