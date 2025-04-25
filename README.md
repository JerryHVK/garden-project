<p align="center">
  <img src="images/garden-project-logo.png" width="120" alt="Garden project Logo - Khang supported by ChatGPT" style="border-radius: 25%;"/>
</p>
<p align="center" style="font-style: italic">Image source: Khang + ChatGPT</p>

<p align="center">This project takes advantage of Nestjs, a progressive Nodejs framework, for building efficient and scalable server-side applications</p>
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

# Part 1: Overview

## 0. Thank you
- Cảm ơn vì bạn đã dành thời gian cho project này

## 1. Introduction
- Project cuối kì thực tập tại Yootek Holdings - Song Nam Group

- Mục tiêu: Làm BackEnd, tạo server quản lí

## 2. Types of User
- Người quản lí: ADMIN - có thể quan sát được dữ liệu cũng như hoạt động của các user khác, cho phép khóa tài khoản user khi phát hiện bất thường
- Người dùng thường: USER - quản lí các khu vườn của mình, các loại rau trong vườn và theo dõi các thông số môi trường và việc mua bán rau của từng khu vườn

## 3. Project setup

### 3.1. Prepare database
- Project này sử dụng postgresql, đảm bảo bạn đã cài đặt postgresql trên máy tính của bạn

- Tạo một database mới

### 3.2. Create .env file
Tất cả các biến môi trường cần thiết đều ở trong file ```.env```, ba gồm:
  - connection string dùng để kết nối với database
  - địa chỉ IP và port của máy chủ bạn dùng để chạy project này
  - url của mqtt broker
  - khóa bảo mật của jwt do bạn tự đặt
  - hạn sử dụng của một jwt token do bạn tự điều chỉnh

Ví dụ như sau:
```
DATABASE_URL="postgresql://postgres:khang@localhost:5432/garden-project?schema=public"

HOST_PORT="3000"
HOST_NAME="http://localhost"

JWTSECRET="Dont use this secret"
JWT_EXPIRES_IN='1d'

MQTT_BROKER_URL="mqtt://broker.emqx.io:1883"
```

### 3.3. Install neccessary packages"
Chạy dòng lệnh này trong terminal của project:
```bash
$ npm install
```

### 3.4. Insert mock data
Database mới vẫn đang chưa có gì. 
Hãy chạy dòng lệnh sau trong terminal:
```bash
$ npx prisma migrate dev --name "Init db"
```

Mở file ```/src/mock-data/all_in_one.sql```, copy toàn bộ file và paste và chạy trong postgresql, như vậy là đã có dữ liệu giả để test api.

Bạn có thể tải pgadmin về để tiện dùng postgresql hơn.

## 4. Compile and run the project

```bash
# development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 5. Test api
Project này hỗ trợ API document sử dụng SwaggerUI. Mở browser và truy cập vào địa chỉ mà project đang chạy, thêm đuôi ```/api```, ví dụ:
```
localhost:3000/api
```

- Để chạy được các api, bạn cần đăng ký, rồi đăng nhập vào hệ thống, copy và paste phần jwt token lên phần authorize phía trên bên trái (xem demo để thấy rõ hơn)

LƯU Ý: có những api mà chỉ USER mới được thực hiện, cũng có những api mà chỉ ADMIN mới có thể thực hiện

## 6. Create admin account:
Không có api để đăng ký tài khoản ADMIN.
Để có tài khoản admin, bạn làm theo các bước sau:
- B1: đăng ký một tài khoản user bình thường
- B2: vào database trực tiếp, và sửa "role" của tài khoản đó thành "ADMIN"
- B3: đăng nhập bằng tài khoản đó và thực hiện thử một api nào đó mà chỉ admin mới làm được (khóa tài khoản user chẳng hạn)

LƯU Ý: Trong dữ liệu giả đã có tài khoản USER và ADMIN sẵn để test. Mở file ```src/mock-data/1_User.sql``` để xem email và mật khẩu của mỗi tài khoản.

## 7. Resources
- [Nestjs documentation](https://nestjs.com/)
- ChatGPT


## 8. Stay in touch
- Author - [Hoàng Văn Khang](https://github.com/JerryHVK)
- Facebook - [https://www.facebook.com/khang.hoangvan.562](https://www.facebook.com/khang.hoangvan.562)





# Part 2: Demo and Details
## 1. User

## 2. Admin

## 3. Device
- Device fix cứng với gardenId
- Trong demo này, gardenId của device là 2
- Device gửi dữ liệu về server mỗi 5s, thông quan mqtt broker





## 4. WebSocket
