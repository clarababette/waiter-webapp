CREATE TABLE waiters (
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  employee_id varchar(6) GENERATED ALWAYS AS (substring(first_name, 1, 3) || substring(last_name, 1, 3)) STORED UNIQUE PRIMARY KEY,
  CONSTRAINT fullname UNIQUE (first_name,last_name)
  );

CREATE TABLE shifts (
  shift_date DATE NOT NULL,
  employee_id varchar(6) NOT NULL REFERENCES waiters(employee_id),
  status varchar(7) CHECK (status = 'working' OR status = 'standby'),
  PRIMARY KEY (shift_date,employee_id)
);

insert into waiters (first_name, last_name) values ('Dave', 'Avramov');
insert into waiters (first_name, last_name) values ('Ilse', 'King');
insert into waiters (first_name, last_name) values ('Benjy', 'Pafford');
insert into waiters (first_name, last_name) values ('Amelie', 'Loidl');
insert into waiters (first_name, last_name) values ('Karlene', 'Maciaszek');
insert into waiters (first_name, last_name) values ('Tiena', 'Chesney');
insert into waiters (first_name, last_name) values ('Janaya', 'Baff');
insert into waiters (first_name, last_name) values ('Jean', 'Guillotin');
insert into waiters (first_name, last_name) values ('Daune', 'Blann');
insert into waiters (first_name, last_name) values ('Alessandra', 'Tale');