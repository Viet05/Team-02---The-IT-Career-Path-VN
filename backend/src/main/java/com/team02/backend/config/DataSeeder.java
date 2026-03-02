package com.team02.backend.config;

import com.team02.backend.entity.*;
import com.team02.backend.enums.*;
import com.team02.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DataSeeder - Tự động tạo 30 bản ghi giả cho mỗi entity khi backend khởi động.
 *
 * Dữ liệu được thiết kế để bao phủ đầy đủ test cases:
 * - Các enum values khác nhau (role, status, jobType, jobLevel...)
 * - Edge cases: email chưa verify, user bị INACTIVE, salary null, bio dài...
 * - Đa dạng về thành phố, ngành nghề, cấp độ, công ty
 *
 * Idempotent: chỉ seed nếu bảng đích còn trống.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

        private final SkillRepository skillRepository;
        private final CareerRoleRepository careerRoleRepository;
        private final JobSourceRepository jobSourceRepository;
        private final UserRepository userRepository;
        private final UserProfileRepository userProfileRepository;
        private final RoadmapRepository roadmapRepository;
        private final RoadmapNodeRepository roadmapNodeRepository;
        private final JobPostingRepository jobPostingRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(ApplicationArguments args) {
                log.info("=== DataSeeder: Bắt đầu seed 30 bản ghi mỗi entity ===");

                List<Skill> skills = seedSkills();
                List<CareerRole> roles = seedCareerRoles();
                JobSource jobSource = seedJobSource();
                List<Users> users = seedUsers();
                seedUserProfiles(users);
                seedRoadmaps(roles, skills);
                seedJobPostings(jobSource, skills);

                log.info("=== DataSeeder: Hoàn tất ===");
        }

        // =========================================================
        // 1. SKILLS — 30 kỹ năng đa dạng
        // =========================================================
        private List<Skill> seedSkills() {
                if (skillRepository.count() > 0) {
                        log.info("Skills đã tồn tại, bỏ qua.");
                        return skillRepository.findAll();
                }

                List<Skill> list = List.of(
                                // Backend
                                s("Java", "Ngôn ngữ lập trình Java SE/EE, nền tảng backend doanh nghiệp"),
                                s("Spring Boot", "Framework Java phổ biến cho REST API và microservices"),
                                s("Python", "Ngôn ngữ đa dụng: backend, data science, scripting"),
                                s("Node.js", "Runtime JavaScript phía server, phù hợp I/O cao"),
                                s("Go", "Ngôn ngữ biên dịch của Google, hiệu năng cao"),
                                s("C#", "Ngôn ngữ .NET của Microsoft, dùng cho enterprise"),
                                s("PHP", "Ngôn ngữ server-side phổ biến cho web"),
                                s("Kotlin", "Ngôn ngữ JVM hiện đại, dùng cho Android và backend"),
                                s("Ruby", "Ngôn ngữ linh hoạt, nổi tiếng với Rails framework"),
                                s("Rust", "Ngôn ngữ hệ thống an toàn bộ nhớ, hiệu năng cao"),
                                // Frontend
                                s("React", "Thư viện UI JavaScript của Meta, phổ biến nhất 2024"),
                                s("Vue.js", "Framework JavaScript tiến bộ, dễ học"),
                                s("Angular", "Framework TypeScript của Google cho SPA"),
                                s("TypeScript", "JavaScript có kiểu dữ liệu tĩnh, tăng độ an toàn"),
                                s("JavaScript", "Ngôn ngữ lập trình web phổ biến nhất thế giới"),
                                s("HTML/CSS", "Nền tảng giao diện web: cấu trúc và trình bày"),
                                s("Next.js", "Framework React cho SSR và static site generation"),
                                s("Tailwind CSS", "Framework CSS utility-first, tăng tốc phát triển UI"),
                                // Database
                                s("MySQL", "RDBMS phổ biến, cú pháp SQL chuẩn"),
                                s("PostgreSQL", "RDBMS mã nguồn mở mạnh mẽ, JSON support"),
                                s("MongoDB", "NoSQL document database linh hoạt"),
                                s("Redis", "In-memory store cho caching và session"),
                                s("SQL", "Ngôn ngữ truy vấn cơ sở dữ liệu quan hệ"),
                                // DevOps / Cloud
                                s("Docker", "Container hóa ứng dụng, đóng gói môi trường"),
                                s("Kubernetes", "Orchestration container, quản lý cluster"),
                                s("Git", "Hệ thống quản lý phiên bản phân tán"),
                                s("Linux", "Hệ điều hành server phổ biến nhất"),
                                s("AWS", "Amazon Web Services - nền tảng cloud số 1"),
                                s("CI/CD", "Tích hợp và triển khai liên tục: Jenkins, GitHub Actions"),
                                s("REST API", "Kiến trúc API HTTP phổ biến nhất cho web services"));

                List<Skill> saved = skillRepository.saveAll(list);
                log.info("Seeded {} Skills.", saved.size());
                return saved;
        }

        // =========================================================
        // 2. CAREER ROLES — 10 vai trò nghề nghiệp IT
        // =========================================================
        private List<CareerRole> seedCareerRoles() {
                if (careerRoleRepository.count() > 0) {
                        log.info("CareerRoles đã tồn tại, bỏ qua.");
                        return careerRoleRepository.findAll();
                }

                List<CareerRole> list = List.of(
                                cr("BACKEND", "Backend Developer", "Phát triển server-side logic, REST API, database"),
                                cr("FRONTEND", "Frontend Developer",
                                                "Phát triển UI web: React, Vue, Angular, HTML/CSS"),
                                cr("FULLSTACK", "Full Stack Developer",
                                                "Làm cả frontend lẫn backend trong cùng một project"),
                                cr("DEVOPS", "DevOps / SRE Engineer", "CI/CD, Docker, Kubernetes, hạ tầng cloud"),
                                cr("DATA", "Data Engineer", "Pipeline dữ liệu, ETL, data warehouse, Spark"),
                                cr("AI", "AI / ML Engineer", "Machine learning, deep learning, NLP, CV"),
                                cr("MOBILE", "Mobile Developer", "iOS/Android native hoặc React Native / Flutter"),
                                cr("QA", "QA / Test Engineer", "Manual testing, automation testing, CI integration"),
                                cr("SECURITY", "Security Engineer", "Pen testing, vulnerability assessment, SAST/DAST"),
                                cr("ARCHITECT", "Software Architect",
                                                "Thiết kế hệ thống, chọn tech stack, review kiến trúc"));

                List<CareerRole> saved = careerRoleRepository.saveAll(list);
                log.info("Seeded {} CareerRoles.", saved.size());
                return saved;
        }

        // =========================================================
        // 3. JOB SOURCE
        // =========================================================
        private JobSource seedJobSource() {
                if (jobSourceRepository.count() > 0) {
                        return jobSourceRepository.findAll().get(0);
                }
                JobSource src = jobSourceRepository.save(
                                JobSource.builder().name("ITviec").apiUrl("https://itviec.com/api/jobs").build());
                log.info("Seeded JobSource: {}", src.getName());
                return src;
        }

        // =========================================================
        // 4. USERS — 30 users: 1 admin, 20 student, 9 company
        // Test cases: emailVerified T/F, status ACTIVE/INACTIVE
        // =========================================================
        private List<Users> seedUsers() {
                if (userRepository.existsByUsername("admin")) {
                        log.info("Users đã tồn tại, bỏ qua.");
                        return userRepository.findAll();
                }

                String pw = passwordEncoder.encode("Password123@");

                List<Users> list = new ArrayList<>();

                // --- ADMIN (1) ---
                list.add(u("admin", "admin@itcareer.vn", pw, UserRole.ADMIN, UserStatus.ACTIVE, true));

                // --- STUDENTS (20) — đa dạng verified/unverified, active/inactive ---
                list.add(u("nguyen_van_a", "vana@student.edu.vn", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("tran_thi_b", "thib@student.edu.vn", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("le_van_c", "vanc@student.edu.vn", pw, UserRole.STUDENT, UserStatus.ACTIVE, false)); // chưa
                                                                                                                // verify
                                                                                                                // email
                list.add(u("pham_thi_d", "thid@student.edu.vn", pw, UserRole.STUDENT, UserStatus.INACTIVE, true)); // bị
                                                                                                                   // khoá
                list.add(u("hoang_van_e", "vane@gmail.com", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("nguyen_thi_f", "thif@gmail.com", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("bui_van_g", "vang@outlook.com", pw, UserRole.STUDENT, UserStatus.ACTIVE, false)); // chưa
                                                                                                              // verify
                list.add(u("do_thi_h", "thih@yahoo.com", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("vu_van_i", "vani@hust.edu.vn", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("dang_thi_j", "thij@hust.edu.vn", pw, UserRole.STUDENT, UserStatus.INACTIVE, false)); // khoá
                                                                                                                 // +
                                                                                                                 // chưa
                                                                                                                 // verify
                list.add(u("trinh_van_k", "vank@fpt.edu.vn", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("ngo_thi_l", "thil@fpt.edu.vn", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("ly_van_m", "vanm@uit.edu.vn", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("mai_thi_n", "thin@uit.edu.vn", pw, UserRole.STUDENT, UserStatus.ACTIVE, false));
                list.add(u("luong_van_o", "vano@vnu.edu.vn", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("dinh_thi_p", "thip@vnu.edu.vn", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("cao_van_q", "vanq@dut.udn.vn", pw, UserRole.STUDENT, UserStatus.INACTIVE, true)); // khoá
                list.add(u("ha_thi_r", "thir@gmail.com", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("to_van_s", "vans@gmail.com", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));
                list.add(u("truong_thi_t", "thit@gmail.com", pw, UserRole.STUDENT, UserStatus.ACTIVE, true));

                // --- COMPANIES (9) ---
                list.add(u("namitech_hr", "hr@namitech.vn", pw, UserRole.COMPANY, UserStatus.ACTIVE, true));
                list.add(u("fpt_recruit", "recruit@fpt.com.vn", pw, UserRole.COMPANY, UserStatus.ACTIVE, true));
                list.add(u("vng_talent", "talent@vng.com.vn", pw, UserRole.COMPANY, UserStatus.ACTIVE, true));
                list.add(u("momo_hr", "hr@momo.vn", pw, UserRole.COMPANY, UserStatus.ACTIVE, true));
                list.add(u("tiki_recruit", "recruit@tiki.vn", pw, UserRole.COMPANY, UserStatus.INACTIVE, true)); // công
                                                                                                                 // ty
                                                                                                                 // bị
                                                                                                                 // khoá
                list.add(u("zalo_hr", "hr@zalo.me", pw, UserRole.COMPANY, UserStatus.ACTIVE, true));
                list.add(u("shopee_vn", "hr.vn@shopee.com", pw, UserRole.COMPANY, UserStatus.ACTIVE, true));
                list.add(u("topcv_admin", "admin@topcv.vn", pw, UserRole.COMPANY, UserStatus.ACTIVE, false)); // chưa
                                                                                                              // verify
                list.add(u("axon_active", "hr@axonactive.com.vn", pw, UserRole.COMPANY, UserStatus.ACTIVE, true));

                List<Users> saved = userRepository.saveAll(list);
                log.info("Seeded {} Users.", saved.size());
                return saved;
        }

        // =========================================================
        // 5. USER PROFILES — 20 profiles cho 20 students
        // Test cases: university khác nhau, city, level, bio ngắn/dài/null
        // =========================================================
        private void seedUserProfiles(List<Users> allUsers) {
                if (userProfileRepository.count() > 0) {
                        log.info("UserProfiles đã tồn tại, bỏ qua.");
                        return;
                }

                List<Users> students = allUsers.stream()
                                .filter(u -> u.getRole() == UserRole.STUDENT)
                                .toList();

                String[] unis = {
                                "Đại học Bách Khoa Hà Nội", "Đại học Công nghệ TP.HCM",
                                "Đại học FPT", "Đại học Bách Khoa TP.HCM",
                                "Đại học Kinh tế Quốc dân", "Đại học Tôn Đức Thắng",
                                "Đại học Khoa học Tự nhiên HCM", "Đại học Duy Tân",
                                "Học viện Kỹ thuật Quân sự", "Đại học VNU Hà Nội",
                                "Đại học Đà Nẵng", "Đại học Cần Thơ",
                                "Đại học Sư phạm Kỹ thuật HCM", "Học viện Công nghệ BCVT",
                                "Đại học Lạc Hồng", "Đại học Công nghiệp HN",
                                "Đại học Thăng Long", "Đại học Dân lập Hải Phòng",
                                "Cao đẳng FPT Polytechnic", "Đại học Văn Lang"
                };
                String[] majors = {
                                "Công nghệ Thông tin", "Kỹ thuật Phần mềm",
                                "Hệ thống Thông tin", "Khoa học Máy tính",
                                "Mạng máy tính", "An toàn thông tin",
                                "Trí tuệ nhân tạo", "Kỹ thuật Điện tử",
                                "Kỹ thuật Máy tính", "Data Science"
                };
                String[] levels = { "FRESHER", "FRESHER", "JUNIOR", "JUNIOR", "JUNIOR", "MIDDLE", "MIDDLE", "SENIOR",
                                "INTERN",
                                "FRESHER" };
                String[] goals = {
                                "Backend Developer", "Frontend Developer", "Full Stack Developer",
                                "DevOps Engineer", "Data Engineer", "AI Engineer",
                                "Mobile Developer", "QA Engineer", "Security Engineer", "Software Architect"
                };
                String[] cities = { "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng",
                                "Bình Dương", "Đồng Nai", "Huế", "Nha Trang", "Vũng Tàu" };
                String[] bios = {
                                "Sinh viên năm 4 đam mê backend Java và Spring Boot. Đang tích cực tìm kiếm internship.",
                                "Thích thiết kế UI đẹp với React và Figma. Portfolio tại github.com/thib.",
                                "Đã có 6 tháng kinh nghiệm thực tập tại FPT Software, quen CI/CD và Git flow.",
                                null, // test bio null (edge case)
                                "Fresher Backend: Java, Spring Boot, MySQL. Muốn gia nhập team Agile chuyên nghiệp.",
                                "Đam mê AI và machine learning. Đang nghiên cứu LLM và RAG architecture.",
                                "4 năm kinh nghiệm Full Stack (React + Node.js). Đang muốn chuyển sang backend Java.",
                                "Tốt nghiệp loại Giỏi ngành KTPM. Có dự án cá nhân trên GitHub.",
                                "Mới bắt đầu học lập trình 6 tháng, đang làm quen HTML/CSS và JavaScript cơ bản.",
                                "DevOps enthusiast: Docker, Kubernetes, Terraform. Đang học AWS Solutions Architect.",
                                "Mobile developer: React Native và Flutter. Có app đã publish lên Google Play.",
                                "QA Engineer với 2 năm kinh nghiệm Selenium và Postman. Học thêm performance testing.",
                                "Security researcher: CTF player, OWASP Top 10, đang học CEH.",
                                "Data engineer: Python, Spark, Airflow. Đang hoàn thiện dự án data pipeline cá nhân.",
                                "Tốt nghiệp Đại học Cần Thơ, 1 năm kinh nghiệm PHP/Laravel. Muốn chuyển sang Java.",
                                "Sinh viên năm 3 trường FPT. Đã hoàn thành khóa học React tại Udemy với 4.8/5 rating.",
                                "Intern tại Axon Active 3 tháng về QA automation. Quen với TestNG và Maven.",
                                "Chuyên về DevSecOps: tích hợp security vào CI/CD pipeline.",
                                "Đam mê Cloud: AWS Certified Cloud Practitioner. Đang học AWS Developer Associate.",
                                "Fresher với kiến thức tốt về thuật toán và cấu trúc dữ liệu. LeetCode 200+ bài."
                };

                List<UserProfile> profiles = new ArrayList<>();
                for (int i = 0; i < students.size(); i++) {
                        profiles.add(UserProfile.builder()
                                        .users(students.get(i))
                                        .fullName(fullName(students.get(i).getUsername()))
                                        .dateOfBirth(LocalDate.of(1999 + (i % 5), (i % 12) + 1, (i % 28) + 1))
                                        .university(unis[i % unis.length])
                                        .major(majors[i % majors.length])
                                        .currentLevel(levels[i % levels.length])
                                        .careerGoal(goals[i % goals.length])
                                        .bio(bios[i % bios.length])
                                        .city(cities[i % cities.length])
                                        .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed="
                                                        + students.get(i).getUsername())
                                        .build());
                }

                userProfileRepository.saveAll(profiles);
                log.info("Seeded {} UserProfiles.", profiles.size());
        }

        // =========================================================
        // 6. ROADMAPS — 10 roadmaps, mỗi roadmap 3 nodes = 30 nodes tổng
        // Test cases: level BEGINNER/INTERMEDIATE/ADVANCED, careerRole đa dạng
        // =========================================================
        private void seedRoadmaps(List<CareerRole> roles, List<Skill> skills) {
                if (roadmapRepository.count() > 0) {
                        log.info("Roadmaps đã tồn tại, bỏ qua.");
                        return;
                }

                CareerRole backend = findRole(roles, "BACKEND");
                CareerRole frontend = findRole(roles, "FRONTEND");
                CareerRole fullstack = findRole(roles, "FULLSTACK");
                CareerRole devops = findRole(roles, "DEVOPS");
                CareerRole data = findRole(roles, "DATA");
                CareerRole ai = findRole(roles, "AI");
                CareerRole mobile = findRole(roles, "MOBILE");
                CareerRole qa = findRole(roles, "QA");
                CareerRole security = findRole(roles, "SECURITY");
                CareerRole arch = findRole(roles, "ARCHITECT");

                Object[][] roadmapData = {
                                // {title, description, level, careerRole, node1title, node2title, node3title}
                                { "Java Backend Developer",
                                                "Lộ trình học Java backend từ cơ bản đến thực chiến với Spring Boot, MySQL.",
                                                "BEGINNER", backend,
                                                "Nền tảng Java (OOP, Collections, Exception)",
                                                "Spring Boot & REST API (JPA, Security, JWT)",
                                                "Triển khai thực tế (Docker, CI/CD, VPS)" },

                                { "React Frontend Developer",
                                                "Xây dựng SPA chuyên nghiệp với React, TypeScript và state management.",
                                                "BEGINNER", frontend,
                                                "HTML/CSS & JavaScript ES6+",
                                                "React Hooks, Router, Context API",
                                                "Tối ưu và Deploy (Vite, Vercel, CI/CD)" },

                                { "Full Stack JavaScript",
                                                "Node.js backend + React frontend: xây dựng ứng dụng web end-to-end.",
                                                "INTERMEDIATE", fullstack,
                                                "Node.js & Express REST API",
                                                "React + Redux Toolkit, Axios",
                                                "MongoDB Atlas, JWT Auth, Deploy Heroku" },

                                { "DevOps & Cloud AWS",
                                                "Hạ tầng cloud, container hóa và CI/CD pipeline chuyên nghiệp.",
                                                "INTERMEDIATE", devops,
                                                "Linux, Bash scripting, Git workflow",
                                                "Docker, Docker Compose, Kubernetes cơ bản",
                                                "AWS EC2/S3/RDS, Terraform, GitHub Actions CI/CD" },

                                { "Data Engineering with Python",
                                                "Xây dựng data pipeline, ETL và data warehouse với Python và SQL.",
                                                "INTERMEDIATE", data,
                                                "Python nâng cao & SQL truy vấn phức tạp",
                                                "Apache Spark, Airflow, Kafka cơ bản",
                                                "Data Warehouse (Redshift/BigQuery), Visualization" },

                                { "AI & Machine Learning",
                                                "Từ toán học cơ bản đến xây dựng và deploy mô hình ML/DL.",
                                                "ADVANCED", ai,
                                                "Toán: Linear Algebra, Statistics, Calculus",
                                                "Python ML: Sklearn, Pandas, Feature Engineering",
                                                "Deep Learning (PyTorch), NLP, MLOps & Deploy" },

                                { "Mobile Development - React Native",
                                                "Xây dựng ứng dụng iOS và Android với React Native và Expo.",
                                                "BEGINNER", mobile,
                                                "JavaScript/TypeScript & React cơ bản",
                                                "React Native Components, Navigation, State",
                                                "Native APIs, Push Notification, App Store Deploy" },

                                { "QA Automation Engineer",
                                                "Kiểm thử phần mềm tự động với Selenium, Cypress và API testing.",
                                                "BEGINNER", qa,
                                                "Testing fundamentals: manual, test case, bug report",
                                                "Selenium WebDriver, TestNG, Maven",
                                                "API Testing (Postman/RestAssured), CI Integration" },

                                { "Cybersecurity & Pen Testing",
                                                "Bảo mật ứng dụng web: OWASP, pen testing, vulnerability assessment.",
                                                "ADVANCED", security,
                                                "Mạng máy tính, Linux security, Cryptography",
                                                "OWASP Top 10, Burp Suite, SQL Injection, XSS",
                                                "Penetration Testing, CTF, Report writing, CEH prep" },

                                { "Software Architecture",
                                                "Thiết kế hệ thống lớn: microservices, event-driven, distributed systems.",
                                                "ADVANCED", arch,
                                                "SOLID, Design Patterns, Clean Architecture",
                                                "Microservices, REST vs GraphQL vs gRPC, Message Queue",
                                                "System Design Interview: scalability, availability, CAP theorem" }
                };

                int nodeCount = 0;
                for (Object[] rd : roadmapData) {
                        Roadmap roadmap = roadmapRepository.save(
                                        Roadmap.builder()
                                                        .title((String) rd[0])
                                                        .description((String) rd[1])
                                                        .level((String) rd[2])
                                                        .careerRole((CareerRole) rd[3])
                                                        .build());
                        roadmapNodeRepository.saveAll(List.of(
                                        node((String) rd[4],
                                                        "Nền tảng kiến thức bắt buộc trước khi tiến lên bước tiếp theo.",
                                                        "TOPIC", 1,
                                                        roadmap),
                                        node((String) rd[5],
                                                        "Công nghệ cốt lõi và thực hành hands-on qua các mini project.",
                                                        "TOPIC", 2,
                                                        roadmap),
                                        node((String) rd[6],
                                                        "Milestone thực chiến, xây dựng portfolio project hoàn chỉnh.",
                                                        "PROJECT", 3,
                                                        roadmap)));
                        nodeCount += 3;
                }
                log.info("Seeded 10 Roadmaps với {} Nodes.", nodeCount);
        }

        // =========================================================
        // 7. JOB POSTINGS — 30 jobs
        // Test cases: mọi JobType, mọi JobLevel, salary null, TP khác nhau
        // =========================================================
        private void seedJobPostings(JobSource src, List<Skill> skills) {
                if (jobPostingRepository.count() > 0) {
                        log.info("JobPostings đã tồn tại, bỏ qua.");
                        return;
                }

                // Helper để lấy skill
                Skill java = sk(skills, "Java");
                Skill spring = sk(skills, "Spring Boot");
                Skill react = sk(skills, "React");
                Skill js = sk(skills, "JavaScript");
                Skill ts = sk(skills, "TypeScript");
                Skill python = sk(skills, "Python");
                Skill nodejs = sk(skills, "Node.js");
                Skill sql = sk(skills, "SQL");
                Skill docker = sk(skills, "Docker");
                Skill k8s = sk(skills, "Kubernetes");
                Skill aws = sk(skills, "AWS");
                Skill git = sk(skills, "Git");
                Skill cicd = sk(skills, "CI/CD");
                Skill vue = sk(skills, "Vue.js");
                Skill go = sk(skills, "Go");
                Skill csharp = sk(skills, "C#");
                Skill php = sk(skills, "PHP");
                Skill mongo = sk(skills, "MongoDB");
                Skill redis = sk(skills, "Redis");
                Skill linux = sk(skills, "Linux");
                Skill nextjs = sk(skills, "Next.js");
                Skill angular = sk(skills, "Angular");
                Skill kotlin = sk(skills, "Kotlin");

                List<JobPosting> jobs = new ArrayList<>();

                // ---- FULL_TIME JOBS ----
                jobs.add(jobWithSkills("Java Backend Developer", "FPT Software", "Hà Nội", 20_000_000d, 35_000_000d,
                                "20-35 triệu",
                                "Phát triển và bảo trì hệ thống ERP quy mô lớn. Bạn sẽ tham gia vào các dự án trọng điểm sử dụng kiến trúc Microservices.\n\n"
                                                +
                                                "**Responsibilities:**\n" +
                                                "- Xây dựng các tính năng mới bằng Java 11/17 và Spring Boot\n" +
                                                "- Tối ưu hóa hiệu năng, xử lý hàng triệu request\n" +
                                                "- Viết Unit Test và Integration Test\n\n" +
                                                "**Requirements:**\n" +
                                                "- Ít nhất 2 năm kinh nghiệm Java Backend\n" +
                                                "- Hiểu biết sâu về OOP, Design Patterns và SQL/NoSQL\n" +
                                                "- Có kinh nghiệm làm việc với Redis, Kafka là điểm cộng lớn",
                                "https://itviec.com/fpt-java-backend", JobType.FULL_TIME, JobLevel.JUNIOR, src, java,
                                spring, sql,
                                redis, git));

                jobs.add(jobWithSkills("Senior Java Engineer", "NamiTech Vietnam", "Hà Nội", 40_000_000d, 65_000_000d,
                                "40-65 triệu",
                                "Lead backend team, thiết kế kiến trúc hệ thống phục vụ Data Streaming và Real-time analytics.\n\n"
                                                +
                                                "**Mô tả công việc:**\n" +
                                                "- Định hướng kiến trúc và setup base project cho team\n" +
                                                "- Review code và training cho các bạn Junior/Middle\n" +
                                                "- Phân tích xử lý sự cố hệ thống Production (troubleshooting)\n\n" +
                                                "**Yêu cầu:**\n" +
                                                "- 4+ năm kinh nghiệm trong hệ sinh thái Java/Spring Boot\n" +
                                                "- Khả năng tuning Database, cache, concurrency tốt\n" +
                                                "- Tiếng Anh giao tiếp hoặc đọc hiểu tài liệu tốt",
                                "https://itviec.com/namitech-senior-java", JobType.FULL_TIME, JobLevel.SENIOR, src,
                                java, spring, sql,
                                docker, k8s, linux));

                jobs.add(
                                jobWithSkills("React Frontend Developer", "Topica Edtech", "Hồ Chí Minh", 15_000_000d,
                                                25_000_000d,
                                                "15-25 triệu",
                                                "Xây dựng LMS platform thế hệ mới với độ phản hồi cực nhanh, tương tác thời gian thực.\n\n"
                                                                +
                                                                "**Responsibilities:**\n" +
                                                                "- Phát triển UI components tái sử dụng\n" +
                                                                "- Tích hợp RESTful API / GraphQL từ hệ thống Backend\n"
                                                                +
                                                                "- Phối hợp UI/UX designer để mang lại trải nghiệm tốt nhất\n\n"
                                                                +
                                                                "**Requirements:**\n" +
                                                                "- Nắm vững React 18, Hooks, Redux Toolkit\n" +
                                                                "- Có nền tảng vững về JavaScript ES6+ và TypeScript\n"
                                                                +
                                                                "- Ưu tiên sinh viên các trường IT hoặc vừa ra trường có DA tốt",
                                                "https://itviec.com/topica-react", JobType.FULL_TIME, JobLevel.JUNIOR,
                                                src, react, js, ts,
                                                nextjs));

                jobs.add(job("Senior React Developer", "Axon Active", "Đà Nẵng", 35_000_000d, 55_000_000d,
                                "35-55 triệu",
                                "Phát triển ứng dụng React lớn cho khách hàng Úc. Yêu cầu TypeScript, unit test, code review.",
                                "https://itviec.com/axon-senior-react", JobType.FULL_TIME, JobLevel.SENIOR, src));

                jobs.add(job("Python Data Engineer", "VNG Corporation", "Hồ Chí Minh", 25_000_000d, 45_000_000d,
                                "25-45 triệu",
                                "Xây dựng data pipeline với Python, Spark, Airflow. Xử lý hàng triệu sự kiện mỗi ngày.",
                                "https://itviec.com/vng-python-data", JobType.FULL_TIME, JobLevel.MIDDLE, src));

                jobs.add(job("DevOps Engineer", "MoMo E-wallet", "Hồ Chí Minh", 30_000_000d, 50_000_000d, "30-50 triệu",
                                "Quản lý Kubernetes cluster, thiết lập CI/CD trên GitLab, monitoring với Grafana/Prometheus.",
                                "https://itviec.com/momo-devops", JobType.FULL_TIME, JobLevel.MIDDLE, src));

                jobs.add(job("Node.js Backend Developer", "Shopee Việt Nam", "Hồ Chí Minh", 22_000_000d, 38_000_000d,
                                "22-38 triệu",
                                "Phát triển microservices Node.js, MongoDB, Redis cho e-commerce platform hàng chục triệu users.",
                                "https://itviec.com/shopee-nodejs", JobType.FULL_TIME, JobLevel.MIDDLE, src));

                jobs.add(job("Go Backend Engineer", "Tiki", "Hồ Chí Minh", 35_000_000d, 60_000_000d, "35-60 triệu",
                                "Xây dựng và scale distributed systems với Golang, Kafka, Redis. Hệ thống xử lý 100k req/s.",
                                "https://itviec.com/tiki-golang", JobType.FULL_TIME, JobLevel.SENIOR, src));

                jobs.add(job("Vue.js Frontend Developer", "KMS Technology", "Hồ Chí Minh", 18_000_000d, 32_000_000d,
                                "18-32 triệu",
                                "Phát triển dashboard quản lý với Vue 3, Pinia, Vite. Tích hợp Chart.js và REST API.",
                                "https://itviec.com/kms-vuejs", JobType.FULL_TIME, JobLevel.JUNIOR, src));

                jobs.add(job("Full Stack Developer (React+Java)", "Nashtech Global", "Hà Nội", 25_000_000d, 42_000_000d,
                                "25-42 triệu",
                                "Full stack developer làm việc với React frontend và Spring Boot backend cho khách hàng UK.",
                                "https://itviec.com/nashtech-fullstack", JobType.FULL_TIME, JobLevel.MIDDLE, src));

                jobs.add(job("C# .NET Developer", "Harvey Nash Vietnam", "Hà Nội", 20_000_000d, 35_000_000d,
                                "20-35 triệu",
                                "Phát triển ứng dụng doanh nghiệp với C# .NET 7, Entity Framework, SQL Server.",
                                "https://itviec.com/harvey-csharp", JobType.FULL_TIME, JobLevel.JUNIOR, src));

                jobs.add(job("PHP Laravel Developer", "Sendo", "Hà Nội", 12_000_000d, 22_000_000d, "12-22 triệu",
                                "Backend PHP/Laravel cho platform thương mại điện tử. Kinh nghiệm MySQL, Redis là lợi thế.",
                                "https://itviec.com/sendo-php", JobType.FULL_TIME, JobLevel.FRESHER, src));

                jobs.add(job("Angular Developer", "Orient Software", "Hồ Chí Minh", 20_000_000d, 35_000_000d,
                                "20-35 triệu",
                                "Xây dựng CRM web application với Angular 16, NgRx, TypeScript cho khách hàng Nhật Bản.",
                                "https://itviec.com/orient-angular", JobType.FULL_TIME, JobLevel.JUNIOR, src));

                jobs.add(job("Next.js SSR Developer", "Zalo Pay", "Hồ Chí Minh", 28_000_000d, 48_000_000d,
                                "28-48 triệu",
                                "Xây dựng landing page và campaign page với Next.js, SEO optimization, Core Web Vitals.",
                                "https://itviec.com/zalopay-nextjs", JobType.FULL_TIME, JobLevel.MIDDLE, src));

                jobs.add(job("Android Developer (Kotlin)", "VinID", "Hà Nội", 22_000_000d, 40_000_000d, "22-40 triệu",
                                "Phát triển ứng dụng Android native với Kotlin, Jetpack Compose, Room Database.",
                                "https://itviec.com/vinid-android", JobType.FULL_TIME, JobLevel.JUNIOR, src));

                jobs.add(job("Staff Software Engineer", "Grab Vietnam", "Hồ Chí Minh", 70_000_000d, 120_000_000d,
                                "70-120 triệu",
                                "Lead architect cho nền tảng fintech ASEAN. Yêu cầu 7+ năm, system design, distributed systems.",
                                "https://itviec.com/grab-staff-engineer", JobType.FULL_TIME, JobLevel.STAFF, src));

                jobs.add(job("Software Architect", "Masan Tech", "Hà Nội", null, null, "Thương lượng",
                                "Thiết kế kiến trúc hệ thống ERP cho tập đoàn 30.000 nhân viên. Không yêu cầu kinh nghiệm vendor cụ thể.",
                                "https://itviec.com/masan-architect", JobType.FULL_TIME, JobLevel.LEADER, src));

                // ---- PART_TIME JOBS ----
                jobs.add(job("React Developer (Part-time)", "Startup ABC", "Hà Nội", 8_000_000d, 15_000_000d,
                                "8-15 triệu",
                                "Làm bán thời gian 4h/ngày. Phát triển admin dashboard với React, Ant Design.",
                                "https://itviec.com/startup-abc-parttime", JobType.PART_TIME, JobLevel.JUNIOR, src));

                jobs.add(job("Backend Python (Part-time)", "Freelancer.vn", "Remote", 6_000_000d, 12_000_000d,
                                "6-12 triệu",
                                "Xây dựng chatbot tích hợp API GPT-4 với Python FastAPI. 3h/ngày, làm online.",
                                "https://itviec.com/freelancer-python-pt", JobType.PART_TIME, JobLevel.FRESHER, src));

                jobs.add(job("WordPress Developer (Freelance)", "Agency Design", "Remote", 5_000_000d, 10_000_000d,
                                "5-10 triệu/dự án",
                                "Thiết kế website WordPress theo template khách hàng. Kỹ năng HTML/CSS, PHP cơ bản.",
                                "https://itviec.com/agency-wp", JobType.FREELANCE, JobLevel.FRESHER, src));

                // ---- INTERNSHIP JOBS ----
                jobs.add(job("Java Backend Intern", "FPT Software", "Hà Nội", 2_000_000d, 5_000_000d, "2-5 triệu",
                                "Thực tập sinh Java tại FPT Software. Được mentor bởi senior engineer, tham gia dự án thực tế.",
                                "https://itviec.com/fpt-intern-java", JobType.INTERNSHIP, JobLevel.FRESHER, src));

                jobs.add(job("React Frontend Intern", "Base.vn", "Hà Nội", 3_000_000d, 5_000_000d, "3-5 triệu",
                                "Thực tập Frontend với React/Next.js. Cơ hội convert full-time sau thực tập.",
                                "https://itviec.com/base-intern-react", JobType.INTERNSHIP, JobLevel.FRESHER, src));

                jobs.add(job("QA Intern", "Axon Active", "Đà Nẵng", 2_500_000d, 4_000_000d, "2.5-4 triệu",
                                "Học manual testing, viết test case, báo cáo bug. Sau 3 tháng được đào tạo automation.",
                                "https://itviec.com/axon-qa-intern", JobType.INTERNSHIP, JobLevel.FRESHER, src));

                jobs.add(job("Data Analyst Intern", "VNG Corporation", "Hồ Chí Minh", 3_000_000d, 6_000_000d,
                                "3-6 triệu",
                                "Phân tích dữ liệu người dùng với Python, SQL, Tableau. Hỗ trợ team product.",
                                "https://itviec.com/vng-data-intern", JobType.INTERNSHIP, JobLevel.FRESHER, src));

                jobs.add(job("DevOps Intern", "KMS Technology", "Hồ Chí Minh", 2_000_000d, 4_000_000d, "2-4 triệu",
                                "Học Docker, CI/CD pipeline, cấu hình Linux server. Môi trường agile chuyên nghiệp.",
                                "https://itviec.com/kms-devops-intern", JobType.INTERNSHIP, JobLevel.FRESHER, src));

                // ---- CONTRACT / FREELANCE JOBS ----
                jobs.add(job("Full Stack Developer (Contract)", "Client Singapore", "Remote", 50_000_000d, 80_000_000d,
                                "50-80 triệu",
                                "Hợp đồng 6 tháng. Xây dựng B2B SaaS platform với React + Java Spring Boot. 100% remote.",
                                "https://itviec.com/contract-sg-fullstack", JobType.CONTRACT, JobLevel.SENIOR, src));

                jobs.add(job("Solution Architect (Contract)", "Bank BIDV", "Hà Nội", null, null, "Thương lượng",
                                "Hợp đồng tư vấn kiến trúc hệ thống core banking migration. Duration: 12 tháng.",
                                "https://itviec.com/bidv-architect-contract", JobType.CONTRACT, JobLevel.LEADER, src));

                jobs.add(job("API Integration Freelance", "Startup XYZ", "Remote", 8_000_000d, 20_000_000d,
                                "8-20 triệu/tháng",
                                "Kết nối và tích hợp các third-party API (payment, shipping, ERP). Làm remote, flexible time.",
                                "https://itviec.com/xyz-api-freelance", JobType.FREELANCE, JobLevel.MIDDLE, src));

                jobs.add(job("Tech Lead (Hà Nội)", "ViettelPay", "Hà Nội", 55_000_000d, 90_000_000d, "55-90 triệu",
                                "Lead team 8 người, định hướng kỹ thuật, review PR, pair programming với developers.",
                                "https://itviec.com/viettelpay-techlead", JobType.FULL_TIME, JobLevel.LEADER, src));

                jobs.add(job("Inspector / Inspector-level QA", "Harvey Nash Vietnam", "Hà Nội", 60_000_000d,
                                100_000_000d,
                                "60-100 triệu",
                                "QA Manager, xây dựng quy trình chất lượng, đào tạo team QA 10 người.",
                                "https://itviec.com/harveynash-qa-inspector", JobType.FULL_TIME, JobLevel.INSPECTOR,
                                src));

                List<JobPosting> saved = jobPostingRepository.saveAll(jobs);
                log.info("Seeded {} JobPostings.", saved.size());
        }

        // =========================================================
        // BUILDER HELPERS
        // =========================================================

        private Skill s(String name, String desc) {
                return Skill.builder().name(name).description(desc).build();
        }

        private CareerRole cr(String code, String name, String desc) {
                return CareerRole.builder().code(code).name(name).description(desc).build();
        }

        private Users u(String username, String email, String pw, UserRole role, UserStatus status, boolean verified) {
                return Users.builder()
                                .username(username).email(email).password(pw)
                                .role(role).status(status).emailVerified(verified)
                                .build();
        }

        private RoadmapNode node(String title, String desc, String type, int order, Roadmap roadmap) {
                return RoadmapNode.builder()
                                .title(title).description(desc)
                                .nodeType(type).orderIndex(order)
                                .roadmap(roadmap).build();
        }

        private JobPosting job(String title, String company, String location,
                        Double salMin, Double salMax, String salText,
                        String description, String url,
                        JobType type, JobLevel level, JobSource src) {
                return JobPosting.builder()
                                .externalJobId(extId(title, company))
                                .title(title).companyName(company).location(location)
                                .salaryMin(salMin).salaryMax(salMax).salaryText(salText)
                                .description(description).jobUrl(url)
                                .jobType(type).jobLevel(level)
                                .postedAt(LocalDateTime.now().minusDays((long) (Math.random() * 60)))
                                .jobSource(src)
                                .build();
        }

        private JobPosting jobWithSkills(String title, String company, String location,
                        Double salMin, Double salMax, String salText,
                        String description, String url,
                        JobType type, JobLevel level, JobSource src, Skill... requiredSkills) {
                JobPosting jp = job(title, company, location, salMin, salMax, salText, description, url, type, level,
                                src);
                if (requiredSkills != null && requiredSkills.length > 0) {
                        List<JobSkill> jobSkills = new ArrayList<>();
                        for (Skill s : requiredSkills) {
                                jobSkills.add(JobSkill.builder().jobPosting(jp).skill(s).build());
                        }
                        jp.setJobSkills(jobSkills);
                }
                return jp;
        }

        private CareerRole findRole(List<CareerRole> roles, String code) {
                return roles.stream().filter(r -> code.equals(r.getCode())).findFirst().orElse(roles.get(0));
        }

        private Skill sk(List<Skill> skills, String name) {
                return skills.stream().filter(s -> name.equals(s.getName())).findFirst().orElse(skills.get(0));
        }

        private String extId(String title, String company) {
                String raw = (title + "-" + company).toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
                return raw.substring(0, Math.min(50, raw.length()));
        }

        private String fullName(String username) {
                // Chuyển "nguyen_van_a" → "Nguyen Van A"
                String[] parts = username.split("_");
                StringBuilder sb = new StringBuilder();
                for (String p : parts) {
                        if (!p.isEmpty())
                                sb.append(Character.toUpperCase(p.charAt(0))).append(p.substring(1)).append(" ");
                }
                return sb.toString().trim();
        }
}
