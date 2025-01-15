import { AstNode, LangiumParser} from 'langium';
import { createSoftwareDiversityCardServices } from '../language/swdc-dsl-module.js';
import { isModel } from '../language/generated/ast.js';
import { NodeFileSystem } from 'langium/node';
import { JSONGenerator } from './swdc-json-generator.js';

enum EnumAdditionalAssociations {
    None,
    SpokenLanguages,
    TeamParticipants
};

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
        let result = new Array();
        
        result.push(this.header('# Software Diversity Card'));
        result.push(this.header('## Entities and Individuals'));
        result.push(this.generateSubsection('### Participants', sdc.participants, EnumAdditionalAssociations.SpokenLanguages));
        result.push(this.generateSubsection('### Teams', sdc.teams, EnumAdditionalAssociations.TeamParticipants));
        result.push(this.generateSubsection('### Target Communities', sdc.targetCommunities));
        result.push(this.generateSubsection('### Organizations', sdc.organizations));
        result.push(this.header('## Contexts'));
        result.push(this.generateSubsection('### Governance', sdc.governances));
        result.push(this.generateSubsection('### Social Contexts', sdc.socialContexts));
        result.push(this.generateSubsection('### Use Cases', sdc.useCases));
        result.push(this.generateSubsection('### Adaptations', sdc.adaptations));

        return result.filter(function(element) { return element !== undefined; }).join('');
    }

    generateSubsection(title: string, elements: any[], additionalAssocs: EnumAdditionalAssociations = EnumAdditionalAssociations.None) : string | undefined {
        if (elements.length > 0) {
           let result = this.header(title);
            for (var elem of elements) {
                var properties = Object.getOwnPropertyNames(elem).filter(p => p !== 'id');
                var spokenLanguages = '', teamParticipants = '';
                if (additionalAssocs == EnumAdditionalAssociations.SpokenLanguages) {
                    properties = properties.filter(p => p !== 'spokenLanguages');
                    spokenLanguages = this.generateSpokenLanguages(elem['spokenLanguages']);
                    //parsedProperties.push(spokenLanguages);
                }
                else if (additionalAssocs == EnumAdditionalAssociations.TeamParticipants) {
                    properties = properties.filter(p => p !== 'participants');
                    teamParticipants = this.generateTeamParticipants(elem['participants']);
                    //parsedProperties.push(teamParticipants);
                }
                var parsedProperties = properties.map(p => this.itemize(p, elem[p]));
                parsedProperties.push(spokenLanguages);
                parsedProperties.push(teamParticipants);
                var output = this.item(elem.id, parsedProperties);
                result = result.concat(output);
            }
            return result;
        };
        return undefined;
    }

    generateSpokenLanguages(spokenLanguages: any[]) : string {
        let result = this.label('spokenLanguages').concat('<br>');
        result = result.concat('| language | proficiency |<br>');
        result = result.concat('| -------- | ----------- |<br>');
        let languages = spokenLanguages.map(sl => '| '.concat(sl.language, ' | ', sl.proficiency, ' |'));
        return result.concat(languages.join('<br>'), '<br>');
    }

    generateTeamParticipants(teamParticipants: any[]) : string {
        let result = this.label('teamParticipants').concat('<br>');
        result = result.concat('| participant | role | start | end |<br>');
        result = result.concat('| ----------- | ---- | ----- | --- |<br>');
        let participants = teamParticipants.map(tp =>
                '| '.concat(
                tp.participant,
                ' | ', tp.role,
                ' | ', tp.startingDate,
                (tp.endingDate) ? ' | ' + tp.endingDate : '',
                ' |'
            ));
        return result.concat(participants.join('<br>'), '<br>');
    }

    // Auxiliary formatting methods

    item(name: string, elements: string[]) : string {
        let boldName = this.header('#### ' + name);
        return boldName.concat(elements.filter(function(element) { return element !== ''; }).join(''), '<br>');
    }

    itemize(label: string, value: string[] | string) : string {
        if (value) {
            let formattedValue;
            if (Array.isArray(value)) formattedValue = this.label(label).concat((value as string[]).join(', '));
            else formattedValue = this.label(label).concat(value as string);
            return formattedValue.concat('<br>');
        }
        else
            return '';
    }

    header(str: string) : string {
        return str.concat('<br><br>');
    }

    label(str: string) : string {
        return '- _'.concat(str, '_: ');
    }

}
 