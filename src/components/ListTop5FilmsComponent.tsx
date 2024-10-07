import React, { useEffect, useState } from 'react';
import Player from 'lottie-react';
import animationData from '../assets/Animation - 1727534153149.json';
import { listTop5Films } from '../services/FilmService';

interface FilmCategory {
  categoryId: number;
  filmId: number;
  categoryName: string;
  lastUpdate: string;
}

interface FilmActor {
  filmId: number;
  actorId: number;
  firstName: string;
  lastName: string;
  lastUpdate: string;
}

interface Film {
  filmId: number;
  title: string;
  filmCategories: FilmCategory[];
  description: string;
  releaseYear: string;
  filmActors: FilmActor[];
  rentalDuration: number;
  rentalRate: number;
  length: number;
  replacementCost: number;
  rating: string;
  specialFeatures: string;
  lastUpdate: string;
  languageId: number;
  originalLanguageId: number | null;
}

const ListTop5FilmComponent: React.FC = () => {
  const [films, setTop5Films] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  useEffect(() => {
    listTop5Films()
      .then((response) => {
        setTop5Films(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Toggle film details
  const handleShowDetails = (film: Film) => {
    setSelectedFilm(film); // Set the selected film for details
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedFilm(null); // Close the modal
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="bg-white shadow-lg text-white w-full p-4">
        <h1 className="text-3xl mb-4 text-center text-slate-600"><p><strong>Top 5 Films</strong></p></h1>
        <div className="grid grid-cols-5 gap-4">
          {films.map((film) => (
            <div
              key={film.filmId}
              className="relative bg-green-300 rounded-lg shadow hover:scale-105 transition-transform duration-200 ease-in-out flex flex-col w-full cursor-pointer"
              onClick={() => handleShowDetails(film)}
            >
              <Player
                autoplay
                loop
                animationData={animationData}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                }}
              />
              <div className="flex-grow flex items-center justify-center h-20">
                <div className="text-center text-slate-600"><p><strong>{film.title}</strong></p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Modal for Film Details */}
      {selectedFilm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
          <div className="bg-white  text-left rounded-lg p-6 w-3/4 h-5/16 overflow-auto relative">
            {/* Close button */}
            <button
              className="absolute bottom-4 right-4 mr-2 rounded-lg border hover:bg-blue-100 px-4 py-2 rounded"
              onClick={handleCloseModal}
            >
              Close
            </button>

            {/* Film Details */}
            <h2 className="text-2xl text-center text-black font-bold mb-4"><p><strong>{selectedFilm.title}</strong></p></h2>
            <p><strong>Description:</strong> {selectedFilm.description}</p>
            <p><strong>Release Year:</strong> {selectedFilm.releaseYear}</p>
            <p><strong>Rental Duration:</strong> {selectedFilm.rentalDuration} days</p>
            <p><strong>Rental Rate:</strong> ${selectedFilm.rentalRate}</p>
            <p><strong>Length:</strong> {selectedFilm.length} minutes</p>
            <p><strong>Replacement Cost:</strong> ${selectedFilm.replacementCost}</p>
            <p><strong>Rating:</strong> {selectedFilm.rating}</p>
            <p><strong>Special Features:</strong> {selectedFilm.specialFeatures}</p>
            
            {/* Film Categories */}
            <p><strong>Categories:</strong> {selectedFilm.filmCategories.map(cat => cat.categoryName).join(', ')}</p>
            
            {/* Film Actors */}
            <p><strong>Actors:</strong> {selectedFilm.filmActors.map(actor => `${actor.firstName} ${actor.lastName}`).join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListTop5FilmComponent;
