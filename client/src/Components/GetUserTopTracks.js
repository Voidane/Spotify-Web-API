import { useEffect, useState } from "react";

export default function GetUserTopTracks({token}) {

    const [tracks, setTracks] = useState({items: []});
    const [limit, setLimit] = useState(10);
    const [timeRange, setTimeRange] = useState("long_term");

    async function getUserTopTracks() {

        let endpoint = "https://api.spotify.com/v1/me/top/tracks";
        endpoint += "?time_range=" + timeRange;
        endpoint += "&limit=" + limit;

        const response = await fetch(endpoint, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        const data = await response.json();
        console.log(data);

        setTracks(data);
    }

    function handleOnTimeRangeChange(event) {
        setTimeRange(event.target.value);
    }

    function handleOnLimitChange(event) {
        setLimit(event.target.value);
    }

    useEffect(() => {
        getUserTopTracks();
    }, [timeRange, limit])

    useEffect(() => {
        getUserTopTracks();
    }, [token])

    return(
        <>
        <div className="display">
            <h1>User Top Tracks</h1>
            
            <div className="song_term_list">
            <h3>Time Range</h3>
            <select className="song_term_list" name="range" id="range" onChange={(event) => handleOnTimeRangeChange(event)}>
                <option value="long_term">1 year</option>
                <option value="medium_term">6 months</option>
                <option value="short_term">4 weeks</option>
            </select><br />
            </div>

            <div className="song_limit_list">
            <h3>Song Limit</h3>
            <select className="song_limit_list" name="limit" id="limit" onChange={(event) => handleOnLimitChange(event)}>
                <option>10</option>
                <option>25</option>
                <option>50</option>
            </select>
            </div>
            <hr />

            
            <section className="user-tracks-table-body">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Cover</th>
                            <th>Name</th>
                            <th>Artist</th>
                        </tr>
                    </thead>
                    <tbody>
                        

            {tracks.items.map((song, index) => 
            (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td><img src={song.album.images[2].url} /></td>
                    <td><a href={song.uri}> {song.name}</a></td>
                    <td><a href={song.artists[0].uri}>{song.artists[0].name}</a></td>
                </tr>
            ))}
                        
                    </tbody>
                </table>
            </section>
            
        </div>
        </>
    );
}