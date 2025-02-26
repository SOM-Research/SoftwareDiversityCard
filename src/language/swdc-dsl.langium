grammar SoftwareDiversityCard

terminal ID: /[_a-zA-Z][\w_]*/;
terminal STRING: /"[^"]*"|'[^']*'/;
terminal NUMBER returns number: /[0-9]+(\.[0-9])?/;
Dash returns string: "-";
DATE returns string: NUMBER+Dash+NUMBER+Dash+NUMBER;


hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

entry Model:
    // CONTEXT AND GOVERNANCE
    (organizationsAndTargetCommunities+=NoTeamEntity)*
    (bodies+=Body)*
    (governances+=Governance)*
    (socialContexts+=SocialContext)*
    (useCases+=UseCase)*
    (adaptations+=Adaptation)*
    // PARTICIPANTS
    (participants+=Participant)*
    // TEAMS
    (teams+=Team)*
    ;

StringArray:
    '[' (stringElement+=STRING)
        ((',' stringElement+=STRING)* ']')?
    ;


// *****************************************************************
// MASTER INFO
// *****************************************************************

SpokenLanguage:
    language=ISO639 ','
    proficiency=LanguageLevelType
    ;

BodyType returns string: 'funders' | 'directors' | 'administrators' | 'other';
RoleType returns string: 'reporter' | 'documentor' | 'translator' | 'developer' | 'commenter' | 'reactor' | 'reviewer' | 'merger' | 'developerRelations';
SESType returns string: 'upperClass' | 'upperMiddleClass' | 'middleClass' | 'lowerMiddleClass' | 'lowerClass';
SkillLevelType returns string: 'expert' | 'proficient' | 'advanced' | 'competent' | 'beginner';
LanguageLevelType returns string: 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';
EducationalLevelType returns string: 'earlyChildhood' | 'primary' | 'lowerSecondary' | 'upperSecondary' | 'postSecondaryNonTertiary' | 'shortCycleTertiary' | 'bachelorEquivalent' | 'masterEquivalent' | 'doctorateEquivalent';
WorkplaceType returns string: 'remote' | 'hybrid' | 'presential';

