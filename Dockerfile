# ใช้ image ของ nginx รุ่นที่เป็นแบบเบา (alpine)
FROM nginx:alpine

# คัดลอกไฟล์ index.html ของเราเข้าไปในที่เก็บไฟล์ของ nginx
COPY . /usr/share/nginx/html