import React, {useEffect, useState} from 'react';
import  Player  from 'lottie-react'; // Correct import for Player
import animationData from '../assets/Animation - 1727534153149.json'; // Ensure the path is correct
import { listTop5Films } from '../services/ListTop5Films';
const ListTop5FilmComponent = () => {

    const [film, setTop5Films] = useState([])

    useEffect(() => {
        listTop5Films().then((response) => {
            setTop5Films(response.data);
        }).catch(error => {
            console.error(error);  
    })
}, [])

        
     
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className="bg-slate-600 shadow-lg text-white w-full p-4">
                <h1 className="text-3xl mb-4 text-center">Top 5 Films</h1>
                <div className="grid grid-cols-5 gap-4">
                    {film.map(film => (
                        <div 
                            key={film} 
                            className="relative bg-blue-600 rounded-lg shadow hover:scale-105 transition-transform duration-200 ease-in-out flex flex-col w-full"
                        >
                            <Player 
                                autoplay 
                                loop 
                                animationData={animationData} 
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem' }} 
                            />
                            <div className="flex-grow flex items-center justify-center h-20"> {/* Adjust height for title area */}
                                <div className="text-center">{film}</div>
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

export default ListTop5FilmComponent;

