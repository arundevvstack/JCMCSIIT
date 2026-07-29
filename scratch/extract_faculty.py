import os
import glob
import json
from docx import Document
from PyPDF2 import PdfReader

def extract_text_from_docx(file_path):
    try:
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    except Exception as e:
        return f"ERROR extracting DOCX: {e}"

def extract_text_from_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"ERROR extracting PDF: {e}"

def main():
    base_dir = "public/Faculty"
    results = {}
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            file_path = os.path.join(root, file)
            ext = os.path.splitext(file)[1].lower()
            
            if ext == ".docx":
                text = extract_text_from_docx(file_path)
                results[file_path] = text
            elif ext == ".pdf":
                text = extract_text_from_pdf(file_path)
                results[file_path] = text
                
    with open("scratch/faculty_texts.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4, ensure_ascii=False)
        
    print(f"Extracted {len(results)} profiles. Saved to scratch/faculty_texts.json")

if __name__ == "__main__":
    main()
