'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fil' | 'ceb';

const LANGUAGES: Language[] = ['en', 'fil', 'ceb'];

// Each entry: key -> [English, Filipino, Cebuano (Binisaya)]
const entries: Record<string, [string, string, string]> = {
  // Navigation
  'nav-home': ['Home', 'Tahanan', 'Panimalay'],
  'nav-services': ['Services', 'Mga Serbisyo', 'Mga Serbisyo'],
  'nav-government': ['Government', 'Pamahalaan', 'Gobyerno'],
  'nav-statistics': ['Statistics', 'Estadistika', 'Estadistika'],
  'nav-legislative': ['Legislative', 'Lehislatura', 'Lehislatura'],
  'nav-transparency': ['Transparency', 'Transparensiya', 'Transparensya'],
  'nav-contact': ['Contact', 'Makipag-ugnayan', 'Kontaka'],
  'nav-projects': ['Our Projects', 'Mga Proyekto Namin', 'Among mga Proyekto'],
  'nav-projects-budget': ['Budget Tracker', 'Budget Tracker', 'Budget Tracker'],
  'nav-projects-saln': ['SALN Tracker', 'SALN Tracker', 'SALN Tracker'],
  'nav-projects-infra': [
    'Infrastructure Tracker',
    'Infrastructure Tracker',
    'Infrastructure Tracker',
  ],
  'nav-projects-dynasties': ['Bukidnon Officials', 'Bukidnon Officials', 'Bukidnon Officials'],
  'nav-projects-all': ['All Projects', 'Lahat ng Proyekto', 'Tanang Proyekto'],
  'nav-opens-new-tab': [
    '(opens in a new tab)',
    '(magbubukas sa bagong tab)',
    '(mo-abli sa bag-ong tab)',
  ],

  // Services dropdown
  'dropdown-certificates': ['Certificates', 'Mga Sertipiko', 'Mga Sertipiko'],
  'dropdown-business': ['Business', 'Negosyo', 'Negosyo'],
  'dropdown-tax-payments': ['Tax Payments', 'Pagbabayad ng Buwis', 'Pagbayad og Buhis'],
  'dropdown-social-services': ['Social Services', 'Serbisyong Panlipunan', 'Serbisyong Sosyal'],
  'dropdown-health': ['Health', 'Kalusugan', 'Kahimsog'],
  'dropdown-agriculture': ['Agriculture', 'Agrikultura', 'Agrikultura'],
  'dropdown-infrastructure': ['Infrastructure', 'Imprastraktura', 'Imprastraktura'],
  'dropdown-education': ['Education', 'Edukasyon', 'Edukasyon'],
  'dropdown-public-safety': ['Public Safety', 'Kaligtasang Pampubliko', 'Kaluwasan sa Publiko'],
  'dropdown-environment': ['Environment', 'Kapaligiran', 'Kinaiyahan'],
  'dropdown-ordinance-framework': [
    'Ordinance Framework',
    'Balangkas ng Ordinansa',
    'Balangkas sa Ordinansa',
  ],
  'dropdown-resolution-framework': [
    'Resolution Framework',
    'Balangkas ng Resolusyon',
    'Balangkas sa Resolusyon',
  ],

  // Shared buttons and labels
  'btn-view-all': ['View All', 'Tingnan Lahat', 'Tan-awa Tanan'],
  'btn-view-all-services': [
    'View All Services',
    'Tingnan ang Lahat ng Serbisyo',
    'Tan-awa ang Tanang Serbisyo',
  ],
  'btn-view-officials': [
    'View All Officials',
    'Tingnan ang Lahat ng Opisyal',
    'Tan-awa ang Tanang Opisyal',
  ],
  'label-fee': ['Fee:', 'Bayad:', 'Bayad:'],
  'label-time': ['Time:', 'Oras:', 'Oras:'],
  'label-free': ['Free', 'Libre', 'Libre'],

  // Homepage: hero
  'hero-welcome': [
    'Welcome to BetterBukidnon.org',
    'Maligayang pagdating sa BetterBukidnon.org',
    'Maayong pag-abot sa BetterBukidnon.org',
  ],
  'hero-subtitle': [
    'Provincial services, officials, hotlines and public information for the people of Bukidnon, in one place.',
    'Mga serbisyo ng lalawigan, opisyal, hotline at pampublikong impormasyon para sa mga taga-Bukidnon, nasa iisang lugar.',
    'Mga serbisyo sa probinsya, opisyal, hotline ug pampublikong impormasyon para sa mga taga-Bukidnon, nahiusa sa usa ka lugar.',
  ],
  'hero-browse-services': ['Browse Services', 'Mag-browse ng Serbisyo', 'Tan-awa ang mga Serbisyo'],
  'hero-contact-us': ['Contact Us', 'Makipag-ugnayan sa Amin', 'Kontaka Mi'],
  'hero-find-service': ['Find a Service', 'Maghanap ng Serbisyo', 'Pangita og Serbisyo'],
  'hero-search-placeholder': [
    'e.g., real property tax, birth certificate, hotlines',
    'hal., buwis sa lupa, birth certificate, hotline',
    'pananglitan, buhis sa yuta, birth certificate, hotline',
  ],
  'hero-popular': ['Popular:', 'Sikat:', 'Popular:'],
  'hero-real-property-tax': [
    'Real Property Tax',
    'Buwis sa Real Property',
    'Buhis sa Real Property',
  ],
  'hero-birth-certificate': ['Birth Certificate', 'Birth Certificate', 'Birth Certificate'],
  'hero-social-assistance': ['Social Assistance', 'Tulong Panlipunan', 'Tabang Sosyal'],

  // Homepage: who handles what
  'home-lgu-cta-heading': [
    'Province, city or municipality: who handles what?',
    'Lalawigan, lungsod o munisipyo: sino ang may hawak ng ano?',
    'Probinsya, siyudad o lungsod: kinsa ang nag-atiman sa unsa?',
  ],
  'home-lgu-cta-subtitle': [
    'Birth certificates, business permits and barangay concerns go to your city or municipal hall. The Province runs provincial hospitals, roads, social welfare and more. Find the right office first.',
    'Ang birth certificate, business permit at usaping barangay ay sa inyong city o municipal hall. Ang Lalawigan ang may hawak ng mga ospital, kalsada, social welfare at iba pa. Alamin muna ang tamang opisina.',
    'Ang birth certificate, business permit ug mga isyu sa barangay naa sa inyong city o municipal hall. Ang Probinsya ang nag-atiman sa mga ospital, dalan, social welfare ug uban pa. Pangitaa una ang saktong buhatan.',
  ],
  'home-lgu-cta-find': [
    'Find your city or municipality',
    'Hanapin ang inyong lungsod o munisipyo',
    'Pangitaa ang inyong siyudad o lungsod',
  ],
  'home-lgu-cta-offices': [
    'Provincial offices',
    'Mga tanggapan ng lalawigan',
    'Mga buhatan sa probinsya',
  ],

  // Homepage: popular services
  'section-popular': ['Popular Services', 'Mga Sikat na Serbisyo', 'Mga Popular nga Serbisyo'],
  'popular-services-subtitle': [
    'Quick access to frequently requested services',
    'Mabilis na access sa madalas hinihinging serbisyo',
    'Dali nga access sa kanunay gihangyo nga mga serbisyo',
  ],
  'popular-browse-directory': [
    'Browse complete directory',
    'Tingnan ang kumpletong direktoryo',
    'Tan-awa ang kompletong direktoryo',
  ],
  'service-tax': ['Tax Payments', 'Pagbabayad ng Buwis', 'Pagbayad og Buhis'],
  'service-tax-desc': [
    'Real property tax and provincial fees',
    'Buwis sa real property at bayarin ng lalawigan',
    'Buhis sa real property ug bayranan sa probinsya',
  ],
  'service-social': ['Social Services', 'Serbisyong Panlipunan', 'Serbisyong Sosyal'],
  'service-social-desc': [
    'PSWDO assistance, seniors, PWD, IP welfare',
    'Tulong ng PSWDO, senior, PWD, kapakanan ng IP',
    'Tabang sa PSWDO, senior, PWD, kaayohan sa IP',
  ],
  'service-health': ['Health Services', 'Serbisyong Pangkalusugan', 'Serbisyo sa Kahimsog'],
  'service-health-desc': [
    'Provincial Health Office and hospitals',
    'Provincial Health Office at mga ospital',
    'Provincial Health Office ug mga ospital',
  ],
  'service-agriculture': ['Agriculture', 'Agrikultura', 'Agrikultura'],
  'service-agriculture-desc': [
    'Support for Bukidnon farmers',
    'Suporta para sa mga magsasaka ng Bukidnon',
    'Suporta para sa mga mag-uuma sa Bukidnon',
  ],
  'service-certificates': ['Certificates', 'Mga Sertipiko', 'Mga Sertipiko'],
  'service-certificates-desc': [
    'Birth, marriage and death records',
    'Talaan ng kapanganakan, kasal at kamatayan',
    'Mga rekord sa pagkahimugso, kasal ug kamatayon',
  ],

  // Homepage: at a glance
  'stats-at-a-glance': [
    'Bukidnon at a Glance',
    'Bukidnon sa Isang Sulyap',
    'Bukidnon sa Usa ka Tan-aw',
  ],
  'stats-view-statistics': [
    'View Statistics',
    'Tingnan ang Estadistika',
    'Tan-awa ang Estadistika',
  ],
  'stats-population-label': ['Population', 'Populasyon', 'Populasyon'],
  'stats-population-source': ['2024 Census', 'Sensus 2024', 'Sensus 2024'],
  'stats-barangays-label': ['Barangays', 'Mga Barangay', 'Mga Barangay'],
  'stats-barangays-source': [
    '2 cities, 20 municipalities',
    '2 lungsod, 20 munisipyo',
    '2 siyudad, 20 lungsod',
  ],
  'stats-first-class': ['1st Class', '1st Class', '1st Class'],
  'stats-province-label': ['Province', 'Lalawigan', 'Probinsya'],
  'stats-province-source': ['Income Classification', 'Uri ng Kita', 'Klasipikasyon sa Kinitaan'],
  'stats-land-area-label': ['Land Area', 'Lawak ng Lupa', 'Gidak-on sa Yuta'],
  'stats-land-area-source': [
    '3rd largest province',
    'Ika-3 pinakamalaking lalawigan',
    'Ika-3 nga pinakadako nga probinsya',
  ],

  // Homepage: weather and map
  'weather-map-title': [
    'Weather and Map of Bukidnon',
    'Panahon at Mapa ng Bukidnon',
    'Panahon ug Mapa sa Bukidnon',
  ],
  'weather-mainly-clear': ['Mainly clear', 'Halos maaliwalas', 'Kasagaran hayag'],
  'weather-location': ['Malaybalay City', 'Lungsod ng Malaybalay', 'Dakbayan sa Malaybalay'],
  'home-capitol-address': [
    'Provincial Capitol, Malaybalay City, Bukidnon 8700',
    'Provincial Capitol, Lungsod ng Malaybalay, Bukidnon 8700',
    'Provincial Capitol, Dakbayan sa Malaybalay, Bukidnon 8700',
  ],

  // Homepage: history
  'history-title': [
    'Brief History of Bukidnon',
    'Maikling Kasaysayan ng Bukidnon',
    'Mubo nga Kasaysayan sa Bukidnon',
  ],
  'history-precolonial-label': ['Before 1850', 'Bago ang 1850', 'Sa wala pa ang 1850'],
  'history-precolonial': [
    'The highlands are home to the Bukidnon, Higaonon, Talaandig, Manobo, Matigsalug, Tigwahanon and Umayamnon peoples, the seven tribes of Bukidnon.',
    'Ang kabundukan ay tahanan ng mga Bukidnon, Higaonon, Talaandig, Manobo, Matigsalug, Tigwahanon at Umayamnon, ang pitong tribo ng Bukidnon.',
    'Ang kabukiran panimalay sa mga Bukidnon, Higaonon, Talaandig, Manobo, Matigsalug, Tigwahanon ug Umayamnon, ang pito ka tribo sa Bukidnon.',
  ],
  'history-1850s': [
    'Under Spanish rule, the area becomes part of the province of Misamis.',
    'Sa ilalim ng pamamahalang Espanyol, ang lugar ay naging bahagi ng lalawigan ng Misamis.',
    'Ubos sa pagmando sa mga Espanyol, ang lugar nahimong bahin sa probinsya sa Misamis.',
  ],
  'history-1907': [
    'Act No. 1693 creates the province of Agusan with Bukidnon as a sub-province. Malaybalay becomes its capital.',
    'Nilikha ng Act No. 1693 ang lalawigan ng Agusan na may Bukidnon bilang sub-province. Ang Malaybalay ang naging kabisera nito.',
    'Gimugna sa Act No. 1693 ang probinsya sa Agusan nga ang Bukidnon usa ka sub-province. Ang Malaybalay nahimong kapital niini.',
  ],
  'history-1917': [
    "Act No. 2711 makes Bukidnon a regular province on 10 March, now celebrated as the province's founding anniversary.",
    'Ginawang regular na lalawigan ang Bukidnon ng Act No. 2711 noong 10 Marso, na ngayon ay ipinagdiriwang bilang anibersaryo ng pagkakatatag ng lalawigan.',
    'Gihimong regular nga probinsya ang Bukidnon sa Act No. 2711 niadtong 10 Marso, nga karon gisaulog isip anibersaryo sa pagkatukod sa probinsya.',
  ],
  'history-1977': [
    'The first organized Kaamulan Festival is held (25–27 November), sponsored by the provincial government.',
    'Idinaos ang unang organisadong Kaamulan Festival (25–27 Nobyembre), na itinaguyod ng pamahalaang panlalawigan.',
    'Gihimo ang unang giorganisar nga Kaamulan Festival (25–27 Nobyembre), nga gipasiugdahan sa gobyerno sa probinsya.',
  ],
  'history-cityhood': [
    'Malaybalay becomes a city in 1998 (Republic Act No. 8490), followed by Valencia in 2001.',
    'Naging lungsod ang Malaybalay noong 1998 (Republic Act No. 8490), kasunod ang Valencia noong 2001.',
    'Nahimong siyudad ang Malaybalay niadtong 1998 (Republic Act No. 8490), gisundan sa Valencia niadtong 2001.',
  ],
  'history-2012': [
    'Republic Act No. 10184 divides Bukidnon into four congressional districts, in effect from the 2013 elections.',
    'Hinati ng Republic Act No. 10184 ang Bukidnon sa apat na distritong pangkongreso, simula sa halalan ng 2013.',
    'Gibahin sa Republic Act No. 10184 ang Bukidnon ngadto sa upat ka distrito sa kongreso, nga epektibo sukad sa eleksyon sa 2013.',
  ],
  'history-card-tribes-title': [
    'A Gathering of Tribes',
    'Pagtitipon ng mga Tribo',
    'Panagtigom sa mga Tribo',
  ],
  'history-card-tribes': [
    'Kaamulan comes from the Binukid word "amul", to gather. The festival brings the seven tribes to Malaybalay around the 10 March founding anniversary.',
    'Ang Kaamulan ay mula sa salitang Binukid na "amul", ang magtipon. Pinagsasama ng pista ang pitong tribo sa Malaybalay sa paligid ng anibersaryo ng pagkakatatag tuwing 10 Marso.',
    'Ang Kaamulan gikan sa pulong nga Binukid nga "amul", ang pagtigom. Gihiusa sa kapistahan ang pito ka tribo sa Malaybalay duol sa anibersaryo sa pagkatukod matag 10 Marso.',
  ],
  'history-card-highlands-title': [
    'Highlands of Mindanao',
    'Kabundukan ng Mindanao',
    'Kabukiran sa Mindanao',
  ],
  'history-card-highlands': [
    'Mount Dulang-dulang in the Kitanglad Range, about 2,938 meters high, is the second highest peak in the Philippines. Bukidnon\'s plateau farms earn it the name "food basket of Mindanao".',
    'Ang Bundok Dulang-dulang sa Kitanglad Range, mga 2,938 metro ang taas, ang pangalawang pinakamataas na tuktok sa Pilipinas. Dahil sa mga sakahan sa talampas, tinatawag ang Bukidnon na "food basket ng Mindanao".',
    'Ang Bukid sa Dulang-dulang sa Kitanglad Range, mga 2,938 metros ang gitas-on, mao ang ikaduha nga pinakataas nga tuktok sa Pilipinas. Tungod sa mga umahan sa patag nga kabukiran, gitawag ang Bukidnon nga "food basket sa Mindanao".',
  ],

  // Homepage: updates
  'section-updates': ['Latest Updates', 'Mga Pinakabagong Balita', 'Pinakabag-ong mga Balita'],
  'updates-eyebrow': [
    'Official Facebook Page',
    'Opisyal na Facebook Page',
    'Opisyal nga Facebook Page',
  ],
  'updates-desc': [
    'News and announcements from the Provincial Government of Bukidnon are posted on its Facebook page.',
    'Ang mga balita at anunsyo ng Pamahalaang Panlalawigan ng Bukidnon ay nakapost sa Facebook page nito.',
    'Ang mga balita ug pahibalo sa Gobyerno sa Probinsya sa Bukidnon gipost sa Facebook page niini.',
  ],
  'updates-cta': [
    'Open LGU Bukidnon on Facebook',
    'Buksan ang LGU Bukidnon sa Facebook',
    'Ablihi ang LGU Bukidnon sa Facebook',
  ],

  // Homepage: leadership
  'section-leadership': ['Provincial Leadership', 'Pamunuan ng Lalawigan', 'Pamunuan sa Probinsya'],
  'title-governor': ['Governor', 'Gobernador', 'Gobernador'],
  'title-vice-governor': ['Vice Governor', 'Bise Gobernador', 'Bise Gobernador'],
  'home-pgo': [
    "Provincial Governor's Office",
    'Tanggapan ng Gobernador ng Lalawigan',
    'Buhatan sa Gobernador sa Probinsya',
  ],
  'home-sp-presiding-officer': [
    'Presiding Officer, Sangguniang Panlalawigan',
    'Pangulong Tagapamahala, Sangguniang Panlalawigan',
    'Presiding Officer, Sangguniang Panlalawigan',
  ],
  'home-view-legislative': ['Provincial Board', 'Lupon ng Lalawigan', 'Lupon sa Probinsya'],
  'home-leadership-term': ['Term 2025–2028', 'Termino 2025–2028', 'Termino 2025–2028'],

  // Homepage: contact
  'section-contact': [
    'Contact Information',
    'Impormasyon sa Pakikipag-ugnayan',
    'Impormasyon sa Kontak',
  ],
  'contact-phone': ['Phone', 'Telepono', 'Telepono'],
  'contact-hours': [
    'Mon-Fri: 8:00 AM - 5:00 PM',
    'Lun-Biy: 8:00 AM - 5:00 PM',
    'Lun-Byi: 8:00 AM - 5:00 PM',
  ],
  'contact-website': ['Official Website', 'Opisyal na Website', 'Opisyal nga Website'],
  'contact-website-note': [
    'Provincial Government of Bukidnon',
    'Pamahalaang Panlalawigan ng Bukidnon',
    'Gobyerno sa Probinsya sa Bukidnon',
  ],
  'contact-address': ['Address', 'Tirahan', 'Adres'],
  'contact-capitol-compound': [
    'Provincial Capitol Compound',
    'Provincial Capitol Compound',
    'Provincial Capitol Compound',
  ],
  'contact-capitol-city': [
    'Malaybalay City, Bukidnon 8700',
    'Lungsod ng Malaybalay, Bukidnon 8700',
    'Dakbayan sa Malaybalay, Bukidnon 8700',
  ],

  // Homepage: volunteer
  'volunteer-heading': [
    'Built by Bukidnonon volunteers',
    'Gawa ng mga boluntaryong taga-Bukidnon',
    'Gihimo sa mga boluntaryo nga Bukidnon',
  ],
  'volunteer-subtitle': [
    'BetterBukidnon.org is a civic project, not an official government website.',
    'Ang BetterBukidnon.org ay proyektong sibiko, hindi opisyal na website ng pamahalaan.',
    'Ang BetterBukidnon.org usa ka sibikong proyekto, dili opisyal nga website sa gobyerno.',
  ],
  'volunteer-description': [
    'We gather public information about the Province of Bukidnon and present it in a way that is easy to find and read. Spot an error, or want to help with code, design, research or translation? Join us.',
    'Kinokolekta namin ang pampublikong impormasyon tungkol sa Lalawigan ng Bukidnon at ipinapakita ito sa paraang madaling hanapin at basahin. May nakitang mali, o gustong tumulong sa code, disenyo, pananaliksik o pagsasalin? Sumama sa amin.',
    'Gitigom namo ang pampublikong impormasyon bahin sa Probinsya sa Bukidnon ug gipresentar kini sa paagi nga sayon pangitaon ug basahon. Naay sayop nga nakita, o gusto motabang sa code, disenyo, panukiduki o hubad? Apil sa amo.',
  ],
  'volunteer-cta': ['Contribute on GitHub', 'Mag-ambag sa GitHub', 'Amot sa GitHub'],

  // Footer
  'footer-tagline': [
    'Empowering the people of Bukidnon with transparent access to the services, programs, and public funds of LGU Bukidnon.',
    'Binibigyang-lakas ang mga taga-Bukidnon sa malinaw na pag-access sa mga serbisyo, programa at pondong pampubliko ng LGU Bukidnon.',
    'Gihatagan og gahum ang mga taga-Bukidnon pinaagi sa klaro nga access sa mga serbisyo, programa ug pondo sa publiko sa LGU Bukidnon.',
  ],
  'footer-quick-links': ['Quick Links', 'Mga Mabilisang Link', 'Dali nga mga Link'],
  'footer-resources': ['Resources', 'Mga Mapagkukunan', 'Mga Kapanguhaan'],
  'footer-sitemap': ['Sitemap', 'Mapa ng Site', 'Mapa sa Site'],
  'footer-citizens-charter': ["Citizen's Charter", "Citizen's Charter", "Citizen's Charter"],
  'footer-terms': ['Terms of Use', 'Mga Tuntunin ng Paggamit', 'Mga Termino sa Paggamit'],
  'footer-privacy': ['Privacy Policy', 'Patakaran sa Privacy', 'Palisiya sa Privacy'],
  'footer-accessibility': ['Accessibility', 'Aksesibilidad', 'Aksesibilidad'],
  'footer-faq': ['FAQ', 'FAQ', 'FAQ'],
  'footer-open-data': ['Open Data Philippines', 'Open Data Philippines', 'Open Data Philippines'],
  'footer-foi': ['Freedom of Information', 'Kalayaan sa Impormasyon', 'Kagawasan sa Impormasyon'],
  'footer-lgu-portal': [
    'Official LGU Bukidnon Portal',
    'Opisyal na Portal ng LGU Bukidnon',
    'Opisyal nga Portal sa LGU Bukidnon',
  ],
  'footer-sb': ['Sangguniang Panlalawigan', 'Sangguniang Panlalawigan', 'Sangguniang Panlalawigan'],
  'footer-lgu-facebook': [
    'LGU Bukidnon Facebook',
    'Facebook ng LGU Bukidnon',
    'Facebook sa LGU Bukidnon',
  ],
  'footer-blgf': ['BLGF Portal', 'BLGF Portal', 'BLGF Portal'],
  'footer-cmci': ['CMCI DTI Portal', 'CMCI DTI Portal', 'CMCI DTI Portal'],
  'footer-cost': [
    'Cost to the People of Bukidnon =',
    'Gastos ng mga Taga-Bukidnon =',
    'Gasto sa mga Taga-Bukidnon =',
  ],
  'footer-volunteer': ['Volunteer with us', 'Mag-volunteer sa amin', 'Mag-volunteer uban namo'],
  'footer-contribute': [
    'Contribute code with us',
    'Mag-ambag ng code sa amin',
    'Amot og code uban namo',
  ],
  'footer-copyright-text': ['BetterBukidnon.org', 'BetterBukidnon.org', 'BetterBukidnon.org'],
  'footer-copyright-disclaimer': [
    'Volunteer civic project, not an official government website. Built on the BetterSolano template (MIT).',
    'Proyektong sibiko ng mga boluntaryo, hindi opisyal na website ng pamahalaan. Binuo gamit ang template ng BetterSolano (MIT).',
    'Boluntaryong sibikong proyekto, dili opisyal nga website sa gobyerno. Gitukod gamit ang template sa BetterSolano (MIT).',
  ],

  // Health page
  'health-page-title': ['Health Services', 'Serbisyong Pangkalusugan', 'Serbisyo sa Kahimsog'],
  'health-page-badge': ['Health', 'Kalusugan', 'Kahimsog'],
  'health-page-desc': [
    'Health services in Bukidnon are led by the Provincial Health Office. Contact the office for current programs, schedules and requirements.',
    'Ang mga serbisyong pangkalusugan sa Bukidnon ay pinamumunuan ng Provincial Health Office. Makipag-ugnayan sa tanggapan para sa kasalukuyang programa, iskedyul at rekisito.',
    'Ang mga serbisyo sa kahimsog sa Bukidnon gipangunahan sa Provincial Health Office. Kontaka ang buhatan alang sa karon nga mga programa, iskedyul ug rekisito.',
  ],
  'health-section-pho': [
    'Provincial Health Office',
    'Provincial Health Office',
    'Provincial Health Office',
  ],
  'health-pho-title': [
    'Provincial Health Office (PHO)',
    'Provincial Health Office (PHO)',
    'Provincial Health Office (PHO)',
  ],
  'health-pho-desc': [
    'The Provincial Health Office of the Provincial Government of Bukidnon is based at the Provincial Capitol Compound in Malaybalay City.',
    'Ang Provincial Health Office ng Pamahalaang Panlalawigan ng Bukidnon ay nasa Provincial Capitol Compound sa Lungsod ng Malaybalay.',
    'Ang Provincial Health Office sa Gobyerno sa Probinsya sa Bukidnon naa sa Provincial Capitol Compound sa Dakbayan sa Malaybalay.',
  ],
  'health-label-phone': ['Phone', 'Telepono', 'Telepono'],
  'health-label-address': ['Address', 'Tirahan', 'Adres'],
  'health-address-value': [
    'Provincial Capitol Compound, Malaybalay City',
    'Provincial Capitol Compound, Lungsod ng Malaybalay',
    'Provincial Capitol Compound, Dakbayan sa Malaybalay',
  ],
  'health-label-hours': ['Office hours', 'Oras ng tanggapan', 'Oras sa buhatan'],
  'health-hours-value': [
    'Monday to Friday, 8:00 AM to 5:00 PM',
    'Lunes hanggang Biyernes, 8:00 AM hanggang 5:00 PM',
    'Lunes hangtod Byernes, 8:00 AM hangtod 5:00 PM',
  ],
  'health-details-link': [
    'See Provincial Health Office details',
    'Tingnan ang detalye ng Provincial Health Office',
    'Tan-awa ang detalye sa Provincial Health Office',
  ],
  'health-emergency-title': ['In an emergency', 'Sa oras ng emerhensiya', 'Kung emerhensya'],
  'health-emergency-desc': [
    'Call 911, the National Emergency Hotline.',
    'Tumawag sa 911, ang National Emergency Hotline.',
    'Tawag sa 911, ang National Emergency Hotline.',
  ],
  'health-gathering': [
    'We are still gathering the list of PHO services, requirements and fees. Until then, please confirm details with the office.',
    'Kinokolekta pa namin ang listahan ng mga serbisyo, rekisito at bayarin ng PHO. Hanggang noon, makipag-ugnayan muna sa tanggapan para sa detalye.',
    'Gitigom pa namo ang lista sa mga serbisyo, rekisito ug bayranan sa PHO. Hangtod niana, palihug kumpirmaha una ang detalye sa buhatan.',
  ],
};

function build(index: 0 | 1 | 2): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Object.keys(entries)) out[key] = entries[key][index];
  return out;
}

const translations: Record<Language, Record<string, string>> = {
  en: build(0),
  fil: build(1),
  ceb: build(2),
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('selectedLang') as Language;
    if (savedLang && LANGUAGES.includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('selectedLang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
