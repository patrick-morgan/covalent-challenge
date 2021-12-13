import React, { useState, useEffect } from "react";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import styled from "styled-components";

interface user {
  user_id?: any;
  name: any;
  email: any;
  city: any;
  years: any;
  interests: any;
}

interface match {
  match_id: any;
  user1: any;
  user2: any;
}

interface UserDict {
  [x: number]: user;
}

function App() {
  const [users, setUsers] = useState<user[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dictUsers, setDictUsers] = useState<UserDict>({});
  const [matches, setMatches] = useState<match[]>([]);
  const [needsMatch, setNeedsMatch] = useState<user[]>([]);
  const [firstValue, setFirstValue] = useState<number>(-10);
  const [secondValue, setSecondValue] = useState<number>(-10);
  const [ticker, setTicker] = useState(true);

  useEffect(() => {
    refreshUsers();
    refreshMatches();
  }, []);

  const refreshUsers = async () => {
    setIsLoading(true);
    await axios
      .get("/api/users/")
      .then((res) => {
        console.log(res);
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const refreshMatches = async () => {
    setIsLoading(true);
    await axios
      .get("/matches/")
      .then((res) => {
        console.log("matches");
        console.log(res);
        setMatches(res.data);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  useEffect(() => {
    refreshNeedsMatching();
  }, [matches]);

  const refreshNeedsMatching = () => {
    setIsLoading(true);
    axios
      .get("/needs-matching/")
      .then((res) => {
        console.log("needs-matching:");
        console.log(res);
        setNeedsMatch(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
  };

  const transformData = () => {
    let usersTmp: UserDict = {};
    users.forEach((user) => {
      usersTmp[user.user_id] = {
        name: user.name,
        email: user.email,
        city: user.city,
        years: user.years,
        interests: user.interests,
      };
    });
    console.log("dict users:");
    console.log(usersTmp);
    setDictUsers(usersTmp);
  };

  useEffect(() => {
    transformData();
  }, [users]);

  const makeMatch = async (user1: number, user2: number) => {
    setIsLoading(true);
    await axios
      .post("/create/", {
        user1: user1,
        user2: user2,
      })
      .then((res) => {
        console.log("create match!:");
        console.log(res);
        setFirstValue(-10);
        setSecondValue(-10);
        refreshMatches();
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(true);
  };

  const handleChange = (user_id: number) => {
    if (firstValue === user_id) {
      setFirstValue(-10);
    } else if (secondValue === user_id) {
      setSecondValue(-10);
    } else if (firstValue === -10) {
      setFirstValue(user_id);
    } else if (secondValue === -10) {
      setSecondValue(user_id);
    } else if (ticker === true) {
      setFirstValue(user_id);
      setTicker(false);
    } else {
      setSecondValue(user_id);
      setTicker(true);
    }
  };

  const unmatchUsers = async (match_id: number) => {
    setIsLoading(true);
    await axios
      .delete(`/delete/${match_id}/`)
      .then((res) => {
        console.log("deleted match!:");
        console.log(res);
        refreshMatches();
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const rematchUsers = async () => {
    setIsLoading(true);
    await axios
      .put("generate-matches/")
      .then((res) => {
        console.log("Generated new matches!:");
        console.log(res);
        refreshMatches();
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        {isLoading ? (
          <>Loading Matches</>
        ) : (
          <div className="center">
            <Styles>
              <div>
                <h1>Matchmaker</h1>
              </div>
              <div className="marginDiv">
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => rematchUsers()}
                >
                  Rematch All Users
                </Button>
              </div>
              <div className="marginTop">
                <h2>Needs Matching</h2>
                {needsMatch && needsMatch.length > 0 ? (
                  <>
                    <p>
                      Click the buttons in the 'Select' column to select users
                      for matching. Once you have selected two users, match them
                      by clicking the 'match' button below. Only two users can
                      be matched at once.
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>City</th>
                          <th>Yrs Exp</th>
                          <th>Interests</th>
                          <th>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {needsMatch &&
                          needsMatch.length &&
                          needsMatch.map((user, index) => {
                            return (
                              <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.city}</td>
                                <td>{user.years}</td>
                                <td>
                                  {user.interests.map(
                                    (interest: String, index: number) => (
                                      <>
                                        {index === user.interests.length - 1 ? (
                                          <span>{interest}</span>
                                        ) : (
                                          <span>{interest}, </span>
                                        )}
                                      </>
                                    )
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={
                                      firstValue === user.user_id ||
                                      secondValue === user.user_id
                                    }
                                    onChange={() => handleChange(user.user_id)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    <div className="marginTopSlim">
                      {firstValue === -10 || secondValue === -10 ? (
                        <Button variant="success" disabled>
                          Match
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          onClick={() => makeMatch(firstValue, secondValue)}
                        >
                          Match
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p>All users have matches!</p>
                  </>
                )}
              </div>
              <div>
                <div className="marginTop">
                  <h1>Matches</h1>
                </div>
                <p>
                  Click the button to the right of each row to unmatch the
                  users.<br></br>
                  The traits that each match had in common are listed below. The
                  interests column lists the number of interests the users had
                  in commmon.
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Name</th>
                      <th>City</th>
                      <th>Yrs Exp</th>
                      <th>Interests</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches &&
                      matches.length &&
                      dictUsers &&
                      !(Object.keys(dictUsers).length === 0) &&
                      matches.map((match, index) => (
                        <tr key={index}>
                          <td>{dictUsers[match.user1].name}</td>
                          <td>{dictUsers[match.user2].name}</td>
                          <td>
                            {dictUsers[match.user1].city ===
                              dictUsers[match.user2].city &&
                              dictUsers[match.user1].city}
                          </td>
                          <td>
                            {dictUsers[match.user1].years ===
                              dictUsers[match.user2].years &&
                              dictUsers[match.user1].years}
                          </td>
                          <td>
                            {dictUsers[match.user1].interests.reduce(
                              (sum: number, curr: string, currIdx: number) => {
                                if (
                                  dictUsers[match.user2].interests.includes(
                                    dictUsers[match.user1].interests[currIdx]
                                  )
                                ) {
                                  return sum + 1;
                                }
                                return sum;
                              },
                              0
                            )}
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => unmatchUsers(match.match_id)}
                            >
                              {" "}
                              Unmatch{" "}
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Styles>
          </div>
        )}
      </header>
    </div>
  );
}

const Styles = styled.div`
  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
          padding: 1rem;
        }
      }
    }

    th,
    td {
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }

    th {
      //  background-color: lightskyblue;
      border-bottom: 3px solid black;
      color: black;
      fontweight: bold;
    }
  }
`;

export default App;
