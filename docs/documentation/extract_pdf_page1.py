"""
PDF Content Extractor for CTINASSL Course Project Specification
This script extracts page 1 content from the PDF file
"""

try:
    import PyPDF2
    
    pdf_path = r"C:\Users\flexycode\Desktop\Healthcare-management-system\docs\documentation\CTINASSL AY 2025-2026 Course Project Specification and Rubrics.pdf"
    output_path = r"C:\Users\flexycode\Desktop\Healthcare-management-system\docs\documentation\page1_content.txt"
    
    with open(pdf_path, 'rb') as pdf_file:
        reader = PyPDF2.PdfReader(pdf_file)
        page1_text = reader.pages[0].extract_text()
        
        with open(output_path, 'w', encoding='utf-8') as output_file:
            output_file.write("=" * 80)
            output_file.write("\nPAGE 1 CONTENT - CTINASSL AY 2025-2026\n")
            output_file.write("Course Project Specification and Rubrics\n")
            output_file.write("=" * 80)
            output_file.write("\n\n")
            output_file.write(page1_text)
        
        print(f"✓ Successfully extracted page 1 content to: {output_path}")
        print(f"\n{'-'*80}")
        print("PAGE 1 PREVIEW:")
        print("-"*80)
        print(page1_text[:500] + "...")
        
except ImportError:
    print("ERROR: PyPDF2 not installed. Installing now...")
    import subprocess
    subprocess.run(["pip", "install", "PyPDF2"])
    print("Please run this script again after installation.")
except Exception as e:
    print(f"ERROR: {str(e)}")
