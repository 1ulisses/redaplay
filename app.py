from flask import Flask, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Question, Quiz

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///redaplay.db'
db.init_app(app)

with app.app_context():
    db.create_all()
    db.session.commit()
    
# / - Página inicial com login e registro
# /inicio - Página principal após login
    
@app.route('/', methods=['GET', 'POST'])
def index():
    error = None
    if request.method == 'POST':
        action = request.form.get('action')
        username = request.form['username']
        password = request.form['password']
        if action == 'login':
            user = User.query.filter_by(username=username).first()
            if user and check_password_hash(user.password, password):
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
                return redirect('/')
    return render_template('index.html', error=error)

@app.route('/inicio', methods=['GET','POST'])
def main():
    if 'user_id' in session:
        return render_template('main.html')
    return redirect('/')

@app.route('/quiz/<int:quiz_id>', methods=['GET', 'POST'])
def quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    if request.method == 'POST':
        score = 0
        for question in quiz.questions:
            user_answer = request.form.get(f'question_{question.id}')
            if user_answer == question.correct_answer:
                score += 1
        return f"Your score: {score}/{len(quiz.questions)}"
    return render_template('quiz.html', quiz=quiz)

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect('/')

# debug
@app.route('/lesson1')
def lesson1():
    return render_template('lesson1.html')

if __name__ == '__main__':
    app.run(debug=True)