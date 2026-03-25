import re

with open(r"d:\project\waterballsa\tutorial-platform-backend\docs\course\import_javascript_140.sql", "r", encoding="utf-8") as f:
    t = f.read()

# Split points
p1 = "-- 3. Create Lessons"
p2 = "-- 4. Content mapping (Video URLs)"
p3 = "-- 5. Create Gyms (ids: 601-615)"
p4 = "-- 6. Create Challenges (Missions) (ids: 601-615)"
p5 = "-- 7. Create Missions (ids: 6001-6006)"

if p1 in t and p3 in t and t.find(p1) < t.find(p3):
    # Split text into segments
    pre = t[:t.find(p1)]
    
    # 3+4
    b34 = t[t.find(p1):t.find(p3)]
    
    # 5+6
    b56 = t[t.find(p3):t.find(p5)]
    
    # post
    post = t[t.find(p5):]
    
    # New order: pre, 5+6, 3+4, post
    new_text = pre + b56 + b34 + post
    
    with open(r"d:\project\waterballsa\tutorial-platform-backend\docs\course\import_javascript_140.sql", "w", encoding="utf-8") as f:
        f.write(new_text)
    print("Reordered!")
else:
    print("Not found or already reordered")
