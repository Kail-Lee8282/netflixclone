import {useEffect} from 'react';
import { QueryCache, useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMultiSearch, ISearchResult } from "../api";
import { makeImagePath } from "../util";
import TvShowDetail from '../Component/TvShowDetail';
import MovieDetail from '../Component/MovieDetail';

const Wrapper = styled.div`
    top:100px;
    height: 100px;
    position: relative;
    text-align: center;
    font-weight: bold;
    font-size:24px;
    
`;

const SearchResult = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 50px;
    justify-content: center;
`;

const Poster = styled(motion.img)`
    width: 200px;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    border:1px solid white;
    object-fit: cover;
`;

function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const {scrollY} = useScroll();

    const tvShowMatch = useMatch("/search/tv/:id");
    const movieMatch =  useMatch("/search/movie/:id");

    const keyword = new URLSearchParams(location.search).get("keyword");
    const mutation  = useMutation<ISearchResult>(()=>getMultiSearch(keyword!));

    //const { data: search, isLoading: isSearch  } = useQuery<ISearchResult>(["search"], () => getMultiSearch(keyword!));



    const onPosterClick = (mediaId:number, type:string) =>{
        navigate(`/search/${type}/${mediaId}${location.search}`);
    };
    
    const onMoveTvShowPage= ()=>{
        navigate(`/search${location.search}`);
    };
    console.log(scrollY.get());
    useEffect(()=>{
        mutation.mutate();
    },[keyword]);


    return (
        <Wrapper>
            <span>{keyword} 검색결과</span>

            {mutation.isLoading ?
                <span>
                    Loading
                </span> :
                <SearchResult>

                    {mutation.data?.results.filter(media => media.media_type !== 'person').map(media =>
                        <Poster
                        src={makeImagePath(media.poster_path, "w200")} alt={media.name}
                        whileHover={{scale:1.1}}
                        onClick={()=> onPosterClick(media.id, media.media_type)}
                        >
                        </Poster>
                    )}

                </SearchResult>
            }


            <AnimatePresence>
                        {tvShowMatch ? (
                            <TvShowDetail type="search" 
                            tvShowId={tvShowMatch.params.id} 
                            scrollY={scrollY.get()}
                            onBackPage={onMoveTvShowPage}/>
                        ) : null}

                        {
                            movieMatch?(
                                <MovieDetail type="search"
                                movieId={movieMatch.params.id} 
                                scrollY={scrollY.get()}
                                onBackPage={onMoveTvShowPage}/>
                            ):null
                        }
            </AnimatePresence> 
        </Wrapper>
    )
}

export default Search;