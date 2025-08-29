import os
import json
import requests
import streamlit as st
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DEPLOYMENT_ID = os.getenv("DEPLOYMENT_ID")
BASE_URL = f"https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec"

st.title("Multi-Filter API GET & Shortlist Interface")

# Initialize session state for filters
if "filters_list" not in st.session_state:
    st.session_state["filters_list"] = []

# Add new filter
if st.button("+ Add Filter"):
    st.session_state.filters_list.append({"column": "", "operator": "=", "value": ""})

# Display filter inputs
for i, f in enumerate(st.session_state.filters_list):
    col1, col2, col3, col4 = st.columns([3, 2, 3, 1])
    with col1:
        f["column"] = st.text_input(f"Column Name {i+1}", value=f.get("column", ""))
    with col2:
        f["operator"] = st.selectbox(
            f"Operator {i+1}",
            ["=", ">", "<", ">=", "<=", "!=", "contains"],
            index=["=", ">", "<", ">=", "<=", "!=", "contains"].index(f.get("operator", "="))
        )
    with col3:
        f["value"] = st.text_input(f"Value {i+1}", value=f.get("value", ""))
    with col4:
        if st.button("❌ Remove", key=f"remove_{i}"):
            st.session_state.filters_list.pop(i)
            st.rerun()

# Limit and offset
limit = st.text_input("Limit (optional)", "")
offset = st.text_input("Offset (optional)", "")

# Fetch & shortlist
if st.button("Fetch & Shortlist"):
    # Build filters dict
    filters = {}
    for f in st.session_state.filters_list:
        if f["column"] and f["operator"] and f["value"]:
            try:
                if "." in f["value"]:
                    val = float(f["value"])
                else:
                    val = int(f["value"])
            except:
                val = f["value"]
            if f["column"] in filters:
                filters[f["column"]].update({f["operator"]: val})
            else:
                filters[f["column"]] = {f["operator"]: val}

    # Build GET request params
    params = {}
    if filters:
        params["filters"] = json.dumps(filters)
    if limit:
        params["limit"] = limit
    if offset:
        params["offset"] = offset

    # Perform GET request
    try:
        response = requests.get(BASE_URL, params=params)
        data = response.json()
        # Trim whitespace
        headers = [h.strip() for h in data.get("headers", [])]
        rows = [[str(cell).strip() for cell in row] for row in data.get("rows", [])]

        # Display table
        st.subheader("Filtered Rows")
        st.table([headers] + rows)

        # Call SHORTLIST via POST
        post_body = {
            "method": "SHORTLIST",
            "criteria": filters
        }
        post_response = requests.post(BASE_URL, json=post_body)
        st.success(post_response.json().get("message", "Shortlisting done"))

    except Exception as e:
        st.error(f"Error fetching or shortlisting: {e}")
