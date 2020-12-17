import pypyodbc
import json
import time
from random import randint

connection = pypyodbc.connect('Driver={SQL Server};Server=26.173.145.160;Database=m_service;uid=site;pwd=site11')
cursor = connection.cursor()

#
#               Шаблонные функции на получение данных из БД
# ----------------------------------------------------------------------------------
#
def get_data(query):
    cursor.execute(query)
    results = cursor.fetchall()
    return results


def jsonify(some_tuple):
    results = json.dumps(some_tuple, ensure_ascii=False, separators=(',', ': '))
    return results
#
# ----------------------------------------------------------------------------------
#


#                   Регистрация и вход
# --------------------------------------------------------------
# 
def registration(login, password, fio, date_of_birth, phone):
    login_list = get_data("select lower(login) from client c")
    similar_login_check = False

    for item in login_list:
        for subitem in item:
            if login == subitem:
                similar_login_check = True
                break
        else:
            continue
        break

    if similar_login_check == True:
        return 'fail'
    else:
        cursor.execute(
            "insert into client "
            "values ('%s', cast('%s' as date), '%s', lower('%s'), '%s')" 
            % (fio, date_of_birth, phone, login, password)
            )
        cursor.commit()
        return 'succes'


def login_emp(login, password):
    logins = get_data("select lower(login), password from employees e")
    check = False

    for item in logins:
        if login == item[0] and password == item[1]:
            check = True

    if check == True:
        return 'success'
    else:
        return 'wrong'


def login_cl(login, password):
    logins = get_data("select lower(login), password from client")
    check = False

    for item in logins:
        if login == item[0] and password == item[1]:
            check = True

    if check == True:
        return 'succes'
    else:
        return 'wrong'
#
# --------------------------------------------------------------
#


# Информация о заявках
def request_info(id_request):
    out = jsonify(get_data(
        "select r.id_request, "
            "case "
                "when r.status = '1' then 'В работе' "
                "when r.status = '2' then 'Выполнено' "
                "when r.status = '0' then 'В ожидании' "
            "end status,"
            "r.request_date, "
            "case "
                "when e.fio_employee is not null then e.fio_employee else 'Мастер не определён' "
            "end fio, "
            "case "
                "when e.mobile_number is not null then e.mobile_number else '-' "
            "end phone,"
            "fi.repair_cost "
        "from client c "
            "join request r on r.id_client = c.id_client "
            "left join first_inspection fi on fi.id_request = r.id_request "
            "left join master_inspection mi2 on mi2.id_first_inspection = fi.id_first_inspection "
            "left join employees e on e.id_employee = mi2.id_master "
        "where r.id_request = %s" % id_request
    ))
    return out


# Информация о производителях
def phone_manufacturers():
    out = jsonify(get_data(
        "select distinct p.manufacturer"
        " from phone p"
    ))
    return out


# Информация о моделях по производителю
def phone_models(manufacturer):
    out = jsonify(get_data(
        "select distinct p.model"
        " from phone p"
        " where upper(p.manufacturer) = upper('%s') " % manufacturer
    ))
    return out


# Информация о мастерах
def masters_fio():
    out = jsonify(get_data("select fio_employee from masters_info"))
    return out


# Отправка заказа
def send_order(login, manufacturer, model, problem, master):
    check_m = False
    check_p = False
    phone_id = '' #tmp
    master_id = -1
    
    # получение производителя
    cursor.execute("select distinct p.manufacturer from phone p")
    manufacturers = cursor.fetchall()

    # получение модели телефофна 
    cursor.execute("select distinct p.id_phone, p.model from phone p")
    models = cursor.fetchall()
    
    # получение id мастера
    if master != 'others':
        cursor.execute("select id_employee from masters_info "
                        "where fio_employee = '%s'" % master)
        master_id = cursor.fetchall()[0][0]
    else:
        cursor.execute("select id_employee from masters_info ")
        master_id = cursor.fetchall()
        rand = randint(1, len(master_id))
        master_id = master_id[rand-1][0]

    # получение id клиента
    cursor.execute("select id_client from client where login = '%s'" % login)
    client_id = cursor.fetchall()[0][0]

    # Проверка на то, есть ли такой производитель в базе
    for item in manufacturers:
        for subitem in item:
            if subitem == manufacturer:
                check_m = True

    # Если есть, то проверка, есть ли такая модель телефона
    if check_m == True:
        for item in models:
            for i in range(len(item)):
                if item[i] == model:
                    check_p = True
                    phone_id = item[i-1]
                    break

        # Если есть, то вставка данных в заказ
        if check_p == True:
            cursor.execute("insert into request values(SYSDATETIMEOFFSET(), '0', %i, %i, %i, '%s')"
                            %(client_id, phone_id, master_id, problem))
            cursor.commit()
            return 'done'
        else: # Если есть производитель, но нет модели
            cursor.execute("insert into phone values('%s', '%s')" %(manufacturer, model))
            cursor.commit()
            
            cursor.execute("select max(id_phone) from phone p")
            phone_id = cursor.fetchall()[0][0]

            cursor.execute("insert into request values(SYSDATETIMEOFFSET(), 1, %i, %i, %i, '%s')"
                                %(client_id, phone_id, master_id, problem))
            cursor.commit()  
            return 'done'
    # Если нет производителся и модели
    else:
        cursor.execute("insert into phone values('%s', '%s')" %(manufacturer, model))
        cursor.commit()
        
        cursor.execute("select max(id_phone) from phone p")
        phone_id = cursor.fetchall()[0][0]

        print('проходит')
        cursor.execute("insert into request values(SYSDATETIMEOFFSET(), 1, %i, %i, %i, '%s')"
                            %(client_id, phone_id, master_id, problem))
        cursor.commit()  

    return 'done'


