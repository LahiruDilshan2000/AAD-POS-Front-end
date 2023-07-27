import {Customer} from "../models/Customer.js";
import {handleReloadCustomerDetails} from "./OrderController.js";

export class CustomerController {
    constructor() {
        //$('#saveBtn').click(this.handleValidation.bind(this));
        $('#cusSaveBtn').on('click', () => {
             this.handleValidation("Save");
        });
        $('#cusUpdateBtn').on('click', () => {
            this.handleValidation("Update");
        });
        $('#cusDeleteBtn').on('click', () => {
            this.handleDeleteCustomer();
        });
        $('#cusSearchBtn').on('click', () => {
            this.handleSearchCustomer();
        });
        $('#cusSearch').on('keyup', () => {
            this.handleSearchCustomer();
        });
        this.handleLReloadCustomerDetails();
        // this.handleSaveCustomer.bind(this);
        this.handleLoadCustomer();
        this.handleTableClickEvent();
    }

    handleValidation(fun) {

        !/^(C)([0-9]{2,})$/.test($('#id').val()) ? alert("Invalid ID") : !$('#name').val() ? alert("Invalid name") :
            !$('#address').val() ? alert("Invalid address") : !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#tel').val()) ? alert("Invalid Tele") :
                fun === "Save" ? this.handleSaveCustomer() : this.handleUpdateCustomer() ;
    }

    handleSaveCustomer() {

        let obj = JSON.stringify(new Customer($('#id').val(), $('#name').val(), $('#address').val(), $('#tel').val()));

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/customer",
            type: "POST",
            data: obj,
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                if (resp.status === 200){
                    alert(resp.massage);
                    this.handleLoadCustomer();
                    handleReloadCustomerDetails();
                }else {
                    alert(resp.data);
                }
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleUpdateCustomer() {

        let obj = JSON.stringify(new Customer($('#id').val(), $('#name').val(), $('#address').val(), $('#tel').val()));

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/customer",
            type: "PUT",
            data: obj,
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                if (resp.status === 200){
                    alert(resp.massage);
                    this.handleLoadCustomer();
                }else {
                    alert(resp.data);
                }
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleDeleteCustomer() {

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/customer?customerID="+$('#id').val(),
            type: "DELETE",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                if (resp.status === 200){
                    alert(resp.massage);
                    this.handleLoadCustomer();
                    handleReloadCustomerDetails();
                }else {
                    alert(resp.data);
                }
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }


    handleLoadCustomer() {

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/customer",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                this.handleAddData(resp.data);
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });

        // disableBtn();
        document.getElementById('cusSaveBtn').disabled = false;
        document.getElementById('cusUpdateBtn').disabled = true;
        document.getElementById('cusDeleteBtn').disabled = true;

        //clearData();
        $('#id').val("");
        $('#name').val("");
        $('#address').val("");
        $('#tel').val("");
        document.getElementById('id').disabled = false;
    }

    handleAddData(array) {

        $('#customerTbl tbody tr td').remove();

        array.map((value) => {
            let row = "<tr>" +
                "<td>" + value.id + "</td>" +
                "<td>" + value.name + "</td>" +
                "<td>" + value.address + "</td>" +
                "<td>" + value.contact + "</td>" +
                "</tr>";

            $('#customerTbl tbody').append(row);
        });
    }

    handleTableClickEvent() {

        $('#customerTbl tbody').on('click', 'tr', (event) => {
            $('#id').val($(event.target).closest('tr').find('td').eq(0).text())
            $('#name').val($(event.target).closest('tr').find('td').eq(1).text())
            $('#address').val($(event.target).closest('tr').find('td').eq(2).text())
            $('#tel').val($(event.target).closest('tr').find('td').eq(3).text())

            document.getElementById('cusSaveBtn').disabled = true;
            document.getElementById('id').disabled = true;
            document.getElementById('cusUpdateBtn').disabled = false;
            document.getElementById('cusDeleteBtn').disabled = false;
        });
    }

    handleSearchCustomer() {

        if (!$('#cusSearch').val()) {
            this.handleLoadCustomer();
            return;
        }
        let array = [];

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/customer",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {

                this.handleAddData(this.handleGetMatch(array,
                    $('#cusSearch').val().toLowerCase(), resp.data));
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleGetMatch(newArray, text, cusArray){

        cusArray.map(value => {

            value.id.toLowerCase().indexOf(text) !== -1 ? newArray.push(value) :
                value.name.toLowerCase().indexOf(text) !== -1 ? newArray.push(value) :
                    value.address.toLowerCase().indexOf(text) !== -1 ? newArray.push(value) :
                        value.contact.toLowerCase().indexOf(text) !== -1 ? newArray.push(value) :
                            undefined;
        });
        return newArray;
    }

    handleLReloadCustomerDetails() {

        $(document).on('click', (event) => {
            if (event.target.className === 'form-control me-2 was-validated search')
                setTimeout(() => {
                    if (!$('#cusSearch').val()) this.handleLoadCustomer();
                });
        });
    }
}

new CustomerController();