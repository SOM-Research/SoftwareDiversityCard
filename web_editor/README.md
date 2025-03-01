# The Software Diversity Card webform generator 🏢

Welcome to the Software Diversity Card Generator—a form-based application designed to empower you to highlight and promote diversity in software projects. Our innovative tool helps you generate comprehensive diversity cards in both JSON and Markdown formats, offering a transparent overview of the varied teams involved in development and governance, the user groups engaged in testing, and the tailored software adaptations for different social groups. By providing a structured model, an extended JSON syntax, and a toolkit backed by real-world examples, our platform aims to foster inclusive practices that can be embraced by open-source communities, academic journals, and forward-thinking businesses alike.


## Public demo and other tools

We have released a public demo of the web-form generator at: www.dummy.org

Do you prefer filling the card using your favourite IDE? Try out the Visual Studio Code language pluguin here: www.vscodemarket.org/ourtool


## Dependencies

It is recommended to use a virtual environment, i.e., the following commands should be run before installing the dependencies:

```console
python3 -m venv .venv
source .venv/bin/activate
```

This project relies on [Streamlit 1.x](https://github.com/streamlit/streamlit). To install the dependencies run:

```console
pip install -r requirements.txt 
```

## Running the service

After setting up the virtual environment and installing the dependencies, run the following command to start the server:

```console
streamlit run server.py
```

The streamlit listening port can be customized by setting the `--server.port` parameter:

```console
streamlit run server.py --server.port 2000
```

By default, the server expects an Impropmptu REST service at `http://127.0.0.1:3000` as well as Ollama server at `http://127.0.0.1:11434`. You can override these settings by setting the `-i`/`--impromptu.url` and `o`/`--ollama.url` arguments. Please notice that these arguments **MUST** be passed after the `streamlit` arguments, and separated by two dashes, e.g.:

```console
streamlit run server.py --server.port 2000 -- --impromptu.url "http://example.com:3000" --ollama.url "http://example.com:11434"
```

