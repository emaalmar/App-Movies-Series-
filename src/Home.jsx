import { MediaCarousel } from "./MediaCarousel";

export const Home = () => {
    return (
        <>
            <MediaCarousel
                name="Películas"
                apiUrl="https://api.themoviedb.org/3/discover/movie"
                accessToken="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGJhNjQ5NTZhM2Y1NjQ3ZWFiODkwYTgzODI0M2JhMSIsIm5iZiI6MTc1NTkxODQ2My40NzcsInN1YiI6IjY4YTkzMDdmYWRmOGIwNDczZDY2ZmIxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vACG7pdVzu3s3VWJnlic-Q_sNnNvrfxc2KYZ7q9ZDqE"
            />


            <MediaCarousel
                name="Series"
                apiUrl="https://api.themoviedb.org/3/discover/tv"
                accessToken="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGJhNjQ5NTZhM2Y1NjQ3ZWFiODkwYTgzODI0M2JhMSIsIm5iZiI6MTc1NTkxODQ2My40NzcsInN1YiI6IjY4YTkzMDdmYWRmOGIwNDczZDY2ZmIxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vACG7pdVzu3s3VWJnlic-Q_sNnNvrfxc2KYZ7q9ZDqE"
            />
        </>
    );
};
