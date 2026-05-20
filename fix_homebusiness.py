with open('src/components/landing/HeroSection.jsx', 'r') as f:
    text = f.read()
text = text.replace('Home & Business', 'Home & Business') # It was already like this but just confirming
with open('src/components/landing/HeroSection.jsx', 'w') as f:
    f.write(text)
