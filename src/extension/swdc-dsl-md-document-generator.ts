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
        const teamLabels = ['type', 'startingAgeRange', 'endingAgeRange', 'ethnicities', 'genders', 'socioEconomicStati', 'skillLevels', 'averageTenure'];
        const governanceLabels = ['projectType', 'governanceProcesses'];
        const socialContextLabels = ['description','culturalTraits', 'country', 'spokenLanguages', 'relatedTeams'];
        const useCaseLabels = ['description', 'targetCommunities'];
        const adaptationLabels = ['description', 'release', 'useCases', 'targetCommunities', 'relatedTeams'];

        let result = new Array();
        
        result.push('# Software Diversity Card');
        result.push('## Entities and Individuals');
        result.push(this.generateSubsection('### Participants', sdc.participants, participantLabels)); // TODO: spoken languages
        result.push(this.generateSubsection('### Teams', sdc.teams, teamLabels)); // TODO: team participants
        result.push(this.generateSubsection('### Target Communities', sdc.targetCommunities, teamLabels.concat('description')));
        result.push(this.generateSubsection('### Organizations', sdc.organizations, teamLabels));
        result.push('## Contexts');
        result.push(this.generateSubsection('### Governance', sdc.governances, governanceLabels));
        result.push(this.generateSubsection('### Social Contexts', sdc.socialContexts, socialContextLabels));
        result.push(this.generateSubsection('### Use Cases', sdc.useCases, useCaseLabels));
        result.push(this.generateSubsection('### Adaptations', sdc.adaptations, adaptationLabels));

        return result.join('<br><br>');
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
        return name.concat('<br>', elements.join('<br>'), '<br><br>');
    }

    itemize(label: string, value: string) : string {
        return '- '.concat(label, ': ', value);
    }

    header(str: string) : string {
        return str.concat('<br><br>');
    }

}
 