import { http, HttpResponse, delay } from 'msw';
import courses from '@/data/courses';

const users = [
  { id: 'u1', email: 'student@test.ru', username: 'StudentDemo', role: 'student', age: 15, parent_email: null, is_active: true },
  { id: 'u2', email: 'teacher@test.ru', username: 'TeacherDemo', role: 'teacher', age: 30, parent_email: null, is_active: true },
  { id: 'u3', email: 'admin@test.ru', username: 'AdminDemo', role: 'admin', age: 25, parent_email: null, is_active: true },
];

const groups = [
  { id: 'g1', name: '10А класс', invite_code: 'ABC123', teacher_id: 'u2', default_difficulty: 'basic' },
  { id: 'g2', name: 'Кружок ИБ', invite_code: 'DEF456', teacher_id: 'u2', default_difficulty: 'advanced' },
];

let progressStore = [];

export const handlers = [
  // ========== AUTH ==========
  http.post('/api/auth/login', async ({ request }) => {
    await delay(600);
    const body = await request.json();
    const user = users.find(u => u.email === body.email);
    if (!user || body.password !== 'password') {
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 });
    }
    return HttpResponse.json({
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
      csrfToken: `csrf-${Date.now()}`,
    }, { status: 200 });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    await delay(800);
    const body = await request.json();
    const exists = users.find(u => u.email === body.email);
    if (exists) return HttpResponse.json({ message: 'Email уже занят' }, { status: 409 });
    users.push({
      id: `u${users.length + 1}`, email: body.email, username: body.username,
      role: 'student', age: body.age || null, parent_email: body.parent_email || null, is_active: false,
    });
    return HttpResponse.json({ message: 'Успешно. Проверьте email.', csrfToken: `csrf-${Date.now()}` }, { status: 201 });
  }),

  http.post('/api/auth/logout', async () => {
    await delay(300);
    return HttpResponse.json({ message: 'Выход выполнен' }, { status: 200 });
  }),

  http.post('/api/auth/refresh', async () => {
    await delay(300);
    return HttpResponse.json({ message: 'Токен обновлён' }, { status: 200 });
  }),

  // ========== CATALOG ==========
  http.get('/api/modules', async () => {
    await delay(400);
    const list = courses.map(c => ({
      id: c.id, title: c.title, description: c.description,
      category: c.category, difficulty: c.difficulty, duration: c.duration, icon: c.icon,
    }));
    return HttpResponse.json({ modules: list });
  }),

  http.get('/api/modules/:moduleId', async ({ params }) => {
    await delay(300);
    const course = courses.find(c => c.id === params.moduleId);
    if (!course) return HttpResponse.json({ message: 'Модуль не найден' }, { status: 404 });
    return HttpResponse.json({
      module: {
        id: course.id, title: course.title, description: course.description,
        category: course.category, difficulty: course.difficulty, duration: course.duration,
      },
    });
  }),

  http.get('/api/modules/:moduleId/steps', async ({ params }) => {
    await delay(300);
    const course = courses.find(c => c.id === params.moduleId);
    if (!course) return HttpResponse.json({ message: 'Модуль не найден' }, { status: 404 });
    const steps = course.steps.map((s, i) => ({
      id: `step-${params.moduleId}-${i}`,
      module_id: params.moduleId,
      order_index: i,
      type: s.type,
      task_type: s.taskType || null,
      content: s,
    }));
    return HttpResponse.json({ steps });
  }),

  // ========== PROGRESS ==========
  http.get('/api/progress', async () => {
    await delay(300);
    const userProgress = progressStore.filter(p => p.user_id === 'u1');
    return HttpResponse.json({ progress: userProgress });
  }),

  http.post('/api/progress', async ({ request }) => {
    await delay(300);
    const body = await request.json();
    const idx = progressStore.findIndex(
      p => p.user_id === 'u1' && p.module_id === body.module_id
    );
    if (idx >= 0) {
      progressStore[idx] = { ...progressStore[idx], ...body, updated_at: new Date().toISOString() };
    } else {
      progressStore.push({
        id: `p${progressStore.length + 1}`,
        user_id: 'u1',
        ...body,
        started_at: new Date().toISOString(),
      });
    }
    // Сохраняем в localStorage для персистентности
    localStorage.setItem('cyberedu_progress', JSON.stringify(progressStore));
    return HttpResponse.json({ message: 'Прогресс сохранён' });
  }),

  // Восстановление прогресса из localStorage при старте
  http.get('/api/progress/restore', async () => {
    const saved = localStorage.getItem('cyberedu_progress');
    if (saved) {
      progressStore = JSON.parse(saved);
    }
    return HttpResponse.json({ message: 'ok' });
  }),

  // ========== GROUPS ==========
  http.get('/api/groups', async () => {
    await delay(400);
    return HttpResponse.json({ groups });
  }),

  http.post('/api/groups', async ({ request }) => {
    await delay(500);
    const body = await request.json();
    const g = {
      id: `g${groups.length + 1}`, name: body.name,
      invite_code: `INV${Date.now().toString(36).toUpperCase()}`,
      teacher_id: 'u2', default_difficulty: body.default_difficulty || 'basic',
    };
    groups.push(g);
    return HttpResponse.json({ group: g }, { status: 201 });
  }),

  // ========== TEACHER STATS ==========
  http.get('/api/teacher/stats', async () => {
    await delay(500);
    return HttpResponse.json({
      totalStudents: 15,
      averageProgress: 68,
      overdueTasks: 4,
    });
  }),

  // ========== ADMIN ==========
  http.get('/api/admin/users', async () => {
    await delay(400);
    return HttpResponse.json({
      users: users.map(u => ({
        id: u.id, email: u.email, username: u.username,
        role: u.role, is_active: u.is_active,
      })),
    });
  }),
];