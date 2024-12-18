import { AstNode, LangiumParser} from 'langium';
import { createSoftwareDiversityCardServices } from '../language/swdc-dsl-module.js';
import { Model, isModel } from '../language/generated/ast.js';
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

        // const testScenario = model.testScenarios[0];
        // const requirementsModel = model.requirementsModel;
        // const requirements = model.ethicalRequirements;

        // collect all requirements from the model in an array,
        // so that it could be assigned to the scenario Object and be JSON.stringified
        // let modelReqIds = requirementsModel.requirements.map(r => r.$refText);
        // let reqs = new Array();
        // modelReqIds.forEach(function(reqId: string) {
        //     let req = requirements.find(r => r.name === reqId);
        //     if (req != undefined) {
        //         const reqCommsRefs = req.communities;
        //         const reqLangsRefs = req.languages;
        //         let commsLiterals : { [key: string]: string[] } = {};
        //         // collect all the Language objects that are referenced by the Requirement
        //         let langs = model.languages.filter(l => reqLangsRefs.map(l2 => l2.$refText).includes(l.name));
        //         // transform into code+region
        //         let langsKeys = langs.map(l => l.code + "_" + l.region);
        //         // for each requirement language, collect the communities' literals
        //         langs.forEach(lang => {
        //             const comms = model.sensitiveCommunities.filter(c => reqCommsRefs.map(c2 => c2.$refText).includes(c.name));
        //             const literals = comms.flatMap(c => c.literals).filter(l => l.language.$refText == lang.name).map(l => l.literal);
        //             const key = lang.code + "_" + lang.region;
        //             commsLiterals[key] = literals;
        //         });
        //         let concernId = req.concern.$refText;
        //         let concern = model.ethicalConcerns.filter(e => e.name == concernId)[0]
        //         let requirement = {
        //             name: req.name,
        //             rationale: req.rationale,
        //             languages: langsKeys, //req.languages.map(c => c.$refText), // get the name:IDs of the referenced Languages
        //             tolerance: req.tolerance,
        //             delta: req.delta,
        //             concern: req.concern.$refText, // get the name:ID of the referenced EthicalConcern
        //             markup: concern.markup.toUpperCase(),
        //             communities: commsLiterals,
        //             //communities: req.communities.map(c => c.$refText), // get the name:IDs of the referenced SensitiveCommunities
        //             inputs: req.inputs,
        //             reflections: req.reflections
        //         };
        //         reqs.push(requirement);   
        //     }
        // });
        
        const scenario = {
            // timestamp : testScenario.timestamp,
            // nTemplates : testScenario.nTemplates,
            // nRetries : testScenario.nRetries,
            // temperature : testScenario.temperature,
            // tokens : testScenario.tokens,
            // useLLMEval : testScenario.useLLMEval,
            // aiModels : testScenario.aiModels,
            // requirements : reqs
        };

        return JSON.stringify(scenario);
    }
}
 