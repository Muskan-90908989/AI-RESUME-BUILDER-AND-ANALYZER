import urllib.request
import re

url = 'https://ai-resume-builder-and-analyzer-two.vercel.app/assets/index-B2-8g6ZB.js'
print(f"Fetching {url}")
try:
    with urllib.request.urlopen(url) as response:
        js = response.read().decode('utf-8')
        local_matches = re.findall(r'http://127\.0\.0\.1:8000', js)
        print(f"Found {len(local_matches)} hardcoded localhost references.")
        
        onrender_matches = re.findall(r'https://[^\"\'\`]*onrender\.com', js)
        if len(onrender_matches) > 0:
            print(f"Found Render URL: {onrender_matches}")
        else:
            print("Did not find any hardcoded Render URLs.")
except Exception as e:
    print(f"Error fetching URL: {e}")
