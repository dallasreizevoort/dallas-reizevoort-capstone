import React, { useState, useEffect, useRef } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

function Playlist({ accessToken }) {
    const [userID, setUserID] = useState();
    const [playlist, setPlaylist] = useState(null); // New state variable for the playlist

    const spotifyApi = useRef(
        new SpotifyWebApi({
            clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
        })
    );

    useEffect((playlist) => {
        console.log('Playlist state:', playlist);
    }, [playlist]);

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.current.setAccessToken(accessToken);
    
        // Get the user's ID
        spotifyApi.current.getMe().then((res) => {
            setUserID(res.body.id);
            console.log('User ID:', res.body.id); // Log the user ID
        });
    }, [accessToken]);
    
    const createPlaylist = async () => {
        // Get the user's top tracks
        const topTracksResponse = await spotifyApi.current.getMyTopTracks({ limit: 5 });
        console.log('Top Tracks Response:', topTracksResponse); // Log the top tracks response
        const trackIds = topTracksResponse.body.items.map(track => track.id);
    
        // Get recommendations based on these tracks
        const recommendationsResponse = await spotifyApi.current.getRecommendations({ seed_tracks: trackIds });
        console.log('Recommendations Response:', recommendationsResponse); // Log the recommendations response
        const trackUris = recommendationsResponse.body.tracks.map(track => track.uri);
    
        // Create a new playlist
        spotifyApi.current.createPlaylist('New Playlist', { 'public' : false }, async (err, data) => {
            if (err) {
                console.error('Error creating playlist:', err);
                return;
            }
    
            const playlistId = data.body.id;
            console.log('Playlist ID:', playlistId); // Log the playlist ID
            spotifyApi.current.addTracksToPlaylist(playlistId, trackUris, (err, data) => {
                if (err) {
                    console.error('Error adding tracks to playlist:', err); // Log any errors
                    return;
                }
            
                console.log('Created playlist!');
                console.log('AddTracksToPlaylist data:', data); // Log the data from addTracksToPlaylist
            
                // Fetch the playlist data
                spotifyApi.current.getPlaylist(playlistId)
                .then((data) => {
                    console.log('Fetched playlist data:', data.body); // Log the fetched playlist data
                    setPlaylist(data.body); // Update the playlist state
                    console.log('Playlist state after setting:', playlist); // Log the playlist state after setting it
                }, (err) => {
                    console.error('Error fetching playlist:', err);
                });


            });
        });
    };

 

    return (
        <div className="dashboard__playlist">
            <button onClick={createPlaylist}>Create Playlist</button>
            
            {playlist ? (
    <div>
        <h2>{playlist.name}</h2>
        <p>{playlist.description}</p>
        {/* Render the playlist tracks */}
        {playlist.tracks.items.map((item, index) => (
            <div key={index}>
                <p>{item.track.name} by {item.track.artists[0].name}</p>
            </div>
        ))}
    </div>
) : (
    <p>No playlist data to display. Playlist state: {JSON.stringify(playlist)}</p>
)}
        </div>
    );
}

export default Playlist;