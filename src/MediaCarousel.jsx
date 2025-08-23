import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Carousel } from './Carousale';

export const MediaCarousel = ({ name, apiUrl, accessToken }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const getItems = async () => {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setItems(response.data.results || []);
        };
        getItems();
    }, [apiUrl, accessToken]);

    const images = items.map(item => `https://image.tmdb.org/t/p/w500${item.poster_path}`);

    return <Carousel name={name} images={images} />;
};