with open('src/components/landing/Navbar.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex h-11 w-11 items-center justify-center rounded bg-white text-brand-navy">',
    '<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-brand-navy">'
)
content = content.replace(
    '<Hammer size={24} className="text-brand-navy -rotate-45" />',
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 12V22H22V12L12 2Z" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22V12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>'
)

with open('src/components/landing/Navbar.jsx', 'w') as f:
    f.write(content)
