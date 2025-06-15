from flask import Flask, render_template, request, redirect, session, url_for, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Question, Quiz, Lesson
from datetime import date, timedelta

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///redaplay.db'
db.init_app(app)

new_user = User(
    username='d',
    email='d@d',
    password=generate_password_hash('d'),
    streak=5,
    last_login=date.today(),
    diamonds=10
)

with app.app_context():
    db.create_all()
    if not User.query.filter_by(email='d@d').first():
        db.session.add(new_user)
    lesson_data = [
        (1, "Lição 1: Saudações", "Conteúdo da Lição 1", "https://www.youtube.com/watch?v=lD44qe4_sCQ"),
        (2, "Lição 2: Quiz de Redação", "Conteúdo da Lição 2", None),
        (3, "Lição 3: Escreva sua Introdução", "Conteúdo da Lição 3", None),
        (4, "Lição 4: Aula", "Conteúdo da Lição 4", "https://www.youtube.com/watch?v=dzLMxHjrS70"),
        (5, "Lição 5: Quiz de Argumentação e Gramática", "Conteúdo da Lição 5", None),
    ]
    for number, title, content, video_url in lesson_data:
        if not Lesson.query.filter_by(number=number).first():
            db.session.add(Lesson(number=number, title=title, content=content, video_url=video_url))
    db.session.commit()
    
@app.route('/', methods=['GET', 'POST'])
def welcome():
    return render_template('welcome.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        action = request.form.get('action')
        username = request.form['username']
        password = request.form['password']
        if action == 'login':
            user = User.query.filter_by(username=username).first()
            if user and check_password_hash(user.password, password):
                if user.last_login is not None:
                    if user.last_login == date.today() - timedelta(days=1):
                        user.streak += 1
                    elif user.last_login != date.today():
                        user.streak = 1
                else:
                    user.streak = 1
                user.last_login = date.today()
                db.session.commit()
                session['user_id'] = user.id
                return redirect('/inicio')
            else:
                error = 'Credenciais inválidas.'
        elif action == 'register':
            email = request.form['email']
            if User.query.filter((User.username == username) | (User.email == email)).first():
                error = 'Nome de usuário ou E-mail já existente.'
            else:
                hashed_pw = generate_password_hash(password)
                new_user = User(username=username, email=email, password=hashed_pw)
                db.session.add(new_user)
                db.session.commit()
                session['user_id'] = new_user.id
                return redirect('/login')
    return render_template('index.html', error=error)

@app.route('/update', methods=['POST'])
def update():
    if 'user_id' not in session:
        return redirect('/login')
    user = User.query.get(session['user_id'])
    if not user:
        return redirect('/login')

    new_email = request.form['new-email']
    new_username = request.form['new-username']
    new_password = request.form['new-password']

    if new_email and new_email != user.email:
        if User.query.filter_by(email=new_email).first():
            return "E-mail já cadastrado.", 400
        user.email = new_email

    if new_username and new_username != user.username:
        if User.query.filter_by(username=new_username).first():
            return "Nome de usuário já cadastrado.", 400
        user.username = new_username

    if new_password:
        user.password = generate_password_hash(new_password)

    db.session.commit()
    return redirect('/login')
    
@app.route('/delete', methods=['POST'])
def delete():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        db.session.delete(user)
        db.session.commit()
        session.pop('user_id', None)
    return redirect('/')

@app.route('/inicio', methods=['GET','POST'])
def inicio():
    user = User.query.get(session['user_id'])
    lessons = Lesson.query.order_by(Lesson.number).all()
    return render_template('main.html', user=user, lessons=lessons)

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect('/')

@app.route('/perfil')
def perfil():
    user = User.query.get(session['user_id'])
    if not user:
        return redirect('/')
    return render_template('profile.html', user=user)

@app.route('/lesson<int:lesson_number>')
def lesson_dynamic(lesson_number):
    lesson = Lesson.query.filter_by(number=lesson_number).first()
    if not lesson:
        return "Lição não encontrada.", 404
    template_name = f'lessons/lesson{lesson_number}.html'
    return render_template(template_name, lesson=lesson)

@app.route('/api/user/lessons_completed', methods=['GET'])
def get_lessons_completed():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    completed = [int(x) for x in user.lessons_completed.split(',') if x]
    return jsonify({'lessons_completed': completed})

@app.route('/api/user/lessons_completed', methods=['POST'])
def update_lessons_completed():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    completed = data.get('lessons_completed', [])
    # Store as comma-separated string
    user.lessons_completed = ','.join(str(x) for x in completed)
    db.session.commit()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)