# инфа о заказах по юзеру
def order_info(login):
    return jsonify(get_data(
        "select r.id_request, r.request_date, r.problem, "
            "case "
                "when e.fio_employee is not null then e.fio_employee else 'Мастер не определён' "
            "end fio, "
            "case when r.status = '1' then 'В работе' "
                "when r.status = '2' then 'Выполнено' "
                "when r.status = '0' then 'В ожидании' "
            "end status,"
            "case "
                "when p2.url is not null then p2.url else '-' "
            "end photo "
        "from client c "
        "join request r on r.id_client = c.id_client "
        "left join first_inspection fi on fi.id_request = r.id_request "
        "left join master_inspection mi2 on mi2.id_first_inspection = fi.id_first_inspection "
        "left join employees e on e.id_employee = mi2.id_master "
        "left join photo p2 on p2.id_first_inspection = fi.id_first_inspection "
        "where lower(c.login) = lower('%s')" % login
    ))


# Получение всех ролей
def user_role(login):
    return get_data(
        "select r.role_name "
        "from roles r "
        "join employees e on r.id_role = e.id_role "
        "where e.login = '%s'" % login
    )[0][0]


# Получение роли пользователя
def user_roles():
    return jsonify(get_data(
        "select top(3) r.role_name "
        "from roles r "
    ))


# Добавление работника 
def add_empl(fio, birth_date, sex, series, p_number,issue_dt,
            issue_place, city, street, house, building,flat, 
            phone,email ,schedule_id, role_id, position_id, login_e, 
            password_e, rate):
    
    print(building)
    if house == None:
        house = ''

    if building == None:
        building = ''

    if flat == None:
        flat = ''

    if email == None:
        email = ''

    cursor.execute(
            "insert into adress "
            "values('%s', '%s', '%s', '%s', '%s')" % (city, street, house, building, flat)
        )
    cursor.commit()

    cursor.execute("select max(id_adress) from adress")
    id_adress = cursor.fetchall()[0][0]
    print('adress ', id_adress)

    cursor.execute(
        "insert into passport "
        "values('%s', '%s', '%s', '%s')" %(series, p_number, issue_dt, issue_place)
    )
    cursor.execute("select max(id_passport) from passport")
    id_passport = cursor.fetchall()[0][0]
    print(id_passport)

    if schedule_id == '09:00 - 18:00':
        schedule_id = 1
    elif schedule_id == '10:00 - 19:00':
        schedule_id = 2
    else:
        schedule_id = 3
    
    print('schedule ', schedule_id)

    if role_id == 'Оператор':
        role_id = 1
    elif role_id == 'Инженер':
        role_id = 2
    else:
        role_id = 3

    print('role ', role_id)

    if position_id == 'Мастер':
        position_id = 1
    elif position_id == 'Администратор':
        position_id = 2
    elif position_id == 'Уборщик':
        position_id = 3
    elif position_id == 'Управляющий складом':
        position_id = 4
    elif position_id == 'Хороший человек':
        position_id = 5
    elif position_id == 'Директор':
        position_id = 6
    elif position_id == 'Заместитель директора (грузчик)':
        position_id = 7
    else:
        position_id = 8

    print('pos id ', position_id)

    try:
        cursor.execute(
            "insert into employees(fio_employee,date_of_birth,sex, "
            "id_passport,id_adress,mobile_number,email,id_schedule,id_role,id_position,login,password,rate) "
	        "values('%s', '%s', '%s', %i, %i, '%s', '%s', %i, %i, "
            "%i, '%s', '%s', '%s')" % (
            str(fio), str(birth_date), str(sex), int(id_passport), int(id_adress), 
            str(phone),str(email) ,int(schedule_id), int(role_id), int(position_id), str(login_e), 
            str(password_e), str(rate)     
            )
        )
        cursor.commit()
        return 'success'
    except Exception as e:
        print(e)
        cursor.rollback()
        return 'fail'


