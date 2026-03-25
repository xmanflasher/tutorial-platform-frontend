import subprocess
import codecs
import re

print("Installing yt-dlp...")
subprocess.run(["python", "-m", "pip", "install", "yt-dlp"], check=True)

print("Fetching playlist IDs...")
cmd = ['python', '-m', 'yt_dlp', '--flat-playlist', '--print', 'id', 'https://www.youtube.com/playlist?list=PLmOn9nNkQxJFubqN777c_nScnJ4dpEYMT']
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
ids = [x.strip() for x in res.stdout.split('\n') if x.strip()][:140]

if len(ids) == 0:
    print("Error: No IDs found!")
    exit(1)

print(f"Fetched {len(ids)} IDs. First ID is {ids[0]}")

sql_file = r'd:\project\waterballsa\tutorial-platform-backend\docs\course\import_javascript_140.sql'

sql_values = []
for i, vid in enumerate(ids):
    lesson_id = 1001 + i
    url = f"https://youtu.be/{vid}"
    sql_values.append(f"('VIDEO', 'YOUTUBE', '{url}', 0, {lesson_id})")

sql_inserts = "INSERT INTO lesson_contents (content_type, video_provider, url, sort_order, lesson_id) VALUES\n" + ",\n".join(sql_values) + ";"

print("Reading SQL file...")
with codecs.open(sql_file, 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Replace the entire INSERT statement block up to -- 5. Create Gyms
old_insert_pattern = r'INSERT INTO lesson_contents \(content_type, video_provider, url, sort_order, lesson_id\).*?(?=-- 5\. Create Gyms)'
new_sql_content = re.sub(old_insert_pattern, sql_inserts + '\n\n', sql_content, flags=re.DOTALL)

with codecs.open(sql_file, 'w', encoding='utf-8') as f:
    f.write(new_sql_content)

print(f"Updated {len(ids)} links in SQL without encoding issues.")
