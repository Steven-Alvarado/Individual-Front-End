import React from 'react';
import  Player  from 'lottie-react'; // Correct import for Player
import animationData from '../assets/Animation - 1727534153149.json'; // Ensure the path is correct

const ListFilmComponent = () => {
    const dummyData = [
        { id: 1, title: "Donnie Darko", imageUrl: "https://via.placeholder.com/150" },
        { id: 2, title: "Juno", imageUrl: "https://via.placeholder.com/150" },
        { id: 3, title: "Alice In Wonderland", imageUrl: "https://via.placeholder.com/150" },
        { id: 4, title: "Inception", imageUrl: "https://via.placeholder.com/150" },
        { id: 5, title: "The Matrix", imageUrl: "https://via.placeholder.com/150" }
    ];

    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className="bg-slate-600 shadow-lg text-white w-full p-4">
                <h1 className="text-3xl mb-4 text-center">Top 5 Films</h1>
                <div className="grid grid-cols-5 gap-4">
                    {dummyData.map(film => (
                        <div 
                            key={film.id} 
                            className="relative bg-blue-600 rounded-lg shadow hover:scale-105 transition-transform duration-200 ease-in-out flex flex-col w-full"
                        >
                            <Player 
                                autoplay 
                                loop 
                                animationData={animationData} 
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem' }} 
                            />
                            <div className="flex-grow flex items-center justify-center h-20"> {/* Adjust height for title area */}
                                <div className="text-center">{film.title}</div>
                            </div>
                            <button className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded opacity-0 hover:opacity-100 transition-oblupacity duration-200 ease-in-out">
                                Show Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListFilmComponent;