# получение id заказов
def get_ord_ids():
    return jsonify(get_data("select id_request from request"))


def get_ord_ids1():
    return jsonify(get_data("select  r.id_request from request r "
                            "where r.id_request not in (select id_request from first_inspection fi)"))


# получение id первичных осмотров
def fi_ids():
    return jsonify(get_data(
        "select id_first_inspection from first_inspection fi "
        "where id_first_inspection not in (select id_first_inspection from master_inspection mi)"
    ))


# Изменение статуса заказа
def change_order(order_id, status):
    if status == 'В ожидании':
        status = 0
    elif status == 'В работе':
        status = 1
    elif status == 'Выполнено':
        status = 2

    cursor.execute("update request set status = '%s' where id_request = %i" % (status, int(order_id)))
    cursor.commit()


# добавление первичного осмотра и фото
def add_fi(order_id, login, comment, defect, price, photo):
    id_empl = get_data(
        "select id_employee from employees e "
        "where login = '%s'" %login
        )[0][0]

    cursor.execute(
        "insert into first_inspection " 
        "values(SYSDATETIMEOFFSET(), %i, '%s', %i, %i, %i) " % (int(defect), comment, int(id_empl), int(order_id), int(price))
    )
    cursor.commit()

    id_fi = get_data("select max(id_first_inspection) from first_inspection fi")[0][0]

    cursor.execute("insert into photo "
                    "values(%i, '%s')" % (int(id_fi), photo)
    )
    cursor.commit()

    return 'success'


# добавление осмотра мастером
def add_mi(perv_id, login, sootv, comment):
    id_empl = get_data(
        "select id_employee from employees e "
        "where login = '%s'" %login
    )[0][0]
    
    cursor.execute(
        "insert into master_inspection "
        "values(%i, %i, %i, SYSDATETIMEOFFSET(), '%s')" % (int(perv_id), int(id_empl), int(sootv), comment) 
    )
    cursor.commit()


# Добавление закупок
def add_purchase(component, master_insp, price, quantity, phone):
    print (component, ' ', master_insp, ' ',price,' ', quantity,' ', phone)
    id_phone = get_data(
        "select p2.id_phone from  phone p2 "
            "join request r on r.id_phone = p2.id_phone "
            "join first_inspection fi on fi.id_request = r.id_request "
            "join master_inspection mi on mi.id_first_inspection = fi.id_first_inspection "
        "where mi.id_master_inspection = %i" % int(master_insp)
    )[0][0]

    comp_check = False
    comp_tmp = get_data(
        "select c.name, c.id_component from components c "
        "join phone p2 on p2.id_phone = c.id_phone "
        "where p2.id_phone = %i" % int(id_phone)
    )

    comp_id = 0
    for item in comp_tmp:
        if component == item[0]:
            comp_check = True
            comp_id = item[1]
            break

    if (comp_check == True):
        comp = get_data(
            "select c.id_component from components c "
            "join phone p2 on p2.id_phone = c.id_phone "
            "where c.name = '%s' and p2.id_phone = %i " %(component, int(id_phone))
        )[0][0]
        
        cursor.execute(
            "insert into purchases(id_component, id_master_inspection, quantity) "
            "values(%i, %i, %i)" %(int(comp_id), int(master_insp), int(quantity))
        )
        cursor.commit()
        return 'success'
    else:
        cursor.execute(
            "insert into components "
            "values(%i, '%s', %i)" % (int(id_phone), component, int(price))
        )
        cursor.commit()

        comp_id = get_data("select max(id_component) from components c ")[0][0]

        cursor.execute(
            "insert into purchases(id_component, id_master_inspection, quantity) "
            "values(%i, %i, %i)" %(int(comp_id), int(master_insp), int(quantity))
        )
        cursor.commit()
        return 'success'

    


# ИД осмотра мастером
def get_master_insp_id():
    return jsonify(get_data("select id_master_inspection from master_inspection mi "))


# Получение имён комплектующих
def get_compl(phone):
    return jsonify(get_data(
        "select distinct name from components c "
        "join phone p on p.id_phone = c.id_phone "
        "where p.manufacturer+' '+p.model = '%s'" % phone
    ))


# Названия тель-а-фонов
def phones_full_name(master_insp):
    return jsonify(get_data(
        "select p.manufacturer+' '+p.model from  phone p "
        "join request r on r.id_phone = p.id_phone "
        "join first_inspection fi on fi.id_request = r.id_request "
        "join master_inspection mi on mi.id_first_inspection = fi.id_first_inspection "
        "where mi.id_master_inspection = %i " % master_insp
    ))