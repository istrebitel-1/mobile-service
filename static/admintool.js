let admin_role, admin_role1, admin_role2, admin_role3, login;
function login_check(){
    login=document.getElementById('InputLogin').value;
    let password=document.getElementById('InputPassword').value;
    function ajaxRequest(){
    return $.ajax({
        type:"GET",
        url:"/admin/login/check",
        data:{login, password}
        });
    };
    $admin=ajaxRequest();
    $admin
    .done(function(data){
        if(data=='wrong'){
            alert('проверьте правильность логина и пароля');
        }else{
        admin_role=data;
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/get_roles",
                data:'roles'
                });
            };
            $roles=ajaxRequest();
            $roles
            .done(function(data){
                rolesData=JSON.parse(data);
                admin_role1=rolesData[0][0];
                admin_role2=rolesData[1][0];
                admin_role3=rolesData[2][0];
                document.getElementById('admin_login_check').style.display='none';
                document.getElementById('admin_login_site').style.display='block';
                let elem=document.getElementById('admin_act_role');
                html_str1='';
                if (admin_role==admin_role2){
                    html_str1+="<div class='col-4 mt-4'><button class='btn-funct btn' onclick='report_client()'>Отчет о клиентах</button></div>";
                    html_str1+="<div class='col-4 mt-4'><button class='btn-funct btn' onclick='report_inj()'>Загруженность инженеров</button></div>";
                    html_str1+="<div class='col-4 mt-4'><button class='btn-funct btn' onclick='change_order_status()'>Изменение статуса заказов</button></div>";
                    html_str1+="<div class='col-6 mt-4'><button class='btn-funct btn' onclick='change_order_status1()'>Отчет о первичном осмотре</button></div>";
                    html_str1+="<div class='col-6 mt-4'><button class='btn-funct btn' onclick='change_order_status2()'>Отчет о вторичном осмотре</button></div>";
                    elem.innerHTML=html_str1;
                }else if(admin_role==admin_role3){
                    html_str1+="<div class='col-6 mt-4'><button class='btn-funct btn' onclick='report_purchases()'>отчёт о закупках</button></div>";
                    html_str1+="<div class='col-6 mt-4'><button class='btn-funct btn' onclick='add_purchases()'>Добавление данных в таблицу закупок</button></div>";
                    elem.innerHTML=html_str1;
                }else if(admin_role==admin_role1){
                    html_str1+="<div class='col-6 mt-4'><button class='btn-funct btn' onclick='report_client()'>Отчет о клиентах</button></div>";
                    html_str1+="<div class='col-6 mt-4'><button class='btn-funct btn' onclick='report_inj()'>Загруженность инженеров</button></div>";
                    html_str1+="<div class='col-6 mt-4'><button class='btn-funct btn' onclick='report_purchases()'>отчёт о закупках</button></div>";
                    html_str1+="<div class='col-6 mt-4'><button class='btn-funct btn' onclick='add_worker()'>Добавление работников</button></div>";
                    elem.innerHTML=html_str1;
                }
            });
        }
    });
}
function report_client(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row'>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<span class='bodyItem'>Дата с:</span>";
    html_str1+="<input class='form-control' type='date' placeholder='*YYYY-MM-DD' name='date' id='report_cl_date_nach'>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<span class='bodyItem'>Дата по:</span>";
    html_str1+="<input class='form-control' type='date' placeholder='*YYYY-MM-DD' name='date' id='report_cl_date_okonch'>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4' type='button' id='clients' onclick='change_date(this)'>Изменить</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-docx' type='button' onclick='cl_date_docx()'>DOCX</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-xls' type='button' onclick='cl_date_XLSx()'>XLSx</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-pdf' type='button' onclick='cl_date_PDF()'>PDF</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/Site_1/clients.html"; 
    var iframe = document.createElement('iframe');
    frameborder=0;
    iframe.width="100%";
    iframe.height=window.innerHeight*0.6;
    iframe.id="rep";
    iframe.setAttribute("src", link);
    document.getElementById("reports").appendChild(iframe);
}
function change_date(elem){
    let date_nach, date_okonch;
    date_nach=document.getElementById('report_cl_date_nach').value;
    date_okonch=document.getElementById('report_cl_date_okonch').value;
    if ((date_nach!='')&&(date_okonch!='')){
        document.getElementById('rep').src="http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/Site_1/"+elem.id+".html?P_DATE_START="+date_nach+"&P_DATE_END="+date_okonch+"";
    }
}
function cl_date_docx(){
    let src=document.getElementById('rep').src;
    src=src.replace('html','docx');
    src=src.replace('pdf','docx');
    src=src.replace('xlsx','docx');
    document.getElementById('rep').src=src;
}
function cl_date_XLSx(){
    let src=document.getElementById('rep').src;
    src=src.replace('html','xlsx');
    src=src.replace('docx','xlsx');
    src=src.replace('pdf','xlsx');
    document.getElementById('rep').src=src;
}
function cl_date_PDF(){
    let src=document.getElementById('rep').src;
    src=src.replace('html','pdf');
    src=src.replace('docx','pdf');
    src=src.replace('xlsx','pdf');
    document.getElementById('rep').src=src;
}   
function report_inj(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row'>";
  html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-docx' type='button' onclick='cl_date_docx()'>DOCX</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-xls' type='button' onclick='cl_date_XLSx()'>XLSx</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-pdf' type='button' onclick='cl_date_PDF()'>PDF</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/Site_1/masters.html"; 
    var iframe = document.createElement('iframe');
    frameborder=0;
    iframe.width="100%";
    iframe.height=window.innerHeight*0.6;
    iframe.id="rep";
    iframe.setAttribute("src", link);
    document.getElementById("reports").appendChild(iframe);
}

