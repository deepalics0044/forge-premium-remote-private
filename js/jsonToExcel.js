document.getElementsByTagName("head")[0].innerHTML += '<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"><\/script>';
var createXLSLFormatObj = [];
var xlsHeader = ["Email", "License Purchased"];
createXLSLFormatObj.push(xlsHeader);
$.each(active, function(index, value) {
    var innerRowData = [];
    $("tbody").append('<tr><td>' +email.value  + '</td><td>'+ seat_quantity.value + '</td></tr>');
    $.each(value, function(ind, val) {
        innerRowData.push(val);
    });
    createXLSLFormatObj.push(innerRowData);
});
/* File Name */
var filename = "license_assigned.xlsx";
/* Sheet Name */
var ws_name = "license_assigned";
if (typeof console !== 'undefined') console.log(new Date());
var wb = XLSX.utils.book_new(),
    ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
/* Add worksheet to workbook */
XLSX.utils.book_append_sheet(wb, ws, ws_name);
/* Write workbook and Download */
if (typeof console !== 'undefined') console.log(new Date());
XLSX.writeFile(wb, filename);
if (typeof console !== 'undefined') console.log(new Date());

