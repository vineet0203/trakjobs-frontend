with open('src/components/landing/PopularServices.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'px-2 py-6',
    'px-4 py-8'
)

with open('src/components/landing/PopularServices.jsx', 'w') as f:
    f.write(content)
