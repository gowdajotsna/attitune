'use client';
import React, {useState ,useEffect} from 'react'
import defaultdata from '../playlist.json';
import IframePopup from "@/components/IframePopup";

const Playlist = ({ playlistData }) =>{

const [visible, setVisible] = useState(false);  // Visibility state inside the IframePopup
const [uri, updateUri] = useState('2RlgNHKcydI9sayD2Df2xp')

const onSongClick = (item) => {
    const item_uri = item.song_uri
    updateUri(item_uri.split(':')[2]);
    setVisible(true);
}

function millisecondsToMinutes(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
    }
   
    const playlist_data = playlistData ?? defaultdata
    return (
<>
    <div className="overflow-x-auto shadow-[0_-35px_60px_-15px_rgba(255,255,255,0.1)]">
    <table className="min-w-full bg-gradient-to-r from-black to-violet-500">
    <thead>
      <tr>
        <th className="px-2 py-4 whitespace-nowrap text-left">
          #
        </th>
        <th className="px-2 py-4 whitespace-nowrap text-left">
          Title
        </th>
        <th className="px-6 py-4 whitespace-nowrap text-left">
          Artist
        </th>
        <th className="px-6 py-4 whitespace-nowrap text-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" fill="white"></path>
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" fill="white"></path>
            </svg>
        </th>
      </tr>
    </thead>
    <tbody>
      {playlist_data.map((item, index) => (
        <tr key={item._id} onClick={() => onSongClick(item)} className="hover:bg-violet-500">
          <td className="px-3 py-1 whitespace-nowrap cursor-pointer group">
            {index + 1} {/* Row number */}
           </td>
          <td className="px-3 py-1 whitespace-nowrap">
            <div className="flex items-center space-x-2">
                <img src={item.album_image} alt="album" className="w-10 h-10"/>
                <h2>{item.song_name}</h2>
            </div>
          </td>
          <td className="px-6 py-1 whitespace-nowrap">
            {item.artist_names.slice(0, 2).join(', ')}
          </td>
          <td className="px-6 py-1 whitespace-nowrap">
            {millisecondsToMinutes(item.song_duration)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<IframePopup visible={visible} setVisible={setVisible}
    url={`https://open.spotify.com/embed/track/${uri}?utm_source=generator`}
/>
</>
    );
      
};
export default Playlist;