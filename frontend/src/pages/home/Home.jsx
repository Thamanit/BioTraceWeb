import React, { useEffect, useState } from 'react';
import HomeHeader from '../../components/home/HomeHeader';
import SearchComponent from '../../components/home/SearchComponent';
import axios from 'axios';
import CompanyCard from '../../components/company/CompanyCard';
import { toast } from 'react-toastify';
import { getApiURL } from '../../lib/route';

const Home = () => {
    // Todo Code Company Here
    const [companys, setCompanys] = React.useState([]);
    useEffect(()=>{
        axios.get(`${getApiURL()}/companys`)
        .then((response)=>{
            // Todo Code Set Company Here
            setCompanys(response.data);
        })
        .catch((error)=>{
            toast.error('Error Fetching Companies');
        });
    },[]);

    const [search,setSearch] = useState("");

    return (
        <div className="flex flex-col flex-grow text-white p-8 w-full">
            <div className='max-h-[200px]'>
            <HomeHeader />
            </div>
            {/* <div className='flex-grow bg-slate-50 mt-10 rounded-md shadow-inner p-2'>
                <div className='flex justify-between'>
                    <h1 className='tfont-semibold text-black text-md font-bold'>Companies Opening for Job</h1>
                    <SearchComponent search={search} setSearch={setSearch}/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {
                        companys.filter(company=>company?.name?.toLowerCase()?.includes(search.toLowerCase())).map(company=><CompanyCard key={company._id} company={company}/>)
                    }
                </div>
            </div> */}
        </div>
    );
}

export default Home;
