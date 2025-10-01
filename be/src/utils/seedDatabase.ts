import { db } from '../config/db';

const seedData = () => {
  db.serialize(() => {
    // Insert a quiz
    db.run(
      `INSERT INTO quizzes (title, description) VALUES (?, ?)`,
      ['JavaScript Basics', 'Test your knowledge of JavaScript fundamentals'],
      function (err) {
        if (err) {
          console.error('Error inserting quiz:', err);
          return;
        }

        const quizId = this.lastID;
        console.log(`Quiz created with ID: ${quizId}`);

        // Insert questions
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
        console.log('Database seeded successfully!');
      }
    );
  });
};

seedData();