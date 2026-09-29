import os
import shutil
import re

proj_root = r'C:\Users\acer\Downloads\ai resume builder\AI-Resume-Analyzer'
backend_app = os.path.join(proj_root, 'backend', 'app')
frontend_dir = os.path.join(proj_root, 'frontend')
api_dir = os.path.join(frontend_dir, 'api')

print(f"Migrating backend to {api_dir}")

# 1. Copy backend/app to frontend/api
if os.path.exists(api_dir):
    shutil.rmtree(api_dir)
shutil.copytree(backend_app, api_dir)

# 2. Rename main.py to index.py
os.rename(os.path.join(api_dir, 'main.py'), os.path.join(api_dir, 'index.py'))

# 3. Copy requirements.txt
shutil.copy2(os.path.join(proj_root, 'backend', 'requirements.txt'), os.path.join(frontend_dir, 'requirements.txt'))

# 4. Fix imports in python files from 'app.X' to 'api.X' (Vercel uses the api module)
for root, _, files in os.walk(api_dir):
    for filename in files:
        if filename.endswith('.py'):
            filepath = os.path.join(root, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            content = re.sub(r'(from|import)\s+app\.', r'\1 api.', content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

# 5. Create vercel.json
vercel_json = '''{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.py" },
    { "source": "/(.*)", "destination": "/" }
  ]
}'''
with open(os.path.join(frontend_dir, 'vercel.json'), 'w', encoding='utf-8') as f:
    f.write(vercel_json)
    
# 6. Delete frontend/api/tests because we don't need tests deployed
tests_dir = os.path.join(api_dir, 'tests')
if os.path.exists(tests_dir):
    shutil.rmtree(tests_dir)

# 7. Patch Frontend API_BASE_URL inline
files_to_patch = [
    os.path.join(frontend_dir, 'src', 'features', 'analyzer', 'Uploader.tsx'),
    os.path.join(frontend_dir, 'src', 'features', 'job-match', 'JobMatch.tsx'),
    os.path.join(frontend_dir, 'src', 'features', 'results', 'Dashboard.tsx')
]

for fp in files_to_patch:
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        content = re.sub(r"const API_BASE_URL = .*;", "const API_BASE_URL = '';", content)
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)

print("Vercel FastAPI migration complete.")
