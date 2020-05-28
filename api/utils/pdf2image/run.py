#!/usr/bin/python

import os, sys
import json
import shutil
import hashlib
import glob

#-----------------------------------------------------------------------
if __name__ == '__main__':

    PDF_main_folder = "PDF"
    if not os.path.isdir(PDF_main_folder):
        print("There is no PDF folder to convert in images...")
        sys.exit(0)
    
    PDF_folders = "{}/*".format(PDF_main_folder)    
    PDF_subfolders = sorted(glob.glob(PDF_folders))

    image_main_folder = "IMAGES"
    if os.path.isdir(image_main_folder):
        shutil.rmtree(image_main_folder)
    os.mkdir(image_main_folder)

    for PDF_subfolder in PDF_subfolders:

        company = os.path.basename(PDF_subfolder)
        images_folder = "{}/{}".format(image_main_folder, company)
        if not os.path.isdir(images_folder):
            os.mkdir(images_folder)

        complete_path = "{}/*.pdf".format(PDF_subfolder)
        list_pdf_files = sorted(glob.glob(complete_path))
        for pdf_file in list_pdf_files:
            os.system("./pdf2image.py {} {} png".format(pdf_file, images_folder))

