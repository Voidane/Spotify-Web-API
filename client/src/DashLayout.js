import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import './DashLayout.css'
import GetUserProfile from "./Components/GetUserProfile";
import GetUserTopTracks from "./Components/GetUserTopTracks";
import GetUserTopArtist from "./Components/GetUserTopArtist";
import { FaUser } from "react-icons/fa";
import { IoMusicalNoteSharp } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";

const DEFAULT_IMG_ICON_MSC = "https://s.widget-club.com/samples/4Xo8MX7tM5NRDsSL9BxGgs0vtQt2/rEU92qkPRAKRTcCWUylo/F10F92E6-454B-4B98-A8DB-4704EADEBD67.jpg?q=70";

export default function DashLayout({code}) {

    
    // The access token we use for api calls
    const [token, setToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [userCredentials, setUserCredentials] = useState({pfp: '', 
                                                            displayName: '', 
                                                            followers: 0, 
                                                            product: '',
                                                            id: ''});
    const [selected, setSelected] = useState("");
    const [playlist, setPlaylist] = useState(null);
    const REDIRECT_URI = "http://localhost:3000";

    /**
     * 
     */
    async function createToken() {

        let codeVerifier = localStorage.getItem('code_verifier');
        let client_id = localStorage.getItem('client_id');
        
        const rqAccessToken = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: client_id,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                code_verifier: codeVerifier
            }),
        }

        await fetch('https://accounts.spotify.com/api/token', rqAccessToken)
        .then((body) => 
            body.json())
        .then((data) => {
            setToken(data.access_token);
            setRefreshToken(data.refresh_token)
            window.history.pushState({}, null, "/dashboard");
        })
        .catch((error) => {
            console.log("Error with POST create token " + error);
        })
    }

    async function getProfile() {
        let accessToken = localStorage.getItem('access_token');

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        });

        const data = await response.json();
        console.log(data);
        setUserCredentials({pfp: data.images[1].url, 
                            displayName: data.display_name, 
                            followers: data.followers.total,
                            product: data.product,
                            id: data.id});
    }

    async function getPlaylist() {
    
        let accessToken = localStorage.getItem('access_token');
        let endpoint = "https://api.spotify.com/v1/users/" + userCredentials.id + "/playlists"

        const response = await fetch(endpoint, {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        });

        const data = await response.json();
        console.log(data);
        setPlaylist(data);
    }

    function selection(name) {
        setSelected(name);
    }

    useEffect(() => {
        console.log(playlist)
    }, [playlist])

    useEffect(() => {
        createToken();
        console.log(playlist);
    }, [])

    useEffect(() => {
        if (token.length < 1) return;

        console.log(`Token:\n${token}\n\nRefresh Token:\n${refreshToken}`);
        localStorage.setItem('access_token', token);
        localStorage.setItem('refresh_token' , refreshToken);
        getProfile();
        getPlaylist();
    }, [token, refreshToken])

    return (
        <>
        <div className='layout'>
            
            <div className="bar-top">

                <div className="title">
                    <img src='https://cdn.iconscout.com/icon/free/png-256/free-spotify-4408627-3649985.png' />
                    <h1>SPOTIFY</h1>
                </div>

                <div className="account">
                    <p><a><IoIosArrowForward /></a> {userCredentials.displayName}</p>
                    <p><a><IoIosArrowForward /></a> {userCredentials.followers} followers</p>
                    <p><a><IoIosArrowForward /></a> {userCredentials.product}</p>
                    <img src={userCredentials.pfp} />
                </div>
            </div>

            <div className='body-layout'>
                <div className='navigation'>

                    <div className="you-content">
                        <button onClick={() => selection("GetUserProfile")}><a className="icon-adjust"><FaUser /></a>Your Profile</button>
                        <button onClick={() => selection("GetUserTopTracks")}><a><IoMusicalNoteSharp /></a>Your Top Songs</button>
                        <button onClick={() => selection("GetUserTopArtist")}><a><HiUserGroup /></a>Your Top Artist</button>
                    </div>

                    <div className="library">

                        <div className="search">
                            <input type="text" placeholder="Search"/>
                        </div>
                        
                        <div className="liked-songs">
                            <img src="https://i1.sndcdn.com/artworks-y6qitUuZoS6y8LQo-5s2pPA-t500x500.jpg" />
                            <div className="data">
                                <p className="title">Liked Songs</p>
                                <p className="type">Playlist - #</p>
                            </div>
                        </div>
                        
                    {playlist !== null ? playlist.items.map((playlist, index) => (
                        <div className="liked-songs">
                            <img src={playlist.images === null ? DEFAULT_IMG_ICON_MSC : playlist.images[0].url} />
                            <div className="data">
                                <p className="title">{playlist.name ? playlist.name : "+"}</p>
                                <p className="type">Playlist - {playlist.owner.display_name}</p>
                            </div>
                    </div>
                        )) : <>
                        </>};
                        
                    </div>
                </div>

                <div className='content'>
                    {selected === "GetUserProfile" ? <GetUserProfile token={token} playlistCount={playlist.total}/> : <></>}
                    {selected === "GetUserTopTracks" ? <GetUserTopTracks token={token}/> : <></> }
                    {selected === "GetUserTopArtist" ? <GetUserTopArtist token={token}/> : <></> }
                </div>

            </div>
        </div>
        </>
    );
}