function report_purchases(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row'>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<span class='bodyItem'>Дата с:</span>";
    html_str1+="<input class='form-control' type='date' placeholder='*YYYY-MM-DD' name='date' id='report_cl_date_nach'>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<span class='bodyItem'>Дата по:</span>";
    html_str1+="<input class='form-control' type='date' placeholder='*YYYY-MM-DD' name='date' id='report_cl_date_okonch'>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4' type='button' id='purchases' onclick='change_date(this)'>Изменить</button>";
    html_str1+="</div>";
  html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-docx' type='button' onclick='cl_date_docx()'>DOCX</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-xls' type='button' onclick='cl_date_XLSx()'>XLSx</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-pdf' type='button' onclick='cl_date_PDF()'>PDF</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/Site_1/purchases.html"; 
    var iframe = document.createElement('iframe');
    frameborder=0;
    iframe.width="100%";
    iframe.height=window.innerHeight*0.6;
    iframe.id="rep";
    iframe.setAttribute("src", link);
    document.getElementById("reports").appendChild(iframe);
}

function add_worker(){

    document.getElementById("reports").innerHTML='';
    var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/Site_1/workers.html"; 
    var iframe = document.createElement('iframe');
    frameborder=0;
    iframe.width="100%";
    iframe.height=window.innerHeight*0.6;
    iframe.id="rep";
    iframe.setAttribute("src", link);
    document.getElementById("reports").appendChild(iframe);

    html_str1='';
    html_str1+="<div class='col-8'>";
    html_str1+="<span class='bodyItem'>ФИО</span>";
    html_str1+="<input class='form-control mb-2 al' type='text' placeholder='*ФИО' id='fio-work-input'>";
    
    html_str1+="<span class='bodyItem'>дата рождения</span>";
    html_str1+="<input class='form-control mb-2 al' type='date' placeholder='*YYYY-MM-DD' id='date-work-input'>";

    html_str1+="<span class='bodyItem'>пол</span>";
    html_str1+="<select class='form-control mb-2 al' id='sex_Select'>";
    html_str1+="<option>Муж</option>";
    html_str1+="<option>Жен</option>";
    html_str1+="<option>Мифическое существо</option>";
    html_str1+="</select>";

    html_str1+="<span class='bodyItem'>паспорт</span>";
    html_str1+="<input class='form-control mb-2 al' type='number' placeholder='*Серия' id='seria-work-input'>";
    html_str1+="<input class='form-control mb-2 al' type='number' placeholder='*Номер' id='nomer-work-input'>";
    html_str1+="<input class='form-control mb-2 al' type='text' placeholder='*Место выдачи' id='mesto-work-input'>";
    html_str1+="<input class='form-control mb-2 al' type='date' placeholder='*дата выдачи' id='datavid-work-input'>";
    
    html_str1+="<span class='bodyItem'>Адрес</span>";
    html_str1+="<input class='form-control mb-2  al' type='text' placeholder='*Город' id='city-work-input'>";
    html_str1+="<input class='form-control mb-2  al' type='text' placeholder='*Улица' id='street-work-input'>";
    html_str1+="<input class='form-control mb-2' type='text' placeholder='*Дом' id='dom-work-input'>";
    html_str1+="<input class='form-control mb-2' type='text' placeholder='*Корпус' id='korpus-work-input'>";
    html_str1+="<input class='form-control mb-2' type='text' placeholder='*Квартира' id='kv-work-input'>";

    html_str1+="<span class='bodyItem'>Номер телефона</span>";
    html_str1+="<input class='form-control mb-2  al' type='number' placeholder='*тел' id='tel-work-input'>";

    html_str1+="<span class='bodyItem'>e-mail</span>";
    html_str1+="<input class='form-control mb-2' type='email' placeholder='*email' id='email-work-input'>";

    html_str1+="<span class='bodyItem'>Тип графика</span>";
    html_str1+="<select class='form-control mb-2' id='graf_Select'>";
    html_str1+="<option>09:00 - 18:00</option>";
    html_str1+="<option>10:00 - 19:00</option>";
    html_str1+="<option>11:00 - 20:00</option>";
    html_str1+="</select>";

    html_str1+="<span class='bodyItem'>Роль на сайте</span>";
    html_str1+="<select class='form-control mb-2' id='role_Select'>";
    html_str1+="<option>Оператор</option>";
    html_str1+="<option>Инженер</option>";
    html_str1+="<option>Управляющий складом</option>";
    html_str1+="</select>";

    html_str1+="<span class='bodyItem'>должность</span>";
    html_str1+="<select class='form-control mb-2' id='dolz_Select'>";
    html_str1+="<option>Мастер</option>";
    html_str1+="<option>Администратор</option>";
    html_str1+="<option>Уборщик</option>";
    html_str1+="<option>Управляющий складом</option>";
    html_str1+="<option>Хороший человек</option>";
    html_str1+="<option>Директор</option>";
    html_str1+="<option>Заместитель директора (грузчик)</option>";
    html_str1+="<option>Работник толоки</option>";
    html_str1+="</select>";
    
    html_str1+="<span class='bodyItem'>логин</span>";
    html_str1+="<input class='form-control mb-2  al' type='text' placeholder='*логин' id='login-work-input'>";

    html_str1+="<span class='bodyItem'>пароль</span>";
    html_str1+="<input class='form-control mb-2  al' type='text' placeholder='*пароль' id='password-work-input'>";

    html_str1+="<span class='bodyItem'>ставка</span>";
    html_str1+="<input class='form-control mb-2 al' type='text' placeholder='*ставка' id='stavka-work-input'>";
    html_str1+="<button class='btn btn-funct mt-4' type='button' onclick='add_base_worker()'>Добавить</button>";
    html_str1+="</div>";
    var ele=document.createElement('div');
    ele.setAttribute("class",'row justify-content-center align-items-center');
    document.getElementById("reports").appendChild(ele).innerHTML=html_str1;
}

