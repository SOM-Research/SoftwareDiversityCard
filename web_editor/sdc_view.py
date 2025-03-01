import streamlit as st
from dataModel import AST
from eventHanlder import handle_value_change
import json
import datetime
import urllib.parse
import os
from markdownGenerator import *



def render_sdc():

    ## Constant of the Software diversity card
    EducationalLevelType = ['earlyChildhood','primary','lowerSecondary','upperSecondary','postSecondaryNonTertiary','shortCycleTertiary','bachelorEquivalent','masterEquivalent','doctorateEquivalent']
    SESType = ['upperClass' ,'upperMiddleClass' ,'middleClass' , 'lowerMiddleClass' , 'lowerClass']
    SkillLevelType = ['expert' , 'proficient' , 'advanced' , 'competent' , 'beginner']
    ISO3166 = ['Andorra', 'UnitedArabEmirates', 'Afghanistan', 'AntiguaandBarbuda', 'Anguilla', 'Albania', 'Armenia', 'Angola', 'Antarctica', 'Argentina', 'AmericanSamoa', 'Austria', 'Australia', 'Aruba', 'ÅlandIslands', 'Azerbaijan', 'BosniaandHerzegovina', 'Barbados', 'Bangladesh', 'Belgium', 'BurkinaFaso', 'Bulgaria', 'Bahrain', 'Burundi', 'Benin', 'SaintBarthélemy', 'Bermuda', 'BruneiDarussalam', 'Bolivia,PlurinationalStateof', 'Bonaire,SintEustatiusandSaba', 'Brazil', 'Bahamas', 'Bhutan', 'BouvetIsland', 'Botswana', 'Belarus', 'Belize', 'Canada', 'Cocos(Keeling)Islands', 'Congo,DemocraticRepublicofthe', 'CentralAfricanRepublic', 'Congo', 'Switzerland', 'CôtedIvoire', 'CookIslands', 'Chile', 'Cameroon', 'China', 'Colombia', 'CostaRica', 'Cuba', 'CaboVerde', 'Curaçao', 'ChristmasIsland', 'Cyprus', 'Czechia', 'Germany', 'Djibouti', 'Denmark', 'Dominica', 'DominicanRepublic', 'Algeria', 'Ecuador', 'Estonia', 'Egypt', 'WesternSahara', 'Eritrea', 'Spain', 'Ethiopia', 'Finland', 'Fiji', 'FalklandIslands(Malvinas)', 'Micronesia,FederatedStatesof', 'FaroeIslands', 'France', 'Gabon', 'UnitedKingdomofGreatBritainandNorthernIreland', 'Grenada', 'Georgia', 'FrenchGuiana', 'Guernsey', 'Ghana', 'Gibraltar', 'Greenland', 'Gambia', 'Guinea', 'Guadeloupe', 'EquatorialGuinea', 'Greece', 'SouthGeorgiaandtheSouthSandwichIslands', 'Guatemala', 'Guam', 'Guinea-Bissau', 'Guyana', 'HongKong', 'HeardIslandandMcDonaldIslands', 'Honduras', 'Croatia', 'Haiti', 'Hungary', 'Indonesia', 'Ireland', 'Israel', 'IsleofMan', 'India', 'BritishIndianOceanTerritory', 'Iraq', 'Iran,IslamicRepublicof', 'Iceland', 'Italy', 'Jersey', 'Jamaica', 'Jordan', 'Japan', 'Kenya', 'Kyrgyzstan', 'Cambodia', 'Kiribati', 'Comoros', 'SaintKittsandNevis', 'Korea,DemocraticPeoplesRepublicof', 'Korea,Republicof', 'Kuwait', 'CaymanIslands', 'Kazakhstan', 'LaoPeoplesDemocraticRepublic', 'Lebanon', 'SaintLucia', 'Liechtenstein', 'SriLanka', 'Liberia', 'Lesotho', 'Lithuania', 'Luxembourg', 'Latvia', 'Libya', 'Morocco', 'Monaco', 'Moldova,Republicof', 'Montenegro', 'SaintMartin(Frenchpart)', 'Madagascar', 'MarshallIslands', 'NorthMacedonia', 'Mali', 'Myanmar', 'Mongolia', 'Macao', 'NorthernMarianaIslands', 'Martinique', 'Mauritania', 'Montserrat', 'Malta', 'Mauritius', 'Maldives', 'Malawi', 'Mexico', 'Malaysia', 'Mozambique', 'Namibia', 'NewCaledonia', 'Niger', 'NorfolkIsland', 'Nigeria', 'Nicaragua', 'Netherlands,Kingdomofthe', 'Norway', 'Nepal', 'Nauru', 'Niue', 'NewZealand', 'Oman', 'Panama', 'Peru', 'FrenchPolynesia', 'PapuaNewGuinea', 'Philippines', 'Pakistan', 'Poland', 'SaintPierreandMiquelon', 'Pitcairn', 'PuertoRico', 'Palestine,Stateof', 'Portugal', 'Palau', 'Paraguay', 'Qatar', 'Réunion', 'Romania', 'Serbia', 'RussianFederation', 'Rwanda', 'SaudiArabia', 'SolomonIslands', 'Seychelles', 'Sudan', 'Sweden', 'Singapore', 'SaintHelena,AscensionandTristandaCunha', 'Slovenia', 'SvalbardandJanMayen', 'Slovakia', 'SierraLeone', 'SanMarino', 'Senegal', 'Somalia', 'Suriname', 'SouthSudan', 'SaoTomeandPrincipe', 'ElSalvador', 'SintMaarten(Dutchpart)', 'SyrianArabRepublic', 'Eswatini', 'TurksandCaicosIslands', 'Chad', 'FrenchSouthernTerritories', 'Togo', 'Thailand', 'Tajikistan', 'Tokelau', 'Timor-Leste', 'Turkmenistan', 'Tunisia', 'Tonga', 'Türkiye', 'TrinidadandTobago', 'Tuvalu', 'Taiwan,ProvinceofChina', 'Tanzania,UnitedRepublicof', 'Ukraine', 'Uganda', 'UnitedStatesMinorOutlyingIslands', 'UnitedStatesofAmerica', 'Uruguay', 'Uzbekistan', 'HolySee', 'SaintVincentandtheGrenadines', 'Venezuela,BolivarianRepublicof', 'VirginIslands(British)', 'VirginIslands(U.S.)', 'VietNam', 'Vanuatu', 'WallisandFutuna', 'Samoa', 'Yemen', 'Mayotte', 'SouthAfrica', 'Zambia', 'Zimbabwe']
    ISO639 = ['Afar' , 'Abkhazian', 'Avestan' , 'Afrikaans' , 'Akan' , 'Amharic' , 'Aragonese','Arabic','Assamese','Avaric','Aymara','Azerbaijani','Bashkir','Belarusian','Bulgarian','Bislama','Bambara','Bengali','Tibetan','Breton','Bosnian','Catalan-Valencian','Chechen','Chamorro','Corsican','Cree','Czech','ChurchSlavonic-OldSlavonic-OldChurchSlavonic','Chuvash','Welsh','Danish','German','Divehi-Dhivehi-Maldivian','Dzongkha','Ewe','GreekModern','English','Esperanto','Spanish-Castilian','Estonian','Basque','Persian','Fulah','Finnish','Fijian','Faroese','French','WesternFrisian','Irish','Gaelic-ScottishGaelic','Galician','Guarani','Gujarati','Manx','Hausa','Hebrew','Hindi','HiriMotu','Croatian','Haitian-HaitianCreole','Hungarian','Armenian','Herero','Interlingua','Indonesian','Interlingue-Occidental','Igbo','SichuanYi-Nuosu','Inupiaq','Ido','Icelandic','Italian','Inuktitut','Japanese','Javanese','Georgian','Kongo','Kikuyu-Gikuyu','Kuanyama-Kwanyama','Kazakh','Kalaallisut-Greenlandic','CentralKhmer','Kannada','Korean','Kanuri','Kashmiri','Kurdish','Komi','Cornish','Kyrgyz-Kirghiz','Latin','Luxembourgish-Letzeburgesch','Ganda','Limburgan-Limburger-Limburgish','Lingala','Lao','Lithuanian','Luba-Katanga','Latvian','Malagasy','Marshallese','Maori','Macedonian','Malayalam','Mongolian','Marathi','Malay','Maltese','Burmese','Nauru','NorwegianBokmål','NorthNdebele','Nepali','Ndonga','Dutch-Flemish','NorwegianNynorsk','Norwegian','SouthNdebele','Navajo-Navaho','Chichewa-Chewa-Nyanja','Occitan','Ojibwa','Oromo','Oriya','Ossetian-Ossetic','Punjabi-Panjabi','Pali','Polish','Pashto-Pushto','Portuguese','Quechua','Romansh','Rundi','Romanian-Moldavian-Moldovan','Russian','Kinyarwanda','Sanskrit','Sardinian','Sindhi','NorthernSami','Sango','Sinhala-Sinhalese','Slovak','Slovenian','Samoan','Shona','Somali','Albanian','Serbian','Swati','SouthernSotho','Sundanese','Swedish','Swahili','Tamil','Telugu','Tajik','Thai','Tigrinya','Turkmen','Tagalog','Tswana','Tonga','Turkish','Tsonga','Tatar','Twi','Tahitian','Uighur-Uyghur','Ukrainian','Urdu','Uzbek','Venda','Vietnamese','Volapük','Walloon','Wolof','Xhosa','Yiddish','Yoruba','Zhuang-Chuang','Chinese','Zulu']

    ## The file where the state is
    STATE_FILE = "session_state.json"

    def load_state():
        """Load state from file and update session_state."""
        if os.path.exists(STATE_FILE):
            try:
                with open(STATE_FILE, "r") as f:
                    data = json.load(f)
                st.session_state.update(data)
                st.session_state['form_data'] = data
            except Exception as e:
                st.error(f"Error loading state: {e}")

    def save_state():
        """Save the current session_state to file."""
        try:
            # Convert session_state to a regular dict before dumping
            with open(STATE_FILE, "w") as f:
                json.dump(dict(st.session_state['form_data']), f)
        except Exception as e:
            st.error(f"Error saving state: {e}")

    # Run this only once on first load.
    if "loaded" not in st.session_state:
        load_state()
        st.session_state["loaded"] = True


  # Example of how to filter and serialize session state
    def serialize_session_state():
        # Filter out only serializable items (i.e., strings, numbers, lists, dicts)
        serializable_state = {key: value for key, value in st.session_state["form_data"].items() if isinstance(value, (str, int, float, list, dict))}
        
        # Serialize the filtered session state to JSON
        return json.dumps(serializable_state, indent=4)
    
  
  # Function to load cached data (initializes only once)
    @st.cache_data
    def load_cached_data():
        return {}

    # Initialize session state with cached data
    if "form_data" not in st.session_state:
        st.session_state.form_data = load_cached_data()

    # Function to save to cache when any input changes
    def save_to_cache():
        st.cache_data.clear()
        st.cache_data(lambda: st.session_state.form_data)  # Save updated form data

    # Function to create a text area with caching
    def cached_text_area(label, key, placeholder=""):
        if key not in st.session_state.form_data:
            st.session_state.form_data[key] = ""  # Initialize dynamically
    
        st.text_area(
            label=label,
            placeholder=placeholder,
            key=key,
            value=st.session_state.form_data.get(key, ""),  # Load from session state
            on_change=lambda: (st.session_state.form_data.update({key: st.session_state[key]}), save_to_cache())[1],
        )
        save_state()
        
        # Function to create a text area with caching
    def cached_text_input(label, key, placeholder=""):
        if key not in st.session_state.form_data:
            st.session_state.form_data[key] = ""  # Initialize dynamically
    
        st.text_input(
            label=label,
            placeholder=placeholder,
            key=key,
            value=st.session_state.form_data.get(key, ""),  # Load from session state
            on_change=lambda: (st.session_state.form_data.update({key: st.session_state[key]}), save_to_cache())[1],
        )
        save_state()
        # Function to create a text area with caching
    def cached_radio_input(label, options, key, help=""):
        if key not in st.session_state.form_data or st.session_state.form_data[key] not in options:
            st.session_state.form_data[key] = options[0]  # Initialize dynamically
        
        st.radio(
            label=label,
            options=options,
            key=key,
            help=help,
            #value=st.session_state.form_data.get(key, ""),  # Load from session state
            on_change=lambda: (st.session_state.form_data.update({key: st.session_state[key]}), save_to_cache())[1],
            horizontal=True
        )
        save_state()

    def cached_multiple_radio(key,options,label):

        # Initialize session state for selected countries if needed
        if key not in st.session_state:
            st.session_state[key] = []
            default = []
        else:
            default = st.session_state[key]
        
        # Display the multiselect widget
        st.multiselect(
            label,
            options=options,
            default=default,
            key=key,
            on_change=lambda: (st.session_state.form_data.update({key: st.session_state[key]}), save_to_cache())[1]
        )
        
    def cached_range_input(key, value, label ):
      
        if key not in st.session_state.form_data:
            st.session_state.form_data[key] = value  # Initialize dynamically
        else:
            st.session_state[key] = st.session_state.form_data[key]
        # Display a number input widget
        st.slider(
            label=label,
            min_value=0,
            max_value=120,
            value=value,
            key=key,
            on_change=lambda: (st.session_state.form_data.update({key: st.session_state[key]}), save_to_cache())[1]
        )
        save_state()

    def cached_date_input(label, key):

        if key not in st.session_state:
            st.session_state[key] = []

        st.date_input(
            label=label, 
            value=datetime.date(2019, 7, 6),
            key=key,
            on_change=lambda: (st.session_state.form_data.update({key: st.session_state[f"{key}_startdate"]}), save_to_cache())[1]
            )


    def participant(key):
        colr, coll = st.columns([1, 1])
        with colr:
            cached_text_input("Name", f"{key}_name", "Name or identifier of the participants")
            # Initialize session state for the number input if it doesn't exist
            agekey = f"{key}_age"
            if  agekey not in st.session_state:
                st.session_state[agekey] = 0  # default value
            # Display a number input widget
            st.number_input(
                label="The age of the participant:",
                key=agekey,
                on_change=lambda: (st.session_state.form_data.update({key: st.session_state[agekey]}), save_to_cache())[1]
            )
            cached_text_input("Location", f"{key}_location", "The title of the card")
            cached_radio_input("WorkplaceType", ["Presential", "Hybrid", "Remote"],  f"{key}_workdplace", "The title of the card")
            cached_text_input("Ethnicity", f"{key}_ethincity", "The title of the card")
            cached_text_input("Gender", f"{key}_gender", "The title of the card")
            cached_text_input("Disabilities", f"{key}_disabilities", "The title of the card")
            cached_text_input("Sexual Orientation", f"{key}_sexualOrientation", "The title of the card")
            cached_text_input("Religion", f"{key}_religion", "The title of the card")
        with coll:
  
            cached_multiple_radio(f"{key}_countries",ISO3166,"Select one or several countries:")
            cached_multiple_radio(f"{key}_edlevel",EducationalLevelType,"Educational Level")
            cached_multiple_radio( f"{key}_sociostati", SESType,"Socioeconomic Status")
            cached_multiple_radio( f"{key}_skills", SkillLevelType,"Skill Level")
            cached_multiple_radio( f"{key}_languages", ISO3166, "Select one or several langauges spoken by the participant:")
          
            # Initialize session state for the number input if it doesn't exist
            tenkey = f"{key}_tenure"
            if  tenkey not in st.session_state:
                st.session_state[tenkey] = 0  # default value

            # Display a number input widget
            st.number_input(
                label="The professioanl tenure of the participant in years",
                key=tenkey,
                on_change=lambda: (st.session_state.form_data.update({key: st.session_state[tenkey]}), save_to_cache())[1]
            )

    def organization(key):
        cached_text_input("Organization name", f"{key}_name", "Name or identifier of the organization")
        group(key)

    def team(key):
        cached_range_input(f"{key}_size", 0, "The size of the group")
        group(key)

    def group(key):
        colr, coll = st.columns([1, 1])
        with colr: 

            cached_range_input(f"{key}_age",(10,20), "The age range of the participants")
            cached_text_input("Location", f"{key}_location", "Location of the organization")
            cached_radio_input("WorkplaceType", ["Presential", "Hybrid", "Remote"],  f"{key}_workplace", "The kind of organization")
            cached_text_input("Ethnicities", f"{key}_ethnicities", "Ethinicities present in the organization, comma sepparated ")
            cached_text_input("Genders", f"{key}_genders", "Distribution and presence of gender presence, domma sepparated ")
            cached_text_input("Disabilities", f"{key}_disabilities", "Disabilities present in the organization, comma sepparated ")
            cached_text_input("Religious Beliefs", f"{key}_religious", "Disabilities present in the organization, comma sepparated ")
        with coll:    
            cached_multiple_radio(f"{key}_countries",ISO3166,"Select one or several countries:")
            cached_multiple_radio(f"{key}_edlevel",EducationalLevelType,"Educational Level")
            cached_multiple_radio( f"{key}_sociostati", SESType,"Socioeconomic Status")
            cached_multiple_radio( f"{key}_skills", SkillLevelType,"Skill Level")
            cached_multiple_radio( f"{key}_languages", ISO639, "Select one or several langauges spoken by the participant:")
                    # Initialize session state for the number input if it doesn't exist
            agekey = f"{key}_tenure"
            if  agekey not in st.session_state:
                st.session_state[agekey] = 0  # default value

            # Display a number input widget
            st.number_input(
                label="The professioanl tenure of the participant in years",
                key=agekey,
                on_change=lambda: (st.session_state.form_data.update({key: st.session_state[agekey]}), save_to_cache())[1]
            )

    def init_state(key):
        if key not in st.session_state:
            st.session_state[key] = []

    def add_text_area(key):
        init_state(key)
        st.session_state[key].append("")

    def remove_text_area(index,key):
        if key in st.session_state and 0 <= index < len(st.session_state[key]):
            st.session_state[key].pop(index)
            st.rerun() # Rerun to update the interface
    ##
    ## Title
    ##
    col1, col2 = st.columns([8, 2])
    with col1:
        st.title("The Software Diversity Card :woman_and_man_holding_hands: :memo:")
    with col2:
        # Theme options
        themes = {
            "Cool Blue": {
                "primaryColor" : "#007ACC",         # A vibrant, clear blue
                "backgroundColor" : "#E6F7FF" ,       # A light, airy blue for a fresh feel
                "secondaryBackgroundColor" : "#B3E0FF",  # A gentle pastel blue
                "textColor" : "#003366" ,             # Deep navy for contrast
                "font" : "sans serif",
            },
            "Light": {
                "primaryColor": "#4CAF50",
                "backgroundColor": "#FFFFFF",
                "secondaryBackgroundColor": "#F0F2F6",
                "textColor": "#262730",
            },
            "Dark": {
                "primaryColor": "#BB86FC",
                "backgroundColor": "#121212",
                "secondaryBackgroundColor": "#1E1E1E",
                "textColor": "#E0E0E0",
            },
            "Solarized": {
                "primaryColor": "#268BD2",
                "backgroundColor": "#FDF6E3",
                "secondaryBackgroundColor": "#EEE8D5",
                "textColor": "#657B83",
            }

        }

        # UI to select a theme
        theme_choice = st.selectbox("Choose a theme:", list(themes.keys()))

        # Apply theme
        selected_theme = themes[theme_choice]
        st.markdown(
            f"""
            <style>
                .stApp {{
                    background-color: {selected_theme["backgroundColor"]};
                    color: {selected_theme["textColor"]};
                }}
                .stButton > button {{
                    background-color: {selected_theme["primaryColor"]};
                    color: white;
                }}
                .stSidebar {{
                    background-color: {selected_theme["secondaryBackgroundColor"]};
                }}
            </style>
            """,
            unsafe_allow_html=True
        )
    st.markdown("""\
        Welcome to the Software Diversity Card Generator—a form-based application designed to empower you to highlight and promote diversity in software projects. Our innovative tool helps you generate comprehensive diversity cards in both JSON and Markdown formats, offering a transparent overview of the varied teams involved in development and governance, the user groups engaged in testing, and the tailored software adaptations for different social groups. By providing a structured model, an extended JSON syntax, and a toolkit backed by real-world examples, our platform aims to foster inclusive practices that can be embraced by open-source communities, academic journals, and forward-thinking businesses alike.
        """)
   


    ##
    ## Master info
    ##
    cached_text_input("The name of the software project", "master_title", "The title of the card")
    cached_text_area("A description of the software project", "master_desc", "The title of the card")


    with st.container( border=True):
        st.subheader("Describe the different teams in the software project")
        governance, usageContext, participants = st.tabs([
            "Governance",
            "Usage context",
            "Participants"
        ])

        with governance:
            col1, col2 = st.columns([1, 2])
            with col1:
                #cached_text_input("Project Type", "governance_projectType", "Specify the type of software project (private, public funded, non-profit, driven by an open-source community, etc.)")
                cached_multiple_radio("governance_projectType",["public funded", "research", "private", "private non-profit", "driven by open-source community", "citizen science"],"Specify the type of software project")
            with col2:
                # Multiple value
                key = "governance_govProcesses"
                init_state(key)
                st.write("Define the set of governament process of your software project")

                if st.button("Add governament processes"):
                    add_text_area(key)
                # Loop over the array and create a text area with a remove button for each element
                for idx, processes in enumerate(st.session_state[key]):
                    # Create two columns: one for the text area, one for the remove button
                    col1, col2 = st.columns([6, 1])
                    with col1:
                        cached_text_area(f"Governament process {idx + 1}", f"governance_govProcesses{idx}", "Specific the governance rules of the software project. For instance, the funders, or the role and the relation between the different bodies that governs the software.")
                    with col2:
                       # print(st.session_state['governance_govProcesses_remove_0'])
                        if st.button("Remove", key=f"remove_{key}_{idx}"):
                            remove_text_area(idx,key)

            # BODIES
            st.write("Add the different types of governament bodies of your software project (boards and funders)")
            key = "governance_bodies"
            init_state(key)
            if st.button("Add governament bodies"):
                add_text_area(key)
            # Loop over the array and create a text area with a remove button for each element
          
            for idx, text in enumerate(st.session_state[key]):
                # Create two columns: one for the text area, one for the remove button
                with st.container(border=True):
                    col1, col2 = st.columns([2, 2])
                    with col1:
                        cached_text_input("Body name", f"{key}_{idx}_name", "The name of id of the body")
                        cached_text_area("Body description", f"{key}_{idx}_description", "A description of the body")
                    

                    with col2:
                        if st.button("Remove", key=f"{key}_remove_{idx}"):
                          remove_text_area(idx,f"{key}_remove_{idx}")
                        cached_multiple_radio(f"{key}_{idx}_type", ['funders', 'directors', 'administrators', 'other'], f"Body role type" )

                    with  st.expander("If needed provide detailed information about the organizations or individuals involved in the governance", expanded=False):
                    # Button to add a new text area
                        org, individual = st.tabs([
                                "Organization",
                                "Individual",
                            ])
                        with individual:
                            participant(f"{key}_{idx}_participant")
                        with org:
                            organization(f"{key}_{idx}_organization")
              
        with usageContext:
            colr, coll = st.columns([1, 1])
            with colr:
                key = "socialContext"
                cached_text_area("Social context",f"{key}_description", "Description of the usage and social context of the app")
            with coll:
                cached_multiple_radio(f"{key}_countries",ISO3166,"The countries where the app is intended to be deployed and used")
                cached_multiple_radio( f"{key}_languages", ISO639, "The relevant languages for the app usage's context")
            targetCommunities, adaptations = st.tabs([
                "Targeted Communities",
                "Adpatations",
            ])
            with targetCommunities:
                keyTarget = key+"_targetCommunity"
                cached_text_input("Name",f"{keyTarget}_name", "Name or ID of the target community")
                cached_text_area("Description",f"{keyTarget}_description", "Description of the target community")
                group(keyTarget)

            with adaptations:
                keyAdapt = key+"_adaptation"
                cached_text_input("Name",f"{keyAdapt}_name", "Name or ID of the adaptation")
                cached_text_area("Description",f"{keyAdapt}_description", "Description of the adaptation")  
        
        with participants:
           #  Participants
            st.write("Add the different teams participating the software project")
            key = "participants"
            init_state(key)
            if st.button("Add a team of participants"):
                add_text_area(key)
            # Loop over the array and create a text area with a remove button for each element
          
            for idx, text in enumerate(st.session_state[key]):
                # Create two columns: one for the text area, one for the remove button
                with st.container(border=True):
                    col1, col2 = st.columns([2, 2])
                    with col1:
                        cached_text_input("Team name", f"{key}_{idx}_name", "The name of id of the team")
                        cached_text_area("Team description", f"{key}_{idx}_description", "A description of the team")
                    

                    with col2:
                        if st.button("Remove", key=f"{key}_remove_{idx}"):
                          remove_text_area(idx,f"{key}_remove_{idx}")
                        cached_multiple_radio(f"{key}_{idx}_type", ['Development Team', 'NonCoding Contributor', 'Tester Team', 'Public Reporter TEam'], f"Team role type" )
                    team(f"{key}_{idx}")


        
    ## Showing the generated card and the generated JSON
    st.divider()
    st.subheader("The generated card")
    markDownTab, jsonTab = st.tabs(["**Compiled card in markdown**", "**Generated JSON**" ])
    with markDownTab:
   
            # Provide a download button
            st.download_button(
                label="Download Markdown",
                data=generate_markdown(st.session_state),
                file_name="SoftareDiveristyCard.md",
                mime="text/markdown"
            )
            st.text("Preview:")
            st.markdown(generate_markdown(st.session_state), unsafe_allow_html=True)
    with jsonTab:

            # Convert the session state to a JSON string
            session_state_json = json.dumps(serialize_session_state(), indent=4)
            st.download_button(
                label="Download JSON",
                data=session_state_json,
                file_name=f"{st.session_state["master_title"]}_diveristy_card.json",
                mime="application/json"
            )
            # Display the session state as pretty JSON
            #st.json(serialize_session_state())
            st.text("Preview:")
            st.json(st.session_state["form_data"])
         