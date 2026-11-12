/* ==========================================================================
   Hotel Tandoor Corner · content & settings
   --------------------------------------------------------------------------
   Everything an owner is likely to change lives in this file.
   · English text sits in index.html (search for the words you want to change).
   · Marathi text is in `mr` below, matched by the data-i18n key in index.html.
   ========================================================================== */
window.TC = {

  config: {
    name: 'Hotel Tandoor Corner',
    tz: 'Asia/Kolkata',

    /* Opening hours, 24h clock, same every day: 11:30 AM to 11 PM (confirmed by the owner).
       The "Open now" badge, the hero status and the Hours section all read from here.
       A closing time after midnight works too (e.g. close: '00:30'). */
    hours: { open: '11:30', close: '23:00' },

    phone: '+917722035401',
    phoneDisplay: '077220 35401',
    address: {
      street: 'Kolhapur-Radhanagari Rd, next to Puikhadi, Pirwadi',
      city: 'Kolhapur', region: 'Maharashtra', postal: '416011', country: 'IN'
    },
    geo: { lat: 16.6582217, lng: 74.1915623 },
    links: {
      directions: 'https://www.google.com/maps/dir//Hotel+Tandoor+Corner+veg+nonveg+family+restaurants/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3bc05539aa6747a3:0xf012c787727160c',
      zomato: 'https://www.zomato.com/kolhapur/hotel-tandoor-corner-deokar-panand/order',
      facebook: 'https://www.facebook.com/HotelTandoorCorner/photos/'
    }
  },

  /* Text that is assembled by script (both languages). {t} {o} {c} are times. */
  dyn: {
    en: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      summary: 'Every day · {o} – {c}',
      openPill: 'Open now · till {t}', openK: 'Open now!', openSub: 'till {t} tonight',
      soonPill: 'Opens today at {t}', soonK: 'Opens today', soonSub: 'at {t}',
      shutPill: 'Opens tomorrow at {t}', shutK: 'Closed now', shutSub: 'back tomorrow at {t}',
      openPillS: 'Open till {t}', soonPillS: 'Opens {t}', shutPillS: 'Closed now',        // short forms for phones
      cursor: { go: 'Go', call: 'Call' },
      marquee: {
        a: ['Tambda Rassa', 'Pandhara Rassa', 'Chicken Tandoori', 'Kolhapuri Thali'],
        b: ['Veg & Non-veg', 'Family halls', 'AC seating', 'Bar & lounge', 'Rooms', 'Open every day'],
        n1: ['Tambda Rassa', 'Chicken Tandoori', 'Paneer Tikka', 'Veg Thali', 'Biryani'],
        n2: ['Pandhara Rassa', 'Butter Chicken', 'Seafood', 'Non-veg Thali', 'Roti & Naan']
      }
    },
    mr: {
      days: ['सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'],
      summary: 'दररोज · {o} – {c}',
      openPill: 'आत्ता सुरू · {t} पर्यंत', openK: 'आत्ता सुरू!', openSub: 'आज {t} पर्यंत',
      soonPill: 'आज {t} ला सुरू', soonK: 'आज सुरू होणार', soonSub: '{t} ला',
      shutPill: 'उद्या {t} ला सुरू', shutK: 'आत्ता बंद', shutSub: 'उद्या {t} ला पुन्हा सुरू',
      openPillS: '{t} पर्यंत सुरू', soonPillS: '{t} ला सुरू', shutPillS: 'आत्ता बंद',
      cursor: { go: 'चला', call: 'कॉल' },
      marquee: {
        a: ['तांबडा रस्सा', 'पांढरा रस्सा', 'चिकन तंदुरी', 'कोल्हापुरी थाळी'],
        b: ['व्हेज · नॉन-व्हेज', 'फॅमिली हॉल', 'एसी बैठक', 'बार आणि लाउंज', 'रूम्स', 'दररोज सुरू'],
        n1: ['तांबडा रस्सा', 'चिकन तंदुरी', 'पनीर टिक्का', 'व्हेज थाळी', 'बिर्याणी'],
        n2: ['पांढरा रस्सा', 'बटर चिकन', 'सीफूड', 'नॉन-व्हेज थाळी', 'रोटी-नान']
      }
    }
  },

  /* Marathi for every data-i18n key in index.html */
  mr: {
    'meta.title': 'हॉटेल तंदूर कॉर्नर · व्हेज आणि नॉन-व्हेज फॅमिली रेस्टॉरंट, कोल्हापूर',

    'brand.word': 'तंदूर',
    'brand.corner': 'कॉर्नर',
    'brand.cornerCaps': 'कॉर्नर',

    'intro.m1': 'तंदूर पेटतोय…',
    'intro.m2': 'मसाला भाजतोय…',
    'intro.m3': 'रस्सा उकळतोय…',
    'intro.m4': 'भाकरी थापतोय…',
    'intro.go': 'या, जेवायला!',

    'nav.call': 'कॉल करा',
    'nav.home': 'हॉटेल तंदूर कॉर्नर, वर जा',

    'hero.word': 'तंदूर•कॉर्नर',          // • is where the plate sits
    'hero.script': 'कोल्हापूर',
    'hero.pattern': 'तंदूर कॉर्नर',
    'hero.k1': 'व्हेज · नॉन-व्हेज',
    'hero.k2': 'फॅमिली रेस्टॉरंट',
    'hero.k3': 'कोल्हापूर',
    'hero.tag': 'कोल्हापूरची<br>अस्सल चव,<br>थेट<br>तंदूरमधून.',
    'hero.stamp': 'गूगलवर ४.१ · १,८६९ रिव्ह्यूज · व्हेज · नॉन-व्हेज ·',
    'hero.stampLabel': 'गूगलवर १,८६९ रिव्ह्यूजमधून ५ पैकी ४.१ रेटिंग',
    'hero.rating': '४.१',
    'hero.scroll': 'खाली या',

    'def.word': 'तंदूर कॉर्नर',
    'def.phon': '[तं-दूर · कॉ-र्नर]',
    'def.pos': 'नाम',
    'def.kind': 'अस्सल कोल्हापुरी',
    'def.text': 'राधानगरी रोडवरचं असं ठिकाण, जिथे तुम्ही “फक्त एक प्लेट” म्हणून थांबता, मग तंदुरी मागवता, मग अजून एक रोटी, मग रस्स्याची आणखी एक वाटी… आणि ठरवलं होतं त्यापेक्षा खूप जास्त वेळ बसता. अचानक लागणारी भूक, <mark>“अजून एक वाटी रस्सा!”</mark> अशा हाका आणि वेळेत कधीच न संपणारी कौटुंबिक जेवणं यासाठी प्रसिद्ध.',
    'def.syn': '<strong>समानार्थी:</strong> <mark>चविष्ट सापळा</mark>, घरचं टेबल, अचानक लागलेली भूक',
    'def.sign': 'अजून एक वाटी<br>रस्सा!',
    'def.alt1': 'कांदा-लिंबूसोबत ज्वारीची भाकरी',
    'def.alt2': 'चिकन तंदुरी आणि तांबड्या रस्स्याची वाटी',

    'build.kicker': 'थाळी · रस्सा · भाकरी',
    'build.title': 'कोल्हापुरी<br>थाळी,<br>अगदी सोपी.',
    'build.s1': 'भाकरी', 'build.d1': 'हाताने थापलेली. थेट तव्यावरून.',
    'build.s2': 'तांबडा रस्सा', 'build.d2': 'तांबडा. झणझणीत.',
    'build.s3': 'पांढरा रस्सा', 'build.d3': 'पांढरा. सगळं शांत करणारा.',
    'build.s4': 'सुक्कं', 'build.d4': 'सुकं, खमंग, मसालेदार.',
    'build.s5': 'भात, कांदा, लिंबू', 'build.d5': 'सगळं ताटात. तयार. या!',
    'build.result': 'कोल्हापुरी थाळी',
    'build.resultText': 'सगळं एकाच ताटात.<br>हाताने खाल्लं की खरी मजा.',
    'build.twistK': 'तीच आग, वेगळा अंदाज',
    'build.twist': 'चिकन तंदुरी',
    'build.twistText': 'थेट तंदूरमधून,<br>कांदा-लिंबूसोबत.',

    'gal.bg': 'झणझणीत',
    'gal.kicker': 'तंदूर कॉर्नरचं कोल्हापुरी स्वयंपाकघर',
    'gal.title': 'एकदम<br>झणझणीत.',
    'gal.gloss': '',
    'gal.1': 'तांबडा रस्सा', 'gal.2': 'चिकन तंदुरी', 'gal.3': 'पांढरा रस्सा', 'gal.4': 'पनीर टिक्का',
    'gal.5': 'बटर चिकन', 'gal.6': 'फिश फ्राय', 'gal.7': 'बिर्याणी', 'gal.8': 'कोल्हापुरी थाळी',
    'gal.cta': 'या, जेवायला!',
    'gal.ctaSub': 'ताट वाट बघतंय.',

    'names.kicker': 'काय घ्यावं कळेना?',
    'names.title': 'दहा नावं,<br>एकच सल्ला:',
    'names.shout': 'पोट भरून जेवा!',
    'names.sub': 'पूर्ण मेन्यू तुमच्या टेबलावर वाट बघतोय.',

    'price.title': 'बिलाचा साधारण अंदाज',
    'price.1': 'सूप आणि रस्सा',
    'price.2': 'रोटी आणि स्टार्टर्स',
    'price.3': 'मेन कोर्स <small>पनीर · चिकन · मटण</small>',
    'price.4': 'भात आणि बिर्याणी',
    'price.note': 'अंदाजे दर. मेन्यू आणि किंमती बदलू शकतात.',

    'duo.kicker': 'एक शहर, दोन रस्से',
    'duo.script': 'थोडा तांबडा,<br>थोडा पांढरा',
    'duo.capA': 'तांबडा · झणझणीत',
    'duo.capB': 'पांढरा · शांत करणारा',
    'duo.altA': 'तांबड्या रस्स्याची वाटी',
    'duo.altB': 'पांढऱ्या रस्स्याची वाटी',

    'fam.cap1': 'पोटभर!', 'fam.cap2': 'फॅमिली हॉल', 'fam.cap3': 'निवांत!',
    'fam.alt1': 'भरलेलं टेबल: थाळी, तंदुरी आणि रस्सा',
    'fam.alt2': 'फॅमिली डायनिंग हॉल',
    'fam.alt3': 'डबल बेड आणि एसी असलेली रूम',
    'fam.title': 'एक टेबल,<br>सगळं कुटुंब.',
    'fam.lead': 'प्रशस्त फॅमिली हॉल, निवांत बैठक, एसी विभाग, बार आणि लाउंज… आणि जेवण लांबलंच तर इथेच राहायला रूम्स.',
    'fam.src': 'गूगलवर १,८६९ रिव्ह्यूजमधून ४.१. पाहुणे नेहमी हेच सांगतात:',
    'fam.s1': 'ताजं, चविष्ट जेवण',
    'fam.s2': 'स्वच्छ, आरामदायी हॉल',
    'fam.s3': 'नम्र, तत्पर स्टाफ',
    'fam.s4': 'वाजवी दर',

    'hours.kicker': 'स्वयंपाकघर सुरू आहे',
    'hours.title': 'वेळ',
    'hours.today': 'आज!',
    'hours.days': 'दररोज',
    'hours.script': 'निवांत या,<br>पोटभर जेवा.',
    'hours.clock': 'कोल्हापूरची वेळ',
    'hours.clockLabel': 'कोल्हापूरची सध्याची वेळ दाखवणारं घड्याळ',

    'visit.water': 'कोल्हापूर · राधानगरी रोड · इथेच! · ',
    'visit.kicker': 'तंदूर कॉर्नर आहे',
    'visit.title': 'राधानगरी<br>रोडवर',
    'visit.addr': 'कोल्हापूर–राधानगरी रोड,<br>पुईखडी शेजारी, पिरवाडी<br>कोल्हापूर ४१६०११',
    'visit.near': 'रंकाळा तलावापासून साधारण ४ किमी',
    'visit.dir': 'दिशा पहा',
    'visit.zomato': 'झोमॅटोवर ऑर्डर',
    'visit.fb': 'फेसबुक',
    'visit.mapLabel': 'हॉटेल तंदूर कॉर्नरच्या परिसराचा नकाशा. गूगल मॅप्समध्ये दिशा उघडतो.',
    'visit.stamp': 'राधानगरी रोड · कोल्हापूर · ४१६०११ · या जेवायला ·',

    'chip.1': 'फॅमिली हॉल', 'chip.2': 'एसी बैठक', 'chip.3': 'बार आणि लाउंज', 'chip.4': 'रूम्स',

    'map.north': 'कोल्हापूर · रंकाळा',
    'map.south': 'राधानगरीकडे',
    'map.road': 'राधानगरी रोड',
    'map.here': 'इथेच!',
    'map.name': 'तंदूर कॉर्नर',

    'end.cardK': 'घरीच भूक लागली? तीच चव घरपोच.',
    'end.card': 'झोमॅटोवर ऑर्डर',
    'end.gloss': 'म्हणजे: चला, ताट वाढलंय!',
    'end.shout': 'या जेवायला!',
    'end.tag': 'व्हेज · नॉन-व्हेज फॅमिली रेस्टॉरंट',
    'end.copy': '© २०२६ हॉटेल तंदूर कॉर्नर, कोल्हापूर',
    'end.psst': 'श्श्श… इथे कुठेही टॅप करा, अजून मिरच्या पडतील.'
  }
};
