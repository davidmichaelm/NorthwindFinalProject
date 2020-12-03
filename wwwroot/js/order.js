$(function () {
    getOrders()

    function getOrders() {
        var id = $('#order_rows').data('id');
        var unshipped = $('#Unshipped').prop('checked') ? "/unshipped" : "";
        $.getJSON({
            url: "../../api/order" + unshipped,
            success: function (response, textStatus, jqXhr) {
                //console.log(response);
                var empty, css;
                $('#order_rows').html("");
                for (var i = 0; i < response.length; i++) {
                    if (response[i].shippedDate == null) {
                        empty = "Not shipped";
                        var time = new Date();
                        if (time < Date.parse(response[i].requiredDate.toString().substring(0, 10))) {
                            css = "class=\"unshipped\"";
                        }
                        else {
                            css = "class=\"overdue\"";
                        }
                    }
                    else {
                        empty = response[i].shippedDate.toString().substring(0, 10);
                        css = "";
                    }
                    var row = $("<tr " + css + " data-toggle='modal' data-target='#orderDetailsModal'>"
                        + "<td></td>"
                        + "<td class=\"text-left\">" + response[i].orderId + "</td>"
                        + "<td class=\"text-right\">" + formatDate(response[i].orderDate) + "</td>"
                        + "<td class=\"text-right\">" + formatDate(response[i].requiredDate) + "</td>"
                        + "<td class=\"text-right\">" + empty + "</td>"
                        + "</tr>");
                    let orderId = response[i].orderId;
                    row.on("click", () => getSpecificOrder(orderId));
                    $('#order_rows').append(row);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // log the error to the console
                console.log("The following error occured: " + textStatus, errorThrown);
            }
        });
    }

    $('#Unshipped').on('change', function () {
        getOrders();
    });

    $(function () {
        $('[data-toggle="popover"]').popover()
    })
    
    async function getSpecificOrder(orderId) {
        fetch("../../api/order/" + orderId)
            .then(response => response.json())
            .then(data => bindOrderData(data));

        fetch("../../api/orderdetails/" + orderId)
            .then(response => response.json())
            .then(data => bindOrderDetailsData(data));
        
        function bindOrderData(response) {
            $("#modalOrderId").text(response.orderId);
            $("#modalOrderDate").text(formatDate(response.orderDate));
            $("#modalRequiredDate").text(formatDate(response.requiredDate));
            $("#modalShippedDate").text(formatDate(response.shippedDate));
            $("#modalFreight").text("$" + response.freight);
            $("#modalShipAddress").text(response.shipAddress);
            $("#modalShipCity").text(response.shipCity);
            $("#modalShipCountry").text(response.shipCountry);
            $("#modalShipName").text(response.shipName);
            $("#modalShipPostalCode").text(response.shipPostalCode);
            $("#modalShipRegion").text(response.shipRegion);
            
            $("#modalCompanyName").text(response.customer.companyName);
            $("#modalCustomerEmail").text(response.customer.email);
            $("#modalCustomerFax").text(response.customer.fax);
            $("#modalCustomerPhone").text(response.customer.phone);

            $("#modalEmployeeName").text(response.employee.firstName + " " + response.employee.lastName);
            $("#modalEmployeeEmail").text(response.employee.email);
            $("#modalEmployeeExtension").text(response.employee.extension);

            $("#modalShipperCompanyName").text(response.shipper.companyName);
            $("#modalShipperPhone").text(response.shipper.phone);
        }
        
        function bindOrderDetailsData(response) {
            const table = $("#modalOrderDetailsTable");
            table.text("");
            
            let totalQuantity = 0;
            let totalAmount = 0;
            for (let od of response) {
                let productName = $("<td>").text(od.product.productName);
                let quantity = $("<td>").text(od.quantity).addClass("text-right");
                let unitPrice = $("<td>").text("$" + od.unitPrice.toFixed(2)).addClass("text-right");
                let discount = $("<td>").text((od.discount * 100) + "%").addClass("text-right");
                
                let amountNum = od.quantity * od.unitPrice * (1 - od.discount);
                let amount = $("<td>").text("$" + amountNum.toFixed(2)).addClass("text-right");
                
                let tr = $("<tr>").append(productName, quantity, unitPrice, discount, amount);
                table.append(tr);

                totalQuantity += od.quantity;
                totalAmount += amountNum;
            }

            let totalQuantityCell = $("<td>").text(totalQuantity).addClass("text-right");
            let totalAmountCell = $("<td>").text("$" + totalAmount.toFixed(2)).addClass("text-right");
            let totalsRow = $("<tr>").append($("<td>").text("Total"), totalQuantityCell, $("<td>"), $("<td>"), totalAmountCell);
            table.append(totalsRow);
        }
    }
    
    function formatDate(date) {
        return date?.toString().substring(0, 10) ?? "Not shipped";
    }
});