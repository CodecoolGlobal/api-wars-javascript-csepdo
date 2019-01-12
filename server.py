from flask import Flask, render_template, redirect, request, session
import requests
import data_handler
import os
import password_verfication
import psycopg2

app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route('/')
def home():
    headers = ['NAME', 'DIAMETER (km)', 'CLIMATE', 'TERRAIN', 'SURFACE WATER (%)', 'POPULATION', 'RESIDENTS', 'VOTE']
    data_source = 'https://swapi.co/api/planets'
    table_data = requests.get(data_source).json()
    return render_template('trial.html',
                           headers=headers,
                           table_data=table_data['results'])


@app.route('/registration')
def load_registration_page():
    loaded_page = int(request.args.get('page_number', 1))
    return render_template('registration.html', page_number=loaded_page)


@app.route('/registration', methods=['POST'])
def registration():
    user_data = {'user_name': request.form['username'],
                 'user_password': request.form['password'],
                 'confirm_password': request.form['confirm']}
    hashed_password = password_verfication.hash_password(user_data['user_password'])
    if password_verfication.verify_password(user_data['confirm_password'], hashed_password) is True:
        message = 'Your registration was successful. Please, log in to continue!'
        try:
            data_handler.save_user(user_data, hashed_password)
            return render_template('registration.html', message=message)
        except psycopg2.IntegrityError as e:
            error_message = 'Something went wrong. Please, try again!'
            if 'user_pk' in str(e):
                error_message = 'This username is taken.'
            elif 'user_user_email_uindex' in str(e):
                error_message = 'This email is taken.'
            return render_template('registration.html', message=error_message)
    else:
        message = 'The passwords don\'t match. Please, try again!'
    return render_template('registration.html',
                           message=message,
                           username=request.form['username'],
                           email=request.form['email'])


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        usercolor = request.form['user-color']
        user = data_handler.get_user_by_name(username)
        if user and password_verfication.verify_password(password, user['password']):
            session['user'] = user['username']
            session['usercolor'] = usercolor
            return redirect('/')
        else:
            message = "Login failed. Please check your details."
            return render_template('login.html',
                                   message=message,)
    return render_template('login.html')


@app.route('/logout')
def logout():
    if 'user' in session:
        session.pop('user', None)
        return redirect('/')


if __name__ == '__main__':
    app.run(
        debug=True,
    )
