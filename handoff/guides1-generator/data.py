# b3 = slug only in queue/batch3 (strip if not on main)
HONEST = ("Picks are editorial: the order is our judgment, not star ratings, review counts, or any scoring system, "
          "and every place is a listing on The Heights with its own page, sources, and verdict. ")

G = []

def guide(**k): G.append(k)

guide(slug="best-dominican-restaurants-washington-heights",
 title="The Best Dominican Restaurants in Washington Heights",
 description="Where to eat Dominican food in Washington Heights: rotisserie chicken, mofongo, breakfast mangú, and a Cuban-Dominican diner open around the clock.",
 category="restaurant",
 intro=[
 "A plate of rice, beans, and something stewed, fried, or mashed from a plantain is a natural way to start eating in Washington Heights. This guide is for first-timers who want a reliable starting point and for locals deciding where to take out-of-town friends.",
 "We started with the Dominican and Dominican-adjacent restaurants already listed on The Heights and ranked them by fit: how well each one delivers classic Dominican cooking, and what kind of meal it suits. " + HONEST.strip(),
 "Hours and menus change, and some of these listings note that sources disagree, so check before a special trip."],
 picks=[
 ("malecon","Best overall","Its own site describes rotisserie chicken, stews, fried plantains, rice and beans, empanadas, and mofongo, and says it has served New Yorkers since 1987. A 2023 Infatuation guide listed it as good for casual dinners and serious takeout.",False),
 ("marilu-and-daysi","Best for breakfast","A tiny, cash-only counter that Gothamist says sisters Deisy and Marilu opened in 2007. Gothamist reports the breakfast mangú con tres golpes often sells out by 10am, so plan for daytime.",True),
 ("la-casa-del-mofongo","Best for a group dinner","The Infatuation's 2023 guide describes a massive spot serving 30 types of mofongo, from shrimp and pernil to octopus and lobster, with a bar area for watching sports. The listing notes that sources disagree on hours, so call before a late visit.",False),
 ("el-floridita","Best open 24 hours","A Cuban and Dominican restaurant on Broadway that its own site says has operated since 1995 and lists as open 24 hours. The Infatuation points to the Cubano sandwich and describes mofongo, asopao, and rotisserie chicken on a long menu.",False),
 ])

guide(slug="best-coffee-shops-washington-heights",
 title="The Best Coffee Shops in Washington Heights",
 description="The best coffee shops in Washington Heights, from Ethiopian-sourced espresso on Pinehurst Ave to Colombian coffee and an all-day cafe on W 181st St.",
 category="cafe",
 intro=[
 "This guide is for people who want a good cup before a walk through Fort Tryon Park, a place to sit down on the 181st Street strip, or a coffee and a snack on the way up Amsterdam Ave. Washington Heights coffee is not one thing, and the places here come from different traditions.",
 "We chose from the cafes listed on The Heights and ranked them by how well they work as a coffee stop. " + HONEST.strip(),
 "Most of these close by early evening, and a few are small, so seats are not guaranteed. Each listing page has hours and a note on what we could and could not confirm."],
 picks=[
 ("buunni-coffee-pinehurst","Best for Ethiopian coffee","The original Buunni location. A 2023 Infatuation guide said all of its coffee comes from small growers in Ethiopia, and noted espresso drinks, cold brew, and beans sold by the pound. The same write-up called the shop tiny, and it closes at 5pm daily.",False),
 ("salento-colombian-coffee-and-kitchen","Best coffee and a bite","A Colombian coffee shop and bakery open daily 8am to 8pm. The Infatuation's 2023 guide called it one of the best places in the neighborhood for coffee and a bite or a substantial breakfast, with empanadas, arepas, and a case of buñuelos.",False),
 ("the-uptown-garrison","Best all-day cafe","Coffee and pastries start at 7:30am on weekdays and 9am on weekends, according to its hours page, before the room shifts to lunch, brunch, dinner, and a bar. A good fit if you want one place that works at any hour.",False),
 ("semicolon-cafe","Best for an egg sandwich","A Korean-influenced cafe open 8am to 7pm. The Infatuation singled out its brioche egg sandwiches, and the menu also lists croissants, pastries, and bingsoo; it is part of a group with other locations.",True),
 ])

