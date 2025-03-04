import { Model, Team, NoTeamEntity, Governance, SocialContext, UseCase, Adaptation, Body} from '../language/generated/ast.js';

export interface IJSONGenerator {
    model2Json(model : Model) : any | undefined;
}

export class JSONGenerator implements IJSONGenerator {

    model2Json(model : Model) : any | undefined {

        //const organizations = model.organizations.filter(nte => isOrganization(nte)) as Organization[];
        //const targetCommunities = model.targetCommunity.filter(nte => isTargetCommunity(nte)) as TargetCommunity[];
    
        const softwareDiversityCard = {
            // master info
            name: model.name,
            description: model.desc,
            // usage and governance
            organizations: this.generateNoTeamEntities(model.organizations),
            targetCommunities: this.generateNoTeamEntities(model.targetCommunity),
            bodies: this.generateBodies(model.bodies),
            governances: this.generateGovernances(model.governances),
            socialContexts: this.generateSocialContexts(model.socialContexts),
            useCases: this.generateUseCases(model.useCases),
            adaptations: this.generateAdaptations(model.adaptations),
            // teams and participants
            participants: this.generateParticipants(model),
            teams: this.generateTeams(model.teams)
        }
    
        return softwareDiversityCard;
    }
    
    // generateCountries(countries: Country[]) : any[] | undefined {
    //     let result = new Array();
    //     countries.forEach(i => {
    //         let item = {
    //             id: i.name,
    //             shortName: i.shortName,
    //             fullName: i.fullName,
    //             alpha2Code: i.alpha2Code
    //         };
    //         result.push(item)
    //     });
    //     return result;
    // }
    
    // generateLanguages(langs: Language[]) : any[] | undefined {
    //     let result = new Array();
    //     langs.forEach(i => {
    //         let item = {
    //             id: i.name,
    //             language: i.language,
    //             code: i.code
    //         };
    //         result.push(item);
    //     });
    //     return result;
    // }
    
    generateNoTeamEntities(ntes: NoTeamEntity[]) : any[] | undefined {
        let result = new Array();
        ntes.forEach(nte => {
            let spokenLanguages = new Array();
            nte.spokenLanguages.forEach(sl => {
                let spokenLanguage = {
                    language: sl.language, // languages.findLast(l => l.name == sl.language.$refText)?.code,
                    proficiency: sl.proficiency    
                };
                spokenLanguages.push(spokenLanguage);
            });
            let item = {
                id: nte.name,
                //description: isTargetCommunity(nte) ? nte.description : null, // it is not elegant, but I do not know any other solution
                startingAgeRange: nte.startingAgeRange,
                endingAgeRange: nte.endingAgeRange,
                ethnicities: nte.ethnicities,
                genders: nte.genders,
                spokenLanguages: spokenLanguages,
                socioEconomicStati: nte.socioEconomicStati,
                skillLevels: nte.skillLevels,
                averageTenure: nte.averageTenure
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
                projectType: i.projectType,
                //governanceProcesses: i.governanceProcesses
                //bodies: i.bodies
            };
            result.push(item)
        });
        return result;
    }

    generateBodies(bodies: Body[]) : any[] | undefined {
        let result = new Array();
        bodies.forEach(i => {
            let item = {
                id: i.name,
                description: i.description,
                type: i.bodyType,
                //organizations: i.orgs,
                //individuals: i.individuals
                //members: i.members.filter(f => isBodyIndividual(f)).map(f => (f as BodyIndividual).bodyIndividual.$refText, 'individual').concat(
                //    i.members.filter(f => isBodyOrganization(f)).map(f => (f as BodyOrganization).bodyOrganization.$refText, 'organization'))
            };
            result.push(item)
        });
        return result;
    }
    
    generateSocialContexts(contexts: SocialContext[]) : any[] | undefined {
        let result = new Array();
        contexts.forEach(i => {
            let item = {
                id: i.name,
                description: i.description,
                culturalTraits: i.culturalTraits,
                country: i.country, // countries.findLast(c => c.name == i.country?.$refText)?.alpha2Code,
                spokenLanguages: i.spokenLanguages, // i.spokenLanguages.map(sl => languages.findLast(l => l.name == sl.$refText)?.code),
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
            i.spokenLanguages.forEach(sl => {
                let spokenLanguage = {
                    language: sl.language, // model.languages.findLast(l => l.name == sl.language.$refText)?.code,
                    proficiency: sl.proficiency    
                };
                spokenLanguages.push(spokenLanguage);
            });
            let item = {
                id: i.name,
                age: i.age,
                location: i.location,
                workplaceType: i.workplaceType,
                ethnicity: i.ethnicity,
                gender: i.gender,
                disabilities: i.disabilities,
                sexualOrientation: i.sexualOrientation,
                religion: i.religion,
                country: i.country, // model.countries.findLast(c => c.name == i.personalCharacteristics.country?.$refText)?.alpha2Code,
                spokenLanguages: spokenLanguages,
                socioEconomicStatus: i.socioEconomicStatus,
                skillLevel: i.skillLevel,
                tenure: i.tenure,
                participantId: i.participantId
            };
            result.push(item);
        });
        return result;
    }
    
    generateTeams(teams: Team[]) : any[] | undefined {
        let result = new Array();
        teams.forEach(i => {
            let spokenLanguages = new Array();
            i.spokenLanguages.forEach(sl => {
                let spokenLanguage = {
                    language: sl.language, // model.languages.findLast(l => l.name == sl.language.$refText)?.code,
                    proficiency: sl.proficiency    
                };
                spokenLanguages.push(spokenLanguage);
            });
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
                description: i.description,
                // Entity
                startingAgeRange: i.startingAgeRange,
                endingAgeRange: i.endingAgeRange,
                locations: i.locations,
                workplaceType: i.workplaceType,
                ethnicities: i.ethnicities,
                genders: i.genders,
                disabilities: i.disabilities,
                sexualOrientations: i.sexualOrientations,
                religiousBeliefs: i.religiousBeliefs,
                countries: i.countries,
                educationalLevels: i.educationalLevels,
                spokenLanguages: spokenLanguages,
                socioEconomicStati: i.socioEconomicStati,
                skillLevels: i.skillLevels,
                averageTenure: i.averageTenure,
                // Team attributes
                startDate: i.startDate,
                endDate: i.endDate,
                teamSize: i.teamSize,
                iterations: i.iterations,
                // LabourForce
                salary: i.salary,
                labourRights: i.labourRights,
                country: i.country,
                participants: teamParticipants
            };
            result.push(item)
        });
        return result;
    }
    
}