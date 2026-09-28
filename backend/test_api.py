from fastapi.testclient import TestClient
from main import app
import fitz

client = TestClient(app)

# Create a small dummy PDF
doc = fitz.open()
page = doc.new_page()
page.insert_text((50, 50), "John Doe\njohn@example.com\nSkills: Python, React\nExperience: Software Engineer")
pdf_bytes = doc.write()
doc.close()

files = {'file': ('resume.pdf', pdf_bytes, 'application/pdf')}
response = client.post("/api/analyze", files=files)
print("STATUS CODE:", response.status_code)
print("JSON RESPONSE:", response.json())
