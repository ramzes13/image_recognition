
return 0;
# construct the argument parse and parse the arguments
# ap = argparse.ArgumentParser()
# ap.add_argument("-i", "--image", help = "path to the image")
# args = vars(ap.parse_args())
 
# # load the image
# image = cv2.imread(args["image"])
# # resized = imutils.resize(image, width=300)


# # lower = np.array([0, 0, 0])
# # upper = np.array([15, 15, 15])

# lower = np.array([100, 0, 0])
# upper = np.array([255, 255, 255])


# shapeMask = cv2.inRange(image, lower, upper)



# cv2.imwrite('result/tmp_gray_4.jpg', shapeMask)
