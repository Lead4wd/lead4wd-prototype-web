export type Question = {
  id: string;
  number: number;
  text: string;
  options: string[];
  correctOptionIndex?: number;
};

export type Module = {
  id: string;
  title: string;
  questions: Question[];
};

export type LanguageCode = 'en' | 'hi' | 'te';

export const UI_STRINGS: Record<LanguageCode, Record<string, string>> = {
  en: {
    welcomeBack: "Welcome back",
    enterDetails: "Please enter your details",
    emailPlaceholder: "Email address",
    passwordPlaceholder: "Password",
    rememberMe: "Remember for 30 days",
    forgotPassword: "Forgot password?",
    login: "Login",
    signInGoogle: "Sign in with Google",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    welcomeTitle: "Welcome to Lead4wd",
    welcomeUser: "Welcome",
    profile: "Profile",
    yourProgress: "Your Progress",
    completedPrefix: "You have completed",
    completedSuffix: "questions.",
    outOf: "out of",
    question: "Question",
    needsReview: "Needs Review",
    back: "Back",
    submitAnswer: "Submit Answer",
    correct: "Correct!",
    incorrect: "Incorrect answer. Try again!",
    previous: "Previous",
    next: "Next",
    nextModule: "Next Module",
    finishCourse: "Finish Course",
    userProfile: "User Profile",
    esc: "Esc",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone Number",
    saveChanges: "Save Changes",
    changePassword: "Change Password",
    deleteAccount: "Delete Account",
    logout: "Log Out",
    dummyBtn: "this is a dummy button",
    skip: "Skip"
  },
  hi: {
    welcomeBack: "वापसी पर स्वागत है",
    enterDetails: "कृपया अपना विवरण दर्ज करें",
    emailPlaceholder: "ईमेल पता",
    passwordPlaceholder: "पासवर्ड",
    rememberMe: "30 दिनों के लिए याद रखें",
    forgotPassword: "पासवर्ड भूल गए?",
    login: "लॉग इन करें",
    signInGoogle: "Google के साथ साइन इन करें",
    noAccount: "क्या आपके पास खाता नहीं है?",
    signUp: "साइन अप करें",
    welcomeTitle: "Lead4wd में आपका स्वागत है",
    welcomeUser: "स्वागत है",
    profile: "प्रोफ़ाइल",
    yourProgress: "आपकी प्रगति",
    completedPrefix: "आपने",
    completedSuffix: "प्रश्न पूरे कर लिए हैं।",
    outOf: "में से",
    question: "प्रश्न",
    needsReview: "समीक्षा की आवश्यकता है",
    back: "वापस",
    submitAnswer: "उत्तर सबमिट करें",
    correct: "सही!",
    incorrect: "गलत उत्तर। पुन: प्रयास करें!",
    previous: "पिछला",
    next: "अगला",
    nextModule: "अगला मॉड्यूल",
    finishCourse: "कोर्स पूरा करें",
    userProfile: "उपयोगकर्ता प्रोफ़ाइल",
    esc: "वापस जाएँ",
    firstName: "प्रथम नाम",
    lastName: "अंतिम नाम",
    email: "ईमेल",
    phone: "फ़ोन नंबर",
    saveChanges: "परिवर्तन सहेजें",
    changePassword: "पासवर्ड बदलें",
    deleteAccount: "खाता हटाएं",
    logout: "लॉग आउट",
    dummyBtn: "यह एक डमी बटन है",
    skip: "छोड़ें"
  },
  te: {
    welcomeBack: "తిరిగి స్వాగతం",
    enterDetails: "దయచేసి మీ వివరాలను నమోదు చేయండి",
    emailPlaceholder: "ఇమెయిల్ చిరునామా",
    passwordPlaceholder: "పాస్‌వర్డ్",
    rememberMe: "30 రోజుల పాటు గుర్తుంచుకో",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    login: "లాగిన్",
    signInGoogle: "Googleతో సైన్ ఇన్ చేయండి",
    noAccount: "ఖాతా లేదా?",
    signUp: "సైన్ అప్ చేయండి",
    welcomeTitle: "Lead4wd కి స్వాగతం",
    welcomeUser: "స్వాగతం",
    profile: "ప్రొఫైల్",
    yourProgress: "మీ పురోగతి",
    completedPrefix: "మీరు",
    completedSuffix: "ప్రశ్నలను పూర్తి చేసారు.",
    outOf: "లో",
    question: "ప్రశ్న",
    needsReview: "సమీక్ష అవసరం",
    back: "వెనుకకు",
    submitAnswer: "సమాధానం సమర్పించండి",
    correct: "సరైనది!",
    incorrect: "తప్పు సమాధానం. మళ్లీ ప్రయత్నించండి!",
    previous: "మునుపటి",
    next: "తదుపరి",
    nextModule: "తదుపరి మాడ్యూల్",
    finishCourse: "కోర్సు ముగించండి",
    userProfile: "వినియోగదారు ప్రొఫైల్",
    esc: "వెనుకకు వెళ్ళండి",
    firstName: "మొదటి పేరు",
    lastName: "చివరి పేరు",
    email: "ఇమెయిల్",
    phone: "ఫోన్ నంబర్",
    saveChanges: "మార్పులను సేవ్ చేయండి",
    changePassword: "పాస్‌వర్డ్ మార్చండి",
    deleteAccount: "ఖాతాను తొలగించండి",
    logout: "లాగ్ అవుట్",
    dummyBtn: "ఇది నకిలీ బటన్",
    skip: "దాటవేయి"
  }
};

