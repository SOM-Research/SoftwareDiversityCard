import type { LanguageClientOptions, ServerOptions} from 'vscode-languageclient/node.js';
import * as vscode from 'vscode';
import * as path from 'node:path';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node.js';
import { DocumentationGenerator } from './swdc-dsl-documentation-generator.js';
import fs from 'fs';

let client: LanguageClient;

let previewPanel : vscode.WebviewPanel;

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
    client = startLanguageClient(context);
    context.subscriptions.push(vscode.commands.registerCommand('swdc-dsl.generateJson', async () => {
        await generateJsonService(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('swdc-dsl.saveJsonDocument', async () => {
        await saveJsonDocument(context);
     }));
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
    if (client) {
        return client.stop();
    }
    return undefined;
}

function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
    const serverModule = context.asAbsolutePath(path.join('out', 'language', 'main.cjs'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
    // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
    const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`] };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };

    const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.{swdc,sdc}');
    context.subscriptions.push(fileSystemWatcher);

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'swdc-dsl' }],
        synchronize: {
            // Notify the server about file changes to files contained in the workspace
            fileEvents: fileSystemWatcher
        }
    };

    // Create the language client and start the client.
    const client = new LanguageClient(
        'swdc-dsl',
        'SoftwareDiversityCard',
        serverOptions,
        clientOptions
    );

    // Start the client. This will also launch the server
    client.start();
    return client;
}

async function generateJsonService(context: vscode.ExtensionContext) {
    let title : string = 'Software Diversity Card';
    previewPanel = vscode.window.createWebviewPanel(
        // Webview id
        'liveJSONPreviewer',
        // Webview title
        title,
        // This will open the second column for preview inside editor
        2,
        {
            // Enable scripts in the webview
            enableScripts: false,
            retainContextWhenHidden: false,
            // And restrict the webview to only loading content from our extension's 'assets' directory.
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'assets'))]
        }
    )
    setPreviewActiveContext(true);
    const generator =  new DocumentationGenerator();
    const text = vscode.window.activeTextEditor?.document.getText();
    if (text) {
        const returner = generator.generate(text);
        updateJsonPreview(returner);
        console.log(returner);
    }
    previewPanel.onDidDispose(() => {
        setPreviewActiveContext(false);
    })
}

function updateJsonPreview(json : string | void) {
    if (previewPanel && json) {
        previewPanel.webview.html = json;
    }
}

function setPreviewActiveContext(value: boolean) {
    vscode.commands.executeCommand('setContext', 'liveJSONPreviewer', value);
}

function saveJsonDocument(context: vscode.ExtensionContext) {
    const text = previewPanel.webview.html;
    const searchRegExp = /\s/g;
    const replaceWith = '-';
    const title = previewPanel.title.toLowerCase().replace(searchRegExp, replaceWith);
    if (text) {
        vscode.workspace.workspaceFolders?.forEach(workspace => {
            const filePath = workspace.uri.fsPath + "/" + title + ".json";
            fs.writeFileSync(filePath, text, 'utf8');
		    vscode.window.showInformationMessage('Congrats! Your file, ' + title + '.json, has been saved in your workspace root folder.');
        });
    }
}