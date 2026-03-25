import re

sql_file = r"d:\project\waterballsa\tutorial-platform-backend\docs\course\import_javascript_140.sql"

chapter_gym_map = {
    60: 601,
    61: 602,
    62: 603,
    63: 604,
    64: 605,
    65: 606
}

with open(sql_file, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure we haven't patched it already
if "gym_id" not in content.split("INSERT INTO lessons")[1].split("VALUES")[0]:
    # Update column names
    content = content.replace(
        "INSERT INTO lessons (id, original_id, chapter_id, journey_id, name, type, display_order, visible, premium_only, is_core_lesson) VALUES",
        "INSERT INTO lessons (id, original_id, chapter_id, journey_id, name, type, display_order, visible, premium_only, is_core_lesson, gym_id) VALUES"
    )

    # Find the insert block
    start_str = "INSERT INTO lessons (id, original_id, chapter_id, journey_id, name, type, display_order, visible, premium_only, is_core_lesson, gym_id) VALUES"
    start_idx = content.find(start_str)
    
    if start_idx != -1:
        end_idx = content.find(";", start_idx)
        block = content[start_idx + len(start_str):end_idx]
        
        new_lines = []
        for line in block.split("\n"):
            # Check if it's a value tuple line like "  (1001, 1001, 60, ..."
            m = re.search(r'^\s*\(\d+,\s*\d+,\s*(\d+),', line)
            if m:
                chapter_id = int(m.group(1))
                gym_id = chapter_gym_map.get(chapter_id, "NULL")
                
                # We need to add gym_id inside the right parenthesis
                if line.endswith("),"):
                    line = line[:-2] + f", {gym_id}),"
                elif line.endswith(")"):
                    line = line[:-1] + f", {gym_id})"
                    
            new_lines.append(line)
            
        new_block = "\n".join(new_lines)
        content = content[:start_idx + len(start_str)] + new_block + content[end_idx:]

        with open(sql_file, "w", encoding="utf-8") as f:
            f.write(content)
        print("SQL patched successfully.")
    else:
        print("Could not find INSERT INTO lessons block.")
else:
    print("Already patched.")
