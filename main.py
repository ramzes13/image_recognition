# import the necessary packages
import numpy as np
import argparse
import imutils
import cv2

import logging
logging.basicConfig(filename='debug_python.log',level=logging.DEBUG)

# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", help = "path to the image")
args = vars(ap.parse_args())

# load the image
image = cv2.imread(args["image"])

rspX = 0
rspY = 0
biggestArea = 0

if not image is None: 
	blurred = cv2.GaussianBlur(image, (5, 5), 0)

	# ratio = image.shape[0] / float(resized.shape[0])

	lower = [240, 0, 0];
	upper = [255, 255, 255];

	# create NumPy arrays from the boundaries
	lower = np.array(lower, dtype = "uint8")
	upper = np.array(upper, dtype = "uint8")

	# find the colors within the specified boundaries and apply
	# the mask
	mask = cv2.inRange(blurred, lower, upper)
	output = cv2.bitwise_and(blurred, blurred, mask = mask)

	cv2.imwrite(args["image"] + '_debug.jpg', np.hstack([blurred, output]))

	# find contours in the thresholded image and initialize the
	# shape detector
	gray = cv2.cvtColor(output, cv2.COLOR_BGR2GRAY)
	cnts = cv2.findContours(gray.copy(), cv2.RETR_EXTERNAL,
		cv2.CHAIN_APPROX_SIMPLE)
	cnts = cnts[0] if imutils.is_cv2() else cnts[1]

	biggestArea = 0

	logging.debug('nr shapes: ' + str(len(cnts)))

	for c in cnts:
		# compute the center of the contour, then detect the name of the
		# shape using only the contour
		M = cv2.moments(c)
		if M["m00"] > 0: 
			area = cv2.contourArea(c)
			if(area > biggestArea):
				biggestArea = area
				rspX = int(M['m10']/M['m00'])
				rspY = int(M['m01']/M['m00'])

	# print 'centers'
	# print "X: " + str(rspX)
	# print "Y: " + str(rspY)
	# print biggestArea
print rspX
print rspY
print biggestArea

logging.debug('area: ' + str(biggestArea))