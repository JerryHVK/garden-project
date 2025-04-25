insert into "User" (id, email, name, password, address) values (1, 'khang@gmail.com', 'Hoang Van Khang', '$2a$10$BPEZjoxXoWqnBuc9S1B0beQuFfOGfVQESazUKRAJerACds9FWuVz6', 'Hai Ba Trung, Ha Noi'); ---khang123
insert into "User" (id, email, name, password, address) values (2, 'duy@gmail.com', 'Nguyen Dang Duy', '$2a$10$Wz4Ab3uSyK3sRnrCztqveO/wZViVqzde5MjUvbdpM7O3IFlDSXGzm', 'Dong Da, Ha Noi'); ---duy123
insert into "User" (id, email, name, password, address) values (3, 'viet@gmail.com', 'Bui Duc Viet', '$2a$10$BLwhTKIJLOBLfxrMFXuMdu39irghq28XlTI/ZAOqvvomW7VTuQNaa', 'Cau Giay, Ha Noi'); ---viet123
insert into "User" (id, email, name, password, address) values (4, 'duc@gmail.com', 'Hoang Duy Duc', '$2a$10$/weWERpHwis4ldHrXb618.TyleBAfe3tFPgxK56gcGi3iS2hBVIsO', '5728 Starling Place'); ---duc123
insert into "User" (id, email, name, password, role) values (5, 'admin@gmail.com', 'admin', '$2a$10$Mi/53.FdSBUQ.8C47asy..S6yoDei8lBJo2P4vkMjuWBq6PuZNhUy', 'ADMIN'); ---admin123

ALTER SEQUENCE "User_id_seq" RESTART WITH 6;

