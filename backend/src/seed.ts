// Seed script: (re)creates the schema and fills it with demo data.
// Run with `npm run seed`.
import md5 from 'md5';
import { db, initSchema } from './db.js';

function hash(password: string): string {
  return md5(password);
}

function reset(): void {
  db.exec(`
    DELETE FROM sessions;
    DELETE FROM messages;
    DELETE FROM blog_posts;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);
}

interface SeedUser {
  pseudo: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  role: 'user' | 'admin';
}

const users: SeedUser[] = [
  // 3 admin accounts
  {
    pseudo: 'proviseur',
    email: 'proviseur@asymis.fr',
    firstname: 'Hélène',
    lastname: 'Moreau',
    password: 'Admin2025!',
    role: 'admin',
  },
  {
    pseudo: 'cpe',
    email: 'cpe@asymis.fr',
    firstname: 'Karim',
    lastname: 'Benali',
    password: 'Admin2025!',
    role: 'admin',
  },
  {
    pseudo: 'intendant',
    email: 'intendant@asymis.fr',
    firstname: 'Sophie',
    lastname: 'Dubois',
    password: 'Admin2025!',
    role: 'admin',
  },
  // regular users
  {
    pseudo: 'leo',
    email: 'leo@asymis.fr',
    firstname: 'Léo',
    lastname: 'Martin',
    password: 'Password1!',
    role: 'user',
  },
  {
    pseudo: 'marie',
    email: 'marie@asymis.fr',
    firstname: 'Marie',
    lastname: 'Petit',
    password: 'Password1!',
    role: 'user',
  },
];

function seed(): void {
  initSchema();
  reset();

  const insertUser = db.prepare(
    `INSERT INTO users (pseudo, email, firstname, lastname, password_hash, role)
     VALUES (@pseudo, @email, @firstname, @lastname, @password_hash, @role)`,
  );
  const userIds: Record<string, number> = {};
  for (const u of users) {
    const info = insertUser.run({
      pseudo: u.pseudo,
      email: u.email,
      firstname: u.firstname,
      lastname: u.lastname,
      password_hash: hash(u.password),
      role: u.role,
    });
    userIds[u.pseudo] = Number(info.lastInsertRowid);
  }

  const insertMessage = db.prepare(
    'INSERT INTO messages (user_id, pseudo, content, hidden) VALUES (?, ?, ?, ?)',
  );
  const messages: Array<[number | null, string, string, number]> = [
    [userIds['leo'], 'leo', 'Super journée portes ouvertes ! 🎉', 0],
    [userIds['marie'], 'marie', 'Vivement la sortie scolaire au musée des canards.', 0],
    [null, 'Anonyme', 'La cantine était top aujourd’hui 🍝', 0],
    [null, 'Parent élève', 'Bravo pour l’organisation de la JPO.', 0],
    [null, 'Élève de 2nde', "On peut avoir plus de bornes wifi au CDI steup' ?", 0],
    [userIds['leo'], 'leo', 'La chorale du lycée déchire 🎶 (les tympans)', 0],
    [null, 'modéré', 'Message inapproprié', 1],
    [null, 'Ancien élève', 'Content de revoir mon ancien lycée, ça a bien changé !', 0],
  ];
  for (const m of messages) insertMessage.run(...m);

  const insertPost = db.prepare(
    'INSERT INTO blog_posts (title, body, image, author_id) VALUES (?, ?, ?, ?)',
  );
  insertPost.run(
    'Rentrée 2025 : ce qui change',
    'Nouveaux emplois du temps, salles rénovées et un nouveau club robotique ouvrent cette année. Rendez-vous lundi pour la réunion de rentrée.',
    null,
    userIds['proviseur'],
  );
  insertPost.run(
    'Forum des métiers le 15 octobre',
    'Plus de 30 professionnels viendront présenter leur parcours. Inscriptions auprès de la vie scolaire.',
    null,
    userIds['cpe'],
  );
  insertPost.run(
    'Travaux au gymnase',
    'Le gymnase sera fermé pendant deux semaines pour la réfection du sol. Les cours d’EPS sont déplacés au stade municipal.',
    null,
    userIds['intendant'],
  );

  console.log('Database seeded:');
  console.log(
    `  - ${users.length} users (${users.filter((u) => u.role === 'admin').length} admins)`,
  );
  console.log(`  - ${messages.length} guestbook messages`);
  console.log('  - 3 blog posts');
}

seed();
