import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CardDisplay = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/data'); 
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data from the server.');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-lg bg-white">
            <h2 className="text-lg font-bold">{item.name}</h2>
            <p className="text-gray-600"><strong>SKU:</strong> {item.sku || 'N/A'}</p>
            <p className="text-gray-600"><strong>Brand:</strong> {item.brand || 'N/A'}</p>
            <p className="text-gray-600"><strong>Short Description:</strong> {item.shortDescription || 'N/A'}</p>
            <p className="text-gray-600"><strong>Long Description:</strong> {item.longDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardDisplay;