function add_base_worker(){

    let fio, birth_date, sex, series, p_number,issue_dt,issue_place,city ,street ,house , building,flat, phone,email,schedule_id ,role_id, position_id,login_e, password_e, rate;
    fio=document.getElementById('fio-work-input').value;
    birth_date=document.getElementById('date-work-input').value;
    var n=document.getElementById('sex_Select').options.selectedIndex;    
    sex = document.getElementById('sex_Select').options[n].value;
    series=document.getElementById('seria-work-input').value;
    p_number= document.getElementById('nomer-work-input').value;
    issue_place=document.getElementById('mesto-work-input').value;
    issue_dt=document.getElementById('datavid-work-input').value;
    city=document.getElementById('city-work-input').value;
    street=document.getElementById('street-work-input').value;
    house= document.getElementById('dom-work-input').value;
    building=document.getElementById('korpus-work-input').value;
    flat=document.getElementById('kv-work-input').value;
    phone=document.getElementById('tel-work-input').value;
    email= document.getElementById('email-work-input').value;
    n=document.getElementById('graf_Select').options.selectedIndex;    
    schedule_id = document.getElementById('graf_Select').options[n].value;
    n=document.getElementById('role_Select').options.selectedIndex;    
    role_id = document.getElementById('role_Select').options[n].value;
    n=document.getElementById('dolz_Select').options.selectedIndex;    
    position_id = document.getElementById('dolz_Select').options[n].value;
    login_e=document.getElementById('login-work-input').value;
    password_e=document.getElementById('password-work-input').value;
    rate=document.getElementById('stavka-work-input').value;
    if((fio=='')||(birth_date=='')||(sex=='')||(series =='')||(p_number=='')||(issue_place=='')||(issue_dt=='')||(city=='')||(street=='')||(phone=='')||
    (schedule_id=='')||(role_id=='')||(position_id=='')||(login_e=='')||(password_e=='')||(rate=='')){
        content=document.getElementsByClassName('al');
        for (let i=0; i<content.length; i++){
            content[i].style.border='1px solid red';
        }
       alert("Проверьте правильность ввода")
    }else{
        content=document.getElementsByClassName('al');
        for (let i=0; i<content.length; i++){
            content[i].style.border='1px solid #ced4da';
        }
        console.log(fio, birth_date, sex, series, p_number,issue_dt,issue_place,city ,street ,house , building,flat, phone,email,schedule_id ,role_id, position_id,login_e, password_e, rate);

        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/admin/empl_add",
                data:{fio, birth_date, sex, series, p_number,issue_dt,issue_place,city ,street ,house , building,flat, phone,email,schedule_id ,role_id, position_id,login_e, password_e, rate}
                });
            }
            $add=ajaxRequest();
            $add
            .done(function(data){
              let addData=data;
              if(addData='success'){
                  alert('Успешно!');
                  add_worker();
              }
            });    
    }
}

