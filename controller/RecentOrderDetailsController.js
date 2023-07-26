import {getAllDB} from "../db/DB.js";

export class RecentOrderDetailsController{

    constructor() {

        $('.filter').on('click', (event) => {
            this.handleFilterClickEvent(event);
        });
        $('#rOrderSearchBtn').on('click', () => {
            this.handleSearchRecentOrder();
        });
        $('#rOrderSearch').on('keyup', () => {
            this.handleSearchRecentOrder();
        });
        this.handleLReloadRecentOrderDetails();
        this.handleLoadTable(getAllDB("ORDER"));
        this.handleTableButtonClick();
    }

    handleFilterClickEvent(event){

        if(event.target.className === 'filter'){
            // $('.filter').css({opacity : '0', right : '-200vw'});
            $('.filter').css({opacity : '0', zIndex : '-1'});
        }
    }

    handleLoadTable(array){

        $('#recentOrderTbl tbody tr').remove();

        array.map(value => {

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
                "<td><div>View</div></td>" +
                "</tr>";

            $('#recentOrderTbl tbody').prepend(row);
        });

    }

    handleTableButtonClick(){

        $('#recentOrderTbl tbody').on('click', 'div', (event) => {
            this.handleRecentOrderDetails($(event.target).closest('tr').find('td').eq(0).text());
        });
    }

    handleRecentOrderDetails(order_id){

        getAllDB("ORDER").map(value => {
            if (value._orderId === order_id){

                $('#recentOrder_id').text(value._orderId);
                $('#recentOrderDate').text(value._orderDate);
                $('#cusID').text(value._customer._id);
                $('#cusName').text(value._customer._name);

                $('#recentTbl tbody tr').remove();

                value._itemArray.map(value1 => {
                    var row = "<tr>" +
                        "<td>" + value1._item._itemCode + "</td>" +
                        "<td>" + value1._item._description + "</td>" +
                        "<td>" + value1._item._unitPrice + "</td>" +
                        "<td>" + value1._qty+ "</td>" +
                        "<td>" + value1._total + "</td>" +
                        "</tr>";

                    $('#recentTbl tbody').prepend(row);
                });
                // $('.filter').css({opacity : '1', right : '0'});
                $('.filter').css({opacity : '1', zIndex : '5000'});
            }
            return;
        });
    }

    handleSearchRecentOrder(){

        if (!$('#rOrderSearch').val()){
            this.handleLoadTable(getAllDB("ORDER"));
            return;
        }
        let array = [];
        let text = $('#rOrderSearch').val().toLowerCase();

        getAllDB("ORDER").map(value => {

            value._orderId.toLowerCase().indexOf(text) !== -1 ? array.push(value) :
                value._customer._id.toLowerCase().indexOf(text) !== -1 ? array.push(value) :
                    value._customer._name.toLowerCase().indexOf(text) !== -1 ? array.push(value) :
                      this.handleGetTotal(value._itemArray).indexOf(text) !== -1 ? array.push(value) :
                          value._orderDate.toLowerCase().indexOf(text) !== -1 ? array.push(value) :
                            undefined;
        });
        if (array)this.handleLoadTable(array);
    }
    handleGetTotal(array){
        let total = 0;

        array.map(value => {
            total += value._total;
        });
        return total.toString();
    }

    handleLReloadRecentOrderDetails(){

        $(document).on('click', (event) => {
            if (event.target.className === 'form-control was-validated search')
                setTimeout(() => {
                    if (!$('#rOrderSearch').val()) this.handleLoadTable(getAllDB("ORDER"));
                });
        });
    }
}

export function handleRefreshTable(){
    recentOrderDetailsController.handleLoadTable(getAllDB("ORDER"));
}

let recentOrderDetailsController = new RecentOrderDetailsController();