import React from 'react';
import { Search } from 'lucide-react';

const SearchComponent = ({ search, setSearch }) => {
    return (
        <div className='flex items-center gap-2 mb-4 w-1/3'>
            <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="text-gray-500" />
                </span>
                <input
                    type="text"
                    placeholder="Search by company name"
                    className="text-black border p-2 pl-10 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e)=> setSearch(e.target.value)}
                    value={search}
                />
            </div>
        </div>
    );
};

export default SearchComponent;