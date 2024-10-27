import React, { useEffect, useState } from 'react';
import { listTop5Films } from '../services/FilmService';
import { listTop5Actors } from '../services/ActorService';

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

interface Actor {
  actorId: number;
  firstName: string;
  lastName: string;
  bio: string;
  topRentedFilms: Film[];
}

const LandingPageComponent: React.FC = () => {
  const [films, setTop5Films] = useState<Film[]>([]);
  const [actors, setTop5Actors] = useState<Actor[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

  useEffect(() => {
    listTop5Films()
      .then((response) => setTop5Films(response.data))
      .catch((error) => console.error(error));

    listTop5Actors()
      .then((response) => setTop5Actors(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleShowFilmDetails = (film: Film) => {
    setSelectedFilm(film);
  };

  const handleShowActorDetails = (actor: Actor) => {
    setSelectedActor(actor); // Set the selected actor to show details
  };

  const handleCloseFilmModal = () => {
    setSelectedFilm(null);
  };

  const handleCloseActorModal = () => {
    setSelectedActor(null);
  };

  const filmImages = [
    '/images/bucketBrotherhood.webp',
    '/images/rocketeerMother.webp',
    '/images/scalawagDuck.webp',
    '/images/forwardTemple.webp',
    '/images/jugglerHardly.webp',
  ];

  const actorImages = [
    '/images/actor1.webp',
    '/images/actor2.webp',
    '/images/actor3.webp',
    '/images/actor4.webp',
    '/images/actor5.webp',
  ];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full p-6">
      {/* Top 5 Films Section */}
      <div className="text-center w-full">
        <h1 className="text-5xl mb-8 text-teal-300 font-bold ">Top 5 Films</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {films.map((film, index) => (
            <div
              key={film.filmId}
              className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out cursor-pointer group"
              onClick={() => handleShowFilmDetails(film)}
            >
              <div className="w-full aspect-w-4 aspect-h-5 overflow-hidden">
                <img
                  src={filmImages[index] || '/images/default.webp'}
                  alt={`${film.title} Thumbnail`}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-black bg-opacity-60 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-lg text-teal-300 font-semibold">{film.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Actors Section */}
      <div className="text-center w-full mt-12 py-6">
        <h1 className="text-5xl mb-8 text-teal-300 font-bold">Top 5 Actors</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {actors.map((actor, index) => (
            <div
              key={actor.actorId}
              className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out cursor-pointer group"
              onClick={() => handleShowActorDetails(actor)}
            >
              <div className="w-full aspect-w-4 aspect-h-5 overflow-hidden">
                <img
                  src={actorImages[index] || '/images/default_actor.webp'}
                  alt={`${actor.firstName} ${actor.lastName} Thumbnail`}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-black bg-opacity-60 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-lg text-teal-300 font-semibold">{actor.firstName} {actor.lastName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Film Details Modal */}
      {selectedFilm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center z-20 p-4">
          <div className="bg-white text-left rounded-lg p-6 w-full max-w-3xl overflow-auto relative">
            <button className="absolute top-4 right-4 rounded-lg text-teal-300 border border-gray-800 text-semibold bg-gray-800 hover:bg-blue-100 px-4 py-2" onClick={handleCloseFilmModal}>Close</button>
            <h2 className="text-2xl text-center text-semibold text-black font-bold mb-4">{selectedFilm.title}</h2>
            <p><strong>Description:</strong> {selectedFilm.description}</p>
            <p><strong>Release Year:</strong> {selectedFilm.releaseYear}</p>
            <p><strong>Rental Duration:</strong> {selectedFilm.rentalDuration} days</p>
            <p><strong>Rental Rate:</strong> ${selectedFilm.rentalRate}</p>
            <p><strong>Length:</strong> {selectedFilm.length} minutes</p>
            <p><strong>Replacement Cost:</strong> ${selectedFilm.replacementCost}</p>
            <p><strong>Rating:</strong> {selectedFilm.rating}</p>
            <p><strong>Special Features:</strong> {selectedFilm.specialFeatures}</p>
            <p><strong>Actors:</strong> {selectedFilm.filmActors.map((actor) => `${actor.firstName} ${actor.lastName}`).join(', ')}</p>
          </div>
        </div>
      )}

      {/* Actor Details Modal */}
      {selectedActor && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center z-20 p-4">
          <div className="bg-white text-left rounded-lg p-6 w-full max-w-3xl text-center overflow-auto relative">
            <button className="absolute top-4 right-4 rounded-lg text-teal-300 border border-gray-800 text-semibold bg-gray-800 hover:bg-blue-100 px-4 py-2" onClick={handleCloseActorModal}>Close</button>
            <h2 className="text-2xl text-center text-black font-bold mb-4">{selectedActor.firstName} {selectedActor.lastName}</h2>
            <h3 className="text-center text-black font-bold mb-4">Top 5 Rented Films</h3> 
            <ul className="text-semibold">
              {selectedActor.topRentedFilms.map((film) => (
                <li key={film.filmId}>{film.title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageComponent;