guide(slug="best-bakeries-and-desserts-washington-heights",
 title="The Best Bakeries and Desserts in Washington Heights",
 description="A sweet-tooth guide to Washington Heights: carrot cake on Broadway, Southern biscuits and custom cakes on W 187th St, and Colombian pastries.",
 category="bakery",
 intro=[
 "This guide is for anyone who wants cake, pastry, or something sweet in Washington Heights, whether that means a slice to eat on the sidewalk, a custom cake for a party, or a case full of Colombian pastries.",
 "We looked at the bakeries and cafes listed on The Heights and ranked them by how central baking and dessert are to what each place does. " + HONEST.strip(),
 "Some of these are full restaurants or cafes that also bake, and we say so in the blurbs. Hours and stock change, so check the listing page before heading out for one specific item."],
 picks=[
 ("carrot-top-pastries","Best carrot cake","Open since 1979 according to The Infatuation's 2023 guide, which says it makes some of the best carrot cake that critic had had, with slices taller than a coffee mug. Its official site is gone, so confirm hours before you go.",False),
 ("dutch-baby-bakery","Best biscuits and custom cakes","Its own website says everything is made in-house, from sandwich bread to biscuits, and offers custom cakes, cupcakes, and cookies with a week's notice. It is also a restaurant and bar, so you can stay for a meal.",False),
 ("salento-colombian-coffee-and-kitchen","Best Colombian pastries","The Infatuation described a large display case of buñuelos and puff pastries filled with guava and cheese or with savory fillings. A restaurant-review aggregator reports some inconsistency in pastry freshness, so go earlier in the day.",False),
 ("semicolon-cafe","Best shaved ice","Its menu includes croissants and pastries, plus bingsoo in flavors such as sesame and matcha. It is a Korean-influenced cafe, open 8am to 7pm, and part of a group rather than a one-off.",True),
 ])

guide(slug="best-bars-and-nightlife-washington-heights",
 title="The Best Bars and Nightlife in Washington Heights",
 description="Where to drink in Washington Heights: neighborhood pubs, tapas and wine bars, a hotel bar, and cocktail rooms, with notes on happy hours and late hours.",
 category="bar",
 intro=[
 "Nightlife in Washington Heights ranges from dark-wood pubs and tapas bars to cocktail rooms and a hotel restaurant with a full bar. This guide is for people who want an evening out uptown without defaulting to a trip downtown.",
 "We built it from the bars, cafe-bars, and restaurants with bars listed on The Heights, and ranked them by how well they work as a night out. " + HONEST.strip(),
 "Bar hours are the least stable detail in any listing, and several places here have sources that disagree. Check the listing page, and call before a late night."],
 picks=[
 ("le-cheile","Best neighborhood pub","A two-floor Irish pub that its website says has served the neighborhood for over a decade. A 2023 Infatuation guide mentions a view of the George Washington Bridge and singled out the wings; it is open until 2am Thursday through Sunday.",False),
 ("hilltop-park-alehouse","Best for beer and baseball history","Named for the 1903 ballpark that was the original home of the team that became the Yankees. The Infatuation describes a long list of beers and ciders, and NYC's tourism listing mentions Tuesday trivia and Sunday live jazz.",False),
 ("club-deportivo-dominicano","Best salsa night","A Dominican social club founded in 1966. Salsa New York's guide lists Friday salsa from midnight to 4am for ages 21 and over with ID, though that page is undated, so call (212) 923-3817 about nights and door policy.",True),
 ("tinto-tapas","Best wine and tapas","A Spanish tapas and wine bar that its own site says was founded in 1998 and that promotes wine tasting events. It is closed Mondays.",True),
 ("legacy-bar-and-grill","Best late-night cocktails","A Latin American bar and grill whose website lists cocktails, tapas, and hours until 2am on Friday and Saturday. Its happy hour is bar-only, and kitchen hours are shorter than bar hours.",True),
 ("manolo-tapas","Best before a show","A Spanish tapas and wine bar across from the United Palace, open 4pm to 10pm daily with a weekday happy hour from 4 to 6pm. Its website says it is cash only, with an ATM inside.",False),
 ("radio-restaurant","Best full bar with table service","The restaurant and bar at the Radio Hotel. Its site lists a bar open daily from noon, a happy hour from 4pm to 7pm Tuesday through Friday, and an events and music calendar.",False),
 ("the-uptown-garrison","Best for cocktails after coffee","An all-day cafe that turns into a cocktail bar with a daily happy hour from 4 to 6pm, according to its hours page. A 2023 Infatuation guide mentioned affordable cocktails and wines on tap.",False),
 ])

