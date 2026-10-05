import fitz  # PyMuPDF
from typing import Dict, Any

def extract_pdf_metadata_and_text(uploaded_file) -> Dict[str, Any]:
    """
    Advanced PDF extraction pipeline using PyMuPDF.
    Extracts text preserving block reading order, and returns rich metadata
    required for the B.Tech advanced evaluation criteria.
    """
    raw_text = ""
    page_count = 0
    char_count = 0
    warnings = []
    
    try:
        doc = fitz.open(stream=uploaded_file.read(), filetype="pdf")
        page_count = len(doc)
        
        # Advanced structural extraction
        for page in doc:
            page_dict = page.get_text("dict")
            for block in page_dict.get("blocks", []):
                if block.get("type") == 0:  # 0 indicates text blocks
                    for line in block.get("lines", []):
                        for span in line.get("spans", []):
                            txt = span.get("text", "").strip()
                            if txt:
                                raw_text += txt + " "
                                char_count += len(txt)
                    raw_text += "\n"  # Preserve block separation for section logic
                    
        doc.close()
    except Exception as e:
        warnings.append(f"PDF parsing error: {str(e)}")
        return {"text": "", "page_count": 0, "character_count": 0, "word_count": 0, "extractability": 0, "parser_warnings": ["Fatal parser error"]}
        
    word_count = len(raw_text.split())
    
    # Heuristic: Extractability score
    extractability = 100
    if char_count == 0:
        extractability = 0
        warnings.append("No text detected. The document might be image-based or scanned.")
    elif word_count < 20:
        extractability = 20
        warnings.append("Extracted text is suspiciously short. Parser formatting risk.")
    elif page_count > 4:
        extractability = max(50, extractability - 20)
        warnings.append("Resume exceeds recommended page limits (>4 pages).")
        
    return {
        "text": raw_text.strip(),
        "page_count": page_count,
        "character_count": char_count,
        "word_count": word_count,
        "extractability": extractability,
        "parser_warnings": warnings
    }
