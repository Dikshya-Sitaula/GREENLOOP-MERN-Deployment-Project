// DEMO DATA — every record created from this file is flagged isDemo: true.

export const DEMO_PASSWORD = 'demo1234';

export const users = [
  { name: 'Aarati Shrestha', email: 'aarati@demo.np', city: 'Kathmandu', bio: 'Product designer in Baneshwor. Slowly decluttering one drawer at a time.' },
  { name: 'Bikash Tamang', email: 'bikash@demo.np', city: 'Lalitpur', bio: 'Fixes bikes on weekends in Jhamsikhel.' },
  { name: 'Sujata Gurung', email: 'sujata@demo.np', city: 'Pokhara', bio: 'Teacher at Lakeside. Books in, books out.' },
  { name: 'Rohan Maharjan', email: 'rohan@demo.np', city: 'Bhaktapur', bio: 'Woodworker. If it is wooden and wobbly, I can save it.' },
  { name: 'Anisha Karki', email: 'anisha@demo.np', city: 'Kathmandu', bio: 'Engineering student at Pulchowk. Always swapping textbooks.' },
  { name: 'Prabin Thapa', email: 'prabin@demo.np', city: 'Pokhara', bio: 'Trekking guide. Gear deserves more than one season.' },
  { name: 'Srijana Rai', email: 'srijana@demo.np', city: 'Lalitpur', bio: 'Mother of two, expert in outgrown toys.' },
  { name: 'Nabin Adhikari', email: 'nabin@demo.np', city: 'Kathmandu', bio: 'Electronics repair shop owner in New Road.' },
  { name: 'Pooja Bajracharya', email: 'pooja@demo.np', city: 'Lalitpur', bio: 'Thrift lover. Fashion is better the second time.' },
  { name: 'Kiran Shakya', email: 'kiran@demo.np', city: 'Bhaktapur', bio: 'Runs a small cafe near Durbar Square.' },
  { name: 'Manisha Poudel', email: 'manisha@demo.np', city: 'Pokhara', bio: 'Yoga instructor and weekend cyclist.' },
  { name: 'GreenLoop Admin', email: 'admin@demo.np', city: 'Kathmandu', bio: 'Keeping the loop healthy.', role: 'admin' },
];