export const MOCK_MODULES: Record<LanguageCode, Module[]> = {
  en: [
    {
      id: "m1",
      title: "Module 1: The First 90 Days",
      questions: [
        {
          id: "m1_q1",
          number: 1,
          text: "When a team member shares a concern, what should your first step be?",
          options: [
            "Suggest a solution immediately to save time",
            "Ask clarifying questions to understand their view",
            "Remind them of the project deadline",
            "Assign the problem to someone else"
          ],
          correctOptionIndex: 1
        },
        {
          id: "m1_q2",
          number: 2,
          text: "In 1:1 meetings, what is the best practice for giving your full attention?",
          options: [
            "Keep your phone on the desk just in case",
            "Multitask on minor emails while they speak",
            "Turn off notifications and let them do most of the talking",
            "Only schedule them when you have no other work"
          ],
          correctOptionIndex: 2
        },
        {
          id: "m1_q3",
          number: 3,
          text: "How should you handle delegating a meaningful task?",
          options: [
            "Step back in to fix it if they do it differently than you would",
            "Only delegate tasks you don't want to do",
            "Be clear about the outcome and decision rights, then let them own it",
            "Give them the task without any timeline to reduce pressure"
          ],
          correctOptionIndex: 2
        }
      ]
    },
    {
      id: "m2",
      title: "Module 2: Manager Mindset & Emotional Intelligence",
      questions: [
        {
          id: "m2_q1",
          number: 1,
          text: "When an unexpected issue arises, what is the emotionally intelligent response?",
          options: [
            "Firing off a sharp message in the team chat as soon as you see a mistake",
            "Taking a breath, asking 'What happened here?' before commenting",
            "Finding someone to blame immediately so the team learns",
            "Ignoring the issue and hoping the team resolves it"
          ],
          correctOptionIndex: 1
        },
        {
          id: "m2_q2",
          number: 2,
          text: "Self-awareness as a manager primarily means:",
          options: [
            "Knowing all the answers to technical questions",
            "Making sure everyone knows you are the boss",
            "Noticing what you feel and how you come across to others—especially when stressed",
            "Being aware of the exact time your team starts and stops working"
          ],
          correctOptionIndex: 2
        }
      ]
    },
    {
      id: "m3",
      title: "Module 3: Feedback & Coaching",
      questions: [
        {
          id: "m3_q1",
          number: 1,
          text: "When delivering feedback, which approach is most effective?",
          options: [
            "Wait for the annual performance review",
            "Give specific feedback shortly after the real work situation occurs",
            "Only give positive feedback to maintain morale",
            "Deliver it in front of the whole team so everyone learns"
          ],
          correctOptionIndex: 1
        },
        {
          id: "m3_q2",
          number: 2,
          text: "If you notice repeated tension between two team members, you should:",
          options: [
            "Hope it resolves itself over time",
            "Reassign one of them to a different project",
            "Bring it up directly and facilitate an honest conversation",
            "Ignore it unless it affects the project delivery"
          ],
          correctOptionIndex: 2
        }
      ]
    }
  ],
  hi: [
    {
      id: "m1",
      title: "मॉड्यूल 1: पहले 90 दिन",
      questions: [
        {
          id: "m1_q1",
          number: 1,
          text: "जब टीम का कोई सदस्य चिंता साझा करता है, तो आपका पहला कदम क्या होना चाहिए?",
          options: [
            "समय बचाने के लिए तुरंत कोई समाधान सुझाएं",
            "उनका दृष्टिकोण समझने के लिए स्पष्टीकरण प्रश्न पूछें",
            "उन्हें प्रोजेक्ट की समय सीमा याद दिलाएं",
            "समस्या किसी और को सौंप दें"
          ],
          correctOptionIndex: 1
        },
        {
          id: "m1_q2",
          number: 2,
          text: "1:1 मीटिंग में अपना पूरा ध्यान देने का सबसे अच्छा तरीका क्या है?",
          options: [
            "जरूरत पड़ने के लिए अपना फोन डेस्क पर रखें",
            "जब वे बोलें तो छोटे ईमेल पर मल्टीटास्क करें",
            "सूचनाएं बंद करें और उन्हें ज्यादा बोलने दें",
            "मीटिंग केवल तभी करें जब आपके पास कोई और काम न हो"
          ],
          correctOptionIndex: 2
        },
        {
          id: "m1_q3",
          number: 3,
          text: "आपको कोई सार्थक काम सौंपते समय क्या करना चाहिए?",
          options: [
            "अगर वे इसे आपके तरीके से अलग करते हैं तो इसे ठीक करने के लिए बीच में बोलें",
            "केवल वे काम सौंपें जो आप नहीं करना चाहते",
            "परिणाम और निर्णय के अधिकारों के बारे में स्पष्ट रहें, फिर उन्हें इसे करने दें",
            "दबाव कम करने के लिए उन्हें बिना किसी समय सीमा के कार्य दें"
          ],
          correctOptionIndex: 2
        }
      ]
    },
    {
      id: "m2",
      title: "मॉड्यूल 2: प्रबंधक मानसिकता और भावनात्मक बुद्धिमत्ता",
      questions: [
        {
          id: "m2_q1",
          number: 1,
          text: "जब कोई अप्रत्याशित समस्या उत्पन्न होती है, तो भावनात्मक रूप से बुद्धिमान प्रतिक्रिया क्या है?",
          options: [
            "गलती देखते ही टीम चैट में तीखा संदेश भेजना",
            "सांस लेना और टिप्पणी करने से पहले पूछना 'यहाँ क्या हुआ?'",
            "तुरंत किसी को दोष देना ताकि टीम सीखे",
            "समस्या को नज़रअंदाज़ करना और उम्मीद करना कि टीम इसे सुलझा लेगी"
          ],
          correctOptionIndex: 1
        },
        {
          id: "m2_q2",
          number: 2,
          text: "प्रबंधक के रूप में आत्म-जागरूकता का मुख्य अर्थ क्या है?",
          options: [
            "सभी तकनीकी सवालों के जवाब जानना",
            "यह सुनिश्चित करना कि सभी जानते हैं कि आप बॉस हैं",
            "यह ध्यान देना कि आप कैसा महसूस करते हैं और दूसरों के सामने कैसे आते हैं—खासकर तनाव में",
            "यह जानना कि आपकी टीम किस समय काम शुरू करती है और बंद करती है"
          ],
          correctOptionIndex: 2
        }
      ]
    },
    {
      id: "m3",
      title: "मॉड्यूल 3: प्रतिक्रिया और कोचिंग",
      questions: [
        {
          id: "m3_q1",
          number: 1,
          text: "प्रतिक्रिया (फीडबैक) देते समय, कौन सा दृष्टिकोण सबसे प्रभावी है?",
          options: [
            "वार्षिक प्रदर्शन समीक्षा की प्रतीक्षा करें",
            "वास्तविक कार्य स्थिति होने के तुरंत बाद विशिष्ट प्रतिक्रिया दें",
            "मनोबल बनाए रखने के लिए केवल सकारात्मक प्रतिक्रिया दें",
            "इसे पूरी टीम के सामने दें ताकि हर कोई सीखे"
          ],
          correctOptionIndex: 1
        },
        {
          id: "m3_q2",
          number: 2,
          text: "यदि आप टीम के दो सदस्यों के बीच बार-बार तनाव देखते हैं, तो आपको चाहिए:",
          options: [
            "उम्मीद करें कि समय के साथ यह अपने आप हल हो जाएगा",
            "उनमें से एक को किसी अन्य प्रोजेक्ट में स्थानांतरित करें",
            "इसे सीधे सामने लाएं और एक ईमानदार बातचीत को सुविधाजनक बनाएं",
            "इसे नज़रअंदाज़ करें जब तक कि यह प्रोजेक्ट डिलीवरी को प्रभावित न करे"
          ],
          correctOptionIndex: 2
        }
      ]
    }
  ],
  te: [
    {
      id: "m1",
      title: "మాడ్యూల్ 1: మొదటి 90 రోజులు",
      questions: [
        {
          id: "m1_q1",
          number: 1,
          text: "బృంద సభ్యుడు ఒక ఆందోళనను పంచుకున్నప్పుడు, మీ మొదటి అడుగు ఏమిటి?",
          options: [
            "సమయాన్ని ఆదా చేయడానికి వెంటనే పరిష్కారాన్ని సూచించండి",
            "వారి అభిప్రాయాన్ని అర్థం చేసుకోవడానికి స్పష్టమైన ప్రశ్నలు అడగండి",
            "ప్రాజెక్ట్ గడువు గురించి వారికి గుర్తు చేయండి",
            "సమస్యను వేరొకరికి అప్పగించండి"
          ],
          correctOptionIndex: 1
        },
        {
          id: "m1_q2",
          number: 2,
          text: "1:1 సమావేశాలలో, మీ పూర్తి దృష్టిని ఇవ్వడానికి ఉత్తమ మార్గం ఏమిటి?",
          options: [
            "ఏదైనా అవసరం కోసం మీ ఫోన్‌ను డెస్క్‌పై ఉంచండి",
            "వారు మాట్లాడుతున్నప్పుడు చిన్న ఇమెయిల్‌లను తనిఖీ చేయండి",
            "నోటిఫికేషన్‌లను ఆఫ్ చేయండి మరియు వారిని ఎక్కువగా మాట్లాడనివ్వండి",
            "మీకు వేరే పని లేనప్పుడు మాత్రమే వాటిని షెడ్యూల్ చేయండి"
          ],
          correctOptionIndex: 2
        },
        {
          id: "m1_q3",
          number: 3,
          text: "మీరు ఒక ముఖ్యమైన పనిని వేరొకరికి ఎలా అప్పగించాలి?",
          options: [
            "వారు దానిని మీ పద్ధతికి భిన్నంగా చేస్తే దానిని సరిచేయడానికి జోక్యం చేసుకోండి",
            "మీరు చేయకూడదనుకునే పనులను మాత్రమే అప్పగించండి",
            "ఫలితం మరియు నిర్ణయాధికారాల గురించి స్పష్టంగా ఉండండి, ఆపై వారిని చేయనివ్వండి",
            "ఒత్తిడిని తగ్గించడానికి ఎటువంటి గడువు లేకుండా వారికి పనిని ఇవ్వండి"
          ],
          correctOptionIndex: 2
        }
      ]
    },
    {
      id: "m2",
      title: "మాడ్యూల్ 2: మేనేజర్ మైండ్‌సెట్ & ఎమోషనల్ ఇంటెలిజెన్స్",
      questions: [
        {
          id: "m2_q1",
          number: 1,
          text: "ఊహించని సమస్య తలెత్తినప్పుడు, భావోద్వేగపరంగా తెలివైన ప్రతిస్పందన ఏమిటి?",
          options: [
            "మీరు పొరపాటును చూసిన వెంటనే బృంద చాట్‌లో కఠినమైన సందేశాన్ని పంపడం",
            "ఊపిరి పీల్చుకుని, వ్యాఖ్యానించడానికి ముందు 'ఇక్కడ ఏమి జరిగింది?' అని అడగడం",
            "బృందం నేర్చుకోవడానికి వెంటనే ఎవరినైనా నిందించడం",
            "సమస్యను విస్మరించడం మరియు బృందం దానిని పరిష్కరిస్తుందని ఆశించడం"
          ],
          correctOptionIndex: 1
        },
        {
          id: "m2_q2",
          number: 2,
          text: "మేనేజర్‌గా స్వీయ-అవగాహన అంటే ప్రధానంగా:",
          options: [
            "అన్ని సాంకేతిక ప్రశ్నలకు సమాధానాలు తెలుసుకోవడం",
            "మీరే బాస్ అని అందరికీ తెలిసేలా చేయడం",
            "మీరు ఏమి భావిస్తున్నారో మరియు ఇతరులకు ఎలా కనిపిస్తారో గమనించడం—ముఖ్యంగా ఒత్తిడిలో ఉన్నప్పుడు",
            "మీ బృందం ఏ సమయానికి పని ప్రారంభించి ఆపుతుందో ఖచ్చితంగా తెలుసుకోవడం"
          ],
          correctOptionIndex: 2
        }
      ]
    },
    {
      id: "m3",
      title: "మాడ్యూల్ 3: ఫీడ్‌బ్యాక్ & కోచింగ్",
      questions: [
        {
          id: "m3_q1",
          number: 1,
          text: "ఫీడ్‌బ్యాక్ ఇచ్చేటప్పుడు, ఏ విధానం అత్యంత ప్రభావవంతమైనది?",
          options: [
            "వార్షిక పనితీరు సమీక్ష కోసం వేచి ఉండండి",
            "నిజమైన పని పరిస్థితి ఏర్పడిన కొద్దిసేపటికే నిర్దిష్ట అభిప్రాయాన్ని ఇవ్వండి",
            "స్థైర్యాన్ని కాపాడుకోవడానికి సానుకూల అభిప్రాయాన్ని మాత్రమే ఇవ్వండి",
            "అందరూ నేర్చుకునేలా మొత్తం బృందం ముందు దీనిని ఇవ్వండి"
          ],
          correctOptionIndex: 1
        },
        {
          id: "m3_q2",
          number: 2,
          text: "ఇద్దరు బృంద సభ్యుల మధ్య పదేపదే ఉద్రిక్తతను మీరు గమనించినట్లయితే, మీరు ఏమి చేయాలి?",
          options: [
            "కాలక్రమేణా అది స్వయంగా పరిష్కరించబడుతుందని ఆశిస్తున్నాము",
            "వారిలో ఒకరిని వేరే ప్రాజెక్ట్‌కు మార్చండి",
            "దీనిని నేరుగా ప్రస్తావించి, నిజాయితీగల సంభాషణను సులభతరం చేయండి",
            "ప్రాజెక్ట్ డెలివరీని ప్రభావితం చేసే వరకు దీనిని విస్మరించండి"
          ],
          correctOptionIndex: 2
        }
      ]
    }
  ]
};

