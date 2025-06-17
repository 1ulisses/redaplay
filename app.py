from flask import Flask, render_template, request, redirect, session, url_for, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Question, Quiz, Lesson
from datetime import date, timedelta

# comentários por Leandro

# configuração app e banco de dados

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///redaplay.db'
db.init_app(app)

# inicialização do banco de dados, criação de usuários e lições padrão

with app.app_context():
    db.create_all()
    # criação de usuário
    if not User.query.filter_by(email='joao@joao.com').first(): # checa se usuário exemplo já existe
        new_user = User(
            username='joao',
            email='joao@joao.com',
            password=generate_password_hash('1234'),
            streak=5,
            last_login=date.today(),
            diamonds=10
        )
        db.session.add(new_user)
    # criação de lições
    lesson_data = [
        (1, "Lição 1: Saudações", "Conteúdo da Lição 1", "https://www.youtube.com/watch?v=lD44qe4_sCQ"),
        (2, "Lição 2: Quiz de Redação", "Conteúdo da Lição 2", None),
        (3, "Lição 3: Escreva sua Introdução", "Conteúdo da Lição 3", None),
        (4, "Lição 4: Aula", "Conteúdo da Lição 4", "https://www.youtube.com/watch?v=dzLMxHjrS70"),
        (5, "Lição 5: Quiz de Argumentação e Gramática", "Conteúdo da Lição 5", None),
    ]
    for number, title, content, video_url in lesson_data: 
        if not Lesson.query.filter_by(number=number).first(): # verifica se a lição já existe
            db.session.add(Lesson(number=number, title=title, content=content, video_url=video_url)) # cria lição
    db.session.commit()

    if not Quiz.query.filter_by(title="Quiz de Redação 1").first(): # quiz de redação 1
        quiz = Quiz(title="Quiz de Redação 1", description="Quiz sobre redação", total_questions=5)
        db.session.add(quiz) # adiciona quiz
        db.session.commit() 

        questions = [ 
            Question(
                quiz_id=quiz.id,
                text="Qual é a estrutura clássica de uma redação dissertativa-argumentativa?",
                correct_answer="A) Introdução, desenvolvimento e conclusão",
                option_a="A) Introdução, desenvolvimento e conclusão",
                option_b="B) Tema, título e parágrafo",
                option_c="C) Argumento, exemplo e opinião",
                option_d="D) Título, resumo e bibliografia"
            ),
            Question(
                quiz_id=quiz.id,
                text="O que é coesão textual?",
                correct_answer="B) A forma como as ideias estão logicamente conectadas",
                option_a="A) A repetição do mesmo termo em toda a redação",
                option_b="B) A forma como as ideias estão logicamente conectadas",
                option_c="C) O uso de palavras estrangeiras",
                option_d="D) A pontuação usada no texto"
            ),
            Question(
                quiz_id=quiz.id,
                text="Qual dos elementos abaixo é essencial para a conclusão de uma redação do ENEM?",
                correct_answer="C) Uma proposta de intervenção",
                option_a="A) Um resumo do texto",
                option_b="B) Uma pergunta retórica",
                option_c="C) Uma proposta de intervenção",
                option_d="D) Uma citação de impacto"
            ),
            Question(
                quiz_id=quiz.id,
                text="Qual das alternativas abaixo apresenta um exemplo de linguagem formal, adequada a uma redação?",
                correct_answer="C) “Observa-se que o problema persiste na sociedade atual.”",
                option_a="A) “A galera tá de olho nessa parada.”",
                option_b="B) “Tipo assim, isso daí foi meio errado.”",
                option_c="C) “Observa-se que o problema persiste na sociedade atual.”",
                option_d="D) “Tava tudo certo até que deu ruim.”"
            ),
            Question(
                quiz_id=quiz.id,
                text="O que prejudica a coerência de um texto?",
                correct_answer="B) Apresentar ideias contraditórias ou sem sentido",
                option_a="A) Usar conectivos como \"portanto\" e \"além disso\"",
                option_b="B) Apresentar ideias contraditórias ou sem sentido",
                option_c="C) Fazer uma proposta de intervenção ao final",
                option_d="D) Dividir o texto em parágrafos"
            ),
        ]
        db.session.add_all(questions)
        db.session.commit()

    if not Quiz.query.filter_by(title="Quiz de Argumentação e Gramática").first(): # quiz de argumentação e gramática
        quiz5 = Quiz(
            title="Quiz de Argumentação e Gramática",
            description="Quiz sobre argumentação e gramática",
            total_questions=5
        )
        db.session.add(quiz5) # adiciona quiz
        db.session.commit()

        questions5 = [
            Question(
                quiz_id=quiz5.id,
                text="Qual das opções abaixo NÃO é uma boa estratégia de argumentação em uma redação?",
                correct_answer="C) Apelar exclusivamente para a emoção do leitor",
                option_a="A) Utilizar dados estatísticos confiáveis",
                option_b="B) Usar exemplos históricos e sociais",
                option_c="C) Apelar exclusivamente para a emoção do leitor",
                option_d="D) Relacionar o tema com a Constituição ou leis brasileiras"
            ),
            Question(
                quiz_id=quiz5.id,
                text="O que caracteriza a linguagem da norma-padrão usada em redações?",
                correct_answer="B) Clareza, formalidade e correção gramatical",
                option_a="A) Uso de gírias e regionalismos",
                option_b="B) Clareza, formalidade e correção gramatical",
                option_c="C) Frases curtas e emotivas",
                option_d="D) Repetição de palavras para reforçar o argumento"
            ),
            Question(
                quiz_id=quiz5.id,
                text="Em uma proposta de intervenção no ENEM, é necessário apresentar:",
                correct_answer="C) A ação, o agente, o modo, o efeito e o detalhamento",
                option_a="A) Somente o agente responsável pela solução",
                option_b="B) Uma solução vaga e genérica",
                option_c="C) A ação, o agente, o modo, o efeito e o detalhamento",
                option_d="D) Apenas uma opinião sobre o problema"
            ),
            Question(
                quiz_id=quiz5.id,
                text="Qual das frases abaixo está escrita de forma correta segundo a norma culta?",
                correct_answer="C) “As medidas foram tomadas com responsabilidade.”",
                option_a="A) “Os problema do país é muito complicado.”",
                option_b="B) “A gente vamos resolver isso amanhã.”",
                option_c="C) “As medidas foram tomadas com responsabilidade.”",
                option_d="D) “Eles vai apresentar o projeto.”"
            ),
            Question(
                quiz_id=quiz5.id,
                text="Qual é o tipo de discurso mais comum em uma redação dissertativa-argumentativa?",
                correct_answer="B) Discurso indireto",
                option_a="A) Discurso direto",
                option_b="B) Discurso indireto",
                option_c="C) Discurso poético",
                option_d="D) Discurso informal"
            ),
        ]
        db.session.add_all(questions5)
        db.session.commit()

    # adição lição 2 e 5
    lesson2 = Lesson.query.filter_by(number=2).first()
    quiz2 = Quiz.query.filter_by(title="Quiz de Redação 1").first()
    if lesson2 and quiz2 and lesson2.quiz_id != quiz2.id: # verifica se a lição 2 já tem o quiz
        lesson2.quiz_id = quiz2.id # atribui quiz 2 à lição 2
        db.session.commit()

    lesson5 = Lesson.query.filter_by(number=5).first()
    quiz5 = Quiz.query.filter_by(title="Quiz de Argumentação e Gramática").first()
    if lesson5 and quiz5 and lesson5.quiz_id != quiz5.id: # verifica se a lição 5 já tem o quiz
        lesson5.quiz_id = quiz5.id # atribui quiz 5 à lição 5
        db.session.commit()

