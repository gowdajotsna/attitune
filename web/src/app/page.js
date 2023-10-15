"use client"
import { useState, useEffect } from 'react';
import Header from "@/components/Header"
import SearchBox from "@/components/SearchBox"
import Playlist from "@/components/Playlist"

export default function Home() {

  const [searchQuery, setSearchQuery] = useState('');
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  const [playlistData, updatePlaylistData] = useState(null)

  const handleSubmit = (data) => {
      const formData = new FormData();
      formData.append('search_query', data);
      
      fetch("https://attitune-server.onrender.com/api/analyze_sentiment", {
          method: 'post',
          mode: "cors",
          cache: "no-store",
          credentials: "same-origin",
          body: formData
      })
      .then(async (response) => {
        const res = await response.json()
        updatePlaylistData(res)
      });

      localStorage.setItem('search_query', data); // Use localStorage instead
  };

  useEffect(() => {
      const storedQuery = localStorage.getItem('search_query'); // Use localStorage instead
      if (storedQuery) {
          setSearchQuery(storedQuery);
          setLoadedFromStorage(true);
      }
  }, []);

  useEffect(() => {
      if (loadedFromStorage) {
          handleSubmit(searchQuery);
          setLoadedFromStorage(false); 
      }
  }, [loadedFromStorage]);

  useEffect(() => {
      const handleBeforeUnload = (e) => {
          const windowsCount = window.open(null, '_self').length;
          if (windowsCount === 1) { // If only one window/tab is open
              localStorage.removeItem('search_query'); // Clear the stored data
          }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
      };
  }, []);

  const handleFormSubmit = (e) => {
      e.preventDefault();
      handleSubmit(searchQuery);  
  };


  return (
    <div className={`min-h-screen`}>
      <Header />
      <main className="flex min-h-screen flex-col mt-5 px-24">
        <SearchBox handleFormSubmit={handleFormSubmit} setSearchQuery={setSearchQuery} searchQuery={searchQuery}  />
        <div className="col-md-6">
          <div className="playlist"><Playlist playlistData={playlistData}/></div>
        </div>
      </main>
    </div>
  )
}
