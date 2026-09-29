import re
import string

def clean_text(text: str) -> str:
    """Cleans the extracted text by removing excessive whitespace and unprintable characters."""
    # Replace newlines and tabs with spaces
    text = re.sub(r'\s+', ' ', text)
    # Remove non-ascii for easier processing
    text = ''.join(filter(lambda x: x in string.printable, text))
    return text.strip()
