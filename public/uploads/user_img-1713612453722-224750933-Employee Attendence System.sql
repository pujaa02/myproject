create database Attendence_Management_System;
use Attendence_Management_System;

create table employees (e_id int not null auto_increment primary key , e_fname varchar(255), e_lname varchar(255),
e_email varchar(255),e_gender varchar(255), e_companyId varchar(255), e_dob date , e_address text, e_contact bigint,
e_salt bigint , e_department varchar(255), e_pass varchar(255), created_at timestamp default current_timestamp ); 

create table role_master (role_id int not null auto_increment primary key , role_name varchar(255));

create table roles (roles_id int not null auto_increment primary key , e_companyId varchar(255), role_id int ,
foreign key (role_id) references role_master (role_id));

create table office_timing (time_id int not null auto_increment primary key ,
working_hrs int , break_hrs int );

create table employee_attend (attend_id int not null auto_increment primary key , e_id int,
 check_in_time timestamp , check_out_time timestamp , time_diff int,
 foreign key (e_id) references employees (e_id));
 
 create table employee_break (break_id int not null auto_increment primary key , e_id int,
 break_in_time timestamp, break_out_time timestamp , time_diff int,
 foreign key (e_id)  references employees (e_id));
 
 create table comments (comment_id int not null auto_increment primary key ,e_id int,
 comment text , foreign key (e_id) references employees (e_id));
 








