// Mock data para fallback quando a API externa não estiver disponível
export const mockFootballData = {
  liveMatches: {
    response: [
      {
        fixture: {
          id: 1,
          timestamp: Date.now() / 1000,
          status: { short: "LIVE", long: "Match In Play", elapsed: 45 },
          venue: { name: "Old Trafford", city: "Manchester" }
        },
        league: { id: 39, name: "Premier League", country: "England" },
        teams: {
          home: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png"
          },
          away: {
            id: 40,
            name: "Liverpool",
            logo: "https://media.api-sports.io/football/teams/40.png"
          }
        },
        goals: { home: 1, away: 2 }
      },
      {
        fixture: {
          id: 2,
          timestamp: Date.now() / 1000 - 3600,
          status: { short: "FT", long: "Match Finished", elapsed: 90 },
          venue: { name: "Emirates Stadium", city: "London" }
        },
        league: { id: 39, name: "Premier League", country: "England" },
        teams: {
          home: {
            id: 42,
            name: "Arsenal",
            logo: "https://media.api-sports.io/football/teams/42.png"
          },
          away: {
            id: 50,
            name: "Manchester City",
            logo: "https://media.api-sports.io/football/teams/50.png"
          }
        },
        goals: { home: 3, away: 1 }
      },
      {
        fixture: {
          id: 3,
          timestamp: Date.now() / 1000 + 7200,
          status: { short: "NS", long: "Not Started", elapsed: null },
          venue: { name: "Stamford Bridge", city: "London" }
        },
        league: { id: 39, name: "Premier League", country: "England" },
        teams: {
          home: {
            id: 49,
            name: "Chelsea",
            logo: "https://media.api-sports.io/football/teams/49.png"
          },
          away: {
            id: 47,
            name: "Tottenham",
            logo: "https://media.api-sports.io/football/teams/47.png"
          }
        },
        goals: { home: null, away: null }
      }
    ]
  },

  standings: {
    response: [
      {
        league: {
          id: 39,
          name: "Premier League",
          standings: [
            [
              {
                rank: 1,
                team: {
                  id: 50,
                  name: "Manchester City",
                  logo: "https://media.api-sports.io/football/teams/50.png"
                },
                points: 89,
                goalsDiff: 62,
                all: { played: 36, win: 28, draw: 5, lose: 3 }
              },
              {
                rank: 2,
                team: {
                  id: 42,
                  name: "Arsenal",
                  logo: "https://media.api-sports.io/football/teams/42.png"
                },
                points: 84,
                goalsDiff: 45,
                all: { played: 36, win: 26, draw: 6, lose: 4 }
              },
              {
                rank: 3,
                team: {
                  id: 40,
                  name: "Liverpool",
                  logo: "https://media.api-sports.io/football/teams/40.png"
                },
                points: 75,
                goalsDiff: 35,
                all: { played: 36, win: 23, draw: 6, lose: 7 }
              },
              {
                rank: 4,
                team: {
                  id: 33,
                  name: "Manchester United",
                  logo: "https://media.api-sports.io/football/teams/33.png"
                },
                points: 66,
                goalsDiff: 12,
                all: { played: 36, win: 20, draw: 6, lose: 10 }
              },
              {
                rank: 5,
                team: {
                  id: 49,
                  name: "Chelsea",
                  logo: "https://media.api-sports.io/football/teams/49.png"
                },
                points: 62,
                goalsDiff: 8,
                all: { played: 36, win: 18, draw: 8, lose: 10 }
              },
              {
                rank: 6,
                team: {
                  id: 47,
                  name: "Tottenham",
                  logo: "https://media.api-sports.io/football/teams/47.png"
                },
                points: 60,
                goalsDiff: 15,
                all: { played: 36, win: 18, draw: 6, lose: 12 }
              },
              {
                rank: 7,
                team: {
                  id: 55,
                  name: "Brighton",
                  logo: "https://media.api-sports.io/football/teams/55.png"
                },
                points: 58,
                goalsDiff: 10,
                all: { played: 36, win: 17, draw: 7, lose: 12 }
              }
            ]
          ]
        }
      }
    ]
  },

  players: {
    response: [
      {
        player: {
          id: 874,
          name: "Cristiano Ronaldo",
          photo: "https://media.api-sports.io/football/players/874.png",
          age: 39,
          nationality: "Portugal",
          position: "Attacker"
        },
        statistics: [
          {
            team: {
              id: 33,
              name: "Manchester United",
              logo: "https://media.api-sports.io/football/teams/33.png"
            },
            games: { appearences: 28 },
            goals: { total: 18 }
          }
        ]
      },
      {
        player: {
          id: 276,
          name: "Lionel Messi",
          photo: "https://media.api-sports.io/football/players/276.png",
          age: 36,
          nationality: "Argentina",
          position: "Attacker"
        },
        statistics: [
          {
            team: {
              id: 85,
              name: "Paris Saint Germain",
              logo: "https://media.api-sports.io/football/teams/85.png"
            },
            games: { appearences: 32 },
            goals: { total: 25 }
          }
        ]
      },
      {
        player: {
          id: 1100,
          name: "Erling Haaland",
          photo: "https://media.api-sports.io/football/players/1100.png",
          age: 23,
          nationality: "Norway",
          position: "Attacker"
        },
        statistics: [
          {
            team: {
              id: 50,
              name: "Manchester City",
              logo: "https://media.api-sports.io/football/teams/50.png"
            },
            games: { appearences: 35 },
            goals: { total: 35 }
          }
        ]
      },
      {
        player: {
          id: 635,
          name: "Mohamed Salah",
          photo: "https://media.api-sports.io/football/players/635.png",
          age: 31,
          nationality: "Egypt",
          position: "Attacker"
        },
        statistics: [
          {
            team: {
              id: 40,
              name: "Liverpool",
              logo: "https://media.api-sports.io/football/teams/40.png"
            },
            games: { appearences: 34 },
            goals: { total: 22 }
          }
        ]
      },
      {
        player: {
          id: 184,
          name: "Harry Kane",
          photo: "https://media.api-sports.io/football/players/184.png",
          age: 30,
          nationality: "England",
          position: "Attacker"
        },
        statistics: [
          {
            team: {
              id: 157,
              name: "Bayern Munich",
              logo: "https://media.api-sports.io/football/teams/157.png"
            },
            games: { appearences: 32 },
            goals: { total: 28 }
          }
        ]
      }
    ]
  }
};
