// EL OUTPUT TIENE QUE TENER FORMATO 'JSON'
// EL GENERADOR DARÁ UN .MD

grammar SoftwareDiversityCard


terminal ID: /[_a-zA-Z][\w_]*/;
//terminal BOOLEAN: /true|false/;
//BOOLEAN returns string: 'True' | 'False';
terminal STRING: /"[^"]*"|'[^']*'/;
//terminal FLOAT returns number: /1.0|0.[0-9]+/;
terminal INT returns number: /[1-9][0-9]*/;
terminal DOUBLE returns number: INT '.' INT;
terminal DATE returns Date: /(3[01]|[12][0-9]|0?[1-9])(\/|-)(1[0-2]|0?[1-9])\2([0-9]{2})?[0-9]{2}/;
    // /^(?:\d{4})-(?:\d{2})-(?:\d{2})T(?:\d{2}):(?:\d{2}):(?:\d{2}(?:\.\d*)?)(?:(?:-(?:\d{2}):(?:\d{2})|Z)?)$/; // ISO 8061

//terminal ISO6391 returns string: /"[a-z]{2}"|'[a-z]{2}'/; // two-letter language codes defined in ISO 639-1
//terminal ISO3166ALPHA2 returns string: /"[A-Z]{2}"|'[A-Z]{2}'/; // two-letter country codes defined in ISO 3166-1


hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

entry Model:
    // MASTER INFO
    (countries+=Country)*
    (languages+=Language)*
    // CONTEXT AND GOVERNANCE
    (organizations+=Organization)*
    (targetCommunities+=TargetCommunity)*
    (governances+=Governance)*
    (socialContexts+=SocialContext)*
    (useCases+=UseCase)*
    (adaptations+=Adaptation)*
    // PARTICIPANTS
    (participants+=Participant)*
    // TEAMS
    (teams+=Team)*
    ;

fragment StringArray:
    '[' (stringElement+=STRING)
        ((','stringElement+=STRING)*']')?
    ;

fragment DateRange:
    dateRange += '{' (startingDate+=DATE) ',' (endingDate+=DATE) '}'
    ;


// *****************************************************************
// MASTER INFO
// *****************************************************************

Country:
    'country' name=ID
    ('shortName:' shortName=STRING)?
    ('fullName:' fullName=STRING)?
    ('alpha2Code:' alpha2Code=STRING)?//ISO3166ALPHA2)?
    ;

Language:
    'language' name=ID
    ('language:' language=STRING)?
    ('code:' code=STRING)?//ISO6391)?
    ;

RoleType returns string: 'reporter' | 'documentor' | 'translator' | 'developer' | 'commenter' | 'reactor' | 'reviewer' | 'merger' | 'developerRelations';
SESType returns string: 'upperClass' | 'upperMiddleClass' | 'middleClass' | 'lowerMiddleClass' | 'lowerClass';
SkillLevelType returns string: 'expert' | 'proficient' | 'advanced' | 'competent' | 'beginner';
LanguageLevelType returns string: 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';


// *****************************************************************
// CONTEXTS
// *****************************************************************

fragment TeamsArray:
    ('relatedTeams:' '[' (relatedTeams+=[Team:ID])
        (',' relatedTeams+=[Team:ID])*']')?
    ;

UseCase:
    'useCase' name=ID
    'description:' description=STRING
    ('targetCommunities:' '[' (targetCommunities+=[TargetCommunity:ID])
        (',' targetCommunities+=[TargetCommunity:ID])*']')?
    ;

Adaptation:
    'adaptation' name=ID
    'description:' description=STRING
    ('release:' release=STRING)?
    ('useCases:' '[' (useCases+=[UseCase:ID])
        (',' useCases+=[UseCase:ID])*']')?
    ('targetCommunities:' '[' (targetCommunities+=[TargetCommunity:ID])
        (',' targetCommunities+=[TargetCommunity:ID])*']')?
    TeamsArray
    ;

Governance:
    'governance' name=ID
    // projectType
    ('governanceProcesses:' StringArray)?
    ('funders:' (funders+=GovernanceParticipant)+)?
    ('shareholders:' (shareholders+=GovernanceParticipant)+)?
    ;

GovernanceParticipant: GovernanceOrganization | GovernanceIndividual;

