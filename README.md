# IT Career Path - Hướng dẫn Cài đặt và Chạy

Dự án gồm 2 phần: **Frontend (React)** và **Backend (Spring Boot)**

## 📋 Yêu cầu

Trước khi bắt đầu, hãy cài đặt:

- **Node.js** v14+ (bao gồm npm) - [Tải tại đây](https://nodejs.org/)
- **Java JDK** 11+ - [Tải tại đây](https://www.oracle.com/java/technologies/downloads/)
- **Git** - [Tải tại đây](https://git-scm.com/)

## 🚀 Cài đặt và Chạy Frontend

### Bước 1: Mở Terminal/PowerShell

Nếu dùng **PowerShell**, chạy lệnh này trước (chỉ cần 1 lần):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Bước 2: Điều hướng đến thư mục frontend

```bash
cd frontend
```

### Bước 3: Cài đặt dependencies

```bash
npm install
```

### Bước 4: Chạy ứng dụng

```bash
npm start

```

Ứng dụng sẽ tự động mở trên `http://localhost:3000`

**Nếu port 3000 đã được sử dụng**, chạy với port khác:
```bash
$env:PORT=3002; npm start
```

## 🔧 Cài đặt và Chạy Backend

### Bước 1: Mở Terminal mới

### Bước 2: Điều hướng đến thư mục backend

```bash
cd backend
```

### Bước 3: Chạy Spring Boot application

**Trên Windows:**
```bash
mvnw.cmd spring-boot:run
```

**Trên Mac/Linux:**
```bash
./mvnw spring-boot:run
```

Backend sẽ chạy trên `http://localhost:8080`

## 📱 Kiểm tra ứng dụng

Khi cả Frontend và Backend đang chạy:

1. Mở browser truy cập: `http://localhost:3000` (hoặc port khác nếu bạn dùng port khác)
2. Bạn sẽ thấy:
   - Navigation bar với menu: Home, About, Roadmaps, Jobs
   - Nút Login ở góc phải
   - Trang mặc định hiển thị "Home"

## 🐛 Khắc phục sự cố

### Vấn đề: "npm: command not found"
- Đảm bảo đã cài Node.js
- Restart terminal sau khi cài

### Vấn đề: "Something is already running on port 3000"
- Port đã được sử dụng, chạy trên port khác:
  ```bash
  $env:PORT=3002; npm start
  ```

### Vấn đề: "mvnw command not found"
- Đảm bảo ở thư mục `backend`
- Trên Windows dùng `mvnw.cmd`, Mac/Linux dùng `./mvnw`

### Vấn đề: "execution policies" trên PowerShell
- Chạy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Nhập `Y` khi được hỏi

## 📁 Cấu trúc Project

```
Team-02---The-IT-Career-Path-VN-main/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── styles/             # CSS files
│   │   ├── App.js              # Main app component
│   │   └── index.js            # Entry point
│   ├── package.json            # Dependencies
│   └── public/                 # Static files
│
└── backend/                    # Spring Boot application
    ├── src/
    │   ├── main/java/          # Java source code
    │   └── resources/          # Config files
    ├── pom.xml                 # Maven dependencies
    └── mvnw / mvnw.cmd         # Maven wrapper
```

## 🔗 Các tuyến đường chính

| Đường dẫn | Mô tả |
|-----------|------|
| `/` | Trang chủ |
| `/about` | Trang giới thiệu |
| `/roadmaps` | Trang lộ trình học tập |
| `/jobs` | Trang việc làm |
| `/login` | Trang đăng nhập |
| `/dashboard` | Dashboard (tạm) |
| `/signup` | Trang đăng ký (tạm) |
| `/reset-password` | Đặt lại mật khẩu (tạm) |

## 💾 Git Commands (Tùy chọn)

Nếu dùng Git:
```bash
# Clone repository
git clone <repository-url>

# Cập nhật code
git pull

# Tạo branch mới
git checkout -b feature-name

# Commit changes
git add .
git commit -m "description"

# Push to remote
git push origin feature-name
```

## 📝 Ghi chú

- Frontend chạy trên port **3000** (mặc định) hoặc **3002, 3004, ...**
- Backend chạy trên port **8080** (mặc định)
- Frontend được cấu hình proxy tới Backend tại `http://localhost:8080`
- Tất cả các route chưa implement sẽ hiển thị placeholder

## ❓ Cần giúp?

Nếu gặp vấn đề:
1. Kiểm tra console/terminal xem lỗi gì
2. Đảm bảo ports không bị chiếm dụng
3. Xóa `node_modules` và chạy `npm install` lại
4. Restart terminal và thử lại

---

**Chúc bạn code vui vẻ!** 🎉


cd frontend
npm install
npm start

cd Team-02---The-IT-Career-Path-VN
git checkout main
git pull origin main

 ket noi backend frontend 
 npm install --save-dev concurrently 
 cd d:\CDIO\Team-02-Hien\frontend ; npm install --save-dev concurrently
 cd d:\CDIO\Team-02-Hien\frontend ; npm install --save-dev concurrently 2>&1
 npm run all