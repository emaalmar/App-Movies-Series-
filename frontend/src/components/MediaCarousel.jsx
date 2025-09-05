import React, { useEffect, useState } from 'react'
import { Carousel } from './Carousel'
import { trending, discoverMovie, discoverTv } from '../api/tmdb'

// apiUrl should be the TMDB path relative to /api/tmdb, e.g. /discover/movie or /trending/movie/day
export const MediaCarousel = ({ name, apiUrl }) => {
    const [items, setItems] = useState([])

    useEffect(() => {
        const getItems = async () => {
            try {
                // apiUrl expected in form /discover/movie or /trending/movie/day
                let data
                if (apiUrl.startsWith('/discover/movie')) data = await discoverMovie()
                else if (apiUrl.startsWith('/discover/tv')) data = await discoverTv()
                else if (apiUrl.startsWith('/trending')) {
                    // example: /trending/movie/day
                    const parts = apiUrl.split('/').filter(Boolean)
                    const media = parts[1] || 'movie'
                    const period = parts[2] || 'day'
                    data = await trending(media, period)
                } else {
                    // fallback: try calling the generic trending route
                    data = await trending()
                }

                setItems(data.results || [])
            } catch (err) {
                console.error('MediaCarousel error', err)
            }
        }
        getItems()
    }, [apiUrl])

    const images = items.map(item => `https://image.tmdb.org/t/p/w500${item.poster_path}`)
    return <Carousel name={name} images={images} />
}