guide(slug="best-brunch-washington-heights",
 title="The Best Brunch in Washington Heights",
 description="Where to brunch in Washington Heights: pancakes and Sunday jazz at a pub, table-service brunch on W 181st St, Southern biscuits, and a hotel restaurant.",
 intro=[
 "Brunch is not the first thing Washington Heights is known for, and the neighborhood has fewer dedicated brunch spots than some others. This guide is for anyone planning a weekend meal here and wanting the places that state a brunch service in their own materials.",
 "We included only listings whose sources mention brunch, and ranked them by how clearly brunch is part of what the place offers. " + HONEST.strip(),
 "Weekend schedules shift. Where a place's own pages disagree on brunch hours, the blurb says so; confirm before you go, and reserve where the place takes reservations."],
 picks=[
 ("hilltop-park-alehouse","Best with Sunday jazz","The Infatuation says there is brunch and live jazz on Sundays and recommends the buttermilk pancakes. It tagged the pub for birthdays, brunch, and date nights, and its hours begin at 11am on weekends.",False),
 ("the-uptown-garrison","Best table-service brunch","Its hours page lists table-service brunch on weekends, with counter-service lunch on weekdays, and the same room runs a coffee counter and a bar. Coffee service starts at 9am on weekends.",False),
 ("dutch-baby-bakery","Best for biscuits","The site lists brunch, dinner, bar, and bakery menus, and its own copy points to buttermilk biscuits in the morning. Everything is described as made in-house; confirm current brunch details with the bakery.",False),
 ("radio-restaurant","Best hotel brunch","The restaurant at the Radio Hotel lists weekend brunch on its menus: Saturday noon to 3pm, and Sunday noon to 5pm on its contact page or noon to 3pm on its reservations page. Check which applies if you are booking late.",False),
 ("legacy-bar-and-grill","Best for a late Sunday brunch","The bar and grill's website lists a Sunday brunch from 1 to 6pm, with its Latin American menu and cocktails. Kitchen hours are shorter than bar hours, so confirm before a late arrival.",True),
 ])

guide(slug="best-things-to-do-washington-heights",
 title="The Best Things to Do in Washington Heights",
 description="The best things to do in Washington Heights: medieval art at The Cloisters, hilltop parks, the High Bridge, a landmark theater, and a Malcolm X memorial.",
 category="landmark",
 intro=[
 "Washington Heights has more to see than many visitors expect, from a medieval museum inside a hilltop park to a pedestrian bridge over the Harlem River. This guide is for visitors, new residents, and locals looking for a good afternoon.",
 "We picked from the landmark listings on The Heights, which cover parks, museums, historic buildings, and public spaces, and ranked them by how well each works as a destination in itself. " + HONEST.strip(),
 "Several of these have limited hours or are closed on certain days, so each blurb notes what to check first."],
 picks=[
 ("the-met-cloisters","Best museum","The Metropolitan Museum's branch for medieval art inside Fort Tryon Park. NYC Parks says it houses nearly 5,000 medieval works, and the Met lists hours of 10am to 5pm every day except Wednesday, when it is closed.",False),
 ("fort-tryon-park","Best walk","A 67-acre park with Hudson River views, the Heather Garden, and eight miles of pathways, according to NYC Parks. It is steeply hilly, so wear good shoes.",False),
 ("the-high-bridge","Best short walk with a view","The city's oldest standing bridge, opened in 1848 and reopened to walkers and cyclists in 2015, according to NYC Parks. It is 1,450 feet long and crosses the Harlem River to the Bronx; check hours before an evening walk.",False),
 ("united-palace","Best building","A landmarked 1930 theater built as Loew's 175th Street Theatre. The best way to see the interior is a ticketed event or tour, and the venue keeps a calendar of both.",False),
 ("hispanic-society-museum-and-library","Best free museum","On Audubon Terrace, with works by Velázquez, Goya, and El Greco and Sorolla's \"Vision of Spain\" series. The museum is open Thursday to Sunday, and admission is free with a required ticket.",True),
 ("morris-jumel-mansion","Best for history","Manhattan's oldest surviving house, built about 1765 and used by Washington as headquarters in 1776. As of October 28, 2026 the mansion is closed for roof work, though Roger Morris Park stays open and Saturday walking tours run.",True),
 ("malcolm-x-and-dr-betty-shabazz-memorial-center","Best for a serious visit","A memorial and museum in the restored Audubon Ballroom, where Malcolm X was assassinated in 1965. Advance ticket purchase is required, and its listed hours are Tuesday to Friday.",False),
 ("little-red-lighthouse","Best riverside stop","A small 1917 lighthouse beneath the George Washington Bridge, reached by the Hudson River Greenway. Interior tours are only held on special days, so go for the setting.",False),
 ])

guide(slug="best-parks-and-views-washington-heights",
 title="The Best Parks and Views in Washington Heights",
 description="The best parks and viewpoints in Washington Heights, from Fort Tryon Park and the High Bridge to J. Hood Wright Park's view of the George Washington Bridge.",
 category="landmark",
 intro=[
 "Manhattan's highest natural point is in Washington Heights, so the best parks here come with hills, river views, and a bit of history. This guide is for walkers, runners, picnickers, and anyone hunting for a good view of the Hudson or the Harlem River.",
 "We chose from the parks and outdoor landmarks listed on The Heights and ranked them by how well they work for a park visit and how good the views are according to their sources. " + HONEST.strip(),
 "These are hilly places, and some paths and gates have their own hours or seasonal closures. We note where a listing says conditions were not checked."],
 picks=[
 ("fort-tryon-park","Best overall","NYC Parks describes 67 acres with eight miles of pathways, the Heather Garden, and Hudson River views. It is also home to The Met Cloisters, and the listing warns that it is steeply hilly.",False),
 ("the-high-bridge","Best bridge walk","A car-free span over the Harlem River that NYC Parks calls the city's oldest standing bridge, 138 feet above the water. Bronze medallions embedded in the walkway tell its history.",False),
 ("j-hood-wright-park","Best view of the George Washington Bridge","NYC Parks says the overlook at the park's northwest corner has views of the Hudson River and the George Washington Bridge. The playground is custom-designed to resemble the bridge.",False),
 ("highbridge-park","Best for a quieter, wilder park","A 103-acre forested natural area along the Harlem River, from W 155th St to Dyckman St, with cliffs, mountain-bike trails, and river views. The listing says it gets fewer visitors than Fort Tryon, and the wooded stretches are steep.",False),
 ("little-red-lighthouse","Best riverside walk","A small lighthouse in Fort Washington Park beneath the George Washington Bridge, on the Hudson River Greenway side of the neighborhood. Gate hours and path conditions were not checked, so verify with NYC Parks.",False),
 ("bennett-park","Best for history on the highest ground","A small park on Manhattan's highest natural point at 265 feet, where Fort Washington stood in 1776. The listing calls it a pause rather than a day out, with a playground and a monument.",False),
 ])