ISO3166 returns string: 'Andorra' | 'UnitedArabEmirates' | 'Afghanistan' | 'AntiguaandBarbuda' | 'Anguilla' | 'Albania' | 'Armenia' | 'Angola' | 'Antarctica' | 'Argentina' | 'AmericanSamoa' | 'Austria' | 'Australia' | 'Aruba' | 'ÅlandIslands' | 'Azerbaijan' | 'BosniaandHerzegovina' | 'Barbados' | 'Bangladesh' | 'Belgium' | 'BurkinaFaso' | 'Bulgaria' | 'Bahrain' | 'Burundi' | 'Benin' | 'SaintBarthélemy' | 'Bermuda' | 'BruneiDarussalam' | 'Bolivia,PlurinationalStateof' | 'Bonaire,SintEustatiusandSaba' | 'Brazil' | 'Bahamas' | 'Bhutan' | 'BouvetIsland' | 'Botswana' | 'Belarus' | 'Belize' | 'Canada' | 'Cocos(Keeling)Islands' | 'Congo,DemocraticRepublicofthe' | 'CentralAfricanRepublic' | 'Congo' | 'Switzerland' | 'CôtedIvoire' | 'CookIslands' | 'Chile' | 'Cameroon' | 'China' | 'Colombia' | 'CostaRica' | 'Cuba' | 'CaboVerde' | 'Curaçao' | 'ChristmasIsland' | 'Cyprus' | 'Czechia' | 'Germany' | 'Djibouti' | 'Denmark' | 'Dominica' | 'DominicanRepublic' | 'Algeria' | 'Ecuador' | 'Estonia' | 'Egypt' | 'WesternSahara' | 'Eritrea' | 'Spain' | 'Ethiopia' | 'Finland' | 'Fiji' | 'FalklandIslands(Malvinas)' | 'Micronesia,FederatedStatesof' | 'FaroeIslands' | 'France' | 'Gabon' | 'UnitedKingdomofGreatBritainandNorthernIreland' | 'Grenada' | 'Georgia' | 'FrenchGuiana' | 'Guernsey' | 'Ghana' | 'Gibraltar' | 'Greenland' | 'Gambia' | 'Guinea' | 'Guadeloupe' | 'EquatorialGuinea' | 'Greece' | 'SouthGeorgiaandtheSouthSandwichIslands' | 'Guatemala' | 'Guam' | 'Guinea-Bissau' | 'Guyana' | 'HongKong' | 'HeardIslandandMcDonaldIslands' | 'Honduras' | 'Croatia' | 'Haiti' | 'Hungary' | 'Indonesia' | 'Ireland' | 'Israel' | 'IsleofMan' | 'India' | 'BritishIndianOceanTerritory' | 'Iraq' | 'Iran,IslamicRepublicof' | 'Iceland' | 'Italy' | 'Jersey' | 'Jamaica' | 'Jordan' | 'Japan' | 'Kenya' | 'Kyrgyzstan' | 'Cambodia' | 'Kiribati' | 'Comoros' | 'SaintKittsandNevis' | 'Korea,DemocraticPeoplesRepublicof' | 'Korea,Republicof' | 'Kuwait' | 'CaymanIslands' | 'Kazakhstan' | 'LaoPeoplesDemocraticRepublic' | 'Lebanon' | 'SaintLucia' | 'Liechtenstein' | 'SriLanka' | 'Liberia' | 'Lesotho' | 'Lithuania' | 'Luxembourg' | 'Latvia' | 'Libya' | 'Morocco' | 'Monaco' | 'Moldova,Republicof' | 'Montenegro' | 'SaintMartin(Frenchpart)' | 'Madagascar' | 'MarshallIslands' | 'NorthMacedonia' | 'Mali' | 'Myanmar' | 'Mongolia' | 'Macao' | 'NorthernMarianaIslands' | 'Martinique' | 'Mauritania' | 'Montserrat' | 'Malta' | 'Mauritius' | 'Maldives' | 'Malawi' | 'Mexico' | 'Malaysia' | 'Mozambique' | 'Namibia' | 'NewCaledonia' | 'Niger' | 'NorfolkIsland' | 'Nigeria' | 'Nicaragua' | 'Netherlands,Kingdomofthe' | 'Norway' | 'Nepal' | 'Nauru' | 'Niue' | 'NewZealand' | 'Oman' | 'Panama' | 'Peru' | 'FrenchPolynesia' | 'PapuaNewGuinea' | 'Philippines' | 'Pakistan' | 'Poland' | 'SaintPierreandMiquelon' | 'Pitcairn' | 'PuertoRico' | 'Palestine,Stateof' | 'Portugal' | 'Palau' | 'Paraguay' | 'Qatar' | 'Réunion' | 'Romania' | 'Serbia' | 'RussianFederation' | 'Rwanda' | 'SaudiArabia' | 'SolomonIslands' | 'Seychelles' | 'Sudan' | 'Sweden' | 'Singapore' | 'SaintHelena,AscensionandTristandaCunha' | 'Slovenia' | 'SvalbardandJanMayen' | 'Slovakia' | 'SierraLeone' | 'SanMarino' | 'Senegal' | 'Somalia' | 'Suriname' | 'SouthSudan' | 'SaoTomeandPrincipe' | 'ElSalvador' | 'SintMaarten(Dutchpart)' | 'SyrianArabRepublic' | 'Eswatini' | 'TurksandCaicosIslands' | 'Chad' | 'FrenchSouthernTerritories' | 'Togo' | 'Thailand' | 'Tajikistan' | 'Tokelau' | 'Timor-Leste' | 'Turkmenistan' | 'Tunisia' | 'Tonga' | 'Türkiye' | 'TrinidadandTobago' | 'Tuvalu' | 'Taiwan,ProvinceofChina' | 'Tanzania,UnitedRepublicof' | 'Ukraine' | 'Uganda' | 'UnitedStatesMinorOutlyingIslands' | 'UnitedStatesofAmerica' | 'Uruguay' | 'Uzbekistan' | 'HolySee' | 'SaintVincentandtheGrenadines' | 'Venezuela,BolivarianRepublicof' | 'VirginIslands(British)' | 'VirginIslands(U.S.)' | 'VietNam' | 'Vanuatu' | 'WallisandFutuna' | 'Samoa' | 'Yemen' | 'Mayotte' | 'SouthAfrica' | 'Zambia' | 'Zimbabwe';
ISO639 returns string: 'Afar' | 'Abkhazian' | 'Avestan' | 'Afrikaans' | 'Akan' | 'Amharic' | 'Aragonese' | 'Arabic' | 'Assamese' | 'Avaric' | 'Aymara' | 'Azerbaijani' | 'Bashkir' | 'Belarusian' | 'Bulgarian' | 'Bislama' | 'Bambara' | 'Bengali' | 'Tibetan' | 'Breton' | 'Bosnian' | 'Catalan-Valencian' | 'Chechen' | 'Chamorro' | 'Corsican' | 'Cree' | 'Czech' | 'ChurchSlavonic-OldSlavonic-OldChurchSlavonic' | 'Chuvash' | 'Welsh' | 'Danish' | 'German' | 'Divehi-Dhivehi-Maldivian' | 'Dzongkha' | 'Ewe' | 'GreekModern' | 'English' | 'Esperanto' | 'Spanish-Castilian' | 'Estonian' | 'Basque' | 'Persian' | 'Fulah' | 'Finnish' | 'Fijian' | 'Faroese' | 'French' | 'WesternFrisian' | 'Irish' | 'Gaelic-ScottishGaelic' | 'Galician' | 'Guarani' | 'Gujarati' | 'Manx' | 'Hausa' | 'Hebrew' | 'Hindi' | 'HiriMotu' | 'Croatian' | 'Haitian-HaitianCreole' | 'Hungarian' | 'Armenian' | 'Herero' | 'Interlingua' | 'Indonesian' | 'Interlingue-Occidental' | 'Igbo' | 'SichuanYi-Nuosu' | 'Inupiaq' | 'Ido' | 'Icelandic' | 'Italian' | 'Inuktitut' | 'Japanese' | 'Javanese' | 'Georgian' | 'Kongo' | 'Kikuyu-Gikuyu' | 'Kuanyama-Kwanyama' | 'Kazakh' | 'Kalaallisut-Greenlandic' | 'CentralKhmer' | 'Kannada' | 'Korean' | 'Kanuri' | 'Kashmiri' | 'Kurdish' | 'Komi' | 'Cornish' | 'Kyrgyz-Kirghiz' | 'Latin' | 'Luxembourgish-Letzeburgesch' | 'Ganda' | 'Limburgan-Limburger-Limburgish' | 'Lingala' | 'Lao' | 'Lithuanian' | 'Luba-Katanga' | 'Latvian' | 'Malagasy' | 'Marshallese' | 'Maori' | 'Macedonian' | 'Malayalam' | 'Mongolian' | 'Marathi' | 'Malay' | 'Maltese' | 'Burmese' | 'Nauru' | 'NorwegianBokmål' | 'NorthNdebele' | 'Nepali' | 'Ndonga' | 'Dutch-Flemish' | 'NorwegianNynorsk' | 'Norwegian' | 'SouthNdebele' | 'Navajo-Navaho' | 'Chichewa-Chewa-Nyanja' | 'Occitan' | 'Ojibwa' | 'Oromo' | 'Oriya' | 'Ossetian-Ossetic' | 'Punjabi-Panjabi' | 'Pali' | 'Polish' | 'Pashto-Pushto' | 'Portuguese' | 'Quechua' | 'Romansh' | 'Rundi' | 'Romanian-Moldavian-Moldovan' | 'Russian' | 'Kinyarwanda' | 'Sanskrit' | 'Sardinian' | 'Sindhi' | 'NorthernSami' | 'Sango' | 'Sinhala-Sinhalese' | 'Slovak' | 'Slovenian' | 'Samoan' | 'Shona' | 'Somali' | 'Albanian' | 'Serbian' | 'Swati' | 'SouthernSotho' | 'Sundanese' | 'Swedish' | 'Swahili' | 'Tamil' | 'Telugu' | 'Tajik' | 'Thai' | 'Tigrinya' | 'Turkmen' | 'Tagalog' | 'Tswana' | 'Tonga' | 'Turkish' | 'Tsonga' | 'Tatar' | 'Twi' | 'Tahitian' | 'Uighur-Uyghur' | 'Ukrainian' | 'Urdu' | 'Uzbek' | 'Venda' | 'Vietnamese' | 'Volapük' | 'Walloon' | 'Wolof' | 'Xhosa' | 'Yiddish' | 'Yoruba' | 'Zhuang-Chuang' | 'Chinese' | 'Zulu';



