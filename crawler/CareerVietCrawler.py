import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime
import time
from flask import Flask, jsonify

app = Flask(__name__)

BASE_LIST_URL = "https://careerviet.vn/viec-lam/cntt-phan-mem-c1-vi.html"
BASE_DOMAIN = "https://careerviet.vn"

SPRING_API = "http://localhost:8080/api/it-path/jobs/import"

headers = {
    "User-Agent": "Mozilla/5.0"
}

def detect_job_level(title):
    if not title:
        return "STAFF"
    t = title.lower()

    if "intern" in t or "thực tập" in t:
        return "FRESHER"
    if "junior" in t:
        return "JUNIOR"
    if "middle" in t:
        return "MIDDLE"
    if "senior" in t:
        return "SENIOR"
    if "trưởng phòng" in t or "manager" in t or "leader" in t or "head" in t:
        return "LEADER"
    if "giám sát" in t or "supervisor" in t or "inspector" in t:
        return "INSPECTOR"

    return "STAFF"

def detect_job_type(title):
    if not title:
        return "FULL_TIME"
    t = title.lower()

    if "part-time" in t or "bán thời gian" in t:
        return "PART_TIME"
    if "full-time" in t or "toàn thời gian" in t:
        return "FULL_TIME"
    if "freelance" in t or "tự do" in t:
        return "FREELANCE"
    if "intern" in t or "thực tập" in t:
        return "INTERNSHIP"
    if "Nhân viên chính thức" in t or "contract" in t:
        return "CONTRACT"

    return "FULL_TIME"

def extract_external_id(url):
    match = re.search(r"\.([A-Z0-9]+)\.html", url)
    return match.group(1) if match else None



def get_job_links():
    response = requests.get(BASE_LIST_URL, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    links = []

    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "/vi/tim-viec-lam/" in href:
            full_link = BASE_DOMAIN + href if href.startswith("/") else href
            if full_link not in links:
                links.append(full_link)

    return links


def parse_salary(text):
    if not text:
        return None, None

    text = text.strip()

    if "Cạnh tranh" in text or "Thỏa thuận" in text:
        return None, None

    numbers = re.findall(r"\d+", text.replace(".", ""))

    if len(numbers) >= 2:
        return float(numbers[0]), float(numbers[1])
    elif len(numbers) == 1:
        return float(numbers[0]), None

    return None, None


def extract_full_description(soup):
    description_parts = []

    for block in soup.select("div.detail-row"):
        text = block.get_text(separator="\n", strip=True)
        if text:
            description_parts.append(text)

    return "\n\n".join(description_parts)


def parse_job_detail(url):
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    title_tag = soup.select_one("h1")
    title = title_tag.text.strip() if title_tag else None

    company_tag = soup.select_one("a.job-company-name")
    company = company_tag.text.strip() if company_tag else None

    location_tag = soup.select_one("div.map p a")
    location = location_tag.text.strip() if location_tag else None

    salary_text = None
    salary_icon = soup.select_one(".fa-usd")

    if salary_icon:
        parent_li = salary_icon.find_parent("li")
        if parent_li:
            salary_p = parent_li.find("p")
            if salary_p:
                salary_text = salary_p.text.strip()

    salary_min, salary_max = parse_salary(salary_text)

    description = extract_full_description(soup)
    external_job_id = extract_external_id(url)
    jobLevel = detect_job_level(title)
    jobType = detect_job_type(title)

    return {
        "externalJobId": external_job_id,
        "title": title,
        "companyName": company,
        "location": location,
        "salaryMin": salary_min,
        "salaryMax": salary_max,
        "salaryText": salary_text,
        "description": description,
        "jobUrl": url,
        "jobType": jobType,
        "jobLevel": jobLevel,
        "postedAt": datetime.now().isoformat()
    }


def crawl_jobs(limit=10):
    job_links = get_job_links()
    jobs = []

    for link in job_links[:limit]:
        try:
            job = parse_job_detail(link)
            jobs.append(job)
            time.sleep(1)
        except Exception as e:
            print("Error:", e)

    return jobs


# =========================
# API Endpoint
# =========================
@app.route("/crawl", methods=["GET"])
def crawl_api():
    jobs = crawl_jobs(limit=5)

    return jsonify(jobs)

if __name__ == "__main__":
    app.run(port=5000)
