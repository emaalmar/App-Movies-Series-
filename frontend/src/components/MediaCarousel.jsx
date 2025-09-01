import React, { useEffect, useState } from 'react'
import { Carousel } from './Carousel'
import { api } from '../services/api'

// apiUrl should be the TMDB path relative to /api/tmdb, e.g. /discover/movie or /trending/movie/day
export const MediaCarousel = ({ name, apiUrl }) => {
    const [items, setItems] = useState([])

    useEffect(() => {
        const getItems = async () => {
            try {
                const res = await api.get(`/tmdb${apiUrl}`)
                setItems(res.data.results || [])
            } catch (err) {
                console.error('MediaCarousel error', err)
            }
        }
        getItems()
    }, [apiUrl])

    const images = items.map(item => `https://image.tmdb.org/t/p/w500${item.poster_path}`)
    return <Carousel name={name} images={images} />
}