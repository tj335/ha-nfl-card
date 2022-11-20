import { html, LitElement } from "https://unpkg.com/lit?module";

class NFLCard extends LitElement {

  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }

  setConfig(config) {
    this._config = config;
  }
  getCardSize() {
    return 5;
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    var awayTeamLogo;
    var awayTeamProb;
    var awayTeamScore;
    //var aScr;
    var awayTeamScoreOpacity;
    var homeTeamLogo;
    var homeTeamProb;
    var homeTeamScore;
    //var hScr;
    var homeTeamScoreOpacity;
    var weather;

    const stateObj = this.hass.states[this._config.entity];
    const outline = this._config.outline;
    const outlineColor = this._config.outline_color;

    homeTeamLogo = stateObj.attributes.home_team_logo;
    awayTeamLogo = stateObj.attributes.away_team_logo;


    if (stateObj.attributes.away_team_win_probability) {
      awayTeamProb = (stateObj.attributes.away_team_win_probability * 100).toFixed(0);
    } else {
      awayTeamProb = 50;
    }

    if (stateObj.attributes.home_team_win_probability) {
      homeTeamProb = (stateObj.attributes.home_team_win_probability * 100).toFixed(0);
    } else {
      homeTeamProb = 50;
    }

    if (stateObj.attributes.away_team_score) {
      awayTeamScore = stateObj.attributes.away_team_score;
    }

    if (stateObj.attributes.home_team_score) {
      homeTeamScore = stateObj.attributes.home_team_score;
    }

    if (stateObj.attributes.date) {
      var dateForm = new Date (stateObj.attributes.date);
      var gameDay = dateForm.toLocaleDateString('en-US', { weekday: 'long' });
      var gameTime = dateForm.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' });
      var gameMonth = dateForm.toLocaleDateString('en-US', { month: 'short' });
      var gameDate = dateForm.toLocaleDateString('en-US', { day: '2-digit' });
    }
    var outColor = outlineColor;


    if (stateObj.attributes.venue_indoor == 'true') {
      weather = 'Indoors';
    } else {
      if (stateObj.attributes.weather_conditions && stateObj.attributes.weather_temp) {
        weather = stateObj.attributes.weather_conditions + ', ' + stateObj.attributes.weather_temp + '°F';
      } else {
        weather = 'Weather Unavailable';
      }
    }

    
    if (outline == true) {
      var clrOut = 1;
      var toRadius = 4;
      var probRadius = 7;
    }
    if (!this._config.outline || outline == false){
      var clrOut = 0;
      var toRadius = 3;
      var probRadius = 6;
    }
    if (!this._config.outline_color) {
      var outColor = '#ffffff';
    }
    if (stateObj.attributes.possession == stateObj.attributes.away_team_id) {
      var awayTeamPoss = 1;
    }
    if (stateObj.attributes.possession == stateObj.attributes.home_team_id) {
      var homeTeamPoss = 1;
    }
    if (Boolean(stateObj.state == 'POST') && Number(awayTeamScore) > Number(homeTeamScore)) {
        homeTeamScoreOpacity = 0.6;
        awayTeamScoreOpacity = 1;
    }
    if (Boolean(stateObj.state == 'POST') && Number(awayTeamScore) < Number(homeTeamScore)) {
        homeTeamScoreOpacity = 1;
        awayTeamScoreOpacity = 0.6;
    }
    if (Boolean(stateObj.state == 'POST') && Number(awayTeamScore) == Number(homeTeamScore)) {
        homeTeamScoreOpacity = 1;
        awayTeamScoreOpacity = 1;
    }

    if (stateObj.attributes.home_team_colors) {
      var homeTeamColor = stateObj.attributes.home_team_colors[0];
    }

    if (stateObj.attributes.away_team_colors) {
      var awayTeamColor = stateObj.attributes.away_team_colors[1];
    }

    if (!stateObj) {
      return html` <ha-card>Unknown entity: ${this._config.entity}</ha-card> `;
    }
    if (stateObj.state == 'unavailable') {
      return html`
        <style>
          ha-card {padding: 10px 16px;}
        </style>
        <ha-card>
          Sensor unavailable: ${this._config.entity}
        </ha-card> 
      `;
    }

    if (stateObj.state == 'POST') {
      return html`
        <style>
          .card { position: relative; overflow: hidden; padding: 16px 16px 20px; font-weight: 400; }
          .away-team-bg { opacity: 0.08; position: absolute; top: -30%; left: -20%; width: 58%; z-index: 0; }
          .home-team-bg { opacity: 0.08; position: absolute; top: -30%; right: -20%; width: 58%; z-index: 0; }
          .card-content { display: flex; justify-content: space-evenly; align-items: center; text-align: center; position: relative; z-index: 99; }
          .team { text-align: center; width: 35%;}
          .team img { max-width: 90px; }
          .score { font-size: 3em; text-align: center; }
          .awayteamscr { opacity: ${awayTeamScoreOpacity}; }
          .hometeamscr { opacity: ${homeTeamScoreOpacity}; }
          .divider { font-size: 2.5em; text-align: center; opacity: 0; }
          .name { font-size: 1.4em; margin-bottom: 4px; }
          .line { height: 1px; background-color: var(--primary-text-color); margin:10px 0; }
          .status { font-size: 1.2em; text-align: center; margin-top: -21px; }
          .week-number { font-size: 1.1em; text-align: center; }
          .sub1 { font-weight: 500; font-size: 1.2em; margin: 6px 0 2px; }
          .sub1, .sub2, .sub3 { display: flex; justify-content: space-between; align-items: center; margin: 2px 0; }
          .line-score-table { width: 100%; border-collapse: collapse; text-align: center; }
          .line-score-cell { border: 0.5px solid #999; text-align: center; }
          table.ls { width: 100%; text-align: center; border: 0.5px solid #999; border-collapse: collapse; }
          th, td { border: 0.5px solid #999; text-align: center; }
          th.teamls, td.teamls { border: 0.5px solid #999; text-align: left; }
          .leader-heading { font-size: 1.2em; text-align: center; }
        </style>
        <ha-card>
          <div class="card">
            <img class="away-team-bg" src="${stateObj.attributes.away_team_logo}" />
            <img class="home-team-bg" src="${stateObj.attributes.home_team_logo}" />
            <div class="card-content">
              <div class="team">
                <img src="${stateObj.attributes.away_team_logo}" />
                <div class="name">${stateObj.attributes.away_team_city}<br>${stateObj.attributes.away_team_name}</div>
                <div class="record">${stateObj.attributes.away_team_record}</div>
              </div>
              <div class="score awayteamscr">${awayTeamScore}</div>
              <div class="divider">-</div>
              <div class="score hometeamscr">${homeTeamScore}</div>
              <div class="team">
                <img src="${stateObj.attributes.home_team_logo}" />
                <div class="name">${stateObj.attributes.home_team_city}<br>${stateObj.attributes.home_team_name}</div>
                <div class="record">${stateObj.attributes.home_team_record}</div>
              </div>
            </div>
            <div class="status">${gameMonth} ${gameDate} - FINAL</div>
            <div class="week-number">Week ${stateObj.attributes.week_number}</div>

            <div class="line"></div>
            <div class="sub2">
              <div class="venue">${stateObj.attributes.venue_name}</div>
              <div class="capacity">Capacity: ${stateObj.attributes.venue_capacity}</div>
            </div>
            <div class="sub3">
              <div class="location">${stateObj.attributes.venue_city}, ${stateObj.attributes.venue_state}</div>
              <div class="attendance">Attendance: ${stateObj.attributes.attendance}</div>
            </div>
            <div class="line"></div>
            <div class="probability-text">
              <table class="ls">
                <thead>
                  <tr>
                    <th class="teamls">Scoring</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>T</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="teamls"><img src="${awayTeamLogo}" style="height:15px;" />&nbsp; ${stateObj.attributes.away_team_abbr}</td>
                    <td>${stateObj.attributes.away_team_ls_1}</td>
                    <td>${stateObj.attributes.away_team_ls_2}</td>
                    <td>${stateObj.attributes.away_team_ls_3}</td>
                    <td>${stateObj.attributes.away_team_ls_4}</td>
                    <td>${stateObj.attributes.away_team_score}</td>
                  </tr>
                  <tr>
                    <td class="teamls"><img src="${homeTeamLogo}" style="height:15px;"/>&nbsp; ${stateObj.attributes.home_team_abbr}</td>
                    <td>${stateObj.attributes.home_team_ls_1}</td>
                    <td>${stateObj.attributes.home_team_ls_2}</td>
                    <td>${stateObj.attributes.home_team_ls_3}</td>
                    <td>${stateObj.attributes.home_team_ls_4}</td>
                    <td>${stateObj.attributes.home_team_score}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="line"></div>
            <div class="headlines">${stateObj.attributes.headlines}</div>
            <div class="leader-heading">Leaders</div>
            <div class="leader-info">Passing: ${stateObj.attributes.post_game_passing_leader_name} - ${stateObj.attributes.post_game_passing_leader_stats}</div>
            <div class="leader-info">Rushing: ${stateObj.attributes.post_game_rushing_leader_name} - ${stateObj.attributes.post_game_rushing_leader_stats}</div>
            <div class="leader-info">Receiving: ${stateObj.attributes.post_game_receiving_leader_name} - ${stateObj.attributes.post_game_receiving_leader_stats}</div>
          </div>
        </ha-card>
      `;
    }


    if (stateObj.state == 'IN') {
        return html`
          <style>
            .card { position: relative; overflow: hidden; padding: 0 16px 20px; font-weight: 400; }
            .away-team-bg { opacity: 0.08; position:absolute; top: -20%; left: -20%; width: 58%; z-index: 0; }
            .home-team-bg { opacity: 0.08; position:absolute; top: -20%; right: -20%; width: 58%; z-index: 0; }
            .card-content { display: flex; justify-content: space-evenly; align-items: center; text-align: center; position: relative; z-index: 99; }
            .team { text-align: center; width:35%; }
            .team img { max-width: 90px; }
            .possession, .awayteamposs, .hometeamposs { font-size: 2.5em; text-align: center; opacity: 0; font-weight:900; }
            .awayteamposs {opacity: ${awayTeamPoss} !important; }
            .hometeamposs {opacity: ${homeTeamPoss} !important; }
            .score { font-size: 3em; text-align: center; }
            .divider { font-size: 2.5em; text-align: center; margin: 0 4px; }
            .name { font-size: 1.4em; margin-bottom: 4px; }
            .line { height: 1px; background-color: var(--primary-text-color); margin:10px 0; }
            .timeouts { margin: 0 auto; width: 70%; }
            .timeouts div.home-team-to:nth-child(-n + ${stateObj.attributes.home_team_timeouts})  { opacity: 1; }
            .timeouts div.away-team-to:nth-child(-n + ${stateObj.attributes.away_team_timeouts})  { opacity: 1; }
            .away-team-to { height: 6px; border-radius: ${toRadius}px; border: ${clrOut}px solid ${outColor}; width: 20%; background-color: ${awayTeamColor}; display: inline-block; margin: 0 auto; position: relative; opacity: 0.2; }
            .home-team-to { height: 6px; border-radius: ${toRadius}px; border: ${clrOut}px solid ${outColor}; width: 20%; background-color: ${homeTeamColor}; display: inline-block; margin: 0 auto; position: relative; opacity: 0.2; }
            .status { text-align:center; font-size:1.6em; font-weight: 700; }
            .sub1 { font-weight: 700; font-size: 1.2em; margin: 6px 0 2px; }
            .sub1, .sub2, .sub3 { display: flex; justify-content: space-between; align-items: center; margin: 2px 0; }
            .last-play { font-size: 1.2em; width: 100%; white-space: nowrap; overflow: hidden; box-sizing: border-box; }
            .last-play p { display: inline-block; padding-left: 100%; margin: 2px 0 12px; animation : slide 18s linear infinite; }
            @keyframes slide { 0%   { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }
            .clock { text-align: center; font-size: 1.4em; }
            .down-distance { text-align: right; }
            .play-clock { font-size: 1.4em; text-align: center; margin-top: -24px; }
            .probability-text { text-align: center; }
            .prob-flex { width: 100%; display: flex; justify-content: center; margin-top: 4px; }
            .home-team-probability { width: ${homeTeamProb}%; background-color: ${homeTeamColor}; height: 12px; border-radius: 0 ${probRadius}px ${probRadius}px 0; border: ${clrOut}px solid ${outColor}; border-left: 0; transition: all 1s ease-out; }
            .away-team-probability { width: ${awayTeamProb}%; background-color: ${awayTeamColor}; height: 12px; border-radius: ${probRadius}px 0 0 ${probRadius}px; border: ${clrOut}px solid ${outColor}; border-right: 0; transition: all 1s ease-out; }
            .probability-wrapper { display: flex; }
            .away-team-percent { flex: 0 0 10px; padding: 0 10px 0 0; }
            .home-team-percent { flex: 0 0 10px; padding: 0 0 0 10px; text-align: right; }
            .percent { padding: 0 6px; }
            .post-game { margin: 0 auto; }
            .line-score-table { width: 100%; border-collapse: collapse; text-align: center; }
            .line-score-cell { border: 0.5px solid #999; text-align: center; }
            table.ls { width: 100%; text-align: center; border: 0.5px solid #999; border-collapse: collapse; }
            th, td { border: 0.5px solid #999; text-align: center; }
            th.teamls, td.teamls { border: 0.5px solid #999; text-align: left; }
          </style>
          <ha-card>
            <div class="card">
            <img class="away-team-bg" src="${stateObj.attributes.away_team_logo}" />
            <img class="home-team-bg" src="${stateObj.attributes.home_team_logo}" />
            <div class="card-content">
              <div class="team">
                <img src="${stateObj.attributes.away_team_logo}" />
                <div class="name">${stateObj.attributes.away_team_city}<br>${stateObj.attributes.away_team_name}</div>
                <div class="record">${stateObj.attributes.away_team_record}</div>
                <div class="timeouts">
                  <div class="away-team-to"></div>
                  <div class="away-team-to"></div>
                  <div class="away-team-to"></div>
                </div>
              </div>
              <div class="awayteamposs">&bull;</div>
              <div class="score">${stateObj.attributes.away_team_score}</div>
              <div class="divider">-</div>
              <div class="score">${stateObj.attributes.home_team_score}</div>
              <div class="hometeamposs">&bull;</div>
              <div class="team">
                <img src="${stateObj.attributes.home_team_logo}" />
                <div class="name">${stateObj.attributes.home_team_city}<br>${stateObj.attributes.home_team_name}</div>
                <div class="record">${stateObj.attributes.home_team_record}</div>
                <div class="timeouts">
                  <div class="home-team-to"></div>
                  <div class="home-team-to"></div>
                  <div class="home-team-to"></div>
                </div>
              </div>
            </div>
            <div class="play-clock">Q${stateObj.attributes.quarter} - ${stateObj.attributes.clock}</div>
            <div class="line"></div>
            <div class="sub2">
              <div class="venue">${stateObj.attributes.venue_name}</div>
             <div class="down-distance">${stateObj.attributes.down_distance_text}</div>
            </div>
            <div class="sub3">
              <div class="location">${stateObj.attributes.venue_city}, ${stateObj.attributes.venue_state}</div>
              <div class="network">${stateObj.attributes.tv_network}</div>
            </div>
            <div class="line"></div>
            <div class="last-play">
              <p>${stateObj.attributes.last_play}</p>
            </div>
            <div class="probability-text">Win Probability</div>
            <div class="probability-wrapper">
              <div class="away-team-percent">${awayTeamProb}%</div>
              <div class="prob-flex">
                <div class="away-team-probability"></div>
                <div class="home-team-probability"></div>
              </div>
              <div class="home-team-percent">${homeTeamProb}%</div>
            </div>

            <div class="probability-text">
              <table class="ls">
                <thead>
                  <tr>
                    <th class="teamls">Scoring</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>T</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="teamls"><img src="${awayTeamLogo}" style="height:15px;" />&nbsp; ${stateObj.attributes.away_team_abbr}</td>
                    <td>${stateObj.attributes.away_team_ls_1}</td>
                    <td>${stateObj.attributes.away_team_ls_2}</td>
                    <td>${stateObj.attributes.away_team_ls_3}</td>
                    <td>${stateObj.attributes.away_team_ls_4}</td>
                    <td>${stateObj.attributes.away_team_score}</td>
                  </tr>
                  <tr>
                    <td class="teamls"><img src="${homeTeamLogo}" style="height:15px;"/>&nbsp; ${stateObj.attributes.home_team_abbr}</td>
                    <td>${stateObj.attributes.home_team_ls_1}</td>
                    <td>${stateObj.attributes.home_team_ls_2}</td>
                    <td>${stateObj.attributes.home_team_ls_3}</td>
                    <td>${stateObj.attributes.home_team_ls_4}</td>
                    <td>${stateObj.attributes.home_team_score}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
          </ha-card>
        `;
    }

    if (stateObj.state == 'PRE') {
        return html`
          <style>
            .card { position: relative; overflow: hidden; padding: 0 16px 20px; font-weight: 400; }
            .away-team-bg { opacity: 0.08; position:absolute; top: -20%; left: -20%; width: 58%; z-index: 0; }
            .home-team-bg { opacity: 0.08; position:absolute; top: -20%; right: -20%; width: 58%; z-index: 0; }
            .card-content { display: flex; justify-content: space-evenly; align-items: center; text-align: center; position: relative; z-index: 99; }
            .team { text-align: center; width: 35%; }
            .team img { max-width: 90px; }
            .name { font-size: 1.4em; margin-bottom: 4px; }
            .line { height: 1px; background-color: var(--primary-text-color); margin:10px 0; }
            .gameday { font-size: 1.4em; margin-bottom: 4px; }
            .gametime { font-size: 1.1em; }
            .week-number { font-size: 1.1em; }
            .sub1 { font-weight: 500; font-size: 1.2em; margin: 6px 0 2px; }
            .sub1, .sub2, .sub3, .sub4 { display: flex; justify-content: space-between; align-items: center; margin: 2px 0; }
            .last-play { font-size: 1.2em; width: 100%; white-space: nowrap; overflow: hidden; box-sizing: border-box; }
            .last-play p { display: inline-block; padding-left: 100%; margin: 2px 0 12px; animation : slide 10s linear infinite; }
            @keyframes slide { 0%   { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }
            .clock { text-align: center; font-size: 1.4em; }
            .down-distance { text-align: right; font-weight: 700; }
            .kickoff { text-align: center; margin-top: -24px; }
          </style>
          <ha-card>
              <div class="card">
              <img class="away-team-bg" src="${stateObj.attributes.away_team_logo}" />
              <img class="home-team-bg" src="${stateObj.attributes.home_team_logo}" />
              <div class="card-content">
                <div class="team">
                  <img src="${stateObj.attributes.away_team_logo}" />
                  <div class="name">${stateObj.attributes.away_team_city}<br>${stateObj.attributes.away_team_name}</div>
                  <div class="record">${stateObj.attributes.away_team_record}</div>
                </div>
                <div class="gamewrapper">
                  <div class="gameday">${gameDay}</div>
                  <div class="gametime">${gameTime}</div>
                  <div class="week-number">Week ${stateObj.attributes.week_number}</div>
                </div>
                <div class="team">
                  <img src="${stateObj.attributes.home_team_logo}" />
                  <div class="name">${stateObj.attributes.home_team_city}<br>${stateObj.attributes.home_team_name}</div>
                  <div class="record">${stateObj.attributes.home_team_record}</div>
                </div>
              </div>

              <div class="line"></div>
              <div class="card-content">
                <div class="team">
                  <div class="leader-info">${stateObj.attributes.away_team_passing_leader_name}<br>${stateObj.attributes.away_team_passing_leader_stats}</div>
                </div>
                <div class="gamewrapper">
                  <div class="leader-category">Passing</div>
                </div>
                <div class="team">
                  <div class="leader-info">${stateObj.attributes.home_team_passing_leader_name}<br>${stateObj.attributes.home_team_passing_leader_stats}</div>
                </div>
              </div>

              <div class="card-content">
                <div class="team">
                  <div class="leader-info">${stateObj.attributes.away_team_rushing_leader_name}<br>${stateObj.attributes.away_team_rushing_leader_stats}</div>
                </div>
                <div class="gamewrapper">
                  <div class="leader-category">Rushing</div>
                </div>
                <div class="team">
                  <div class="leader-info">${stateObj.attributes.home_team_rushing_leader_name}<br>${stateObj.attributes.home_team_rushing_leader_stats}</div>
                </div>
              </div>

              <div class="card-content">
                <div class="team">
                  <div class="leader-info">${stateObj.attributes.away_team_receiving_leader_name}<br>${stateObj.attributes.away_team_receiving_leader_stats}</div>
                </div>
                <div class="gamewrapper">
                  <div class="leader-category">Receiving</div>
                </div>
                <div class="team">
                  <div class="leader-info">${stateObj.attributes.home_team_receiving_leader_name}<br>${stateObj.attributes.home_team_receiving_leader_stats}</div>
                </div>
              </div>

              <div class="line"></div>
              <div class="sub1">
                <div class="date">Kickoff ${stateObj.attributes.kickoff_in}</div>
                <div class="odds">${stateObj.attributes.odds}</div>
              </div>
              <div class="sub2">
                <div class="venue">${stateObj.attributes.venue_name}</div>
                <div class="overunder"> O/U: ${stateObj.attributes.overunder}</div>
              </div>
              <div class="sub3">
                <div class="location">${stateObj.attributes.venue_city}, ${stateObj.attributes.venue_state}</div>
                <div class="network">${stateObj.attributes.tv_network}</div>
              </div>
              <div class="sub4">
                <div class="capacity">Capacity: ${stateObj.attributes.venue_capacity}</div>
                <div class="weather">${weather}</div>
              </div>
            </div>
            </ha-card>
        `;
    }

    if (stateObj.state == 'BYE') {
      return html`
        <style>
          .card { position: relative; overflow: hidden; padding: 16px 16px 20px; font-weight: 400; }
          .team-bg { opacity: 0.08; position: absolute; top: -20%; left: -30%; width: 75%; z-index: 0; }
          .card-content { display: flex; justify-content: space-evenly; align-items: center; text-align: center; position: relative; z-index: 99; }
          .team { text-align: center; width: 50%; }
          .team img { max-width: 90px; }
          .name { font-size: 1.6em; margin-bottom: 4px; }
          .line { height: 1px; background-color: var(--primary-text-color); margin:10px 0; }
          .bye { font-size: 1.8em; text-align: center; width: 50%; }
        </style>
        <ha-card>
          <div class="card">
            <img class="team-bg" src="${stateObj.attributes.home_team_logo}" />
            <div class="card-content">
              <div class="team">
                <img src="${stateObj.attributes.home_team_logo}" />
                <div class="name">${stateObj.attributes.home_team_city}<br>${stateObj.attributes.home_team_name}</div>
              </div>
              <div class="bye">BYE</div>
            </div>
          </div>
        </ha-card>
      `;
    }

    if (stateObj.state == 'NOT_FOUND') {
      return html`
        <style>
          .card { position: relative; overflow: hidden; padding: 16px 16px 20px; font-weight: 400; }
          .team-bg { opacity: 0.08; position: absolute; top: -50%; left: -30%; width: 75%; z-index: 0; }
          .card-content { display: flex; justify-content: space-evenly; align-items: center; text-align: center; position: relative; z-index: 99; }
          .team { text-align: center; width: 50%; }
          .team img { max-width: 90px; }
          .name { font-size: 1.6em; margin-bottom: 4px; }
          .line { height: 1px; background-color: var(--primary-text-color); margin:10px 0; }
          .eos { font-size: 1.8em; line-height: 1.2em; text-align: center; width: 50%; }
        </style>
        <ha-card>
          <div class="card">
            <img class="team-bg" src="https://a.espncdn.com/i/espn/misc_logos/500/nfl.png" />
            <div class="card-content">
              <div class="team">
                <img src="https://a.espncdn.com/i/espn/misc_logos/500/nfl.png" />
              </div>
              <div class="eos">Better Luck<br />Next Year</div>
            </div>
          </div>
        </ha-card>
      `;
    }
  }
}

customElements.define("nfl-card", NFLCard);
