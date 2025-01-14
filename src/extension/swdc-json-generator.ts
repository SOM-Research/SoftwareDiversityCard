import { Model, Country, Language, Team, NoTeamEntity, isTargetCommunity, isOrganization, Governance, isGovernanceIndividual, GovernanceIndividual, isGovernanceOrganization, GovernanceOrganization, SocialContext, TargetCommunity, UseCase, Organization, Adaptation } from '../language/generated/ast.js';

export interface IJSONGenerator {
    model2Json(model : Model) : any | undefined;
}

export class JSONGenerator implements IJSONGenerator {

    model2Json(model : Model) : any | undefined {

        const organizations = model.organizationsAndTargetCommunities.filter(nte => isOrganization(nte)) as Organization[];
        const targetCommunities = model.organizationsAndTargetCommunities.filter(nte => isTargetCommunity(nte)) as TargetCommunity[];
    
        const softwareDiversityCard = {
            // master info
            countries: this.generateCountries(model.countries),
            languages: this.generateLanguages(model.languages),
            // context and governance
            targetCommunities: this.generateNoTeamEntities(model.languages, targetCommunities),
            organizations: this.generateNoTeamEntities(model.languages, organizations),
            governances: this.generateGovernances(model.governances),
            socialContexts: this.generateSocialContexts(model.countries, model.languages, model.socialContexts),
            useCases: this.generateUseCases(model.useCases),
            adaptations: this.generateAdaptations(model.adaptations),
            // teams and participants
            participants: this.generateParticipants(model),
            teams: this.generateTeams(model.teams)
        }
    
        return softwareDiversityCard;
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
    
    generateNoTeamEntities(languages: Language[], ntes: NoTeamEntity[]) : any[] | undefined {
        let result = new Array();
        ntes.forEach(nte => {
            let spokenLanguages = new Array();
            nte.culturalTeamCharacteristics.spokenLanguages.forEach(sl => {
                let spokenLanguage = {
                    language: languages.findLast(l => l.name == sl.language.$refText)?.code,
                    proficiency: sl.proficiency    
                };
                spokenLanguages.push(spokenLanguage);
            });
            let item = {
                id: nte.name,
                description: isTargetCommunity(nte) ? nte.description : null, // it is not elegant, but I do not know any other solution
                startingAgeRange: nte.personalTeamCharacteristics.startingAgeRange,
                endingAgeRange: nte.personalTeamCharacteristics.endingAgeRange,
                ethnicities: nte.personalTeamCharacteristics.ethnicities,
                genders: nte.personalTeamCharacteristics.genders,
                spokenLanguages: spokenLanguages,
                socioEconomicStati: nte.culturalTeamCharacteristics.socioEconomicStati,
                skillLevels: nte.culturalTeamCharacteristics.skillLevels,
                averageTenure: nte.culturalTeamCharacteristics.averageTenure
            };
            result.push(item)
        });
        return result;
    }
    
    generateGovernances(govs: Governance[]) : any[] | undefined {
        let result = new Array();
        govs.forEach(i => {
            let item = {
                id: i.name,
                governanceProcesses: i.governanceProcesses,
                funders: i.funders.filter(f => isGovernanceIndividual(f)).map(f => (f as GovernanceIndividual).governanceIndividual.$refText, 'participant').concat(
                    i.funders.filter(f => isGovernanceOrganization(f)).map(f => (f as GovernanceOrganization).governanceOrganization.$refText, 'organization')),
                shareholders: i.shareholders.filter(f => isGovernanceIndividual(f)).map(f => (f as GovernanceIndividual).governanceIndividual.$refText, 'participant').concat(
                    i.shareholders.filter(f => isGovernanceOrganization(f)).map(f => (f as GovernanceOrganization).governanceOrganization.$refText, 'organization'))
            };
            result.push(item)
        });
        return result;
    }
    
    generateSocialContexts(countries: Country[], languages: Language[], contexts: SocialContext[]) : any[] | undefined {
        let result = new Array();
        contexts.forEach(i => {
            let item = {
                id: i.name,
                description: i.description,
                culturalTraits: i.culturalTraits,
                country: countries.findLast(c => c.name == i.country?.$refText)?.alpha2Code,
                spokenLanguages: i.spokenLanguages.map(sl => languages.findLast(l => l.name == sl.$refText)?.code),
                relatedTeams: i.relatedTeams.map(rl => rl.$refText)
            };
            result.push(item)
        });
        return result;
    }
    
    generateUseCases(useCases: UseCase[]) : any[] | undefined {
        let result = new Array();
        useCases.forEach(i => {
            let item = {
                id: i.name,
                description: i.description,
                targetCommunities: i.targetCommunities.map(tc => tc.$refText)
            };
            result.push(item)
        });
        return result;
    }
    
    generateAdaptations(adaptation: Adaptation[]) : any[] | undefined {
        let result = new Array();
        adaptation.forEach(i => {
            let item = {
                id: i.name,
                description: i.description,
                release: i.release,
                useCases: i.useCases.map(uc => uc.$refText),
                targetCommunities: i.targetCommunities.map(tc => tc.$refText),
                relatedTeams: i.relatedTeams.map(rl => rl.$refText)
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
    
    generateTeams(teams: Team[]) : any[] | undefined {
        let result = new Array();
        teams.forEach(i => {
            let teamParticipants = new Array();
            i.teamParticipants.forEach(tp => {
                let teamParticipant = {
                    //participant: participants.findLast(p => p.name == tp.participant.$refText)?.name,
                    participant: tp.participant.$refText,
                    role: tp.role,
                    startingDate: tp.startingDate,
                    endingDate: tp.endingDate
                };
                teamParticipants.push(teamParticipant);
            });
            let item = {
                id: i.name,
                type: i.$type,
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