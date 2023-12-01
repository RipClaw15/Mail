from PIL import Image, ImageFilter

before = Image.open("mail/static/mail/backgrounds/bus.jpg")
after = before.filter(ImageFilter.BoxBlur(10))
after.save("blur_bus.jpg")