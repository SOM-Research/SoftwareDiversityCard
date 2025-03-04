import type { LanguageClientOptions, ServerOptions} from 'vscode-languageclient/node.js';
import * as vscode from 'vscode';
import * as path from 'node:path';
import * as fs from 'fs';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node.js';
import { JSONDocumentGenerator } from './swdc-dsl-json-document-generator.js';
import { MDDocumentGenerator } from './swdc-dsl-md-document-generator.js';

let client: LanguageClient;

let previewPanel : vscode.WebviewPanel;

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
    client = startLanguageClient(context);
    context.subscriptions.push(vscode.commands.registerCommand('swdc-dsl.generateJson', async () => {
        await generateJsonService(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('swdc-dsl.generateMd', async () => {
        await generateMdService(context);
     }));
         // Listen for new .sdc files
     const disposable = vscode.workspace.onDidCreateFiles(event => {
        for (const file of event.files) {
            if (file.fsPath.endsWith('.swdc')) {
                vscode.workspace.openTextDocument(file).then(doc => {
                    const edit = new vscode.WorkspaceEdit();
                    let scaffoldText = ``;
                    try {
                        scaffoldText = fs.readFileSync(context.asAbsolutePath('startTemplate.swdc'), 'utf-8');
                    } catch(error) {
                        vscode.window.showErrorMessage(`Error loading template`);
                    }
                    edit.insert(file, new vscode.Position(0, 0), scaffoldText);
                    vscode.workspace.applyEdit(edit);
                });
            }
        }
    });

    context.subscriptions.push(disposable);
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
    let title : string = 'Software Diversity Card JSON';
    let previewPanelTitle = 'liveJSONPreviewer'
    previewPanel = vscode.window.createWebviewPanel(
        // Webview id
        previewPanelTitle,
        // Webview title
        title,
        // This will open the second column for preview inside editor
        2,
        {
            // Enable scripts in the webview
            enableScripts: true,
            retainContextWhenHidden: false,
            // And restrict the webview to only loading content from our extension's 'assets' directory.
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'assets'))]
        }
    )
    setPreviewActiveContext(true, previewPanelTitle);
    const generator =  new JSONDocumentGenerator();
    const text = vscode.window.activeTextEditor?.document.getText();
    if (text) {
        // HTML content with JSON styling
        previewPanel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
            <title>JSON Preview</title>
            <style>
                body { font-family: monospace; padding: 20px; background:rgb(240, 241, 245); color:rgb(3, 3, 3); }
                    pre {
                        background-color:rgb(178, 182, 189);
                        color:rgb(7, 7, 7);
                        padding: 10px;
                        border-radius: 5px;
                        overflow-x: auto;
                        font-family: monospace;
                        }
                        .string { color: #98c379; }
                        .number { color: #d19a66; }
                        .boolean { color: #56b6c2; }
                        .null { color: #e06c75; }
                        .key { color: #e5c07b; }
            </style>
        </head>

        <body>
            <pre><code class="language-json" id="json-container"></code></pre>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/prism.min.js"></script>
        <script>
            document.getElementById("json-container").textContent = JSON.stringify(${generator.generate(text)}, null, 2);
            Prism.highlightAll();
        </script>
        </body>
        </html>
        `;
        
    }

}

async function generateMdService(context: vscode.ExtensionContext) {
    let title : string = 'Software Diversity Card MD';
    let previewPanelTitle = 'liveMDPreviewer';
    previewPanel = vscode.window.createWebviewPanel(
        // Webview id
        previewPanelTitle,
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
    setPreviewActiveContext(true, previewPanelTitle);
    const generator =  new MDDocumentGenerator();
    const text = vscode.window.activeTextEditor?.document.getText();
    if (text) {
        const returner = generator.generate(text);
        updatePreview(returner);
        console.log(returner);
    }
    previewPanel.onDidDispose(() => {
        setPreviewActiveContext(false, previewPanelTitle);
    })
}

function updatePreview(content : string | void) {
    if (previewPanel && content) {
        previewPanel.webview.html = content;
    }
}

function setPreviewActiveContext(value: boolean, panelTitle: string) {
    vscode.commands.executeCommand('setContext', panelTitle, value);
}

// function saveJsonDocument(context: vscode.ExtensionContext) {
//     const text = previewPanel.webview.html;
//     const searchRegExp = /\s/g;
//     const replaceWith = '-';
//     const title = previewPanel.title.toLowerCase().replace(searchRegExp, replaceWith);
//     if (text) {
//         vscode.workspace.workspaceFolders?.forEach(workspace => {
//             const filePath = workspace.uri.fsPath + "/" + title + ".json";
//             fs.writeFileSync(filePath, text, 'utf8');
// 		    vscode.window.showInformationMessage('Congrats! Your file, ' + title + '.json, has been saved in your workspace root folder.');
//         });
//     }
// }