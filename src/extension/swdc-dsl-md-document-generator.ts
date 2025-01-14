import { AstNode, LangiumParser} from 'langium';
import { createSoftwareDiversityCardServices } from '../language/swdc-dsl-module.js';
import { isModel } from '../language/generated/ast.js';
import { NodeFileSystem } from 'langium/node';
import { JSONGenerator } from './swdc-json-generator.js';


export interface Generator {
    generate(model : string | AstNode) : string | undefined;
}

export class MDDocumentGenerator implements Generator {

    private readonly parser: LangiumParser;

    constructor() {       
        const services = createSoftwareDiversityCardServices(NodeFileSystem);
        this.parser = services.SoftwareDiversityCard.parser.LangiumParser;
    }

    generate(model : string) : string | undefined {
        const astNode = this.parser.parse(model).value;
        if (isModel(astNode)) {
            const json_generator = new JSONGenerator();
            const sdc_json = json_generator.model2Json(astNode);
            return this.generateMDfromJSON(sdc_json);
        } else
            return undefined;
    }

    generateMDfromJSON(sdc: any) : string {
        const participantLabels = ['age', 'ethnicity', 'gender', 'socioEconomicStatus', 'skillLevel', 'tenure'];
        const entityLabels = ['type', 'startingAgeRange', 'endingAgeRange', 'ethnicities', 'genders', 'socioEconomicStati', 'skillLevels', 'averageTenure'];
        const teamLabels = entityLabels.concat(['startDate', 'endDate', 'teamSize', 'iterations'])
            .concat(['salary', 'labourRights']) // LabourForce
            .concat(['type', 'testingGuidelines', 'appMaturity']) // TesterTeam
            .concat(['type', 'reportingMethod', 'reportingPlatform']); // PublicReporterTeam
        const governanceLabels = ['projectType', 'governanceProcesses', 'funders', 'shareholders'];
        const socialContextLabels = ['description','culturalTraits', 'country', 'spokenLanguages', 'relatedTeams'];
        const useCaseLabels = ['description', 'targetCommunities'];
        const adaptationLabels = ['description', 'release', 'useCases', 'targetCommunities', 'relatedTeams'];

        let result = new Array();
        
        result.push(this.header('# Software Diversity Card'));
        result.push(this.header('## Entities and Individuals'));
        result.push(this.generateSubsection('### Participants', sdc.participants, participantLabels)); // TODO: spoken languages
        result.push(this.generateSubsection('### Teams', sdc.teams, teamLabels)); // TODO: team participants
        result.push(this.generateSubsection('### Target Communities', sdc.targetCommunities, teamLabels.concat('description')));
        result.push(this.generateSubsection('### Organizations', sdc.organizations, teamLabels));
        result.push(this.header('## Contexts'));
        result.push(this.generateSubsection('### Governance', sdc.governances, governanceLabels));
        result.push(this.generateSubsection('### Social Contexts', sdc.socialContexts, socialContextLabels));
        result.push(this.generateSubsection('### Use Cases', sdc.useCases, useCaseLabels));
        result.push(this.generateSubsection('### Adaptations', sdc.adaptations, adaptationLabels));

        return result.filter(function(element) { return element !== undefined; }).join('');
    }

    generateSubsection(title: string, elements: any[], labels: string[]) : string | undefined {
        if (elements.length > 0) {
           let result = this.header(title);
            for (var elem of elements) {
                var output = this.item(elem.id, labels.map(e => this.itemize(e, elem[e])));
                result = result.concat(output);
            }
            return result;
        };
        return undefined;
    }

    // Auxiliary formatting methods

    item(name: string, elements: string[]) : string {
        let boldName = '**' + name + '**';
        return boldName.concat('<br>', elements.filter(function(element) { return element !== ''; }).join(''), '<br>');
    }

    itemize(label: string, value: string[] | string) : string {
        if (value) {
            let formattedValue;
            if (Array.isArray(value)) formattedValue = '- '.concat(label, ': ', (value as string[]).join(', '));
            else formattedValue = '- '.concat(label, ': ', value as string);
            return formattedValue.concat('<br>');
        }
        else
            return '';
    }

    header(str: string) : string {
        return str.concat('<br><br>');
    }

}
 