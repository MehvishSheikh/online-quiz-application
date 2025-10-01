import { db } from '../config/db';

/**
 * Seed the DB with one sample quiz and a few starter questions.
 */
const seedData = () => {
  db.serialize(() => {
    // Insert multiple quizzes (basic/advanced per category)
    db.run(
      `INSERT INTO quizzes (title, description, category, level) VALUES (?, ?, ?, ?)`,
      ['JavaScript Basics', 'Test your knowledge of JavaScript fundamentals', 'javascript', 'basic'],
      function (err) {
        if (err) {
          console.error('Error inserting quiz:', err);
          return;
        }

        const quizId = this.lastID;
        console.log(`Quiz created with ID: ${quizId}`);

        // Insert questions for JS (basic)
        const questions = [
          {
            text: 'What is the output of: typeof null?',
            a: 'null',
            b: 'object',
            c: 'undefined',
            d: 'number',
            correct: 'B',
          },
          {
            text: 'Which method is used to add elements to the end of an array?',
            a: 'push()',
            b: 'pop()',
            c: 'shift()',
            d: 'unshift()',
            correct: 'A',
          },
          {
            text: 'What does "===" check in JavaScript?',
            a: 'Only value',
            b: 'Only type',
            c: 'Both value and type',
            d: 'Neither value nor type',
            correct: 'C',
          },
          {
            text: 'Which keyword is used to declare a block-scoped variable?',
            a: 'var',
            b: 'let',
            c: 'const',
            d: 'Both b and c',
            correct: 'D',
          },
          {
            text: 'What is a closure in JavaScript?',
            a: 'A function with no parameters',
            b: 'A function that has access to its outer scope',
            c: 'A method to close the browser',
            d: 'A way to end a loop',
            correct: 'B',
          },
          { text: 'Which array method returns a new array with elements that pass a test?', a: 'map', b: 'filter', c: 'reduce', d: 'forEach', correct: 'B' },
          { text: 'Which statement creates a promise?', a: 'new Async()', b: 'new Promise()', c: 'Promise()', d: 'await Promise', correct: 'B' },
        ];

        const stmt = db.prepare(
          `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );

        questions.forEach((q) => {
          stmt.run(quizId, q.text, q.a, q.b, q.c, q.d, q.correct);
        });

        stmt.finalize();
        console.log(`${questions.length} questions inserted successfully`);
        console.log('JavaScript quiz seeded.');
      }
    );

    // TypeScript quiz (basic)
    db.run(
      `INSERT INTO quizzes (title, description, category, level) VALUES (?, ?, ?, ?)`,
      ['TypeScript Basics', 'Strengthen your TypeScript fundamentals', 'typescript', 'basic'],
      function (err) {
        if (err) {
          console.error('Error inserting TS quiz:', err);
          return;
        }
        const quizId = this.lastID;
        const questions = [
          { text: 'Which symbol annotates variable type?', a: ':', b: '->', c: '=>', d: '#', correct: 'A' },
          { text: 'Which type represents absence of value?', a: 'any', b: 'void', c: 'unknown', d: 'never', correct: 'B' },
          { text: 'Which type is safer than any for unknown inputs?', a: 'unknown', b: 'void', c: 'never', d: 'object', correct: 'A' },
          { text: 'What utility makes all props optional?', a: 'Pick', b: 'Partial', c: 'Required', d: 'Readonly', correct: 'B' },
        ];
        const stmt = db.prepare(
          `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        questions.forEach((q) => stmt.run(quizId, q.text, q.a, q.b, q.c, q.d, q.correct));
        stmt.finalize();
        console.log('TypeScript quiz seeded.');
      }
    );

    // React quiz (basic)
    db.run(
      `INSERT INTO quizzes (title, description, category, level) VALUES (?, ?, ?, ?)`,
      ['React Basics', 'Assess your React knowledge', 'react', 'basic'],
      function (err) {
        if (err) {
          console.error('Error inserting React quiz:', err);
          return;
        }
        const quizId = this.lastID;
        const questions = [
          { text: 'What does JSX compile to?', a: 'HTML', b: 'JavaScript', c: 'TypeScript', d: 'XML', correct: 'B' },
          { text: 'Which hook manages state?', a: 'useMemo', b: 'useEffect', c: 'useState', d: 'useRef', correct: 'C' },
          { text: 'Which prop passes children into a component?', a: 'child', b: 'children', c: 'content', d: 'slot', correct: 'B' },
          { text: 'Key helps React with...', a: 'Styling', b: 'Refs', c: 'List diffing', d: 'Hooks', correct: 'C' },
        ];
        const stmt = db.prepare(
          `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        questions.forEach((q) => stmt.run(quizId, q.text, q.a, q.b, q.c, q.d, q.correct));
        stmt.finalize();
        console.log('React quiz seeded.');
      }
    );

    // Next.js quiz (basic)
    db.run(
      `INSERT INTO quizzes (title, description, category, level) VALUES (?, ?, ?, ?)`,
      ['Next.js Basics', 'Server and routing in Next.js', 'next', 'basic'],
      function (err) {
        if (err) {
          console.error('Error inserting Next.js quiz:', err);
          return;
        }
        const quizId = this.lastID;
        const questions = [
          { text: 'Which folder defines file-based routes?', a: 'routes', b: 'pages', c: 'app', d: 'src', correct: 'B' },
          { text: 'What runs on the server by default in App Router?', a: 'Client Components', b: 'Server Components', c: 'Both', d: 'Neither', correct: 'B' },
          { text: 'Which command creates a new Next app?', a: 'npx create-next-app', b: 'npm init next', c: 'next new', d: 'npx next-create', correct: 'A' },
        ];
    // Advanced variants with dedicated questions
    db.run(
      `INSERT INTO quizzes (title, description, category, level) VALUES (?, ?, ?, ?)`,
      ['JavaScript Advanced', 'Advanced JavaScript patterns and internals', 'javascript', 'advanced'],
      function (err) {
        if (err) return;
        const quizId = this.lastID;
        const questions = [
          { text: 'Which method binds a function to a context and returns a new function?', a: 'call', b: 'apply', c: 'bind', d: 'attach', correct: 'C' },
          { text: 'What is the BigInt literal suffix?', a: 'L', b: 'n', c: 'b', d: 'i', correct: 'B' },
          { text: 'Which is NOT a valid microtask source?', a: 'Promise.then', b: 'queueMicrotask', c: 'MutationObserver', d: 'setTimeout', correct: 'D' },
          { text: 'Which pattern avoids polluting global scope?', a: 'IIFE', b: 'Prototype', c: 'Observer', d: 'Factory', correct: 'A' },
        ];
        const stmt = db.prepare(
          `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        questions.forEach((q) => stmt.run(quizId, q.text, q.a, q.b, q.c, q.d, q.correct));
        stmt.finalize();
      }
    );
    db.run(
      `INSERT INTO quizzes (title, description, category, level) VALUES (?, ?, ?, ?)`,
      ['TypeScript Advanced', 'Advanced typing and utilities', 'typescript', 'advanced'],
      function (err) {
        if (err) return;
        const quizId = this.lastID;
        const questions = [
          { text: 'Which type flattens union of object types by id?', a: 'Extract', b: 'Exclude', c: 'Distributive Omit', d: 'No built-in', correct: 'D' },
          { text: 'What does satisfies operator do?', a: 'Casts type', b: 'Checks assignment without widening', c: 'Narrows union', d: 'Creates generic', correct: 'B' },
          { text: 'Which utility maps all properties to never?', a: 'Record<string, never>', b: 'Partial<T>', c: 'Readonly<T>', d: 'Required<T>', correct: 'A' },
        ];
        const stmt = db.prepare(
          `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        questions.forEach((q) => stmt.run(quizId, q.text, q.a, q.b, q.c, q.d, q.correct));
        stmt.finalize();
      }
    );
    db.run(
      `INSERT INTO quizzes (title, description, category, level) VALUES (?, ?, ?, ?)`,
      ['React Advanced', 'Concurrent features and performance', 'react', 'advanced'],
      function (err) {
        if (err) return;
        const quizId = this.lastID;
        const questions = [
          { text: 'Which feature allows interruptible rendering?', a: 'Suspense', b: 'Concurrent Rendering', c: 'Profiler', d: 'Memo', correct: 'B' },
          { text: 'Which hook schedules low-priority updates?', a: 'useDeferredValue', b: 'useTransition', c: 'useLayoutEffect', d: 'useSyncExternalStore', correct: 'B' },
          { text: 'Which improves list performance?', a: 'index as key', b: 'memo without props', c: 'virtualization', d: 'inline handlers only', correct: 'C' },
        ];
        const stmt = db.prepare(
          `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        questions.forEach((q) => stmt.run(quizId, q.text, q.a, q.b, q.c, q.d, q.correct));
        stmt.finalize();
      }
    );
    db.run(
      `INSERT INTO quizzes (title, description, category, level) VALUES (?, ?, ?, ?)`,
      ['Next.js Advanced', 'Routing, data fetching, and optimization', 'next', 'advanced'],
      function (err) {
        if (err) return;
        const quizId = this.lastID;
        const questions = [
          { text: 'Which data fetching runs at build time?', a: 'generateStaticParams', b: 'route handlers', c: 'client fetch', d: 'middleware', correct: 'A' },
          { text: 'What header enables edge caching?', a: 'Cache-Control', b: 'ETag', c: 'Vary', d: 'Link', correct: 'A' },
          { text: 'Which dir is for server components by default?', a: 'pages', b: 'app', c: 'server', d: 'src', correct: 'B' },
        ];
        const stmt = db.prepare(
          `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        questions.forEach((q) => stmt.run(quizId, q.text, q.a, q.b, q.c, q.d, q.correct));
        stmt.finalize();
      }
    );
        const stmt = db.prepare(
          `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        questions.forEach((q) => stmt.run(quizId, q.text, q.a, q.b, q.c, q.d, q.correct));
        stmt.finalize();
        console.log('Next.js quiz seeded.');
        console.log('Database seeded successfully!');
      }
    );
  });
};

seedData();