// [title, category, condition, type, price, city, ownerIndex, [unsplash ids], description, wantInReturn, completed?]
export const items = [
  ['Sony over-ear headphones', 'Electronics', 'Like new', 'sell', 4500, 'Kathmandu', 0, ['1505740420928-5e560c06d30e', '1484704849700-f032a568e944'], 'Barely used noise-isolating headphones. Comes with the original pouch and cable. Moving to earbuds, so these deserve someone who will wear them daily.', ''],
  ['MacBook Air 13" (2017)', 'Computers & Laptops', 'Good', 'sell', 42000, 'Kathmandu', 7, ['1611186871348-b1ce696e52c9', '1517336714731-489689fd1ca8'], 'Battery replaced last year, 8GB RAM, 128GB SSD. Perfect for students and writing. Small dent on the back corner.', ''],
  ['Dell Inspiron laptop', 'Computers & Laptops', 'Fair', 'repair', 0, 'Lalitpur', 1, ['1593642632559-0c6d3fc62b89'], 'Screen flickers and the hinge is loose. Looking for someone who can repair it, or a repair shop that can reuse parts.', 'Repair help or parts'],
  ['Polaroid instant camera', 'Electronics', 'Good', 'swap', 0, 'Pokhara', 2, ['1526170375885-4d8ecf77b99f'], 'Classic instant camera that still shoots beautifully. Film not included. Would love to swap for a film camera or a tripod.', 'Film camera or tripod'],
  ['Mirrorless camera body', 'Electronics', 'Like new', 'sell', 55000, 'Kathmandu', 7, ['1516035069371-29a1b244cc32'], 'Lightly used camera body with two batteries and charger. Shutter count under 5,000. Upgraded to full frame.', ''],
  ['iPad 9th gen, 64GB', 'Computers & Laptops', 'Like new', 'sell', 32000, 'Lalitpur', 8, ['1544244015-0df4b3ffc6b0'], 'Always used with a case and screen guard. Great for note-taking and online classes.', ''],
  ['Bluetooth speaker', 'Electronics', 'Good', 'donate', 0, 'Bhaktapur', 9, ['1608043152269-423dbba4e7e1'], 'Works perfectly, battery lasts about 6 hours. Donating to a school or community space that needs music.', ''],
  ['32" LED TV', 'Electronics', 'Good', 'sell', 14500, 'Pokhara', 10, ['1601944179066-29786cb9d32a'], 'Smart TV with Netflix and YouTube. Remote included. Moving abroad, needs to go this month.', ''],
  ['Smartwatch with charger', 'Mobile & Accessories', 'Needs repair', 'repair', 0, 'Kathmandu', 4, ['1546868871-7041f2a55e12'], 'Touchscreen stopped responding after a fall. Everything else powers on. Hoping someone can give it a second life.', 'Screen repair'],
  ['Android phone (spare)', 'Mobile & Accessories', 'Fair', 'donate', 0, 'Kathmandu', 0, ['1511707171634-5f897ff02aa9'], 'Old but reliable phone, factory reset. Perfect as a first phone or a backup for someone who needs one.', '', true],

  ['Fiction bundle (12 novels)', 'Books', 'Good', 'donate', 0, 'Pokhara', 2, ['1512820790803-83ca734da794', '1495446815901-a7297e633e8d'], 'A mix of English and Nepali fiction. Would love these to go to a community library or reading club.', ''],
  ['Loksewa preparation books', 'Books', 'Good', 'sell', 1200, 'Kathmandu', 4, ['1497633762265-9d179a990aa6'], 'Complete set for Loksewa preparation with a few pencil notes. Saved me a lot of time — hope it helps you too.', ''],
  ['Classic hardcover novel', 'Books', 'Like new', 'swap', 0, 'Lalitpur', 6, ['1544947950-fa07a98d237f'], 'Beautiful hardcover edition, read once. Swap for any good non-fiction.', 'Any non-fiction book'],
  ['Engineering textbooks (2nd year)', 'Books', 'Fair', 'sell', 1800, 'Lalitpur', 1, ['1495446815901-a7297e633e8d'], 'Highlighted but complete. Covers circuits, mechanics and maths for second year students.', '', true],

  ['Three-seater fabric sofa', 'Furniture', 'Good', 'sell', 18000, 'Lalitpur', 6, ['1555041469-a586c61ea9bc', '1540574163026-643ea20ade25'], 'Comfortable sofa with removable covers that were just washed. Pickup from Sanepa — needs two people to carry.', ''],
  ['Wooden bookshelf', 'Furniture', 'Good', 'swap', 0, 'Bhaktapur', 3, ['1594620302200-9a762244a156'], 'Solid wood shelf I built myself. Sturdy, five shelves. Happy to swap for tools or a small table.', 'Hand tools or side table'],
  ['Mid-century armchair', 'Furniture', 'Like new', 'sell', 9500, 'Kathmandu', 0, ['1586023492125-27b2c045efd7'], 'Lovely reading chair in a warm fabric. No stains, no wobble. Your old desk just found its next chapter — and so can this.', ''],
  ['Wooden bar stools (pair)', 'Furniture', 'Good', 'sell', 3500, 'Bhaktapur', 9, ['1503602642458-232111445657'], 'Two light wooden stools from our cafe refresh. Solid and recently sanded.', ''],
  ['Ergonomic office chair', 'Furniture', 'Fair', 'repair', 0, 'Kathmandu', 7, ['1580480055273-228ff5388ef8'], 'Gas lift needs replacing, otherwise great. Free to anyone who can fix it up.', 'Gas lift repair'],
  ['Study desk with drawer', 'Furniture', 'Good', 'donate', 0, 'Pokhara', 10, ['1524758631624-e2822e304c36'], 'Simple study desk. Would be wonderful for a student who needs a quiet workspace.', '', true],
  ['Modern dining chair', 'Furniture', 'New', 'sell', 2800, 'Lalitpur', 8, ['1592078615290-033ee584e267'], 'Bought one extra, never used. Still in protective wrap.', ''],
  ['Accent chair', 'Furniture', 'Good', 'swap', 0, 'Kathmandu', 4, ['1567538096630-e0c55bd6374c'], 'Clean, simple chair that fits any corner. Swap for a floor lamp or a plant stand.', 'Floor lamp'],

  ['Leather jacket (M)', 'Fashion', 'Good', 'sell', 5500, 'Kathmandu', 8, ['1551028719-00167b16eac5'], 'Genuine leather, medium size. Soft and broken-in in the best way.', ''],
  ['Running sneakers (EU 42)', 'Shoes & Bags', 'Like new', 'sell', 3200, 'Pokhara', 10, ['1542291026-7eec264c27ff'], 'Worn for two short runs. Wrong size for me.', ''],
  ['Winter sweaters bundle', 'Fashion', 'Good', 'donate', 0, 'Lalitpur', 8, ['1544441893-675973e31985'], 'Five warm sweaters, sizes S–M. Washed and folded, ready for someone who needs warmth this winter.', ''],
  ['Plain cotton tees (x4)', 'Fashion', 'Like new', 'swap', 0, 'Kathmandu', 0, ['1521572163474-6864f9cf17ab'], 'Four plain tees, size M. Swap for a scarf or any accessory.', 'Scarf or accessory'],
  ['Analog wristwatch', 'Fashion', 'Needs repair', 'repair', 0, 'Bhaktapur', 3, ['1523275335684-37898b6baf30'], 'My grandfather\'s watch. Needs a new movement. Looking for a watch repairer who loves old pieces.', 'Watch repair'],
  ['Casual sneakers (EU 39)', 'Shoes & Bags', 'Good', 'sell', 1800, 'Lalitpur', 6, ['1560769629-975ec94e6a86'], 'Comfortable everyday sneakers. Cleaned and deodorised.', '', true],

  ['Front-load washing machine', 'Home Appliances', 'Good', 'sell', 22000, 'Kathmandu', 7, ['1626806787461-102c1bfaaea1'], '7kg capacity, energy efficient. Serviced three months ago. Moving to a furnished flat.', ''],
  ['Microwave oven', 'Home Appliances', 'Fair', 'repair', 0, 'Lalitpur', 1, ['1585659722983-3a675dabf23d'], 'Heats unevenly — probably the turntable motor. Free to a fixer.', 'Repair or parts'],
  ['Coffee grinder and kettle', 'Kitchen', 'Like new', 'sell', 6500, 'Bhaktapur', 9, ['1570222094114-d054a817e56b'], 'Upgraded the cafe setup. Both work perfectly and are great for home brewing.', ''],

  ['Laptop backpack', 'Student Items', 'Good', 'donate', 0, 'Kathmandu', 4, ['1553062407-98eeb64c6a62'], 'Fits a 15" laptop with plenty of pockets. Donating to a student starting college.', ''],
  ['Desk lamp', 'Student Items', 'Like new', 'sell', 1200, 'Pokhara', 2, ['1507473885765-e6ed057f782c'], 'Warm light, adjustable neck. Perfect for late night study during load shedding backups.', ''],
  ['Headphones + keyboard combo', 'Student Items', 'Good', 'swap', 0, 'Kathmandu', 0, ['1550009158-9ebf69173e03'], 'Wireless keyboard and headphones. Swap for a monitor stand or a webcam.', 'Webcam or monitor stand', true],

  ['Mountain bike (21 gear)', 'Bicycles & Vehicles', 'Good', 'sell', 16000, 'Lalitpur', 1, ['1485965120184-e220f721d03e'], 'Tuned last week, new brake pads. Rides like a dream on the Godawari trail.', ''],
  ['City bicycle', 'Bicycles & Vehicles', 'Fair', 'repair', 0, 'Pokhara', 10, ['1571068316344-75bc76f77890'], 'Chain is rusty and tyres are flat. Frame is solid. Free to someone who can fix it up.', 'Bike repair'],
  ['Trekking backpack 50L', 'Sports & Fitness', 'Good', 'sell', 4800, 'Pokhara', 5, ['1491637639811-60e2756cc1c7'], 'Carried it to Annapurna Base Camp twice. Rain cover included.', ''],
  ['Football (size 5)', 'Sports & Fitness', 'Good', 'donate', 0, 'Bhaktapur', 3, ['1574629810360-7efbbe195018'], 'Good grip, holds air well. For a local team or school.', ''],
  ['Dumbbell set', 'Sports & Fitness', 'Like new', 'sell', 7000, 'Kathmandu', 7, ['1576678927484-cc907957088c'], 'Pair of adjustable dumbbells. Moving to a gym membership.', '', true],

  ['Wooden train set', 'Kids & Toys', 'Like new', 'swap', 0, 'Lalitpur', 6, ['1596461404969-9ae70f2830c1'], 'Complete set with tracks and station. My son outgrew it. Swap for books for a 6 year old.', 'Kids books'],
  ['Building bricks box', 'Kids & Toys', 'Good', 'donate', 0, 'Kathmandu', 4, ['1566140967404-b8b3932483f5'], 'Big box of mixed bricks and figures. Hours of creative play for any child.', ''],
  ['Baby toys bundle', 'Kids & Toys', 'Good', 'donate', 0, 'Lalitpur', 6, ['1515488042361-ee00e0ddd4e4'], 'Soft toys, rattles and picture books, all washed. Someone else might need what you no longer do.', '', true],
  ['Vintage toy robots', 'Kids & Toys', 'Good', 'sell', 2500, 'Bhaktapur', 9, ['1558060370-d644479cb6f7'], 'A colourful collection of wind-up toy robots. Great for collectors or curious kids.', ''],
];

// Swap listings: title -> [wanted category, optional note]
export const swapWants = {
  'Polaroid instant camera': ['Electronics', 'Film camera or tripod'],
  'Classic hardcover novel': ['Books', 'Any good non-fiction'],
  'Wooden bookshelf': ['Tools & Hardware', 'Hand tools, or a small side table'],
  'Accent chair': ['Other', 'Floor lamp or plant stand'],
  'Plain cotton tees (x4)': ['Fashion', 'Scarf or accessory'],
  'Headphones + keyboard combo': ['Electronics', 'Webcam or monitor stand'],
  'Wooden train set': ['Books', 'Books for a 6 year old'],
};

export const testimonials = [
  [0, 'I listed my old armchair on a Sunday and it had a new home by Tuesday. Seeing the kilograms add up on my impact page is oddly motivating.', 'Sold 4 items'],
  [3, 'Half the furniture people throw away just needs a few screws. GreenLoop sends me the repair jobs I love doing.', 'Repaired 9 items'],
  [4, 'Swapping textbooks with juniors saved me thousands of rupees this semester. It feels like a campus tradition now.', 'Swapped 6 books'],
  [6, 'My kids outgrow everything so fast. Donating their toys to families nearby feels so much better than storing them.', 'Donated 11 items'],
];
