import {useState, useEffect} from 'react';
import { AnimatePresence, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Slider from "../Component/Slider";
import {  useQuery } from '@tanstack/react-query';
import { getAiringTodayTvShow, getOnTheAirTvShows,  getPopularTvShows, getTopRatedTvShows, IGetTvShowsResult } from '../api';
import { makeImagePath } from '../util';
import TvShowDetail from '../Component/TvShowDetail';

const Wrapper = styled.div`
    background-color: black;
    overflow-x: hidden;
`;

const Loader = styled.div`
    height: 20vh;
    display:flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
    height:80vh;
    display: flex;
    flex-direction: column;
    justify-content:center;
    padding:60px;
    background-image:  linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${props => props.bgphoto});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
`;

const Title = styled.h2`
    font-size: 36px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 14px;
    width: 50vw;
    text-indent: 5px;
`;



function Tv(){
    const { scrollY } = useScroll();
    const navigate = useNavigate();
    const tvShowMatch = useMatch("/tv/:tvShowId/:type");
    
//    const location = useLocation();
    // const params = new URLSearchParams(location.search);


    
    const { data, isLoading } = useQuery<IGetTvShowsResult>(["tv", "airingToday"], getAiringTodayTvShow);
    const { data:popularData, isLoading:isPopularLoading } = useQuery<IGetTvShowsResult>(["tv", "popular"], getPopularTvShows);
    const { data: topRated, isLoading: isTopRatedLoading } = useQuery<IGetTvShowsResult>(["tv", "topRated"], getTopRatedTvShows);
    const { data: onTheAir, isLoading: isOntheAir } = useQuery<IGetTvShowsResult>(["tv", "ontheAir"], getOnTheAirTvShows);

    const [index, setIndex] = useState(0);

    const onTvShowClick = (id:number, privateKey:string)=>{
        navigate(`/tv/${id}/${privateKey}`);
    };
    
    const onMoveTvShowPage= ()=>{
        navigate('/tv');
    };

    useEffect(()=>{
        const bannderIdx = Math.floor(Math.random() * 10);
        setIndex(bannderIdx);
    },[]);

    return (
        <Wrapper>
            {isLoading ? <Loader>Loading...</Loader> :
                <>
                {isLoading ? <span>Loading.</span>:
                    
                    <Banner bgphoto={makeImagePath(data?.results[index].backdrop_path || "")}>
                            <Title>{data?.results[index].name}</Title>
                            <Overview>{data?.results[index].overview}</Overview>
                    </Banner>
                }
                
                    <div style={{position:"relative", top:-40, margin:'0 30px'}}>
                        <Slider privateKey="now" title="Airing Today" datas={data?.results}
                        onItemClick={onTvShowClick}/>
                        
                        {isPopularLoading ? <span>Loading</span>:
                           (
                           <Slider privateKey="popular" title="Popular" datas={popularData?.results.sort(
                            (a,b)=>{
                                return b.vote_average -a.vote_average;
                            }
                           )}
                           onItemClick={onTvShowClick}/>   
                           )
                        }

                        {isTopRatedLoading ? <span>Loading</span>:
                        <Slider privateKey="toprated" title="Top Rated" datas={topRated?.results.slice(0,10)} showIndex={true}
                        onItemClick={onTvShowClick}
                        />}
                        { isOntheAir?<span>Loading</span> :
                            <Slider privateKey="ontheair" title="On the air" 
                            datas={onTheAir?.results}
                            onItemClick={onTvShowClick}/> }
                    </div>


                    <AnimatePresence>
                        {tvShowMatch ? (
                            <TvShowDetail type={tvShowMatch.params.type} 
                            tvShowId={tvShowMatch.params.tvShowId} 
                            scrollY={scrollY.get()+100}
                            onBackPage={onMoveTvShowPage}/>
                        ) : null}
                    </AnimatePresence> 
                </>}
        </Wrapper>
    )
}

export default Tv;