import { useQuery } from "@tanstack/react-query";
import { getSimilarMovies, IGetMoviesResult } from "../api";
import Slider from "../Component/Slider";

interface ISimilarMovieProps{
    movieId:string;
}

function SimilarMovie({movieId}:ISimilarMovieProps){
    
    const {data, isLoading} = useQuery<IGetMoviesResult>([movieId, "similar"], ()=>{ return getSimilarMovies(movieId)});

    return(
        <div style={{overflow:'hidden'}}>
            <Slider privateKey="similar" datas={data?.results} height={150} thumbnailWidth={100}></Slider>
        </div>
    )
}

export default SimilarMovie;