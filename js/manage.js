function modify_User(){
     $("tr").each(function(index) {
        $("tr").eq(index).click(function() {
            var a = $(this).find("td")
            $("#modifyId").val(a[1].innerHTML)
            $("#modifyNum").val(a[2].innerHTML)
            $("#modifyName").val(a[3].innerHTML)
            $("#modifyPart").val(a[4].innerHTML)
            $("#modifyEmail").val(a[5].innerHTML)
        });
    });
}
function delete_User(){
    $("tr").each(function(index) {
        $("tr").eq(index).click(function() {
            var a = $(this).find("td")
            $("#deluser").empty();
            $("#deluser").append(a[3].innerHTML)
        });
    });

}
function modify_customer(){
     $("tr").each(function(index) {
        $("tr").eq(index).click(function() {
            var a = $(this).find("td")
            $("#modifyCusId").val(a[1].innerHTML)
            $("#modifyCusName").val(a[2].innerHTML)
        });
    });
}
function delete_customer(){
    $("tr").each(function(index) {
        $("tr").eq(index).click(function() {
            var a = $(this).find("td")
            $("#delCusName").empty();
            $("#delCusName").append(a[2].innerHTML)
        });
    });

}
function modify_department(){
     $("tr").each(function(index) {
        $("tr").eq(index).click(function() {
            var a = $(this).find("td")
            $("#modifyPartId").val(a[1].innerHTML)
            $("#modifyPartName").val(a[2].innerHTML)
        });
    });
}
function delete_department(){
    $("tr").each(function(index) {
        $("tr").eq(index).click(function() {
            var a = $(this).find("td")
            $("#delPart").empty();
            $("#delPart").append(a[2].innerHTML)
        });
    });

}