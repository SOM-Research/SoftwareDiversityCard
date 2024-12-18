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
    (internalRoles+=InternalRole)*
    //(profiles+=Profile)*
    // CONTEXT AND GOVERNANCE
    (deploymentContext=DeploymentContext)?
    (governance=Governance)?
    // PARTICIPANTS
    (participants+=Participant)*
    //(internalParticipants+=InternalParticipant)* | (externalParticipants+=ExternalParticipant)* |
    // TEAMS
    (teams+=Team)*
    //(crowdTesterTeams+=CrowdTesterTeam)* | (developmentTeams+=InternalTeam)* | (nonCodingContributors+=InternalTeam)* | (publicReporterTeams+=PublicReporterTeam)*
    ;

Participant:
    InternalParticipant | ExternalParticipant
    ;

Team:
    (CrowdTesterTeam | 'developmentTeam:' developmentTeam=InternalTeam | 'nonCodingContributorTeam:' nonCodingContributor=InternalTeam | PublicReporterTeam)
    'aggregatedProfile:' AggregatedProfile
    ;

fragment StringArray:
    '[' (stringElement+=STRING)
        ((','stringElement+=STRING)*']')?
    ;

fragment DateRange:
    dateRange = '{' (startDate=DATE) ',' (endDate=DATE) '}'
    ;

//fragment ProfileArray:
//    '[' (profile+=[Profile:ID])
//        ((','profile+=[Profile:ID])*']')?
//    ;


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

Profile:
    //'profile' name=ID
    ('personalCharacteristics:' personalCharacteristic+=PersonalCharacteristic)?
    ('culturalCharacteristics:' culturalCharacteristic+=CulturalCharacteristic)?
    ;

CulturalCharacteristic:
    ('spokenLanguages:' '[' (spokenLanguages+=[Language:ID])
        (','spokenLanguages+=[Language:ID])*']')?
    ('socioEconomicStatus:' socioEconomicStatus=STRING)?
    //('languageProficiency:' languageProficiency=STRING
    ('skillLevel:' skillLevel=STRING)?
    ('tenure:' tenure=STRING)?
    ;

PersonalCharacteristic:
    ('age:' age=INT)?
    ('ethnicity:' ethnicity=STRING)?
    ('gender:' gender=STRING)?
    ('country:' country=[Country:ID])?
    ;


// *****************************************************************
// CONTEXTS
// *****************************************************************

fragment CrowdTestersArray:
    ('relatedTesters:' '[' (relatedTesters+=[CrowdTesterTeam:ID])
        (',' relatedTesters+=[CrowdTesterTeam:ID])*']')?
    ;

DeploymentContext:
    'deploymentContext'
    name=ID
    ('useCases:' StringArray)?
    socialContext=SocialContext
    ('targetUsers:' (targetUsers+=TargetUser)+)?
    ('adaptations:' (adaptations+=Adaptation)+)?
    ;

TargetUser:
    'targetUser'
    'description:' description=STRING
    'profile:' profile=[Profile:ID]
    ;

Adaptation:
    'adaptation'
    'description:' description=STRING
    ('components:' StringArray)?
    CrowdTestersArray
    ;

Governance:
    'governance' name=ID
    // projectType
    ('governanceProcesses:' StringArray)?
    ('funders:' (funders+=GovernanceParticipant)+)?
    ('shareholders:' (shareholders+=GovernanceParticipant)+)?
    ;

GovernanceParticipant: Organization | Individual;

Organization:
    'organization'
    'name:' name=STRING
    'description:' description=STRING
    ;

Individual:
    'individual'
    'profile:' profile=[Profile:ID]
    ;

SocialContext:
    'socialContext' name=ID
    'description:' description=STRING
    'country:' country=[Country:ID]
    ('spokenLanguages:' '[' (spokenLanguages+=[Language:ID])
        (',' spokenLanguages+=[Language:ID])*']')?
    ('culturalTraits:' StringArray)?
    CrowdTestersArray
    ;


// *****************************************************************
// PARTICIPANTS
// *****************************************************************

InternalParticipant:
    'internalParticipant' name=ID
    'participantId:' participantId=STRING
    'profile:' Profile
    ;

ExternalParticipant:
    'externalParticipant' name=ID
    'profile:' Profile
    ;


// *****************************************************************
// TEAMS
// *****************************************************************

AggregatedProfile:
    'description:' description=STRING // TODO: to implement aggregated profiles
    ;

fragment ExternalParticipants:
    ('externalParticipants:' '[' (externalParticipants+=[ExternalParticipant:ID])
        (',' externalParticipants+=[ExternalParticipant:ID])*']')?
    ;

InternalRole:
    'internalRole'
    name=ID
    'description:' description=STRING
    ;

InternalTeam:
    //'aggregatedProfile:' AggregatedProfile
    ('internalParticipants:' '[(' internalParticipants+=[InternalParticipant:ID] ',' internalParticipantsRoles+=[InternalRole:ID] ')'
        (',' '(' internalParticipants+=[InternalParticipant:ID] ',' internalParticipantsRoles+=[InternalRole:ID] ')')*']')?
    ;

CrowdTesterTeam:
    'crowdTesterTeam' name=ID
    'testingGuidelines:' testingGuidelines=STRING
    // type
    'appMaturity:' appMaturity=STRING
    'timespan:' DateRange
    'numberOfTesters:' numberOfTesters=INT
    'iterations:' iterations=INT
    //'aggregatedProfile:' AggregatedProfile
    ExternalParticipants
    (LabourForceCrowdTesterTeam)?
    ;

fragment LabourForceCrowdTesterTeam:
    'salary:' salary=DOUBLE
    'labourRights:' StringArray
    'country:' country=[Country:ID]
    ;

PublicReporterTeam:
    'publicReporterTeam'
    // type
    'reportingMethod:' reportingMethod=STRING
    'reportingPlatform:' reportingPlatform=STRING
    //'aggregatedProfile:' AggregatedProfile
    ExternalParticipants
    ;


// *****************************************************************
// EXAMPLES OF ENUMERATIONS
// *****************************************************************
// PromptType returns string: 'Open' | 'Adversarial';
// AssessmentType returns string: 'Observational' | 'Utopian';
