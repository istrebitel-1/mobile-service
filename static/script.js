function UserReg_click(){
  document.getElementById("LoginPage").style.width = "100%";
  SwitchMenu('do_registr');
}
function UserLogin_click(){
  document.getElementById("LoginPage").style.width = "100%";
  SwitchMenu('do_login');
}

function SwitchMenu(temp){
 var tabcontent= document.getElementsByClassName('user_enteres_blocks');
 for (let i=0; i<tabcontent.length; i++){
    tabcontent[i].style.display='none';
  }
  document.getElementById(temp).style.display='block';
}

let login_user='';

function user_login(us_login,us_password){
  console.log('log', us_login, us_password);
  let login, password;
  if(us_login==''||us_password==''){
    login=document.getElementById("login-input").value;
    password=document.getElementById("password-input").value;
  }else{
    login=us_login;
    password=us_password;
  }
  if ((login!='')&&(password!='')){
    document.getElementById('warningLogMessage').innerHTML="";
    content=document.getElementsByClassName('warLog');
    for (let i=0; i<content.length; i++){
      content[i].style.border='1px solid #ced4da';
    }
    
    function ajaxRequest(){
      return $.ajax({
          type:"GET",
          url:"/login_client",
          data:{login, password}
          });
      }
      $log=ajaxRequest();
      $log
      .done(function(data){
        console.log('ajax');
        let logData=data;
        if (logData=='wrong'){
          document.getElementById('warningLogMessage').innerHTML="<div class='alert alert-danger col-12'><strong>Упс...</strong>Неверный логин или пароль</div>";
        }else{
         login_user=login;
         alert('Добро пожаловать,'+login_user+'');
         closeOver();
         html_str1='';
         html_str1+="<p>Добро пожаловать,&nbsp;"+login_user+"</p>";
         html_str1+="<button class='ent-btn btn' onclick='userWindow()'>Окно&nbsp;заказов</button>"
         document.getElementById('users_button').innerHTML=html_str1;
         $('#user_navbar').append('<li class="nav-item"><a class="nav-link" href="#section4">Окно&nbsp;заказов</a></li>');
         html_str1='';
         html_str1+="<div class='container neworderblock'>";
         html_str1+="<div class='row' id='user_order_btn'>";
         html_str1+="<div class='col-12'>";
         html_str1+="<button class='act-btn btn mb-4' onclick='ShowUserOrdersWindow()'>Посмотреть&nbsp;заказы</button>";
         html_str1+="</div>";
         html_str1+="</div>";
         html_str1+="<div class='row' id='user_order_list'>";
         html_str1+="</div>";
         html_str1+="</div>";
         html_str1+="</div>";
         html_str1+="</div>";
         var ele=document.createElement("div");
         ele.setAttribute("class",'container-fluid user_order mb-4');
         ele.setAttribute("id","section4");
         $('#vstavka').append(ele);
         ele.innerHTML=html_str1;
         elem=document.getElementsByClassName('message');
         for (let i=0; i<elem.length; i++){
            elem[i].style.display='none';
         }
        }
      });
  }else{
    document.getElementById('warningLogMessage').innerHTML="<div class='alert alert-danger col-12'><strong>Упс...</strong>Проверьте правильность ввода</div>";
    content=document.getElementsByClassName('warLog');
    for (let i=0; i<content.length; i++){
      content[i].style.border='1px solid red';
    }
  }
}
function user_reg(){
  let login, password, fio, date_of_birth, phone;
  login=document.getElementById('login-reg-input').value;
  password=document.getElementById("password-reg-input").value;
  fio=document.getElementById("fio-reg-input").value;
  date_of_birth=document.getElementById('date').value;
  phone =document.getElementById("tel-reg-input").value;
  if((login=='')||(password=='')||(fio=='')||(date_of_birth=='')||(phone =='')){
    content=document.getElementsByClassName('war');
    for (let i=0; i<content.length; i++){
      content[i].style.border='1px solid red';
    }
    document.getElementById('warningRegMessage').innerHTML="<div class='alert alert-danger col-12'><strong>Упс...</strong>Проверьте правильность ввода</div>";
  }else{
    content=document.getElementsByClassName('war');
    for (let i=0; i<content.length; i++){
      content[i].style.border='1px solid #ced4da';
      document.getElementById('warningRegMessage').innerHTML="";
    }
    function ajaxRequest(){
      return $.ajax({
          type:"GET",
          url:"/register_client",
          data:{login, password, fio, date_of_birth, phone}
          });
      }
      $reg=ajaxRequest();
      $reg
      .done(function(data){
        let regData=data;
        if (regData=='fail'){
          document.getElementById('warningRegMessage').innerHTML="<div class='alert alert-danger col-12'><strong>Упс...</strong>Данный логин уже существует</div>";
        }else{
          console.log('reg', login, password);
          setTimeout(user_login, 100, login, password);    
        }
      });    
  }
}