# rota /

@app.route('/', methods=['GET', 'POST'])
def welcome():
    return render_template('welcome.html')

# rotas autenticação e registro

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
                # lógica streak com login
                if user.last_login is not None:
                    if user.last_login == date.today() - timedelta(days=1): # se último login for ontem
                        user.streak += 1
                    elif user.last_login != date.today(): # se último login não é hoje e não é ontem
                        user.streak = 1
                else:
                    user.streak = 1
                user.last_login = date.today()
                db.session.commit()
                session['user_id'] = user.id # adiciona usuário à sessão
                return redirect('/inicio')
            else:
                error = 'Credenciais inválidas.'
        elif action == 'register':
            email = request.form['email']
            if User.query.filter((User.username == username) | (User.email == email)).first(): 
                # verifica se usuário ou email já existem
                error = 'Nome de usuário ou E-mail já existente.'
            else:
                hashed_pw = generate_password_hash(password)
                new_user = User(username=username, email=email, password=hashed_pw)
                db.session.add(new_user)
                db.session.commit()
                session['user_id'] = new_user.id # adiciona usuário à sessão
                return redirect('/login')
    return render_template('index.html', error=error)

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect('/')

# rotas crud e perfil do usuário

@app.route('/perfil')
def perfil():
    user = User.query.get(session['user_id'])
    if not user:  # checa por usuário logado
        return redirect('/')
    return render_template('profile.html', user=user)

