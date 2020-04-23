#!/usr/bin/python

import os, sys

#-----------------------------------------------------------------------
if __name__ == '__main__':

    filename = sys.argv[1]
    dest_folder = sys.argv[2]
    image_type = sys.argv[3]

    basename = os.path.basename(filename)
    name, ext = os.path.splitext(basename)
    final_image = "{}/{}.{}".format(dest_folder, name, image_type)
    res1 = "{}-1.{}".format(final_image, image_type)
    res2 = "{}-2.{}".format(final_image, image_type)
    
    command = "pdftoppm -{} -f 1 -l 2 {} {}".format(image_type, filename, final_image)
    os.system(command)
    if os.path.isfile(res2):
       os.system("convert -append {} {} {}".format(res1, res2, final_image))
       os.remove(res1)
       os.remove(res2)
    else:
        command = "mv {} {}".format(res1, final_image)
        os.system(command)