guide(slug="hudson-heights-essentials",
 title="Hudson Heights Essentials: Where to Eat, Drink, and Wander Around 181st and 187th",
 description="A local's shortlist for Hudson Heights: Fort Tryon Park, The Cloisters, coffee, ramen, a pub, and a bookshop along W 181st and W 187th Streets.",
 area="hudson-heights",
 intro=[
 "Hudson Heights is the hilltop corner of Washington Heights, with commercial strips along W 181st Street and W 187th Street. This guide is for visitors heading to Fort Tryon Park and The Cloisters, and for new neighbors looking for the places that anchor the area.",
 "We chose from the Hudson Heights listings on The Heights, covering parks, a museum, cafes, restaurants, bars, and a bookshop, and ranked them by how essential each is to understanding the area. " + HONEST.strip(),
 "Some places here close early, and a few have details we could not fully confirm. Each listing page says what was checked."],
 picks=[
 ("fort-tryon-park","Start here","A 67-acre park with Hudson River views, the Heather Garden, and eight miles of paths, according to NYC Parks. It is the neighborhood's best long walk, and it is steep.",False),
 ("the-met-cloisters","Best museum","The Metropolitan Museum's medieval branch, inside Fort Tryon Park, with the Unicorn Tapestries in its collection. It is closed on Wednesdays.",False),
 ("buunni-coffee-pinehurst","Best morning coffee","The original Buunni cafe on Pinehurst Ave, serving Ethiopian-sourced coffee, around the corner from Bennett Park. It is tiny and closes at 5pm.",False),
 ("dutch-baby-bakery","Best on W 187th St","A bakery, restaurant, and bar serving seasonal Southern food, with biscuits and bread made in-house. It is on the same block as The Fountain Bookshop.",False),
 ("tampopo-ramen","Best ramen","A ramen and sake bar that spent a decade on Bennett Ave before moving to 823 W 181st St in 2026. Check current reservation and delivery options, since it is a new location.",False),
 ("the-uptown-garrison","Best all-day room on W 181st St","A cafe, restaurant, and bar about a block from the 181st St A station, with coffee and pastries by morning and cocktails with a daily happy hour later.",False),
 ("le-cheile","Best pub","A two-floor Irish pub on W 181st St, open until 2am Thursday through Sunday, with a view of the George Washington Bridge according to a 2023 Infatuation guide.",False),
 ("tinto-tapas","Best wine bar","A Spanish tapas and wine bar on Pinehurst Ave near W 187th St that says it was founded in 1998. It is closed Mondays.",True),
 ("fountain-bookshop","Best bookshop","An independent bookshop at 803 W 187th St with a children's section and titles in English and Spanish, plus a calendar of book clubs and events.",False),
 ("bennett-park","Best history stop","A small park on Manhattan's highest natural point, 265 feet above sea level, where Fort Washington stood in 1776.",False),
 ])

guide(slug="a-day-in-washington-heights-first-time-visitors",
 title="A Day in Washington Heights: A First-Timer's Itinerary",
 description="One day in Washington Heights: coffee, Fort Tryon Park and The Cloisters, ramen, the High Bridge, and a Dominican dinner across from the United Palace.",
 intro=[
 "If you only have one day in Washington Heights, this is a route that starts in Hudson Heights and works south and east. It is for first-time visitors who want a mix of green space, history, and a proper meal.",
 "The picks are ordered as a day rather than ranked as a list, from morning coffee to dinner. " + HONEST.strip() + " We chose places from the listings on The Heights that fit the shape of a day.",
 "A few cautions: The Met Cloisters is closed on Wednesdays, so adjust the day if you want to go inside. Check hours for each stop before you set out, because the listings flag items that vary."],
 picks=[
 ("buunni-coffee-pinehurst","Morning","Start at the original Buunni on Pinehurst Ave, which serves Ethiopian-sourced coffee and opens at 7am on weekdays and 8am on weekends. It is small, and it closes at 5pm.",False),
 ("fort-tryon-park","Late morning","NYC Parks lists eight miles of pathways, the Heather Garden, and Hudson River views at this 67-acre park. It is hilly, so allow time.",False),
 ("the-met-cloisters","Late morning","The Met's medieval branch is inside the park. It is open 10am to 5pm except Wednesday, and admission rules are on the Met's site.",False),
 ("bennett-park","Midday","A short walk from Fort Tryon Park, according to the listing, this small park sits on Manhattan's highest natural point where Fort Washington stood in 1776.",False),
 ("tampopo-ramen","Lunch or early dinner","A ramen and sake bar on W 181st St, open from noon, with a happy hour from 5 to 6pm. It moved to this address in 2026, so confirm current options.",False),
 ("united-palace","Afternoon","The landmarked 1930 theater at 4140 Broadway is best seen with a ticket for an event or tour, though the building itself is the draw. Check its calendar before you go.",False),
 ("the-high-bridge","Late afternoon","A free, car-free walk over the Harlem River on the city's oldest standing bridge. NYC Parks lists daily hours of 7am to 10pm, but earlier closing has been reported, so check before an evening visit.",False),
 ("malecon","Dinner","A Dominican restaurant directly across from the United Palace, serving rotisserie chicken, stews, and mofongo until 11pm Sunday through Thursday and midnight on weekends.",False),
 ])

