var recentDataArray = [];

export class DashBoardController {

    constructor() {
        this.handleTableLoad();
    }

    handleTableLoad() {

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/query",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                this.handleAddRecentData(resp.data);
                recentDataArray = resp.data;
                this.handleLabelData();
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleAddRecentData(array){

        $('#orderDetailTbl tbody tr').remove();

        array.map(value => {

            let row = "<tr>" +
                "<td>" + value.orderID + "</td>" +
                "<td>" + value.customerID + "</td>" +
                "<td>" + value.customerName + "</td>" +
                "<td>" + value.total + "</td>" +
                "<td>" + value.date + "</td>" +
                "<td><div>Payed</div></td>" +
                "</tr>";

            $('#orderDetailTbl tbody').prepend(row);
        });
    }

    handleLabelData() {

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/customer",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                $('#totalCustomer').text(resp.data.length);
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });

        let count = 0;
        let todayIncome = 0;

        let date = new Date();
        let month = eval(date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        day = day.length === 1 ? "0"+day : day;
        month = month.length === 1 ? "0"+month : month;
        let nowDate = date.getFullYear()+ "-" + month + "-" + day;

        recentDataArray.map(value => {
            if (value.date === nowDate) {
                todayIncome += value.total;
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