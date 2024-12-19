import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CardDisplay = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/product'); 
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch data from the server.');
      console.error(err);
    }
  };
  useEffect(() => {

    fetchData();
  }, []);
  const Refresh = async () => {
   fetchData();
  };

  return (
    <div className="container mx-auto p-4">
      <div className='flex  items-center gap-4 mb-4'>
        <h1 className="text-2xl font-bold ">Product List</h1>
        <button onClick={Refresh} className='bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition duration-300'>Refresh</button>
      </div>


      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-lg bg-white">
            <h2 className="text-lg font-bold">{item.name}</h2>
            <p className="text-gray-600"><strong>SKU:</strong> {item.sku || 'N/A'}</p>
            <p className="text-gray-600"><strong>Brand:</strong> {item.brand || 'N/A'}</p>
            <p className="text-gray-600"><strong>Short Description:</strong> {item.short_description || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardDisplay;