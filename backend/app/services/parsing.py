# skillmatcher/services/parsing.py
from pathlib import Path
import PyPDF2
import docx
import logging

log = logging.getLogger(__name__)

def extract_text_from_pdf(path: Path) -> str:
    text = []
    try:
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text.append(page_text)
    except Exception as e:
        log.exception("PDF parsing failed: %s", e)
    return "\n".join(text)

def extract_text_from_docx(path: Path) -> str:
    try:
        doc = docx.Document(path)
        return "\n".join(p.text for p in doc.paragraphs if p.text)
    except Exception as e:
        log.exception("DOCX parsing failed: %s", e)
        return ""

def parse_resume_file(path: Path) -> str:
    lower = path.suffix.lower()
    if lower == ".pdf":
        return extract_text_from_pdf(path)
    if lower in (".docx", ".doc"):
        return extract_text_from_docx(path)
    # fallback to plain text
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""
