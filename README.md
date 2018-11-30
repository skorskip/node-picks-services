# node-picks-services

To Run:
- start mysql server
- enter mysql: usr/local/mysql/bin/ ./mysql -h root -p --local-infile pickem
- enter command: SET GLOBAL local_infile = 1;
- enter command: ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
- node server.js
