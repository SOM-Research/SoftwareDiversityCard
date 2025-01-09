import { AstNode, LangiumParser} from 'langium';
import { createSoftwareDiversityCardServices } from '../language/swdc-dsl-module.js';
import { Model, isModel, Country, Language, Organization, Participant, Team } from '../language/generated/ast.js';
import { NodeFileSystem } from 'langium/node';


export interface Generator {
    // Load the Abstract Syntax Tree of the .swdc active file
    generate(model : string | AstNode) : string | undefined;
    // Receives the parsed AST, generates the JSON string, and returns it
    model2Json(model : Model) : string | undefined;
}
 
/**
* JSON generator service main class
*/
export class DocumentationGenerator implements Generator {

    private readonly parser: LangiumParser;

    constructor() {       
        const services = createSoftwareDiversityCardServices(NodeFileSystem);
        this.parser = services.SoftwareDiversityCard.parser.LangiumParser;
    }

    generate(model : string) : string | undefined { // | AstNode) : string | undefined {
        //const astNode = (typeof(Model) == 'string' ? this.parser.parse(Model).value : Model);
        //return (isModel(astNode) ? this.model2Html(astNode) : undefined);
        const astNode = this.parser.parse(model).value;
        return (isModel(astNode) ? this.model2Json(astNode) : undefined);
    }

    // Generation of the output JSON string
    model2Json(model : Model) : string | undefined {

        //if (!isTestScenario(model.testScenario)) return undefined;
        //if (!isRequirementsModel(model.testScenario.requirementsModel)) return undefined;

        const softwareDiversityCard = {
            countries: this.generateCountries(model.countries),
            languages: this.generateLanguages(model.languages),
            organizations: this.generateOrganizations(model.languages, model.organizations),
            participants: this.generateParticipants(model),
            teams: this.generateTeams(model.participants, model.teams)
        }

        return JSON.stringify(softwareDiversityCard);
    }

    generateCountries(countries: Country[]) : any[] | undefined {
        let result = new Array();
        countries.forEach(i => {
            let item = {
                id: i.name,
                shortName: i.shortName,
                fullName: i.fullName,
                alpha2Code: i.alpha2Code
            };
            result.push(item)
        });
        return result;
    }

    generateLanguages(langs: Language[]) : any[] | undefined {
        let result = new Array();
        langs.forEach(i => {
            let item = {
                id: i.name,
                language: i.language,
                code: i.code
            };
            result.push(item);
        });
        return result;
    }

    generateOrganizations(languages: Language[], orgs: Organization[]) : any[] | undefined {
        let result = new Array();
        orgs.forEach(i => {
            let spokenLanguages = new Array();
            i.culturalTeamCharacteristics.spokenLanguages.forEach(sl => {
                let spokenLanguage = {
                    language: languages.findLast(l => l.name == sl.language.$refText)?.code,
                    proficiency: sl.proficiency    
                };
                spokenLanguages.push(spokenLanguage);
            });
            let item = {
                id: i.name,
                startingAgeRange: i.personalTeamCharacteristics.startingAgeRange,
                endingAgeRange: i.personalTeamCharacteristics.endingAgeRange,
                ethnicities: i.personalTeamCharacteristics.ethnicities,
                genders: i.personalTeamCharacteristics.genders,
                spokenLanguages: spokenLanguages,
                socioEconomicStati: i.culturalTeamCharacteristics.socioEconomicStati,
                skillLevels: i.culturalTeamCharacteristics.skillLevels,
                averageTenure: i.culturalTeamCharacteristics.averageTenure
            };
            result.push(item)
        });
        return result;
    }

    generateParticipants(model: Model) : any[] | undefined {
        let result = new Array();
        model.participants.forEach(i => {
            let spokenLanguages = new Array();
            i.culturalCharacteristics.spokenLanguages.forEach(sl => {
                let spokenLanguage = {
                    language: model.languages.findLast(l => l.name == sl.language.$refText)?.code,
                    proficiency: sl.proficiency    
                };
                spokenLanguages.push(spokenLanguage);
            });
            let item = {
                id: i.name,
                age: i.personalCharacteristics.age,
                ethnicity: i.personalCharacteristics.ethnicity,
                gender: i.personalCharacteristics.gender,
                country: model.countries.findLast(c => c.name == i.personalCharacteristics.country?.$refText)?.alpha2Code,
                spokenLanguages: spokenLanguages,
                socioEconomicStatus: i.culturalCharacteristics.socioEconomicStatus,
                skillLevel: i.culturalCharacteristics.skillLevel,
                tenure: i.culturalCharacteristics.tenure
            };
            result.push(item);
        });
        return result;
    }

    generateTeams(participants: Participant[], teams: Team[]) : any[] | undefined {
        let result = new Array();
        teams.forEach(i => {
            let teamParticipants = new Array();
            i.teamParticipants.forEach(tp => {
                let teamParticipant = {
                    participant: participants.findLast(p => p.name == tp.participant.$refText)?.name,
                    role: tp.role,
                    startingDate: tp.startingDate,
                    endingDate: tp.endingDate    
                };
                teamParticipants.push(teamParticipant);
            });
            let item = {
                id: i.name,
                startingAgeRange: i.personalTeamCharacteristics.startingAgeRange,
                endingAgeRange: i.personalTeamCharacteristics.endingAgeRange,
                ethnicities: i.personalTeamCharacteristics.ethnicities,
                genders: i.personalTeamCharacteristics.genders,
                socioEconomicStati: i.culturalTeamCharacteristics.socioEconomicStati,
                skillLevels: i.culturalTeamCharacteristics.skillLevels,
                averageTenure: i.culturalTeamCharacteristics.averageTenure,
                startDate: i.startDate,
                endDate: i.endDate,
                teamSize: i.teamSize,
                iterations: i.iterations,
                participants: teamParticipants
            };
            result.push(item)
        });
        return result;
    }
}
 