GovernanceOrganization:
    governanceOrganization=[Organization:ID]
    ;

GovernanceIndividual:
    governanceIndividual=[Participant:ID]
    ;

SocialContext:
    'socialContext' name=ID
    'description:' description=STRING
    ('culturalTraits:' StringArray)?
    'country:' country=[Country:ID]
    ('spokenLanguages:' '[' (spokenLanguages+=[Language:ID])
        (',' spokenLanguages+=[Language:ID])*']')?
    TeamsArray
    ;


// *****************************************************************
// PARTICIPANTS
// *****************************************************************

Participant:
    'participant' name=ID
    'personalCharacteristics:' personalCharacteristic+=PersonalCharacteristic
    'culturalCharacteristics:' culturalCharacteristic+=CulturalCharacteristic
    ('participantId:' participantId=STRING)?
    ;

CulturalCharacteristic:
    ('spokenLanguages:' '[(' spokenLanguages+=[Language:ID] ',' spokenLanguagesLevel+=LanguageLevelType ')'
        (',' '(' spokenLanguages+=[Language:ID] ',' spokenLanguagesLevel+=LanguageLevelType ')')*']')?
    ('socioEconomicStatus:' socioEconomicStatus=SESType)?
    ('skillLevel:' skillLevel=SkillLevelType)?
    ('tenure:' tenure=DOUBLE)?
    ;

PersonalCharacteristic:
    ('age:' age=INT)?
    ('ethnicity:' ethnicity=STRING)?
    ('gender:' gender=STRING)?
    ('country:' country=[Country:ID])?
    ;


// *****************************************************************
// TEAMS
// *****************************************************************

fragment Entity:
    'personalCharacteristics:' personalTeamCharacteristic+=PersonalTeamCharacteristic
    'culturalCharacteristics:' culturalTeamCharacteristic+=CulturalTeamCharacteristic
    ;

PersonalTeamCharacteristic:
    'startingAgeRange:' startingAgeRange=INT
    'endingAgeRange:' endingAgeRange=INT
    'ethnicities:' StringArray
    'genders:' StringArray
    ;

CulturalTeamCharacteristic:
    ('spokenLanguages:' '[(' spokenLanguages+=[Language:ID] ',' spokenLanguagesLevel+=LanguageLevelType ')'
        (',' '(' spokenLanguages+=[Language:ID] ',' spokenLanguagesLevel+=LanguageLevelType ')')*']')?
    'socioEconomicStati:' '[' (socioEconomicStati+=SESType)
        (',' socioEconomicStati+=SESType)*']'
    'skillLevels:' '[' (skillLevels+=SkillLevelType)
        (',' skillLevels+=SkillLevelType)*']'
    'averageTenure:' averageTenure=DOUBLE
    ;

Team:
    (TesterTeam | 'developmentTeam' developmentTeam=InternalTeam | 'nonCodingContributorTeam' nonCodingContributor=InternalTeam | PublicReporterTeam |
    TargetCommunity | 'organization' organization=Organization)
    ;

fragment TeamAttributes:
    name=ID
    Entity
    'startDate:' startDate=DATE
    'endDate:' endDate=DATE
    'teamSize:' teamSize=INT
    ('iterations:' iterations=INT)?
    ('teamParticipants:' '[(' teamParticipants+=[Participant:ID] ',' teamParticipantsRoles+=RoleType ',' DateRange ')'
        (',' '(' teamParticipants+=[Participant:ID] ',' teamParticipantsRoles+=RoleType ',' DateRange ')')*']')?
    (LabourForce)?
    ;

fragment LabourForce:
    'salary:' salary=DOUBLE
    'labourRights:' StringArray
    'country:' country=[Country:ID]
    ;

InternalTeam:
    TeamAttributes;

TesterTeam:
    'testerTeam' TeamAttributes
    'testingGuidelines:' testingGuidelines=STRING
    'appMaturity:' appMaturity=STRING
    ;

PublicReporterTeam:
    'publicReporterTeam' TeamAttributes
    'reportingMethod:' reportingMethod=STRING
    'reportingPlatform:' reportingPlatform=STRING
    ;

Organization:
    TeamAttributes
    ;

TargetCommunity:
    'targetCommunity' TeamAttributes
    'description:' description=STRING
    ;