guide(slug="best-late-night-food-washington-heights",
 title="The Best Late-Night Food in Washington Heights",
 description="Where to eat late in Washington Heights: an all-night Cuban-Dominican diner, tacos until 2am, a late pub, and big mofongo plates.",
 intro=[
 "Washington Heights does late nights well, with a Cuban-Dominican diner that lists itself as open 24 hours and a few spots serving until 2am. This guide is for night owls, shift workers, and anyone coming out of a show at the United Palace who is hungry.",
 "We chose from listings that state late hours or an overnight schedule, and ranked them by how late they stay open and how well they work as a place to eat. " + HONEST.strip(),
 "Late hours are the detail most likely to be out of date, and several listings say their sources disagree. Call before you set out in the small hours."],
 picks=[
 ("el-floridita","Best open 24 hours","Its own website lists the Broadway location as open 24 hours. The Infatuation says the reason to go is the Cubano, and describes mofongo, asopao, and rotisserie chicken on a long menu.",False),
 ("talkin-tacos","Best tacos until 2am","A halal taco shop on Broadway at W 177th St, listed as open daily 11am to 2am. Eater's 2024 review called the beef birria taco one of the best around.",False),
 ("guac-time-mexican-grill","Best for delivery until 2am","A newer Mexican grill on St Nicholas Ave. Delivery listings show hours of roughly 10:30am or 11am to 2am daily; the evidence is thinner than for older places, so treat details as provisional.",False),
 ("le-cheile","Best late pub meal","An Irish pub open until 2am Thursday through Sunday. A 2023 Infatuation write-up listed shepherd's pie, bangers and mash, and burgers, and singled out the wings.",False),
 ("legacy-bar-and-grill","Best for weekend nights","The bar and grill's website lists hours until 2am on Friday and Saturday, with Latin American plates and tapas. Kitchen hours are shorter than bar hours, so confirm when the kitchen closes.",True),
 ("la-casa-del-mofongo","Best for mofongo after dark","Time Out's older listing says it is open 24 hours, while Yelp's current listing shows Sunday 8am to 2am, so call before a late visit. The Infatuation says to stick to the mofongo.",False),
 ])

guide(slug="best-spots-for-families-washington-heights",
 title="The Best Spots for Families in Washington Heights",
 description="Family outings in Washington Heights: bridge-themed and adventure playgrounds, hilltop parks, a children's bookshop, and a lighthouse from a picture book.",
 intro=[
 "Washington Heights has plenty of green space, and most of it comes with a playground. This guide is for parents and caregivers planning an outing with kids, whether that means a morning at a playground, a walk to a landmark, or a stop for a book.",
 "We chose from the listings on The Heights that mention playgrounds, children's offerings, or families, and ranked them by how well each fits a day with kids. " + HONEST.strip(),
 "Most of these are parks, so hours and conditions come from NYC Parks. Check the listing page and NYC Parks before you plan around a recreation center or a specific playground."],
 picks=[
 ("j-hood-wright-park","Best playground","NYC Parks says the playground's adventure equipment was custom-designed to resemble the George Washington Bridge. The park also has courts, a dog-walking area, spray showers, and a recreation center.",False),
 ("fort-tryon-park","Best for a family walk","NYC Parks lists two playgrounds, lawns, picnic spots, and eight miles of paths. The park is steeply hilly, so allow extra time with small children.",False),
 ("bennett-park","Best for little kids","A small park on Manhattan's highest natural point, with a playground and the outline of Fort Washington in its paving. The listing calls it a pause rather than a day out.",False),
 ("highbridge-park","Best adventure playground","NYC Parks reports a 2021 reconstruction that added a renovated adventure playground, a fitness area, and a turf soccer field. The recreation center and pool are inside the park.",False),
 ("little-red-lighthouse","Best for fans of the book","A small lighthouse beneath the George Washington Bridge, given to the city in 1951 after a public outcry helped by the children's book The Little Red Lighthouse and the Great Gray Bridge. Interior access is limited to special days.",False),
 ("fountain-bookshop","Best bookshop","An independent bookshop with a robust children's section and titles in English and Spanish. Its calendar lists multiple book clubs and events.",False),
 ("burger-heights","Best casual bite","A counter-service burger shop with beef, turkey, and veggie patties, gelato shakes, and sidewalk seats, open daily from 11:30am to 10pm. It is mostly takeout, so seating is limited.",True),
 ])

