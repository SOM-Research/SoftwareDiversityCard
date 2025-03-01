def generate_json():

    return f"""# The Software diversity card of {st.session_state["master_title"]}
                     {st.session_state["master_desc"]} 
                    ## 🏢 Teams Summary

                    <table>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Age Range</th>
                        <th>Ethnicities</th>
                        <th>Genders</th>
                        <th>Team Size</th>
                        <th>Average Tenure</th>
                        <th>Start Date</th>
                        <th>Location</th>
                    </tr>
                    <tr>
                        <td><strong>DevelopmentTeam</strong></td>
                        <td>DevelopmentTeam</td>
                        <td>25-30</td>
                        <td>Colombian, Brazilian, Argentinian, French, Spanish, Pakistani, Serbian, Iranian, Moroccan, Italian</td>
                        <td>Male 80%, Female 20%</td>
                        <td>15</td>
                        <td>4.3</td>
                        <td>11-08-2022</td>
                        <td>Luxembourg</td>
                    </tr>
                    <tr>
                        <td><strong>Usability Testers</strong></td>
                        <td>Tester Team</td>
                        <td>22-24</td>
                        <td>French</td>
                        <td>Non-disclosed</td>
                        <td>18</td>
                        <td>0.5</td>
                        <td>17-10-2023</td>
                        <td>University of Luxembourg</td>
                    </tr>
                    <tr>
                        <td><strong>Computer Science Students</strong></td>
                        <td>Target Community</td>
                        <td>18-100</td>
                        <td>Non-disclosed</td>
                        <td>Non-disclosed</td>
                        <td>-</td>
                        <td>0</td>
                        <td>-</td>
                        <td>France & Luxembourg</td>
                    </tr>
                    <tr>
                        <td><strong>Climate Public Servants</strong></td>
                        <td>Target Community</td>
                        <td>20-100</td>
                        <td>Non-disclosed</td>
                        <td>Non-disclosed</td>
                        <td>-</td>
                        <td>3-5</td>
                        <td>-</td>
                        <td>Luxembourg</td>
                    </tr>
                    </table>

                    ---
                  """