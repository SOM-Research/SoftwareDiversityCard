grammar SoftwareDiversityCard


terminal ID: /[_a-zA-Z][\w_]*/;
//terminal BOOLEAN: /true|false/;
//BOOLEAN returns string: 'True' | 'False';
terminal STRING: /"[^"]*"|'[^']*'/;
terminal FLOAT returns number: /1.0|0.[0-9]+/;
terminal INT returns number: /[1-9][0-9]*/;


hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

entry Model:
    // MASTER INFO
    (labours+=Labour)* | (profiles+=Profile)* |
    // CONTEXT AND GOVERNANCE
    (deploymentContext=DeploymentContext)? | (governance=Governance)? |
    // PARTICIPANTS
    (internalParticipants+=InternalParticipant)* | (externalParticipants+=ExternalParticipant)* |
    // TEAMS
    (crowdTesterTeams+=CrowdTesterTeam)* | (developmentTeams+=InternalTeam)* | (nonCodingContributors+=InternalTeam)* | (publicReporterTeams+=PublicReporterTeam)*
    ;

fragment StringArray:
    '[' (stringElement+=STRING)
        ((','stringElement+=STRING)*']')?
    ;

fragment ProfileArray:
    '[' (profile+=[Profile:ID])
        ((','profile+=[Profile:ID])*']')?
    ;


// *****************************************************************
// MASTER INFO
// *****************************************************************

Labour:
    'labour' name=ID
    'salary:' salary=FLOAT
    'labourRights:' StringArray
    'country:' country=STRING
    ;

Profile:
    'profile' name=ID
    ('culturalCharacteristics:' culturalCharacteristics+=CulturalCharacteristic)*
    ('personalCharacteristics:' personalCharacteristics+=PersonalCharacteristic)*
    ;

CulturalCharacteristic:
    // all attributes could be of a given user-defined enumeration type
    'spokenLanguage:' spokenLanguage=STRING
    'socioEconomicStatus:' socioEconomicStatus=STRING
    'languageProficiency:' languageProficiency=STRING
    'skillLevel:' skillLevel=STRING
    'tenure:' tenure=STRING
    ;

PersonalCharacteristic:
    'age:' age=INT
    // all attributes could be of a given user-defined enumeration type
    'ethnicity:' ethnicity=STRING
    'gender:' gender=STRING
    // country
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
    ('governanceProcesses:' StringArray)?
    ('funders:' ProfileArray)?
    ('shareholders:' ProfileArray)?
    ;

SocialContext:
    'socialContext' name=ID
    'description:' description=STRING
    'region:' region=STRING
    ('spokenLanguages:' StringArray)?
    ('culturalTraits:' StringArray)?
    CrowdTestersArray
    ;


// *****************************************************************
// PARTICIPANTS
// *****************************************************************

InternalParticipant:
    name=ID
    'profile:' profile=[Profile:ID]
    // assignedTasks
    // participant
    ;

ExternalParticipant:
    name=ID
    'profile:' profile=[Profile:ID]
    ;


// *****************************************************************
// TEAMS
// *****************************************************************

fragment AggregatedProfile:
    'aggregatedProfile:' aggregatedProfile=[Profile:ID]
    ;

fragment ExternalParticipants:
    ('externalParticipants:' '[' (externalParticipants+=[ExternalParticipant:ID])
        (',' externalParticipants+=[ExternalParticipant:ID])*']')?
    ;

InternalTeam:
    AggregatedProfile
    ('internalParticipants:' '[' (internalParticipants+=[InternalParticipant:ID])
        (',' internalParticipants+=[InternalParticipant:ID])*']')?
    ;

CrowdTesterTeam:
    'crowdTester' name=ID
    'testingGuidelines:' testingGuidelines=STRING
    'numberOfTesters:' numberOfTesters=INT
    'iterations:' iterations=INT
    AggregatedProfile
    ExternalParticipants
    ;

PublicReporterTeam:
    'reportingMethod:' reportingMethod=STRING
    'reportingPlatform:' reportingPlatform=STRING
    AggregatedProfile
    ExternalParticipants
    ;


// *****************************************************************
// EXAMPLES OF ENUMERATIONS
// *****************************************************************
// PromptType returns string: 'Open' | 'Adversarial';
// AssessmentType returns string: 'Observational' | 'Utopian';