guide(slug="history-lovers-guide-washington-heights",
 title="A History Lover's Guide to Washington Heights",
 description="Revolutionary War history, the High Bridge, a landmarked theater, the Malcolm X memorial, and a baseball-themed pub: history in Washington Heights.",
 intro=[
 "The neighborhood's name traces back to Fort Washington, the Revolutionary War fort that fell in 1776. This guide is for history readers who want to see where the fort stood, visit the Malcolm X memorial, and cross the city's oldest standing bridge, and for anyone who likes a neighborhood with layers.",
 "We chose from the landmark and history-linked listings on The Heights and ranked them by how much history each one carries and how much of it a visitor can actually see. " + HONEST.strip(),
 "Several of these are exteriors or buildings you see best with a ticket. Each blurb says what you can and cannot do."],
 picks=[
 ("morris-jumel-mansion","Best historic house","Manhattan's oldest surviving house, built about 1765 and Washington's headquarters in 1776, per the museum's site. As of October 28, 2026 it is closed for roof work, though the park and Saturday walking tours continue.",True),
 ("sylvan-terrace","Best historic block","A cobbled lane of twenty restored wooden row houses built in 1882-83 beside the mansion, among the few frame houses left in Manhattan. The houses are private homes, so view from the street.",True),
 ("555-edgecombe-avenue","Best for Harlem Renaissance and jazz","A 1914-16 apartment building that Wikipedia says housed Paul Robeson, Count Basie, Thurgood Marshall, and Jackie Robinson, now a National Historic Landmark. It is a private building, so see it from the sidewalk.",True),
 ("bennett-park","Best for the Revolutionary War","A small park on Manhattan's highest natural point, where Fort Washington fell to British and Hessian troops on November 16, 1776. Bluestone and granite paving outlines part of the fort.",False),
 ("malcolm-x-and-dr-betty-shabazz-memorial-center","Best for civil-rights history","A memorial and museum in the restored Audubon Ballroom, where Malcolm X was assassinated on February 21, 1965. Tickets must be bought in advance, and its listed hours are Tuesday to Friday.",False),
 ("the-high-bridge","Best for infrastructure history","Opened in 1848 to carry the Old Croton Aqueduct and reopened to pedestrians in 2015 after more than 40 years closed, per NYC Parks. Medallions in the walkway tell its history.",False),
 ("highbridge-water-tower","Best landmark you can see from afar","A 200-foot tower dating from 1872, designated a New York City Landmark in 1967. NYC Parks pages do not give current interior access, so treat it as an exterior sight.",False),
 ("united-palace","Best landmarked theater","Opened in 1930 as the Loew's 175th Street Theatre and designated a landmark in 2016, per Wikipedia and the Landmarks Preservation Commission. The best way to see inside is a ticketed event or tour.",False),
 ("hilltop-park-alehouse","Best baseball-history pint","A pub named for the 1903 Hilltop Park ballpark that was the original home of the team that became the Yankees, per the city tourism board's listing.",False),
 ])