function closeOver(){
  document.getElementById("LoginPage").style.width = "0%";
}


function ShowMakeOrdersWindow() {

  if(login_user==''){
    elem=document.getElementsByClassName('message');
    for (let i=0; i<elem.length; i++){
      elem[i].style.display='block';
    }
  }
  else{
    elem=document.getElementsByClassName('message');
    for (let i=0; i<elem.length; i++){
      elem[i].style.display='none';
    }
  document.getElementById('joinOrder').style.display='none';
  document.getElementById('orderSection').style.display='block';
  document.getElementById("manufacturer-input").style.display='block';
  document.getElementById("model-input").style.display='block';
  document.getElementById('problem-input').innerHTML='';

  function ajaxRequest(){
    return $.ajax({
        type:"GET",
        url:"/db_get_manufacturers",
        data:'getman'
        });
    }
    $manufact=ajaxRequest();
    $manufact
    .done(function(data){
      let manufactData=JSON.parse(data);
      html_str1='';
      html_str1+="<option value='others'>другая</option>";
      for (let i=0; i<manufactData.length; i++){
        html_str1+="<option value='"+manufactData[i][0]+"'>"+manufactData[i][0]+"</option>";
      }
      document.getElementById('manufacturer').innerHTML=html_str1;
      function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/db_get_masters",
            data:'getmasters'
            });
        }
        $masters=ajaxRequest();
        $masters
        .done(function(data){
          console.log(data);
          let mastersData=JSON.parse(data);
          html_str1='';
          html_str1+="<option value='others'>любой</option>";
          for (let i=0; i<mastersData.length; i++){
            html_str1+="<option value='"+mastersData[i][0]+"'>"+mastersData[i][0]+"</option>";
          }
          document.getElementById('masters').innerHTML=html_str1;
        });      
      
    });
  }
}

function getModel(elm){

  var n=document.getElementById(elm.id).options.selectedIndex;    
  var manufacturer = document.getElementById(elm.id).options[n].value;
  var text_box=document.getElementById("manufacturer-input");

  if (manufacturer!='others'){
    text_box.innerHTML='';
    text_box.style.display='none';
  

    function ajaxRequest(){
      return $.ajax({
          type:"GET",
          url:"/db_get_phone_models",
          data:{manufacturer}
          });
      }
      $models=ajaxRequest();
      $models
      .done(function(data){
        let modelsData=JSON.parse(data);
        html_str1="";
        html_str1+="<option value='others'>другая</option>";
        console.log(data);
        console.log(modelsData.length);
        for (let i=0; i<modelsData.length; i++){
          console.log(modelsData[i][0]);
          html_str1+="<option value='"+modelsData[i][0]+"'>"+modelsData[i][0]+"</option>";
        }
       document.getElementById('models').innerHTML=html_str1;
      });
    }
    else {
      text_box.style.display='block';
      html_str1="<option value='others'>другая</option>";
      document.getElementById('models').innerHTML=html_str1;
      document.getElementById("model-input").style.display='block';
    }

}

function Model(elm){

  var n=document.getElementById(elm.id).options.selectedIndex;    
  var models = document.getElementById(elm.id).options[n].value;
  var text_box=document.getElementById("model-input");

  if (models!='others'){
    text_box.innerHTML='';
    text_box.style.display='none';
  }else{
    text_box.style.display='block';
  }

}