@app.route('/update', methods=['POST'])
def update():
    if 'user_id' not in session: # checa por usuário logado
        return redirect('/login')
    user = User.query.get(session['user_id']) # pega dados do usuário
    if not user:
        return redirect('/login')
    # pega dados do formulário
    new_email = request.form['new-email']
    new_username = request.form['new-username']
    new_password = request.form['new-password']

    if new_email and new_email != user.email: # se novo e-mail e e-mail diferente
        if User.query.filter_by(email=new_email).first():
            return "E-mail já cadastrado.", 400
        user.email = new_email

    if new_username and new_username != user.username: # se novo nome de usuário e nome de usuário diferente
        if User.query.filter_by(username=new_username).first():
            return "Nome de usuário já cadastrado.", 400
        user.username = new_username

    if new_password: # se nova senha
        user.password = generate_password_hash(new_password)

    db.session.commit()
    return redirect('/login')

@app.route('/delete', methods=['POST'])
def delete():
    if 'user_id' in session: # se usuário logado
        user = User.query.get(session['user_id'])
        db.session.delete(user)
        db.session.commit()
        session.pop('user_id', None)
    return redirect('/')

# rotas principal, lições e quizzes

@app.route('/inicio', methods=['GET', 'POST'])
def inicio():
    user = User.query.get(session['user_id']) # pega dados de usuário logado
    lessons = Lesson.query.order_by(Lesson.number).all() # pega todas as lições
    return render_template('main.html', user=user, lessons=lessons)

@app.route('/lesson<int:lesson_number>') # rota baseada no número da lição
def lesson_dynamic(lesson_number):
    lesson = Lesson.query.filter_by(number=lesson_number).first() # pega lição por número
    if not lesson:
        return "Lição não encontrada.", 404
    template_name = f'lessons/lesson{lesson_number}.html' # procura template por número da lição
    return render_template(template_name, lesson=lesson)

# API lições e quizzes

@app.route('/api/user/lessons_completed', methods=['GET']) # busca por lições completadas
def get_lessons_completed():
    if 'user_id' not in session: # se usuário não está logado
        return jsonify({'error': 'Not logged in'}), 401
    user = User.query.get(session['user_id'])
    if not user: # se usuário não encontrado
        return jsonify({'error': 'User not found'}), 404
    completed = [int(x) for x in user.lessons_completed.split(',') if x] # lições completadas, converte string em lista de inteiros
    return jsonify({'lessons_completed': completed})

@app.route('/api/user/lessons_completed', methods=['POST']) # atualiza lições completadas
def update_lessons_completed():
    if 'user_id' not in session: # se usuário não está logado
        return jsonify({'error': 'Not logged in'}), 401
    user = User.query.get(session['user_id'])
    if not user: # se usuário não encontrado
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json() # pega dados do usuário
    completed = data.get('lessons_completed', []) # lições completadas
    user.lessons_completed = ','.join(str(x) for x in completed) # converte lista em string
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/lesson/<int:lesson_number>/questions', methods=['GET']) # pega pergunta da questão da lição
def get_lesson_questions(lesson_number):
    lesson = Lesson.query.filter_by(number=lesson_number).first()
    if not lesson or not lesson.quiz: # se não tem lição ou não tem quiz, json vazio
        return jsonify({'questions': []})
    questions = []
    for q in lesson.quiz.questions: # pega dados das questões do quiz
        questions.append({
            'question': q.text,
            'options': [q.option_a, q.option_b, q.option_c, q.option_d],
            'correctAnswer': q.correct_answer
        })
    return jsonify({'questions': questions}) # retorna json com perguntas

# começar app

if __name__ == '__main__':
    app.run(debug=True)