export const ONBOARDING_QUESTIONS: Record<LanguageCode, { id: string; text: string; options: string[] }[]> = {
  en: [
    {
      id: "o1",
      text: "What is your primary goal for using Lead4wd?",
      options: [
        "I'm a new manager looking for guidance",
        "I want to improve my communication skills",
        "I need help navigating team conflicts",
        "I want to learn how to delegate effectively"
      ]
    },
    {
      id: "o2",
      text: "How much time can you dedicate to learning each week?",
      options: [
        "10-15 minutes (Micro-learning)",
        "30-60 minutes",
        "1-2 hours",
        "More than 2 hours"
      ]
    }
  ],
  hi: [
    {
      id: "o1",
      text: "Lead4wd का उपयोग करने का आपका मुख्य लक्ष्य क्या है?",
      options: [
        "मैं एक नया प्रबंधक हूँ और मार्गदर्शन ढूंढ रहा हूँ",
        "मैं अपने संचार कौशल में सुधार करना चाहता हूँ",
        "मुझे टीम के संघर्षों को सुलझाने में मदद चाहिए",
        "मैं प्रभावी ढंग से काम सौंपना सीखना चाहता हूँ"
      ]
    },
    {
      id: "o2",
      text: "आप हर सप्ताह सीखने के लिए कितना समय दे सकते हैं?",
      options: [
        "10-15 मिनट (माइक्रो-लर्निंग)",
        "30-60 मिनट",
        "1-2 घंटे",
        "2 घंटे से अधिक"
      ]
    }
  ],
  te: [
    {
      id: "o1",
      text: "Lead4wdని ఉపయోగించడం కోసం మీ ప్రాథమిక లక్ష్యం ఏమిటి?",
      options: [
        "నేను మార్గదర్శకత్వం కోసం చూస్తున్న కొత్త మేనేజర్‌ని",
        "నా కమ్యూనికేషన్ నైపుణ్యాలను మెరుగుపరచుకోవాలనుకుంటున్నాను",
        "బృంద వివాదాలను పరిష్కరించడంలో నాకు సహాయం కావాలి",
        "ప్రభావవంతంగా పనులను ఎలా అప్పగించాలో నేర్చుకోవాలనుకుంటున్నాను"
      ]
    },
    {
      id: "o2",
      text: "ప్రతి వారం నేర్చుకోవడానికి మీరు ఎంత సమయం కేటాయించగలరు?",
      options: [
        "10-15 నిమిషాలు (మైక్రో-లెర్నింగ్)",
        "30-60 నిమిషాలు",
        "1-2 గంటలు",
        "2 గంటల కంటే ఎక్కువ"
      ]
    }
  ]
};