// *****************************************************************
// CONTEXTS
// *****************************************************************

fragment TeamsArray:
    ('relatedTeams:' '[' (relatedTeams+=[Team:ID])
        (',' relatedTeams+=[Team:ID])* ']')?
    ;

UseCase:
    'useCase' name=ID
    'description:' description=STRING
    ('targetCommunities:' '[' (targetCommunities+=[TargetCommunity:ID])
        (',' targetCommunities+=[TargetCommunity:ID])* ']')?
    ;

Adaptation:
    'adaptation' name=ID
    'description:' description=STRING
    ('release:' release=STRING)?
    ('useCases:' '[' (useCases+=[UseCase:ID])
        (',' useCases+=[UseCase:ID])* ']')?
    ('targetCommunities:' '[' (targetCommunities+=[TargetCommunity:ID])
        (',' targetCommunities+=[TargetCommunity:ID])* ']')?
    TeamsArray
    ;

Body:
    'body' name=ID
    'description:' description=STRING
    'bodyType:' bodyType=BodyType
    ('members:' (members+=BodyParticipant)+)?
    ;

Governance:
    'governance' name=ID
    ('projectType:' projectType=STRING)?
    ('bodies:' '[' (bodies+=[Body:ID])
        (',' bodies+=[Body:ID])* ']')?
    ('governanceProcesses:' governanceProcesses=StringArray)?
    ;

