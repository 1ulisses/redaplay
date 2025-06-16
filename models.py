from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

# modelos de dados

# classe usuário
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    streak = db.Column(db.Integer, default=0) # dias consecutivas de login
    last_login = db.Column(db.Date, default=None, nullable=True) # ultimo login
    diamonds = db.Column(db.Integer, default=0) # diamantes 
    created = db.Column(db.Date, default=date.today) # data de criação 
    lessons_completed = db.Column(db.String(200), default="")   # lições completadas

# classe lição
class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, unique=True, nullable=False)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    video_url = db.Column(db.String(200), nullable=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=True)
    quiz = db.relationship('Quiz', backref=db.backref('lessons', lazy=True))

# classe quiz
class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(300), nullable=True)
    total_questions = db.Column(db.Integer, default=0)
    total_correct = db.Column(db.Integer, default=0)
    total_incorrect = db.Column(db.Integer, default=0)

# classe questão
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    text = db.Column(db.String(300), nullable=False)
    correct_answer = db.Column(db.String(100), nullable=False)
    option_a = db.Column(db.String(100), nullable=False)
    option_b = db.Column(db.String(100), nullable=False)
    option_c = db.Column(db.String(100), nullable=False)
    option_d = db.Column(db.String(100), nullable=False)
    quiz = db.relationship('Quiz', backref=db.backref('questions', lazy=True))