function MakeOrder(){

  let manufacturer, model, problem, master;

  var n=document.getElementById('manufacturer').options.selectedIndex;    
  var manufacturer_name = document.getElementById('manufacturer').options[n].value;
  if (manufacturer_name!='others'){
    manufacturer=manufacturer_name;
  }else{
    manufacturer_name = document.getElementById('manufacturer-input').value;
    manufacturer=manufacturer_name;
  }

  n=document.getElementById('models').options.selectedIndex;    
  var model_name = document.getElementById('models').options[n].value;
  if (model_name!='others'){
    model=model_name;
  }else{
    model_name = document.getElementById('model-input').value;
    model=model_name;
  }

  problem=document.getElementById('problem-input').value;

  n=document.getElementById('masters').options.selectedIndex;
  master=document.getElementById('masters').options[n].value;
  login=login_user;
  console.log(login,manufacturer, model, problem, master);
  function ajaxRequest(){
    return $.ajax({
        type:"GET",
        url:"/db_order_send",
        data:{login, manufacturer, model, problem, master}
        });
    }
    $order_status=ajaxRequest();
    $order_status
    .done(function(data){
      let order_status=data;
      if (order_status=='fail'){
        alert('Перепроверьте данные и попробуйте снова');
      }else{
        alert('Успешно!');
        html_str1="<option value='others'>другая</option>";
        document.getElementById('manufacturer').innerHTML=html_str1;
        document.getElementById("manufacturer-input").innerHTML='';
        document.getElementById("models").innerHTML=html_str1;
        document.getElementById("model-input").innerHTML='';
        document.getElementById('problem-input').innerHTM='';
        html_str1="<option value='others'>любой</option>";
        document.getElementById('masters').innerHTML=html_str1;
        document.getElementById('orderSection').style.display='none';
        document.getElementById('joinOrder').style.display='block';
        document.getElementById('user_order_btn').style.display='block';
        document.getElementById('user_order_list').style.display='none';
      }
    });
}
function userWindow(){
  $(window).scrollTop($('#section4').offset().top);
}
function ShowUserOrdersWindow(){
  document.getElementById('user_order_btn').style.display='none';
  document.getElementById('user_order_list').style.display='block';
  document.getElementById('user_order_list').innerHTML='';
  function ajaxRequest(){
    return $.ajax({
        type:"GET",
        url:"/db_get_orders",
        data:{login_user}
        });
    }
    $orderlist=ajaxRequest();
    $orderlist
    .done(function(data){
      let orderlistData=JSON.parse(data);
      elem=document.getElementById('user_order_list');
      if (orderlistData[0]!=undefined){
      for (let i=0; i<orderlistData.length; i++){
        html_str1='';
        html_str1+="<div class='row'>";
        html_str1+="<div class='col-12 col-lg-2 col-md-4'>";
        html_str1+="<p class='headItem'>Номер&nbsp;заказа</p>";
        html_str1+="<p class='bodyItem'>"+orderlistData[i][0]+"</p>";
        html_str1+="</div>";
        html_str1+="<div class='col-12 col-lg-2 col-md-4'>";
        html_str1+="<p class='headItem'>Дата</p>";
        html_str1+="<p class='bodyItem'>"+orderlistData[i][1]+"</p>";
        html_str1+="</div>";
        html_str1+="<div class='col-12 col-lg-2 col-md-4'>";
        html_str1+="<p class='headItem'>Проблема</p>";
        html_str1+="<p class='bodyItem'>"+orderlistData[i][2]+"</p>";
        html_str1+="</div>";
        html_str1+="<div class='col-12 col-lg-2 col-md-4'>";
        html_str1+="<p class='headItem'>ФИО&nbsp;мастера</p>";
        html_str1+="<p class='bodyItem'>"+orderlistData[i][3]+"</p>";
        html_str1+="</div>";
        html_str1+="<div class='col-12 col-lg-2 col-md-4'>";
        html_str1+="<p class='headItem'>Статус&nbsp;заявки</p>";
        html_str1+="<p class='bodyItem'>"+orderlistData[i][4]+"</p>";
        html_str1+="</div>";
        html_str1+="<div class='col-12 col-lg-2 col-md-4'>";
        html_str1+="<p class='headItem'>Фотография</p>";
        html_str1+="<p class='bodyItem'><buttton class='btn btn-more' id='"+orderlistData[i][5]+"' onclick='OpenMore(this)'>открыть</buttton></p>";
        html_str1+="</div>";
        html_str1+="</div>";
        var ele=document.createElement("div");
        ele.setAttribute("class",'col-12 mb-2 pt-4');
        ele.setAttribute("id","orderrow"+i+"");
        elem.appendChild(ele).innerHTML = html_str1;
      }
    }else{
      html_str1='';
      html_str1+="<div class='row'>";
      html_str1+="<div class='col-12 text-center'>";
      html_str1+="<p class='h5'>У вас еще нет заказов</p>";
      html_str1+="</div>";
      html_str1+="<div class='col-12'>";
      html_str1+="<button class='act-btn btn mb-4' onclick='Scroll_to_orders()'>Оформить заказ</button>";
      html_str1+="</div>";
      html_str1+="</div>";
      var ele=document.createElement("div");
      ele.setAttribute("class",'col-12 mb-2 pt-4');
      elem.appendChild(ele).innerHTML = html_str1;
    }
    });

}
function Scroll_to_orders(){
  $(window).scrollTop($('#section3').offset().top);
  ShowMakeOrdersWindow();
}
function OpenMore(elem){
  url=elem.id;
  html_str1='';
  html_str1+="<div class='row'>";
  html_str1+="<div class='col-12 text-center'>"; 
  if(url=='-'){
    html_str1+="<p class='headItem'>На данном этапе фотография устройства отсутствует</p>";
  }else{
    html_str1+="<img height='500px' src='"+url+"'/>";
  }
  html_str1+="</div>";
  html_str1+="</div>";
  document.getElementsByClassName("comploverlay")[0].innerHTML=html_str1;
  document.getElementById("MoreAbDevice").style.width = "100%";
}
function closeMoreOver() {
    document.getElementById("MoreAbDevice").style.width = "0%";
    document.getElementsByClassName("comploverlay")[0].innerHTML='';
}