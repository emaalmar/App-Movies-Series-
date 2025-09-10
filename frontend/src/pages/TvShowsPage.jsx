import { MediaCarousel } from "../components/MediaCarousel"
export const TvShowsPage = () => {
    return (
        <>

            <MediaCarousel
                name="Series Populares de Hoy"
                apiUrl="/trending/tv/day"
            />



            <MediaCarousel
                name="Series populares de la Semana"
                apiUrl="/trending/tv/week"
            />
        </>
    )
}
