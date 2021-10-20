CREATE TABLE waiters (
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  employee_id varchar(6) GENERATED ALWAYS AS (substring(first_name, 1, 3) || substring(last_name, 1, 3)) STORED UNIQUE PRIMARY KEY
);

CREATE TABLE shifts (
  shift_date DATE NOT NULL,
  employee_id varchar(6) NOT NULL,
  PRIMARY KEY (shift_date,employee_id)
);

CREATE TABLE standby (
  standby_shift_date DATE NOT NULL,
  employee_id varchar(6) NOT NULL,
  PRIMARY KEY (standby_shift_date,employee_id)
);

