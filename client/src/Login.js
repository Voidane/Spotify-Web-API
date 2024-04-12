import React, { useEffect, useState } from "react";

// Public client id of our spotify app
const CLIENT_ID = "8a86686f68ad41c69672222a39c3418c"

const REDIRECT_URI = "http://localhost:3000";

const SCOPE = "user-read-private user-read-email user-top-read playlist-read-collaborative user-follow-read";

const authUrl = new URL("https://accounts.spotify.com/authorize")

export default function Login() {

    /**
     * Generates a random string with any number or letter of the size of the
     * the paramater passed through
     * @param {Number} length The length of the string
     * @returns returns a randomly generated string
     */
    function generateRandomString(length) {
        let text = '';
        const possible =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * Using SHA-256 algorithm a random generated string is encrypted and stored
     * @param {String} codeVerifier A randomly generated string
     * @returns an encrypted string
     */
    async function generateCodeChallenge(codeVerifier) {
        const digest = await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(codeVerifier),
          );
      
          return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    /**
     * Proof of Key Code Exchange Authorization
     * OAuth 2.0 extension protocol
     */
    function authorization() {
        
        const codeVerifier = generateRandomString(64);

        generateCodeChallenge(codeVerifier).then((code_challenge) => {
            
            window.localStorage.setItem('code_verifier', codeVerifier);
            window.localStorage.setItem('client_id', CLIENT_ID);
            
            const params =  {
                response_type: 'code',
                client_id: CLIENT_ID,
                scope: SCOPE,
                code_challenge_method: 'S256',
                code_challenge: code_challenge,
                redirect_uri: REDIRECT_URI,
            }

            authUrl.search = new URLSearchParams(params).toString();
            window.location.href = authUrl.toString();
        })
    }
    
    return(
        <>
            <button type="button" onClick={authorization}>Connect to spotify</button>
        </>
    );
}