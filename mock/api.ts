import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

/**
 * A mock backend served by the Vite dev server under /api, so the starter runs with nothing
 * else installed. It is Node code: it never reaches the browser bundle, and `apply: 'serve'`
 * keeps it out of production. Replace it with a real API by setting VITE_API_URL.
 *
 * Shapes here are the contract the client services expect. Change both together.
 */

interface User {
  id: number; name: string; email: string; roles: string[]; status: string; createdAt: string;
}

const PASSWORD = 'password';

let users: User[] = [
  { id: 1, name: 'Avery Admin', email: 'admin@example.com', roles: ['ADMIN'], status: 'ACTIVE', createdAt: '2026-01-12' },
  { id: 2, name: 'Uma User', email: 'user@example.com', roles: ['USER'], status: 'ACTIVE', createdAt: '2026-02-03' },
  { id: 3, name: 'Noor Haddad', email: 'noor@example.com', roles: ['USER'], status: 'INVITED', createdAt: '2026-05-21' },
  { id: 4, name: 'Sam Reyes', email: 'sam@example.com', roles: ['USER', 'ADMIN'], status: 'ACTIVE', createdAt: '2026-06-30' },
  { id: 5, name: 'Lina Park', email: 'lina@example.com', roles: ['USER'], status: 'DISABLED', createdAt: '2026-08-14' },
];
let nextId = 6;

const tokenFor = (u: User) => `mock-token-${u.id}`;
const userForToken = (header: string | undefined): User | undefined => {
  const id = Number(header?.replace(/^Bearer mock-token-/, ''));
  return users.find((u) => u.id === id);
};

function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}') as Record<string, unknown>); }
      catch { resolve({}); }
    });
  });
}

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
}

type Handler = (ctx: {
  params: string[]; body: Record<string, unknown>; user: User | undefined; url: URL;
}) => { status?: number; body: unknown };

/** Method + path pattern → handler. Everything but login requires a bearer token. */
const routes: [string, RegExp, Handler][] = [
  ['POST', /^\/auth\/login$/, ({ body }) => {
    const u = users.find((x) => x.email === body.email && body.password === PASSWORD);
    return u ? { body: { user: u, accessToken: tokenFor(u) } }
             : { status: 401, body: { message: 'Email or password is not recognised.' } };
  }],
  ['GET', /^\/auth\/me$/, ({ user }) => ({ body: user })],
  ['GET', /^\/dashboard\/summary$/, () => {
    const by = (s: string) => users.filter((u) => u.status === s).length;
    return { body: {
      kpis: [
        { label: 'Users', value: String(users.length) },
        { label: 'Active', value: String(by('ACTIVE')) },
        { label: 'Invited', value: String(by('INVITED')), hint: 'Invitations sent and not yet accepted' },
        { label: 'Disabled', value: String(by('DISABLED')) },
      ],
      activity: [
        { label: 'Mon', value: 12 }, { label: 'Tue', value: 18 }, { label: 'Wed', value: 9 },
        { label: 'Thu', value: 22 }, { label: 'Fri', value: 15 },
      ],
    } };
  }],
  ['GET', /^\/users$/, ({ url }) => {
    const q = (url.searchParams.get('search') ?? '').toLowerCase();
    const items = users.filter((u) => !q || `${u.name} ${u.email}`.toLowerCase().includes(q));
    return { body: { items, total: items.length } };
  }],
  ['GET', /^\/users\/(\d+)$/, ({ params }) => {
    const u = users.find((x) => x.id === Number(params[0]));
    return u ? { body: u } : { status: 404, body: { message: 'User not found.' } };
  }],
  ['POST', /^\/users$/, ({ body }) => {
    if (users.some((u) => u.email === body.email)) return { status: 409, body: { message: 'That email is already in use.' } };
    const text = (v: unknown) => (typeof v === 'string' ? v : '');
    const u: User = {
      id: nextId++, name: text(body.name), email: text(body.email),
      roles: Array.isArray(body.roles) ? body.roles.map(String) : ['USER'],
      status: 'INVITED', createdAt: new Date().toISOString().slice(0, 10),
    };
    users = [u, ...users];
    return { status: 201, body: u };
  }],
  ['PUT', /^\/users\/(\d+)$/, ({ params, body }) => {
    const id = Number(params[0]);
    const current = users.find((x) => x.id === id);
    if (!current) return { status: 404, body: { message: 'User not found.' } };
    const next: User = { ...current, ...(body as Partial<User>), id };
    users = users.map((u) => (u.id === id ? next : u));
    return { body: next };
  }],
  ['DELETE', /^\/users\/(\d+)$/, ({ params }) => {
    users = users.filter((u) => u.id !== Number(params[0]));
    return { status: 204, body: null };
  }],
];

export function mockApi(): Plugin {
  return {
    name: 'mock-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const match = routes.find(([m, re]) => m === req.method && re.test(url.pathname));
        if (!match) { next(); return; }
        const [, re, handler] = match;
        void (async () => {
          // A little latency so loading states are visible while developing.
          await new Promise((r) => setTimeout(r, 150 + Math.random() * 250));
          const user = userForToken(req.headers.authorization);
          if (!url.pathname.startsWith('/auth/login') && !user) { send(res, 401, { message: 'Sign in to continue.' }); return; }
          const body = req.method === 'GET' || req.method === 'DELETE' ? {} : await readJson(req);
          const params = (re.exec(url.pathname) ?? []).slice(1);
          const out = handler({ params, body, user, url });
          if (out.status === 204) { res.statusCode = 204; res.end(); return; }
          send(res, out.status ?? 200, out.body);
        })();
      });
    },
  };
}
