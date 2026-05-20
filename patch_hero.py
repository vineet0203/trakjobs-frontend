import re

with open('src/components/landing/HeroSection.jsx', 'r') as f:
    content = f.read()

# Update font sizing
content = content.replace(
    'h1 className="mt-8 text-5xl font-extrabold leading-[1.1]',
    'h1 className="mt-12 text-5xl font-extrabold leading-[1.1] md:text-[68px]"'
)
content = content.replace(
    'text-brand-navy md:text-6xl tracking-tight',
    'text-brand-navy tracking-tight'
)

# Update floating card and image right-side flex
content = content.replace(
    'className="relative flex items-end justify-center lg:justify-end"',
    'className="relative flex items-end justify-center lg:justify-end pt-10"'
)

# Make the image larger and not centered so the card fits beside it
content = content.replace(
    'className="relative z-10 mx-auto w-full max-w-[500px]"',
    'className="relative z-10 w-full max-w-[650px] lg:mr-20"'
)

# Float the card on the far right
content = content.replace(
    'absolute right-0 top-10 z-20 w-[280px] rounded-2xl bg-[#1e293b]',
    'absolute right-0 lg:-right-4 xl:-right-10 top-20 z-20 w-[300px] rounded-2xl bg-[#131f33]'
)

with open('src/components/landing/HeroSection.jsx', 'w') as f:
    f.write(content)

