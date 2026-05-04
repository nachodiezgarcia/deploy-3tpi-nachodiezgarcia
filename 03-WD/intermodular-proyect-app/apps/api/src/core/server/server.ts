import { cors } from 'hono/cors';
import { Hono } from 'hono';
import { createEnvReader } from '#core/env';
import { authRoute } from '#pods/auth';
import { helloRoute } from '#pods/hello';
import { trainingRoute } from '#pods/training';
import { lessonRoute } from '#pods/lesson';
import { studentCoursesRoute } from '#pods/student-courses';
import { usersRoute } from '#pods/users';

const getEnv = createEnvReader(process.env);
const webOrigin = getEnv('WEB_ORIGIN', { fallback: 'http://localhost:3000' });

const app = new Hono();

app.use('*', cors({ origin: webOrigin, credentials: true }));

app.route('/api', helloRoute);
app.route('/api', authRoute);
app.route('/api', trainingRoute);
app.route('/api', lessonRoute);
app.route('/api', studentCoursesRoute);
app.route('/api', usersRoute);

export { app };
