import re

with open('src/components/landing/HeroSection.jsx', 'r') as f:
    hero = f.read()

# Fix the avatars
hero = hero.replace('https://i.pravatar.cc/60?img=12', 'https://randomuser.me/api/portraits/men/32.jpg')
hero = hero.replace('https://i.pravatar.cc/60?img=32', 'https://randomuser.me/api/portraits/women/44.jpg')
hero = hero.replace('https://i.pravatar.cc/60?img=47', 'https://randomuser.me/api/portraits/men/46.jpg')

# Fix Hero padding and layout constraints
hero = hero.replace('min-h-[520px] overflow-hidden bg-[#fafafa]', 'min-h-[600px] overflow-hidden bg-[#fafafa]')
hero = hero.replace('mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12 py-10 lg:py-16', 'mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-16 pt-16 lg:pt-24 pb-0')

# Headings and Spacing
hero = hero.replace('mt-12 text-5xl font-extrabold leading-[1.1] md:text-[68px]', 'mt-10 text-5xl font-extrabold leading-[1.1] md:text-[64px]')
hero = hero.replace('mb-10 text-[17px]', 'mt-6 text-[18px]')

# Fix the Right Panel / Image styling to fill correctly
hero = hero.replace(
    'className="relative flex items-end justify-center lg:justify-end pt-10"',
    'className="relative flex items-end justify-center lg:justify-start h-full min-h-[400px] lg:min-h-[500px]"'
)

hero = hero.replace(
    '''<div className="relative z-10 w-full max-w-[650px] lg:mr-20">
              <img
                src={landingImage}
                alt="Handyman"
                className="w-full h-auto object-contain object-bottom scale-110 origin-bottom"
              />
            </div>''',
    '''<div className="relative z-10 w-full h-[110%] flex lg:absolute lg:bottom-[-20%] lg:left-0 lg:w-[130%]">
              <img
                src={landingImage}
                alt="Handyman"
                className="w-full max-w-[700px] mx-auto lg:mx-0 object-contain object-bottom origin-bottom"
              />
            </div>'''
)

hero = hero.replace(
    'absolute right-0 lg:-right-4 xl:-right-10 top-20 z-20 w-[300px] rounded-2xl bg-[#131f33] p-6 text-white shadow-2xl hidden lg:block',
    'absolute right-0 xl:right-0 top-10 lg:top-[-20px] z-20 w-[320px] rounded-[24px] bg-[#1a2940] px-7 py-8 text-white shadow-2xl hidden lg:block'
)

hero = hero.replace('size={26}', 'size={28}')
hero = hero.replace('className="text-sm font-medium leading-snug', 'className="text-[15px] font-medium leading-snug')

with open('src/components/landing/HeroSection.jsx', 'w') as f:
    f.write(hero)

with open('src/components/landing/PopularServices.jsx', 'r') as f:
    services = f.read()

# Make grid 8-columns for desktop, use larger icons and tall heights
services = services.replace('grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9', 'grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 lg:gap-6')
services = services.replace('px-4 py-8', 'px-4 py-10 min-h-[120px]')
services = services.replace('px-2 py-6', 'px-4 py-10 min-h-[120px]')
services = services.replace('size={36}', 'size={42}')
services = services.replace('size={20}', 'size={24}')
services = services.replace('flex h-10 w-10', 'flex h-14 w-14')

# Update fonts
services = services.replace('text-[32px] font-bold', 'text-4xl font-extrabold')
services = services.replace('mt-10 grid', 'mt-14 grid')
services = services.replace('text-sm font-semibold', 'text-[15px] font-bold')
services = services.replace('text-[13px] font-bold', 'text-[15px] font-bold')

with open('src/components/landing/PopularServices.jsx', 'w') as f:
    f.write(services)

