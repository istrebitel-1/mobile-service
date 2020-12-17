from flask import Flask, render_template, request, send_from_directory
import os
# custom
from models.models import (request_info, phone_manufacturers, phone_models, 
    masters_fio, send_order, login_cl, registration, order_info, login_emp,
    user_roles, user_role, add_empl, get_ord_ids, change_order, fi_ids, add_fi,
    get_ord_ids1, add_mi, add_purchase, get_master_insp_id, get_compl, phones_full_name)


app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


# Проверка статуса заказа
@app.route('/db_order_status', methods=['GET'])
def get_order_status():
    try:
        output = request.args['order_id']
        output = request_info(output)
        return output
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# Получение производителей телефонов
@app.route('/db_get_manufacturers', methods=['GET'])
def get_manufacturer_info():
    try:
        output = phone_manufacturers()
        return output
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# Получение моделей телефонов
@app.route('/db_get_phone_models', methods=['GET'])
def get_phone_models():
    try:
        output = request.args['manufacturer']
        output = phone_models(output)
        return output
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# Получение списка мастеров
@app.route('/db_get_masters', methods=['GET'])
def get_masters():
    try:
        output = masters_fio()
        return output
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# Отправка заказа
@app.route('/db_order_send', methods=['GET'])
def send_order_api():
    try:
        login = request.args['login']
        manufacturer = request.args['manufacturer']
        model = request.args['model']
        problem = request.args['problem']
        master = request.args['master']

        if send_order(login, manufacturer, model, problem, master) == 'done':
            return 'succes'
        else:
            return 'fail'
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# Вход для клиента
@app.route('/login_client', methods=['GET'])
def client_login():
    try:
        login = request.args['login']
        password = request.args['password']
        return login_cl(login, password)
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# Регистрация
@app.route('/register_client')
def client_register():
    try:
        login = request.args['login']
        password = request.args['password']
        fio = request.args['fio']
        date_of_birth = request.args['date_of_birth']
        phone = request.args['phone']
        
        return registration(login, password, fio, date_of_birth, phone)
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# Информация о заявках
@app.route('/db_get_orders', methods=['GET'])
def orders():
    try:

        login = request.args['login_user']
        return order_info(login)
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


#
#                       Панель администратора
# ----------------------------------------------------------------------------
#
@app.route('/admin')
def admin_panel():
    return render_template('admin_panel_login.html')


@app.route('/admin/login/check', methods=['GET'])
def check_login_admin():
    try:
        login = request.args['login']
        password = request.args['password']
        if login_emp(login, password) == 'success':
            return user_role(login)
        else:
            return 'wrong'
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


@app.route('/get_roles', methods=['GET'])
def get_roles():
    try: 
        return user_roles()
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# Добавление работника
@app.route('/admin/empl_add', methods=['GET'])
def addempl():
    fio = request.args['fio']
    birth_date = request.args['birth_date']
    sex = request.args['sex']
    series = request.args['series']
    p_number = request.args['p_number']
    issue_dt = request.args['issue_dt']
    issue_place = request.args['issue_place']
    city = request.args['city']
    street = request.args['street']
    house = request.args['house']
    building = request.args['building']
    flat = request.args['flat']
    phone = request.args['phone']
    email = request.args['email']
    schedule_id = request.args['schedule_id']
    role_id = request.args['role_id']
    position_id = request.args['position_id']
    login_e = request.args['login_e']
    password_e = request.args['password_e']
    rate = request.args['rate']

    try:
        if add_empl(fio, birth_date, sex, series, p_number,issue_dt,
            issue_place, city, street, house, building,flat, 
            phone,email ,schedule_id, role_id, position_id, login_e, 
            password_e, rate) == 'success':
            return 'success'
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# Список заказов
@app.route('/db_get_order_id', methods=['GET'])
def getorders():
    try:
        return get_ord_ids()
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# список заказов, которые прошли первичный осмотр
@app.route('/db_get_order_id1', methods=['GET'])
def getorders1():
    try:
        return get_ord_ids1()
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# изменить сатус заявки
@app.route('/admin/change_order', methods=['GET'])
def change_req():
    order_id = request.args['order_id']
    status = request.args['status']
    try:
        change_order(order_id, status)
        return 'succes'
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'
        

# получение id_fi
@app.route('/db_get_perv_id', methods=['GET'])
def perv_id():
    try:
        return fi_ids()
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# добавить первичный осмотр
@app.route('/admin/change_order1', methods=['GET'])
def add_fi1():
    try:
        order_id = request.args['order_id']
        login = request.args['login']
        comment = request.args['comment']
        defect = request.args['defect']
        price = request.args['price']
        photo = request.args['photo']
        
        add_fi(order_id, login, comment, defect, price, photo)
        return 'success'
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# добавить осмотр мастером
@app.route('/admin/change_order2', methods=['GET'])
def add_mi1():
    try:
        perv_id = request.args['perv_id']
        login = request.args['login']
        comment = request.args['comment']
        sootv = request.args['sootv']
        
        add_mi(perv_id, login, sootv, comment)
        return 'success'
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


# Добавить закупку
@app.route('/admin/add_purchase', methods=['GET'])
def add_purch():
    try:
        component = request.args['component']
        master_insp = request.args['master_insp']
        price = request.args['price']
        quantity = request.args['quantity']
        phone = request.args['phoneModel']

        add_purchase(component, master_insp, price, quantity, phone)
        
        return 'success'
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


@app.route('/db_get_components', methods=['GET'])
def get_compll():
    try:
        phone = request.args['phone']
        return get_compl(phone)
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


@app.route('/db_get_master_insp', methods=['GET'])
def get_mi_id():
    try:
        return get_master_insp_id() 
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'


@app.route('/db_phone_name_full', methods=['GET'])
def phone_name_full():
    try:
        master_insp = request.args['master_insp']
        return phones_full_name(int(master_insp))
    except Exception as e:
        print(e)
        return 'internal server error, please contact system administrator'
#
# ----------------------------------------------------------------------------
#


if __name__ == "__main__":
    app.run(debug=True, host='26.173.145.160', port='80')
