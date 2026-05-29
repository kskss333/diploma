import { http, HttpResponse, delay } from 'msw';

const API_BASE = '/api';

const users = [
  { id: 'u1', email: 'student@test.ru', username: 'StudentDemo', password_hash: 'hash', role: 'student', age: 15, parent_email: null, is_active: true, created_at: '2024-01-01T00:00:00Z', last_active_at: '2025-05-01T00:00:00Z' },
  { id: 'u2', email: 'teacher@test.ru', username: 'TeacherDemo', password_hash: 'hash', role: 'teacher', age: 30, parent_email: null, is_active: true, created_at: '2024-01-01T00:00:00Z', last_active_at: '2025-05-01T00:00:00Z' },
  { id: 'u3', email: 'admin@test.ru', username: 'AdminDemo', password_hash: 'hash', role: 'admin', age: 25, parent_email: null, is_active: true, created_at: '2024-01-01T00:00:00Z', last_active_at: '2025-05-01T00:00:00Z' },
];

const modules = [
  { id: 'mod1', title: 'Основы фишинга', description: 'Научитесь распознавать фишинговые письма и защищать свои данные от мошенников.', category: 'Киберугрозы', difficulty: 'basic', is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z' },
  { id: 'mod2', title: 'Парольная безопасность', description: 'Узнайте, как создавать надёжные пароли и почему слабый пароль — угроза для ваших данных.', category: 'Защита данных', difficulty: 'basic', is_published: true, created_at: '2024-01-15T00:00:00Z', updated_at: '2024-06-15T00:00:00Z' },
  { id: 'mod3', title: 'Социальная инженерия', description: 'Как злоумышленники манипулируют людьми и как этому противостоять.', category: 'Киберугрозы', difficulty: 'basic', is_published: true, created_at: '2024-02-01T00:00:00Z', updated_at: '2024-07-01T00:00:00Z' },
  { id: 'mod4', title: 'Права доступа', description: 'Основы разграничения доступа к файлам и ресурсам в информационных системах.', category: 'Защита данных', difficulty: 'advanced', is_published: true, created_at: '2024-02-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
  { id: 'mod5', title: 'Продвинутый фишинг', description: 'Углублённый анализ фишинговых атак: целевой фишинг, клонирование сайтов.', category: 'Киберугрозы', difficulty: 'advanced', is_published: true, created_at: '2024-03-01T00:00:00Z', updated_at: '2024-08-01T00:00:00Z' },
  { id: 'mod6', title: 'Безопасность в соцсетях', description: 'Как защитить личную информацию в социальных сетях и мессенджерах.', category: 'Цифровая гигиена', difficulty: 'basic', is_published: true, created_at: '2024-03-15T00:00:00Z', updated_at: '2024-08-15T00:00:00Z' },
  { id: 'mod7', title: 'Криптография для начинающих', description: 'Базовые принципы шифрования и их применение в повседневной жизни.', category: 'Криптография', difficulty: 'advanced', is_published: true, created_at: '2024-04-01T00:00:00Z', updated_at: '2024-09-01T00:00:00Z' },
  { id: 'mod8', title: 'Безопасность Wi-Fi сетей', description: 'Риски публичных Wi-Fi сетей и способы защиты при подключении.', category: 'Сетевая безопасность', difficulty: 'basic', is_published: true, created_at: '2024-04-15T00:00:00Z', updated_at: '2024-09-15T00:00:00Z' },
];

const phishingSteps = [
  { id: 'step1', module_id: 'mod1', order_index: 0, type: 'theory', task_type: null, content: { title: 'Что такое фишинг?', text: 'Фишинг — это вид кибератаки, при которой злоумышленник выдаёт себя за доверенное лицо или организацию, чтобы получить конфиденциальные данные: пароли, номера банковских карт, паспортные данные.\n\n**Основные признаки фишинга:**\n- Подозрительный адрес отправителя\n- Грамматические ошибки и странное оформление\n- Запрос конфиденциальной информации\n- Срочность и угрозы («заблокируют аккаунт через 24 часа»)\n- Несоответствие ссылки и текста', created_at: '2024-01-01T00:00:00Z' } },
  { id: 'step2', module_id: 'mod1', order_index: 1, type: 'simulation', task_type: 'phishing', content: { title: 'Тренажёр: найди фишинг', description: 'Перед вами несколько писем. Определите, какие из них являются фишинговыми, а какие — безопасными.', emails: [
    { id: 'e1', from: 'support@google.com', displayName: 'Google Support', subject: 'Ваш аккаунт будет заблокирован', body: '<p>Уважаемый пользователь,</p><p>Мы обнаружили подозрительную активность в вашем аккаунте. <b>Ваш аккаунт будет заблокирован в течение 24 часов</b>, если вы не подтвердите свои данные.</p><p><a href="#">Перейдите по ссылке для подтверждения</a></p><p>С уважением,<br/>Google Support</p>', isPhishing: true, clues: ['Подозрительная срочность', 'Запрос перехода по ссылке', 'Угроза блокировки'] },
    { id: 'e2', from: 'noreply@yourbank.com', displayName: 'Ваш Банк', subject: 'Ежемесячная выписка по счёту', body: '<p>Здравствуйте,</p><p>Ваша ежемесячная выписка по счёту готова. Вы можете ознакомиться с ней в личном кабинете на нашем сайте.</p><p>С уважением,<br/>Ваш Банк</p>', isPhishing: false, clues: [] },
    { id: 'e3', from: 'prize@luckydraw-xyz.net', displayName: 'Lucky Draw', subject: 'Поздравляем! Вы выиграли iPhone 15!', body: '<p>Поздравляем!</p><p>Вы стали счастливым обладателем нового <b>iPhone 15 Pro</b>! Для получения приза перейдите по <a href="#">ссылке</a> и введите данные вашей банковской карты для оплаты доставки.</p>', isPhishing: true, clues: ['Слишком хорошее предложение', 'Подозрительный домен отправителя', 'Запрос банковских данных'] },
    { id: 'e4', from: 'teacher@school.edu', displayName: 'Ваш преподаватель', subject: 'Материалы к следующему занятию', body: '<p>Здравствуйте,</p><p>Отправляю презентацию к следующему занятию. Она доступна по обычной ссылке в общем доступе.</p><p>Хорошего дня!</p>', isPhishing: false, clues: [] },
    { id: 'e5', from: 'security@paypal.com.ru', displayName: 'PayPal Security', subject: 'Подтвердите вашу учётную запись', body: '<p>Уважаемый клиент,</p><p>Наша система безопасности обнаружила несанкционированный вход в вашу учётную запись. <b>Немедленно подтвердите свои данные</b>, перейдя по ссылке ниже, иначе доступ будет заблокирован.</p><p><a href="#">Подтвердить учётную запись</a></p><p>С уважением,<br/>PayPal Security Team</p>', isPhishing: true, clues: ['Подозрительный домен (paypal.com.ru)', 'Срочность и угроза'] },
    { id: 'e6', from: 'noreply@github.com', displayName: 'GitHub', subject: 'Новый комментарий к вашему репозиторию', body: '<p>Пользователь <b>@devuser</b> оставил комментарий в вашем репозитории <b>my-project</b>.</p><p>Вы можете просмотреть комментарий на GitHub.</p><p>— GitHub</p>', isPhishing: false, clues: [] },
    { id: 'e7', from: 'admin@micros0ft-support.com', displayName: 'Microsoft Support', subject: 'Критическое обновление безопасности', body: '<p>Уважаемый пользователь Windows,</p><p>Обнаружена <b>критическая уязвимость</b> в вашей системе. Скачайте и установите обновление по ссылке ниже, чтобы защитить ваш компьютер.</p><p><a href="#">Скачать обновление</a></p><p>С уважением,<br/>Microsoft Security</p>', isPhishing: true, clues: ['Подозрительный домен (micros0ft с нулём)', 'Срочность', 'Предложение скачать файл'] },
  ], passThreshold: 70 }, created_at: '2024-01-01T00:00:00Z' },
  { id: 'step3', module_id: 'mod1', order_index: 2, type: 'quiz', task_type: null, content: { title: 'Проверка знаний', description: 'Ответьте на вопросы по теме фишинга.', questions: [
    { id: 'q1', text: 'Какой признак НЕ характерен для фишингового письма?', options: ['Грамматические ошибки', 'Подозрительный адрес отправителя', 'Официальный логотип компании', 'Срочность и угрозы'], correct: 2 },
    { id: 'q2', text: 'Что делать, если вы получили подозрительное письмо?', options: ['Перейти по ссылке', 'Ответить отправителю', 'Ничего не делать', 'Не переходить по ссылкам, сообщить в СБ'], correct: 3 },
  ] }, created_at: '2024-01-01T00:00:00Z' },
];

const groups = [
  { id: 'g1', name: '10А класс', invite_code: 'ABC123', teacher_id: 'u2', default_difficulty: 'basic', created_at: '2024-01-01T00:00:00Z' },
  { id: 'g2', name: 'Кружок ИБ', invite_code: 'DEF456', teacher_id: 'u2', default_difficulty: 'advanced', created_at: '2024-02-01T00:00:00Z' },
];

const groupMembers = [
  { id: 'gm1', group_id: 'g1', user_id: 'u1', joined_at: '2024-01-15T00:00:00Z' },
];

let progressStore = [
  { id: 'p1', user_id: 'u1', module_id: 'mod1', current_step_index: 0, status: 'in_progress', score: null, attempts: 0, started_at: '2025-05-01T00:00:00Z', completed_at: null },
];

export const handlers = [
  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    await delay(800);
    const body = await request.json();
    const exists = users.find(u => u.email === body.email);
    if (exists) return HttpResponse.json({ message: 'Пользователь с таким email уже зарегистрирован' }, { status: 409 });
    users.push({ id: `u${users.length + 1}`, email: body.email, username: body.username, password_hash: 'hash', role: 'student', age: body.age || null, parent_email: body.parent_email || null, is_active: false, created_at: new Date().toISOString(), last_active_at: null });
    return HttpResponse.json({ message: 'Регистрация успешна. Проверьте email для активации.', csrfToken: `csrf-${Date.now()}` }, { status: 201 });
  }),

  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await delay(600);
    const body = await request.json();
    const user = users.find(u => u.email === body.email);
    if (!user || body.password !== 'password') return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 });
    return HttpResponse.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role }, csrfToken: `csrf-${Date.now()}` }, { status: 200, headers: { 'Set-Cookie': `access_token=mock-jwt-${user.id}; HttpOnly; Secure; SameSite=Strict; Max-Age=900; Path=/` } });
  }),

  http.post(`${API_BASE}/auth/logout`, async () => {
    await delay(300);
    return HttpResponse.json({ message: 'Выход выполнен' }, { status: 200, headers: { 'Set-Cookie': 'access_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/' } });
  }),

  http.post(`${API_BASE}/auth/refresh`, async () => {
    await delay(300);
    return HttpResponse.json({ message: 'Токен обновлён' }, { status: 200, headers: { 'Set-Cookie': 'access_token=mock-jwt-refreshed; HttpOnly; Secure; SameSite=Strict; Max-Age=900; Path=/' } });
  }),

  http.get(`${API_BASE}/modules`, async () => {
    await delay(400);
    return HttpResponse.json({ modules });
  }),

  http.get(`${API_BASE}/modules/:moduleId`, async ({ params }) => {
    await delay(300);
    const mod = modules.find(m => m.id === params.moduleId);
    if (!mod) return HttpResponse.json({ message: 'Модуль не найден' }, { status: 404 });
    return HttpResponse.json({ module: mod });
  }),

  http.get(`${API_BASE}/modules/:moduleId/steps`, async ({ params }) => {
    await delay(300);
    if (params.moduleId === 'mod1') return HttpResponse.json({ steps: phishingSteps });
    return HttpResponse.json({ steps: [] });
  }),

  http.get(`${API_BASE}/progress`, async () => {
    await delay(300);
    return HttpResponse.json({ progress: progressStore.filter(p => p.user_id === 'u1') });
  }),

  http.post(`${API_BASE}/progress`, async ({ request }) => {
    await delay(300);
    const body = await request.json();
    const existing = progressStore.findIndex(p => p.user_id === 'u1' && p.module_id === body.module_id);
    if (existing >= 0) progressStore[existing] = { ...progressStore[existing], ...body, updated_at: new Date().toISOString() };
    else progressStore.push({ id: `p${progressStore.length + 1}`, user_id: 'u1', ...body, started_at: new Date().toISOString() });
    return HttpResponse.json({ message: 'Прогресс сохранён' });
  }),

  http.get(`${API_BASE}/groups`, async () => {
    await delay(400);
    return HttpResponse.json({ groups });
  }),

  http.get(`${API_BASE}/groups/:groupId/members`, async ({ params }) => {
    await delay(300);
    const members = groupMembers.filter(m => m.group_id === params.groupId);
    return HttpResponse.json({ members: members.map(m => { const u = users.find(uu => uu.id === m.user_id); return { ...m, username: u?.username, email: u?.email, progress: progressStore.filter(p => p.user_id === m.user_id) }; }) });
  }),

  http.post(`${API_BASE}/groups`, async ({ request }) => {
    await delay(500);
    const body = await request.json();
    const g = { id: `g${groups.length + 1}`, name: body.name, invite_code: `INV${Date.now().toString(36).toUpperCase()}`, teacher_id: 'u2', default_difficulty: body.default_difficulty || 'basic', created_at: new Date().toISOString() };
    groups.push(g);
    return HttpResponse.json({ group: g }, { status: 201 });
  }),

  http.get(`${API_BASE}/teacher/stats`, async () => {
    await delay(500);
    return HttpResponse.json({ totalStudents: 25, averageProgress: 68, overdueTasks: 4 });
  }),

  http.get(`${API_BASE}/admin/users`, async () => {
    await delay(400);
    return HttpResponse.json({ users: users.map(u => ({ id: u.id, email: u.email, username: u.username, role: u.role, is_active: u.is_active, created_at: u.created_at })) });
  }),
];