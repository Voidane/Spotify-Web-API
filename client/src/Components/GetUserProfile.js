import { useEffect, useState } from "react";

export default function GetUserProfile({token, playlistCount}) {
    
    const [data, setData] = useState({country: '',
                                      display_name: '',
                                      email: '',
                                      explicit_content_filter_enabled: false,
                                      explicit_content_filter_locked: false,
                                      external_urls_spotify: '',
                                      followers: '',
                                      href: '',
                                      id: '',
                                      images: '',
                                      product: '',
                                      type: '',
                                      uri: ''});
                                      
    const [followingArtist, setFollowingArtist] = useState(0);
    const [topArtist, setTopArtist] = useState(null);
    const [topTracks, setTopTracks] = useState(null);

    useEffect(() => {
        getProfile();
        getFollowingArtist();
        getTopArtist();
        getTopTracks();
    }, [token])

    async function getProfile() {
        
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        const dataRes = await response.json();
        
        setData({country: dataRes.country,
                 display_name: dataRes.display_name,
                 email: dataRes.email,
                 explicit_content_filter_enabled: dataRes.explicit_content.filter_enabled,
                 explicit_content_filter_locked: dataRes.explicit_content.filter_locked,
                 external_urls_spotify: dataRes.external_urls.spotify,
                 followers: dataRes.followers.total,
                 href: dataRes.href,
                 id: dataRes.id,
                 images: dataRes.images[1].url,
                 product: dataRes.product,
                 type: dataRes.type,
                 uri: dataRes.uri
        })
    }

    async function getFollowingArtist() {
    
        const response = await fetch('https://api.spotify.com/v1/me/following?type=artist', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        const data = await response.json();

        setFollowingArtist(data.artists.total);
    }

    async function getTopArtist() {
    
        const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        const data = await response.json();
        setTopArtist(data);
    }

    async function getTopTracks() {
    
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        const data = await response.json();
        console.log('User top tracks');
        console.log(data);
        setTopTracks(data);
    }

    return(
        <>
        <div className="profile">
            <div className="top-background">
                <img src={data.images} className="icon"/>
                <div className="info">
                    <p className="profile-text">Profile</p>
                    <p className="display-name">{data.display_name}</p>
                    <p className="credentials">{playlistCount} Playlists - {data.followers} Followers - {followingArtist} Followed Artist</p>
                </div>
            </div>

            <div className="account-body">
                <div className="top-artist-info">
                    <h1>Your top artist this month</h1>
                    <div className="top-artist">

                        { topArtist !== null ? topArtist.items.map((artist, index) => (
                        <div className="top-artist-info">
                            <img src={artist.images[2].url} />
                            <p>{artist.name}</p>
                            <p className="artist">Artist</p>
                        </div>
                        )) : 
                        <>
                        </>}
                    </div>
                </div>

                <div className="top-tracks-info">
                    <h1>Your top tracks this month</h1>
                    <table>
                        { topTracks !== null ? topTracks.items.map((song, index) => (
                         <tr>
                            <td>{index+1}</td>
                            <td><img src={song.album.images[2].url} /></td>
                            <td className="title-author">
                                <a>{song.album.name}</a>
                                <a>{song.album.artists[0].name}</a>
                            </td>
                            <td>{song.album.name}</td>
                        </tr>
                        )) : 
                        <>
                        </>}
                    </table>
                </div>
            </div>
        </div>
        </>
    );

}