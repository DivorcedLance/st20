PRAGMA foreign_keys = ON;

-- =========================
-- Tables
-- =========================

CREATE TABLE user (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  email                TEXT UNIQUE,
  name                 TEXT,
  profile_picture_url  TEXT,
  password             TEXT NOT NULL
);

CREATE TABLE course (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL
);

CREATE TABLE topic (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  number     INTEGER NOT NULL,       -- order/index within a course
  name       TEXT NOT NULL,
  course_id  INTEGER NOT NULL,
  FOREIGN KEY (course_id) REFERENCES course(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE (course_id, number)         -- <-- uniqueness per course
);


CREATE TABLE question_type (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE
);

CREATE TABLE question (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id      INTEGER NOT NULL,
  type_id       INTEGER NOT NULL,
  question_data TEXT NOT NULL,     -- JSON stored as TEXT
  time_limit    INTEGER,           -- in seconds; NULL = no limit
  FOREIGN KEY (topic_id) REFERENCES topic(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (type_id)  REFERENCES question_type(id) ON UPDATE CASCADE
);

CREATE TABLE answer (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  type_id       INTEGER NOT NULL,
  question_id   INTEGER NOT NULL,
  answer_data   TEXT NOT NULL,     -- JSON stored as TEXT
  submitted_at  DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (user_id)     REFERENCES user(id)   ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (type_id)     REFERENCES question_type(id) ON UPDATE CASCADE,
  FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =========================
-- Indexes
-- =========================

CREATE INDEX idx_topic_course_id     ON topic(course_id);
CREATE INDEX idx_topic_number        ON topic(number);
CREATE INDEX idx_question_topic_id   ON question(topic_id);
CREATE INDEX idx_question_type_id    ON question(type_id);
CREATE INDEX idx_answer_question_id  ON answer(question_id);
CREATE INDEX idx_answer_user_id      ON answer(user_id);
CREATE INDEX idx_answer_type_id      ON answer(type_id);

-- =========================
-- Unique Indexes
-- =========================

CREATE UNIQUE INDEX ux_topic_course_number
  ON topic(course_id, number);

-- =========================
-- Seed data
-- =========================

INSERT INTO question_type (id, name) VALUES
  (0, 'True or False'),
  (1, 'Multiple Choice');
