<p align="center">
  <img src="images/garden-project-logo.png" width="120" alt="Garden project Logo - Khang supported by ChatGPT" style="border-radius: 25%;"/>
</p>
<p align="center" style="font-style: italic">Image source: Khang + ChatGPT</p>

<p align="center">This project takes advantage of Nestjs, a progressive Nodejs framework, for building efficient and scalable server-side applications</p>
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

# 0. Xin thông cảm
- Tác giả đang cố gắng học tiếng anh nên trong bài, sẽ có lúc ghi tiếng Anh, sẽ có lúc ghi tiếng Việt, nếu điều đó có làm bạn khó chịu, mong bạn bỏ qua cho
- Tại sao lại không phải 100% tiếng anh => Vì nhiều khi viết xong bản thân tác giả đọc còn không hiểu chứ đừng nói là người khác, vậy nên đoạn nào khó, viết hết bằng tiếng Việt cho nhanh
- Tạm thời, để cho nhanh, gần như toàn bộ sẽ được viết bằng tiếng Việt, nếu muốn đọc tiếng Anh, bạn có thể bỏ vào google dịch nha

# 1. Introduction
- Đây là project cuối kì thực tập tại công ty Yootek - Song Nam Group

- Mục đích của project là tạo ra một server quản lí các khu vườn cho người dùng, mỗi khu vườn sẽ trồng các loại rau khác nhau để bán

- có 2 đối tượng người dùng trong project này: USER và ADMIN

# 2. What this project can do?
- Server thu thập dữ liệu cảm biến từ các thiết bị và lưu vào database
- Dữ liệu cảm biến có thể được server gửi lên cho client thông qua websocket theo thời gian thực
- User thực hiện quản lí khu vườn của mình theo các API được tích hợp sẵn
- Admin có quyền xem dữ liệu từ tất cả khu vườn của tất cả user, nhưng không được thay đổi dữ liệu

# 3. Project setup

## 3.1. Prepare a database server
- In this case, I use postgresql as the database server, and install it in the same computer I run this project

## 3.2. Create .env file
Create a ```.env``` file in ```garden-project``` folder:

```
DATABASE_URL="[database]://[username]:[password]@[db_url]:[db_port]/[db_name]?schema=[schema_name]"

HOST_PORT="[host_port]"
HOST_NAME="[host_url]"

JWTSECRET="[jwtsecret]"
JWT_EXPIRES_IN='[time_for_valid_token]'

MQTT_BROKER_URL="[mqtt_broker_url]"
```

For example:
```
DATABASE_URL="postgresql://postgres:khang@localhost:5432/garden-project?schema=public"

HOST_PORT="3000"
HOST_NAME="http://localhost"

JWTSECRET="Dont use this secret"
JWT_EXPIRES_IN='1d'

MQTT_BROKER_URL="mqtt://broker.emqx.io:1883"
```

## 3.3. Install neccessary packages:
Run this command to install all the neccessary packages:
```bash
$ npm install
```

# 4. Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# 5. Test api
Project hỗ trợ API document sử dụng SwaggerUI. Mở swagger user bằng cách nhập đường link vào browser, ví dụ:
```
localhost:3000/api
```

Test các api có trong đó. Lưu ý sẽ có những api mà chỉ user mới có thể thực hiện, và có những api mà chỉ admin mới có thể thực hiện
# 6. Test websocket
Mở postman, tạo mới request với định dạng ```socket.io```, và nhập url của server vào, ví dụ:
```
http://localhost://3000
```

Vì những giới hạn về hiểu biết của tác giả, việc test websocket sẽ hơi thủ công, chịu khó nha

Trước khi kết nối, ta cần cho phép client ở postman nhận 2 events:
- ```fromServer```
- ```device-data```

Sau khi thực hiện connect, ta cần gửi một message cho server theo topic ```authen```, và format của message như sau:

Với token là jwtToken bạn lấy được sau khi đăng nhập bằng việc sử dụng SwaggerUI.
Còn gardenId là id của garden thuộc về bạn


# 7. Resources

- [Nestjs documentation](https://nestjs.com/)
- ChatGPT


# 8. Stay in touch

- Author - [Hoàng Văn Khang](https://github.com/JerryHVK)
- Facebook - [https://www.facebook.com/khang.hoangvan.562](https://www.facebook.com/khang.hoangvan.562)