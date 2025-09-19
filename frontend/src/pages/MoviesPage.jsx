import { MediaCarousel } from '../components/MediaCarousel'
export const MoviesPage = () => {
  return (
    <>

      <MediaCarousel
        name='Películas populares de Hoy'
        apiUrl='/trending/movie/day'
      />

      <MediaCarousel
        name='Películas populares de la Semana'
        apiUrl='/trending/movie/week'
      />
    </>
  )
}
