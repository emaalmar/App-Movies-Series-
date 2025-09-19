import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Carousel } from './Carousel'
import { trending, discoverMovie, discoverTv } from '../api/tmdb'

// apiUrl should be the TMDB path relative to /api/tmdb, e.g. /discover/movie or /trending/movie/day
export const MediaCarousel = ({ name, apiUrl }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const getItems = async () => {
      try {
        let data
        if (apiUrl.startsWith('/discover/movie')) data = await discoverMovie()
        else if (apiUrl.startsWith('/discover/tv')) data = await discoverTv()
        else if (apiUrl.startsWith('/trending')) {
          const parts = apiUrl.split('/').filter(Boolean)
          const media = parts[1] || 'movie'
          const period = parts[2] || 'day'
          data = await trending(media, period)
        } else {
          data = await trending()
        }
        setItems(data.results || [])
      } catch (err) {
        console.error('MediaCarousel error', err)
      }
    }
    getItems()
  }, [apiUrl])

  const images = useMemo(() => items.map(item => `https://image.tmdb.org/t/p/w500${item.poster_path}`), [items])

  // Memoizar el renderizado del carrusel
  const renderCarousel = useCallback(() => (
    <Carousel name={name} images={images} />
  ), [name, images])

  return renderCarousel()
}
