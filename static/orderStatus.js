function OrderStatus(){
    var order_id=document.getElementById('order-input').value;
    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/db_order_status",
            data:{order_id}
            });
        }
        $orderinfo=ajaxRequest();
        $orderinfo
        .done(function(data){
            var orderinfoData = JSON.parse(data);
            var elem=document.getElementsByClassName('orderStatus')[0];
            elem.classList.add("col-md-4");
            var parent_el = document.getElementById('OrderInfo');
            html_str1="";
            html_str1+="<div class='row'>";
            if (orderinfoData[0]!=undefined){
                html_str1+="<div class='col-12 mb-4'>";
                html_str1+="<p class='headItem'>Номер&nbsp;заявки</p>";
                html_str1+="<p class='bodyItem'>"+orderinfoData[0][0]+"</p>";
                html_str1+="</div>";
                html_str1+="<div class='col-12 mb-4'>";
                html_str1+="<p class='headItem'>Cтатус&nbsp;заявки</p>";
                html_str1+="<p class='bodyItem'>"+orderinfoData[0][1]+"</p>";
                html_str1+="</div>";
                html_str1+="<div class='col-12 mb-4'>";
                html_str1+="<p class='headItem'>Дата&nbsp;Начала</p>";
                html_str1+="<p class='bodyItem'>"+orderinfoData[0][2]+"</p>";
                html_str1+="</div>";
                html_str1+="<div class='col-12 mb-4'>";
                html_str1+="<p class='headItem'>Мастер</p>";
                html_str1+="<p class='bodyItem'>"+orderinfoData[0][3]+"</p>";
                html_str1+="</div>";
                html_str1+="<div class='col-12 mb-4'>";
                html_str1+="<p class='headItem'>Номер&nbsp;Мастера</p>";
                html_str1+="<p class='bodyItem'>"+orderinfoData[0][4]+"</p>";
                html_str1+="</div>";
                html_str1+="<div class='col-12 mb-4'>";
                html_str1+="<p class='headItem'>Cтоимость&nbsp;ремонта</p>";
                html_str1+="<p class='bodyItem'>"+orderinfoData[0][5]+"</p>";
                html_str1+="</div>";
            }else{
                html_str1+="<div class='alert alert-danger col-12'><strong>Упс...</strong> Данный запрос не выдал результатов.</div>";
            }
            html_str1+="</div>";
            parent_el.innerHTML = html_str1;
        });
}
