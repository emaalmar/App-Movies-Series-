import { MediaCarousel } from "../components/MediaCarousel"
export const TvShows = () => {
    return (
        <>

            <MediaCarousel
                name="Series Populares de Hoy"
                apiUrl="https://api.themoviedb.org/3/trending/tv/day?language=en-US"
                accessToken="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGJhNjQ5NTZhM2Y1NjQ3ZWFiODkwYTgzODI0M2JhMSIsIm5iZiI6MTc1NTkxODQ2My40NzcsInN1YiI6IjY4YTkzMDdmYWRmOGIwNDczZDY2ZmIxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vACG7pdVzu3s3VWJnlic-Q_sNnNvrfxc2KYZ7q9ZDqE"
            />


            <MediaCarousel
                name="Series populares de la Semana"
                apiUrl="https://api.themoviedb.org/3/trending/tv/week?language=en-US"
                accessToken="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGJhNjQ5NTZhM2Y1NjQ3ZWFiODkwYTgzODI0M2JhMSIsIm5iZiI6MTc1NTkxODQ2My40NzcsInN1YiI6IjY4YTkzMDdmYWRmOGIwNDczZDY2ZmIxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vACG7pdVzu3s3VWJnlic-Q_sNnNvrfxc2KYZ7q9ZDqE"
            />
        </>
    )
}