BodyParticipant: BodyOrganization | BodyIndividual;

BodyOrganization:
    bodyOrganization=[Organization:ID]
    ;

BodyIndividual:
    bodyIndividual=[Participant:ID]
    ;

SocialContext:
    'socialContext' name=ID
    'description:' description=STRING
    ('culturalTraits:' culturalTraits=StringArray)?
    ('country:' country=ISO3166)?
    ('spokenLanguages:' '[' (spokenLanguages+=ISO639)
        (',' spokenLanguages+=ISO639)* ']')?
    TeamsArray
    ;


// *****************************************************************
// PARTICIPANTS
// *****************************************************************

Participant:
    'participant' name=ID
    'age:' age=NUMBER
    'location:' location=STRING
    'workplaceType:' workplaceType=WorkplaceType
    'ethnicity:' ethnicity=STRING
    'gender:' gender=STRING
    'disabilities:' '[' disabilities+=STRING
        (',' disabilities+=STRING)* ']'
    'sexualOrientation:' sexualOrientation=STRING
    'religion:' religion=STRING
    'country:' country=ISO3166
    'educationalLevel:' educationalLevel=EducationalLevelType
    'spokenLanguages:' '[' '(' spokenLanguages+=SpokenLanguage ')'
        (',' '(' spokenLanguages+=SpokenLanguage ')')* ']'
    'socioEconomicStatus:' socioEconomicStatus=SESType
    'skillLevel:' skillLevel=SkillLevelType
    'tenure:' tenure=NUMBER
    ('participantId:' participantId=STRING)?
    ;


