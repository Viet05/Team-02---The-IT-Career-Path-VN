# IT Career Path - Hướng dẫn cài đặt và chạy phần cào dữ liệu

## 🧠 Kiến trúc hệ thống

```bash
Website Job
     ↓
BeautifulSoup Crawler (Flask API)
     ↓
n8n Workflow (Schedule / Cron)
     ↓
Spring Boot Backend
     ↓
MySQL Database
```

## Architecture Flow
1. n8n trigger theo cron schedule
2. n8n gọi Flask API để crawl
3. Flask sử dụng BeautifulSoup để parse HTML
4. Trả về JSON job list
5. n8n gửi từng job đến Spring Boot API
6. Backend kiểm tra duplicate bằng external_job_id
7. Lưu vào MySQL

## Hướng dẫn chạy
- Tạo 3 cổng terminal
1. ...\Team-02---The-IT-Career-Path-VN\backend
```bash
mvn spring-boot:run
```
2. ...\Team-02---The-IT-Career-Path-VN\crawler
```bash
python CareerVietCrawler.py
```
3. ...\Team-02---The-IT-Career-Path-VN\
```bash
n8n
```

## 🛠 Cài đặt:
### 🐍 Cài đặt BeautifulSoup + Flask 
### 1 Yêu cầu 
- Python 3.9+
- pip

### 2 Cài đặt thư viện
```bash
pip install beautifulsoup4
pip install requests
pip install flask
```
Nếu dùng virtual environment:
```bash
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate # Mac/Linux
```
### 3 Chạy Flask crawler
Mở terminal chạy:
```bash
python CareerVietCrawler.py
```
Chạy local:
```bash
http://localhost:5000/crawl
```

### Cài đặt n8n
### Cách 1: Cài bằng npm
```bash
npm install n8n -g
n8n
```
Mở:
```bash
http://localhost:5678
```

### Cách 2: Chạy bằng docker
```bash
docker run -it --rm \
 -p 5678:5678 \
 n8nio/n8n
```

### ⚙ Cấu hình Workflow n8n
Bấm vào dấu + và chọn , sau đó cấu hình theo thời gian mà mình muốn cào
```bash
Add another trigger -> On a schedule
```
### Bước 1: Cron Trigger
- Chọn thời gian mà mình muốn trigger

### Bước 2: HTTP Request (Call Flask API)
1. Nhấn vào dấu + và chọn Core
2. Chọn HTTP Request
3. Chọn:
```bash
Method: GET
URL: http://localhost:5000/crawl
```
### Bước 3 HTTP Request (Send to Backend Spring-Boot)
Chọn:
```bash
Method: POST
URL: http://localhost:8080/api/it-path/jobs/import

Chọn Send Body
Body Content Type: JSON
Specify Body: Using JSON
JSON chọn Expression: {{$items().map(item => item.json)}}
```