function change_order_status(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row'>";
  html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-docx' type='button' onclick='cl_date_docx()'>DOCX</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-xls' type='button' onclick='cl_date_XLSx()'>XLSx</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-pdf' type='button' onclick='cl_date_PDF()'>PDF</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/Site_1/orders.html"; 
    var iframe = document.createElement('iframe');
    frameborder=0;
    iframe.width="100%";
    iframe.height=window.innerHeight*0.6;
    iframe.id="rep";
    iframe.setAttribute("src", link);
    document.getElementById("reports").appendChild(iframe);
    html_str1='';
    html_str1+="<div class='col-4'>";
    html_str1+="<span class='bodyItem'>id-заказа</span>";
    html_str1+="<select class='form-control mb-2' id='id_izm_zakaza'>";
    html_str1+="</div>";
    html_str1+="<div class='col-4'>";
    html_str1+="</select>";
    html_str1+="</div>";
    html_str1+="<div class='col-4'>";
    html_str1+="<span class='bodyItem'>Cтатус заказа</span>";
    html_str1+="<select class='form-control mb-2' id='status_zakaza'>";
    html_str1+="<option>В ожидании</option>";
    html_str1+="<option>В работе</option>";
    html_str1+="<option>Выполнено</option>";
    html_str1+="</select>";
    html_str1+="</div>";
    html_str1+="<div class='col-4'>";
    html_str1+="<button class='btn btn-funct mt-4' type='button' onclick='change_or_st()'>Изменить</button>";
    html_str1+="</div>";
    var ele=document.createElement('div');
    ele.setAttribute("class",'row');
    document.getElementById("reports").appendChild(ele).innerHTML=html_str1;

    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/db_get_order_id",
            data:{}
            });
        }
        $addP=ajaxRequest();
        $addP
        .done(function(data){
        let addPData=JSON.parse(data);
        for (let i=0; i<addPData.length; i++){
            $('#id_izm_zakaza').append("<option value="+addPData[i][0]+">" +addPData[i][0]+"</option>");
        }
        });
}

