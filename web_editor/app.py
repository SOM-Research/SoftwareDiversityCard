import os
import requests
import json
import argparse
import streamlit as st
from sdc_view import render_sdc


##      
## Streamlit!
##
st.set_page_config(page_title="The Software Diversity Card", page_icon=":woman_and_man_holding_hands:", layout="wide")

# Hide the deploy button
st.markdown("""
        <style>
            [data-testid="stAppDeployButton"] { visibility: hidden; }
            .stMainBlockContainer { max-width: 1280px; }
        </style>
        """,
        unsafe_allow_html=True)

render_sdc()

