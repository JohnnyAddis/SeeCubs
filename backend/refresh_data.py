import requests
import pandas as pd
import os

# MLB API endpoint for Cubs player stats
CUBS_TEAM_ID = 112  # Cubs team ID
SEASON_YEAR = 2025
API_URL = f"https://statsapi.mlb.com/api/v1/teams/{CUBS_TEAM_ID}/roster"

# Output CSV path
OUTPUT_CSV = "data/standard_batting.csv"

def fetch_cubs_player_stats(season=SEASON_YEAR):
    print("Fetching Cubs roster...")
    response = requests.get(API_URL)
    response.raise_for_status()

    roster_data = response.json()["roster"]

    player_stats = []

    print("Fetching player stats...")
    for player in roster_data:
        player_id = player["person"]["id"]
        player_name = player["person"]["fullName"]

        # Get player hitting stats
        stats_url = f"https://statsapi.mlb.com/api/v1/people/{player_id}/stats?stats=season&season={season}&group=hitting"
        stats_response = requests.get(stats_url)
        stats_response.raise_for_status()
        stats_data = stats_response.json()["stats"]

        if stats_data:
            stat_split = stats_data[0].get("splits")
            if stat_split:
                stat = stat_split[0]["stat"]
                player_stats.append({
                    "Player": player_name,
                    "G": stat.get("gamesPlayed", 0),
                    "AB": stat.get("atBats", 0),
                    "H": stat.get("hits", 0),
                    "HR": stat.get("homeRuns", 0),
                    "RBI": stat.get("rbi", 0),
                    "BB": stat.get("baseOnBalls", 0),
                    "SO": stat.get("strikeOuts", 0),
                    "SB": stat.get("stolenBases", 0),
                    "AVG": stat.get("avg", 0.0),
                    "OBP": stat.get("obp", 0.0),
                    "SLG": stat.get("slg", 0.0),
                    "OPS": stat.get("ops", 0.0)
                })

    return pd.DataFrame(player_stats)

def save_to_csv(df, path=OUTPUT_CSV):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_csv(path, index=False)
    print(f"Saved Cubs stats to {path}")

if __name__ == "__main__":
    print("Starting Cubs data refresh...")
    try:
        cubs_df = fetch_cubs_player_stats()
        save_to_csv(cubs_df)
        print("✅ Cubs data refresh complete.")
    except Exception as e:
        print("❌ Error refreshing Cubs data:", e)
