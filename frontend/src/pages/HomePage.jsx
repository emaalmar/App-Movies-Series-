import { MediaCarousel } from "../components/MediaCarousel";

export const HomePage = () => {
    return (
        <>

            <MediaCarousel
                name="Películas"
                apiUrl="/discover/movie"
            />



            <MediaCarousel
                name="Series"
                apiUrl="/discover/tv"
            />

        </>
    );
};
