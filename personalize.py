import os
import re

greetings = {
    "Day1.jsx": "Alright {Name}, let's begin.",
    "Day2.jsx": "Let's find your leaks, {Name}.",
    "Day3.jsx": "Time to go deep, {Name}.",
    "Day4.jsx": "Let's level up, {Name}.",
    "Day5.jsx": "Build your walls, {Name}.",
    "Day6.jsx": "Reclaim your mind, {Name}.",
    "Day7.jsx": "Your legacy system, {Name}."
}

for i in range(1, 8):
    filename = f"webapp/src/pages/Day{i}.jsx"
    if not os.path.exists(filename): continue
    
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Inject the Name variable logic just above the return statement
    if "const Name =" not in content:
        name_logic = """
  const userStr = data.user_name ? data.user_name.trim().split(' ')[0] : '';
  const Name = userStr ? userStr.charAt(0).toUpperCase() + userStr.slice(1) : '';

  return ("""
        content = re.sub(r'(\s+)return\s+\(', name_logic, content, count=1)
    
    # 2. Replace the static "Day X OF 7" with dynamic greeting
    day_str = f"Day {i} OF 7"
    greeting = greetings[f"Day{i}.jsx"]
    
    # Need to find the exact line
    # Sometimes it's hardcoded as Day X OF 7
    if day_str in content:
        replace_with = f"{{Name ? `{greeting}` : \"{day_str}\"}}"
        content = content.replace(day_str, replace_with)
        
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Updated {filename}")
