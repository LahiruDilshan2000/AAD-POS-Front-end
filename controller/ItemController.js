import {Item} from "../models/Item.js";
import {handleReloadItemDetails} from "./OrderController.js";

export class ItemController{
    constructor() {
        $('#itmSaveBtn').on('click', () => {
            this.handleValidation("Save");
        });
        $('#itmUpdateBtn').on('click', () => {
            this.handleValidation("Update");
        });
        $('#itmDeleteBtn').on('click', () => {
            this.handleDeleteItem();
        });
        $('#itmSearchBtn').on('click', () => {
            this.handleSearchItem();
        });
        $('#itmSearch').on('keyup', () => {
            this.handleSearchItem();
        });
        this.handleLReloadItemDetails();
        this.handleLoadItem();
        this.handleTableClickEvent();
    }

    handleValidation(fun) {

        !/^(R)([0-9]{2,})$/.test($('#itmCode').val()) ? alert("Invalid Item code") : !$('#itmDes').val() ? alert("Description is empty !") :
            !/\d+$/.test($('#unitPrice').val()) ? alert("Invalid unit price or empty !") : !/^\d+$/.test($('#itmQty').val()) ? alert("Invalid qty or empty !") :
                fun === "Save" ? this.handleSaveItem() : this.handleUpdateItem() ;
    }

    handleSaveItem(){

        let obj = JSON.stringify(new Item($('#itmCode').val(), $('#itmDes').val(), $('#unitPrice').val(), $('#itmQty').val()));

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/item",
            type: "POST",
            data: obj,
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                if (resp.status === 200){
                    alert(resp.massage);
                    this.handleLoadItem();
                    handleReloadItemDetails();
                }else {
                    alert(resp.data);
                }
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleUpdateItem(){

        let obj= JSON.stringify(new Item($('#itmCode').val(), $('#itmDes').val(), $('#unitPrice').val(), $('#itmQty').val()));

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/item",
            type: "PUT",
            data: obj,
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                if (resp.status === 200){
                    alert(resp.massage);
                    this.handleLoadItem();
                }else {
                    alert(resp.data);
                }
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleDeleteItem(){

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/item?itemCode="+$('#itmCode').val(),
            type: "DELETE",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {
                if (resp.status === 200){
                    alert(resp.massage);
                    this.handleLoadItem();
                    handleReloadItemDetails();
                }else {
                    alert(resp.data);
                }
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleLoadItem(){

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/item",
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
        document.getElementById('itmSaveBtn').disabled = false;
        document.getElementById('itmUpdateBtn').disabled = true;
        document.getElementById('itmDeleteBtn').disabled = true;

        //clearData();
        $('#itmCode').val("");
        $('#itmDes').val("");
        $('#unitPrice').val("");
        $('#itmQty').val("");
        document.getElementById('itmCode').disabled = false;

    }

    handleAddData(array) {

        $('#itemTbl tbody tr td').remove();

        array.map((value) => {
            let row = "<tr>" +
                "<td>" + value.itemCode + "</td>" +
                "<td>" + value.description + "</td>" +
                "<td>" + value.unitPrice + "</td>" +
                "<td>" + value.qtyOnHand + "</td>" +
                "</tr>";

            $('#itemTbl tbody').append(row);
        });
    }

    handleTableClickEvent(){

        $('#itemTbl tbody').on('click', 'tr', (event) => {
            $('#itmCode').val($(event.target).closest('tr').find('td').eq(0).text())
            $('#itmDes').val($(event.target).closest('tr').find('td').eq(1).text())
            $('#unitPrice').val($(event.target).closest('tr').find('td').eq(2).text())
            $('#itmQty').val($(event.target).closest('tr').find('td').eq(3).text())

            document.getElementById('itmSaveBtn').disabled = true;
            document.getElementById('itmCode').disabled = true;
            document.getElementById('itmUpdateBtn').disabled = false;
            document.getElementById('itmDeleteBtn').disabled = false;
        });
    }

    handleSearchItem(){

        if (!$('#itmSearch').val()){
            this.handleLoadItem();
            return;
        }
        let array = [];

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend/item",
            type: "GET",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: (resp) => {

                this.handleAddData(this.handleGetMatch(array,
                    $('#itmSearch').val().toLowerCase(), resp.data));
            },
            error: (xhr) => {
                console.log(xhr);
            }
        });
    }

    handleGetMatch(newArray, text, itemArray){

        console.log(itemArray);
        itemArray.map(value => {

            value.itemCode.toLowerCase().indexOf(text) !== -1 ? newArray.push(value) :
                value.description.toLowerCase().indexOf(text) !== -1 ? newArray.push(value) :
                    value.unitPrice.toString().toLowerCase().indexOf(text) !== -1 ? newArray.push(value) :
                        value.qtyOnHand.toString().toLowerCase().indexOf(text) !== -1 ? newArray.push(value) :
                            undefined;
        });
        return newArray;
    }

    handleLReloadItemDetails(){

        $(document).on('click', (event) => {
            if (event.target.className === 'form-control me-2 was-validated search')
                setTimeout(() => {
                    if (!$('#itmSearch').val()) this.handleLoadItem();
                });
        });
    }
}
new ItemController();