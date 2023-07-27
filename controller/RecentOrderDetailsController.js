var detailsArray = [];

export class RecentOrderDetailsController {

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
        this.handleLoadTable();
        this.handleTableButtonClick();
    }

    handleFilterClickEvent(event) {

        if (event.target.className === 'filter') {
            // $('.filter').css({opacity : '0', right : '-200vw'});
            $('.filter').css({opacity: '0', zIndex: '-1'});
        }
    }

    handleLoadTable() {

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/query",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                this.handleAddRecentData(resp.data);
                detailsArray = resp.data;
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });

    }

    handleAddRecentData(array) {

        $('#recentOrderTbl tbody tr').remove();

        array.map(value => {

            var row = "<tr>" +
                "<td>" + value.orderID + "</td>" +
                "<td>" + value.customerID + "</td>" +
                "<td>" + value.customerName + "</td>" +
                "<td>" + value.total + "</td>" +
                "<td>" + value.date + "</td>" +
                "<td><div>View</div></td>" +
                "</tr>";

            $('#recentOrderTbl tbody').prepend(row);
        });
    }

    handleTableButtonClick() {

        $('#recentOrderTbl tbody').on('click', 'div', (event) => {
            this.handleRecentOrderDetails($(event.target).closest('tr').find('td').eq(0).text());
        });
    }

    handleRecentOrderDetails(orderID) {

        detailsArray.map(value => {
            if (value.orderID === orderID) {

                $('#recentOrder_id').text(value.orderID);
                $('#recentOrderDate').text(value.date);
                $('#cusID').text(value.customerID);
                $('#cusName').text(value.customerName);

                $('#recentTbl tbody tr').remove();

                value.itemList.map(value1 => {
                    let row = "<tr>" +
                        "<td>" + value1.itemCode + "</td>" +
                        "<td>" + value1.description + "</td>" +
                        "<td>" + value1.unitPrice + "</td>" +
                        "<td>" + value1.qtyOnHand + "</td>" +
                        "<td>" + parseInt(value1.unitPrice) * parseInt(value1.qtyOnHand) + "</td>" +
                        "</tr>";

                    $('#recentTbl tbody').prepend(row);
                });
                // $('.filter').css({opacity : '1', right : '0'});
                $('.filter').css({opacity: '1', zIndex: '5000'});
            }
            return;
        });
    }

    handleSearchRecentOrder() {

        if (!$('#rOrderSearch').val()) {
            this.handleLoadTable();
            return;
        }
        let array = [];
        let text = $('#rOrderSearch').val().toLowerCase();

        detailsArray.map(value => {

            value.orderID.toLowerCase().indexOf(text) !== -1 ? array.push(value) :
                value.customerID.toLowerCase().indexOf(text) !== -1 ? array.push(value) :
                    value.customerName.toLowerCase().indexOf(text) !== -1 ? array.push(value) :
                        value.total.toString().indexOf(text) !== -1 ? array.push(value) :
                            value.date.toLowerCase().indexOf(text) !== -1 ? array.push(value) :
                                undefined;
        });
        if (array) this.handleAddRecentData(array);
    }

    handleLReloadRecentOrderDetails() {

        $(document).on('click', (event) => {
            if (event.target.className === 'form-control was-validated search')
                setTimeout(() => {
                    if (!$('#rOrderSearch').val()) this.handleLoadTable();
                });
        });
    }
}

export function handleRefreshTable() {
    recentOrderDetailsController.handleLoadTable();
}

let recentOrderDetailsController = new RecentOrderDetailsController();