function change_or_st(){
    let order_id=document.getElementById('id_izm_zakaza').value;
    var n=document.getElementById('id_izm_zakaza').options.selectedIndex;    
    n=document.getElementById('status_zakaza').options.selectedIndex;    
    status = document.getElementById('status_zakaza').options[n].value;
    if (order_id!=''){
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/admin/change_order",
                data:{order_id, status}
                });
            }
            $Change=ajaxRequest();
            $Change
            .done(function(data){
              let changeData=data;
              if(changeData='success'){
                  alert('Успешно!');
              }
            });    
    }
}

function change_order_status1(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row'>";
  html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-docx' type='button' onclick='cl_date_docx()'>DOCX</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-xls' type='button' onclick='cl_date_XLSx()'>XLSx</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-pdf' type='button' onclick='cl_date_PDF()'>PDF</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/Site_1/first_insp.html"; 
    var iframe = document.createElement('iframe');
    frameborder=0;
    iframe.width="100%";
    iframe.height=window.innerHeight*0.6;
    iframe.id="rep";
    iframe.setAttribute("src", link);
    document.getElementById("reports").appendChild(iframe);
    html_str1='';
    html_str1+="<div class='col-8'>";
    html_str1+="<span class='bodyItem'>id-заказа</span>";
    html_str1+="<select class='form-control mb-2' id='id_zakaza'>";
    html_str1+="</select>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<span class='bodyItem'>Cтоимость</span>";
    html_str1+="<input class='form-control mb-2' type='number' placeholder='*Стоимость' id='price_perv'>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<span class='bodyItem'>Комментарий</span>";
    html_str1+="<input class='form-control mb-2' type='text' placeholder='*Стоимость' id='comment_perv'>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<span class='bodyItem'>Дефекты</span>";
    html_str1+="<select class='form-control mb-2' id='defects_perv'>";
    html_str1+="<option>0</option>";
    html_str1+="<option>1</option>";
    html_str1+="</select>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<span class='bodyItem'>Cсылка на фотографию</span>";
    html_str1+="<input class='form-control mb-2' type='text' placeholder='*url' id='photo_url_perv'>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<button class='btn btn-funct mt-4' type='button' onclick='change_or_st1()'>Cохранить</button>";
    html_str1+="</div>";
    var ele=document.createElement('div');
    ele.setAttribute("class",'row justify-content-center align-items-center');
    document.getElementById("reports").appendChild(ele).innerHTML=html_str1;

    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/db_get_order_id1",
            data:{}
            });
        }
        $addP=ajaxRequest();
        $addP
        .done(function(data){
        let addPData=JSON.parse(data);
        for (let i=0; i<addPData.length; i++){
        $('#id_zakaza').append("<option value="+addPData[i][0]+">" +addPData[i][0]+"</option>");
        }
        });
}
function change_or_st1(){
    let order_id, comment, price, photo, defect;
    var n=document.getElementById('id_zakaza').options.selectedIndex;
    order_id=document.getElementById('id_zakaza').options[n].value;

    n=document.getElementById('defects_perv').options.selectedIndex;
    defect=document.getElementById('defects_perv').options[n].value;

    comment=document.getElementById('comment_perv').value;
    price=document.getElementById('price_perv').value;
    photo=document.getElementById('photo_url_perv').value;
    if ((order_id!='')&&(comment!='')&&(price!='')&&(photo!='')){
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/admin/change_order1",
                data:{order_id, login, comment, defect, price, photo}
                });
            }
            $Change=ajaxRequest();
            $Change
            .done(function(data){
              let changeData=data;
              if(changeData='success'){
                  alert('Успешно!');
                  change_order_status1();
              }
            });    
    }else{
        alert('проверьте правильность ввода');
    }
}
function change_order_status2(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row'>";
  html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-docx' type='button' onclick='cl_date_docx()'>DOCX</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-xls' type='button' onclick='cl_date_XLSx()'>XLSx</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-funct mt-4 btn-pdf' type='button' onclick='cl_date_PDF()'>PDF</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/Site_1/master_insp.html"; 
    var iframe = document.createElement('iframe');
    frameborder=0;
    iframe.width="100%";
    iframe.height=window.innerHeight*0.6;
    iframe.id="rep";
    iframe.setAttribute("src", link);
    document.getElementById("reports").appendChild(iframe);

    html_str1='';
    html_str1+="<div class='col-8'>";
    html_str1+="<span class='bodyItem'>id-первичного осмотра</span>";
    html_str1+="<select class='form-control mb-2' id='id_perv_osm'>";
    html_str1+="</select>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="</select>";
    html_str1+="<span class='bodyItem'>Cоответсвие</span>";
    html_str1+="<select class='form-control mb-2' id='sootv_vtor'>";
    html_str1+="<option>0</option>";
    html_str1+="<option>1</option>";
    html_str1+="</select>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<span class='bodyItem'>Комментарий</span>";
    html_str1+="<input class='form-control mb-2' type='text' placeholder='*Комментарий' id='comment_vtorich'>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<button class='btn btn-funct mt-4' type='button' onclick='change_or_st2()'>Cохранить</button>";
    html_str1+="</div>";
    var ele=document.createElement('div');
    ele.setAttribute("class",'row justify-content-center align-items-center');
    document.getElementById("reports").appendChild(ele).innerHTML=html_str1;
    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/db_get_perv_id",
            data:{}
            });
        }
        $addP=ajaxRequest();
        $addP
        .done(function(data){
        let addPData=JSON.parse(data);
        for (let i=0; i<addPData.length; i++){
            $('#id_perv_osm').append("<option>"+addPData[i][0]+"</option>");
        }
        });
}
function change_or_st2(){
    let perv_id, sootv, comment;
    var n=document.getElementById('id_perv_osm').options.selectedIndex;
    perv_id=document.getElementById('id_perv_osm').options[n].value;
    n=document.getElementById('sootv_vtor').options.selectedIndex;
    sootv=document.getElementById('sootv_vtor').options[n].value;
    comment=document.getElementById('comment_vtorich').value;
    if(comment==''){
        alert('Проверьте правильность ввода');
    }else{
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/admin/change_order2",
                data:{perv_id, login, sootv, comment}
                });
            }
            $Change=ajaxRequest();
            $Change
            .done(function(data){
              let changeData=data;
              if(changeData='success'){
                  alert('Успешно!');
                  change_order_status2();
              }
            });    
    }
}

