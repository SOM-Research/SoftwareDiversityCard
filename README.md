# Software Diversity Card

Welcome to the main repository of the Software Diversity card. This repository contains a set of tool that  helps you generate comprehensive diversity cards in both JSON and Markdown formats, offering a transparent overview of the varied teams involved in development and governance, the user groups engaged in testing, and the tailored software adaptations for different social groups. The goal is to facilitate the card creation to  to foster inclusive practices that can be embraced by open-source communities, academic journals, and forward-thinking businesses alike.

This repository is part of an ongoing research project. Preprint **TBD**

## Repository Structure

This repository is composed of a language plugin for Visual Studio Code, developed with Langium and a web-form editor developed with Streamlit.
The following tree shows the list of the repository's relevant sections:

- If you are solely intersted in the web editor, all the code is contained in the /web_editor folder with the installatin instruction inside.


- If you are interesting in the language plugin for VSCode: 
  -   The *examples* folders contains an example of a software diveristy card created using the DSL.
  - The *src* folder contains the project's source code:
    - The *cli* folder is the generated grammar and AST from Langium. You may not want to dive in it as it is a generated asset.
    - The *extension* folder contains all the code of the generation service. Could be a good place to start if you want to improve the generation of the tool.
    - The *language* folder contains all the language features, and the grammar declaration. If you want to improve the grammar, or some of the features the plugin offers here is the place you may want to start.

## Usage: Defining Software Diversity Cards

TBC.

An example of grammar instance for a software diversity card would be: MISSING LINK.

## Contributing

This project is being development as part of a research line of the [SOM Research Lab](https://som-research.github.io/) & the [Barcelona Supercomputing Center (BSC-CNS)](https://bsc.es)  , but we are open to contributions from the community. If you are interested in contributing to this project, please read the [GOVERNANCE.md](GOVERNANCE.md) document.

At SOM Research Lab we are dedicated to creating and maintaining welcoming, inclusive, safe, and harassment-free development spaces. Anyone participating will be subject to and agrees to sign on to our [code of conduct](CODE_OF_CONDUCT.md).

## Publications

This repository is the companion to the following research paper:

> Preprint TBD!!!

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The source code for the site is licensed under the MIT License, which you can find in the LICENSE.md file.

All graphical assets are licensed under the
[Creative Commons Attribution 3.0 Unported License](https://creativecommons.org/licenses/by/3.0/).
