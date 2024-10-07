import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';  
import { Input } from './ui/input';    
import { MoreHorizontal, Popcorn } from 'lucide-react';  
import { listFilms } from '../services/FilmService'; 

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
  originalLanguageId: number | null;
  languageId: number;
}

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

interface FilmFormData {
  title: string;
  genre: string;
}

const ListFilmComponent: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filmsPerPage] = useState(10);  // Pagination size
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFilms, setFilteredFilms] = useState<Film[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);  // For viewing film details
  const [formData, setFormData] = useState<FilmFormData>({
    title: '',
    genre: ''
  });

  // Fetch films when component mounts
  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = () => {
    listFilms()
      .then((response) => {
        setFilms(response.data);
        setFilteredFilms(response.data);  // Show all films initially
      })
      .catch((error) => {
        console.error('Error fetching films:', error);
      });
  };

  // Search function: Filters films based on title, actor, or genre
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const result = films.filter((film) => {
      // Check for title and genre in filmCategories
      const genreMatch = film.filmCategories.some(category => category.categoryName.toLowerCase().includes(query));
      return film.title.toLowerCase().includes(query) || genreMatch;
    });
    setFilteredFilms(result);
    setCurrentPage(1);  // Reset to page 1 after search
  }, [searchQuery, films]);

  // Get films for the current page
  const indexOfLastFilm = currentPage * filmsPerPage;
  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
  const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);

  const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);

  // Handle view details click
  const handleViewDetailsClick = (film: Film) => {
    setCurrentFilm(film);  // Set current film for details
    setShowDetailsModal(true);  // Open modal to show film details
  };

  // Handle pagination change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto py-20 p-4 center">

      {/* Search bar */}
      <div className="mb-4">
        <Input 
          type="text"
          placeholder="Search by title, actor, or genre"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Film Table */}
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full text-left border-collapse">
          <thead>
            <tr className="border">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2 bg-gray-50">Genre</th>
              <th className="px-4 py-2">Rating</th>
              <th className="px-4 py-2 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentFilms.map((film) => (
              <tr key={film.filmId} className="border">
                <td className="px-4 py-2">{film.title}</td>
                <td className="px-4 py-2 bg-gray-50">
                  {film.filmCategories.map(category => category.categoryName).join(', ')}
                </td>
                <td className="px-4 py-2">{film.rating}</td>
                <td className="px-4 py-2 bg-gray-50">
                  {/* View Film Details */}
                  <Button className="mr-1 justify-center items-center bg-white text-black-600 border rounded-lg shadow hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  onClick={() => handleViewDetailsClick(film)}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <Button className="mr-1 justify-center items-center bg-white text-black-600 border rounded-lg shadow hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onClick={() => handleRentFilmClick(film)}>
                    <Popcorn className="h-4 w-4"/>
                  </Button> 


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="justify-center items-center bg-white text-blue-600 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          Previous
        </Button>

        <span>Page {currentPage} of {totalPages}</span>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="justify-center items-center bg-white text-blue-600 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          Next
        </Button>
      </div>

      {/* Film Details Modal */}
{showDetailsModal && currentFilm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 text-left flex justify-center items-center">
    <div className="bg-white p-5 shadow-md rounded">
      <h2 className="text-xl font-semibold text-center mb-4">{currentFilm.title} Details</h2>
      <p><strong>Genres:</strong> {currentFilm.filmCategories.map(category => category.categoryName).join(', ')}</p>
      <p><strong>Release Year:</strong> {currentFilm.releaseYear}</p>
      <p><strong>Rating:</strong> {currentFilm.rating}</p>
      <p><strong>Description:</strong> {currentFilm.description}</p>
      <p><strong>Rental Duration:</strong> {currentFilm.rentalDuration} days</p>
      <p><strong>Rental Rate:</strong> ${currentFilm.rentalRate}</p>
      <p><strong>Length:</strong> {currentFilm.length} minutes</p>
      <p><strong>Replacement Cost:</strong> ${currentFilm.replacementCost}</p>
      <p><strong>Special Features:</strong> {currentFilm.specialFeatures}</p>
      {/* Actors */}
      <p><strong>Actors:</strong> {currentFilm.filmActors.map(actor => `${actor.firstName} ${actor.lastName}`).join(', ')}</p>
      <div className="flex justify-end">
        <Button type="button" onClick={() => setShowDetailsModal(false)} className="mr-2 rounded-lg border hover:bg-blue-100">
          Close
        </Button>
      </div>
    </div>
  </div>
      )}
    </div>
  );
};

export default ListFilmComponent;
