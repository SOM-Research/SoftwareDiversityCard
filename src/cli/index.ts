import chalk from 'chalk';
import { Command } from 'commander';
import { Model } from '../language/generated/ast.js';
import { SoftwareDiversityCardLanguageMetaData } from '../language/generated/module.js';
import { createSoftwareDiversityCardServices } from '../language/swdc-dsl-module.js';
import { extractAstNode/*, extractDocument*/ } from './cli-util.js';
import { generateJavaScript } from './generator.js';
//import { generatePrompt } from './generate-prompt';
import { NodeFileSystem } from 'langium/node';


export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createSoftwareDiversityCardServices(NodeFileSystem).SoftwareDiversityCard;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);

    const fileExtensions = SoftwareDiversityCardLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program.parse(process.argv);
}