function add_purchases(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row justify-content-center align-items-center'>";
    html_str1+="<div class='col-8'>";
    html_str1+="<form>";
    html_str1+="<span class='bodyItem'>ID осмотра мастером</span>";
    html_str1+="<select id='master_insp' class='form-control mb-2' onchange='getModels()'>";
    html_str1+="</select>";
    html_str1+="</form>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<form>";
    html_str1+="<span class='bodyItem'>Модель телефона</span>";
    html_str1+="<select id='tel_model_purch' class='form-control mb-2' onchange='getComp()'>";
    html_str1+="</select>";
    html_str1+="</form>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<form>";
    html_str1+="<span class='bodyItem'>Компонент</span>";
    html_str1+="<select id='component' class='form-control mb-2' onchange='Comp(this)'>";
    html_str1+="</select>";
    html_str1+="<input class='form-control' type='text' placeholder='Компонент' id='component_name_input'>";
    html_str1+="<input class='form-control' type='number' placeholder='Стоимость компонента' id='component_price_input'>";
    html_str1+="</form>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<form>";
    html_str1+="<span class='bodyItem'>Количество</span>";
    html_str1+="<input class='form-control' type='number' placeholder='количество' id='quantity_input'>";
    html_str1+="</form>";
    html_str1+="</div>";
    html_str1+="<div class='col-8'>";
    html_str1+="<form>";
    html_str1+="<button class='btn btn-funct mt-4' type='button' onclick='add_purchases_toDB()'>Cохранить</button>";
    html_str1+="</form>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    function ajaxRequest(){
    return $.ajax({
        type:"GET",
        url:"/db_get_master_insp",
        data:{}
        });
    }
    $addP=ajaxRequest();
    $addP
    .done(function(data){
    let addPData=JSON.parse(data);
    for (let i=0; i<addPData.length; i++){
        $('#master_insp').append("<option value='"+addPData[i][0]+"'>"+addPData[i][0]+"</option>");
    }
    getModels();
        
    });    
}

