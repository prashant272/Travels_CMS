/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TrainInfo {
  number: string;
  name: string;
  stations: string[];
}

export const POPULAR_INDIAN_TRAINS: TrainInfo[] = [
  // RAJDHANI & TEJAS
  {
    number: "12301",
    name: "Howrah - New Delhi Rajdhani Express (via Gaya)",
    stations: ["Howrah (HWH)", "Asansol (ASN)", "Dhanbad (DHN)", "Parasnath (PNME)", "Koderma (KQR)", "Gaya (GAYA)", "Dehri On Sone (DOS)", "Sasaram (SSM)", "Pt DD Upadhyaya (DDU)", "Prayagraj (PRYJ)", "Kanpur Central (CNB)", "New Delhi (NDLS)"]
  },
  {
    number: "12302",
    name: "New Delhi - Howrah Rajdhani Express (via Gaya)",
    stations: ["New Delhi (NDLS)", "Kanpur Central (CNB)", "Prayagraj (PRYJ)", "Pt DD Upadhyaya (DDU)", "Sasaram (SSM)", "Dehri On Sone (DOS)", "Gaya (GAYA)", "Koderma (KQR)", "Parasnath (PNME)", "Dhanbad (DHN)", "Asansol (ASN)", "Howrah (HWH)"]
  },
  {
    number: "12305",
    name: "Howrah - New Delhi Rajdhani Express (via Patna)",
    stations: ["Howrah (HWH)", "Barddhaman (BWN)", "Madhupur (MDP)", "Jasidih (JSME)", "Patna Jn (PNBE)", "Pt DD Upadhyaya (DDU)", "Prayagraj (PRYJ)", "Kanpur Central (CNB)", "New Delhi (NDLS)"]
  },
  {
    number: "12306",
    name: "New Delhi - Howrah Rajdhani Express (via Patna)",
    stations: ["New Delhi (NDLS)", "Kanpur Central (CNB)", "Prayagraj (PRYJ)", "Pt DD Upadhyaya (DDU)", "Patna Jn (PNBE)", "Jasidih (JSME)", "Madhupur (MDP)", "Barddhaman (BWN)", "Howrah (HWH)"]
  },
  {
    number: "12309",
    name: "Rajendra Nagar Patna - New Delhi Tejas Rajdhani",
    stations: ["Rajendra Nagar (RJPB)", "Patna Jn (PNBE)", "Pt DD Upadhyaya (DDU)", "Prayagraj (PRYJ)", "Kanpur Central (CNB)", "New Delhi (NDLS)"]
  },
  {
    number: "12310",
    name: "New Delhi - Rajendra Nagar Patna Tejas Rajdhani",
    stations: ["New Delhi (NDLS)", "Kanpur Central (CNB)", "Prayagraj (PRYJ)", "Pt DD Upadhyaya (DDU)", "Patna Jn (PNBE)", "Rajendra Nagar (RJPB)"]
  },
  {
    number: "12951",
    name: "Mumbai Central - New Delhi Tejas Rajdhani",
    stations: ["Mumbai Central (MMCT)", "Borivali (BVI)", "Surat (ST)", "Vadodara (BRC)", "Ratlam (RTM)", "Nagda (NAD)", "Kota (KOTA)", "New Delhi (NDLS)"]
  },
  {
    number: "12952",
    name: "New Delhi - Mumbai Central Tejas Rajdhani",
    stations: ["New Delhi (NDLS)", "Kota (KOTA)", "Nagda (NAD)", "Ratlam (RTM)", "Vadodara (BRC)", "Surat (ST)", "Borivali (BVI)", "Mumbai Central (MMCT)"]
  },
  {
    number: "12953",
    name: "Mumbai Central - H Nizamuddin August Kranti Rajdhani",
    stations: ["Mumbai Central (MMCT)", "Andheri (ADH)", "Borivali (BVI)", "Vapi (VAPI)", "Valsad (BL)", "Surat (ST)", "Bharuch (BH)", "Vadodara (BRC)", "Ratlam (RTM)", "Kota (KOTA)", "Sawai Madhopur (SWM)", "Mathura (MTJ)", "Hazrat Nizamuddin (NZM)"]
  },
  {
    number: "12954",
    name: "H Nizamuddin - Mumbai Central August Kranti Rajdhani",
    stations: ["Hazrat Nizamuddin (NZM)", "Mathura (MTJ)", "Sawai Madhopur (SWM)", "Kota (KOTA)", "Ratlam (RTM)", "Vadodara (BRC)", "Bharuch (BH)", "Surat (ST)", "Valsad (BL)", "Vapi (VAPI)", "Borivali (BVI)", "Andheri (ADH)", "Mumbai Central (MMCT)"]
  },
  {
    number: "12423",
    name: "Dibrugarh - New Delhi Rajdhani Express",
    stations: ["Dibrugarh (DBRG)", "Dimapur (DMV)", "Guwahati (GHY)", "New Bongaigaon (NBQ)", "New Jalpaiguri (NJP)", "Katihar (KIR)", "Naugachia (NNA)", "Barauni (BJU)", "Patliputra (PPTA)", "Danapur (DNR)", "Pt DD Upadhyaya (DDU)", "Prayagraj (PRYJ)", "Kanpur (CNB)", "New Delhi (NDLS)"]
  },
  {
    number: "12424",
    name: "New Delhi - Dibrugarh Rajdhani Express",
    stations: ["New Delhi (NDLS)", "Kanpur (CNB)", "Prayagraj (PRYJ)", "Pt DD Upadhyaya (DDU)", "Danapur (DNR)", "Patliputra (PPTA)", "Barauni (BJU)", "Naugachia (NNA)", "Katihar (KIR)", "New Jalpaiguri (NJP)", "New Bongaigaon (NBQ)", "Guwahati (GHY)", "Dimapur (DMV)", "Dibrugarh (DBRG)"]
  },
  {
    number: "22691",
    name: "KSR Bengaluru - H Nizamuddin Rajdhani Express",
    stations: ["KSR Bengaluru (SBC)", "Yesvantpur (YPR)", "Sri Sathya Sai P Nilayam (SSPN)", "Dharmavaram (DMM)", "Anantapur (ATP)", "Guntakal (GTL)", "Secunderabad (SC)", "Kazipet (KZJ)", "Balharshah (BPQ)", "Nagpur (NGP)", "Bhopal (BPL)", "Jhansi (VGLJ)", "Gwalior (GWL)", "Agra Cantt (AGC)", "Hazrat Nizamuddin (NZM)"]
  },
  {
    number: "22692",
    name: "H Nizamuddin - KSR Bengaluru Rajdhani Express",
    stations: ["Hazrat Nizamuddin (NZM)", "Agra Cantt (AGC)", "Gwalior (GWL)", "Jhansi (VGLJ)", "Bhopal (BPL)", "Nagpur (NGP)", "Balharshah (BPQ)", "Kazipet (KZJ)", "Secunderabad (SC)", "Guntakal (GTL)", "Anantapur (ATP)", "Dharmavaram (DMM)", "Sri Sathya Sai P Nilayam (SSPN)", "KSR Bengaluru (SBC)"]
  },

  // VANDE BHARAT EXPRESS
  {
    number: "22436",
    name: "New Delhi - Varanasi Vande Bharat Express",
    stations: ["New Delhi (NDLS)", "Kanpur Central (CNB)", "Prayagraj (PRYJ)", "Varanasi Jn (BSB)"]
  },
  {
    number: "22435",
    name: "Varanasi - New Delhi Vande Bharat Express",
    stations: ["Varanasi Jn (BSB)", "Prayagraj (PRYJ)", "Kanpur Central (CNB)", "New Delhi (NDLS)"]
  },
  {
    number: "22439",
    name: "New Delhi - Shri Mata Vaishno Devi Katra Vande Bharat",
    stations: ["New Delhi (NDLS)", "Ambala Cantt (UMB)", "Ludhiana (LDH)", "Jammu Tawi (JAT)", "Shri Mata Vaishno Devi Katra (SVDK)"]
  },
  {
    number: "22440",
    name: "Shri Mata Vaishno Devi Katra - New Delhi Vande Bharat",
    stations: ["Shri Mata Vaishno Devi Katra (SVDK)", "Jammu Tawi (JAT)", "Ludhiana (LDH)", "Ambala Cantt (UMB)", "New Delhi (NDLS)"]
  },
  {
    number: "22348",
    name: "Patna - Howrah Vande Bharat Express",
    stations: ["Patna Jn (PNBE)", "Patna Saheb (PNC)", "Mokama (MKA)", "Luckeesarai (LKR)", "Jasidih (JSME)", "Jamtara (JMT)", "Asansol (ASN)", "Howrah (HWH)"]
  },
  {
    number: "22347",
    name: "Howrah - Patna Vande Bharat Express",
    stations: ["Howrah (HWH)", "Asansol (ASN)", "Jamtara (JMT)", "Jasidih (JSME)", "Luckeesarai (LKR)", "Mokama (MKA)", "Patna Saheb (PNC)", "Patna Jn (PNBE)"]
  },
  {
    number: "22225",
    name: "Mumbai CSMT - Solapur Vande Bharat Express",
    stations: ["Mumbai CSMT (CSMT)", "Dadar (DR)", "Kalyan (KYN)", "Pune (PUNE)", "Kurduvadi (KWV)", "Solapur (SUR)"]
  },
  {
    number: "22226",
    name: "Solapur - Mumbai CSMT Vande Bharat Express",
    stations: ["Solapur (SUR)", "Kurduvadi (KWV)", "Pune (PUNE)", "Kalyan (KYN)", "Dadar (DR)", "Mumbai CSMT (CSMT)"]
  },
  {
    number: "20607",
    name: "MGR Chennai Central - Mysuru Vande Bharat Express",
    stations: ["Chennai Central (MAS)", "Katpadi (KPD)", "KSR Bengaluru (SBC)", "Mysuru (MYS)"]
  },
  {
    number: "20608",
    name: "Mysuru - MGR Chennai Central Vande Bharat Express",
    stations: ["Mysuru (MYS)", "KSR Bengaluru (SBC)", "Katpadi (KPD)", "Chennai Central (MAS)"]
  },

  // SUPERFAST & SAMPARK KRANTI
  {
    number: "12393",
    name: "Sampoorna Kranti Express (PNBE - NDLS)",
    stations: ["Rajendra Nagar (RJPB)", "Patna Jn (PNBE)", "Ara (ARA)", "Buxar (BXR)", "Pt DD Upadhyaya (DDU)", "Mirzapur (MZP)", "Kanpur Central (CNB)", "New Delhi (NDLS)"]
  },
  {
    number: "12394",
    name: "Sampoorna Kranti Express (NDLS - PNBE)",
    stations: ["New Delhi (NDLS)", "Kanpur Central (CNB)", "Mirzapur (MZP)", "Pt DD Upadhyaya (DDU)", "Buxar (BXR)", "Ara (ARA)", "Patna Jn (PNBE)", "Rajendra Nagar (RJPB)"]
  },
  {
    number: "12565",
    name: "Bihar Sampark Kranti Express (DBG - NDLS)",
    stations: ["Darbhanga (DBG)", "Samastipur (SPJ)", "Muzaffarpur (MFP)", "Hajipur (HJP)", "Sonpur (SEE)", "Chhapra (CPR)", "Siwan (SV)", "Deoria Sadar (DEOS)", "Gorakhpur (GKP)", "Badshahnagar (BNZ)", "Aishbagh (ASH)", "Kanpur Central (CNB)", "New Delhi (NDLS)"]
  },
  {
    number: "12566",
    name: "Bihar Sampark Kranti Express (NDLS - DBG)",
    stations: ["New Delhi (NDLS)", "Kanpur Central (CNB)", "Aishbagh (ASH)", "Badshahnagar (BNZ)", "Gorakhpur (GKP)", "Deoria Sadar (DEOS)", "Siwan (SV)", "Chhapra (CPR)", "Sonpur (SEE)", "Hajipur (HJP)", "Muzaffarpur (MFP)", "Samastipur (SPJ)", "Darbhanga (DBG)"]
  },
  {
    number: "12553",
    name: "Vaishali Superfast Express (SHC - NDLS)",
    stations: ["Saharsa (SHC)", "Mansi (MNE)", "Khagaria (KGG)", "Begu Sarai (BGS)", "Barauni (BJU)", "Dalsingh Sarai (DSS)", "Samastipur (SPJ)", "Muzaffarpur (MFP)", "Hajipur (HJP)", "Sonpur (SEE)", "Chhapra (CPR)", "Siwan (SV)", "Deoria Sadar (DEOS)", "Gorakhpur (GKP)", "Khalilabad (KLD)", "Basti (BST)", "Gonda (GD)", "Barabanki (BBK)", "Lucknow (LKO)", "Kanpur (CNB)", "Etawah (ETW)", "Tundla (TDL)", "Aligarh (ALJN)", "Ghaziabad (GZB)", "New Delhi (NDLS)"]
  },
  {
    number: "12554",
    name: "Vaishali Superfast Express (NDLS - SHC)",
    stations: ["New Delhi (NDLS)", "Ghaziabad (GZB)", "Aligarh (ALJN)", "Tundla (TDL)", "Etawah (ETW)", "Kanpur (CNB)", "Lucknow (LKO)", "Barabanki (BBK)", "Gonda (GD)", "Basti (BST)", "Khalilabad (KLD)", "Gorakhpur (GKP)", "Deoria Sadar (DEOS)", "Siwan (SV)", "Chhapra (CPR)", "Sonpur (SEE)", "Hajipur (HJP)", "Muzaffarpur (MFP)", "Samastipur (SPJ)", "Dalsingh Sarai (DSS)", "Barauni (BJU)", "Begu Sarai (BGS)", "Khagaria (KGG)", "Mansi (MNE)", "Saharsa (SHC)"]
  },
  {
    number: "12002",
    name: "Bhopal Shatabdi Express (NDLS - RKMP)",
    stations: ["New Delhi (NDLS)", "Mathura (MTJ)", "Agra Cantt (AGC)", "Morena (MRA)", "Gwalior (GWL)", "Jhansi (VGLJ)", "Lalitpur (LAR)", "Bhopal (BPL)", "Rani Kamalapati (RKMP)"]
  },
  {
    number: "12004",
    name: "Lucknow Shatabdi Express (NDLS - LKO)",
    stations: ["New Delhi (NDLS)", "Ghaziabad (GZB)", "Aligarh (ALJN)", "Tundla (TDL)", "Etawah (ETW)", "Phaphund (PHD)", "Kanpur Central (CNB)", "Lucknow (LKO)"]
  },
  {
    number: "12801",
    name: "Purushottam Express (PURI - NDLS)",
    stations: ["Puri (PURI)", "Khurda Road (KUR)", "Bhubaneswar (BBS)", "Cuttack (CTC)", "Jajpur K Road (JJKR)", "Bhadrak (BHC)", "Balasore (BLS)", "Hijli (HIJ)", "Ghatsila (GTS)", "Tatanagar (TATA)", "Purulia (PRR)", "Bokaro Steel City (BKSC)", "Chandrapura (CRP)", "Gomoh (GMO)", "Koderma (KQR)", "Gaya (GAYA)", "Dehri On Sone (DOS)", "Sasaram (SSM)", "Bhabua Road (BBU)", "Pt DD Upadhyaya (DDU)", "Chunar (CAR)", "Mirzapur (MZP)", "Prayagraj (PRYJ)", "Fatehpur (FTP)", "Kanpur Central (CNB)", "New Delhi (NDLS)"]
  },
  {
    number: "12802",
    name: "Purushottam Express (NDLS - PURI)",
    stations: ["New Delhi (NDLS)", "Kanpur Central (CNB)", "Fatehpur (FTP)", "Prayagraj (PRYJ)", "Mirzapur (MZP)", "Chunar (CAR)", "Pt DD Upadhyaya (DDU)", "Bhabua Road (BBU)", "Sasaram (SSM)", "Dehri On Sone (DOS)", "Gaya (GAYA)", "Koderma (KQR)", "Gomoh (GMO)", "Chandrapura (CRP)", "Bokaro Steel City (BKSC)", "Purulia (PRR)", "Tatanagar (TATA)", "Ghatsila (GTS)", "Hijli (HIJ)", "Balasore (BLS)", "Bhadrak (BHC)", "Jajpur K Road (JJKR)", "Cuttack (CTC)", "Bhubaneswar (BBS)", "Khurda Road (KUR)", "Puri (PURI)"]
  },
  {
    number: "12137",
    name: "Punjab Mail (CSMT - FZR)",
    stations: ["Mumbai CSMT (CSMT)", "Dadar (DR)", "Kalyan (KYN)", "Kasara (KSRA)", "Igatpuri (IGP)", "Nashik Road (NK)", "Manmad (MMR)", "Chalisgaon (CSN)", "Jalgaon (JL)", "Bhusaval (BSL)", "Burhanpur (BAU)", "Khandwa (KNW)", "Itarsi (ET)", "Hoshangabad (HBD)", "Habibganj (RKMP)", "Bhopal (BPL)", "Vidisha (BHS)", "Bina (BINA)", "Lalitpur (LAR)", "Jhansi (VGLJ)", "Gwalior (GWL)", "Morena (MRA)", "Dholpur (DHO)", "Agra Cantt (AGC)", "Mathura (MTJ)", "Kosi Kalan (KSV)", "Palwal (PWL)", "Faridabad (FDB)", "Hazrat Nizamuddin (NZM)", "New Delhi (NDLS)", "Delhi Kishanganj (DKZ)", "Shakurbasti (SSB)", "Bahadurgarh (BGZ)", "Rohtak (ROK)", "Jind (JIND)", "Narwana (NRW)", "Tohana (TUN)", "Jakhal (JHL)", "Bareta (BRZ)", "Budhlada (BLZ)", "Mansa (MSZ)", "Maur (MAUR)", "Bathinda (BTI)", "Giddarbaha (GDB)", "Malout (MOT)", "Muktsar (MKS)", "Kot Kapura (KKP)", "Faridkot (FDK)", "Firozpur Cantt (FZR)"]
  },
  {
    number: "12621",
    name: "Tamil Nadu Express (MAS - NDLS)",
    stations: ["Chennai Central (MAS)", "Vijayawada (BZA)", "Khammam (KMT)", "Warangal (WL)", "Balharshah (BPQ)", "Nagpur (NGP)", "Itarsi (ET)", "Bhopal (BPL)", "Jhansi (VGLJ)", "Gwalior (GWL)", "Agra Cantt (AGC)", "Hazrat Nizamuddin (NZM)", "New Delhi (NDLS)"]
  },
  {
    number: "12622",
    name: "Tamil Nadu Express (NDLS - MAS)",
    stations: ["New Delhi (NDLS)", "Agra Cantt (AGC)", "Gwalior (GWL)", "Jhansi (VGLJ)", "Bhopal (BPL)", "Itarsi (ET)", "Nagpur (NGP)", "Balharshah (BPQ)", "Warangal (WL)", "Khammam (KMT)", "Vijayawada (BZA)", "Chennai Central (MAS)"]
  },
  {
    number: "12625",
    name: "Kerala Express (KCVL - NDLS)",
    stations: ["Kochuveli (KCVL)", "Kollam (QLN)", "Kayamkulam (KYJ)", "Mavelikara (MVLK)", "Chengannur (CNGR)", "Tiruvalla (TRVL)", "Changanassery (CGY)", "Kottayam (KTYM)", "Ernakulam Town (ERN)", "Aluva (AWY)", "Thrissur (TCR)", "Palakkad (PGT)", "Coimbatore (CBE)", "Tiruppur (TUP)", "Erode (ED)", "Salem (SA)", "Jolarpettai (JTJ)", "Katpadi (KPD)", "Tirupati (TPTY)", "Renigunta (RU)", "Gudur (GDR)", "Nellore (NLR)", "Vijayawada (BZA)", "Warangal (WL)", "Ramagundam (RDM)", "Balharshah (BPQ)", "Chandrapur (CD)", "Nagpur (NGP)", "Betul (BZU)", "Itarsi (ET)", "Bhopal (BPL)", "Jhansi (VGLJ)", "Gwalior (GWL)", "Agra Cantt (AGC)", "Mathura (MTJ)", "Faridabad (FDB)", "Hazrat Nizamuddin (NZM)", "New Delhi (NDLS)"]
  },
  {
    number: "12626",
    name: "Kerala Express (NDLS - KCVL)",
    stations: ["New Delhi (NDLS)", "Mathura (MTJ)", "Agra Cantt (AGC)", "Gwalior (GWL)", "Jhansi (VGLJ)", "Bhopal (BPL)", "Itarsi (ET)", "Betul (BZU)", "Nagpur (NGP)", "Chandrapur (CD)", "Balharshah (BPQ)", "Ramagundam (RDM)", "Warangal (WL)", "Vijayawada (BZA)", "Nellore (NLR)", "Gudur (GDR)", "Renigunta (RU)", "Tirupati (TPTY)", "Katpadi (KPD)", "Jolarpettai (JTJ)", "Salem (SA)", "Erode (ED)", "Tiruppur (TUP)", "Coimbatore (CBE)", "Palakkad (PGT)", "Thrissur (TCR)", "Aluva (AWY)", "Ernakulam Town (ERN)", "Kottayam (KTYM)", "Changanassery (CGY)", "Tiruvalla (TRVL)", "Chengannur (CNGR)", "Mavelikara (MVLK)", "Kayamkulam (KYJ)", "Kollam (QLN)", "Kochuveli (KCVL)"]
  },
  {
    number: "12295",
    name: "Sanghamitra Superfast (SMVB - DNR)",
    stations: ["SMVT Bengaluru (SMVB)", "Krishnarajapuram (KJM)", "Bangarapet (BWT)", "Kuppam (KPN)", "Jolarpettai (JTJ)", "Katpadi (KPD)", "Arakkonam (AJJ)", "Perambur (PER)", "Chennai Central (MAS)", "Gudur (GDR)", "Nellore (NLR)", "Ongole (OGL)", "Vijayawada (BZA)", "Khammam (KMT)", "Warangal (WL)", "Ramagundam (RDM)", "Balharshah (BPQ)", "Chandrapur (CD)", "Nagpur (NGP)", "Betul (BZU)", "Itarsi (ET)", "Jabalpur (JBP)", "Katni (KTE)", "Maihar (MYR)", "Satna (STA)", "Manikpur (MKP)", "Prayagraj Chheoki (PCOI)", "Mirzapur (MZP)", "Pt DD Upadhyaya (DDU)", "Zamania (ZNA)", "Dildarnagar (DLN)", "Buxar (BXR)", "Ara (ARA)", "Danapur (DNR)"]
  },
  {
    number: "12296",
    name: "Sanghamitra Superfast (DNR - SMVB)",
    stations: ["Danapur (DNR)", "Ara (ARA)", "Buxar (BXR)", "Dildarnagar (DLN)", "Zamania (ZNA)", "Pt DD Upadhyaya (DDU)", "Mirzapur (MZP)", "Prayagraj Chheoki (PCOI)", "Manikpur (MKP)", "Satna (STA)", "Maihar (MYR)", "Katni (KTE)", "Jabalpur (JBP)", "Itarsi (ET)", "Betul (BZU)", "Nagpur (NGP)", "Chandrapur (CD)", "Balharshah (BPQ)", "Ramagundam (RDM)", "Warangal (WL)", "Khammam (KMT)", "Vijayawada (BZA)", "Ongole (OGL)", "Nellore (NLR)", "Gudur (GDR)", "Perambur (PER)", "Arakkonam (AJJ)", "Katpadi (KPD)", "Jolarpettai (JTJ)", "Kuppam (KPN)", "Bangarapet (BWT)", "Krishnarajapuram (KJM)", "SMVT Bengaluru (SMVB)"]
  },
  {
    number: "12321",
    name: "Howrah - Mumbai CSMT Mail (via Chheoki)",
    stations: ["Howrah (HWH)", "Asansol (ASN)", "Dhanbad (DHN)", "Gaya (GAYA)", "Dehri On Sone (DOS)", "Sasaram (SSM)", "Pt DD Upadhyaya (DDU)", "Mirzapur (MZP)", "Prayagraj Chheoki (PCOI)", "Manikpur (MKP)", "Satna (STA)", "Katni (KTE)", "Jabalpur (JBP)", "Itarsi (ET)", "Khandwa (KNW)", "Burhanpur (BAU)", "Bhusaval (BSL)", "Jalgaon (JL)", "Manmad (MMR)", "Nashik Road (NK)", "Kalyan (KYN)", "Dadar (DR)", "Mumbai CSMT (CSMT)"]
  },
  {
    number: "12322",
    name: "Mumbai CSMT - Howrah Mail (via Chheoki)",
    stations: ["Mumbai CSMT (CSMT)", "Dadar (DR)", "Kalyan (KYN)", "Nashik Road (NK)", "Manmad (MMR)", "Jalgaon (JL)", "Bhusaval (BSL)", "Burhanpur (BAU)", "Khandwa (KNW)", "Itarsi (ET)", "Jabalpur (JBP)", "Katni (KTE)", "Satna (STA)", "Manikpur (MKP)", "Prayagraj Chheoki (PCOI)", "Mirzapur (MZP)", "Pt DD Upadhyaya (DDU)", "Sasaram (SSM)", "Dehri On Sone (DOS)", "Gaya (GAYA)", "Dhanbad (DHN)", "Asansol (ASN)", "Howrah (HWH)"]
  },
  {
    number: "12833",
    name: "Ahmedabad - Howrah Superfast Express",
    stations: ["Ahmedabad (ADI)", "Vadodara (BRC)", "Surat (ST)", "Nandurbar (NDB)", "Bhusaval (BSL)", "Akola (AK)", "Badnera (BD)", "Wardha (WR)", "Nagpur (NGP)", "Gondia (G)", "Durg (DURG)", "Raipur (R)", "Bilaspur (BSP)", "Jharsuguda (JSG)", "Rourkela (ROU)", "Chakradharpur (CKP)", "Tatanagar (TATA)", "Kharagpur (KGP)", "Howrah (HWH)"]
  },
  {
    number: "12834",
    name: "Howrah - Ahmedabad Superfast Express",
    stations: ["Howrah (HWH)", "Kharagpur (KGP)", "Tatanagar (TATA)", "Chakradharpur (CKP)", "Rourkela (ROU)", "Jharsuguda (JSG)", "Bilaspur (BSP)", "Raipur (R)", "Durg (DURG)", "Gondia (G)", "Nagpur (NGP)", "Wardha (WR)", "Badnera (BD)", "Akola (AK)", "Bhusaval (BSL)", "Nandurbar (NDB)", "Surat (ST)", "Vadodara (BRC)", "Ahmedabad (ADI)"]
  },
  {
    number: "12391",
    name: "Shramjeevi Express (RGD - NDLS)",
    stations: ["Rajgir (RGD)", "Nalanda (NLD)", "Bakhtiyarpur (BKP)", "Patna Saheb (PNC)", "Patna Jn (PNBE)", "Danapur (DNR)", "Ara (ARA)", "Bihiya (BEA)", "Dumraon (DURE)", "Buxar (BXR)", "Gahmar (GMR)", "Dildarnagar (DLN)", "Pt DD Upadhyaya (DDU)", "Varanasi (BSB)", "Jaunpur City (JOP)", "Sultanpur (SLN)", "Musafir Khana (MFKA)", "Nihalgarh (NHH)", "Lucknow (LKO)", "Bareilly (BE)", "Moradabad (MB)", "Ghaziabad (GZB)", "New Delhi (NDLS)"]
  },
  {
    number: "12392",
    name: "Shramjeevi Express (NDLS - RGD)",
    stations: ["New Delhi (NDLS)", "Ghaziabad (GZB)", "Moradabad (MB)", "Bareilly (BE)", "Lucknow (LKO)", "Nihalgarh (NHH)", "Musafir Khana (MFKA)", "Sultanpur (SLN)", "Jaunpur City (JOP)", "Varanasi (BSB)", "Pt DD Upadhyaya (DDU)", "Dildarnagar (DLN)", "Gahmar (GMR)", "Buxar (BXR)", "Dumraon (DURE)", "Bihiya (BEA)", "Ara (ARA)", "Danapur (DNR)", "Patna Jn (PNBE)", "Patna Saheb (PNC)", "Bakhtiyarpur (BKP)", "Nalanda (NLD)", "Rajgir (RGD)"]
  },
  {
    number: "12401",
    name: "Magadh Express (IPR - NDLS)",
    stations: ["Islampur (IPR)", "Hilsa (HIL)", "Daniyawan (DNWH)", "Fatuha (FUT)", "Patna Saheb (PNC)", "Patna Jn (PNBE)", "Danapur (DNR)", "Bihta (BTA)", "Ara (ARA)", "Buxar (BXR)", "Pt DD Upadhyaya (DDU)", "Mirzapur (MZP)", "Prayagraj (PRYJ)", "Kanpur Central (CNB)", "Etawah (ETW)", "Firozabad (FZD)", "Tundla (TDL)", "Aligarh (ALJN)", "New Delhi (NDLS)"]
  },
  {
    number: "12402",
    name: "Magadh Express (NDLS - IPR)",
    stations: ["New Delhi (NDLS)", "Aligarh (ALJN)", "Tundla (TDL)", "Firozabad (FZD)", "Etawah (ETW)", "Kanpur Central (CNB)", "Prayagraj (PRYJ)", "Mirzapur (MZP)", "Pt DD Upadhyaya (DDU)", "Buxar (BXR)", "Ara (ARA)", "Bihta (BTA)", "Danapur (DNR)", "Patna Jn (PNBE)", "Patna Saheb (PNC)", "Fatuha (FUT)", "Daniyawan (DNWH)", "Hilsa (HIL)", "Islampur (IPR)"]
  },
  {
    number: "12303",
    name: "Poorva Express (HWH - NDLS via Patna)",
    stations: ["Howrah (HWH)", "Barddhaman (BWN)", "Asansol (ASN)", "Madhupur (MDP)", "Jasidih (JSME)", "Jhajha (JAJ)", "Kiul (KIUL)", "Mokama (MKA)", "Bakhtiyarpur (BKP)", "Patna Jn (PNBE)", "Danapur (DNR)", "Ara (ARA)", "Buxar (BXR)", "Pt DD Upadhyaya (DDU)", "Prayagraj (PRYJ)", "Kanpur (CNB)", "Aligarh (ALJN)", "New Delhi (NDLS)"]
  },
  {
    number: "12304",
    name: "Poorva Express (NDLS - HWH via Patna)",
    stations: ["New Delhi (NDLS)", "Aligarh (ALJN)", "Kanpur (CNB)", "Prayagraj (PRYJ)", "Pt DD Upadhyaya (DDU)", "Buxar (BXR)", "Ara (ARA)", "Danapur (DNR)", "Patna Jn (PNBE)", "Bakhtiyarpur (BKP)", "Mokama (MKA)", "Kiul (KIUL)", "Jhajha (JAJ)", "Jasidih (JSME)", "Madhupur (MDP)", "Asansol (ASN)", "Barddhaman (BWN)", "Howrah (HWH)"]
  },
  {
    number: "14055",
    name: "Brahmaputra Mail (DLI - KYQ)",
    stations: ["Old Delhi (DLI)", "Ghaziabad (GZB)", "Aligarh (ALJN)", "Tundla (TDL)", "Kanpur (CNB)", "Prayagraj (PRYJ)", "Mirzapur (MZP)", "Pt DD Upadhyaya (DDU)", "Buxar (BXR)", "Ara (ARA)", "Patna (PNBE)", "Mokama (MKA)", "Kiul (KIUL)", "Jamalpur (JMP)", "Bhagalpur (BGP)", "Kahalgaon (CLG)", "Sahibganj (SBG)", "Barharwa (BHW)", "Malda Town (MLDT)", "Barsoi (BOE)", "Kishanganj (KNE)", "New Jalpaiguri (NJP)", "Jalpaiguri Road (JPE)", "Dhupguri (DQG)", "New Cooch Behar (NCB)", "New Alipurduar (NOQ)", "Kokrajhar (KOJ)", "New Bongaigaon (NBQ)", "Barpeta Road (BPRD)", "Rangiya (RNY)", "Kamakhya (KYQ)"]
  },
  {
    number: "12841",
    name: "Coromandel Express (SHM - MAS)",
    stations: ["Shalimar (SHM)", "Santragachi (SRC)", "Kharagpur (KGP)", "Balasore (BLS)", "Bhadrak (BHC)", "Jajpur K Road (JJKR)", "Cuttack (CTC)", "Bhubaneswar (BBS)", "Khurda Road (KUR)", "Brahmapur (BAM)", "Visakhapatnam (VSKP)", "Rajahmundry (RJY)", "Tadepalligudem (TDD)", "Eluru (EE)", "Vijayawada (BZA)", "Ongole (OGL)", "Nellore (NLR)", "Chennai Central (MAS)"]
  },
  {
    number: "12842",
    name: "Coromandel Express (MAS - SHM)",
    stations: ["Chennai Central (MAS)", "Nellore (NLR)", "Ongole (OGL)", "Vijayawada (BZA)", "Eluru (EE)", "Tadepalligudem (TDD)", "Rajahmundry (RJY)", "Visakhapatnam (VSKP)", "Brahmapur (BAM)", "Khurda Road (KUR)", "Bhubaneswar (BBS)", "Cuttack (CTC)", "Jajpur K Road (JJKR)", "Bhadrak (BHC)", "Balasore (BLS)", "Kharagpur (KGP)", "Santragachi (SRC)", "Shalimar (SHM)"]
  },
  {
    number: "12615",
    name: "Grand Trunk (GT) Express (MAS - NDLS)",
    stations: ["Chennai Central (MAS)", "Gudur (GDR)", "Nellore (NLR)", "Ongole (OGL)", "Chirala (CLX)", "Bapatla (BPP)", "Tenali (TEL)", "Vijayawada (BZA)", "Khammam (KMT)", "Warangal (WL)", "Ramagundam (RDM)", "Manchiryal (MCI)", "Sirpur Kaghaznagar (SKZR)", "Balharshah (BPQ)", "Chandrapur (CD)", "Sewagram (SEGM)", "Nagpur (NGP)", "Narkher (NRKR)", "Pandhurna (PAR)", "Amla (AMLA)", "Betul (BZU)", "Ghoradongri (GDYA)", "Itarsi (ET)", "Hoshangabad (HBD)", "Habibganj (RKMP)", "Bhopal (BPL)", "Vidisha (BHS)", "Ganj Basoda (BAQ)", "Bina (BINA)", "Lalitpur (LAR)", "Jhansi (VGLJ)", "Gwalior (GWL)", "Morena (MRA)", "Dholpur (DHO)", "Agra Cantt (AGC)", "Mathura (MTJ)", "Faridabad (FDB)", "Hazrat Nizamuddin (NZM)", "New Delhi (NDLS)"]
  },
  {
    number: "12616",
    name: "Grand Trunk (GT) Express (NDLS - MAS)",
    stations: ["New Delhi (NDLS)", "Hazrat Nizamuddin (NZM)", "Faridabad (FDB)", "Mathura (MTJ)", "Agra Cantt (AGC)", "Dholpur (DHO)", "Morena (MRA)", "Gwalior (GWL)", "Jhansi (VGLJ)", "Lalitpur (LAR)", "Bina (BINA)", "Ganj Basoda (BAQ)", "Vidisha (BHS)", "Bhopal (BPL)", "Habibganj (RKMP)", "Hoshangabad (HBD)", "Itarsi (ET)", "Ghoradongri (GDYA)", "Betul (BZU)", "Amla (AMLA)", "Pandhurna (PAR)", "Narkher (NRKR)", "Nagpur (NGP)", "Sewagram (SEGM)", "Chandrapur (CD)", "Balharshah (BPQ)", "Sirpur Kaghaznagar (SKZR)", "Manchiryal (MCI)", "Ramagundam (RDM)", "Warangal (WL)", "Khammam (KMT)", "Vijayawada (BZA)", "Tenali (TEL)", "Bapatla (BPP)", "Chirala (CLX)", "Ongole (OGL)", "Nellore (NLR)", "Gudur (GDR)", "Chennai Central (MAS)"]
  }
];