// *****************************************************************
// TEAMS
// *****************************************************************

fragment Group:
    PersonalTeamCharacteristics
    CulturalTeamCharacteristics
    ;

fragment PersonalTeamCharacteristics:
    'ageRange:' '(' startingAgeRange=NUMBER ',' endingAgeRange=NUMBER ')'
    'locations:' '[' locations+=STRING
        (',' locations+=STRING)* ']'
    'workplaceType:' workplaceType=WorkplaceType
    'ethnicities:' '[' ethnicities+=STRING
        (',' ethnicities+=STRING)* ']'
    'genders:' '[' genders+=STRING
        (',' genders+=STRING)* ']'
    ('disabilities:' '[' disabilities+=STRING
        (',' disabilities+=STRING)* ']')?
    ('sexualOrientations:' '[' sexualOrientations+=STRING
        (',' sexualOrientations+=STRING)* ']')?
    ('religiousBeliefs:' '[' religiousBeliefs+=STRING
        (',' religiousBeliefs+=STRING)* ']')?
    'countries:' '[' countries+=ISO3166
        (',' countries+=ISO3166)* ']'
    ;

fragment CulturalTeamCharacteristics:
    'educationalLevels:' '[' educationalLevels+=EducationalLevelType
        (',' educationalLevels+=EducationalLevelType)* ']'
    'spokenLanguages:' '[' '(' spokenLanguages+=SpokenLanguage ')'
        (',' '(' spokenLanguages+=SpokenLanguage ')')* ']'
    'socioEconomicStati:' '[' (socioEconomicStati+=SESType)
        (',' socioEconomicStati+=SESType)* ']'
    'skillLevels:' '[' (skillLevels+=SkillLevelType)
        (',' skillLevels+=SkillLevelType)* ']'
    'averageTenure:' averageTenure=NUMBER
    ;

Team:
    (TesterTeam | DevelopmentTeam | NonCodingContributorTeam | PublicReporterTeam)
    ;

fragment TeamAttributes:
    name=ID
    Group
    'description:' description=STRING
    'startDate:' startDate=DATE
    ('endDate:' endDate=DATE)?
    ('teamSize:' teamSize=NUMBER)?
    ('iterations:' iterations=NUMBER)?
    ('teamParticipants:' '[' '(' teamParticipants+=TeamParticipant ')'
        (',' '(' teamParticipants+=TeamParticipant ')')* ']')?
    (LabourForce)?
    ;

TeamParticipant:
    participant=[Participant:ID] ','
    role=RoleType ','
    startingDate=DATE
    (',' endingDate+=DATE)?
    ;

fragment LabourForce:
    'salary:' salary=NUMBER
    'labourRights:' labourRights=StringArray
    'country:' country=ISO3166
    ;

DevelopmentTeam:
    'developmentTeam'
    TeamAttributes;

NonCodingContributorTeam:
    'nonCodingContributorTeam'
    TeamAttributes;

TesterTeam:
    'testerTeam'
    TeamAttributes
    'testersBackground:' testersBackground=STRING
    'testingGuidelines:' testingGuidelines=STRING
    'appMaturity:' appMaturity=STRING
    ;

PublicReporterTeam:
    'publicReporterTeam'
    TeamAttributes
    'reportingMethod:' reportingMethod=STRING
    'reportingPlatform:' reportingPlatform=STRING
    ;

NoTeamEntity: Organization | TargetCommunity;

Organization:
    'organization' name=ID
    Group
    ;

TargetCommunity:
    'targetCommunity' name=ID
    'description:' description=STRING
    Group
    ;