function getModels(){
    var n=document.getElementById('master_insp').options.selectedIndex;
    master_insp = document.getElementById('master_insp').options[n].value;
    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/db_phone_name_full",
            data:{master_insp}
            });
        }
        $CP=ajaxRequest();
        $CP
        .done(function(data){
        let addPData=JSON.parse(data);
        html_str1='';
        html_str1+="<option value='"+addPData[0][0]+"'>"+addPData[0][0]+"</option>";

        document.getElementById('tel_model_purch').innerHTML=html_str1;
        getComp();
    });   
}

    function getComp(){
        let phone;
        var n=document.getElementById('tel_model_purch').options.selectedIndex;
        phone = document.getElementById('tel_model_purch').options[n].value;
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/db_get_components",
                data:{phone}
                });
            }
            $CP=ajaxRequest();
            $CP
            .done(function(data){
            let addPData=JSON.parse(data);
            html_str1='';
            html_str1+="<option value='others'>другой</option>";
            for (let i=0; i<addPData.length; i++){
                html_str1+="<option value='"+addPData[i][0]+"'>"+addPData[i][0]+"</option>";
            }
            document.getElementById('component').innerHTML=html_str1;
        });
    }

    function Comp(elem){
        let component;
        var n=document.getElementById(elem.id).options.selectedIndex;    
        component = document.getElementById(elem.id).options[n].value;
        if (component!='others'){
            document.getElementById('component_name_input').style.display='none';
            document.getElementById('component_price_input').style.display='none';
            document.getElementById('component_price_input').innerHTML='%20';
        }else{
            document.getElementById('component_name_input').style.display='block';
            document.getElementById('component_price_input').style.display='block';
            document.getElementById('component_price_input').innerHTML='';
        }
    }

function add_purchases_toDB(){
    let component, master_insp, price, quantity, phoneModel;
    var n=document.getElementById('component').options.selectedIndex;    
    component = document.getElementById('component').options[n].value;
    if(component=='others'){
        component=document.getElementById('component_name_input').value;
    }
    n=document.getElementById('master_insp').options.selectedIndex;    
    master_insp = document.getElementById('master_insp').options[n].value;
    price=document.getElementById('component_price_input').value;
    quantity=document.getElementById('quantity_input').value;
    n=document.getElementById('tel_model_purch').options.selectedIndex;    
    phoneModel = document.getElementById('tel_model_purch').options[n].value;
    if (quantity==''){
        alert('Поле количество должно быть заполнено');
    }else{
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/admin/add_purchase",
                data:{component, master_insp, price, quantity, phoneModel}
                });
            }
            $CP=ajaxRequest();
            $CP
            .done(function(data){
            if (data=='success'){
                alert("Успешно");
                add_purchases();
            }
        });
    }
}

