export const prayerCategories = [

    { id: 1, title: 'Namaz', color: '#4CAF50' },
    { id: 2, title: 'Ramazan', color: '#7E57C2' },
    { id: 3, title: 'Günlük', color: '#FF7043' },
    { id: 4, title: 'Diğer', color: '#26A69A' },
  ];
  
  export const prayers = {
    1: [ // Namaz Duaları
      {
        id: 1,
        name: "Sübhaneke Duası",
        arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلاَ إِلَهَ غَيْرُكَ",
        turkish: "Sübhaneke Allahümme ve bi hamdik ve tebarekesmük ve teala ceddük ve la ilahe ğayruk",
        meaning: "Allah'ım! Sen'i tüm eksikliklerden tenzih ederim. Sana hamd ederim. Senin ismin mübarektir. Senin şanın yücedir. Senden başka ilah yoktur.",
        audioUrl: require('../assets/dua/subhaneke.mp3')
      },
      {
        id: 2,
        name: "Ettehiyyatü Duası",
        arabic: "اَلتَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ اَلسَّلاَمُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ اَلسَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِينَ اَشْهَدُ اَنْ لاَ اِلَهَ اِلاَّ اللهُ وَاَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        turkish: "Ettehiyyatü lillahi vesselavatü vettayyibat. Esselamü aleyke eyyühen nebiyyü ve rahmetullahi ve berekatüh. Esselamü aleyna ve ala ibadillahis salihin. Eşhedü en la ilahe illallah ve eşhedü enne Muhammeden abdühü ve rasulüh",
        meaning: "Dil ile, beden ve mal ile yapılan bütün ibadetler Allah'a mahsustur. Ey Peygamber! Allah'ın selamı, rahmet ve bereketleri senin üzerine olsun. Selam bizim üzerimize ve Allah'ın salih kulları üzerine olsun. Şahitlik ederim ki, Allah'tan başka ilah yoktur. Yine şahitlik ederim ki, Muhammed O'nun kulu ve elçisidir.",
        audioUrl: require('../assets/dua/tahiyyat.mp3')
      },
      {
        id: 3,
        name: "Allahümme Salli ve Barik",
        arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ\n\nاللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
        turkish: "Allahümme salli ala Muhammedin ve ala ali Muhammed. Kema salleyte ala İbrahime ve ala ali İbrahim. İnneke hamidün mecid\n\nAllahümme barik ala Muhammedin ve ala ali Muhammed. Kema barekte ala İbrahime ve ala ali İbrahim. İnneke hamidün mecid",
        meaning: "Allah'ım! Muhammed'e ve Muhammed'in ümmetine rahmet eyle; şerefini yücelt. İbrahim'e ve İbrahim'in ümmetine rahmet ettiğin gibi. Şüphesiz övülmeye layık yalnız sensin, şan ve şeref sahibi de sensin.\n\nAllah'ım! Muhammed'e ve Muhammed'in ümmetine hayır ve bereket ver. İbrahim'e ve İbrahim'in ümmetine verdiğin gibi. Şüphesiz övülmeye layık yalnız sensin, şan ve şeref sahibi de sensin.",
        audioUrl: require('../assets/dua/salli-barik.mp3')
      },
      {
        id: 4,
        name: "Rabbena Duaları",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ\n\nرَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
        turkish: "Rabbena atina fid dünya haseneten ve fil ahireti haseneten ve kına azaben nar\n\nRabbenağfirli ve li valideyye ve lil müminine yevme yekumül hisab",
        meaning: "Rabbimiz! Bize dünyada iyilik ver, ahirette de iyilik ver. Bizi cehennem azabından koru.\n\nRabbimiz! Hesap gününde beni, ana-babamı ve bütün müminleri bağışla.",
        audioUrl: require('../assets/dua/rabbena.mp3')
      },
      {
        id: 5,
        name: "Kunut Duaları",
        arabic: "اَللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ وَنُؤْمِنُ بِكَ وَنَتُوبُ إِلَيْكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ كُلَّهُ نَشْكُرُكَ وَلاَ نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ",
        turkish: "Allahümme inna nesteınüke ve nestağfiruke ve nestehdik. Ve nü'minü bike ve netübü ileyk. Ve netevekkelü aleyke ve nüsni aleykel-hayra külleh. Neşküruke ve la nekfüruk. Ve nahleu ve netrukü men yefcüruk",
        meaning: "Allah'ım! Senden yardım isteriz, günahlarımızı bağışlamanı isteriz, razı olduğun şeylere hidayet etmeni isteriz. Sana inanırız, sana tevbe ederiz. Sana güveniriz. Bize verdiğin bütün nimetleri bilerek seni hayır ile överiz. Sana şükrederiz. Hiçbir nimetini inkar etmez ve onları başkasından bilmeyiz. Nimetlerini inkar eden ve sana karşı geleni bırakırız.",
        audioUrl: require('../assets/dua/kunut.mp3')
      }
    ],
    2: [ // Ramazan Duaları
      {
        id: 1,
        name: "Oruç Niyet Duası",
        arabic: "اللَّهُمَّ إِنِّي نَوَيْتُ صَوْمَ شَهْرِ رَمَضَانَ الْمُبَارَكِ فَرْضًا لَكَ فَتَقَبَّلْ مِنِّي إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
        turkish: "Allahümme inni neveytü savme şehri ramazanel mübareki fardan leke feteqabbel minni inneke entes semiul alim",
        meaning: "Allah'ım! Mübarek Ramazan ayının orucunu tutmaya niyet ettim. Bu orucu senin rızan için tutuyorum. Benden kabul eyle. Şüphesiz sen işiten ve bilensin."
      },
      {
        id: 2,
        name: "İftar Duası",
        arabic: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ وَإِلَيْكَ تَوَكَّلْتُ. ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
        turkish: "Allahümme leke sumtü ve bike amentü ve ala rızkıke eftartü ve aleyke tevekkeltü. Zehebed dameü vebtelletil uruku ve sebetel ecru inşaallah",
        meaning: "Allah'ım! Senin için oruç tuttum, sana iman ettim, senin rızkınla orucumu açtım ve sana tevekkül ettim. Susuzluk gitti, damarlar ıslandı ve Allah'ın izniyle ecir sabit oldu."
      },
      {
        id: 3,
        name: "Teravih Namazı Duası",
        arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
        turkish: "Rabbena tekabbel minna inneke entes semi'ul alim",
        meaning: "Rabbimiz! Bizden kabul buyur, şüphesiz sen işiten ve bilensin"
      },
      {
        id: 4,
        name: "Kadir Gecesi Duası",
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        turkish: "Allahümme inneke afüvvün tühibbül afve fa'fü anni",
        meaning: "Allah'ım! Sen affedicisin, affetmeyi seversin, beni de affet"
      },
      {
        id: 5,
        name: "Sahur Duası",
        arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
        turkish: "Ve bi savmi ğadin neveytü min şehri ramazan",
        meaning: "Ramazan ayının yarınki günü orucuna niyet ettim"
      }
    ],
    3: [ // Günlük Dualar
      {
        id: 1,
        name: "Sabah Duası",
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ. اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
        turkish: "Allahümme bike asbahna ve bike emseyna ve bike nahya ve bike nemutü ve ileyken nüşur. Allahümme ma asbaha bi min ni'metin ev bi ehadin min halgike feminke vahdeke la şerike leke felekel hamdü ve lekeş şükr",
        meaning: "Allah'ım! Senin rahmetinle sabahladık, senin rahmetinle akşamladık. Senin sayende yaşar, senin sayende ölürüz. Dönüş sanadır. Allah'ım! Bana ve yarattıklarından herhangi birine ulaşan her nimet yalnız sendendir. Ortağın yoktur. Hamd ve şükür sanadır."
      },
      {
        id: 2,
        name: "Akşam Duası",
        arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
        turkish: "Allahümme bike emseyna ve bike asbahna ve bike nahya ve bike nemutü ve ileykel masir",
        meaning: "Allah'ım! Senin rahmetinle akşamladık, senin rahmetinle sabahladık. Senin sayende yaşar, senin sayende ölürüz. Dönüş sanadır"
      },
      {
        id: 3,
        name: "Evden Çıkış Duası",
        arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        turkish: "Bismillahi tevekkeltü alallahi ve la havle ve la kuvvete illa billah",
        meaning: "Allah'ın adıyla. Allah'a tevekkül ettim. Güç ve kuvvet ancak Allah'ın yardımıyla elde edilir"
      },
      {
        id: 4,
        name: "Eve Giriş Duası",
        arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
        turkish: "Bismillahi velecna ve bismillahi haracna ve alallahi rabbina tevekkelna",
        meaning: "Allah'ın adıyla girdik, Allah'ın adıyla çıktık ve Rabbimiz Allah'a tevekkül ettik"
      },
      {
        id: 5,
        name: "Uyku Duası",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        turkish: "Bismikallahümme emutü ve ahya",
        meaning: "Allah'ım! Senin ismini anarak ölür (uyur) ve yine senin ismini anarak dirilirim (uyanırım)"
      }
    ],
    4: [ // Diğer Dualar
      {
        id: 1,
        name: "Şifa Duası",
        arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ شِفَاءً لاَ يُغَادِرُ سَقَمًا",
        turkish: "Allahümme rabben nas, ezhibilbe's, işfi enteş-şafi, la şifae illa şifauke şifaen la yüğadiru sekama",
        meaning: "Ey insanların Rabbi! Hastalığı gider, şifa ver. Şifa veren sensin. Senin şifandan başka şifa yoktur. Öyle bir şifa ver ki, hiçbir hastalık bırakmasın"
      },
      {
        id: 2,
        name: "Yolculuk Duası",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        turkish: "Sübhanellezi sahhara lena haza ve ma künna lehu mukrinin ve inna ila rabbina lemünkalibun",
        meaning: "Bunu bizim hizmetimize veren Allah'ı tesbih ederiz. Yoksa biz bunlara güç yetiremezdik. Şüphesiz biz Rabbimize döneceğiz"
      },
      {
        id: 3,
        name: "Sıkıntı Duası",
        arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        turkish: "La ilahe illa ente sübhaneke inni küntü minez-zalimin",
        meaning: "Senden başka ilah yoktur. Seni tenzih ederim. Gerçekten ben zalimlerden oldum"
      },
      {
        id: 4,
        name: "İlim Duası",
        arabic: "رَبِّ زِدْنِي عِلْمًا",
        turkish: "Rabbi zidni ilma",
        meaning: "Rabbim! İlmimi artır"
      },
      {
        id: 5,
        name: "Bereket Duası",
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
        turkish: "Allahümme barik lena fima razaktena ve kına azabennar",
        meaning: "Allah'ım! Bize verdiğin rızıkları bereketli kıl ve bizi cehennem azabından koru"
      }
    ]
  };