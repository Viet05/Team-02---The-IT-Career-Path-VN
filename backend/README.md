# 🚀 IT Career Path VN — Backend API

Backend RESTful API cho hệ thống **IT Career Path VN** — nền tảng giúp các bạn sinh viên và người đi làm định hướng lộ trình học tập công nghệ thông tin và gợi ý việc làm phù hợp.

---

## 📋 Mục Lục

- [Tech Stack](#-tech-stack)
- [Kiến Trúc Hệ Thống](#-kiến-trúc-hệ-thống)
- [Cài Đặt & Chạy Ứng Dụng](#-cài-đặt--chạy-ứng-dụng)
- [Cấu Hình Biến Môi Trường](#-cấu-hình-biến-môi-trường)
- [API Endpoints](#-api-endpoints)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Luồng Xác Thực (Authentication Flow)](#-luồng-xác-thực-authentication-flow)
- [Thuật Toán Gợi Ý Việc Làm](#-thuật-toán-gợi-ý-việc-làm)

---

## 🛠️ Tech Stack

| Thành phần | Công nghệ | Version |
|---|---|---|
| Framework | Spring Boot | 3.4.1 |
| Ngôn ngữ | Java | 21 (LTS) |
| Database | MySQL | 8.x |
| ORM | Spring Data JPA + Hibernate | — |
| Bảo mật | Spring Security + JWT (Nimbus JOSE) | — |
| Object Mapping | MapStruct | 1.6.3 |
| Code Generation | Lombok | — |
| Email Template | Thymeleaf + Spring Mail | — |
| API Docs | SpringDoc OpenAPI (Swagger UI) | 2.8.0 |
| Excel Import | Apache POI | 5.5.1 |
| Build Tool | Maven | — |

---

## 🏗️ Kiến Trúc Hệ Thống

```
Client (React Frontend)
        │
        ▼ HTTP Request
┌───────────────────────┐
│   Controller Layer    │  ← Nhận request, validate input, gọi service
├───────────────────────┤
│    Service Layer      │  ← Business logic, xử lý nghiệp vụ
├───────────────────────┤
│  Repository Layer     │  ← Tương tác database qua Spring Data JPA
├───────────────────────┤
│    Database (MySQL)   │
└───────────────────────┘
```

**Các Package chính:**

```
com.team02.backend/
├── controller/      # REST Controllers (11 controllers)
├── service/         # Business Logic (14 services)
├── repository/      # Data Access Layer (15 repositories)
├── entity/          # JPA Entities (16 entities)
├── dto/             # Data Transfer Objects
│   ├── request/     # Input DTOs (từ client gửi lên)
│   └── response/    # Output DTOs (trả về cho client)
├── mapper/          # MapStruct Mappers
├── exception/       # Custom Exceptions + Global Handler
├── security/        # JWT Utils, Filter, UserDetails
├── enums/           # Enum definitions
├── config/          # Security Config, App Config
└── specification/   # JPA Specifications (dynamic query)
```

---

## ⚙️ Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu

- Java 21+
- Maven 3.8+
- MySQL 8.x

### Các Bước Chạy

**1. Clone repository**
```bash
git clone <repository-url>
cd backend
```

**2. Tạo database MySQL**
```sql
CREATE DATABASE cdio_project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**3. Cấu hình biến môi trường** (xem section bên dưới)

**4. Chạy ứng dụng**
```bash
# Dùng Maven Wrapper (khuyến nghị)
./mvnw spring-boot:run

# Hoặc dùng lệnh Maven
mvn spring-boot:run
```

**5. Truy cập Swagger UI**

Khi ứng dụng khởi động thành công, mở trình duyệt tại:
```
http://localhost:8080/swagger-ui/index.html
```

---

## 🔑 Cấu Hình Biến Môi Trường

Tạo file `application-env.yml` tại `src/main/resources/` (file này đã được `.gitignore`):

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cdio_project
    username: root
    password: your_db_password

  mail:
    username: your_email@gmail.com
    password: your_app_password    # Google App Password (16 ký tự)

jwt:
  secret: your_jwt_secret_key_min_32_chars
```

> **Lưu ý:** Hoặc có thể set qua Environment Variables hệ thống:
> - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
> - `JWT_SECRET`

---

## 📡 API Endpoints

> Base URL: `http://localhost:8080/api/it-path`

> 🔓 = Public (không cần token) | 🔐 = Cần JWT token | 👑 = Chỉ Admin

---

### 🔐 Authentication — `/api/it-path/auth`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `POST` | `/register` | Đăng ký tài khoản mới (gửi email xác thực) | 🔓 |
| `POST` | `/login` | Đăng nhập, nhận access token + refresh token | 🔓 |
| `GET` | `/verify-email?token=` | Xác thực email | 🔓 |
| `GET` | `/verify-email/redirect?token=` | Xác thực email và redirect về frontend | 🔓 |
| `POST` | `/refresh` | Làm mới access token bằng refresh token | 🔓 |
| `POST` | `/logout` | Đăng xuất, thu hồi refresh token | 🔓 |
| `POST` | `/reset-password/request` | Yêu cầu gửi link đặt lại mật khẩu qua email | 🔓 |
| `POST` | `/reset-password/confirm` | Xác nhận đặt lại mật khẩu bằng token | 🔓 |

**Ví dụ response đăng nhập:**
```json
{
  "code": 200,
  "message": "Login Successfully",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "uuid-string",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "userId": 1,
    "userName": "user123",
    "role": "STUDENT"
  }
}
```

---

### 👤 User Profile — `/api/it-path/users/user_profile`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/me` | Lấy thông tin hồ sơ của người dùng đang đăng nhập | 🔐 |
| `PUT` | `/me` | Cập nhật thông tin hồ sơ cá nhân | 🔐 |

---

### 🧩 User Skills — `/api/it-path/users/user_profile/skills`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/me` | Lấy danh sách kỹ năng của tôi | 🔐 |
| `POST` | `/` | Thêm kỹ năng mới vào hồ sơ (kèm level 1–5) | 🔐 |
| `PUT` | `/{userProfileSkillId}` | Cập nhật level của kỹ năng | 🔐 |
| `DELETE` | `/{userProfileSkillId}` | Xóa kỹ năng khỏi hồ sơ | 🔐 |

---

### 🗺️ Roadmaps — `/api/it-path/roadmaps`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/all` | Lấy danh sách tất cả roadmap | 🔓 |
| `GET` | `/details?roadmapId=&userId=` | Lấy chi tiết roadmap kèm tiến độ học của user | 🔓 |
| `POST` | `/` | Tạo roadmap mới | 👑 |
| `POST` | `/node` | Thêm node vào roadmap | 👑 |
| `POST` | `/excel` | Import roadmap từ file Excel (multipart/form-data) | 👑 |
| `PUT` | `/{roadmapId}` | Cập nhật roadmap | 👑 |
| `DELETE` | `/{roadmapId}` | Xóa roadmap | 👑 |

---

### 📈 Learning Progress — `/api/it-path/progress`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/` | Lấy danh sách tiến độ học tập của tôi | 🔐 |
| `POST` | `/start/{roadmapNodeId}` | Bắt đầu học một node | 🔐 |
| `POST` | `/complete/{roadmapNodeId}` | Đánh dấu hoàn thành một node | 🔐 |
| `PUT` | `/` | Cập nhật tiến độ của một node | 🔐 |
| `POST` | `/reset/{roadmapNodeId}` | Reset tiến độ về trạng thái ban đầu | 🔐 |
| `GET` | `/completed-count` | Lấy tổng số node đã hoàn thành | 🔐 |

---

### 💼 Job Postings — `/api/it-path/jobs`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/` | Tìm kiếm & lọc tin tuyển dụng | 🔓 |
| `POST` | `/import` | Import danh sách job từ API bên ngoài | 🔐 |

**Query params tìm kiếm:**
- `keyword` — từ khóa tìm kiếm
- `location` — địa điểm
- `jobType` — loại công việc (FULL_TIME, PART_TIME, REMOTE, ...)
- `jobLevel` — cấp độ (FRESHER, JUNIOR, MIDDLE, SENIOR, LEADER)
- `skillId` — lọc theo kỹ năng cụ thể
- `minSalary`, `maxSalary` — khoảng lương

---

### ❤️ Favourite Jobs — `/api/it-path/jobs/favourite`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/` | Lấy danh sách job đã yêu thích | 🔐 |
| `POST` | `/` | Thêm job vào danh sách yêu thích | 🔐 |
| `DELETE` | `/{userFavouriteJobId}` | Xóa job khỏi danh sách yêu thích | 🔐 |

---

### 🤖 Job Recommendations — `/api/it-path/users/recommendations`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/?topN=10` | Gợi ý top N việc làm phù hợp nhất (mặc định 10, tối đa 50) | 🔐 |

---

### 🛡️ Admin — User Management — `/api/it-path/admin/users`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/` | Tìm kiếm & lọc người dùng (keyword, status, role) | 👑 |
| `PUT` | `/{id}` | Cập nhật thông tin người dùng | 👑 |
| `PUT` | `/{id}/status` | Khóa / Mở khóa tài khoản | 👑 |
| `DELETE` | `/{id}` | Xóa người dùng | 👑 |

---

### 🛡️ Admin — Skills — `/api/it-path/admin/skills`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/` | Lấy danh sách tất cả kỹ năng | 👑 |
| `POST` | `/` | Thêm kỹ năng mới | 👑 |
| `PUT` | `/{skillId}` | Cập nhật kỹ năng | 👑 |
| `DELETE` | `/{skillId}` | Xóa kỹ năng | 👑 |

---

### 🛡️ Admin — Dashboard — `/api/it-path/admin/dashboard`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/stats` | Thống kê tổng quan (số user, job, roadmap, ...) | 👑 |
| `GET` | `/chart` | Dữ liệu biểu đồ | 👑 |
| `GET` | `/recent` | Danh sách tin tuyển dụng đăng gần đây | 👑 |

---

## 📁 Cấu Trúc Thư Mục

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/team02/backend/
│   │   │   ├── BackendApplication.java
│   │   │   ├── config/
│   │   │   │   ├── app/             # AppConfig (CORS, beans)
│   │   │   │   └── security/        # SecurityConfig.java
│   │   │   ├── controller/          # 11 REST Controllers
│   │   │   ├── service/             # 14 Service classes
│   │   │   ├── repository/          # 15 JPA Repositories
│   │   │   ├── entity/              # 16 JPA Entities
│   │   │   ├── dto/
│   │   │   │   ├── request/         # Input DTOs
│   │   │   │   └── response/        # Output DTOs
│   │   │   ├── mapper/              # MapStruct mappers
│   │   │   ├── exception/           # GlobalExceptionHandler + Custom exceptions
│   │   │   ├── security/            # JWT Utils, Filter
│   │   │   ├── enums/               # UserRole, UserStatus, JobLevel, JobType, ...
│   │   │   └── specification/       # JPA Specifications (dynamic query)
│   │   └── resources/
│   │       ├── application.yml      # Config chính
│   │       ├── application-env.yml  # Config cục bộ (gitignored)
│   │       └── templates/           # Email templates (Thymeleaf)
│   └── test/                        # Unit & Integration tests
├── pom.xml
└── README.md
```

---

## 🔐 Luồng Xác Thực (Authentication Flow)

```
1. ĐĂNG KÝ
   POST /register → Tạo user (INACTIVE) → Gửi email xác thực

2. XÁC THỰC EMAIL
   GET /verify-email?token=xxx → Đổi status → ACTIVE

3. ĐĂNG NHẬP
   POST /login → Trả về { accessToken (1h), refreshToken (7d) }

4. GỌI API CÓ BẢO VỆ
   Header: Authorization: Bearer <accessToken>

5. LÀM MỚI TOKEN
   POST /refresh { refreshToken } → Trả về accessToken mới

6. ĐĂNG XUẤT
   POST /logout { refreshToken } → Thu hồi refresh token
```

**JWT Payload chứa:**
```json
{
  "sub": "username",
  "role": "STUDENT",
  "usersId": 1,
  "iss": "The It Career Path VN Web backend",
  "iat": 1234567890,
  "exp": 1234571490
}
```

---

## 🤖 Thuật Toán Gợi Ý Việc Làm

Hệ thống tính điểm phù hợp (`matchScore`) cho mỗi job posting dựa trên **4 tiêu chí**:

| Tiêu chí | Trọng số | Mô tả |
|---|---|---|
| **Kỹ năng** (`skillScore`) | **55%** | So sánh kỹ năng user với yêu cầu job, tính theo level (1–5) |
| **Cấp độ** (`levelScore`) | **20%** | So sánh level user (Fresher/Junior/Middle/Senior) với yêu cầu job |
| **Mục tiêu nghề nghiệp** (`careerGoalScore`) | **15%** | Khớp từ khóa trong `careerGoal` với tiêu đề job |
| **Địa điểm** (`cityScore`) | **10%** | Khớp thành phố user với địa điểm làm việc |

**Công thức:**
```
finalScore = skillScore × 0.55 + levelScore × 0.20 + careerGoalScore × 0.15 + cityScore × 0.10
```

Response trả về top N job được sắp xếp theo `finalScore` giảm dần.

---

## 📊 Chuẩn Response

Tất cả API đều trả về cùng một cấu trúc `ApiResponse<T>`:

```json
{
  "code": 200,
  "message": "Successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "status": 404,
  "error": "Not Found",
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "Roadmap with id '99' not found",
  "timestamp": "2026-02-26T10:00:00",
  "path": "/api/it-path/roadmaps/99",
  "details": null,
  "violations": null
}
```

---

## 👥 Team

Team 02 — CDIO Project — Spring Boot Backend
