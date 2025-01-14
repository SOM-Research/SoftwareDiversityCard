import { AstNode, LangiumParser} from 'langium';
import { createSoftwareDiversityCardServices } from '../language/swdc-dsl-module.js';
import { isModel } from '../language/generated/ast.js';
import { NodeFileSystem } from 'langium/node';
import { JSONGenerator } from './swdc-json-generator.js';


export interface Generator {
    generate(model : string | AstNode) : string | undefined;
}

export class JSONDocumentGenerator implements Generator {

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
            return JSON.stringify(sdc_json);
        } else
            return undefined;
    }

}
 