import { useEffect, useState } from "react";
import './Dashboard.css'
/** https://react-icons.github.io/react-icons/ */
import { IoCaretForward } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import GetUserProfile from "./Components/GetUserProfile";
import GetUserTopTracks from "./Components/GetUserTopTracks"
import GetUserTopArtist from "./Components/GetUserTopArtist";


export default function Dashboard({code}) {

    // The access token we use for api calls
    const [token, setToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [userCredentials, setUserCredentials] = useState({pfp: '', 
                                                            displayName: '', 
                                                            followers: 0, 
                                                            product: ''});
    const [selected, setSelected] = useState("")

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
                            product: data.product})
    }

    function selection(name) {
        setSelected(name);
    }

    useEffect(() => {
        createToken();
    }, [])

    useEffect(() => {
        if (token.length < 1) return;

        console.log(`Token:\n${token}\n\nRefresh Token:\n${refreshToken}`);
        localStorage.setItem('access_token', token);
        localStorage.setItem('refresh_token' , refreshToken);
        getProfile();
    }, [token, refreshToken])

    return (
        <>
        <div className='layout'>
            
            <div className="bar-top">

                <div className="title">
                    <img src='https://cdn.iconscout.com/icon/free/png-256/free-spotify-4408627-3649985.png' />
                    <h1>SPOTIFY API CALLS</h1>
                </div>

                <div className="account">
                    <p>{userCredentials.displayName}</p>
                    <p>{userCredentials.product}</p>
                    <p>{userCredentials.followers}</p>
                    <img src={userCredentials.pfp}></img>
                </div>
            </div>

            <div className='body-layout'>
                
                <div className='navigation'>
                    <h1>Creator Voidane</h1>
                    <ul>
                    <li>
                        <h4><FaRegUserCircle/> Account Info Calls</h4>
                    </li>
                        <li><a onClick={() => selection("GetUserProfile")}><IoCaretForward/> Your Account Info </a></li>
                        <li><a onClick={() => selection("GetUserTopTracks")}><IoCaretForward/> Your Top Tracks </a></li>
                        <li><a onClick={() => selection("GetUserTopArtist")}><IoCaretForward/> Your Top Artists </a></li>
                    </ul>
                </div>

                <div className='content'>
                    <div className="comp">
                        {selected === "GetUserProfile" ? <GetUserProfile token={token}/> : <></>}
                        {selected === "GetUserTopTracks" ? <GetUserTopTracks token={token}/> : <></> }
                        {selected === "GetUserTopArtist" ? <GetUserTopArtist token={token}/> : <></> }
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}