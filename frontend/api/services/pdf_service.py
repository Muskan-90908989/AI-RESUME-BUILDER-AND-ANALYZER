import fitz  # PyMuPDF

def extract_text_from_pdf(uploaded_file) -> str:
    """Extracts text from an uploaded PDF file safely."""
    text = ""
    try:
        # Read the uploaded file into a PyMuPDF document
        doc = fitz.open(stream=uploaded_file.read(), filetype="pdf")
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        # In a real enterprise app, we'd log this structured error not swallow it
        return ""
    
    return text.strip()
