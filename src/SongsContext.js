// import React, { createContext, useState, useEffect } from 'react';

// // Crie o contexto
// const SongsContext = createContext();

// export function SongsProvider({ children }) {
//     const [songs, setSongs] = useState([]);

//     useEffect(() => {
//         const fetchSongs = async () => {
//             try {
//                 const response = await fetch("http://localhost:8080/api/songs");
//                 const data = await response.json();

//                 const constructedSongs = data.map(file => ({
//                     title: file,
//                     src: `http://localhost:8080/audio/${file}.mp3`
//                 }));

//                 setSongs(constructedSongs);
//                 console.log(constructedSongs);
//             } catch (err) {
//                 console.error(err);
//             }
//         };

//         fetchSongs();
//     }, []);

//     return (
//         <SongsContext.Provider value={{ songs, setSongs }}>
//             {children}
//         </SongsContext.Provider>
//     );
// }

// export default SongsContext;