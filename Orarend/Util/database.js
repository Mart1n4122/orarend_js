import sqlite from 'sqlite3';

const db = new sqlite.Database('./Data/database.sqlite');

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);

      else resolve(rows);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);

      else resolve(row);
    });
  });
}

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);

            else resolve(this);
        });
    });
}

export async function initializeDatabase() {
    await dbRun('DROP TABLE IF EXISTS timetable');
    await db.run('CREATE TABLE IF NOT EXISTS timetable (id INTEGER PRIMARY KEY AUTOINCREMENT, day STRING, classNumber INTEGER, className STRING)');
    const days = [
      {
        day: 'Hétfő',
        classes: [
          { classNumber: 1, className: "-" },
          { classNumber: 2, className: "-" },
          { classNumber: 3, className: "Angol" },
          { classNumber: 4, className: "IKT (JS)" },
          { classNumber: 5, className: "Irodalom" },
          { classNumber: 6, className: "Webprogramozás" },
          { classNumber: 7, className: "Irodalom Felkészítő" }
        ]
      },
      {
        day: 'Kedd',
        classes: [
          { classNumber: 1, className: "Állampolgári" },
          { classNumber: 2, className: "Testnevelés" },
          { classNumber: 3, className: "PHP" },
          { classNumber: 4, className: "Irodalom" },
          { classNumber: 5, className: "Történelem" },
          { classNumber: 6, className: "Matematika" },
          { classNumber: 7, className: "Szakmai Angol" },
          { classNumber: 8, className: "Szakmai Angol" }
        ]
      },
      {
        day: 'Szerda',
        classes: [
          { classNumber: 1, className: "Asztali alkalmazások fejlesztése" },
          { classNumber: 2, className: "Asztali alkalmazások fejlesztése" },
          { classNumber: 3, className: "Asztali alkalmazások fejlesztése" },
          { classNumber: 4, className: "Történelem" },
          { classNumber: 5, className: "Osztályfőnöki" },
          { classNumber: 6, className: "Irodalom" },
          { classNumber: 7, className: "Matematika" },
          { classNumber: 8, className: "Angol" }
        ]
      },
      {
        day: 'Csütörtök',
        classes: [
          { classNumber: 1, className: "Asztali alkalmazások fejlesztése" },
          { classNumber: 2, className: "IKT2" },
          { classNumber: 3, className: "Testnevelés" },
          { classNumber: 4, className: "Testnevelés" },
          { classNumber: 5, className: "Történelem" },
          { classNumber: 6, className: "Matematika" },
          { classNumber: 7, className: "Matematika felkészítő" }
        ]
      },
      {
        day: 'Péntek',
        classes: [
          { classNumber: 1, className: "Nyelvtan" },
          { classNumber: 2, className: "Web-CMS+des" },
          { classNumber: 3, className: "Szakmai angol" },
          { classNumber: 4, className: "Matematika" },
          { classNumber: 5, className: "Angol" },
          { classNumber: 6, className: "Történelem" }
        ]
      }
    ];

    for (const day of days) {
      for (const classInfo of day.classes) {
        await db.run('INSERT INTO timetable (day, classNumber, className) VALUES (?, ?, ?)', [
          day.day,
          classInfo.classNumber,
          classInfo.className
        ]);
      }
    }
}