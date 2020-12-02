$(function () {
    getOrders();

    function getOrders() {
        var unshipped = $('#Unshipped').prop('checked') ? "" : "/unshipped";
        $.getJSON({
            url: "../../api/order" + unshipped,
            success: function (response, textStatus, jqXhr) {
                //console.log(response);
                $('#order_rows').html("");
                for (var i = 0; i < response.length; i++) {
                    var row = "<tr" + " data-id=\"" + response[i].orderId + "\" data-order-date=\"" + response[i].orderDate + "\" data-required-date=\"" + response[i].requiredDate + "\" data-shipped-date=\"" + response[i].shippedDate + "\">"
                        + "<td class=\"text-right\">" + "</td>"
                        + "<td class=\"text-right\">" + response[i].orderId + "</td>"
                        + "<td class=\"text-right\">" + response[i].orderDate + "</td>"
                        + "<td class=\"text-right\">" + response[i].requiredDate + "</td>"
                        + "<td class=\"text-right\">" + response[i].shippedDate + "</td>"
                        + "</tr>";
                    $('#order_rows').append(row);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // log the error to the console
                console.log("The following error occured: " + textStatus, errorThrown);
            }
        });
    };

    $('#Unchecked').on('change', function () {
        getOrders();
    });
});