export const MAJOR_AIRPORTS: { code: string; name: string; city: string }[] = [
  { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai" },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bengaluru" },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad" },
  { code: "CCU", name: "Netaji Subhash Chandra Bose International Airport", city: "Kolkata" },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai" },
  { code: "PAT", name: "Jay Prakash Narayan Airport", city: "Patna" },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad" },
  { code: "GOI", name: "Dabolim Airport", city: "Goa" },
  { code: "GOX", name: "Manohar International Airport (Mopa)", city: "Goa" },
  { code: "COK", name: "Cochin International Airport", city: "Kochi" },
  { code: "LKO", name: "Chaudhary Charan Singh International Airport", city: "Lucknow" },
  { code: "VNS", name: "Lal Bahadur Shastri Airport", city: "Varanasi" },
  { code: "IXC", name: "Shaheed Bhagat Singh International Airport", city: "Chandigarh" },
  { code: "JAI", name: "Jaipur International Airport", city: "Jaipur" },
  { code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati" },
  { code: "BBI", name: "Biju Patnaik International Airport", city: "Bhubaneswar" },
  { code: "RPR", name: "Swami Vivekananda Airport", city: "Raipur" },
  { code: "IXB", name: "Bagdogra Airport", city: "Siliguri" },
  { code: "IDR", name: "Devi Ahilya Bai Holkar Airport", city: "Indore" },
  { code: "DBR", name: "Darbhanga Airport", city: "Darbhanga" },
  { code: "IXR", name: "Birsa Munda Airport", city: "Ranchi" },
  { code: "DXB", name: "Dubai International Airport", city: "Dubai (UAE)" },
  { code: "DOH", name: "Hamad International Airport", city: "Doha (Qatar)" },
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok (Thailand)" },
  { code: "SIN", name: "Singapore Changi Airport", city: "Singapore" }
];

export const MAJOR_BUS_CITIES: string[] = [
  "New Delhi (ISBT Kashmiri Gate / Anand Vihar)",
  "Patna (Bairiya ISBT / Gandhi Maidan)",
  "Mumbai (Borivali / Sion / Vashi)",
  "Bengaluru (Majestic / Anand Rao / Madiwala)",
  "Hyderabad (MGBS / Ameerpet / Lakdikapul)",
  "Pune (Shivajinagar / Swargate / Wakad)",
  "Ahmedabad (Paldi / Geeta Mandir)",
  "Jaipur (Sindhi Camp / Narayan Singh Circle)",
  "Lucknow (Alambagh / Charbagh)",
  "Varanasi (Cantt Bus Stand / Lahartara)",
  "Gorakhpur (Railway Bus Station)",
  "Muzaffarpur (Bairiya Bus Stand)",
  "Darbhanga (Delhi More)",
  "Gaya (Govt Bus Stand)",
  "Ranchi (Khadgarha Bus Stand)",
  "Kolkata (Babughat / Esplanade)",
  "Indore (Sarwate / Vijay Nagar)",
  "Agra (ISBT / Idgah)",
  "Kanpur (Jhakarkati Bus Stand)",
  "Chandigarh (Sector 43 ISBT / Sector 17)",
  "Dehradun (ISBT)",
  "Haridwar (Bus Stand)",
  "Shimla (ISBT Tutikandi)",
  "Manali (Mall Road / Private Bus Stand)",
  "Amritsar (ISBT)",
  "Surat (Central Bus Stand / Ring Road)",
  "Chennai (CMBT Koyambedu / Kilambakkam)",
  "Goa (Panaji / Mapusa / Margao)"
];

export const TRAVEL_CLASSES = {
  train: [
    { value: "SL", label: "Sleeper (SL)" },
    { value: "3rd Ac", label: "Third AC (3A)" },
    { value: "2nd Ac", label: "Second AC (2A)" },
    { value: "1st Ac", label: "First AC (1A)" },
    { value: "3E", label: "AC 3 Economy (3E)" },
    { value: "CC", label: "AC Chair Car (CC)" },
    { value: "2S", label: "Second Sitting (2S)" },
    { value: "EC", label: "Exec. Chair Car (EC)" }
  ],
  flight: [
    { value: "Economy", label: "Economy Class" },
    { value: "Premium Economy", label: "Premium Economy" },
    { value: "Business", label: "Business Class" }
  ],
  bus: [
    { value: "AC Sleeper (2+1)", label: "AC Sleeper (2+1)" },
    { value: "AC Seater", label: "AC Seater" },
    { value: "Volvo Multi-Axle", label: "Volvo Multi-Axle AC Sleeper" },
    { value: "Non-AC Sleeper", label: "Non-AC Sleeper" },
    { value: "Non-AC Seater", label: "Non-AC Seater" }
  ]
};
